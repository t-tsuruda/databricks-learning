"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";

export type ActionResult = { ok: boolean; message: string };

const INITIAL_STATE: ActionResult | null = null;

// Wraps a server action so any admin form/button shows an inline
// "保存しました" / error message after submitting, instead of failing
// silently. Pass a plain `(formData) => Promise<ActionResult>` action;
// this adapts it to React's useActionState signature.
export function AdminActionForm({
  action,
  hidden,
  children,
  className,
}: {
  action: (formData: FormData) => Promise<ActionResult>;
  hidden?: Record<string, string>;
  children: React.ReactNode;
  className?: string;
}) {
  const [state, formAction] = useActionState(async (_prevState: ActionResult | null, formData: FormData) => {
    return action(formData);
  }, INITIAL_STATE);

  return (
    <form action={formAction} className={className}>
      {hidden
        ? Object.entries(hidden).map(([key, value]) => <input key={key} type="hidden" name={key} value={value} />)
        : null}
      {children}
      {state ? (
        <p
          role="status"
          className={`mt-2 text-sm ${state.ok ? "text-emerald-700" : "text-red-600"}`}
        >
          {state.message}
        </p>
      ) : null}
    </form>
  );
}

export function AdminSubmitButton({
  children,
  pendingChildren,
  className,
  confirmMessage,
  disabled,
}: {
  children: React.ReactNode;
  pendingChildren?: React.ReactNode;
  className?: string;
  confirmMessage?: string;
  disabled?: boolean;
}) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending || disabled}
      className={className}
      onClick={(event) => {
        if (confirmMessage && !window.confirm(confirmMessage)) {
          event.preventDefault();
        }
      }}
    >
      {pending ? (pendingChildren ?? "処理中...") : children}
    </button>
  );
}
