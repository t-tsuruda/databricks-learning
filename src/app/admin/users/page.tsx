import Link from "next/link";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { AdminActionForm, AdminSubmitButton } from "@/components/admin/action-form";

import { toggleAdmin, deleteUser } from "./actions";

export const metadata = {
  title: "アカウント管理 | 管理画面",
};

export default async function AdminUsersPage() {
  const session = await auth();
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: { id: true, email: true, displayName: true, isAdmin: true, createdAt: true },
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">アカウント管理</h2>
          <p className="mt-1 text-sm text-foreground/60">登録ユーザー {users.length} 件</p>
        </div>
        <Link
          href="/admin/users/new"
          className="rounded-md bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-dark"
        >
          + 新しいアカウントを作成
        </Link>
      </div>

      <div className="mt-4 overflow-x-auto rounded-xl border border-border bg-surface">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 text-left text-xs text-foreground/60">
            <tr>
              <th className="px-4 py-2">表示名</th>
              <th className="px-4 py-2">メールアドレス</th>
              <th className="px-4 py-2">権限</th>
              <th className="px-4 py-2">登録日</th>
              <th className="px-4 py-2">操作</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => {
              const isSelf = user.id === session?.user.id;
              return (
                <tr key={user.id} className="border-t border-border align-top">
                  <td className="px-4 py-2">{user.displayName}</td>
                  <td className="px-4 py-2">{user.email}</td>
                  <td className="px-4 py-2">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        user.isAdmin ? "bg-indigo-100 text-brand" : "bg-slate-100 text-foreground/60"
                      }`}
                    >
                      {user.isAdmin ? "管理者" : "一般"}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-foreground/60">
                    {user.createdAt.toLocaleDateString("ja-JP")}
                  </td>
                  <td className="px-4 py-2">
                    <div className="flex gap-2">
                      <AdminActionForm action={toggleAdmin} hidden={{ userId: user.id }}>
                        <AdminSubmitButton
                          disabled={isSelf}
                          className="rounded-md border border-border px-2 py-1 text-xs font-medium hover:bg-slate-100 disabled:opacity-40"
                        >
                          {user.isAdmin ? "管理者を解除" : "管理者にする"}
                        </AdminSubmitButton>
                      </AdminActionForm>
                      <AdminActionForm action={deleteUser} hidden={{ userId: user.id }}>
                        <AdminSubmitButton
                          disabled={isSelf}
                          confirmMessage={`${user.displayName} (${user.email}) を削除します。よろしいですか？`}
                          className="rounded-md border border-red-300 px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50 disabled:opacity-40"
                        >
                          削除
                        </AdminSubmitButton>
                      </AdminActionForm>
                    </div>
                    {isSelf ? <p className="mt-1 text-xs text-foreground/40">自分自身</p> : null}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
