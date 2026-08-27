// Column layout shared by the course CSV import action, the template
// download route, and the export route (see docs/prd.md section 21-6).

export const COURSE_CSV_COLUMNS = [
  "slug",
  "title",
  "description",
  "missionText",
  "level",
  "orderIndex",
  "isPublished",
] as const;

export const COURSE_CSV_EXAMPLE_ROW = [
  "example-course-slug",
  "サンプルコースのタイトル",
  "このコースの概要をここに書きます。",
  "このコースを終えると学習者ができるようになることをここに書きます（ARCS Attention/Relevance）。",
  "1",
  "0",
  "false",
];
