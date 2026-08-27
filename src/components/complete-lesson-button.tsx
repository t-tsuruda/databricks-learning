"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function CompleteLessonButton({
  lessonId,
  isCompleted,
  nextHref,
  disabled = false,
}: {
  lessonId: string;
  isCompleted: boolean;
  nextHref: string;
  disabled?: boolean;
}) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleComplete = async () => {
    setIsSubmitting(true);
    setError(null);
    try {
      const response = await fetch(`/api/lessons/${lessonId}/complete`, { method: "POST" });
      if (!response.ok) {
        const data = await response.json().catch(() => null);
        setError(data?.error ?? "完了の記録に失敗しました。もう一度お試しください。");
        return;
      }
      router.push(nextHref);
      router.refresh();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <button
        type="button"
        onClick={handleComplete}
        disabled={isSubmitting || disabled}
        className="rounded-md bg-brand px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-dark disabled:opacity-60"
      >
        {isCompleted
          ? isSubmitting
            ? "移動中..."
            : "次のレッスンへ進む"
          : isSubmitting
            ? "記録中..."
            : "このレッスンを完了する"}
      </button>
      {error ? (
        <p role="alert" className="mt-2 text-sm text-red-600">
          {error}
        </p>
      ) : null}
    </div>
  );
}
