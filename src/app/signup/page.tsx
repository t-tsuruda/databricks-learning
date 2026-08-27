import Link from "next/link";

import { isSignupEnabled } from "@/lib/app-settings";
import { SignupForm } from "@/components/signup-form";

export const metadata = {
  title: "新規登録 | Databricks学習アプリ",
};

export default async function SignupPage() {
  const signupEnabled = await isSignupEnabled();

  return (
    <div className="mx-auto max-w-md px-4 py-12">
      <h1 className="text-2xl font-bold">無料で学習を始める</h1>
      <p className="mt-2 text-sm text-foreground/70">
        最初の1歩は小さくても、あなたはすでにデータの入口に立っています。
      </p>

      {signupEnabled ? (
        <SignupForm />
      ) : (
        <p className="mt-8 rounded-md border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
          現在、新規登録の受付を一時停止しています。しばらくしてから再度お試しください。
        </p>
      )}

      <p className="mt-6 text-sm text-foreground/70">
        すでにアカウントをお持ちの方は{" "}
        <Link href="/login" className="font-medium text-brand hover:underline">
          ログイン
        </Link>
      </p>
    </div>
  );
}
