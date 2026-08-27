"use client";

import { useState } from "react";

import { LessonQuiz } from "@/components/lesson-quiz";
import { CompleteLessonButton } from "@/components/complete-lesson-button";

type QuizOption = { id: string; label: string };
type QuizData = {
  id: string;
  question: string;
  options: QuizOption[];
  answeredOptionId: string | null;
  wasCorrect: boolean | null;
};

export function LessonQuizzesAndComplete({
  quizzes,
  lessonId,
  isCompleted,
  nextHref,
  children,
}: {
  quizzes: QuizData[];
  lessonId: string;
  isCompleted: boolean;
  nextHref: string;
  children?: React.ReactNode;
}) {
  const [results, setResults] = useState<Record<string, boolean | null>>({});

  const allAnsweredCorrectly = quizzes.every((quiz) => results[quiz.id] === true);
  // Already-completed lessons stay unlocked so the learner can still move on
  // (e.g. after revisiting); otherwise every quiz must be answered correctly.
  const canComplete = isCompleted || allAnsweredCorrectly;

  return (
    <div>
      {quizzes.length > 0 ? (
        <section className="mt-8">
          <h2 className="flex items-center gap-2 text-lg font-bold">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand text-sm text-white">
              3
            </span>
            確認する
          </h2>
          <div className="mt-3 space-y-4">
            {quizzes.map((quiz) => (
              <LessonQuiz
                key={quiz.id}
                quiz={quiz}
                onResult={(isCorrect) => setResults((prev) => ({ ...prev, [quiz.id]: isCorrect }))}
              />
            ))}
          </div>
        </section>
      ) : null}

      {children}

      <div className="mt-8">
        {!canComplete ? (
          <p className="mb-2 text-sm text-foreground/60">
            確認問題にすべて正解すると、レッスンを完了できるようになります。
          </p>
        ) : null}
        <CompleteLessonButton
          lessonId={lessonId}
          isCompleted={isCompleted}
          nextHref={nextHref}
          disabled={!canComplete}
        />
      </div>
    </div>
  );
}
