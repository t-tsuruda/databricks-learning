import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;

  const course = await prisma.course.findFirst({
    where: { OR: [{ id }, { slug: id }], isPublished: true },
    select: { id: true },
  });

  if (!course) {
    return NextResponse.json({ error: "コースが見つかりません。" }, { status: 404 });
  }

  const lessons = await prisma.lesson.findMany({
    where: { courseId: course.id },
    orderBy: { orderIndex: "asc" },
    select: { id: true, slug: true, title: true, type: true, orderIndex: true },
  });

  return NextResponse.json({ lessons });
}
