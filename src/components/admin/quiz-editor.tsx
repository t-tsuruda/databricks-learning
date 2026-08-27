"use client";

import { useState } from "react";

type QuizOption = { label: string; isCorrect: boolean };
type Quiz = { question: string; options: QuizOption[] };

const EMPTY_OPTION: QuizOption = { label: "", isCorrect: false };
const EMPTY_QUIZ: Quiz = { question: "", options: [{ ...EMPTY_OPTION }, { ...EMPTY_OPTION }, { ...EMPTY_OPTION }] };

export function QuizEditor({
  action,
  initialQuizzes,
}: {
  action: (formData: FormData) => void;
  initialQuizzes: Quiz[];
}) {
  const [quizzes, setQuizzes] = useState<Quiz[]>(
    initialQuizzes.length > 0 ? initialQuizzes : [structuredClone(EMPTY_QUIZ)],
  );

  const updateQuestion = (quizIndex: number, question: string) => {
    setQuizzes((prev) => prev.map((quiz, index) => (index === quizIndex ? { ...quiz, question } : quiz)));
  };

  const updateOptionLabel = (quizIndex: number, optionIndex: number, label: string) => {
    setQuizzes((prev) =>
      prev.map((quiz, index) =>
        index === quizIndex
          ? { ...quiz, options: quiz.options.map((option, oi) => (oi === optionIndex ? { ...option, label } : option)) }
          : quiz,
      ),
    );
  };

  const setCorrectOption = (quizIndex: number, optionIndex: number) => {
    setQuizzes((prev) =>
      prev.map((quiz, index) =>
        index === quizIndex
          ? { ...quiz, options: quiz.options.map((option, oi) => ({ ...option, isCorrect: oi === optionIndex })) }
          : quiz,
      ),
    );
  };

  const addOption = (quizIndex: number) => {
    setQuizzes((prev) =>
      prev.map((quiz, index) => (index === quizIndex ? { ...quiz, options: [...quiz.options, { ...EMPTY_OPTION }] } : quiz)),
    );
  };

  const removeOption = (quizIndex: number, optionIndex: number) => {
    setQuizzes((prev) =>
      prev.map((quiz, index) =>
        index === quizIndex ? { ...quiz, options: quiz.options.filter((_, oi) => oi !== optionIndex) } : quiz,
      ),
    );
  };

  const addQuiz = () => {
    setQuizzes((prev) => [...prev, structuredClone(EMPTY_QUIZ)]);
  };

  const removeQuiz = (quizIndex: number) => {
    setQuizzes((prev) => prev.filter((_, index) => index !== quizIndex));
  };

  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="quizzesJson" value={JSON.stringify(quizzes)} />

      {quizzes.map((quiz, quizIndex) => (
        <fieldset key={quizIndex} className="rounded-lg border border-border bg-background p-4">
          <div className="flex items-start justify-between gap-2">
            <label className="block flex-1 text-sm font-medium">
              問題 {quizIndex + 1}
              <input
                type="text"
                value={quiz.question}
                onChange={(event) => updateQuestion(quizIndex, event.target.value)}
                className="mt-1 w-full rounded-md border border-border px-3 py-2 text-sm"
                placeholder="問題文"
              />
            </label>
            <button
              type="button"
              onClick={() => removeQuiz(quizIndex)}
              className="mt-6 rounded-md border border-red-300 px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50"
            >
              問題を削除
            </button>
          </div>

          <div className="mt-3 space-y-2">
            {quiz.options.map((option, optionIndex) => (
              <div key={optionIndex} className="flex items-center gap-2">
                <input
                  type="radio"
                  name={`correct-${quizIndex}`}
                  checked={option.isCorrect}
                  onChange={() => setCorrectOption(quizIndex, optionIndex)}
                  aria-label={`選択肢${optionIndex + 1}を正解にする`}
                  className="h-4 w-4"
                />
                <input
                  type="text"
                  value={option.label}
                  onChange={(event) => updateOptionLabel(quizIndex, optionIndex, event.target.value)}
                  placeholder={`選択肢${optionIndex + 1}`}
                  className="flex-1 rounded-md border border-border px-3 py-1.5 text-sm"
                />
                <button
                  type="button"
                  onClick={() => removeOption(quizIndex, optionIndex)}
                  disabled={quiz.options.length <= 2}
                  className="rounded-md border border-border px-2 py-1 text-xs hover:bg-slate-100 disabled:opacity-40"
                >
                  削除
                </button>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={() => addOption(quizIndex)}
            className="mt-2 text-xs font-medium text-brand hover:underline"
          >
            + 選択肢を追加
          </button>
        </fieldset>
      ))}

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={addQuiz}
          className="rounded-md border border-border px-3 py-1.5 text-sm font-medium hover:bg-slate-100"
        >
          + 問題を追加
        </button>
        <button
          type="submit"
          className="rounded-md bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-dark"
        >
          確認問題を保存
        </button>
      </div>
    </form>
  );
}
