export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto max-w-5xl px-4 py-6 text-sm text-foreground/60">
        <p>© {new Date().getFullYear()} Databricks学習アプリ（個人開発の学習サービスです）</p>
      </div>
    </footer>
  );
}
