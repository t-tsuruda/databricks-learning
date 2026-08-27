import Link from "next/link";

import { auth } from "@/auth";
import { getProgressSummary } from "@/lib/progress";
import { getLevelInfo } from "@/lib/skill-levels";

export const metadata = {
  title: "コース一覧 | Databricks学習アプリ",
};

const STATUS_LABEL: Record<string, string> = {
  NOT_STARTED: "未着手",
  IN_PROGRESS: "学習中",
  COMPLETED: "完了",
};

export default async function CoursesPage() {
  const session = await auth();
  const summary = await getProgressSummary(session!.user.id);

  const coursesByLevel = new Map<number, typeof summary.courses>();
  for (const course of summary.courses) {
    const list = coursesByLevel.get(course.level) ?? [];
    list.push(course);
    coursesByLevel.set(course.level, list);
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-2xl font-bold">コース一覧</h1>
      <p className="mt-2 text-sm text-foreground/70">
        データ基礎からDatabricks応用まで、レベル順に学習を進めましょう。
      </p>

      <div className="mt-8 space-y-10">
        {Array.from(coursesByLevel.entries())
          .sort(([a], [b]) => a - b)
          .map(([level, courses]) => (
            <section key={level}>
              <h2 className="text-lg font-semibold">{getLevelInfo(level).name}</h2>
              <p className="text-sm text-foreground/60">{getLevelInfo(level).description}</p>

              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                {courses.map((course) => (
                  <Link
                    key={course.id}
                    href={`/courses/${course.slug}`}
                    className="block rounded-xl border border-border bg-surface p-5 transition hover:border-brand hover:shadow-sm"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-semibold">{course.title}</h3>
                      <span
                        className={`flex-none rounded-full px-2 py-0.5 text-xs font-medium ${
                          course.status === "COMPLETED"
                            ? "bg-emerald-100 text-emerald-800"
                            : course.status === "IN_PROGRESS"
                              ? "bg-indigo-100 text-brand"
                              : "bg-slate-100 text-foreground/60"
                        }`}
                      >
                        {STATUS_LABEL[course.status]}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-foreground/70">{course.description}</p>

                    <div className="mt-4">
                      <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
                        <div
                          className="h-full rounded-full bg-brand"
                          style={{ width: `${course.percent}%` }}
                        />
                      </div>
                      <p className="mt-1 text-xs text-foreground/60">
                        {course.completedLessons} / {course.totalLessons} レッスン完了
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          ))}
      </div>
    </div>
  );
}
