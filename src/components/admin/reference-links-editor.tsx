"use client";

import { useState } from "react";

type ReferenceLink = { label: string; url: string };

export function ReferenceLinksEditor({ initialLinks }: { initialLinks: ReferenceLink[] }) {
  const [links, setLinks] = useState<ReferenceLink[]>(initialLinks.length > 0 ? initialLinks : [{ label: "", url: "" }]);

  const updateLink = (index: number, field: keyof ReferenceLink, value: string) => {
    setLinks((prev) => prev.map((link, i) => (i === index ? { ...link, [field]: value } : link)));
  };

  const addLink = () => setLinks((prev) => [...prev, { label: "", url: "" }]);
  const removeLink = (index: number) => setLinks((prev) => prev.filter((_, i) => i !== index));

  const cleanedLinks = links.filter((link) => link.label.trim() && link.url.trim());

  return (
    <div>
      <label className="block text-sm font-medium">参考リンク（学ぶセクションに表示）</label>
      <input type="hidden" name="referenceLinksJson" value={JSON.stringify(cleanedLinks)} />
      <div className="mt-2 space-y-2">
        {links.map((link, index) => (
          <div key={index} className="flex gap-2">
            <input
              type="text"
              value={link.label}
              onChange={(event) => updateLink(index, "label", event.target.value)}
              placeholder="表示名（例: Databricks公式ドキュメント）"
              className="flex-1 rounded-md border border-border px-3 py-2 text-sm"
            />
            <input
              type="url"
              value={link.url}
              onChange={(event) => updateLink(index, "url", event.target.value)}
              placeholder="https://..."
              className="flex-1 rounded-md border border-border px-3 py-2 text-sm"
            />
            <button
              type="button"
              onClick={() => removeLink(index)}
              className="rounded-md border border-border px-2 py-1 text-xs hover:bg-slate-100"
            >
              削除
            </button>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={addLink}
        className="mt-2 text-xs font-medium text-brand hover:underline"
      >
        + 参考リンクを追加
      </button>
    </div>
  );
}
