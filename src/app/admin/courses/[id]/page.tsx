import Link from "next/link";
import { notFound } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { CourseForm } from "@/components/admin/course-form";
import { AdminActionForm, AdminSubmitButton } from "@/components/admin/action-form";

import { updateCourse, deleteLesson } from "../actions";

const TYPE_LABEL: Record<string, string> = {
  TEXT: "座学",
  EXERCISE: "ハンズオン",
  QUIZ: "確認問題",
};

export default async function AdminCourseEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const course = await prisma.course.findUnique({
    where: { id },
    include: { lessons: { orderBy: { orderIndex: "asc" } } },
  });

  if (!course) notFound();

  const deleteLessonWithCourse = deleteLesson.bind(null, course.id);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-lg font-semibold">コースを編集</h2>
        <div className="mt-4 max-w-xl rounded-xl border border-border bg-surface p-6">
          <CourseForm
            action={updateCourse}
            courseId={course.id}
            submitLabel="更新する"
            defaultValues={{
              slug: course.slug,
              title: course.title,
              description: course.description,
              missionText: course.missionText,
              level: course.level,
              orderIndex: course.orderIndex,
            }}
          />
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">レッスン一覧</h3>
          <Link
            href={`/admin/courses/${course.id}/lessons/new`}
            className="rounded-md bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-dark"
          >
            + レッスンを追加
          </Link>
        </div>

        <div className="mt-4 overflow-x-auto rounded-xl border border-border bg-surface">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 text-left text-xs text-foreground/60">
              <tr>
                <th className="px-4 py-2">順番</th>
                <th className="px-4 py-2">タイトル</th>
                <th className="px-4 py-2">種別</th>
                <th className="px-4 py-2">操作</th>
              </tr>
            </thead>
            <tbody>
              {course.lessons.map((lesson) => (
                <tr key={lesson.id} className="border-t border-border">
                  <td className="px-4 py-2">{lesson.orderIndex}</td>
                  <td className="px-4 py-2">
                    <Link
                      href={`/admin/courses/${course.id}/lessons/${lesson.id}`}
                      className="font-medium text-brand hover:underline"
                    >
                      {lesson.title}
                    </Link>
                  </td>
                  <td className="px-4 py-2 text-foreground/60">{TYPE_LABEL[lesson.type]}</td>
                  <td className="px-4 py-2">
                    <AdminActionForm action={deleteLessonWithCourse} hidden={{ lessonId: lesson.id }}>
                      <AdminSubmitButton
                        confirmMessage={`「${lesson.title}」を削除します。よろしいですか？`}
                        className="rounded-md border border-red-300 px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50"
                      >
                        削除
                      </AdminSubmitButton>
                    </AdminActionForm>
                  </td>
                </tr>
              ))}
              {course.lessons.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-6 text-center text-foreground/50">
                    まだレッスンがありません。
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
