import Link from "next/link";

import { prisma } from "@/lib/prisma";
import { LEVEL_INFO } from "@/lib/skill-levels";

export default async function LandingPage() {
  const courses = await prisma.course.findMany({
    where: { isPublished: true },
    orderBy: [{ level: "asc" }, { orderIndex: "asc" }],
    select: { title: true, level: true },
  });

  const coursesByLevel = new Map<number, string[]>();
  for (const course of courses) {
    const list = coursesByLevel.get(course.level) ?? [];
    list.push(course.title);
    coursesByLevel.set(course.level, list);
  }

  return (
    <div>
      {/* Hero: ARCS - Attention */}
      <section className="bg-gradient-to-b from-indigo-50 to-background">
        <div className="mx-auto max-w-5xl px-4 py-16 sm:py-24">
          <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-brand">
            Databricksで、データ基盤エンジニアの入口に立つ
          </p>
          <h1 className="max-w-3xl text-3xl font-bold leading-tight sm:text-5xl">
            「何から学べばいいか分からない」を、
            <br />
            一歩ずつ「できる」に変える学習アプリ
          </h1>
          <p className="mt-6 max-w-2xl text-base text-foreground/70 sm:text-lg">
            データの基礎から、SQL・Python、そしてDatabricksの実践活用まで。
            座学とハンズオンをセットにした学習ステップで、初学者でも挫折せずに前へ進めます。
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/signup"
              className="rounded-md bg-brand px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-brand-dark"
            >
              無料で学習を始める
            </Link>
            <Link
              href="/login"
              className="rounded-md border border-border bg-surface px-6 py-3 text-base font-semibold hover:bg-slate-100"
            >
              ログイン
            </Link>
          </div>
        </div>
      </section>

      {/* Relevance: 学習とキャリアの接続 */}
      <section className="mx-auto max-w-5xl px-4 py-14">
        <h2 className="text-2xl font-bold">学ぶ理由が、いつも見えている</h2>
        <p className="mt-3 max-w-2xl text-foreground/70">
          各レッスンは「なぜ重要か」から始まり、完了後には「このスキルが使われる仕事」を提示します。
          学習が単なる知識の蓄積ではなく、キャリアの進化として積み上がっていきます。
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <ExampleCard
            title="SQL基礎を完了"
            body="Data Analyst / Reporting Analyst / BI Support"
          />
          <ExampleCard
            title="ETL基礎を完了"
            body="Data Engineer Intern / Data Pipeline Assistant"
          />
          <ExampleCard
            title="Databricks基礎を完了"
            body="Junior Data Engineer / Analytics Engineer（初級）"
          />
        </div>
      </section>

      {/* カリキュラムロードマップ */}
      <section className="border-t border-border bg-surface">
        <div className="mx-auto max-w-5xl px-4 py-14">
          <h2 className="text-2xl font-bold">学習ロードマップ</h2>
          <p className="mt-3 max-w-2xl text-foreground/70">
            データエンジニアリングの基礎から、Databricksの応用までを4つのレベルに分けて、無理なく学べます。
          </p>
          <ol className="mt-8 space-y-4">
            {[1, 2, 3, 4].map((level) => (
              <li
                key={level}
                className="flex flex-col gap-2 rounded-xl border border-border bg-background p-5 sm:flex-row sm:items-start sm:gap-6"
              >
                <div className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-brand text-sm font-bold text-white">
                  {level}
                </div>
                <div>
                  <h3 className="font-semibold">{LEVEL_INFO[level].name}</h3>
                  <p className="mt-1 text-sm text-foreground/70">{LEVEL_INFO[level].description}</p>
                  {coursesByLevel.get(level)?.length ? (
                    <p className="mt-2 text-sm text-foreground/60">
                      収録コース：{coursesByLevel.get(level)!.join(" / ")}
                    </p>
                  ) : null}
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 学び方: 学ぶ/試す/確認する */}
      <section className="mx-auto max-w-5xl px-4 py-14">
        <h2 className="text-2xl font-bold">1レッスンの流れ：学ぶ・試す・確認する</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <ExampleCard title="① 学ぶ" body="なぜ重要かの導入と、要点を絞った座学コンテンツで概念を理解します。" />
          <ExampleCard
            title="② 試す"
            body="Databricks Free Editionなど実際の環境で、具体例とハンズオン課題に取り組みます。"
          />
          <ExampleCard title="③ 確認する" body="理解度チェックの小テストで自信を確認し、次の一歩へ進みます。" />
        </div>
      </section>

      {/* Final CTA */}
      <section className="border-t border-border bg-indigo-50">
        <div className="mx-auto max-w-5xl px-4 py-14 text-center">
          <h2 className="text-2xl font-bold">最初の1歩は小さくても、ここから始まります</h2>
          <p className="mt-3 text-foreground/70">今のあなたは、未経験者ではなく「学び始めた人」です。</p>
          <Link
            href="/signup"
            className="mt-6 inline-block rounded-md bg-brand px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-brand-dark"
          >
            無料で学習を始める
          </Link>
        </div>
      </section>
    </div>
  );
}

function ExampleCard({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-xl border border-border bg-surface p-5">
      <h3 className="font-semibold text-brand">{title}</h3>
      <p className="mt-2 text-sm text-foreground/70">{body}</p>
    </div>
  );
}
