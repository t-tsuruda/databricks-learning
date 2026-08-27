import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/require-admin";
import { serializeCsv } from "@/lib/csv";
import { COURSE_CSV_COLUMNS } from "@/lib/course-csv";

export async function GET() {
  await requireAdminSession();

  const courses = await prisma.course.findMany({ orderBy: [{ level: "asc" }, { orderIndex: "asc" }] });

  const rows = courses.map((course) => [
    course.slug,
    course.title,
    course.description,
    course.missionText,
    String(course.level),
    String(course.orderIndex),
    course.isPublished ? "true" : "false",
  ]);

  const csv = serializeCsv([[...COURSE_CSV_COLUMNS], ...rows]);
  return new NextResponse(`\uFEFF${csv}`, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="courses.csv"',
    },
  });
}
