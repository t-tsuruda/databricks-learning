"use client";

import { useState } from "react";

export function ExpandableTagList({
  tags,
  tagClassName,
  initialCount = 8,
}: {
  tags: string[];
  tagClassName: string;
  initialCount?: number;
}) {
  const [expanded, setExpanded] = useState(false);
  const visibleTags = expanded ? tags : tags.slice(0, initialCount);
  const hiddenCount = tags.length - initialCount;

  return (
    <>
      <ul className="mt-2 flex flex-wrap gap-2">
        {visibleTags.map((tag) => (
          <li key={tag} className={tagClassName}>
            {tag}
          </li>
        ))}
      </ul>
      {hiddenCount > 0 ? (
        <button
          type="button"
          onClick={() => setExpanded((prev) => !prev)}
          className="mt-2 text-xs font-medium text-brand hover:underline"
        >
          {expanded ? "折りたたむ" : `+${hiddenCount}件をもっと見る`}
        </button>
      ) : null}
    </>
  );
}
