import { NextResponse } from "next/server";
import { createHash } from "node:crypto";
import bcrypt from "bcryptjs";

import { prisma } from "@/lib/prisma";
import { passwordSchema } from "@/lib/validation";
import { rateLimit, clientKeyFromRequest } from "@/lib/rate-limit";
import { isSameOriginRequest } from "@/lib/csrf";
import { z } from "zod";

const confirmSchema = z.object({
  token: z.string().min(1),
  password: passwordSchema,
});

export async function POST(request: Request) {
  if (!isSameOriginRequest(request)) {
    return NextResponse.json({ error: "不正なリクエストです。" }, { status: 403 });
  }

  const key = clientKeyFromRequest(request, "password-reset-confirm");
  const { allowed } = rateLimit(key, 10, 10 * 60 * 1000);
  if (!allowed) {
    return NextResponse.json(
      { error: "試行回数が多すぎます。しばらくしてから再度お試しください。" },
      { status: 429 },
    );
  }

  const body = await request.json().catch(() => null);
  const parsed = confirmSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "入力内容を確認してください。" },
      { status: 400 },
    );
  }

  const tokenHash = createHash("sha256").update(parsed.data.token).digest("hex");
  const resetToken = await prisma.passwordResetToken.findUnique({ where: { tokenHash } });

  if (!resetToken || resetToken.usedAt || resetToken.expiresAt < new Date()) {
    return NextResponse.json(
      { error: "リンクの有効期限が切れているか、無効です。再度パスワード再設定を申請してください。" },
      { status: 400 },
    );
  }

  const passwordHash = await bcrypt.hash(parsed.data.password, 10);

  await prisma.$transaction([
    prisma.user.update({
      where: { id: resetToken.userId },
      data: { passwordHash },
    }),
    prisma.passwordResetToken.update({
      where: { id: resetToken.id },
      data: { usedAt: new Date() },
    }),
  ]);

  return NextResponse.json({ ok: true });
}
