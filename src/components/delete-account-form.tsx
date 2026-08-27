"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";

export function DeleteAccountForm() {
  const [isOpen, setIsOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const response = await fetch("/api/users/me", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    if (!response.ok) {
      const data = await response.json().catch(() => null);
      setError(data?.error ?? "退会処理に失敗しました。");
      setIsSubmitting(false);
      return;
    }

    await signOut({ callbackUrl: "/" });
  };

  if (!isOpen) {
    return (
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="text-sm font-medium text-red-600 hover:underline"
      >
        アカウントを削除する
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-3 space-y-3 rounded-lg border border-red-300 bg-red-50 p-4">
      <p className="text-sm text-red-800">
        退会するとすべての学習データが削除され、元に戻せません。確認のためパスワードを入力してください。
      </p>
      <input
        type="password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        placeholder="パスワード"
        autoComplete="current-password"
        required
        className="w-full rounded-md border border-border px-3 py-2 text-sm"
      />
      {error ? (
        <p role="alert" className="text-sm text-red-700">
          {error}
        </p>
      ) : null}
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60"
        >
          {isSubmitting ? "処理中..." : "退会する"}
        </button>
        <button
          type="button"
          onClick={() => setIsOpen(false)}
          className="rounded-md border border-border px-4 py-2 text-sm font-medium hover:bg-slate-100"
        >
          キャンセル
        </button>
      </div>
    </form>
  );
}
