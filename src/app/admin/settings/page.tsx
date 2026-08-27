import { isSignupEnabled, getMotivationalMessages } from "@/lib/app-settings";

import { updateSignupEnabled, updateMotivationalMessages } from "./actions";

export const metadata = {
  title: "ダッシュボード構成 | 管理画面",
};

export default async function AdminSettingsPage() {
  const [signupEnabled, messages] = await Promise.all([isSignupEnabled(), getMotivationalMessages()]);

  return (
    <div className="space-y-8">
      <section className="max-w-xl rounded-xl border border-border bg-surface p-6">
        <h2 className="text-lg font-semibold">サインアップ受付</h2>
        <p className="mt-1 text-sm text-foreground/60">
          停止すると、新規登録ページに「受付を停止しています」と表示され、登録できなくなります。
        </p>
        <form action={updateSignupEnabled} className="mt-4">
          <label className="flex items-center gap-2 text-sm font-medium">
            <input type="checkbox" name="signupEnabled" defaultChecked={signupEnabled} className="h-4 w-4" />
            サインアップ受付を有効にする
          </label>
          <button
            type="submit"
            className="mt-4 rounded-md bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-dark"
          >
            保存する
          </button>
        </form>
      </section>

      <section className="max-w-xl rounded-xl border border-border bg-surface p-6">
        <h2 className="text-lg font-semibold">モチベーションメッセージ</h2>
        <p className="mt-1 text-sm text-foreground/60">
          ダッシュボードに表示されるメッセージのプールです。1行につき1メッセージで入力してください。
        </p>
        <form action={updateMotivationalMessages} className="mt-4">
          <textarea
            name="messages"
            rows={8}
            defaultValue={messages.join("\n")}
            className="w-full rounded-md border border-border px-3 py-2 text-sm"
          />
          <button
            type="submit"
            className="mt-4 rounded-md bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-dark"
          >
            保存する
          </button>
        </form>
      </section>
    </div>
  );
}
