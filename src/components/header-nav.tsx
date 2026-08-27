"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

const AUTHENTICATED_LINKS = [
  { href: "/dashboard", label: "ダッシュボード" },
  { href: "/courses", label: "コース一覧" },
  { href: "/progress", label: "進捗" },
  { href: "/mypage", label: "マイページ" },
];

export function HeaderNav({
  isAuthenticated,
  displayName,
  isAdmin = false,
}: {
  isAuthenticated: boolean;
  displayName: string | null;
  isAdmin?: boolean;
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const links = isAuthenticated
    ? isAdmin
      ? [...AUTHENTICATED_LINKS, { href: "/admin", label: "管理画面" }]
      : AUTHENTICATED_LINKS
    : [];

  return (
    <nav aria-label="メインナビゲーション">
      <button
        type="button"
        className="flex items-center rounded-md border border-border px-3 py-2 text-sm sm:hidden"
        aria-expanded={isMenuOpen}
        aria-controls="mobile-nav-menu"
        onClick={() => setIsMenuOpen((open) => !open)}
      >
        <span className="sr-only">メニューを開閉する</span>
        メニュー
      </button>

      <div className="hidden items-center gap-4 sm:flex">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            aria-current={pathname === link.href ? "page" : undefined}
            className={`text-sm font-medium hover:text-brand ${
              pathname === link.href ? "text-brand" : "text-foreground"
            }`}
          >
            {link.label}
          </Link>
        ))}

        {isAuthenticated ? (
          <div className="flex items-center gap-3 pl-2">
            {displayName ? (
              <span className="text-sm text-foreground/70">{displayName} さん</span>
            ) : null}
            <button
              type="button"
              onClick={() => signOut({ callbackUrl: "/" })}
              className="rounded-md border border-border px-3 py-1.5 text-sm font-medium hover:bg-slate-100"
            >
              ログアウト
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className="rounded-md px-3 py-1.5 text-sm font-medium hover:bg-slate-100"
            >
              ログイン
            </Link>
            <Link
              href="/signup"
              className="rounded-md bg-brand px-3 py-1.5 text-sm font-medium text-white hover:bg-brand-dark"
            >
              無料で始める
            </Link>
          </div>
        )}
      </div>

      {isMenuOpen ? (
        <div
          id="mobile-nav-menu"
          className="absolute left-0 right-0 top-full flex flex-col gap-1 border-b border-border bg-surface px-4 py-3 sm:hidden"
        >
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsMenuOpen(false)}
              className="rounded-md px-2 py-2 text-sm font-medium hover:bg-slate-100"
            >
              {link.label}
            </Link>
          ))}
          {isAuthenticated ? (
            <button
              type="button"
              onClick={() => signOut({ callbackUrl: "/" })}
              className="rounded-md px-2 py-2 text-left text-sm font-medium hover:bg-slate-100"
            >
              ログアウト
            </button>
          ) : (
            <div className="flex flex-col gap-1">
              <Link
                href="/login"
                onClick={() => setIsMenuOpen(false)}
                className="rounded-md px-2 py-2 text-sm font-medium hover:bg-slate-100"
              >
                ログイン
              </Link>
              <Link
                href="/signup"
                onClick={() => setIsMenuOpen(false)}
                className="rounded-md bg-brand px-2 py-2 text-sm font-medium text-white"
              >
                無料で始める
              </Link>
            </div>
          )}
        </div>
      ) : null}
    </nav>
  );
}
