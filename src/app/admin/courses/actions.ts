"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import type { LessonType } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/require-admin";
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
  level: z.coerce.number().int().min(1).max(20),
  orderIndex: z.coerce.number().int().min(0),
});

function courseValuesFromForm(formData: FormData) {
  return courseSchema.parse({
    slug: formData.get("slug"),
    title: formData.get("title"),
    description: formData.get("description"),
    missionText: formData.get("missionText"),
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
  type: z.enum(["TEXT", "EXERCISE", "QUIZ"]),
  orderIndex: z.coerce.number().int().min(0),
  introText: z.string().trim().min(1),
  lectureContent: z.string().trim().min(1),
  exampleContent: z.string().trim().min(1),
  handsOnContent: z.string().trim().min(1),
  outcomes: z.string().trim().min(1),
  relatedJobs: z.string().trim().min(1),
  referenceLinksJson: z.string().trim().optional(),
});

function lessonValuesFromForm(formData: FormData) {
  const parsed = lessonSchema.parse({
    slug: formData.get("slug"),
    title: formData.get("title"),
    type: formData.get("type"),
    orderIndex: formData.get("orderIndex"),
    introText: formData.get("introText"),
    lectureContent: formData.get("lectureContent"),
    exampleContent: formData.get("exampleContent"),
    handsOnContent: formData.get("handsOnContent"),
    outcomes: formData.get("outcomes"),
    relatedJobs: formData.get("relatedJobs"),
    referenceLinksJson: formData.get("referenceLinksJson") ?? undefined,
  });

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

  return {
    slug: parsed.slug,
    title: parsed.title,
    type: parsed.type as LessonType,
    orderIndex: parsed.orderIndex,
    introText: parsed.introText,
    lectureContent: parsed.lectureContent,
    exampleContent: parsed.exampleContent,
    handsOnContent: parsed.handsOnContent,
    outcomesJson,
    relatedJobs,
    referenceLinksJson: parsed.referenceLinksJson || "[]",
  };
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
