import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { passwordSchema } from "@/lib/validation";
import { isSameOriginRequest } from "@/lib/csrf";
import { rateLimit, clientKeyFromRequest } from "@/lib/rate-limit";

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: passwordSchema,
});

export async function POST(request: Request) {
  if (!isSameOriginRequest(request)) {
    return NextResponse.json({ error: "不正なリクエストです。" }, { status: 403 });
  }

  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "ログインが必要です。" }, { status: 401 });
  }

  const key = clientKeyFromRequest(request, "change-password");
  const { allowed } = rateLimit(key, 10, 10 * 60 * 1000);
  if (!allowed) {
    return NextResponse.json(
      { error: "試行回数が多すぎます。しばらくしてから再度お試しください。" },
      { status: 429 },
    );
  }

  const body = await request.json().catch(() => null);
  const parsed = changePasswordSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "入力内容を確認してください。" },
      { status: 400 },
    );
  }

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user) {
    return NextResponse.json({ error: "ユーザーが見つかりません。" }, { status: 404 });
  }

  const isValidPassword = await bcrypt.compare(parsed.data.currentPassword, user.passwordHash);
  if (!isValidPassword) {
    return NextResponse.json({ error: "現在のパスワードが正しくありません。" }, { status: 403 });
  }

  const passwordHash = await bcrypt.hash(parsed.data.newPassword, 10);
  await prisma.user.update({ where: { id: user.id }, data: { passwordHash } });

  return NextResponse.json({ ok: true });
}
