import { NextResponse } from "next/server";

import { requireAdminSession } from "@/lib/require-admin";
import { serializeCsv } from "@/lib/csv";
import { COURSE_CSV_COLUMNS, COURSE_CSV_EXAMPLE_ROW } from "@/lib/course-csv";

export async function GET() {
  await requireAdminSession();

  const csv = serializeCsv([[...COURSE_CSV_COLUMNS], COURSE_CSV_EXAMPLE_ROW]);
  return new NextResponse(`\uFEFF${csv}`, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="course-import-template.csv"',
    },
  });
}
