type CourseFormValues = {
  slug: string;
  title: string;
  description: string;
  missionText: string;
  level: number;
  orderIndex: number;
};

export function CourseForm({
  action,
  defaultValues,
  submitLabel,
  courseId,
}: {
  action: (formData: FormData) => void;
  defaultValues?: Partial<CourseFormValues>;
  submitLabel: string;
  courseId?: string;
}) {
  return (
    <form action={action} className="space-y-4">
      {courseId ? <input type="hidden" name="courseId" value={courseId} /> : null}

      <Field label="スラッグ(URL用、半角英数字とハイフン)" name="slug" defaultValue={defaultValues?.slug} />
      <Field label="タイトル" name="title" defaultValue={defaultValues?.title} />
      <TextAreaField label="説明文" name="description" defaultValue={defaultValues?.description} rows={2} />
      <TextAreaField
        label="ミッション文(ARCS: このコースの意義を伝える導入文)"
        name="missionText"
        defaultValue={defaultValues?.missionText}
        rows={2}
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

      <button
        type="submit"
        className="rounded-md bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-dark"
      >
        {submitLabel}
      </button>
    </form>
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
}: {
  label: string;
  name: string;
  defaultValue?: string;
  rows?: number;
}) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium">
        {label}
      </label>
      <textarea
        id={name}
        name={name}
        required
        rows={rows}
        defaultValue={defaultValue}
        className="mt-1 w-full rounded-md border border-border px-3 py-2 text-sm font-mono"
      />
    </div>
  );
}
