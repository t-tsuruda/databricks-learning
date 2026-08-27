import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

import { prisma } from "@/lib/prisma";
import { signupSchema } from "@/lib/validation";
import { isSignupEnabled } from "@/lib/app-settings";
import { rateLimit, clientKeyFromRequest } from "@/lib/rate-limit";
import { isSameOriginRequest } from "@/lib/csrf";

export async function POST(request: Request) {
  if (!isSameOriginRequest(request)) {
    return NextResponse.json({ error: "不正なリクエストです。" }, { status: 403 });
  }

  const key = clientKeyFromRequest(request, "signup");
  const { allowed } = rateLimit(key, 5, 10 * 60 * 1000);
  if (!allowed) {
    return NextResponse.json(
      { error: "試行回数が多すぎます。しばらくしてから再度お試しください。" },
      { status: 429 },
    );
  }

  if (!(await isSignupEnabled())) {
    return NextResponse.json(
      { error: "現在、新規登録の受付を停止しています。" },
      { status: 403 },
    );
  }

  const body = await request.json().catch(() => null);
  const parsed = signupSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "入力内容を確認してください。" },
      { status: 400 },
    );
  }

  const { email, password, displayName } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json(
      { error: "このメールアドレスはすでに登録されています。" },
      { status: 409 },
    );
  }

  const passwordHash = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: { email, passwordHash, displayName },
  });

  return NextResponse.json({ ok: true }, { status: 201 });
}
