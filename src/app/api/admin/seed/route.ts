import { NextResponse } from "next/server";
import { timingSafeEqual } from "node:crypto";

import { prisma } from "@/lib/prisma";
import { seedDatabase } from "@/lib/seed-data";

// One-off / re-runnable admin endpoint to (re)populate the curriculum,
// app settings, and default admin user. Gated by AUTH_SECRET since there
// is no admin UI yet. Safe to call repeatedly: every write is an upsert,
// and the admin user's password is left untouched on conflict.
function isAuthorized(providedToken: string | null): boolean {
  const expected = process.env.AUTH_SECRET;
  if (!expected || !providedToken) return false;

  const provided = Buffer.from(providedToken);
  const secret = Buffer.from(expected);
  if (provided.length !== secret.length) return false;

  return timingSafeEqual(provided, secret);
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");

  if (!isAuthorized(token)) {
    return NextResponse.json({ error: "許可されていません。" }, { status: 401 });
  }

  await seedDatabase(prisma);

  return NextResponse.json({ ok: true, message: "シードデータを投入しました。" });
}
