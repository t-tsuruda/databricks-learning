import { CourseForm } from "@/components/admin/course-form";

import { createCourse } from "../actions";

export const metadata = {
  title: "新しいコースを作成 | 管理画面",
};

export default function NewCoursePage() {
  return (
    <div>
      <h2 className="text-lg font-semibold">新しいコースを作成</h2>
      <p className="mt-1 text-sm text-foreground/60">
        作成直後は非公開状態です。レッスンを追加してから、一覧画面で「公開する」を押してください。
      </p>
      <div className="mt-4 max-w-xl rounded-xl border border-border bg-surface p-6">
        <CourseForm action={createCourse} submitLabel="作成する" />
      </div>
    </div>
  );
}
