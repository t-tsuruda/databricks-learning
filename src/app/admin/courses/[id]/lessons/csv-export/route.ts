import { NextResponse } from "next/server";
import { notFound } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/require-admin";
import { serializeCsv } from "@/lib/csv";
import { LESSON_CSV_COLUMNS, safeParseOutcomesForCsv } from "@/lib/lesson-csv";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  await requireAdminSession();
  const { id: courseId } = await params;

  const course = await prisma.course.findUnique({
    where: { id: courseId },
    include: {
      lessons: {
        orderBy: { orderIndex: "asc" },
        include: {
          quizzes: {
            orderBy: { orderIndex: "asc" },
            include: { options: { orderBy: { orderIndex: "asc" } } },
          },
        },
      },
    },
  });
  if (!course) notFound();

  const rows = course.lessons.map((lesson) => [
    lesson.slug,
    lesson.title,
    lesson.type,
    String(lesson.orderIndex),
    lesson.attentionText,
    lesson.relevanceText,
    lesson.lectureContent,
    lesson.exampleContent,
    lesson.handsOnContent,
    safeParseOutcomesForCsv(lesson.outcomesJson).join("\n"),
    lesson.relatedJobs,
    lesson.referenceLinksJson,
    JSON.stringify(
      lesson.quizzes.map((quiz) => ({
        question: quiz.question,
        options: quiz.options.map((option) => ({ label: option.label, isCorrect: option.isCorrect })),
      })),
    ),
  ]);

  const csv = serializeCsv([[...LESSON_CSV_COLUMNS], ...rows]);
  return new NextResponse(`\uFEFF${csv}`, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${course.slug}-lessons.csv"`,
    },
  });
}
