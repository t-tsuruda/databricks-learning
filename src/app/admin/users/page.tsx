import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { ConfirmSubmitButton } from "@/components/confirm-submit-button";

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
      <h2 className="text-lg font-semibold">アカウント管理</h2>
      <p className="mt-1 text-sm text-foreground/60">登録ユーザー {users.length} 件</p>

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
                <tr key={user.id} className="border-t border-border">
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
                      <form action={toggleAdmin}>
                        <input type="hidden" name="userId" value={user.id} />
                        <button
                          type="submit"
                          disabled={isSelf}
                          className="rounded-md border border-border px-2 py-1 text-xs font-medium hover:bg-slate-100 disabled:opacity-40"
                        >
                          {user.isAdmin ? "管理者を解除" : "管理者にする"}
                        </button>
                      </form>
                      <form action={deleteUser}>
                        <input type="hidden" name="userId" value={user.id} />
                        <ConfirmSubmitButton
                          confirmMessage={`${user.displayName} (${user.email}) を削除します。よろしいですか？`}
                          disabled={isSelf}
                          className="rounded-md border border-red-300 px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50 disabled:opacity-40"
                        >
                          削除
                        </ConfirmSubmitButton>
                      </form>
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
