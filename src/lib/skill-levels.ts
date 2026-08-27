export type LevelInfo = {
  level: number;
  name: string;
  description: string;
};

export const LEVEL_INFO: Record<number, LevelInfo> = {
  1: {
    level: 1,
    name: "Level 1: データ入門",
    description: "データに関心を持っているが、基礎が弱い状態から、SQLで自分の手でデータを見られるようになります。",
  },
  2: {
    level: 2,
    name: "Level 2: Databricks入門",
    description: "SQLとPythonで基本的な処理ができるようになり、Databricksの全体像を理解します。",
  },
  3: {
    level: 3,
    name: "Level 3: 実務応用",
    description: "ETLの基本設計とデータ整形ができ、実務に近いパイプラインを組み立てられます。",
  },
  4: {
    level: 4,
    name: "Level 4: 応用・発展",
    description: "Databricksを使って簡単なデータパイプラインを運用し、性能改善まで見据えられます。",
  },
  5: {
    level: 5,
    name: "Level 5: 実務総合演習",
    description: "オープンデータの取得からBI可視化までを一気通貫で行い、実務レベルのパイプラインを1人で組み立てられます。",
  },
};

export const MAX_LEVEL = 5;

export function getLevelInfo(level: number): LevelInfo {
  return LEVEL_INFO[level] ?? LEVEL_INFO[1];
}
