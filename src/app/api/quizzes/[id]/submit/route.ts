import { NextResponse } from "next/server";
import { z } from "zod";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { isSameOriginRequest } from "@/lib/csrf";

const submitSchema = z.object({
  optionId: z.string().min(1),
});

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  if (!isSameOriginRequest(request)) {
    return NextResponse.json({ error: "不正なリクエストです。" }, { status: 403 });
  }

  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "ログインが必要です。" }, { status: 401 });
  }

  const { id: quizId } = await context.params;
  const body = await request.json().catch(() => null);
  const parsed = submitSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "回答内容を確認してください。" }, { status: 400 });
  }

  const quiz = await prisma.quiz.findUnique({
    where: { id: quizId },
    include: { options: true },
  });
  if (!quiz) {
    return NextResponse.json({ error: "問題が見つかりません。" }, { status: 404 });
  }

  const selectedOption = quiz.options.find((option) => option.id === parsed.data.optionId);
  if (!selectedOption) {
    return NextResponse.json({ error: "選択肢が正しくありません。" }, { status: 400 });
  }

  const userId = session.user.id;

  await prisma.quizAnswer.upsert({
    where: { userId_quizId: { userId, quizId } },
    create: {
      userId,
      quizId,
      selectedOptionId: selectedOption.id,
      isCorrect: selectedOption.isCorrect,
    },
    update: {
      selectedOptionId: selectedOption.id,
      isCorrect: selectedOption.isCorrect,
    },
  });

  const correctOption = quiz.options.find((option) => option.isCorrect);

  return NextResponse.json({
    isCorrect: selectedOption.isCorrect,
    correctOptionId: correctOption?.id ?? null,
  });
}
