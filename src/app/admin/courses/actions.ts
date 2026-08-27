"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import type { LessonType } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/require-admin";
import { parseCsv } from "@/lib/csv";
import type { ActionResult } from "@/components/admin/action-form";

const courseSchema = z.object({
  slug: z
    .string()
    .trim()
    .min(1)
    .regex(/^[a-z0-9-]+$/, "スラッグは半角英小文字・数字・ハイフンのみ使用できます"),
  title: z.string().trim().min(1),
  description: z.string().trim().min(1),
  missionText: z.string().trim().min(1),
  closingColumn: z.string().trim().optional(),
  level: z.coerce.number().int().min(1).max(20),
  orderIndex: z.coerce.number().int().min(0),
});

function buildCourseValues(raw: {
  slug: unknown;
  title: unknown;
  description: unknown;
  missionText: unknown;
  closingColumn?: unknown;
  level: unknown;
  orderIndex: unknown;
}) {
  const parsed = courseSchema.parse(raw);
  return { ...parsed, closingColumn: parsed.closingColumn || "" };
}

function courseValuesFromForm(formData: FormData) {
  return buildCourseValues({
    slug: formData.get("slug"),
    title: formData.get("title"),
    description: formData.get("description"),
    missionText: formData.get("missionText"),
    closingColumn: formData.get("closingColumn") ?? undefined,
    level: formData.get("level"),
    orderIndex: formData.get("orderIndex"),
  });
}

function errorMessage(error: unknown): string {
  if (error instanceof z.ZodError) return error.issues[0]?.message ?? "入力内容を確認してください。";
  if (error instanceof Error) return error.message;
  return "処理中にエラーが発生しました。";
}

export async function createCourse(formData: FormData): Promise<ActionResult> {
  await requireAdminSession();
  let course;
  try {
    const values = courseValuesFromForm(formData);
    course = await prisma.course.create({ data: { ...values, isPublished: false } });
  } catch (error) {
    return { ok: false, message: errorMessage(error) };
  }

  revalidatePath("/admin/courses");
  redirect(`/admin/courses/${course.id}`);
}

export async function updateCourse(formData: FormData): Promise<ActionResult> {
  await requireAdminSession();
  const courseId = String(formData.get("courseId") ?? "");

  try {
    const values = courseValuesFromForm(formData);
    await prisma.course.update({ where: { id: courseId }, data: values });
  } catch (error) {
    return { ok: false, message: errorMessage(error) };
  }

  revalidatePath("/admin/courses");
  revalidatePath(`/admin/courses/${courseId}`);
  return { ok: true, message: "コースを更新しました。" };
}

export async function togglePublish(formData: FormData): Promise<ActionResult> {
  await requireAdminSession();
  const courseId = String(formData.get("courseId") ?? "");
  const course = await prisma.course.findUnique({ where: { id: courseId } });
  if (!course) return { ok: false, message: "コースが見つかりません。" };

  await prisma.course.update({ where: { id: courseId }, data: { isPublished: !course.isPublished } });
  revalidatePath("/admin/courses");
  return { ok: true, message: course.isPublished ? "非公開にしました。" : "公開しました。" };
}

export async function deleteCourse(formData: FormData): Promise<ActionResult> {
  await requireAdminSession();
  const courseId = String(formData.get("courseId") ?? "");

  await prisma.course.delete({ where: { id: courseId } });
  revalidatePath("/admin/courses");
  return { ok: true, message: "コースを削除しました。" };
}

const lessonSchema = z.object({
  slug: z
    .string()
    .trim()
    .min(1)
    .regex(/^[a-z0-9-]+$/, "スラッグは半角英小文字・数字・ハイフンのみ使用できます"),
  title: z.string().trim().min(1),
  questTitle: z.string().trim().optional(),
  type: z.enum(["TEXT", "EXERCISE", "QUIZ"]),
  orderIndex: z.coerce.number().int().min(0),
  attentionText: z.string().trim().min(1),
  relevanceText: z.string().trim().min(1),
  lectureContent: z.string().trim().min(1),
  exampleContent: z.string().trim().min(1),
  handsOnContent: z.string().trim().min(1),
  modelAnswerContent: z.string().trim().optional(),
  outcomes: z.string().trim().min(1),
  relatedJobs: z.string().trim().min(1),
  skillTags: z.string().trim().optional(),
  referenceLinksJson: z.string().trim().optional(),
});

