import { NextResponse } from "next/server";
import { randomBytes, createHash } from "node:crypto";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { sendMail } from "@/lib/mailer";
import { rateLimit, clientKeyFromRequest } from "@/lib/rate-limit";
import { isSameOriginRequest } from "@/lib/csrf";

const requestSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
});

const RESET_TOKEN_TTL_MS = 30 * 60 * 1000;

export async function POST(request: Request) {
  if (!isSameOriginRequest(request)) {
    return NextResponse.json({ error: "不正なリクエストです。" }, { status: 403 });
  }

  const key = clientKeyFromRequest(request, "password-reset-request");
  const { allowed } = rateLimit(key, 5, 10 * 60 * 1000);
  if (!allowed) {
    return NextResponse.json(
      { error: "試行回数が多すぎます。しばらくしてから再度お試しください。" },
      { status: 429 },
    );
  }

  const body = await request.json().catch(() => null);
  const parsed = requestSchema.safeParse(body);

  // Always respond with the same generic message, regardless of whether the
  // email exists, to avoid leaking which addresses are registered.
  const genericResponse = NextResponse.json({
    ok: true,
    message: "ご入力のメールアドレス宛にパスワード再設定の案内をお送りしました（登録がある場合）。",
  });

  if (!parsed.success) {
    return genericResponse;
  }

  const user = await prisma.user.findUnique({ where: { email: parsed.data.email } });
  if (!user) {
    return genericResponse;
  }

  const rawToken = randomBytes(32).toString("hex");
  const tokenHash = createHash("sha256").update(rawToken).digest("hex");

  await prisma.passwordResetToken.create({
    data: {
      userId: user.id,
      tokenHash,
      expiresAt: new Date(Date.now() + RESET_TOKEN_TTL_MS),
    },
  });

  const resetUrl = new URL("/reset-password", process.env.NEXTAUTH_URL ?? "http://localhost:3000");
  resetUrl.searchParams.set("token", rawToken);

  await sendMail({
    to: user.email,
    subject: "【Databricks学習アプリ】パスワード再設定のご案内",
    text: `以下のリンクから30分以内にパスワードを再設定してください。\n${resetUrl.toString()}`,
  });

  return genericResponse;
}
