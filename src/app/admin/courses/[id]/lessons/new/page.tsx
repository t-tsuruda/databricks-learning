import { notFound } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { LessonForm } from "@/components/admin/lesson-form";

import { createLesson } from "../../../actions";

export const metadata = {
  title: "新しいレッスンを作成 | 管理画面",
};

export default async function NewLessonPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: courseId } = await params;
  const course = await prisma.course.findUnique({ where: { id: courseId }, select: { title: true } });
  if (!course) notFound();

  const createLessonForCourse = createLesson.bind(null, courseId);

  return (
    <div>
      <h2 className="text-lg font-semibold">「{course.title}」に新しいレッスンを追加</h2>
      <div className="mt-4 max-w-2xl rounded-xl border border-border bg-surface p-6">
        <LessonForm action={createLessonForCourse} submitLabel="作成する" />
      </div>
    </div>
  );
}
