import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { DeleteAccountForm } from "@/components/delete-account-form";
import { ChangePasswordForm } from "@/components/change-password-form";

export const metadata = {
  title: "マイページ | Databricks学習アプリ",
};

export default async function MyPage() {
  const session = await auth();
  const user = await prisma.user.findUnique({
    where: { id: session!.user.id },
    select: { email: true, displayName: true, createdAt: true },
  });

  if (!user) return null;

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="text-2xl font-bold">マイページ</h1>

      <section className="mt-6 rounded-xl border border-border bg-surface p-6">
        <dl className="space-y-4 text-sm">
          <div className="flex justify-between border-b border-border pb-3">
            <dt className="text-foreground/60">表示名</dt>
            <dd className="font-medium">{user.displayName}</dd>
          </div>
          <div className="flex justify-between border-b border-border pb-3">
            <dt className="text-foreground/60">メールアドレス</dt>
            <dd className="font-medium">{user.email}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-foreground/60">登録日</dt>
            <dd className="font-medium">{user.createdAt.toLocaleDateString("ja-JP")}</dd>
          </div>
        </dl>
      </section>

      <section className="mt-8 max-w-md">
        <h2 className="text-lg font-semibold">パスワードの変更</h2>
        <div className="mt-3">
          <ChangePasswordForm />
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-lg font-semibold text-red-700">退会</h2>
        <p className="mt-1 text-sm text-foreground/60">
          退会すると学習履歴・進捗を含むすべてのデータが削除されます。
        </p>
        <div className="mt-3">
          <DeleteAccountForm />
        </div>
      </section>
    </div>
  );
}
