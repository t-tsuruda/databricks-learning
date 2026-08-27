import { ForgotPasswordForm } from "@/components/forgot-password-form";

export const metadata = {
  title: "パスワード再設定 | Databricks学習アプリ",
};

export default function ForgotPasswordPage() {
  return (
    <div className="mx-auto max-w-md px-4 py-12">
      <h1 className="text-2xl font-bold">パスワードをお忘れの方</h1>
      <p className="mt-2 text-sm text-foreground/70">
        登録済みのメールアドレスを入力してください。再設定用のリンクをお送りします。
      </p>
      <ForgotPasswordForm />
    </div>
  );
}
