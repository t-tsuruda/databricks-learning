import { NextResponse } from "next/server";

import { requireAdminSession } from "@/lib/require-admin";
import { serializeCsv } from "@/lib/csv";
import { LESSON_CSV_COLUMNS, LESSON_CSV_EXAMPLE_ROW } from "@/lib/lesson-csv";

export async function GET() {
  await requireAdminSession();

  const csv = serializeCsv([[...LESSON_CSV_COLUMNS], LESSON_CSV_EXAMPLE_ROW]);
  return new NextResponse(`\uFEFF${csv}`, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="lesson-import-template.csv"',
    },
  });
}