function buildLessonValues(raw: {
  slug: unknown;
  title: unknown;
  questTitle?: unknown;
  type: unknown;
  orderIndex: unknown;
  attentionText: unknown;
  relevanceText: unknown;
  lectureContent: unknown;
  exampleContent: unknown;
  handsOnContent: unknown;
  modelAnswerContent?: unknown;
  outcomes: unknown;
  relatedJobs: unknown;
  skillTags?: unknown;
  referenceLinksJson?: unknown;
}) {
  const parsed = lessonSchema.parse(raw);

  const outcomesJson = JSON.stringify(
    parsed.outcomes
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean),
  );
  const relatedJobs = parsed.relatedJobs
    .split(",")
    .map((job) => job.trim())
    .filter(Boolean)
    .join(",");
  const skillTagsJson = JSON.stringify(
    (parsed.skillTags ?? "")
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean),
  );

  return {
    slug: parsed.slug,
    title: parsed.title,
    questTitle: parsed.questTitle || parsed.title,
    type: parsed.type as LessonType,
    orderIndex: parsed.orderIndex,
    attentionText: parsed.attentionText,
    relevanceText: parsed.relevanceText,
    lectureContent: parsed.lectureContent,
    exampleContent: parsed.exampleContent,
    handsOnContent: parsed.handsOnContent,
    modelAnswerContent: parsed.modelAnswerContent || "",
    outcomesJson,
    relatedJobs,
    skillTagsJson,
    referenceLinksJson: parsed.referenceLinksJson || "[]",
  };
}

function lessonValuesFromForm(formData: FormData) {
  return buildLessonValues({
    slug: formData.get("slug"),
    title: formData.get("title"),
    questTitle: formData.get("questTitle") ?? undefined,
    type: formData.get("type"),
    orderIndex: formData.get("orderIndex"),
    attentionText: formData.get("attentionText"),
    relevanceText: formData.get("relevanceText"),
    lectureContent: formData.get("lectureContent"),
    exampleContent: formData.get("exampleContent"),
    handsOnContent: formData.get("handsOnContent"),
    modelAnswerContent: formData.get("modelAnswerContent") ?? undefined,
    outcomes: formData.get("outcomes"),
    relatedJobs: formData.get("relatedJobs"),
    skillTags: formData.get("skillTags") ?? undefined,
    referenceLinksJson: formData.get("referenceLinksJson") ?? undefined,
  });
}

export async function createLesson(courseId: string, formData: FormData): Promise<ActionResult> {
  await requireAdminSession();
  let lesson;
  try {
    const values = lessonValuesFromForm(formData);
    lesson = await prisma.lesson.create({ data: { ...values, courseId } });
  } catch (error) {
    return { ok: false, message: errorMessage(error) };
  }

  revalidatePath(`/admin/courses/${courseId}`);
  redirect(`/admin/courses/${courseId}/lessons/${lesson.id}`);
}

export async function updateLesson(
  courseId: string,
  lessonId: string,
  formData: FormData,
): Promise<ActionResult> {
  await requireAdminSession();

  try {
    const values = lessonValuesFromForm(formData);
    await prisma.lesson.update({ where: { id: lessonId }, data: values });
  } catch (error) {
    return { ok: false, message: errorMessage(error) };
  }

  revalidatePath(`/admin/courses/${courseId}`);
  revalidatePath(`/admin/courses/${courseId}/lessons/${lessonId}`);
  return { ok: true, message: "レッスンを更新しました。" };
}

