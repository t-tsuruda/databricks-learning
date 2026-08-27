import Link from "next/link";

import { prisma } from "@/lib/prisma";
import { isSignupEnabled } from "@/lib/app-settings";

export const metadata = {
  title: "管理画面 | Databricks学習アプリ",
};

export default async function AdminOverviewPage() {
  const [userCount, courseCount, lessonCount, publishedCourseCount, signupEnabled] = await Promise.all([
    prisma.user.count(),
    prisma.course.count(),
    prisma.lesson.count(),
    prisma.course.count({ where: { isPublished: true } }),
    isSignupEnabled(),
  ]);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-4">
        <StatCard label="登録ユーザー数" value={userCount} />
        <StatCard label="コース数" value={courseCount} sub={`公開中 ${publishedCourseCount}`} />
        <StatCard label="レッスン数" value={lessonCount} />
        <StatCard label="サインアップ受付" value={signupEnabled ? "有効" : "停止中"} />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Link
          href="/admin/users"
          className="rounded-xl border border-border bg-surface p-5 hover:border-brand"
        >
          <h2 className="font-semibold">アカウント管理</h2>
          <p className="mt-1 text-sm text-foreground/60">ユーザー一覧・管理者権限・退会処理</p>
        </Link>
        <Link
          href="/admin/courses"
          className="rounded-xl border border-border bg-surface p-5 hover:border-brand"
        >
          <h2 className="font-semibold">コース/コンテンツ管理</h2>
          <p className="mt-1 text-sm text-foreground/60">コース・レッスン・確認問題の作成/編集</p>
        </Link>
        <Link
          href="/admin/settings"
          className="rounded-xl border border-border bg-surface p-5 hover:border-brand"
        >
          <h2 className="font-semibold">ダッシュボード構成</h2>
          <p className="mt-1 text-sm text-foreground/60">サインアップ受付・モチベーションメッセージ</p>
        </Link>
      </div>
    </div>
  );
}

function StatCard({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="rounded-xl border border-border bg-surface p-4">
      <p className="text-xs text-foreground/60">{label}</p>
      <p className="mt-1 text-xl font-bold text-brand">{value}</p>
      {sub ? <p className="mt-1 text-xs text-foreground/50">{sub}</p> : null}
    </div>
  );
}
