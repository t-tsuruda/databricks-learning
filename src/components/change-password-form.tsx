"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { passwordSchema } from "@/lib/validation";

const schema = z.object({
  currentPassword: z.string().min(1, "現在のパスワードを入力してください"),
  newPassword: passwordSchema,
});
type Input = z.infer<typeof schema>;

export function ChangePasswordForm() {
  const [serverError, setServerError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<Input>({ resolver: zodResolver(schema) });

  const onSubmit = handleSubmit(async (values) => {
    setServerError(null);
    setSuccess(false);

    const response = await fetch("/api/users/me/password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    if (!response.ok) {
      const data = await response.json().catch(() => null);
      setServerError(data?.error ?? "パスワードの変更に失敗しました。");
      return;
    }

    setSuccess(true);
    reset();
  });

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-4">
      <div>
        <label htmlFor="currentPassword" className="block text-sm font-medium">
          現在のパスワード
        </label>
        <input
          id="currentPassword"
          type="password"
          autoComplete="current-password"
          className="mt-1 w-full rounded-md border border-border px-3 py-2 text-sm"
          aria-invalid={Boolean(errors.currentPassword)}
          {...register("currentPassword")}
        />
        {errors.currentPassword ? (
          <p role="alert" className="mt-1 text-sm text-red-600">
            {errors.currentPassword.message}
          </p>
        ) : null}
      </div>

      <div>
        <label htmlFor="newPassword" className="block text-sm font-medium">
          新しいパスワード
        </label>
        <input
          id="newPassword"
          type="password"
          autoComplete="new-password"
          className="mt-1 w-full rounded-md border border-border px-3 py-2 text-sm"
          aria-invalid={Boolean(errors.newPassword)}
          {...register("newPassword")}
        />
        <p className="mt-1 text-xs text-foreground/60">英字と数字を含む8文字以上</p>
        {errors.newPassword ? (
          <p role="alert" className="mt-1 text-sm text-red-600">
            {errors.newPassword.message}
          </p>
        ) : null}
      </div>

      {serverError ? (
        <p role="alert" className="rounded-md border border-red-300 bg-red-50 p-3 text-sm text-red-700">
          {serverError}
        </p>
      ) : null}
      {success ? (
        <p role="status" className="rounded-md border border-emerald-300 bg-emerald-50 p-3 text-sm text-emerald-800">
          パスワードを変更しました。
        </p>
      ) : null}

      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded-md bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-dark disabled:opacity-60"
      >
        {isSubmitting ? "変更中..." : "パスワードを変更する"}
      </button>
    </form>
  );
}
