import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { getProgressSummary } from "@/lib/progress";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "ログインが必要です。" }, { status: 401 });
  }

  const summary = await getProgressSummary(session.user.id);
  return NextResponse.json({ progress: summary });
}
