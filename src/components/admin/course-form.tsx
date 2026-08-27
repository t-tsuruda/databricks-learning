import { AdminActionForm, AdminSubmitButton, type ActionResult } from "@/components/admin/action-form";

type CourseFormValues = {
  slug: string;
  title: string;
  description: string;
  missionText: string;
  closingColumn: string;
  level: number;
  orderIndex: number;
};

export function CourseForm({
  action,
  defaultValues,
  submitLabel,
  courseId,
}: {
  action: (formData: FormData) => Promise<ActionResult>;
  defaultValues?: Partial<CourseFormValues>;
  submitLabel: string;
  courseId?: string;
}) {
  return (
    <AdminActionForm action={action} hidden={courseId ? { courseId } : undefined} className="space-y-4">
      <Field label="スラッグ(URL用、半角英数字とハイフン)" name="slug" defaultValue={defaultValues?.slug} />
      <Field label="タイトル" name="title" defaultValue={defaultValues?.title} />
      <TextAreaField label="説明文" name="description" defaultValue={defaultValues?.description} rows={2} />
      <TextAreaField
        label="ミッション文(ARCS: このコースの意義を伝える導入文)"
        name="missionText"
        defaultValue={defaultValues?.missionText}
        rows={2}
      />
      <TextAreaField
        label="修了コラム(Markdown・コース完了後に表示。モチベーション維持用, 任意)"
        name="closingColumn"
        defaultValue={defaultValues?.closingColumn}
        rows={6}
        required={false}
      />
      <div className="grid grid-cols-2 gap-4">
        <Field
          label="レベル(1〜)"
          name="level"
          type="number"
          defaultValue={defaultValues?.level?.toString() ?? "1"}
        />
        <Field
          label="表示順"
          name="orderIndex"
          type="number"
          defaultValue={defaultValues?.orderIndex?.toString() ?? "0"}
        />
      </div>

      <AdminSubmitButton className="rounded-md bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-dark">
        {submitLabel}
      </AdminSubmitButton>
    </AdminActionForm>
  );
}

function Field({
  label,
  name,
  type = "text",
  defaultValue,
}: {
  label: string;
  name: string;
  type?: string;
  defaultValue?: string;
}) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required
        defaultValue={defaultValue}
        className="mt-1 w-full rounded-md border border-border px-3 py-2 text-sm"
      />
    </div>
  );
}

function TextAreaField({
  label,
  name,
  defaultValue,
  rows = 4,
  required = true,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  rows?: number;
  required?: boolean;
}) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium">
        {label}
      </label>
      <textarea
        id={name}
        name={name}
        required={required}
        rows={rows}
        defaultValue={defaultValue}
        className="mt-1 w-full rounded-md border border-border px-3 py-2 text-sm font-mono"
      />
    </div>
  );
}
