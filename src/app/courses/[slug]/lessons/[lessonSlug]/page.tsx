import Link from "next/link";
import { notFound } from "next/navigation";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { MarkdownContent } from "@/components/markdown-content";
import { LessonQuizzesAndComplete } from "@/components/lesson-quizzes-and-complete";

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
  const referenceLinks = safeParseReferenceLinks(lesson.referenceLinksJson);
  const relatedJobs = lesson.relatedJobs
    .split(",")
    .map((job) => job.trim())
    .filter(Boolean);

  const currentIndex = course.lessons.findIndex((l) => l.id === lesson.id);
  const prevLesson = currentIndex > 0 ? course.lessons[currentIndex - 1] : undefined;
  const prevHref = prevLesson
    ? `/courses/${course.slug}/lessons/${prevLesson.slug}`
    : `/courses/${course.slug}`;
  const nextLesson = course.lessons[currentIndex + 1];
  const nextHref = nextLesson
    ? `/courses/${course.slug}/lessons/${nextLesson.slug}`
    : `/courses/${course.slug}`;
  const coursePositionPercent =
    course.lessons.length > 0 ? Math.round(((currentIndex + 1) / course.lessons.length) * 100) : 0;

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <p className="text-xs font-semibold uppercase tracking-wide text-brand">{course.title}</p>
      <h1 className="mt-1 text-2xl font-bold">{lesson.questTitle || lesson.title}</h1>
      <p className="mt-1 text-sm text-foreground/60">何を学ぶか：{lesson.title}</p>

      <div className="mt-3">
        <div className="flex justify-between text-xs text-foreground/60">
          <span>コース内の進捗</span>
          <span>
            {currentIndex + 1} / {course.lessons.length}
          </span>
        </div>
        <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
          <div
            className="h-full rounded-full bg-brand transition-all"
            style={{ width: `${coursePositionPercent}%` }}
            role="progressbar"
            aria-valuenow={coursePositionPercent}
            aria-valuemin={0}
            aria-valuemax={100}
          />
        </div>
      </div>

      <Link
        href={prevHref}
        className="mt-3 inline-block text-sm font-medium text-brand hover:underline"
      >
        ← {prevLesson ? "前のクエストに戻る" : "コースに戻る"}
      </Link>

      <section className="mt-8">
        <h2 className="flex items-center gap-2 text-lg font-bold">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand text-sm text-white">
            1
          </span>
          クエスト
        </h2>
        <div className="mt-3 space-y-3 rounded-xl border border-amber-300 bg-amber-50 p-5 text-sm text-amber-900">
          <p>{lesson.attentionText}</p>
          <p className="border-t border-amber-200 pt-3">
            <span className="font-semibold">🎯 このクエストの意味：</span>
            {lesson.relevanceText}
          </p>
        </div>
      </section>

      <section className="mt-8">
        <h2 className="flex items-center gap-2 text-lg font-bold">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand text-sm text-white">
            2
          </span>
          学ぶ
        </h2>
        <div className="mt-3 rounded-xl border border-border bg-surface p-5">
          <MarkdownContent content={lesson.lectureContent} />
          <h3 className="mt-4 mb-2 text-sm font-semibold text-brand">具体例</h3>
          <MarkdownContent content={lesson.exampleContent} />
          {referenceLinks.length > 0 ? (
            <div className="mt-4 border-t border-border pt-4">
              <h3 className="mb-2 text-sm font-semibold text-brand">参考リンク</h3>
              <ul className="space-y-1 text-sm">
                {referenceLinks.map((link) => (
                  <li key={link.url}>
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-brand underline hover:no-underline"
                    >
                      {link.label} ↗
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      </section>

      <section className="mt-8">
        <h2 className="flex items-center gap-2 text-lg font-bold">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand text-sm text-white">
            3
          </span>
          解決する
        </h2>
        <div className="mt-3 rounded-xl border border-border bg-surface p-5">
          <MarkdownContent content={lesson.handsOnContent} />
          {lesson.modelAnswerContent.trim() ? (
            <details className="mt-4 border-t border-border pt-4">
              <summary className="cursor-pointer text-sm font-semibold text-brand hover:underline">
                模範解答を見る
              </summary>
              <div className="mt-3">
                <MarkdownContent content={lesson.modelAnswerContent} />
              </div>
            </details>
          ) : null}
        </div>
      </section>

      <LessonQuizzesAndComplete
        stepNumber={4}
        quizzes={quizzes.map((quiz) => {
          const answer = answerByQuizId.get(quiz.id);
          return {
            id: quiz.id,
            question: quiz.question,
            options: quiz.options.map((option) => ({ id: option.id, label: option.label })),
            answeredOptionId: answer?.selectedOptionId ?? null,
            wasCorrect: answer?.isCorrect ?? null,
          };
        })}
        lessonId={lesson.id}
        isCompleted={isCompleted}
        nextHref={nextHref}
      >
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
      </LessonQuizzesAndComplete>
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
