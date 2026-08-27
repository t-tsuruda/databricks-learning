import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export async function GET() {
  const courses = await prisma.course.findMany({
    where: { isPublished: true },
    orderBy: [{ level: "asc" }, { orderIndex: "asc" }],
    select: {
      id: true,
      slug: true,
      title: true,
      description: true,
      level: true,
      orderIndex: true,
    },
  });

  return NextResponse.json({ courses });
}