export async function deleteLesson(courseId: string, formData: FormData): Promise<ActionResult> {
  await requireAdminSession();
  const lessonId = String(formData.get("lessonId") ?? "");

  await prisma.lesson.delete({ where: { id: lessonId } });
  revalidatePath(`/admin/courses/${courseId}`);
  return { ok: true, message: "レッスンを削除しました。" };
}

const quizOptionSchema = z.object({
  label: z.string().trim().min(1),
  isCorrect: z.boolean(),
});
const quizSchema = z.object({
  question: z.string().trim().min(1),
  options: z.array(quizOptionSchema).min(2),
});
const quizzesSchema = z.array(quizSchema);

export async function updateLessonQuizzes(
  courseId: string,
  lessonId: string,
  formData: FormData,
): Promise<ActionResult> {
  await requireAdminSession();

  const raw = String(formData.get("quizzesJson") ?? "[]");
  try {
    const parsedInput: unknown = JSON.parse(raw);
    const quizzes = quizzesSchema.parse(parsedInput);

    await prisma.$transaction(async (tx) => {
      await tx.quiz.deleteMany({ where: { lessonId } });
      for (let quizIndex = 0; quizIndex < quizzes.length; quizIndex++) {
        const quiz = quizzes[quizIndex];
        await tx.quiz.create({
          data: {
            lessonId,
            question: quiz.question,
            orderIndex: quizIndex,
            options: {
              create: quiz.options.map((option, optionIndex) => ({
                label: option.label,
                isCorrect: option.isCorrect,
                orderIndex: optionIndex,
              })),
            },
          },
        });
      }
    });
  } catch (error) {
    return { ok: false, message: errorMessage(error) };
  }

  revalidatePath(`/admin/courses/${courseId}/lessons/${lessonId}`);
  return { ok: true, message: "確認問題を保存しました。" };
}

const referenceLinksSchema = z.array(z.object({ label: z.string().trim().min(1), url: z.string().trim().min(1) }));

export async function importLessonsFromCsv(courseId: string, formData: FormData): Promise<ActionResult> {
  await requireAdminSession();

  const file = formData.get("csvFile");
  if (!(file instanceof File) || file.size === 0) {
    return { ok: false, message: "CSVファイルを選択してください。" };
  }

  const text = await file.text();
  const rows = parseCsv(text).filter((row) => row.some((cell) => cell.trim() !== ""));
  if (rows.length < 2) {
    return { ok: false, message: "CSVにヘッダー行と1件以上のデータ行が必要です。" };
  }

  const header = rows[0].map((cell) => cell.trim());
  const dataRows = rows.slice(1);

  let createdCount = 0;
  let updatedCount = 0;
  const errors: string[] = [];

  for (let rowIndex = 0; rowIndex < dataRows.length; rowIndex++) {
    const rowNumber = rowIndex + 2; // 1-indexed CSV line number, +1 for the header row
    const cells = dataRows[rowIndex];
    const raw: Record<string, string> = {};
    header.forEach((key, columnIndex) => {
      raw[key] = cells[columnIndex] ?? "";
    });

    try {
      const values = buildLessonValues({
        slug: raw.slug,
        title: raw.title,
        questTitle: raw.questTitle || undefined,
        type: raw.type,
        orderIndex: raw.orderIndex || String(rowIndex),
        attentionText: raw.attentionText,
        relevanceText: raw.relevanceText,
        lectureContent: raw.lectureContent,
        exampleContent: raw.exampleContent,
        handsOnContent: raw.handsOnContent,
        modelAnswerContent: raw.modelAnswerContent || undefined,
        outcomes: raw.outcomes,
        relatedJobs: raw.relatedJobs,
        skillTags: raw.skillTags || undefined,
        referenceLinksJson: raw.referenceLinksJson || undefined,
      });

      if (raw.referenceLinksJson) {
        referenceLinksSchema.parse(JSON.parse(raw.referenceLinksJson) as unknown);
      }
      const quizzes = raw.quizzesJson ? quizzesSchema.parse(JSON.parse(raw.quizzesJson) as unknown) : null;

      const existing = await prisma.lesson.findUnique({
        where: { courseId_slug: { courseId, slug: values.slug } },
        select: { id: true },
      });

      const lesson = await prisma.lesson.upsert({
        where: { courseId_slug: { courseId, slug: values.slug } },
        create: { ...values, courseId },
        update: values,
      });

      if (quizzes) {
        await prisma.$transaction(async (tx) => {
          await tx.quiz.deleteMany({ where: { lessonId: lesson.id } });
          for (let quizIndex = 0; quizIndex < quizzes.length; quizIndex++) {
            const quiz = quizzes[quizIndex];
            await tx.quiz.create({
              data: {
                lessonId: lesson.id,
                question: quiz.question,
                orderIndex: quizIndex,
                options: {
                  create: quiz.options.map((option, optionIndex) => ({
                    label: option.label,
                    isCorrect: option.isCorrect,
                    orderIndex: optionIndex,
                  })),
                },
              },
            });
          }
        });
      }

      if (existing) updatedCount++;
      else createdCount++;
    } catch (error) {
      errors.push(`行${rowNumber}: ${errorMessage(error)}`);
    }
  }

  revalidatePath(`/admin/courses/${courseId}`);

  const summary = `新規${createdCount}件・更新${updatedCount}件のレッスンを反映しました。`;
  if (errors.length > 0) {
    return {
      ok: createdCount + updatedCount > 0,
      message: `${summary}\nエラーが${errors.length}件ありました:\n${errors.join("\n")}`,
    };
  }
  return { ok: true, message: summary };
}

