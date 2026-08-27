import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getProgressSummary } from "@/lib/progress";

export const metadata = {
  title: "学習進捗 | Databricks学習アプリ",
};

export default async function ProgressPage() {
  const session = await auth();
  const userId = session!.user.id;

  const [summary, recentHistory] = await Promise.all([
    getProgressSummary(userId),
    prisma.userLessonProgress.findMany({
      where: { userId, isCompleted: true },
      orderBy: { completedAt: "desc" },
      take: 20,
      include: { lesson: { include: { course: true } } },
    }),
  ]);

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-2xl font-bold">学習進捗</h1>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <StatCard label="全体進捗" value={`${summary.overallPercent}%`} />
        <StatCard label="完了レッスン" value={`${summary.totalCompleted} / ${summary.totalLessons}`} />
        <StatCard label="完了コース" value={`${summary.completedCoursesCount} / ${summary.courses.length}`} />
      </div>

      <section className="mt-8">
        <h2 className="text-lg font-semibold">コース別の進捗</h2>
        <div className="mt-3 space-y-3">
          {summary.courses.map((course) => (
            <div key={course.id} className="rounded-lg border border-border bg-surface p-4">
              <div className="flex items-center justify-between">
                <p className="font-medium">{course.title}</p>
                <p className="text-sm text-foreground/60">{course.percent}%</p>
              </div>
              <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-200">
                <div className="h-full rounded-full bg-brand" style={{ width: `${course.percent}%` }} />
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-lg font-semibold">最近の学習履歴</h2>
        {recentHistory.length > 0 ? (
          <ol className="mt-3 space-y-2">
            {recentHistory.map((progress) => (
              <li
                key={progress.id}
                className="flex items-center justify-between rounded-lg border border-border bg-surface p-3 text-sm"
              >
                <div>
                  <p className="font-medium">{progress.lesson.title}</p>
                  <p className="text-xs text-foreground/60">{progress.lesson.course.title}</p>
                </div>
                <time className="text-xs text-foreground/50" dateTime={progress.completedAt?.toISOString()}>
                  {progress.completedAt?.toLocaleDateString("ja-JP")}
                </time>
              </li>
            ))}
          </ol>
        ) : (
          <p className="mt-3 text-sm text-foreground/60">まだ完了したレッスンがありません。</p>
        )}
      </section>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-surface p-4">
      <p className="text-xs text-foreground/60">{label}</p>
      <p className="mt-1 text-xl font-bold text-brand">{value}</p>
    </div>
  );
}
