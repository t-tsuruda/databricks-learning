// Column layout shared by the lesson CSV import action, the template
// download route, and the export route (see docs/prd.md section 19-1).

export const LESSON_CSV_COLUMNS = [
  "slug",
  "title",
  "questTitle",
  "type",
  "orderIndex",
  "attentionText",
  "relevanceText",
  "lectureContent",
  "exampleContent",
  "handsOnContent",
  "modelAnswerContent",
  "outcomes",
  "relatedJobs",
  "skillTags",
  "referenceLinksJson",
  "quizzesJson",
] as const;

export const LESSON_CSV_EXAMPLE_ROW = [
  "example-lesson-slug",
  "サンプルレッスンのタイトル",
  "挑戦心を煽るクエストタイトルをここに書きます（空欄可、空の場合はタイトルが使われます）",
  "TEXT",
  "0",
  "（Attention）学習者の興味を引く問いかけや意外な事実をここに書きます。",
  "（Relevance）この内容が学習者自身のゴールにどう繋がるかをここに書きます。",
  "## 見出し\n\nMarkdown形式で座学の内容を書きます。",
  "具体的なコード例や事例をMarkdown形式で書きます。",
  "**ハンズオン課題**\n\n1. 手順1\n2. 手順2",
  "**模範解答**\n\n手順に対する模範的な回答例をMarkdown形式で書きます（空欄可）。",
  "できるようになったこと1\nできるようになったこと2",
  "Data Engineer,Data Analyst",
  "Window関数,MERGE文",
  JSON.stringify([{ label: "参考サイト", url: "https://example.com" }]),
  JSON.stringify([
    {
      question: "確認問題の文章",
      options: [
        { label: "選択肢1(正解)", isCorrect: true },
        { label: "選択肢2", isCorrect: false },
      ],
    },
  ]),
];

export function safeParseOutcomesForCsv(json: string): string[] {
  try {
    const parsed = JSON.parse(json) as unknown;
    return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === "string") : [];
  } catch {
    return [];
  }
}
