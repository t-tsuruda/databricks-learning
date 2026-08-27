// 10段階の学習者レベル判定（docs/prd.md 21-2）。
// 全体の学習進捗（overallPercent）を10%刻みで区切り、初学者から
// 「Databricks担当者としてデータ基盤を任せられる人材」までの成長ストーリーを
// レベル名＋一言のスキル説明として表現する。

export type LearnerLevelInfo = {
  level: number;
  name: string;
  skillDescription: string;
};

export const LEARNER_LEVELS: LearnerLevelInfo[] = [
  { level: 1, name: "データの入り口に立った人", skillDescription: "表形式データの行・列・主キーの意味がわかる" },
  { level: 2, name: "SQLで会話できる人", skillDescription: "SELECT文で必要な情報を自分の手で取り出せる" },
  { level: 3, name: "データの傾向を読み解ける人", skillDescription: "集計関数とGROUP BYで全体の傾向を掴める" },
  { level: 4, name: "複数テーブルを扱える人", skillDescription: "JOINとデータモデリングの基礎を理解している" },
  { level: 5, name: "Pythonでデータを操れる人", skillDescription: "PythonとDataFrameでデータを加工できる" },
  { level: 6, name: "Databricksの地図を持つ人", skillDescription: "Lakehouse・Unity Catalog・クラスタの基礎がわかる" },
  { level: 7, name: "Delta Lakeを運用できる人", skillDescription: "MERGE・Auto Loader・Delta Live Tablesを扱える" },
  { level: 8, name: "ETLパイプラインを設計できる人", skillDescription: "品質チェックと冪等性を踏まえた設計ができる" },
  { level: 9, name: "パフォーマンスと運用を見渡せる人", skillDescription: "チューニングと監視・コスト最適化まで担える" },
  { level: 10, name: "データ基盤を任せられる人", skillDescription: "メダリオン設計からガバナンス・Delta Sharingまで一気通貫で構築できる" },
];

export type LearnerLevelResult = {
  current: LearnerLevelInfo;
  next: LearnerLevelInfo | null;
  percentIntoLevel: number; // 0-100, progress toward the next level within the current 10%-band
};

export function getLearnerLevel(overallPercent: number): LearnerLevelResult {
  const bandIndex = Math.min(9, Math.max(0, Math.floor(overallPercent / 10)));
  const current = LEARNER_LEVELS[bandIndex];
  const next = bandIndex < 9 ? LEARNER_LEVELS[bandIndex + 1] : null;
  const percentIntoLevel = Math.min(100, (overallPercent - bandIndex * 10) * 10);
  return { current, next, percentIntoLevel };
}
