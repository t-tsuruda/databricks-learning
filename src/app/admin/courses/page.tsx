import Link from "next/link";

import { prisma } from "@/lib/prisma";
import { AdminActionForm, AdminSubmitButton } from "@/components/admin/action-form";

import { togglePublish, deleteCourse, importCoursesFromCsv } from "./actions";

export const metadata = {
  title: "コース/コンテンツ管理 | 管理画面",
};

export default async function AdminCoursesPage() {
  const courses = await prisma.course.findMany({
    orderBy: [{ level: "asc" }, { orderIndex: "asc" }],
    include: { _count: { select: { lessons: true } } },
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">コース/コンテンツ管理</h2>
        <Link
          href="/admin/courses/new"
          className="rounded-md bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-dark"
        >
          + 新しいコースを作成
        </Link>
      </div>

      <div className="mt-4 rounded-xl border border-border bg-surface p-6">
        <h3 className="text-sm font-semibold">CSV一括インポート/エクスポート</h3>
        <p className="mt-1 text-xs text-foreground/60">
          スラッグが一致するコースは上書き更新、一致しないコースは新規作成されます。
        </p>
        <div className="mt-3 flex flex-wrap gap-4 text-xs">
          <Link href="/admin/courses/csv-template" className="font-medium text-brand hover:underline">
            ひな形CSVをダウンロード
          </Link>
          <Link href="/admin/courses/csv-export" className="font-medium text-brand hover:underline">
            現在のコースをCSVでエクスポート
          </Link>
        </div>
        <AdminActionForm action={importCoursesFromCsv} className="mt-4 flex flex-wrap items-center gap-3">
          <input type="file" name="csvFile" accept=".csv,text/csv" required className="text-sm" />
          <AdminSubmitButton
            pendingChildren="インポート中..."
            className="rounded-md border border-brand px-3 py-1.5 text-xs font-semibold text-brand hover:bg-indigo-50"
          >
            CSVをインポート
          </AdminSubmitButton>
        </AdminActionForm>
      </div>

      <div className="mt-4 overflow-x-auto rounded-xl border border-border bg-surface">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 text-left text-xs text-foreground/60">
            <tr>
              <th className="px-4 py-2">レベル</th>
              <th className="px-4 py-2">タイトル</th>
              <th className="px-4 py-2">スラッグ</th>
              <th className="px-4 py-2">レッスン数</th>
              <th className="px-4 py-2">公開状態</th>
              <th className="px-4 py-2">操作</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course) => (
              <tr key={course.id} className="border-t border-border">
                <td className="px-4 py-2">{course.level}</td>
                <td className="px-4 py-2">
                  <Link href={`/admin/courses/${course.id}`} className="font-medium text-brand hover:underline">
                    {course.title}
                  </Link>
                </td>
                <td className="px-4 py-2 text-foreground/60">{course.slug}</td>
                <td className="px-4 py-2">{course._count.lessons}</td>
                <td className="px-4 py-2">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      course.isPublished ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-foreground/60"
                    }`}
                  >
                    {course.isPublished ? "公開中" : "非公開"}
                  </span>
                </td>
                <td className="px-4 py-2">
                  <div className="flex gap-2">
                    <AdminActionForm action={togglePublish} hidden={{ courseId: course.id }}>
                      <AdminSubmitButton className="rounded-md border border-border px-2 py-1 text-xs font-medium hover:bg-slate-100">
                        {course.isPublished ? "非公開にする" : "公開する"}
                      </AdminSubmitButton>
                    </AdminActionForm>
                    <AdminActionForm action={deleteCourse} hidden={{ courseId: course.id }}>
                      <AdminSubmitButton
                        confirmMessage={`「${course.title}」を削除します。含まれるレッスンや進捗データも削除されます。よろしいですか？`}
                        className="rounded-md border border-red-300 px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50"
                      >
                        削除
                      </AdminSubmitButton>
                    </AdminActionForm>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
