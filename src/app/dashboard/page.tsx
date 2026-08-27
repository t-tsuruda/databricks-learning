import Link from "next/link";

import { auth } from "@/auth";
import { getProgressSummary } from "@/lib/progress";
import { pickMotivationalMessage } from "@/lib/app-settings";
import { getLevelInfo, MAX_LEVEL } from "@/lib/skill-levels";
import { fetchJobListings } from "@/lib/jobs";

export const metadata = {
  title: "ダッシュボード | Databricks学習アプリ",
};

export default async function DashboardPage() {
  const session = await auth();
  const userId = session!.user.id;

  const summary = await getProgressSummary(userId);
  const levelInfo = getLevelInfo(summary.currentLevel);
  const motivationalMessage = await pickMotivationalMessage(summary.totalCompleted);

  const jobSearchKeywords = summary.nextLevelJobs.length > 0 ? summary.nextLevelJobs : summary.relatedJobs;
  const jobListings = jobSearchKeywords.length > 0 ? await fetchJobListings(jobSearchKeywords) : null;

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-2xl font-bold">
        {session!.user.name ?? "学習者"} さんのダッシュボード
      </h1>

      {motivationalMessage ? (
        <p className="mt-3 rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-900">
          {motivationalMessage}
        </p>
      ) : null}

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        {/* 現在のレベルと進捗 */}
        <section className="rounded-xl border border-border bg-surface p-6 lg:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-brand">
                現在のレベル（{summary.currentLevel} / {MAX_LEVEL}）
              </p>
              <h2 className="mt-1 text-xl font-bold">{levelInfo.name}</h2>
              <p className="mt-1 text-sm text-foreground/70">{levelInfo.description}</p>
            </div>
          </div>

          <div className="mt-6">
            <div className="flex justify-between text-sm text-foreground/70">
              <span>全体の学習進捗</span>
              <span>{summary.overallPercent}%</span>
            </div>
            <div className="mt-2 h-3 w-full overflow-hidden rounded-full bg-slate-200">
              <div
                className="h-full rounded-full bg-brand transition-all"
                style={{ width: `${summary.overallPercent}%` }}
                role="progressbar"
                aria-valuenow={summary.overallPercent}
                aria-valuemin={0}
                aria-valuemax={100}
              />
            </div>
            <p className="mt-2 text-sm text-foreground/60">
              完了レッスン {summary.totalCompleted} / {summary.totalLessons} ・ 完了コース{" "}
              {summary.completedCoursesCount} / {summary.courses.length}
            </p>
          </div>

          {summary.nextGoal ? (
            <div className="mt-6 rounded-lg border border-brand/30 bg-indigo-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-brand">次の学習目標</p>
              <p className="mt-1 font-semibold">{summary.nextGoal.course.title}</p>
              <p className="text-sm text-foreground/70">{summary.nextGoal.lesson.title}</p>
              <Link
                href={`/courses/${summary.nextGoal.course.slug}/lessons/${summary.nextGoal.lesson.slug}`}
                className="mt-3 inline-block rounded-md bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-dark"
              >
                続きから学習する
              </Link>
            </div>
          ) : (
            <p className="mt-6 rounded-lg border border-emerald-300 bg-emerald-50 p-4 text-sm text-emerald-800">
              公開中のコースをすべて完了しました。新しいコースの追加をお楽しみに。
            </p>
          )}
        </section>

        {/* キャリア視点 */}
        <section className="rounded-xl border border-border bg-surface p-6">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-brand">目指せる役割</h2>
          {summary.relatedJobs.length > 0 ? (
            <>
              <p className="mt-2 text-xs text-foreground/60">これまでの学習で近づいた仕事</p>
              <ul className="mt-2 flex flex-wrap gap-2">
                {summary.relatedJobs.map((job) => (
                  <li
                    key={job}
                    className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-800"
                  >
                    {job}
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <p className="mt-2 text-sm text-foreground/60">レッスンを完了すると、ここに関連する仕事が表示されます。</p>
          )}

          {summary.nextLevelJobs.length > 0 ? (
            <>
              <p className="mt-4 text-xs text-foreground/60">次のレベルで近づく仕事</p>
              <ul className="mt-2 flex flex-wrap gap-2">
                {summary.nextLevelJobs.map((job) => (
                  <li
                    key={job}
                    className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-foreground/70"
                  >
                    {job}
                  </li>
                ))}
              </ul>
            </>
          ) : null}
        </section>
      </div>

      {jobListings ? (
        <section className="mt-6 rounded-xl border border-border bg-surface p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-brand">
              あなたのレベルに近い求人（参考）
            </h2>
            {!jobListings.isLive ? (
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-foreground/50">サンプル表示</span>
            ) : null}
          </div>
          <p className="mt-1 text-xs text-foreground/60">
            キーワード「{jobSearchKeywords[0]}」に関連する求人の参考情報です。応募条件は各求人の掲載元でご確認ください。
          </p>
          <ul className="mt-3 space-y-2">
            {jobListings.jobs.map((job) => (
              <li key={job.url} className="rounded-lg border border-border p-3 text-sm">
                <a
                  href={job.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-brand hover:underline"
                >
                  {job.title} ↗
                </a>
                {job.company || job.location ? (
                  <p className="mt-0.5 text-xs text-foreground/60">
                    {[job.company, job.location].filter(Boolean).join(" ・ ")}
                  </p>
                ) : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        {/* 達成バッジ */}
        <section className="rounded-xl border border-border bg-surface p-6">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-brand">達成バッジ</h2>
          <ul className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
            {summary.badges.map((badge) => (
              <li
                key={badge.id}
                className={`rounded-lg border p-3 text-sm ${
                  badge.achieved
                    ? "border-amber-300 bg-amber-50 text-amber-900"
                    : "border-border bg-slate-50 text-foreground/40"
                }`}
              >
                <p className="font-semibold">
                  {badge.achieved ? "🏆 " : "🔒 "}
                  {badge.label}
                </p>
                <p className="mt-1 text-xs">{badge.description}</p>
              </li>
            ))}
          </ul>
        </section>

        {/* 身についたスキル */}
        <section className="rounded-xl border border-border bg-surface p-6">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-brand">これまでに身につけたスキル</h2>
          {summary.achievedOutcomes.length > 0 ? (
            <ul className="mt-3 space-y-2 text-sm">
              {summary.achievedOutcomes.map((outcome) => (
                <li key={outcome} className="flex gap-2">
                  <span aria-hidden>✔</span>
                  <span>{outcome}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 text-sm text-foreground/60">レッスンを完了すると、ここに表示されます。</p>
          )}
        </section>
      </div>

      <div className="mt-8 text-center">
        <Link href="/courses" className="text-sm font-medium text-brand hover:underline">
          すべてのコースを見る →
        </Link>
      </div>
    </div>
  );
}
