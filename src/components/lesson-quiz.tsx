"use client";

import { useEffect, useState } from "react";

type QuizOption = { id: string; label: string };
type QuizData = {
  id: string;
  question: string;
  options: QuizOption[];
  answeredOptionId: string | null;
  wasCorrect: boolean | null;
};

export function LessonQuiz({
  quiz,
  onResult,
}: {
  quiz: QuizData;
  onResult?: (isCorrect: boolean | null) => void;
}) {
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(quiz.answeredOptionId);
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; correctOptionId: string | null } | null>(
    quiz.wasCorrect !== null && quiz.answeredOptionId
      ? { isCorrect: quiz.wasCorrect, correctOptionId: null }
      : null,
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Report the initial (already-answered) state once on mount.
  useEffect(() => {
    onResult?.(quiz.wasCorrect ?? null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async () => {
    if (!selectedOptionId) return;
    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/quizzes/${quiz.id}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ optionId: selectedOptionId }),
      });
      const data = await response.json();
      if (response.ok) {
        setFeedback({ isCorrect: data.isCorrect, correctOptionId: data.correctOptionId });
        onResult?.(data.isCorrect);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <fieldset className="rounded-lg border border-border bg-background p-4">
      <legend className="px-1 text-sm font-semibold">{quiz.question}</legend>
      <div className="mt-3 space-y-2">
        {quiz.options.map((option) => (
          <label
            key={option.id}
            className={`flex cursor-pointer items-center gap-2 rounded-md border p-2 text-sm ${
              selectedOptionId === option.id ? "border-brand bg-indigo-50" : "border-border"
            }`}
          >
            <input
              type="radio"
              name={`quiz-${quiz.id}`}
              value={option.id}
              checked={selectedOptionId === option.id}
              onChange={() => {
                setSelectedOptionId(option.id);
                setFeedback(null);
                onResult?.(null);
              }}
              className="h-4 w-4"
            />
            {option.label}
          </label>
        ))}
      </div>

      <button
        type="button"
        onClick={handleSubmit}
        disabled={!selectedOptionId || isSubmitting}
        className="mt-3 rounded-md bg-brand px-4 py-1.5 text-sm font-semibold text-white hover:bg-brand-dark disabled:opacity-60"
      >
        {isSubmitting ? "確認中..." : "答え合わせをする"}
      </button>

      {feedback ? (
        <p
          role="status"
          className={`mt-3 rounded-md p-2 text-sm ${
            feedback.isCorrect ? "bg-emerald-50 text-emerald-800" : "bg-amber-50 text-amber-900"
          }`}
        >
          {feedback.isCorrect
            ? "正解です！理解が着実に進んでいます。"
            : "惜しい！もう一度選択肢を見直してみましょう。"}
        </p>
      ) : null}
    </fieldset>
  );
}
