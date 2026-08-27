import Link from "next/link";
import { notFound } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { LessonForm } from "@/components/admin/lesson-form";
import { QuizEditor } from "@/components/admin/quiz-editor";

import { updateLesson, updateLessonQuizzes } from "../../../actions";

export default async function EditLessonPage({
  params,
}: {
  params: Promise<{ id: string; lessonId: string }>;
}) {
  const { id: courseId, lessonId } = await params;

  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
    include: { quizzes: { orderBy: { orderIndex: "asc" }, include: { options: { orderBy: { orderIndex: "asc" } } } } },
  });
  if (!lesson || lesson.courseId !== courseId) notFound();

  const outcomes = safeParseOutcomes(lesson.outcomesJson).join("\n");
  const skillTags = safeParseOutcomes(lesson.skillTagsJson).join(",");
  const referenceLinks = safeParseReferenceLinks(lesson.referenceLinksJson);

  const updateLessonBound = updateLesson.bind(null, courseId, lessonId);
  const updateQuizzesBound = updateLessonQuizzes.bind(null, courseId, lessonId);

  return (
    <div className="space-y-8">
      <div>
        <Link href={`/admin/courses/${courseId}`} className="text-sm font-medium text-brand hover:underline">
          ← コースに戻る
        </Link>
        <h2 className="mt-2 text-lg font-semibold">レッスンを編集</h2>
        <div className="mt-4 max-w-2xl rounded-xl border border-border bg-surface p-6">
          <LessonForm
            action={updateLessonBound}
            submitLabel="更新する"
            defaultValues={{
              slug: lesson.slug,
              title: lesson.title,
              type: lesson.type,
              orderIndex: lesson.orderIndex,
              attentionText: lesson.attentionText,
              relevanceText: lesson.relevanceText,
              lectureContent: lesson.lectureContent,
              exampleContent: lesson.exampleContent,
              handsOnContent: lesson.handsOnContent,
              modelAnswerContent: lesson.modelAnswerContent,
              outcomes,
              relatedJobs: lesson.relatedJobs,
              skillTags,
              referenceLinks,
            }}
          />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold">確認問題</h3>
        <div className="mt-4 max-w-2xl rounded-xl border border-border bg-surface p-6">
          <QuizEditor
            action={updateQuizzesBound}
            initialQuizzes={lesson.quizzes.map((quiz) => ({
              question: quiz.question,
              options: quiz.options.map((option) => ({ label: option.label, isCorrect: option.isCorrect })),
            }))}
          />
        </div>
      </div>
    </div>
  );
}

function safeParseOutcomes(json: string): string[] {
  try {
    const parsed = JSON.parse(json) as unknown;
    return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === "string") : [];
  } catch {
    return [];
  }
}

function safeParseReferenceLinks(json: string): { label: string; url: string }[] {
  try {
    const parsed = JSON.parse(json) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (item): item is { label: string; url: string } =>
        typeof item === "object" &&
        item !== null &&
        typeof (item as { label?: unknown }).label === "string" &&
        typeof (item as { url?: unknown }).url === "string",
    );
  } catch {
    return [];
  }
}
