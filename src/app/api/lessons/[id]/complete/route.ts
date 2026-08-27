import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { recomputeCourseProgress } from "@/lib/progress";
import { isSameOriginRequest } from "@/lib/csrf";

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  if (!isSameOriginRequest(request)) {
    return NextResponse.json({ error: "不正なリクエストです。" }, { status: 403 });
  }

  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "ログインが必要です。" }, { status: 401 });
  }

  const { id: lessonId } = await context.params;
  const lesson = await prisma.lesson.findUnique({ where: { id: lessonId } });
  if (!lesson) {
    return NextResponse.json({ error: "レッスンが見つかりません。" }, { status: 404 });
  }

  const userId = session.user.id;

  const quizzes = await prisma.quiz.findMany({ where: { lessonId }, select: { id: true } });
  if (quizzes.length > 0) {
    const correctAnswerCount = await prisma.quizAnswer.count({
      where: { userId, quizId: { in: quizzes.map((quiz) => quiz.id) }, isCorrect: true },
    });
    if (correctAnswerCount < quizzes.length) {
      return NextResponse.json(
        { error: "確認問題にすべて正解してから完了してください。" },
        { status: 400 },
      );
    }
  }

  await prisma.userLessonProgress.upsert({
    where: { userId_lessonId: { userId, lessonId } },
    create: { userId, lessonId, isCompleted: true, completedAt: new Date() },
    update: { isCompleted: true, completedAt: new Date() },
  });

  await recomputeCourseProgress(userId, lesson.courseId);

  return NextResponse.json({ ok: true });
}
