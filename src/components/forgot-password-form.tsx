"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const schema = z.object({
  email: z.string().trim().toLowerCase().email("メールアドレスの形式が正しくありません"),
});
type Input = z.infer<typeof schema>;

export function ForgotPasswordForm() {
  const [message, setMessage] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Input>({ resolver: zodResolver(schema) });

  const onSubmit = handleSubmit(async (values) => {
    setMessage(null);
    const response = await fetch("/api/auth/request-password-reset", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const data = await response.json().catch(() => null);
    setMessage(data?.message ?? "リクエストを受け付けました。");
  });

  return (
    <form onSubmit={onSubmit} noValidate className="mt-8 space-y-4">
      <div>
        <label htmlFor="email" className="block text-sm font-medium">
          メールアドレス
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          className="mt-1 w-full rounded-md border border-border px-3 py-2 text-sm"
          aria-invalid={Boolean(errors.email)}
          {...register("email")}
        />
        {errors.email ? (
          <p role="alert" className="mt-1 text-sm text-red-600">
            {errors.email.message}
          </p>
        ) : null}
      </div>

      {message ? (
        <p role="status" className="rounded-md border border-emerald-300 bg-emerald-50 p-3 text-sm text-emerald-800">
          {message}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-md bg-brand px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-dark disabled:opacity-60"
      >
        {isSubmitting ? "送信中..." : "再設定リンクを送る"}
      </button>
    </form>
  );
}
