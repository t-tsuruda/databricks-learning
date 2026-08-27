import { ResetPasswordForm } from "@/components/reset-password-form";

export const metadata = {
  title: "新しいパスワードの設定 | Databricks学習アプリ",
};

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;

  return (
    <div className="mx-auto max-w-md px-4 py-12">
      <h1 className="text-2xl font-bold">新しいパスワードを設定</h1>

      {token ? (
        <ResetPasswordForm token={token} />
      ) : (
        <p className="mt-6 rounded-md border border-red-300 bg-red-50 p-4 text-sm text-red-700">
          再設定リンクが正しくありません。メールに記載のリンクから再度アクセスしてください。
        </p>
      )}
    </div>
  );
}
