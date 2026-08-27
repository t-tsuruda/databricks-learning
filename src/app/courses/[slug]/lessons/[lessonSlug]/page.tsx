import { notFound } from "next/navigation";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { MarkdownContent } from "@/components/markdown-content";
import { LessonQuiz } from "@/components/lesson-quiz";
import { CompleteLessonButton } from "@/components/complete-lesson-button";

export default async function LessonDetailPage({
  params,
}: {
  params: Promise<{ slug: string; lessonSlug: string }>;
}) {
  const { slug, lessonSlug } = await params;
  const session = await auth();
  const userId = session!.user.id;

  const course = await prisma.course.findUnique({
    where: { slug },
    include: { lessons: { orderBy: { orderIndex: "asc" } } },
  });
  if (!course) notFound();

  const lesson = course.lessons.find((l) => l.slug === lessonSlug);
  if (!lesson) notFound();

  const [lessonProgress, quizzes, quizAnswers] = await Promise.all([
    prisma.userLessonProgress.findUnique({
      where: { userId_lessonId: { userId, lessonId: lesson.id } },
    }),
    prisma.quiz.findMany({
      where: { lessonId: lesson.id },
      orderBy: { orderIndex: "asc" },
      include: { options: { orderBy: { orderIndex: "asc" } } },
    }),
    prisma.quizAnswer.findMany({
      where: { userId, quiz: { lessonId: lesson.id } },
    }),
  ]);

  const answerByQuizId = new Map(quizAnswers.map((answer) => [answer.quizId, answer]));
  const isCompleted = Boolean(lessonProgress?.isCompleted);
  const outcomes = safeParseOutcomes(lesson.outcomesJson);
  const relatedJobs = lesson.relatedJobs
    .split(",")
    .map((job) => job.trim())
    .filter(Boolean);

  const currentIndex = course.lessons.findIndex((l) => l.id === lesson.id);
  const nextLesson = course.lessons[currentIndex + 1];
  const nextHref = nextLesson
    ? `/courses/${course.slug}/lessons/${nextLesson.slug}`
    : `/courses/${course.slug}`;

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <p className="text-xs font-semibold uppercase tracking-wide text-brand">{course.title}</p>
      <h1 className="mt-1 text-2xl font-bold">{lesson.title}</h1>

      <div className="mt-4 rounded-lg border border-brand/30 bg-indigo-50 p-4 text-sm text-indigo-900">
        {lesson.introText}
      </div>

      <section className="mt-8">
        <h2 className="flex items-center gap-2 text-lg font-bold">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand text-sm text-white">
            1
          </span>
          学ぶ
        </h2>
        <div className="mt-3 rounded-xl border border-border bg-surface p-5">
          <MarkdownContent content={lesson.lectureContent} />
          <h3 className="mt-4 mb-2 text-sm font-semibold text-brand">具体例</h3>
          <MarkdownContent content={lesson.exampleContent} />
        </div>
      </section>

      <section className="mt-8">
        <h2 className="flex items-center gap-2 text-lg font-bold">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand text-sm text-white">
            2
          </span>
          試す
        </h2>
        <div className="mt-3 rounded-xl border border-border bg-surface p-5">
          <MarkdownContent content={lesson.handsOnContent} />
        </div>
      </section>

      {quizzes.length > 0 ? (
        <section className="mt-8">
          <h2 className="flex items-center gap-2 text-lg font-bold">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand text-sm text-white">
              3
            </span>
            確認する
          </h2>
          <div className="mt-3 space-y-4">
            {quizzes.map((quiz) => {
              const answer = answerByQuizId.get(quiz.id);
              return (
                <LessonQuiz
                  key={quiz.id}
                  quiz={{
                    id: quiz.id,
                    question: quiz.question,
                    options: quiz.options.map((option) => ({ id: option.id, label: option.label })),
                    answeredOptionId: answer?.selectedOptionId ?? null,
                    wasCorrect: answer?.isCorrect ?? null,
                  }}
                />
              );
            })}
          </div>
        </section>
      ) : null}

      <section className="mt-8 rounded-xl border border-emerald-300 bg-emerald-50 p-5">
        <h2 className="text-sm font-semibold text-emerald-900">これでできるようになったこと</h2>
        <ul className="mt-2 space-y-1 text-sm text-emerald-800">
          {outcomes.map((outcome) => (
            <li key={outcome}>・{outcome}</li>
          ))}
        </ul>
        {relatedJobs.length > 0 ? (
          <p className="mt-3 text-xs text-emerald-700">
            このスキルが使われる仕事：{relatedJobs.join(" / ")}
          </p>
        ) : null}
      </section>

      <div className="mt-8">
        <CompleteLessonButton lessonId={lesson.id} isCompleted={isCompleted} nextHref={nextHref} />
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
