"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { z } from "zod";

import { passwordSchema } from "@/lib/validation";

const schema = z.object({ password: passwordSchema });
type Input = z.infer<typeof schema>;

export function ResetPasswordForm({ token }: { token: string }) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Input>({ resolver: zodResolver(schema) });

  const onSubmit = handleSubmit(async (values) => {
    setServerError(null);
    const response = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password: values.password }),
    });

    if (!response.ok) {
      const data = await response.json().catch(() => null);
      setServerError(data?.error ?? "再設定に失敗しました。");
      return;
    }

    setDone(true);
    setTimeout(() => router.push("/login"), 1500);
  });

  if (done) {
    return (
      <p role="status" className="mt-8 rounded-md border border-emerald-300 bg-emerald-50 p-4 text-sm text-emerald-800">
        パスワードを更新しました。ログイン画面へ移動します...
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="mt-8 space-y-4">
      <div>
        <label htmlFor="password" className="block text-sm font-medium">
          新しいパスワード
        </label>
        <input
          id="password"
          type="password"
          autoComplete="new-password"
          className="mt-1 w-full rounded-md border border-border px-3 py-2 text-sm"
          aria-invalid={Boolean(errors.password)}
          {...register("password")}
        />
        <p className="mt-1 text-xs text-foreground/60">英字と数字を含む8文字以上</p>
        {errors.password ? (
          <p role="alert" className="mt-1 text-sm text-red-600">
            {errors.password.message}
          </p>
        ) : null}
      </div>

      {serverError ? (
        <p role="alert" className="rounded-md border border-red-300 bg-red-50 p-3 text-sm text-red-700">
          {serverError}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-md bg-brand px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-dark disabled:opacity-60"
      >
        {isSubmitting ? "更新中..." : "パスワードを更新する"}
      </button>
    </form>
  );
}
