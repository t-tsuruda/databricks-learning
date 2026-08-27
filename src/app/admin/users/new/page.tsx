import { AdminActionForm, AdminSubmitButton } from "@/components/admin/action-form";

import { createUser } from "../actions";

export const metadata = {
  title: "新しいアカウントを作成 | 管理画面",
};

export default function NewUserPage() {
  return (
    <div>
      <h2 className="text-lg font-semibold">新しいアカウントを作成</h2>
      <div className="mt-4 max-w-md rounded-xl border border-border bg-surface p-6">
        <AdminActionForm action={createUser} className="space-y-4">
          <div>
            <label htmlFor="displayName" className="block text-sm font-medium">
              表示名
            </label>
            <input
              id="displayName"
              name="displayName"
              type="text"
              required
              className="mt-1 w-full rounded-md border border-border px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium">
              メールアドレス
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="mt-1 w-full rounded-md border border-border px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium">
              パスワード
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="mt-1 w-full rounded-md border border-border px-3 py-2 text-sm"
            />
            <p className="mt-1 text-xs text-foreground/60">英字と数字を含む8文字以上</p>
          </div>
          <label className="flex items-center gap-2 text-sm font-medium">
            <input type="checkbox" name="isAdmin" className="h-4 w-4" />
            管理者権限を付与する
          </label>
          <AdminSubmitButton className="rounded-md bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-dark">
            作成する
          </AdminSubmitButton>
        </AdminActionForm>
      </div>
    </div>
  );
}
