import Link from "next/link";

import { prisma } from "@/lib/prisma";
import { ConfirmSubmitButton } from "@/components/confirm-submit-button";

import { togglePublish, deleteCourse } from "./actions";

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
                    <form action={togglePublish}>
                      <input type="hidden" name="courseId" value={course.id} />
                      <button
                        type="submit"
                        className="rounded-md border border-border px-2 py-1 text-xs font-medium hover:bg-slate-100"
                      >
                        {course.isPublished ? "非公開にする" : "公開する"}
                      </button>
                    </form>
                    <form action={deleteCourse}>
                      <input type="hidden" name="courseId" value={course.id} />
                      <ConfirmSubmitButton
                        confirmMessage={`「${course.title}」を削除します。含まれるレッスンや進捗データも削除されます。よろしいですか？`}
                        className="rounded-md border border-red-300 px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50"
                      >
                        削除
                      </ConfirmSubmitButton>
                    </form>
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
