import Link from "next/link";
import { notFound } from "next/navigation";

import { auth } from "@/auth";
import { getProgressSummary } from "@/lib/progress";
import { getLevelInfo } from "@/lib/skill-levels";

const TYPE_LABEL: Record<string, string> = {
  TEXT: "座学",
  EXERCISE: "ハンズオン",
  QUIZ: "確認問題",
};

export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const session = await auth();
  const summary = await getProgressSummary(session!.user.id);
  const course = summary.courses.find((c) => c.slug === slug);

  if (!course) {
    notFound();
  }

  const levelInfo = getLevelInfo(course.level);
  const firstIncompleteLesson = course.lessons.find((lesson) => !lesson.isCompleted);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <p className="text-xs font-semibold uppercase tracking-wide text-brand">{levelInfo.name}</p>
      <h1 className="mt-1 text-2xl font-bold">{course.title}</h1>
      <p className="mt-2 text-foreground/70">{course.description}</p>

      <div className="mt-4 rounded-lg border border-brand/30 bg-indigo-50 p-4 text-sm text-indigo-900">
        {course.missionText}
      </div>

      <div className="mt-6">
        <div className="flex justify-between text-sm text-foreground/70">
          <span>このコースの進捗</span>
          <span>{course.percent}%</span>
        </div>
        <div className="mt-2 h-3 w-full overflow-hidden rounded-full bg-slate-200">
          <div className="h-full rounded-full bg-brand" style={{ width: `${course.percent}%` }} />
        </div>
      </div>

      {firstIncompleteLesson ? (
        <Link
          href={`/courses/${course.slug}/lessons/${firstIncompleteLesson.slug}`}
          className="mt-6 inline-block rounded-md bg-brand px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-dark"
        >
          {course.completedLessons > 0 ? "続きから学習する" : "学習を始める"}
        </Link>
      ) : (
        <p className="mt-6 rounded-md border border-emerald-300 bg-emerald-50 p-3 text-sm text-emerald-800">
          このコースは完了しました。お疲れさまでした！
        </p>
      )}

      <ol className="mt-8 space-y-2">
        {course.lessons.map((lesson, index) => (
          <li key={lesson.id}>
            <Link
              href={`/courses/${course.slug}/lessons/${lesson.slug}`}
              className="flex items-center gap-3 rounded-lg border border-border bg-surface p-4 hover:border-brand"
            >
              <span
                aria-hidden
                className={`flex h-8 w-8 flex-none items-center justify-center rounded-full text-sm font-semibold ${
                  lesson.isCompleted ? "bg-emerald-500 text-white" : "bg-slate-200 text-foreground/60"
                }`}
              >
                {lesson.isCompleted ? "✓" : index + 1}
              </span>
              <span className="flex-1">
                <span className="block font-medium">{lesson.title}</span>
                <span className="text-xs text-foreground/60">{TYPE_LABEL[lesson.type]}</span>
              </span>
            </Link>
          </li>
        ))}
      </ol>
    </div>
  );
}