export async function importCoursesFromCsv(formData: FormData): Promise<ActionResult> {
  await requireAdminSession();

  const file = formData.get("csvFile");
  if (!(file instanceof File) || file.size === 0) {
    return { ok: false, message: "CSVファイルを選択してください。" };
  }

  const text = await file.text();
  const rows = parseCsv(text).filter((row) => row.some((cell) => cell.trim() !== ""));
  if (rows.length < 2) {
    return { ok: false, message: "CSVにヘッダー行と1件以上のデータ行が必要です。" };
  }

  const header = rows[0].map((cell) => cell.trim());
  const dataRows = rows.slice(1);

  let createdCount = 0;
  let updatedCount = 0;
  const errors: string[] = [];

  for (let rowIndex = 0; rowIndex < dataRows.length; rowIndex++) {
    const rowNumber = rowIndex + 2; // 1-indexed CSV line number, +1 for the header row
    const cells = dataRows[rowIndex];
    const raw: Record<string, string> = {};
    header.forEach((key, columnIndex) => {
      raw[key] = cells[columnIndex] ?? "";
    });

    try {
      const values = buildCourseValues({
        slug: raw.slug,
        title: raw.title,
        description: raw.description,
        missionText: raw.missionText,
        closingColumn: raw.closingColumn || undefined,
        level: raw.level,
        orderIndex: raw.orderIndex || String(rowIndex),
      });
      const isPublished = raw.isPublished?.trim().toLowerCase() === "true";

      const existing = await prisma.course.findUnique({ where: { slug: values.slug }, select: { id: true } });

      await prisma.course.upsert({
        where: { slug: values.slug },
        create: { ...values, isPublished },
        update: { ...values, isPublished },
      });

      if (existing) updatedCount++;
      else createdCount++;
    } catch (error) {
      errors.push(`行${rowNumber}: ${errorMessage(error)}`);
    }
  }

  revalidatePath("/admin/courses");

  const summary = `新規${createdCount}件・更新${updatedCount}件のコースを反映しました。`;
  if (errors.length > 0) {
    return {
      ok: createdCount + updatedCount > 0,
      message: `${summary}\nエラーが${errors.length}件ありました:\n${errors.join("\n")}`,
    };
  }
  return { ok: true, message: summary };
}
