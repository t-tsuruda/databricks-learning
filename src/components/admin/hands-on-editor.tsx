"use client";

import { useId, useState } from "react";

const MAX_IMAGE_BYTES = 1.5 * 1024 * 1024; // 1.5MB: images are embedded as base64 directly in the DB row.

export function HandsOnEditor({ defaultValue }: { defaultValue?: string }) {
  const [value, setValue] = useState(defaultValue ?? "");
  const [error, setError] = useState<string | null>(null);
  const fileInputId = useId();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    setError(null);
    if (file.size > MAX_IMAGE_BYTES) {
      setError("画像サイズが大きすぎます（1.5MB以下にしてください）。");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = typeof reader.result === "string" ? reader.result : "";
      if (!dataUrl) return;
      setValue((prev) => `${prev}${prev.endsWith("\n") || prev === "" ? "" : "\n\n"}![スクリーンショット](${dataUrl})\n`);
    };
    reader.onerror = () => setError("画像の読み込みに失敗しました。");
    reader.readAsDataURL(file);
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <label htmlFor="handsOnContent" className="block text-sm font-medium">
          ハンズオン課題(Markdown)
        </label>
        <label
          htmlFor={fileInputId}
          className="cursor-pointer rounded-md border border-border px-2 py-1 text-xs font-medium hover:bg-slate-100"
        >
          + スクリーンショットを添付
        </label>
        <input id={fileInputId} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
      </div>
      <textarea
        id="handsOnContent"
        name="handsOnContent"
        required
        rows={10}
        value={value}
        onChange={(event) => setValue(event.target.value)}
        className="mt-1 w-full rounded-md border border-border px-3 py-2 text-sm font-mono"
      />
      <p className="mt-1 text-xs text-foreground/60">
        画像を添付するとMarkdown内に埋め込まれます（1.5MB以下、DBに直接保存されるため大量の添付は避けてください）。
      </p>
      {error ? (
        <p role="alert" className="mt-1 text-sm text-red-600">
          {error}
        </p>
      ) : null}
    </div>
  );
}
