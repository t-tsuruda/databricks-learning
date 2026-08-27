import { AdminActionForm, AdminSubmitButton, type ActionResult } from "@/components/admin/action-form";
import { ReferenceLinksEditor } from "@/components/admin/reference-links-editor";
import { HandsOnEditor } from "@/components/admin/hands-on-editor";

type LessonFormValues = {
  slug: string;
  title: string;
  type: string;
  orderIndex: number;
  attentionText: string;
  relevanceText: string;
  lectureContent: string;
  exampleContent: string;
  handsOnContent: string;
  outcomes: string;
  relatedJobs: string;
  referenceLinks: { label: string; url: string }[];
};

export function LessonForm({
  action,
  defaultValues,
  submitLabel,
}: {
  action: (formData: FormData) => Promise<ActionResult>;
  defaultValues?: Partial<LessonFormValues>;
  submitLabel: string;
}) {
  return (
    <AdminActionForm action={action} className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Field label="スラッグ" name="slug" defaultValue={defaultValues?.slug} />
        <Field label="タイトル" name="title" defaultValue={defaultValues?.title} />
        <div>
          <label htmlFor="type" className="block text-sm font-medium">
            種別
          </label>
          <select
            id="type"
            name="type"
            defaultValue={defaultValues?.type ?? "TEXT"}
            className="mt-1 w-full rounded-md border border-border px-3 py-2 text-sm"
          >
            <option value="TEXT">座学(TEXT)</option>
            <option value="EXERCISE">ハンズオン(EXERCISE)</option>
            <option value="QUIZ">確認問題(QUIZ)</option>
          </select>
        </div>
      </div>

      <Field
        label="表示順"
        name="orderIndex"
        type="number"
        defaultValue={defaultValues?.orderIndex?.toString() ?? "0"}
      />

      <TextAreaField
        label="注意喚起(Attention：学習者の興味を引く導入)"
        name="attentionText"
        defaultValue={defaultValues?.attentionText}
        rows={2}
      />
      <TextAreaField
        label="関連性(Relevance：学習者自身のゴールとの繋がり)"
        name="relevanceText"
        defaultValue={defaultValues?.relevanceText}
        rows={2}
      />
      <TextAreaField
        label="座学コンテンツ(Markdown)"
        name="lectureContent"
        defaultValue={defaultValues?.lectureContent}
        rows={10}
      />
      <ReferenceLinksEditor initialLinks={defaultValues?.referenceLinks ?? []} />
      <TextAreaField
        label="具体例(Markdown)"
        name="exampleContent"
        defaultValue={defaultValues?.exampleContent}
        rows={6}
      />
      <HandsOnEditor defaultValue={defaultValues?.handsOnContent} />
      <TextAreaField
        label="これでできるようになったこと(1行1項目)"
        name="outcomes"
        defaultValue={defaultValues?.outcomes}
        rows={3}
      />
      <Field
        label="このスキルが使われる仕事(カンマ区切り)"
        name="relatedJobs"
        defaultValue={defaultValues?.relatedJobs}
      />

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
