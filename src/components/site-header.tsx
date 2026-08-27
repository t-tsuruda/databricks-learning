import Link from "next/link";

import { auth } from "@/auth";
import { HeaderNav } from "@/components/header-nav";

export async function SiteHeader() {
  const session = await auth();

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-surface/95 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3">
        <Link
          href={session ? "/dashboard" : "/"}
          className="flex items-center gap-2 font-bold text-brand"
        >
          <span
            aria-hidden
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand text-white"
          >
            D
          </span>
          <span className="text-base">Databricks学習</span>
        </Link>

        <HeaderNav
          isAuthenticated={Boolean(session)}
          displayName={session?.user?.name ?? null}
          isAdmin={Boolean(session?.user?.isAdmin)}
        />
      </div>
    </header>
  );
}
