import Link from "next/link";

import { LoginForm } from "@/components/login-form";

export const metadata = {
  title: "ログイン | Databricks学習アプリ",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const { callbackUrl } = await searchParams;

  return (
    <div className="mx-auto max-w-md px-4 py-12">
      <h1 className="text-2xl font-bold">おかえりなさい</h1>
      <p className="mt-2 text-sm text-foreground/70">続きから学習を再開しましょう。</p>

      <LoginForm callbackUrl={callbackUrl && callbackUrl.startsWith("/") ? callbackUrl : "/dashboard"} />

      <div className="mt-6 flex flex-col gap-2 text-sm text-foreground/70">
        <Link href="/forgot-password" className="font-medium text-brand hover:underline">
          パスワードをお忘れですか？
        </Link>
        <p>
          アカウントをお持ちでない方は{" "}
          <Link href="/signup" className="font-medium text-brand hover:underline">
            新規登録
          </Link>
        </p>
      </div>
    </div>
  );
}
