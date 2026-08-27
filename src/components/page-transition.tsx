"use client";

import { usePathname } from "next/navigation";

// Keying by pathname forces a remount on route change, which re-triggers
// the CSS fade/slide-in animation defined in globals.css (`.page-transition`).
export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div key={pathname} className="page-transition">
      {children}
    </div>
  );
}
