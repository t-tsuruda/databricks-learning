import Link from "next/link";

import { requireAdminSession } from "@/lib/require-admin";

const NAV_LINKS = [
  { href: "/admin", label: "概要" },
  { href: "/admin/users", label: "アカウント管理" },
  { href: "/admin/courses", label: "コース/コンテンツ管理" },
  { href: "/admin/settings", label: "ダッシュボード構成" },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdminSession();

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">管理画面</h1>
        <Link href="/dashboard" className="text-sm font-medium text-brand hover:underline">
          学習画面に戻る
        </Link>
      </div>

      <nav aria-label="管理メニュー" className="mb-8 flex flex-wrap gap-2 border-b border-border pb-4">
        {NAV_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="rounded-md border border-border px-3 py-1.5 text-sm font-medium hover:bg-slate-100"
          >
            {link.label}
          </Link>
        ))}
      </nav>

      {children}
    </div>
  );
}
