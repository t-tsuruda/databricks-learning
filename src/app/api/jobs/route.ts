import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { fetchJobListings } from "@/lib/jobs";

export async function GET(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "ログインが必要です。" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const keywords = searchParams.getAll("keyword").filter(Boolean);
  if (keywords.length === 0) {
    return NextResponse.json({ error: "keyword パラメータを指定してください。" }, { status: 400 });
  }

  const result = await fetchJobListings(keywords);
  return NextResponse.json(result);
}
