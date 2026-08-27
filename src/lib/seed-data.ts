import type { PrismaClient, LessonType as LessonTypeT } from "@prisma/client";
import { LessonType } from "@prisma/client";

type QuizSeed = {
  question: string;
  options: { label: string; isCorrect: boolean }[];
};

type ReferenceLink = { label: string; url: string };

type LessonSeed = {
  slug: string;
  title: string;
  type: LessonTypeT;
  attentionText: string;
  relevanceText: string;
  lectureContent: string;
  exampleContent: string;
  handsOnContent: string;
  modelAnswerContent: string;
  outcomes: string[];
  relatedJobs: string[];
  skillTags: string[];
  referenceLinks: ReferenceLink[];
  quizzes: QuizSeed[];
};

type CourseSeed = {
  slug: string;
  title: string;
  description: string;
  missionText: string;
  closingColumn: string;
  level: number;
  lessons: LessonSeed[];
};

const courses: CourseSeed[] = [
  {
    slug: "data-sql-basics",
    title: "データ入門とSQLの基礎",
    description:
      "データとは何か、表形式データの考え方から、SQLを使ったデータの抽出・集計までを一気通貫で学びます。",
    missionText:
      "この章を終えると、データの見方とSQLによる抽出・集計の基礎を理解し、実務で使われる「データを見て答えを出す」ための最初の一歩を踏み出せます。",
    closingColumn:
      "## コラム：「わからない」が「見える」に変わった日\n\n多くの人にとって、データは「専門家だけが扱える難しいもの」に見えます。しかし実際には、行・列・主キーというたった3つの概念さえ押さえれば、目の前の表が急に「読めるもの」に変わります。\n\nこのコースを終えたあなたは、もう「データを見るだけの人」ではありません。SQLという共通言語を手に入れ、自分の力でテーブルから答えを引き出せる「学び始めた人」です。この小さな自信が、この先の学習を支える土台になります。次のコースでは、いよいよPythonでデータを操る世界に進みます。",
    level: 1,
    lessons: [
      {
        slug: "what-is-data",
        title: "データとは何か：表形式データの基本",
        type: LessonType.TEXT,
        attentionText:
          "エクセルの表、家計簿、LINEの既読リスト——実はこれらもすべて「データ」です。「データ」と聞くと難しそうに感じるかもしれませんが、正体を知れば拍子抜けするほどシンプルです。",
        relevanceText:
          "この章で学ぶ「表形式データの見方」は、これから学ぶSQLやDatabricksすべての土台であるだけでなく、副業でデータエンジニアリング案件を獲得する際の面接でも必ず問われる基礎知識です。",
        lectureContent:
          "## 表形式データの基本\n\nビジネスの現場で扱うデータの多くは「行（レコード）」と「列（カラム）」で構成される表形式データです。\n\n- **行（Row）**: 1件のデータ（例：1人の顧客、1件の注文）\n- **列（Column）**: データの属性（例：顧客名、注文日、金額）\n- **主キー（Primary Key）**: 各行を一意に識別するID\n\nDatabricksやSQLデータベースでは、こうした表を「テーブル」と呼び、複数のテーブルを組み合わせて分析を行います。",
        exampleContent:
          "例えば、以下のような `orders`（注文）テーブルを考えます。\n\n| order_id | customer_name | amount | order_date |\n|---|---|---|---|\n| 1 | 田中 | 3000 | 2026-01-05 |\n| 2 | 鈴木 | 5400 | 2026-01-06 |\n\nこの表から「合計売上はいくらか」「一番多く買っている顧客は誰か」を求めるのがデータ分析の第一歩です。",
        handsOnContent:
          "**ハンズオン課題**\n\n1. 手元の紙・スプレッドシート・メモアプリのいずれかを用意してください。\n2. あなたの好きな題材（本棚、家計簿、好きな曲リストなど）を選び、表のタイトルを1行目に書きます。\n3. 2行目に列名（ヘッダー）を書き出します。最低4つの列を用意してください（例：家計簿なら「日付・項目・金額・カテゴリ」）。\n4. 3行目以降に、実際のデータを最低5行入力してください。\n5. どの列が「主キー」に使えそうか（他の行と重複しない値を持つ列、または連番のID列を追加する）を検討し、メモに書き加えてください。\n6. 完成した表を見直し、「行が何を表しているか」「列が何を表しているか」を、それぞれ1文で説明してみましょう。\n7. できたら「確認する」に進み、理解度チェックに答えましょう。",
        modelAnswerContent:
          "**模範解答例（家計簿を題材にした場合）**\n\n| record_id | date | item | amount | category |\n|---|---|---|---|---|\n| 1 | 2026-01-05 | スーパーで食材 | 3200 | 食費 |\n| 2 | 2026-01-06 | 電車代 | 420 | 交通費 |\n| 3 | 2026-01-07 | 書籍 | 1500 | 娯楽 |\n| 4 | 2026-01-08 | 家賃 | 65000 | 住居費 |\n| 5 | 2026-01-10 | カフェ | 550 | 食費 |\n\n- **行**：1件の支出（1回の買い物や支払い）\n- **列**：支出の属性（日付・項目・金額・カテゴリ）\n- **主キー**：`record_id`（連番のID列。他の行と重複しない値であれば、日付や項目だけでは重複しうるためIDを別途用意するのが安全）",
        outcomes: [
          "表形式データの行・列・主キーの意味を説明できる",
          "身の回りの情報を表形式データとして捉え直せる",
        ],
        relatedJobs: ["Data Analyst", "Reporting Analyst", "BI Support"],
        skillTags: ["表形式データ", "行と列", "主キー"],
        referenceLinks: [
          { label: "Databricks公式ドキュメント", url: "https://docs.databricks.com/en/index.html" },
          { label: "Qiita: リレーショナルデータベース入門", url: "https://qiita.com/search?q=%E3%83%AA%E3%83%AC%E3%83%BC%E3%82%B7%E3%83%A7%E3%83%8A%E3%83%AB%E3%83%87%E3%83%BC%E3%82%BF%E3%83%99%E3%83%BC%E3%82%B9+%E5%85%A5%E9%96%80" },
        ],
        quizzes: [
          {
            question: "表形式データにおいて「1件のデータ」を表す単位はどれですか？",
            options: [
              { label: "列（Column）", isCorrect: false },
              { label: "行（Row）", isCorrect: true },
              { label: "テーブル名", isCorrect: false },
            ],
          },
        ],
      },
      {
        slug: "sql-select-basics",
        title: "SQLの基本：SELECT文でデータを取り出す",
        type: LessonType.EXERCISE,
        attentionText:
          "「このデータの中から、条件に合う情報だけ欲しい」——そう思ったとき、Excelでフィルタをかけるように、何百万行のデータからでも一瞬で答えを出せる方法があります。",
        relevanceText:
          "SELECT文は、データ関連の求人票でほぼ必ず「必須スキル」として挙げられるSQLの入り口です。ここを押さえることが、副業案件の応募条件をクリアする第一歩になります。",
        lectureContent:
          "## SELECT文の基本構文\n\n```sql\nSELECT カラム名\nFROM テーブル名\nWHERE 条件;\n```\n\n- `SELECT`: 取得したい列を指定\n- `FROM`: 対象のテーブルを指定\n- `WHERE`: 絞り込み条件を指定\n\nこの3つを組み合わせるだけで、大量のデータから必要な情報だけを抽出できます。",
        exampleContent:
          "```sql\n-- 3000円より高い注文だけを取得する\nSELECT customer_name, amount\nFROM orders\nWHERE amount > 3000;\n```\n\nこのクエリは `orders` テーブルから、`amount` が3000より大きい行の `customer_name` と `amount` を取り出します。",
        handsOnContent:
          "**ハンズオン課題（Databricks Free Edition推奨）**\n\n1. Databricks Free Editionにサインアップ（無料）し、Workspaceにログインします。\n2. 左メニューから「SQL Editor」を開きます。\n3. まず `SELECT * FROM samples.tpch.orders LIMIT 10;` を実行し、テーブル全体の雰囲気（列名・データ型）を確認しましょう。\n4. 次に `SELECT o_custkey, o_totalprice, o_orderdate FROM samples.tpch.orders LIMIT 10;` を実行し、特定の列だけを取り出してみましょう。\n5. `WHERE o_totalprice > 300000` を追加し、高額注文だけに絞り込んでみましょう。実行結果の件数が減ることを確認してください。\n6. さらに `WHERE o_totalprice > 300000 AND o_orderstatus = 'O'` のように条件を `AND` で組み合わせ、結果がどう変化するか比較してみましょう。\n7. 最後に、自分で条件を1つ考えて（例：特定の日付以降の注文）SQLを書き、実行結果をスクリーンショットで残しておきましょう。",
        modelAnswerContent:
          "**模範解答**\n\n```sql\n-- 手順3: 全体の雰囲気を確認\nSELECT * FROM samples.tpch.orders LIMIT 10;\n\n-- 手順4: 特定の列だけ取得\nSELECT o_custkey, o_totalprice, o_orderdate FROM samples.tpch.orders LIMIT 10;\n\n-- 手順5: 高額注文だけに絞り込む\nSELECT o_custkey, o_totalprice, o_orderdate\nFROM samples.tpch.orders\nWHERE o_totalprice > 300000;\n\n-- 手順6: ANDで条件を組み合わせる\nSELECT o_custkey, o_totalprice, o_orderdate\nFROM samples.tpch.orders\nWHERE o_totalprice > 300000 AND o_orderstatus = 'O';\n```\n\n手順6ではANDにより両方の条件を満たす行だけが残るため、手順5より件数がさらに減ることを確認できていればOKです。",
        outcomes: [
          "SELECT / FROM / WHERE の役割を説明できる",
          "簡単な条件でデータを絞り込むSQLを書ける",
        ],
        relatedJobs: ["Data Analyst", "Reporting Analyst", "Junior Data Engineer"],
        skillTags: ["SELECT文", "WHERE句"],
        referenceLinks: [
          { label: "Databricks SQL言語マニュアル", url: "https://docs.databricks.com/en/sql/language-manual/index.html" },
          { label: "Qiita: SQLのSELECT文の使い方", url: "https://qiita.com/search?q=SQL+SELECT%E6%96%87+%E4%BD%BF%E3%81%84%E6%96%B9" },
        ],
        quizzes: [
          {
            question: "取得する行を条件で絞り込むために使う句はどれですか？",
            options: [
              { label: "SELECT", isCorrect: false },
              { label: "FROM", isCorrect: false },
              { label: "WHERE", isCorrect: true },
            ],
          },
        ],
      },
      {
        slug: "sql-aggregation",
        title: "集計とグルーピング：GROUP BYで傾向をつかむ",
        type: LessonType.EXERCISE,
        attentionText:
          "「一番売れている商品は？」「今月の売上合計は？」——上司や取引先から聞かれたとき、1件ずつ手で数えていては日が暮れてしまいます。",
        relevanceText:
          "集計とGROUP BYは、Data AnalystやBI担当の求人で頻出する「傾向を掴んで報告する」業務の中核スキルです。ここができると、データを見るだけの人から「データから答えを出せる人」に変わります。",
        lectureContent:
          "## 集計関数とGROUP BY\n\n- `COUNT()`: 件数を数える\n- `SUM()`: 合計を求める\n- `AVG()`: 平均を求める\n- `GROUP BY`: 指定した列の値ごとにグループ化して集計する\n\n```sql\nSELECT customer_name, SUM(amount) AS total_amount\nFROM orders\nGROUP BY customer_name;\n```",
        exampleContent:
          "上記のクエリを実行すると、顧客ごとの合計購入金額が一覧で得られます。これは「優良顧客はだれか」を把握する際によく使われる分析パターンです。",
        handsOnContent:
          "**ハンズオン課題**\n\n1. Databricks SQL Editorで `samples.tpch.orders` を対象に、`SELECT o_orderstatus, COUNT(*) AS cnt FROM samples.tpch.orders GROUP BY o_orderstatus;` を実行し、注文ステータスごとの件数を確認しましょう。\n2. 次に `SELECT o_custkey, SUM(o_totalprice) AS total_amount FROM samples.tpch.orders GROUP BY o_custkey;` を実行し、顧客ごとの合計金額を集計しましょう。\n3. `ORDER BY total_amount DESC` を末尾に追加し、合計金額が多い顧客から順に並び替えてみましょう。\n4. `LIMIT 5` を追加し、上位5顧客だけに絞り込みましょう。\n5. さらに `AVG(o_totalprice)` に置き換えて実行し、SUMとAVGで結果の意味がどう変わるかを比較してください。\n6. 結果を見て、「最も貢献している顧客」と「平均注文額が高い顧客」が同じかどうかをメモしましょう。",
        modelAnswerContent:
          "**模範解答**\n\n```sql\n-- 手順1: ステータス別件数\nSELECT o_orderstatus, COUNT(*) AS cnt\nFROM samples.tpch.orders\nGROUP BY o_orderstatus;\n\n-- 手順2〜4: 顧客ごとの合計金額を多い順に上位5件\nSELECT o_custkey, SUM(o_totalprice) AS total_amount\nFROM samples.tpch.orders\nGROUP BY o_custkey\nORDER BY total_amount DESC\nLIMIT 5;\n\n-- 手順5: AVGに置き換え\nSELECT o_custkey, AVG(o_totalprice) AS avg_amount\nFROM samples.tpch.orders\nGROUP BY o_custkey\nORDER BY avg_amount DESC\nLIMIT 5;\n```\n\nSUMの上位とAVGの上位では、注文回数が少なくても単価が高い顧客がAVG側にだけ現れることがあります。両者が一致するとは限らない、という点に気づけていれば理解できています。",
        outcomes: [
          "COUNT/SUM/AVGなど集計関数を使える",
          "GROUP BYでデータをグループ単位に集計できる",
        ],
        relatedJobs: ["Data Analyst", "BI Support", "Junior Data Engineer"],
        skillTags: ["GROUP BY", "COUNT/SUM/AVG"],
        referenceLinks: [
          { label: "Qiita: SQLのGROUP BYで集計する", url: "https://qiita.com/search?q=SQL+GROUP+BY+%E9%9B%86%E8%A8%88+%E5%88%9D%E5%BF%83%E8%80%85" },
          { label: "Databricks SQL 集計関数リファレンス", url: "https://docs.databricks.com/en/sql/language-manual/sql-ref-functions-builtin.html" },
        ],
        quizzes: [
          {
            question: "顧客ごとの合計金額を求めるために組み合わせる句はどれですか？",
            options: [
              { label: "SUM() と GROUP BY", isCorrect: true },
              { label: "WHERE と ORDER BY", isCorrect: false },
              { label: "SELECT * のみ", isCorrect: false },
            ],
          },
        ],
      },
      {
        slug: "data-modeling-intro",
        title: "データモデリング入門：正規化とテーブル設計",
        type: LessonType.TEXT,
        attentionText:
          "1つの巨大な表にあらゆる情報を詰め込んだデータを見たことはありませんか？一見便利そうですが、実は更新漏れやデータの重複という「実務の地雷」が潜んでいます。",
        relevanceText:
          "テーブルを適切に分割・結合する設計力は、Data EngineerやAnalytics Engineerの求人で「テーブル設計ができる」として評価される、実務未経験者と経験者を分ける分水嶺の一つです。",
        lectureContent:
          "## テーブルを分割する理由\n\n顧客情報を注文テーブルに毎回書き込むと、同じ情報が重複し、更新漏れが起きやすくなります。そこで、\n\n- `customers`（顧客マスタ）\n- `orders`（注文トランザクション）\n\nのようにテーブルを分割し、`customer_id` で紐づける設計（正規化）を行います。これによりデータの一貫性が保たれ、実務でのETL・分析基盤設計の土台になります。",
        exampleContent:
          "```sql\nSELECT o.order_id, c.customer_name, o.amount\nFROM orders o\nJOIN customers c ON o.customer_id = c.customer_id;\n```\n\nJOINを使うことで、分割されたテーブルを結合し、必要な情報を1つの結果として取得できます。",
        handsOnContent:
          "**ハンズオン課題**\n\n1. スプレッドシートに「顧客マスタ」シートを作り、`customer_id`（連番）・`customer_name`・`region` の3列を用意し、3件のダミー顧客を入力します。\n2. 別のシートに「注文」を作り、`order_id`・`customer_id`・`amount`・`order_date` の4列を用意し、先ほどの顧客IDを使って5件のダミー注文を入力します（同じ顧客が複数回注文しても構いません）。\n3. Databricks SQL Editorで、上記に似た構造の `samples.tpch.customer` と `samples.tpch.orders` を使い、`SELECT c.c_name, o.o_orderkey, o.o_totalprice FROM samples.tpch.orders o JOIN samples.tpch.customer c ON o.o_custkey = c.c_custkey LIMIT 10;` を実行してみましょう。\n4. 結合キー（`o_custkey` と `c_custkey`）が一致する行だけが結合されていることを、結果を見て確認してください。\n5. `JOIN` を `LEFT JOIN` に変えて実行し、結果の件数や内容がどう変わるかを比較してみましょう。",
        modelAnswerContent:
          "**模範解答**\n\n```sql\nSELECT c.c_name, o.o_orderkey, o.o_totalprice\nFROM samples.tpch.orders o\nJOIN samples.tpch.customer c ON o.o_custkey = c.c_custkey\nLIMIT 10;\n\n-- LEFT JOINに変更\nSELECT c.c_name, o.o_orderkey, o.o_totalprice\nFROM samples.tpch.customer c\nLEFT JOIN samples.tpch.orders o ON o.o_custkey = c.c_custkey\nLIMIT 10;\n```\n\n`JOIN`（内部結合）では両方のテーブルにキーが存在する行だけが残りますが、`LEFT JOIN`にすると、注文が1件も無い顧客も`customer`側を起点に表示され、`orders`側の列がNULLになる行が現れます。この違いに気づけていればOKです。",
        outcomes: [
          "テーブルを分割する理由（正規化）を説明できる",
          "JOINを使って複数テーブルを結合できる",
        ],
        relatedJobs: ["Data Analyst", "Data Engineer Intern", "Analytics Engineer"],
        skillTags: ["JOIN", "正規化"],
        referenceLinks: [
          { label: "Qiita: SQLのJOINを初心者向けに解説", url: "https://qiita.com/search?q=SQL+JOIN+%E5%88%9D%E5%BF%83%E8%80%85+%E3%82%8F%E3%81%8B%E3%82%8A%E3%82%84%E3%81%99%E3%81%8F" },
          { label: "Qiita: データベース正規化をわかりやすく", url: "https://qiita.com/search?q=%E3%83%87%E3%83%BC%E3%82%BF%E3%83%99%E3%83%BC%E3%82%B9%E6%AD%A3%E8%A6%8F%E5%8C%96+%E3%82%8F%E3%81%8B%E3%82%8A%E3%82%84%E3%81%99%E3%81%8F" },
        ],
        quizzes: [
          {
            question: "複数のテーブルを共通のキーで結びつける操作は何と呼びますか？",
            options: [
              { label: "GROUP BY", isCorrect: false },
              { label: "JOIN", isCorrect: true },
              { label: "ORDER BY", isCorrect: false },
            ],
          },
        ],
      },
      {
        slug: "sql-subquery-case",
        title: "サブクエリとCASE式：条件分岐とネストしたSQL",
        type: LessonType.EXERCISE,
        attentionText:
          "「平均より高い注文だけを、金額帯ごとに分類して」——こんな一見複雑な依頼も、実はSQL1本で解決できます。",
        relevanceText:
          "サブクエリとCASE式を使いこなせると、単純な抽出だけでなく実務でよくある「条件付きの複雑な集計依頼」に一人で対応できるようになり、任される仕事の幅がぐっと広がります。",
        lectureContent:
          "## サブクエリ（Subquery）\n\nサブクエリとは、SQL文の中に埋め込まれた別のSELECT文のことです。\n\n```sql\nSELECT customer_name\nFROM customers\nWHERE customer_id IN (\n  SELECT customer_id FROM orders WHERE amount > 5000\n);\n```\n\nこの例では、内側の `SELECT` で「5000円より高い注文をした顧客ID」を求め、外側の `SELECT` でその顧客の名前を取得しています。\n\n## CASE式\n\nCASE式は、条件によって出力する値を変える「条件分岐」です。\n\n```sql\nSELECT\n  order_id,\n  amount,\n  CASE\n    WHEN amount >= 10000 THEN '大口'\n    WHEN amount >= 3000 THEN '中口'\n    ELSE '小口'\n  END AS order_size\nFROM orders;\n```",
        exampleContent:
          "サブクエリとCASE式を組み合わせると、「平均注文額より高い注文だけを対象に、金額帯ごとにラベル付けする」といった、実務でよくある複合的な分析が可能になります。",
        handsOnContent:
          "**ハンズオン課題**\n\n1. Databricks SQL Editorで `SELECT AVG(o_totalprice) FROM samples.tpch.orders;` を実行し、平均注文額を確認します。\n2. その値を使って `SELECT * FROM samples.tpch.orders WHERE o_totalprice > (SELECT AVG(o_totalprice) FROM samples.tpch.orders) LIMIT 10;` を実行し、平均より高い注文だけを抽出しましょう（サブクエリを使うことで、平均値を手打ちせずに済むことを確認してください）。\n3. 次に `CASE` 式を使い、`SELECT o_orderkey, o_totalprice, CASE WHEN o_totalprice >= 300000 THEN '大口' WHEN o_totalprice >= 100000 THEN '中口' ELSE '小口' END AS order_size FROM samples.tpch.orders LIMIT 20;` を実行してみましょう。\n4. 閾値（300000, 100000）を自分で変えて再実行し、分類結果がどう変わるか確認しましょう。\n5. 最後に、サブクエリとCASE式を1つのSQLに組み合わせて、「平均より高い注文だけを大口/中口に分類する」クエリを自分で書いてみましょう。",
        modelAnswerContent:
          "**模範解答**\n\n```sql\nSELECT\n  o_orderkey,\n  o_totalprice,\n  CASE\n    WHEN o_totalprice >= 300000 THEN '大口'\n    WHEN o_totalprice >= 100000 THEN '中口'\n    ELSE '小口'\n  END AS order_size\nFROM samples.tpch.orders\nWHERE o_totalprice > (SELECT AVG(o_totalprice) FROM samples.tpch.orders)\nLIMIT 20;\n```\n\nサブクエリで平均値を動的に求め、その平均より高い注文だけをCASE式で大口/中口に分類しています（平均を上回っているため「小口」に分類される行は基本的に現れません）。",
        outcomes: [
          "サブクエリを使って動的な条件で絞り込みができる",
          "CASE式で条件に応じたラベル付けができる",
        ],
        relatedJobs: ["Data Analyst", "BI Support", "Junior Data Engineer"],
        skillTags: ["サブクエリ", "CASE式"],
        referenceLinks: [
          { label: "Qiita: SQLのCASE式の使い方", url: "https://qiita.com/search?q=SQL+CASE%E5%BC%8F+%E4%BD%BF%E3%81%84%E6%96%B9" },
          { label: "Qiita: SQLのサブクエリ入門", url: "https://qiita.com/search?q=SQL+%E3%82%B5%E3%83%96%E3%82%AF%E3%82%A8%E3%83%AA+%E5%85%A5%E9%96%80" },
        ],
        quizzes: [
          {
            question: "SQL文の中に埋め込まれた別のSELECT文のことを何と呼びますか？",
            options: [
              { label: "サブクエリ", isCorrect: true },
              { label: "CASE式", isCorrect: false },
              { label: "ビュー", isCorrect: false },
            ],
          },
        ],
      },
      {
        slug: "sql-null-handling",
        title: "NULLと欠損値の扱い：実務データの落とし穴",
        type: LessonType.EXERCISE,
        attentionText:
          "同じ集計クエリのはずなのに、実行するたびに平均値が微妙に違う……そんな経験はありませんか？犯人は、見落とされがちな「NULL」かもしれません。",
        relevanceText:
          "NULLの扱いを誤ると、報告する数値そのものが間違っているという致命的なミスにつながります。正しく扱えることは、データを扱う仕事における「信頼」の土台です。",
        lectureContent:
          "## NULLとは何か\n\nNULLは「値が存在しない」ことを表す特別な状態で、0や空文字とは異なります。NULLの重要な性質は、**比較演算（`=`, `!=`など）では判定できない**ことです。\n\n```sql\n-- 誤り: NULLは = では絶対にヒットしない\nSELECT * FROM orders WHERE discount = NULL;\n\n-- 正しい書き方\nSELECT * FROM orders WHERE discount IS NULL;\n```\n\n## NULLを考慮した集計\n\n`COUNT(列名)` はNULLを除外してカウントしますが、`COUNT(*)` は全行をカウントします。この違いを理解していないと、集計結果を読み違えます。\n\n`COALESCE(列名, デフォルト値)` を使うと、NULLの場合に代わりの値を使えます。\n\n```sql\nSELECT customer_name, COALESCE(discount, 0) AS discount\nFROM orders;\n```",
        exampleContent:
          "例えば、`discount`（割引額）列にNULLが混ざっている状態で `AVG(discount)` を計算すると、NULLの行は計算から除外されるため、「全顧客の平均」ではなく「割引が設定されている顧客だけの平均」になってしまいます。`COALESCE(discount, 0)` で0埋めしてから平均を取ると、意図した「全顧客の平均」に近づきます。",
        handsOnContent:
          "**ハンズオン課題**\n\n1. Databricks SQL Editorで `SELECT COUNT(*) AS all_rows, COUNT(o_comment) AS non_null_comment FROM samples.tpch.orders;` を実行し、`COUNT(*)` と `COUNT(列名)` の結果が異なるかどうか確認しましょう。\n2. `SELECT * FROM samples.tpch.orders WHERE o_comment IS NULL LIMIT 5;` を実行し、NULLを含む行を確認しましょう（`samples.tpch.orders`にNULLが無い場合は、他のサンプルテーブルやご自身で作成したテーブルで試してください）。\n3. `COALESCE()` を使って、NULLの場合に別の文字列（例:'コメントなし'）に置き換えるSELECT文を書いて実行しましょう。\n4. `AVG()` や `SUM()` にNULLが混ざるとどう影響するか、実際に小さなテーブルを自分で作って（`VALUES` 句を使うと簡単です）試してみましょう:\n   ```sql\n   SELECT AVG(amount) FROM (VALUES (100), (200), (NULL)) AS t(amount);\n   ```\n5. 上記の結果が「150」になる（NULLを除いた2件の平均）ことを確認し、なぜそうなるかを自分の言葉で説明してみましょう。",
        modelAnswerContent:
          "**模範解答**\n\n```sql\nSELECT COUNT(*) AS all_rows, COUNT(o_comment) AS non_null_comment\nFROM samples.tpch.orders;\n\nSELECT COALESCE(o_comment, 'コメントなし') AS comment\nFROM samples.tpch.orders\nLIMIT 10;\n\nSELECT AVG(amount) FROM (VALUES (100), (200), (NULL)) AS t(amount);\n-- 結果: 150 （NULLの行は計算対象から除外され、100と200の平均になる）\n```\n\n`COUNT(*)`は全行、`COUNT(列名)`はその列がNULLでない行だけを数えるため、両者の差がNULLの件数に相当します。",
        outcomes: [
          "NULLは比較演算子ではなくIS NULLで判定することを理解している",
          "COALESCEを使ってNULLに既定値を設定できる",
        ],
        relatedJobs: ["Data Analyst", "Data Engineer Intern", "Analytics Engineer"],
        skillTags: ["NULL処理", "COALESCE"],
        referenceLinks: [
          { label: "Databricks SQLリファレンス: NULL値の扱い", url: "https://docs.databricks.com/en/sql/language-manual/sql-ref-null-semantics.html" },
          { label: "Qiita: SQLのNULLの扱い方", url: "https://qiita.com/search?q=SQL+NULL+%E5%88%9D%E5%BF%83%E8%80%85" },
        ],
        quizzes: [
          {
            question: "ある列がNULLかどうかを判定する正しい書き方はどれですか？",
            options: [
              { label: "WHERE 列名 = NULL", isCorrect: false },
              { label: "WHERE 列名 IS NULL", isCorrect: true },
              { label: "WHERE 列名 == NULL", isCorrect: false },
            ],
          },
        ],
      },
    ],
  },
  {
    slug: "python-for-data",
    title: "Pythonでのデータ操作基礎",
    description: "PythonとpandasライクなDataFrame操作で、SQLでは難しい柔軟なデータ処理を学びます。",
    missionText:
      "このコースを終えると、Pythonでデータを読み込み、加工し、簡単な集計ができるようになります。ETLの実装言語としての第一歩です。",
    closingColumn:
      "## コラム：SQLだけでは足りない場面に出会ったら\n\nSQLは強力ですが、「複雑な条件分岐を繰り返す」「外部のファイルやAPIと連携する」といった場面では、コードの力が必要になります。Pythonはその代表格であり、データエンジニアリングの現場で最も長く使われ続けている言語の一つです。\n\nここで身につけたif/for/関数、DataFrame、pandasの基礎は、この先のETLパイプライン設計やLevel 5の総合演習で何度も登場します。一度覚えれば一生使える資産です。焦らず、手を動かして体に馴染ませていきましょう。",
    level: 1,
    lessons: [
      {
        slug: "python-basics-for-data",
        title: "データ処理のためのPython基礎",
        type: LessonType.TEXT,
        attentionText:
          "SQLだけでは書きにくい「繰り返しの処理」や「複雑な条件分岐」。実務のデータエンジニアはそれをどう解決しているのでしょうか？答えの多くはPythonにあります。",
        relevanceText:
          "Pythonは、Data EngineerやAnalytics Engineerの求人でSQLと並んで必須スキルとして挙げられる言語です。ここでの基礎が、この後のETLパイプライン構築に直結します。",
        lectureContent:
          "## 変数・リスト・辞書\n\n```python\nsales = [3000, 5400, 1200]\ntotal = sum(sales)\naverage = total / len(sales)\n```\n\nデータエンジニアリングでは、こうした基本構文の組み合わせでデータの読み込み・変換・書き出しを行います。",
        exampleContent:
          "```python\norders = [\n    {\"customer\": \"田中\", \"amount\": 3000},\n    {\"customer\": \"鈴木\", \"amount\": 5400},\n]\ntotal = sum(o[\"amount\"] for o in orders)\nprint(total)  # 8300\n```",
        handsOnContent:
          "**ハンズオン課題**\n\n1. Databricks Free Editionにログインし、左メニューから新しいNotebookを作成してください（言語はPythonを選択）。\n2. 最初のセルに `sales = [3000, 5400, 1200]` と入力して実行し、`Shift+Enter` でセルを実行する操作に慣れましょう。\n3. 次のセルで `total = sum(sales)` と `print(total)` を実行し、合計が8500になることを確認してください。\n4. 上記の例のような辞書のリスト（`orders = [{\"customer\": ..., \"amount\": ...}, ...]`）を、自分で3件以上作成してください。\n5. `for` を使わずにリスト内包表記（`sum(o[\"amount\"] for o in orders)`）で合計金額を計算し、結果を表示してください。\n6. 最後に、合計金額を件数で割って平均を求めるコードを追加し、実行結果をメモしておきましょう。",
        modelAnswerContent:
          "**模範解答**\n\n```python\nsales = [3000, 5400, 1200]\ntotal = sum(sales)\nprint(total)  # 8500\n\norders = [\n    {\"customer\": \"田中\", \"amount\": 3000},\n    {\"customer\": \"鈴木\", \"amount\": 5400},\n    {\"customer\": \"佐藤\", \"amount\": 1200},\n]\ntotal = sum(o[\"amount\"] for o in orders)\nprint(total)  # 9500\nprint(total / len(orders))  # 3166.67\n```",
        outcomes: ["Pythonの基本文法（変数・リスト・辞書）を使える", "簡単な集計処理をコードで書ける"],
        relatedJobs: ["Data Engineer Intern", "Junior Data Engineer"],
        skillTags: ["Python基礎", "リスト・辞書"],
        referenceLinks: [
          { label: "Python公式チュートリアル", url: "https://docs.python.org/ja/3/tutorial/index.html" },
          { label: "Databricks Notebooksの使い方", url: "https://docs.databricks.com/en/notebooks/index.html" },
        ],
        quizzes: [
          {
            question: "Pythonでリストの要素数を取得する関数はどれですか？",
            options: [
              { label: "len()", isCorrect: true },
              { label: "sum()", isCorrect: false },
              { label: "count()", isCorrect: false },
            ],
          },
        ],
      },
      {
        slug: "python-control-flow-functions",
        title: "制御構文と関数：繰り返しと再利用可能なコード",
        type: LessonType.EXERCISE,
        attentionText:
          "同じようなコードをコピー＆ペーストして少しずつ書き換えていたら、いつの間にか直し忘れが1箇所だけ残ってしまった——そんな経験はありませんか？",
        relevanceText:
          "処理を関数として切り出す力は、実務のETLコードを「保守しやすいコード」にするために欠かせません。コードレビューで評価される、実務未経験者と一歩差がつくポイントです。",
        lectureContent:
          "## 条件分岐と繰り返し\n\n```python\nfor order in orders:\n    if order[\"amount\"] > 3000:\n        print(f\"{order['customer']}: 高額注文\")\n    else:\n        print(f\"{order['customer']}: 通常注文\")\n```\n\n## 関数の定義\n\n同じ処理を何度も使う場合は、関数として切り出します。\n\n```python\ndef classify_order(amount):\n    if amount >= 10000:\n        return \"大口\"\n    elif amount >= 3000:\n        return \"中口\"\n    else:\n        return \"小口\"\n```\n\n関数化しておくと、ETL処理の中で同じロジックを何度も再利用でき、テストもしやすくなります。",
        exampleContent:
          "```python\nfor order in orders:\n    size = classify_order(order[\"amount\"])\n    print(f\"{order['customer']}: {size}\")\n```\n\n`classify_order` 関数を使うことで、分類ロジックを1か所にまとめられ、後から閾値を変更する際も1箇所を直せば済みます。",
        handsOnContent:
          "**ハンズオン課題**\n\n1. 前のレッスンで作った `orders`（辞書のリスト）を再利用します。\n2. `for` ループで各注文を1件ずつ表示するコードを書いてください。\n3. `if`/`elif`/`else` を使い、金額に応じて「大口」「中口」「小口」を判定するコードをループ内に追加してください。\n4. 上記の判定ロジックを `classify_order(amount)` という関数として切り出してください（`def` を使う）。\n5. 切り出した関数を使って、`orders` の各注文の分類結果を一覧表示するコードに書き換えてください。\n6. 関数の閾値（10000, 3000）を変更し、分類結果がどう変わるか確認しましょう。",
        modelAnswerContent:
          "**模範解答**\n\n```python\ndef classify_order(amount):\n    if amount >= 10000:\n        return \"大口\"\n    elif amount >= 3000:\n        return \"中口\"\n    else:\n        return \"小口\"\n\nfor order in orders:\n    size = classify_order(order[\"amount\"])\n    print(f\"{order['customer']}: {size}\")\n```\n\n閾値（10000, 3000）を変えると、同じ注文でも分類結果が変わることを確認できていればOKです。関数化しておくことで、閾値の変更が1箇所で済みます。",
        outcomes: [
          "if/for を組み合わせて条件付きの繰り返し処理が書ける",
          "処理を関数として切り出し、再利用できる",
        ],
        relatedJobs: ["Data Engineer Intern", "Junior Data Engineer"],
        skillTags: ["制御構文", "関数定義"],
        referenceLinks: [
          { label: "Python公式チュートリアル: 制御構造", url: "https://docs.python.org/ja/3/tutorial/controlflow.html" },
        ],
        quizzes: [
          {
            question: "Pythonで関数を定義するために使うキーワードはどれですか？",
            options: [
              { label: "func", isCorrect: false },
              { label: "def", isCorrect: true },
              { label: "function", isCorrect: false },
            ],
          },
        ],
      },
      {
        slug: "dataframe-basics",
        title: "DataFrameでデータを扱う",
        type: LessonType.EXERCISE,
        attentionText:
          "SQLで学んだ「絞り込み」や「選択」を、Pythonのコードでも同じように書けるとしたら？Databricksのデータ処理は、まさにこの発想で成り立っています。",
        relevanceText:
          "DataFrame操作は、Databricks上でのETL処理の中心的なスキルです。SQLとPythonの両方でデータを扱えることは、Data Engineer求人での大きなアピールポイントになります。",
        lectureContent:
          "## DataFrameの基本操作\n\nDataFrameは行と列を持つ表形式のデータ構造です。Databricksでは主にPySparkのDataFrameを使いますが、考え方はpandasと共通しています。\n\n- フィルタリング:条件で行を絞り込む\n- 選択:必要な列だけ取り出す\n- 集計:グループごとに集計する",
        exampleContent:
          "```python\n# PySparkの例\ndf.filter(df.amount > 3000).select(\"customer_name\", \"amount\").show()\n```\n\nSQLの `WHERE` や `SELECT` に近い操作を、コードで表現できます。",
        handsOnContent:
          "**ハンズオン課題**\n\n1. Databricks Free Editionの新しいPythonノートブックで、`df = spark.table(\"samples.tpch.orders\")` を実行し、DataFrameとして読み込みます。\n2. `df.printSchema()` を実行し、列名とデータ型の一覧を確認しましょう。\n3. `df.show(5)` で先頭5件を表示し、SQLで見た内容と同じデータであることを確認してください。\n4. `df.filter(df.o_totalprice > 300000).select(\"o_custkey\", \"o_totalprice\").show(10)` を実行し、条件に合う行を絞り込んで特定の列だけ表示してみましょう。\n5. `.filter()` の条件を自分で変更し（例：`o_orderstatus == 'O'`）、結果がどう変わるか確認しましょう。\n6. 最後に、`df.filter(...).select(...).count()` のように `.count()` を末尾に付け、絞り込み後の件数を取得してみましょう。",
        modelAnswerContent:
          "**模範解答**\n\n```python\ndf = spark.table(\"samples.tpch.orders\")\ndf.printSchema()\ndf.show(5)\n\ndf.filter(df.o_totalprice > 300000).select(\"o_custkey\", \"o_totalprice\").show(10)\n\ndf.filter(df.o_orderstatus == \"O\").select(\"o_custkey\", \"o_totalprice\").count()\n```\n\nSQLの`WHERE`が`.filter()`に、`SELECT 列名`が`.select()`に対応していることを確認できていればOKです。",
        outcomes: ["DataFrameの基本的な考え方を理解する", "filter/selectでデータを加工できる"],
        relatedJobs: ["Data Engineer Intern", "Analytics Engineer"],
        skillTags: ["DataFrame", "filter/select"],
        referenceLinks: [
          { label: "Apache Spark DataFrame ガイド", url: "https://spark.apache.org/docs/latest/sql-programming-guide.html" },
          { label: "Databricks PySpark基礎", url: "https://docs.databricks.com/en/pyspark/basics.html" },
        ],
        quizzes: [
          {
            question: "DataFrameで条件に合う行を絞り込む操作はどれですか？",
            options: [
              { label: "select", isCorrect: false },
              { label: "filter", isCorrect: true },
              { label: "show", isCorrect: false },
            ],
          },
        ],
      },
      {
        slug: "pandas-data-wrangling",
        title: "pandasでのデータ加工：欠損値処理と列の変換",
        type: LessonType.EXERCISE,
        attentionText:
          "「このCSV、ところどころ値が抜けている……」実務データの多くは、綺麗な状態でやってくることの方が稀です。",
        relevanceText:
          "pandasによる前処理力は、求人票の「データクレンジング経験」という言葉の実体そのものです。ここを身につけると、汚いデータを恐れず扱えるようになります。",
        lectureContent:
          "## pandasの基本操作\n\n```python\nimport pandas as pd\n\ndf = pd.DataFrame({\n    \"customer\": [\"田中\", \"鈴木\", \"佐藤\"],\n    \"amount\": [3000, None, 5400],\n})\n\n# 欠損値の確認\nprint(df.isnull().sum())\n\n# 欠損値を0で埋める\ndf[\"amount\"] = df[\"amount\"].fillna(0)\n\n# 新しい列を追加\ndf[\"amount_with_tax\"] = df[\"amount\"] * 1.1\n```\n\npandasはSQLの `WHERE` に相当する `df[df[\"amount\"] > 3000]` のような書き方や、`groupby` によるSQLの `GROUP BY` 相当の集計もサポートしています。",
        exampleContent:
          "```python\n# customerごとの合計金額を集計（SQLのGROUP BYに相当）\nsummary = df.groupby(\"customer\")[\"amount\"].sum().reset_index()\nprint(summary)\n```\n\nこのように、pandasはSQLで学んだ「集計」の考え方をコードで表現する手段でもあります。",
        handsOnContent:
          "**ハンズオン課題**\n\n1. Databricks Free EditionのPythonノートブックで `import pandas as pd` を実行します。\n2. 上記の例のように、`None`（欠損値）を含む小さなDataFrameを自分で作成してください。\n3. `df.isnull().sum()` を実行し、どの列に何件の欠損があるか確認しましょう。\n4. `fillna()` を使って欠損値を0、または適切な既定値で埋めてください。\n5. 金額に消費税（10%）を加えた新しい列 `amount_with_tax` を追加してください。\n6. `groupby()` を使って、顧客ごとの合計金額を集計してください。\n7. SQLで同じ集計をした場合の書き方（`GROUP BY`）と、pandasでの書き方を見比べて、対応関係をメモしておきましょう。",
        modelAnswerContent:
          "**模範解答**\n\n```python\nimport pandas as pd\n\ndf = pd.DataFrame({\n    \"customer\": [\"田中\", \"鈴木\", \"佐藤\"],\n    \"amount\": [3000, None, 5400],\n})\nprint(df.isnull().sum())\n\ndf[\"amount\"] = df[\"amount\"].fillna(0)\ndf[\"amount_with_tax\"] = df[\"amount\"] * 1.1\n\nsummary = df.groupby(\"customer\")[\"amount\"].sum().reset_index()\nprint(summary)\n```\n\nSQLの`GROUP BY 列名`が、pandasでは`.groupby(\"列名\")`に対応します。",
        outcomes: [
          "pandasで欠損値の確認・補完ができる",
          "pandasのgroupbyでSQLのGROUP BYに相当する集計ができる",
        ],
        relatedJobs: ["Data Engineer Intern", "Data Analyst", "Analytics Engineer"],
        skillTags: ["pandas", "欠損値処理"],
        referenceLinks: [
          { label: "pandas公式ドキュメント", url: "https://pandas.pydata.org/docs/user_guide/index.html" },
          { label: "pandas: 欠損値の扱い", url: "https://pandas.pydata.org/docs/user_guide/missing_data.html" },
        ],
        quizzes: [
          {
            question: "pandasのDataFrameで欠損値を既定値に置き換えるメソッドはどれですか？",
            options: [
              { label: "dropna()", isCorrect: false },
              { label: "fillna()", isCorrect: true },
              { label: "isnull()", isCorrect: false },
            ],
          },
        ],
      },
    ],
  },
  {
    slug: "data-modeling-fundamentals",
    title: "データモデリング基礎編",
    description: "ディメンションとファクト、スタースキーマなど、分析基盤の設計に欠かせない考え方を学びます。",
    missionText:
      "このレベルに到達すると、データ分析の下準備と簡単なパイプライン構築に参加できるようになります。",
    closingColumn:
      "## コラム：良い設計は「見えない」\n\nデータモデリングの成果は、地味です。うまく設計されたテーブル群は「当たり前に使えて当たり前」に見え、誰も褒めてくれません。逆に設計が悪いと、半年後には誰も触りたがらない厄介なテーブルになります。\n\nファクト/ディメンションやSCDという考え方は、まさに「後から困らないための投資」です。今は地味に感じるかもしれませんが、実務でこの視点を持っている人は驚くほど少なく、確実に差別化要因になります。次はいよいよDatabricksそのものに入っていきます。",
    level: 1,
    lessons: [
      {
        slug: "fact-dimension",
        title: "ファクトテーブルとディメンションテーブル",
        type: LessonType.TEXT,
        attentionText:
          "「売上を、月別に見たい」「いや地域別でも見たい」「顧客別も」——分析の切り口は毎回変わるのに、なぜ同じ売上データで対応できるのでしょうか？",
        relevanceText:
          "ファクト/ディメンションという設計の型を知ることは、Analytics Engineerとして「分析しやすいデータ基盤を設計できる」という評価に直結する、実務データモデリングの必須知識です。",
        lectureContent:
          "## ファクトとディメンション\n\n- **ファクトテーブル**: 売上金額、注文数など「測定値」を持つテーブル\n- **ディメンションテーブル**: 顧客、商品、日付など「切り口」を持つテーブル\n\nこの分離により、様々な切り口で同じ指標を分析できるようになります（スタースキーマ）。",
        exampleContent:
          "`fact_sales`（売上ファクト）と `dim_customer`（顧客ディメンション）、`dim_date`（日付ディメンション）を組み合わせることで、「月別」「顧客別」「地域別」など多様な集計が可能になります。",
        handsOnContent:
          "**ハンズオン課題**\n\n1. あなたが知っているサービス（ECサイト、動画配信サービスなど）を1つ選びます。\n2. そのサービスで「測定したい数値」を3つ書き出してください（例：注文金額、視聴時間、クリック数）。\n3. その数値を持つファクトテーブルの名前と列構成を設計してください（例：`fact_orders(order_id, customer_id, product_id, date_id, amount)`）。\n4. ファクトテーブルが参照する切り口（ディメンション）を最低3つ挙げ、それぞれのディメンションテーブルの列構成も設計してください（例：`dim_customer`, `dim_product`, `dim_date`）。\n5. 設計した表同士を、どの列（外部キー）で結びつけるかを矢印付きの図やメモで書き出してみましょう（スタースキーマの形になっているか確認）。",
        modelAnswerContent:
          "**模範解答例（動画配信サービスの場合）**\n\n- 測定したい数値：視聴時間、視聴回数、評価スコア\n- ファクトテーブル：`fact_playback(playback_id, user_id, content_id, date_id, watch_seconds)`\n- ディメンション：`dim_user(user_id, plan_type, region)`、`dim_content(content_id, genre, release_year)`、`dim_date(date_id, year, month, day_of_week)`\n\n`fact_playback`が3つのディメンションテーブルとそれぞれの主キー（`user_id`, `content_id`, `date_id`）で結びつく、中心にファクトを置いた星形（スタースキーマ）の構造になっていればOKです。",
        outcomes: ["ファクト/ディメンションの違いを説明できる", "スタースキーマの基本構造をイメージできる"],
        relatedJobs: ["Analytics Engineer", "Junior Data Engineer"],
        skillTags: ["ファクトテーブル", "ディメンション", "スタースキーマ"],
        referenceLinks: [
          { label: "Qiita: スタースキーマをわかりやすく解説", url: "https://qiita.com/search?q=%E3%82%B9%E3%82%BF%E3%83%BC%E3%82%B9%E3%82%AD%E3%83%BC%E3%83%9E+%E3%82%8F%E3%81%8B%E3%82%8A%E3%82%84%E3%81%99%E3%81%8F" },
          { label: "Databricks: メダリオンアーキテクチャ", url: "https://www.databricks.com/glossary/medallion-architecture" },
        ],
        quizzes: [
          {
            question: "「売上金額」のような測定値を持つテーブルは何と呼ばれますか？",
            options: [
              { label: "ディメンションテーブル", isCorrect: false },
              { label: "ファクトテーブル", isCorrect: true },
              { label: "マスタテーブル", isCorrect: false },
            ],
          },
        ],
      },
      {
        slug: "slowly-changing-dimension",
        title: "Slowly Changing Dimension（SCD）：変化する属性の記録方法",
        type: LessonType.TEXT,
        attentionText:
          "顧客が引っ越したら、住所データを単純に上書きしていいのでしょうか？もし「引っ越し前の売上データを、当時の地域別に再集計したい」と言われたら？",
        relevanceText:
          "SCDのような「変化する現実をどう記録するか」という設計判断ができることは、実務経験者らしいデータモデリング力として評価され、Analytics Engineer/Data Engineer案件での信頼につながります。",
        lectureContent:
          "## SCDとは何か\n\nSlowly Changing Dimension（緩やかに変化するディメンション）とは、ディメンションテーブルの属性が時間経過とともに変化する現象、およびその扱い方の設計パターンです。代表的なものに以下があります。\n\n- **SCD Type 1（上書き）**: 古い値を新しい値で単純に上書きする。過去の状態は残らない。\n- **SCD Type 2（履歴保持）**: 変更があるたびに新しい行を追加し、`有効開始日` `有効終了日` などの列で有効期間を管理する。過去の状態を後から参照できる。\n\n実務では「過去のレポートを再現できるか」という要件によって、Type 1で十分か、Type 2が必要かが決まります。",
        exampleContent:
          "例えば顧客が引っ越して都道府県が変わった場合、SCD Type 1では顧客マスタの都道府県を単純に書き換えます。SCD Type 2では、`customer_id=1, prefecture='東京', valid_from=2025-01-01, valid_to=2026-03-01` という行を残しつつ、`customer_id=1, prefecture='大阪', valid_from=2026-03-01, valid_to=NULL` という新しい行を追加します。こうすることで「2026年1月時点でこの顧客がどこに住んでいたか」を後から再現できます。",
        handsOnContent:
          "**ハンズオン課題**\n\n1. 「顧客の居住都道府県」を例に、SCD Type 1（上書き）で管理した場合の顧客マスタの状態を、引っ越し前・引っ越し後の2時点でそれぞれ書き出してみましょう。\n2. 同じ例を、SCD Type 2（履歴保持、`valid_from`/`valid_to`列を使う）で管理した場合の状態を書き出してみましょう。\n3. 「引っ越し前の売上を、当時の都道府県別に集計し直したい」という要件に対して、Type 1とType 2のどちらの設計が対応できるかを考え、理由を1〜2行で書いてください。\n4. 自分の題材（会員ランク、価格プランなど、時間とともに変わりうる属性）を1つ選び、SCD Type 2で管理する場合のテーブル構成を設計してみましょう。",
        modelAnswerContent:
          "**模範解答**\n\n- Type 1（上書き）：`customer_id=1, prefecture='大阪'`のみが残り、引っ越し前の「東京」だった記録は失われる\n- Type 2（履歴保持）：\n  - `customer_id=1, prefecture='東京', valid_from=2025-01-01, valid_to=2026-03-01`\n  - `customer_id=1, prefecture='大阪', valid_from=2026-03-01, valid_to=NULL`\n- 「引っ越し前の売上を当時の都道府県別に再集計したい」という要件には、当時の値を保持しているType 2でなければ対応できません（Type 1では過去の状態が上書きで消えてしまうため）。",
        outcomes: [
          "SCD Type 1とType 2の違いを説明できる",
          "履歴を残す必要がある場合の設計パターンをイメージできる",
        ],
        relatedJobs: ["Analytics Engineer", "Data Engineer"],
        skillTags: ["SCD Type 2", "履歴管理"],
        referenceLinks: [
          { label: "Qiita: Slowly Changing Dimension(SCD)を解説", url: "https://qiita.com/search?q=Slowly+Changing+Dimension+SCD+%E8%A7%A3%E8%AA%AC" },
        ],
        quizzes: [
          {
            question: "変更履歴を残すために新しい行を追加し、有効期間を列で管理する設計は何と呼ばれますか？",
            options: [
              { label: "SCD Type 1", isCorrect: false },
              { label: "SCD Type 2", isCorrect: true },
              { label: "スタースキーマ", isCorrect: false },
            ],
          },
        ],
      },
    ],
  },
  {
    slug: "databricks-lakehouse-intro",
    title: "Databricksとlakehouseの基礎",
    description: "Databricksが提唱するLakehouseアーキテクチャの考え方と、Workspaceの基本構成を学びます。",
    missionText:
      "このレベルに到達すると、Databricksの全体像を理解し、実際の操作に自信を持って進めるようになります。",
    closingColumn:
      "## コラム：「触ったことがある」と「わかっている」の違い\n\nDatabricksの求人票を眺めると、Lakehouse・Unity Catalog・クラスタ管理・CLIといった単語が並びます。これらを「聞いたことがある」状態から「仕組みを説明できる」状態に引き上げたのが、このコースです。\n\n特にUnity Catalogによる権限管理やクラスタコストの考え方は、実務未経験者が見落としがちな領域です。ここを押さえているだけで、面接での説得力が変わります。次はDelta LakeとJobsで、実際にデータを動かす感覚を掴んでいきましょう。",
    level: 2,
    lessons: [
      {
        slug: "what-is-lakehouse",
        title: "Lakehouseとは何か",
        type: LessonType.TEXT,
        attentionText:
          "「Databricksって結局何なの？」——求人票でよく見かけるこの単語の正体を、ここでようやく明らかにします。",
        relevanceText:
          "Lakehouseの概念を理解することは、この後すべてのDatabricksコンテンツを学ぶ土台になり、面接で「Databricksを使ったことがある」と自信を持って言うための第一歩です。",
        lectureContent:
          "## データウェアハウス・データレイク・Lakehouse\n\n- **データウェアハウス**: 構造化データに強いが、柔軟性やコストに課題\n- **データレイク**: あらゆる形式のデータを安価に貯められるが、品質管理が難しい\n- **Lakehouse**: データレイクの上にウェアハウス的な信頼性・管理機能を載せたアーキテクチャ\n\nDatabricksはこのLakehouseをDelta Lakeという技術で実現しています。",
        exampleContent:
          "例えば、生ログデータ（非構造化）をそのまま安価に保存しつつ、そこから整形したテーブルに対してSQLで高速に分析できるのがLakehouseの強みです。",
        handsOnContent:
          "**ハンズオン課題（Databricks Free Edition）**\n\n1. https://www.databricks.com/try-databricks からDatabricks Free Editionにサインアップします（メールアドレスのみで登録可能）。\n2. 初回ログイン後に表示されるWorkspaceのトップ画面をひととおり眺め、左側のサイドメニュー（Workspace, Catalog, Jobs & Pipelines, Compute など）を確認してください。\n3. 左メニューの「Catalog」をクリックし、`samples` というカタログの中に `tpch` などのスキーマ（データベース）があることを確認しましょう。\n4. `samples.tpch.orders` テーブルをクリックし、右側に表示されるスキーマ（列名・型）とサンプル行を確認してください。\n5. 「これはデータレイク的な柔軟性と、ウェアハウス的なスキーマ管理の両方を兼ね備えている」という感覚を、自分の言葉で1〜2行にまとめてみましょう。",
        modelAnswerContent:
          "**模範解答例**\n\nLakehouseは、データレイクの「あらゆる形式のデータを安価に貯められる柔軟性」と、データウェアハウスの「スキーマ管理やSQLでの高速分析といった信頼性」を両立させたアーキテクチャです。`samples.tpch.orders`のようにスキーマが管理されたテーブルとしてSQLで即座に分析できる一方、生ログのような非構造化データも同じ基盤に安価に貯められる点が、この2つを兼ね備えている感覚に当たります。",
        outcomes: ["Lakehouseの概念を説明できる", "Databricks Workspaceにログインできる"],
        relatedJobs: ["Junior Data Engineer", "Analytics Engineer（初級）"],
        skillTags: ["Lakehouse"],
        referenceLinks: [
          { label: "Databricksとは（公式）", url: "https://www.databricks.com/product/data-lakehouse" },
          { label: "Databricksドキュメント: Lakehouseの基礎", url: "https://docs.databricks.com/en/lakehouse/index.html" },
        ],
        quizzes: [
          {
            question: "データレイクとウェアハウスの良さを組み合わせた概念を何と呼びますか？",
            options: [
              { label: "Data Mart", isCorrect: false },
              { label: "Lakehouse", isCorrect: true },
              { label: "Data Silo", isCorrect: false },
            ],
          },
        ],
      },
      {
        slug: "workspace-tour",
        title: "Databricks Workspaceの基本構成",
        type: LessonType.EXERCISE,
        attentionText:
          "初めて開く管理画面やツールに戸惑った経験はありませんか？Databricksも同じで、最初に全体像を知っておくだけで学習効率が大きく変わります。",
        relevanceText:
          "Workspaceの構成（Notebook・Cluster・Catalog・Jobs）を理解することは、この先のすべてのハンズオン課題をスムーズにこなすための実務的な土台になります。",
        lectureContent:
          "## Workspaceの主要な要素\n\n- **Notebook**: SQL/Pythonなどのコードを対話的に実行する場所\n- **Cluster**: コードを実行する計算リソース\n- **Catalog**: テーブルやデータへのアクセスを管理する仕組み（Unity Catalog）\n- **Jobs / Workflows**: ノートブックなどを定期実行するための機能\n\nこれらは独立した機能ではなく、「Notebookで書いたコードを、Clusterで実行し、Catalog内のデータを読み書きし、その一連の処理をJobsでスケジュール実行する」という一連の流れでつながっています。",
        exampleContent:
          "毎朝決まった時間にETL処理を実行したい場合は、ノートブックを作成し、それをJobsに登録してスケジュール実行させます。実行にはComputeクラスタが必要で、クラスタのサイズやAuto-terminate設定によってコストが変わります。",
        handsOnContent:
          "**ハンズオン課題**\n\n1. Databricks Free Editionの左メニューから「Workspace」→「Create」→「Notebook」で新しいNotebookを作成してください（言語はPython）。\n2. 1つ目のセルに `print(\"Hello Databricks\")` と入力し、`Shift+Enter` で実行します。\n3. Notebook右上のCompute選択欄で、割り当てられているクラスタ（Serverless Compute等）の名前を確認してください。\n4. 2つ目のセルで `spark.sql(\"SHOW CATALOGS\").show()` を実行し、アクセス可能なカタログの一覧を表示してみましょう。\n5. 左メニューの「Jobs & Pipelines」を開き、まだJobが1つも無いことを確認してください（次のレッスン以降で実際にJobを作成します）。\n6. Notebookに名前を付けて保存し、Workspace上のどこに保存されたか（フォルダ構成）を確認しましょう。",
        modelAnswerContent:
          "**模範解答**\n\n```python\nprint(\"Hello Databricks\")\n```\n```sql\nSHOW CATALOGS;\n```\n\nNotebookは右上のCompute欄で割り当てられたクラスタ（Serverless Computeなど）上で実行され、`SHOW CATALOGS`で`samples`や`main`といったアクセス可能なカタログ一覧が確認できます。",
        outcomes: ["Notebook/Cluster/Catalog/Jobsの役割を説明できる", "Notebookを作成しコードを実行できる"],
        relatedJobs: ["Junior Data Engineer", "Analytics Engineer（初級）"],
        skillTags: ["Databricks Workspace", "Notebook"],
        referenceLinks: [
          { label: "Databricks Workspaceの概要", url: "https://docs.databricks.com/en/workspace/index.html" },
        ],
        quizzes: [
          {
            question: "コードを定期的に自動実行するためのDatabricksの機能はどれですか？",
            options: [
              { label: "Notebook", isCorrect: false },
              { label: "Jobs", isCorrect: true },
              { label: "Catalog", isCorrect: false },
            ],
          },
        ],
      },
      {
        slug: "unity-catalog-governance",
        title: "Unity Catalogとデータガバナンス",
        type: LessonType.TEXT,
        attentionText:
          "会社の全データに全社員がアクセスできる状態を想像してみてください。便利どころか、個人情報漏洩のリスクだらけです。",
        relevanceText:
          "Unity Catalogのようなガバナンスの知識は、実務のDatabricks案件では避けて通れない領域です。ここを理解しているかどうかで、実務未経験でも「現場を分かっている」という印象を与えられます。",
        lectureContent:
          "## Unity Catalogとは\n\nUnity Catalogは、Databricks上のすべてのデータ資産（テーブル、ビュー、ボリューム、モデルなど）を一元管理する仕組みです。データは以下の3階層で整理されます。\n\n```\nカタログ (Catalog)\n  └ スキーマ (Schema / Database)\n      └ テーブル (Table)\n```\n\n例えば `samples.tpch.orders` は「`samples` カタログの `tpch` スキーマにある `orders` テーブル」を意味します。\n\n## アクセス権限の管理\n\nUnity Catalogでは、SQLの `GRANT` 文でカタログ・スキーマ・テーブル単位に権限を付与できます。\n\n```sql\nGRANT SELECT ON TABLE analytics.sales.orders TO `data-analysts`;\nGRANT ALL PRIVILEGES ON SCHEMA analytics.sales TO `data-engineers`;\n```\n\nこれにより、「分析チームは特定のテーブルを読むだけ」「エンジニアチームはスキーマ全体を管理できる」といった、実務で求められる細かいアクセス制御が可能になります。",
        exampleContent:
          "実務では、個人情報を含むテーブルへのアクセスを一部のロールだけに限定し、それ以外のテーブルは分析チーム全体に公開する、といった使い分けがよく行われます。Unity Catalogの権限管理により、こうした「最小権限の原則」をデータ基盤レベルで実現できます。",
        handsOnContent:
          "**ハンズオン課題**\n\n1. Databricks Free Editionの左メニューから「Catalog」を開き、カタログ一覧の階層構造（カタログ→スキーマ→テーブル）を確認してください。\n2. `samples` カタログを展開し、複数のスキーマ（`tpch`, `nyctaxi` など）が存在することを確認しましょう。\n3. 任意のテーブルをクリックし、「Permissions」タブ（権限表示、Free Editionでは一部表示のみの場合があります）を確認してください。\n4. SQL Editorで `SHOW GRANTS ON TABLE samples.tpch.orders;` を実行し、結果を確認してみましょう（権限が無い/表示されない場合もありますが、コマンドの存在自体を確認することが目的です）。\n5. もし自分でスキーマを作成できる権限がある場合は、`CREATE SCHEMA IF NOT EXISTS main.my_practice;` を実行し、独自のスキーマを作成してみましょう。",
        modelAnswerContent:
          "**模範解答**\n\n```sql\nSHOW GRANTS ON TABLE samples.tpch.orders;\n\nCREATE SCHEMA IF NOT EXISTS main.my_practice;\n\nGRANT SELECT ON TABLE analytics.sales.orders TO `data-analysts`;\nGRANT ALL PRIVILEGES ON SCHEMA analytics.sales TO `data-engineers`;\n```\n\n`samples`カタログの中に`tpch`や`nyctaxi`など複数のスキーマがあり、その中にテーブルが並ぶ「カタログ→スキーマ→テーブル」の3階層になっていることを確認できていればOKです。",
        outcomes: [
          "カタログ・スキーマ・テーブルの3階層構造を説明できる",
          "GRANT文による権限管理の考え方を理解している",
        ],
        relatedJobs: ["Junior Data Engineer", "Data Engineer", "Analytics Engineer"],
        skillTags: ["Unity Catalog", "GRANT文"],
        referenceLinks: [
          { label: "Databricks: Unity Catalogとは", url: "https://docs.databricks.com/en/data-governance/unity-catalog/index.html" },
        ],
        quizzes: [
          {
            question: "Unity Catalogにおけるデータの3階層構造として正しいものはどれですか？",
            options: [
              { label: "カタログ → スキーマ → テーブル", isCorrect: true },
              { label: "テーブル → カタログ → スキーマ", isCorrect: false },
              { label: "スキーマ → テーブル → カタログ", isCorrect: false },
            ],
          },
        ],
      },
      {
        slug: "cluster-compute-management",
        title: "クラスタとコンピュートの管理",
        type: LessonType.TEXT,
        attentionText:
          "「気づいたらクラウドの請求額が跳ね上がっていた」——クラスタを起動しっぱなしにしたことが原因、というのはデータエンジニアあるあるの失敗談です。",
        relevanceText:
          "クラスタとコストの関係を理解していることは、実務でいきなり高額請求を出さない「安心して任せられるエンジニア」であることの証明になります。",
        lectureContent:
          "## クラスタの種類\n\n- **All-Purpose Cluster**: Notebookでの対話的な開発・分析に使う。複数人・複数Notebookで共有可能。\n- **Job Cluster**: Jobの実行時にだけ自動的に起動し、実行後に自動終了するクラスタ。開発用より低コスト。\n- **Serverless Compute**: クラスタのサイジングや起動をDatabricks側が自動管理してくれる方式。設定の手間が少ない。\n\n## コストに関わる設定\n\n- **Auto Termination（自動停止）**: 一定時間操作が無いとクラスタを自動停止し、無駄な課金を防ぐ\n- **ワーカー数（オートスケーリング）**: 処理量に応じて自動的にワーカーノード数を増減させる\n- **インスタンスタイプ**: CPU/メモリ量によって時間あたりのコストが変わる\n\n個人学習や小規模な検証では、Auto Terminationを短め（例：15〜30分）に設定し、使い終わったら明示的に停止することが、無料枠を効率よく使うコツです。",
        exampleContent:
          "例えば、開発中は小さめのAll-Purpose Clusterで試行錯誤し、本番のバッチ処理は夜間にJob Clusterとして起動・実行・自動終了させる、という使い分けが一般的です。こうすることで、開発の柔軟性と本番運用のコスト効率を両立できます。",
        handsOnContent:
          "**ハンズオン課題**\n\n1. Databricks Free Editionの左メニューから「Compute」を開き、利用可能なコンピュート（Serverless Compute等）の一覧を確認してください。\n2. コンピュートの詳細画面で、Auto Termination（自動停止）に関する設定項目があるか確認しましょう。\n3. 現在実行中、または過去に実行したNotebookが、どのコンピュートを使って実行されたかを確認してください。\n4. もしクラスタ作成の権限がある場合は、小さなクラスタ（最小構成）を作成し、Auto Terminationを15分に設定してみましょう（Free Editionでは作成できない場合、設定画面を確認するだけでも構いません）。\n5. 「開発用」と「本番バッチ用」でクラスタ構成をどう使い分けるべきか、自分の言葉で2〜3行にまとめてみましょう。",
        modelAnswerContent:
          "**模範解答**\n\n- All-Purpose Cluster：開発中の対話的な試行錯誤に使う。人が起動・停止する前提のため、Auto Terminationを15〜30分程度に短く設定しておくと無駄なコストを防げる\n- Job Cluster：Job実行時にのみ自動起動し、実行後は自動終了するため開発用より低コスト\n- 使い分け：開発は小さめのAll-Purpose Clusterで試行錯誤し、本番のバッチ処理は夜間にJob Clusterとして起動・実行・自動終了させることで、開発の柔軟性と本番のコスト効率を両立させる。",
        outcomes: [
          "All-Purpose ClusterとJob Clusterの違いを説明できる",
          "Auto Terminationなどコストに関わる設定の重要性を理解している",
        ],
        relatedJobs: ["Junior Data Engineer", "Data Engineer"],
        skillTags: ["クラスタ管理", "Auto Termination"],
        referenceLinks: [
          { label: "Databricks Compute（クラスタ）の概要", url: "https://docs.databricks.com/en/compute/index.html" },
        ],
        quizzes: [
          {
            question: "一定時間操作が無いとクラスタを自動的に停止し、コストを抑える設定は何と呼ばれますか？",
            options: [
              { label: "Auto Termination", isCorrect: true },
              { label: "Auto Scaling", isCorrect: false },
              { label: "Job Cluster", isCorrect: false },
            ],
          },
        ],
      },
      {
        slug: "databricks-cli-repos",
        title: "Databricks CLIとRepos：コードのバージョン管理",
        type: LessonType.EXERCISE,
        attentionText:
          "「あのNotebook、誰がいつ何を変更したんだっけ？」——コードの変更履歴が追えないと、チームでの開発は簡単に破綻します。",
        relevanceText:
          "Git連携やCLI操作は、個人学習の延長ではなく「チームで実務を回せる」ことの証明です。副業案件でチーム開発に加わる際に必須となるスキルです。",
        lectureContent:
          "## Databricks Repos：Git連携\n\nDatabricks Reposは、GitHubなどのGitリポジトリをWorkspace内に直接クローンし、Notebookをブランチ管理・プルリクエストの対象にできる機能です。これにより、\n\n- 複数人での共同開発時の変更履歴管理\n- レビューを経てから本番用ブランチにマージする運用\n- 誤って上書き・削除してしまった際の復元\n\nが可能になります。\n\n## Databricks CLI\n\nDatabricks CLIは、ターミナルからWorkspace・Job・クラスタなどを操作するためのコマンドラインツールです。CI/CDパイプラインにDatabricksの操作を組み込む際によく使われます。\n\n```bash\n# CLIの認証設定\ndatabricks configure --token\n\n# Workspace内のファイル一覧を確認\ndatabricks workspace list /Users/you@example.com\n\n# Jobの一覧を確認\ndatabricks jobs list\n```",
        exampleContent:
          "実務では、「Notebookで書いたETLロジックをGitHubのリポジトリで管理し、mainブランチにマージされたらCI/CDが自動的にDatabricks CLIを使ってJobを更新する」という運用がよく行われます。これにより、手作業でのNotebookコピー&ペーストによるミスを防げます。",
        handsOnContent:
          "**ハンズオン課題**\n\n1. Databricks Free Editionの左メニューから「Repos」（またはWorkspace内のRepos機能）を確認してください。\n2. 可能であれば、ご自身のGitHubアカウントで空のパブリックリポジトリを1つ作成してください。\n3. Databricks上でそのリポジトリをクローン（Add Repo）してみましょう（Free Editionでの利用可否は環境によって異なります。できない場合は画面構成の確認のみで構いません）。\n4. ローカルPCがある場合は、`pip install databricks-cli` でCLIをインストールし、`databricks --version` でインストールを確認してください。\n5. `databricks configure --token` を試し、認証にWorkspace URLとPersonal Access Tokenが必要になることを確認しましょう（トークンの発行はUser Settings画面から行います）。",
        modelAnswerContent:
          "**模範解答**\n\n```bash\npip install databricks-cli\ndatabricks --version\ndatabricks configure --token\n\ndatabricks workspace list /Users/you@example.com\ndatabricks jobs list\n```\n\nReposはNotebookをGitでブランチ管理・レビュー・復元できるようにする機能、CLIはターミナルからWorkspace/Job/クラスタを操作する手段であり、`configure --token`にはWorkspace URLとPersonal Access Tokenの認証情報が必要になる点を確認できていればOKです。",
        outcomes: [
          "Databricks ReposによるGit連携の目的を説明できる",
          "Databricks CLIの基本的な使い方をイメージできる",
        ],
        relatedJobs: ["Data Engineer", "Analytics Engineer"],
        skillTags: ["Databricks CLI", "Databricks Repos"],
        referenceLinks: [
          { label: "Databricks Repos（Git連携）", url: "https://docs.databricks.com/en/repos/index.html" },
          { label: "Databricks CLIドキュメント", url: "https://docs.databricks.com/en/dev-tools/cli/index.html" },
        ],
        quizzes: [
          {
            question: "GitHubなどのリポジトリをWorkspace内でクローンし、Notebookをバージョン管理する機能はどれですか？",
            options: [
              { label: "Databricks Repos", isCorrect: true },
              { label: "Unity Catalog", isCorrect: false },
              { label: "Auto Loader", isCorrect: false },
            ],
          },
        ],
      },
    ],
  },
  {
    slug: "delta-lake-jobs",
    title: "Delta LakeとJobsの基礎",
    description: "Databricksの中核技術であるDelta Lakeの特徴と、Jobsによる自動実行の基本を学びます。",
    missionText:
      "このコースを終えると、Databricksを使って簡単なデータパイプラインを運用できるようになります。",
    closingColumn:
      "## コラム：信頼できるデータは、誰かへの敬意である\n\nMERGEで重複を防ぎ、Auto Loaderで取りこぼしなく取り込み、DLTで宣言的にパイプラインを組む——これらはすべて「データを使う人を裏切らないため」の技術です。数字を見て意思決定する人にとって、その数字が正しいことは当たり前ではありません。\n\nあなたがここで学んだ「信頼できるデータを作る技術」は、地味に見えて実は最も評価される実務スキルの一つです。次のETLパイプライン設計では、この信頼性をさらに体系立てて学んでいきます。",
    level: 2,
    lessons: [
      {
        slug: "delta-lake-basics",
        title: "Delta Lakeとは何か",
        type: LessonType.TEXT,
        attentionText:
          "「昨日までは正しかった集計結果が、今日は違う……」データが知らないうちに壊れていたら、どうやって原因を突き止めますか？",
        relevanceText:
          "Delta Lakeのタイムトラベルやトランザクション管理を理解することは、Databricksを名乗る上で避けて通れない中核知識であり、実務のDelta Lake案件に対応できる自信の土台になります。",
        lectureContent:
          "## Delta Lakeの特徴\n\n- **ACIDトランザクション**: データの整合性を保証\n- **タイムトラベル**: 過去の任意の時点のデータを参照可能\n- **スキーマ管理**: テーブル構造の変更を安全に管理\n\nこれらにより、データレイクでも信頼性の高いテーブル管理が可能になります。",
        exampleContent:
          "```sql\n-- 1時間前のテーブルの状態を確認する（タイムトラベル）\nSELECT * FROM orders VERSION AS OF 3;\n```",
        handsOnContent:
          "**ハンズオン課題**\n\n1. Databricks Free Editionの新しいNotebookで、以下を実行しDeltaテーブルを作成します。\n   ```sql\n   CREATE TABLE IF NOT EXISTS main.default.practice_orders (\n     order_id INT, customer_name STRING, amount DOUBLE\n   );\n   INSERT INTO main.default.practice_orders VALUES (1, '田中', 3000);\n   ```\n2. `UPDATE main.default.practice_orders SET amount = 3500 WHERE order_id = 1;` を実行し、データを更新します。\n3. `DESCRIBE HISTORY main.default.practice_orders;` を実行し、バージョン0（作成）、1（INSERT）、2（UPDATE）のような変更履歴が記録されていることを確認しましょう。\n4. `SELECT * FROM main.default.practice_orders VERSION AS OF 1;` を実行し、UPDATE前の状態（amount=3000）が見られることを確認してください。\n5. 最後に自分でもう1件INSERTし、再度 `DESCRIBE HISTORY` を実行して履歴が増えていることを確認しましょう。",
        modelAnswerContent:
          "**模範解答**\n\n```sql\nCREATE TABLE IF NOT EXISTS main.default.practice_orders (\n  order_id INT, customer_name STRING, amount DOUBLE\n);\nINSERT INTO main.default.practice_orders VALUES (1, '田中', 3000);\nUPDATE main.default.practice_orders SET amount = 3500 WHERE order_id = 1;\n\nDESCRIBE HISTORY main.default.practice_orders;\n-- version 0: CREATE TABLE, version 1: INSERT, version 2: UPDATE\n\nSELECT * FROM main.default.practice_orders VERSION AS OF 1;\n-- amount = 3000（UPDATE前の状態）\n```",
        outcomes: ["Delta Lakeの主要な特徴を説明できる", "Deltaテーブルの変更履歴を確認できる"],
        relatedJobs: ["Junior Data Engineer", "Analytics Engineer（初級）"],
        skillTags: ["Delta Lake", "タイムトラベル"],
        referenceLinks: [
          { label: "Databricks: Delta Lakeとは", url: "https://docs.databricks.com/en/delta/index.html" },
        ],
        quizzes: [
          {
            question: "Delta Lakeで過去の状態のデータを参照できる機能を何と呼びますか？",
            options: [
              { label: "タイムトラベル", isCorrect: true },
              { label: "オートスケール", isCorrect: false },
              { label: "パーティショニング", isCorrect: false },
            ],
          },
        ],
      },
      {
        slug: "delta-merge-optimize-vacuum",
        title: "MERGE・OPTIMIZE・VACUUM：Delta Lakeの実務操作",
        type: LessonType.EXERCISE,
        attentionText:
          "毎日全件を洗い替えていたら、データ量が増えるにつれ処理時間もクラウド代もどんどん膨らんでいく——そんな運用、続けられますか？",
        relevanceText:
          "MERGE・OPTIMIZE・VACUUMは、実務のDelta Lake運用で毎日のように使われるコマンドです。ここを扱えることは、求人票の「Delta Lake運用経験」に直結します。",
        lectureContent:
          "## MERGE（Upsert）\n\nMERGEは、既存の行があれば更新し、無ければ挿入する「Upsert」処理です。日次バッチで最新データを反映する際の定番パターンです。\n\n```sql\nMERGE INTO customers AS target\nUSING staging_customers AS source\nON target.customer_id = source.customer_id\nWHEN MATCHED THEN UPDATE SET target.email = source.email\nWHEN NOT MATCHED THEN INSERT (customer_id, email) VALUES (source.customer_id, source.email);\n```\n\n## OPTIMIZEとZ-Ordering\n\n小さなファイルが大量にできると読み取り性能が落ちます。`OPTIMIZE` はファイルを最適なサイズに統合します。\n\n```sql\nOPTIMIZE sales.orders ZORDER BY (customer_id);\n```\n\n## VACUUM\n\nDelta Lakeはタイムトラベルのために古いファイルを残しますが、`VACUUM` で一定期間より古い不要ファイルを物理削除し、ストレージコストを抑えます。\n\n```sql\nVACUUM sales.orders RETAIN 168 HOURS; -- 7日間より古いファイルを削除\n```",
        exampleContent:
          "日次バッチで顧客マスタを更新する場合、全件洗い替えではなく `MERGE` を使うことで、変更があった顧客だけを効率的に反映できます。その後、週次で `OPTIMIZE` と `VACUUM` を実行し、パフォーマンスとストレージコストを維持します。",
        handsOnContent:
          "**ハンズオン課題**\n\n1. 前のレッスンで作った `practice_orders` に加え、`practice_orders_staging` という一時テーブルを作り、既存customer_idの更新データと新規customer_idの行を1件ずつ用意します。\n2. `MERGE INTO` 文を書き、staging側のデータをpractice_ordersに反映させてください（既存分は更新、新規分は挿入）。\n3. 実行後に `SELECT * FROM practice_orders;` で結果を確認し、意図通りUpsertされているか確認しましょう。\n4. `OPTIMIZE main.default.practice_orders;` を実行してみましょう（データ量が少ないため効果は体感できませんが、コマンドがエラーなく実行できることを確認してください）。\n5. `DESCRIBE HISTORY` で `VACUUM` や `OPTIMIZE` の実行がバージョン履歴に記録されるか確認しましょう。",
        modelAnswerContent:
          "**模範解答**\n\n```sql\nMERGE INTO practice_orders AS target\nUSING practice_orders_staging AS source\nON target.customer_id = source.customer_id\nWHEN MATCHED THEN UPDATE SET target.amount = source.amount\nWHEN NOT MATCHED THEN INSERT (customer_id, amount) VALUES (source.customer_id, source.amount);\n\nOPTIMIZE main.default.practice_orders;\n\nDESCRIBE HISTORY main.default.practice_orders;\n```\n\nMERGE実行後、既存customer_idの行は更新され、新規customer_idの行は追加（Upsert）されていること、`DESCRIBE HISTORY`にMERGEやOPTIMIZEの操作が記録されていることを確認できていればOKです。",
        outcomes: [
          "MERGE文でUpsert処理を実装できる",
          "OPTIMIZEとVACUUMの目的の違いを説明できる",
        ],
        relatedJobs: ["Data Engineer", "Analytics Engineer"],
        skillTags: ["MERGE文", "OPTIMIZE", "VACUUM"],
        referenceLinks: [
          { label: "Databricks: DeltaテーブルのMERGE操作", url: "https://docs.databricks.com/en/delta/merge.html" },
          { label: "Databricks: OPTIMIZEとZ-Ordering", url: "https://docs.databricks.com/en/delta/optimize.html" },
        ],
        quizzes: [
          {
            question: "既存の行があれば更新し、無ければ挿入する処理を何と呼びますか？",
            options: [
              { label: "MERGE（Upsert）", isCorrect: true },
              { label: "VACUUM", isCorrect: false },
              { label: "ZORDER", isCorrect: false },
            ],
          },
        ],
      },
      {
        slug: "auto-loader-streaming-ingestion",
        title: "Auto Loaderによる継続的なデータ取り込み",
        type: LessonType.TEXT,
        attentionText:
          "毎朝、新しく届いたファイルだけを手作業で確認してデータベースに取り込む——それを365日続けられますか？",
        relevanceText:
          "Auto Loaderのような自動取り込みの仕組みを理解していることは、「継続的に安定して動くパイプラインを作れる」というDatabricks実務者としての信頼につながります。",
        lectureContent:
          "## Auto Loaderとは\n\nAuto Loaderは、クラウドストレージ（S3, ADLS, GCSなど）に新しいファイルが到着するたびに、それを自動的に検知してDelta Lakeに取り込むDatabricksの機能です。ファイル一覧を毎回スキャンするのではなく、通知の仕組みを使って効率的に新規ファイルだけを検知します。\n\n```python\ndf = (spark.readStream\n      .format(\"cloudFiles\")\n      .option(\"cloudFiles.format\", \"json\")\n      .schema(my_schema)\n      .load(\"/mnt/raw/events/\"))\n\n(df.writeStream\n   .format(\"delta\")\n   .option(\"checkpointLocation\", \"/mnt/checkpoints/events/\")\n   .table(\"bronze.events\"))\n```\n\n## チェックポイントによる「続きから」処理\n\nAuto Loaderは `checkpointLocation` に処理済みファイルの情報を記録するため、途中で処理が止まっても、再開時に「まだ処理していないファイルだけ」を自動的に処理します。これはETLにおける冪等性（同じ処理を繰り返しても結果が変わらないこと）を実現する重要な仕組みです。",
        exampleContent:
          "例えば、IoTセンサーやWebサイトのアクセスログが1分ごとにクラウドストレージへ書き出される場合、Auto Loaderを使うことで「新しいファイルが来たら自動的にDeltaテーブルに追記される」パイプラインを構築でき、バッチジョブを頻繁に手動実行する必要がなくなります。",
        handsOnContent:
          "**ハンズオン課題**\n\n1. Databricksの公式ドキュメント（参考リンク）で、Auto Loaderのサンプルコードを読み、`cloudFiles` フォーマットの指定方法を確認してください。\n2. Databricks Free Editionのノートブックで、`samples` カタログ内にあるサンプルファイル群（利用可能な場合）を対象に、通常の `spark.read` と `spark.readStream.format(\"cloudFiles\")` の書き方の違いをコードとして書き出し比較してみましょう（Free Editionでは実行できる外部ストレージが限られるため、コードの構造理解が目的です）。\n3. `checkpointLocation` オプションが無いとどのようなエラーになるか、ドキュメントで確認してみましょう。\n4. 「バッチ処理」と「Auto Loaderによるストリーム的な取り込み」のメリット・デメリットを、それぞれ2つずつ書き出してみましょう。",
        modelAnswerContent:
          "**模範解答**\n\n```python\ndf = (spark.readStream\n      .format(\"cloudFiles\")\n      .option(\"cloudFiles.format\", \"json\")\n      .schema(my_schema)\n      .load(\"/mnt/raw/events/\"))\n\n(df.writeStream\n   .format(\"delta\")\n   .option(\"checkpointLocation\", \"/mnt/checkpoints/events/\")\n   .table(\"bronze.events\"))\n```\n\n通常の`spark.read`は一括読み込みなのに対し、`spark.readStream.format(\"cloudFiles\")`は新規ファイルの到着を検知し続ける点が異なります。`checkpointLocation`が無いと「どこまで処理したか」を記録できず、途中から再開する冪等な取り込みができません。\n\n- バッチ処理：定時実行・実装がシンプル／リアルタイム性が低い\n- Auto Loader：新規ファイルに即座に反応・冪等な再開が可能／常時起動が前提でリソースを使い続ける",
        outcomes: [
          "Auto Loaderの目的と仕組みを説明できる",
          "チェックポイントによる冪等な取り込みの重要性を理解している",
        ],
        relatedJobs: ["Data Engineer", "Analytics Engineer"],
        skillTags: ["Auto Loader", "チェックポイント"],
        referenceLinks: [
          { label: "Databricks: Auto Loaderとは", url: "https://docs.databricks.com/en/ingestion/auto-loader/index.html" },
        ],
        quizzes: [
          {
            question: "Auto Loaderが「途中から処理を再開」できる理由となる仕組みはどれですか？",
            options: [
              { label: "チェックポイント（checkpointLocation）", isCorrect: true },
              { label: "Unity Catalog", isCorrect: false },
              { label: "クラスタのオートスケーリング", isCorrect: false },
            ],
          },
        ],
      },
      {
        slug: "delta-live-tables-pipelines",
        title: "Delta Live Tables（DLT）による宣言的パイプライン",
        type: LessonType.TEXT,
        attentionText:
          "パイプラインのどこかでエラーが起きたとき、原因のテーブルを探すのに何時間もかかった——そんな経験、したくありませんよね。",
        relevanceText:
          "DLTのような宣言的パイプラインの考え方を知っていることは、モダンなDatabricks案件で「最新の実装方法を理解している」という強みになり、他の学習者と差をつけるポイントです。",
        lectureContent:
          "## 宣言的パイプラインという考え方\n\n通常のETLコードは「まずこれを読み込み、次にこう変換し、最後にここへ書き込む」という手続きを1つずつ記述します。Delta Live Tablesでは、代わりに「このテーブルはこのクエリの結果である」という定義を宣言するだけで、依存関係の解決・実行順序の最適化・エラー処理をDatabricks側が自動的に行います。\n\n```python\nimport dlt\n\n@dlt.table\ndef bronze_orders():\n    return spark.readStream.format(\"cloudFiles\").option(\"cloudFiles.format\", \"json\").load(\"/mnt/raw/orders/\")\n\n@dlt.table\ndef silver_orders():\n    return dlt.read(\"bronze_orders\").filter(\"amount IS NOT NULL\")\n```\n\n## データ品質の組み込み\n\nDLTでは `@dlt.expect` を使い、データ品質のルールをパイプライン定義に直接組み込めます。\n\n```python\n@dlt.table\n@dlt.expect(\"valid_amount\", \"amount > 0\")\ndef silver_orders_checked():\n    return dlt.read(\"bronze_orders\")\n```",
        exampleContent:
          "Bronze（生データ）→ Silver（整形済み）→ Gold（集計済み）という「メダリオンアーキテクチャ」の各層をDLTのテーブル定義として書くことで、パイプライン全体の見通しが良くなり、どのテーブルがどのテーブルに依存しているかが自動的に可視化されます。",
        handsOnContent:
          "**ハンズオン課題**\n\n1. 参考リンクのDatabricks公式ドキュメントで、DLTのサンプルコード（`@dlt.table` の使い方）を読んでください。\n2. Bronze/Silver/Goldの3層構成を、これまで学んだ「Extract/Transform/Load」の用語と対応付けてメモしてみましょう（Bronze=Extract直後の生データ、など）。\n3. `@dlt.expect` を使ったデータ品質チェックの例を1つ、自分で考えて擬似コードとして書いてみましょう（例：「金額が0以上であること」）。\n4. 通常のNotebookで手続き的に書いたETLコードと、DLTで宣言的に書いたコードを見比べ、「どちらが変更に強そうか」を自分の言葉で説明してみましょう。",
        modelAnswerContent:
          "**模範解答**\n\n```python\nimport dlt\n\n@dlt.table\ndef bronze_orders():\n    return spark.readStream.format(\"cloudFiles\").option(\"cloudFiles.format\", \"json\").load(\"/mnt/raw/orders/\")\n\n@dlt.table\n@dlt.expect(\"valid_amount\", \"amount > 0\")\ndef silver_orders():\n    return dlt.read(\"bronze_orders\").filter(\"amount IS NOT NULL\")\n```\n\n- Bronze＝Extract直後の生データ、Silver＝Transform後の整形済みデータ、Gold＝集計済みの分析用データ\n- `@dlt.expect(\"valid_amount\", \"amount > 0\")`は「金額が0以上であること」を宣言するデータ品質チェックの例\n- 手続き的なNotebookコードは実行順序を自分で管理する必要がありますが、DLTでは依存関係が自動解決されるため、テーブル定義を追加・変更してもパイプライン全体の実行順序を書き直す必要がなく、変更に強い構成になります。",
        outcomes: [
          "宣言的パイプライン（DLT）の考え方を説明できる",
          "Bronze/Silver/Goldのメダリオンアーキテクチャを理解している",
        ],
        relatedJobs: ["Data Engineer", "Analytics Engineer"],
        skillTags: ["Delta Live Tables", "メダリオンアーキテクチャ"],
        referenceLinks: [
          { label: "Databricks: Delta Live Tablesとは", url: "https://docs.databricks.com/en/delta-live-tables/index.html" },
          { label: "Databricks: メダリオンアーキテクチャ", url: "https://www.databricks.com/glossary/medallion-architecture" },
        ],
        quizzes: [
          {
            question: "Delta Live Tablesの最大の特徴として最も適切なものはどれですか？",
            options: [
              { label: "「欲しいテーブル」を宣言するだけで依存関係やエラー処理が自動化される", isCorrect: true },
              { label: "SQLが一切使えず、Pythonのみで記述する", isCorrect: false },
              { label: "クラスタを使わずに実行できる", isCorrect: false },
            ],
          },
        ],
      },
      {
        slug: "workflows-jobs-cost-management",
        title: "Workflowsによるジョブオーケストレーションとコスト管理",
        type: LessonType.EXERCISE,
        attentionText:
          "深夜のバッチ処理が失敗していたことに、翌朝出社してから気づく——それも、担当者への通知が届いていなかったせいだとしたら？",
        relevanceText:
          "Workflowsによるオーケストレーションとコスト管理は、Data Engineerとして「一人でパイプライン運用を任せられる」と評価されるための最後のピースです。",
        lectureContent:
          "## Workflowsによる複数タスクのオーケストレーション\n\nDatabricks Workflowsでは、1つのJobの中に複数のタスク（Notebook、DLTパイプライン、Pythonスクリプトなど）を定義し、タスク間の依存関係（「Aが成功したらBを実行する」）や条件分岐、リトライ回数、通知設定（失敗時にメール通知するなど）を設定できます。\n\n```\nTask A（Extract） → Task B（Transform） → Task C（Load）\n                              ↘\n                               Task D（品質チェック、Bと並行実行）\n```\n\n## クラスタポリシーによるコスト管理\n\nクラスタポリシーは、「誰がどんなスペックのクラスタを作成できるか」を制限する仕組みです。例えば「学習用ユーザーは最大2ノードまで」「本番用Job Clusterは特定のインスタンスタイプのみ」といった制約をかけ、意図しない高額なクラスタが作成されるのを防ぎます。",
        exampleContent:
          "実務では、「深夜2時にExtractタスクを開始し、成功したらTransform、その後Loadを実行し、いずれかのタスクが失敗したら担当者にSlack通知する」といったWorkflowが組まれます。あわせて、開発環境のクラスタポリシーで最大ノード数を制限し、コストの暴走を防ぎます。",
        handsOnContent:
          "**ハンズオン課題**\n\n1. Databricks Free Editionの左メニューから「Jobs & Pipelines」→「Create Job」を開きます。\n2. これまでのレッスンで作成したNotebookのいずれかを、1つ目のタスクとして登録してください。\n3. 可能であれば2つ目のタスクを追加し、「1つ目のタスクが成功したら実行する」という依存関係を設定してみましょう。\n4. Jobのスケジュール設定画面を開き、「毎日午前6時に実行」のようなCron形式のスケジュールを設定できることを確認してください（実際に有効化するかは任意です）。\n5. Job設定の中に、失敗時の通知（メールなど）を設定できる項目があるか確認しましょう。\n6. 左メニューの「Compute」→「Policies」（利用可能な場合）を確認し、クラスタポリシーがどのような項目を制限できるかを確認してください。",
        modelAnswerContent:
          "**模範解答例**\n\n- Job設定：タスクA（Extract用Notebook）→タスクAが成功したらタスクB（Transform用Notebook）を実行、という依存関係を設定\n- スケジュール：Cron形式で「毎日午前6時に実行」を設定\n- 通知：タスク失敗時にメールアドレス宛に通知が飛ぶよう設定\n- クラスタポリシー：「学習用ユーザーは最大2ノードまで」のように、作成できるクラスタの上限を制限し、意図しない高額なクラスタ作成を防ぐ役割を持つ。",
        outcomes: [
          "Workflowsで複数タスクの依存関係を管理できることを理解している",
          "クラスタポリシーによるコスト管理の考え方を説明できる",
        ],
        relatedJobs: ["Data Engineer", "Analytics Engineer"],
        skillTags: ["Workflows", "クラスタポリシー"],
        referenceLinks: [
          { label: "Databricks Workflows（Jobs）の概要", url: "https://docs.databricks.com/en/jobs/index.html" },
        ],
        quizzes: [
          {
            question: "複数のタスクの依存関係やスケジュール実行を管理するDatabricksの機能はどれですか？",
            options: [
              { label: "Workflows（Jobs）", isCorrect: true },
              { label: "Unity Catalog", isCorrect: false },
              { label: "Repos", isCorrect: false },
            ],
          },
        ],
      },
    ],
  },
  {
    slug: "etl-pipeline-design",
    title: "ETLパイプライン設計",
    description: "実務レベルのETL（抽出・変換・格納）パイプラインの設計と品質管理の考え方を学びます。",
    missionText:
      "このコースを終えると、実務に近いデータパイプラインの設計・実装ができるようになります。",
    closingColumn:
      "## コラム：ETLは、誰の目にも触れない縁の下の力持ち\n\nダッシュボードやAIモデルは注目されますが、その裏で動くETLパイプラインが賞賛されることはほとんどありません。それでも、ETLが止まれば全てが止まります。データ品質チェックや冪等性という考え方は、まさに「誰にも気づかれずに、静かに信頼を支え続ける」ための技術です。\n\nこの縁の下の力持ちの役割を理解し、実装できることは、データエンジニアとしての土台そのものです。次はパフォーマンスと運用、いよいよ「作って終わり」ではない領域に踏み込みます。",
    level: 3,
    lessons: [
      {
        slug: "etl-basics",
        title: "ETLの基本設計：Extract, Transform, Load",
        type: LessonType.EXERCISE,
        attentionText:
          "「データエンジニアって、結局何をする仕事なの？」——その答えの多くは、たった3文字「ETL」に集約されます。",
        relevanceText:
          "ETLの3ステップを実装できることは、Data Engineer求人の職務内容そのものです。ここからLevel 3は、副業案件の実務そのものに近づいていきます。",
        lectureContent:
          "## ETLの3ステップ\n\n1. **Extract（抽出）**: 元データ（DB、ファイル、APIなど）から読み込む\n2. **Transform（変換）**: 欠損値処理、型変換、結合などでデータを整形する\n3. **Load（格納）**: 分析用のテーブルに書き込む\n\nDatabricksではこれらをNotebookとJobsで組み合わせて実装します。",
        exampleContent:
          "```python\nraw_df = spark.read.csv(\"/data/raw/orders.csv\", header=True)\nclean_df = raw_df.dropna().withColumnRenamed(\"amt\", \"amount\")\nclean_df.write.mode(\"overwrite\").saveAsTable(\"analytics.orders_clean\")\n```",
        handsOnContent:
          "**ハンズオン課題**\n\n1. Databricks Free Editionのノートブックで `df = spark.table(\"samples.tpch.orders\")` を実行し、Extractに相当するステップを行います。\n2. `df2 = df.dropna()` で欠損値を含む行を除去し、`df.count()` と `df2.count()` を比較して除去された件数を確認しましょう。\n3. `df3 = df2.withColumnRenamed(\"o_totalprice\", \"total_price\")` のように列名を分かりやすく変更してください。\n4. `df3.write.mode(\"overwrite\").saveAsTable(\"main.default.orders_clean\")` を実行し、Loadに相当するステップとして新しいテーブルに保存します。\n5. SQLで `SELECT COUNT(*), AVG(total_price) FROM main.default.orders_clean;` を実行し、正しく変換・保存されたかを確認しましょう。\n6. `mode(\"overwrite\")` を `mode(\"append\")` に変えて再実行するとどうなるか予想してから実行し、結果（件数が増えるか、置き換わるか）を確認してください。",
        modelAnswerContent:
          "**模範解答**\n\n```python\ndf = spark.table(\"samples.tpch.orders\")\ndf2 = df.dropna()\nprint(df.count(), df2.count())\n\ndf3 = df2.withColumnRenamed(\"o_totalprice\", \"total_price\")\ndf3.write.mode(\"overwrite\").saveAsTable(\"main.default.orders_clean\")\n```\n```sql\nSELECT COUNT(*), AVG(total_price) FROM main.default.orders_clean;\n```\n\n`mode(\"append\")`に変えて再実行すると、既存データはそのままに新しい行が追記されるため件数が増え、`overwrite`のようにテーブル全体が置き換わることはありません。",
        outcomes: ["ETLの3ステップを説明できる", "簡単なETL処理をNotebookで実装できる"],
        relatedJobs: ["Data Engineer", "Data Pipeline Assistant"],
        skillTags: ["ETL", "Extract/Transform/Load"],
        referenceLinks: [
          { label: "Databricks: ETLパイプラインの基本パターン", url: "https://docs.databricks.com/en/getting-started/data-pipeline-get-started.html" },
        ],
        quizzes: [
          {
            question: "ETLにおいて、欠損値処理や型変換を行うステップはどれですか？",
            options: [
              { label: "Extract", isCorrect: false },
              { label: "Transform", isCorrect: true },
              { label: "Load", isCorrect: false },
            ],
          },
        ],
      },
      {
        slug: "data-quality-testing",
        title: "データ品質とテスト：壊れたパイプラインに気づく仕組み",
        type: LessonType.EXERCISE,
        attentionText:
          "パイプラインはエラーも出さずに正常終了したのに、後から「実は集計結果が間違っていた」と発覚する——これほど怖いことはありません。",
        relevanceText:
          "品質チェックを組み込む力は、「動くだけのパイプライン」と「信頼されるパイプライン」を分ける決定的な違いであり、実務での評価に直結します。",
        lectureContent:
          "## データ品質チェックの観点\n\n実務でよく行われるデータ品質チェックには以下があります。\n\n- **件数チェック**: 前日と比べて極端に件数が増減していないか\n- **NULLチェック**: 必須列にNULLが混入していないか\n- **一意性チェック**: 主キーが重複していないか\n- **範囲チェック**: 金額がマイナスになっていないか、日付が未来すぎないか\n\n```python\nrow_count = clean_df.count()\nassert row_count > 0, \"変換後のデータが0件です\"\n\nnull_count = clean_df.filter(clean_df.customer_id.isNull()).count()\nassert null_count == 0, f\"customer_idにNULLが{null_count}件あります\"\n\nduplicate_count = clean_df.count() - clean_df.dropDuplicates([\"order_id\"]).count()\nassert duplicate_count == 0, f\"order_idの重複が{duplicate_count}件あります\"\n```\n\nこうしたチェックをETL処理の最後に組み込んでおくことで、「気づかないうちにデータが壊れる」事態を防げます。",
        exampleContent:
          "実務では、これらのチェックに1つでも失敗した場合はJobを失敗させ、後続の集計・ダッシュボード更新が「間違ったデータのまま」進んでしまわないようにします。これは、データ利用者からの信頼を守る上で非常に重要な設計です。",
        handsOnContent:
          "**ハンズオン課題**\n\n1. 前のレッスンで作成した `orders_clean` テーブルに対して、`SELECT COUNT(*) FROM main.default.orders_clean;` で件数を確認します。\n2. Pythonで、上記のような `assert` を使った件数チェック・NULLチェック・重複チェックのコードを、`orders_clean` に対して実際に書いて実行してください。\n3. 意図的に不正なデータ（例えばNULLを含む行）を1件追加し、NULLチェックの `assert` が失敗する（エラーが出る）ことを確認しましょう。\n4. 不正なデータを削除し、再度チェックを実行してすべて成功することを確認してください。\n5. 「もしこのチェックが無かったら、どんな問題が起きうるか」を1〜2行で書き出してみましょう。",
        modelAnswerContent:
          "**模範解答**\n\n```python\nrow_count = clean_df.count()\nassert row_count > 0, \"変換後のデータが0件です\"\n\nnull_count = clean_df.filter(clean_df.customer_id.isNull()).count()\nassert null_count == 0, f\"customer_idにNULLが{null_count}件あります\"\n\nduplicate_count = clean_df.count() - clean_df.dropDuplicates([\"order_id\"]).count()\nassert duplicate_count == 0, f\"order_idの重複が{duplicate_count}件あります\"\n```\n\nNULLを含む行を1件追加した状態でこのコードを実行すると`AssertionError`が発生し、削除して再実行するとすべて成功します。このチェックが無いと、集計結果に気づかないままNULLや重複が混入した誤った数値を報告してしまうリスクがあります。",
        outcomes: [
          "件数・NULL・一意性・範囲チェックなど代表的な品質チェックを実装できる",
          "品質チェックをパイプラインに組み込む重要性を説明できる",
        ],
        relatedJobs: ["Data Engineer", "Analytics Engineer"],
        skillTags: ["データ品質チェック", "assert検証"],
        referenceLinks: [
          { label: "Databricks: Delta Live Tablesのデータ品質（Expectations）", url: "https://docs.databricks.com/en/delta-live-tables/expectations.html" },
        ],
        quizzes: [
          {
            question: "「主キーが重複していないか」を確認するチェックは何と呼ばれますか？",
            options: [
              { label: "一意性チェック", isCorrect: true },
              { label: "範囲チェック", isCorrect: false },
              { label: "NULLチェック", isCorrect: false },
            ],
          },
        ],
      },
      {
        slug: "incremental-load-idempotency",
        title: "増分ロードと冪等性：安全に「やり直せる」パイプライン",
        type: LessonType.TEXT,
        attentionText:
          "夜間バッチが途中で落ちてしまった。もう一度実行して大丈夫でしょうか？それとも、データが二重に増えてしまうのでしょうか？",
        relevanceText:
          "冪等性を意識した設計は、実務で「安心して再実行できるパイプライン」を作れるかどうかの分かれ目であり、トラブル対応力として評価される重要な視点です。",
        lectureContent:
          "## フルロードと増分ロード\n\n- **フルロード**: 毎回すべてのデータを洗い替える。シンプルだがデータ量が増えると遅くコストがかかる。\n- **増分ロード（Incremental Load）**: 前回処理した時点より新しいデータだけを処理する。効率的だが「どこまで処理したか」を管理する必要がある。\n\n```sql\n-- 「最終更新日時」を使った増分抽出の例\nSELECT * FROM raw_orders\nWHERE updated_at > (SELECT MAX(updated_at) FROM orders_clean);\n```\n\n## 冪等性（Idempotency）とは\n\n冪等性とは、「同じ処理を1回実行しても、10回実行しても、最終的な結果が同じになる」という性質です。ジョブが途中で失敗し再実行した際に、データが重複してしまうと大きな問題になります。\n\n```sql\n-- 冪等でない例（再実行すると重複が増える）\nINSERT INTO orders_clean SELECT * FROM staging;\n\n-- 冪等な例（MERGEを使えば再実行しても重複しない）\nMERGE INTO orders_clean t USING staging s\nON t.order_id = s.order_id\nWHEN MATCHED THEN UPDATE SET *\nWHEN NOT MATCHED THEN INSERT *;\n```",
        exampleContent:
          "夜間バッチが途中でエラーになり、翌朝同じJobを再実行するケースはよくあります。冪等性のないパイプラインだと再実行のたびにデータが重複しますが、MERGEベースの増分ロードであれば、安心して「とりあえずもう一度実行する」ことができます。",
        handsOnContent:
          "**ハンズオン課題**\n\n1. `orders_clean` に `updated_at` に相当する列がなければ、`ALTER TABLE main.default.orders_clean ADD COLUMN updated_at TIMESTAMP;` のような形で追加し、適当な日時を設定してください。\n2. 「前回処理した最終日時より新しいデータだけを取得する」SELECT文を書いてみましょう（`WHERE updated_at > '適当な日時'`）。\n3. 同じINSERT文を意図的に2回実行し、重複行が発生することを確認してください（冪等でない例の再現）。\n4. 重複した行を削除したうえで、代わりにMERGE文を使って同じデータ反映を2回実行し、2回目も重複が発生しないことを確認しましょう。\n5. 「なぜ夜間バッチの再実行において冪等性が重要か」を自分の言葉で2〜3行にまとめてください。",
        modelAnswerContent:
          "**模範解答**\n\n```sql\nALTER TABLE main.default.orders_clean ADD COLUMN updated_at TIMESTAMP;\n\nSELECT * FROM raw_orders WHERE updated_at > '2026-01-01T00:00:00';\n\n-- 冪等でない例（2回実行すると重複が発生）\nINSERT INTO orders_clean SELECT * FROM staging;\n\n-- 冪等な例（MERGEなら2回実行しても重複しない）\nMERGE INTO orders_clean t USING staging s\nON t.order_id = s.order_id\nWHEN MATCHED THEN UPDATE SET *\nWHEN NOT MATCHED THEN INSERT *;\n```\n\n夜間バッチは途中で失敗し再実行されることがあるため、冪等性が無いと再実行のたびにデータが重複し、集計結果が不正確になってしまいます。MERGEベースであれば、失敗して何度再実行しても最終的な結果が変わらないため安心して再実行できます。",
        outcomes: [
          "フルロードと増分ロードの違いを説明できる",
          "冪等性の重要性と、MERGEによる実現方法を理解している",
        ],
        relatedJobs: ["Data Engineer", "Analytics Engineer"],
        skillTags: ["増分ロード", "冪等性"],
        referenceLinks: [
          { label: "Databricks: MERGE操作リファレンス", url: "https://docs.databricks.com/en/delta/merge.html" },
        ],
        quizzes: [
          {
            question: "「同じ処理を何度実行しても結果が変わらない」性質を何と呼びますか？",
            options: [
              { label: "冪等性（Idempotency）", isCorrect: true },
              { label: "正規化", isCorrect: false },
              { label: "パーティショニング", isCorrect: false },
            ],
          },
        ],
      },
    ],
  },
  {
    slug: "performance-and-ops",
    title: "パフォーマンスチューニングと運用",
    description: "パイプラインの性能改善と、実務での安定運用に必要な考え方を学びます。",
    missionText:
      "このコースを終えると、パイプラインの性能改善と安定運用まで見据えたエンジニアリングができるようになります。",
    closingColumn:
      "## コラム：「動く」から「動き続ける」へ\n\n初心者と経験者を分ける最も分かりやすい基準は、「動くコードが書けるか」ではなく「動き続けるコードが書けるか」だと思います。パーティショニングやZ-Ordering、監視・アラート・コスト最適化は、まさに「動き続けさせる」ための技術です。\n\nここまでのLevel 1〜4で、あなたはデータの基礎からDatabricksの運用まで一通りの視点を手に入れました。次のLevel 5では、これらすべてを1つのプロジェクトとして統合し、実際に手を動かして形にしていきます。",
    level: 4,
    lessons: [
      {
        slug: "performance-basics",
        title: "パフォーマンス改善の基本的な考え方",
        type: LessonType.TEXT,
        attentionText:
          "同じ処理なのに、データが増えるにつれてどんどん遅くなっていく——「動けばいい」の先にある課題に、そろそろ向き合う時が来ました。",
        relevanceText:
          "パフォーマンス改善の視点を持っていることは、単なる実装者ではなく「運用を見据えたエンジニア」として評価される、Level 4からの実務レベルの入り口です。",
        lectureContent:
          "## パフォーマンス改善の基本\n\n- **パーティショニング**: データを適切な単位に分割し、処理範囲を絞る\n- **キャッシュ**: 繰り返し使うデータをメモリに保持する\n- **不要な列・行の早期除外**: 処理の最初の段階でデータ量を減らす\n\nこれらはDatabricksに限らず、多くのデータ基盤で共通する考え方です。",
        exampleContent:
          "例えば、日付でパーティショニングされたテーブルに対して、特定の日付範囲だけを読み込むクエリは、全件スキャンより大幅に高速化されます。",
        handsOnContent:
          "**ハンズオン課題**\n\n1. Databricks SQL Editorで `samples.tpch.orders` に対して `SELECT COUNT(*) FROM samples.tpch.orders WHERE o_orderdate > '1998-01-01';` を実行し、クエリ実行後に表示される実行時間（Duration）を確認しましょう。\n2. `WHERE` 句を外した `SELECT COUNT(*) FROM samples.tpch.orders;` と実行時間を比較してみましょう。\n3. Databricks SQL Editorのクエリ結果画面から実行計画（Query Profile / Explain）を開けるか確認し、開ける場合はどのステップに時間がかかっているか眺めてみましょう。\n4. 「もしこのテーブルが日付でパーティション分割されていたら、絞り込みクエリはどう有利になるか」を自分の言葉で説明してみましょう。",
        modelAnswerContent:
          "**模範解答**\n\n```sql\nSELECT COUNT(*) FROM samples.tpch.orders WHERE o_orderdate > '1998-01-01';\nSELECT COUNT(*) FROM samples.tpch.orders;\n```\n\nもしテーブルが日付でパーティション分割されていれば、`WHERE o_orderdate > '1998-01-01'`のような絞り込みクエリは、該当する日付範囲のパーティションだけを読み込めばよく、テーブル全体をスキャンする必要がなくなるため、全件スキャンより大幅に高速化されます。",
        outcomes: ["パフォーマンス改善の基本的な考え方を説明できる", "パーティショニングの効果をイメージできる"],
        relatedJobs: ["Data Engineer", "Analytics Engineer"],
        skillTags: ["パーティショニング", "クエリチューニング"],
        referenceLinks: [
          { label: "Databricks: パフォーマンスチューニングの概要", url: "https://docs.databricks.com/en/optimizations/index.html" },
        ],
        quizzes: [
          {
            question: "データを適切な単位に分割し、処理範囲を絞る手法を何と呼びますか？",
            options: [
              { label: "パーティショニング", isCorrect: true },
              { label: "正規化", isCorrect: false },
              { label: "レプリケーション", isCorrect: false },
            ],
          },
        ],
      },
      {
        slug: "z-ordering-cluster-sizing",
        title: "Z-Orderingとクラスタサイジングの実践",
        type: LessonType.TEXT,
        attentionText:
          "クラスタを2倍の大きさにしたのに、処理時間はほとんど変わらなかった——そんな「宝の持ち腐れ」を避けるには、何を見るべきでしょうか？",
        relevanceText:
          "Z-Orderingとクラスタサイジングの使い分けを理解していることは、コストと性能の両方に責任を持てる、実務で信頼されるデータエンジニアの視点そのものです。",
        lectureContent:
          "## Z-Orderingとは\n\nZ-Orderingは、複数の列（よく `WHERE` や `JOIN` で使われる列）に基づいてデータを並び替え、関連するデータを同じファイルに近接配置する最適化技術です。パーティショニングが「1つの列で大きくフォルダ分けする」のに対し、Z-Orderingは「複数の列で細かく並び替える」イメージです。\n\n```sql\nOPTIMIZE sales.orders ZORDER BY (customer_id, order_date);\n```\n\n## クラスタサイジングの考え方\n\n- **ワーカー数を増やす（スケールアウト）**: 並列処理できるデータ量が増える。データ量が非常に大きい場合に有効。\n- **インスタンスサイズを上げる（スケールアップ）**: 1台あたりのメモリ・CPUが増える。複雑な集計やシャッフルが多い処理で有効。\n- **オーバースペック**: 必要以上に大きなクラスタを使うと、性能向上が頭打ちになり、コストだけが増える「宝の持ち腐れ」になりやすい。\n\n実務では、まず小さいクラスタで試し、処理時間とコストのバランスを見ながら段階的に調整するのが定石です。",
        exampleContent:
          "「顧客ごとの売上」を頻繁に集計するテーブルであれば、`customer_id` でZ-Orderingしておくことで、特定顧客のデータへのアクセスが高速化されます。一方、クラスタサイズを2倍にしても処理時間が半分にならない場合は、ボトルネックが計算リソースではなく別の要因（データの偏り、非効率なクエリなど）にある可能性が高いです。",
        handsOnContent:
          "**ハンズオン課題**\n\n1. `OPTIMIZE main.default.orders_clean ZORDER BY (customer_id);` のようなSQL文を、これまでのハンズオンで作成したテーブルに対して実行してみましょう（列名は実際のテーブル構成に合わせて調整してください）。\n2. Databricks Free Editionの「Compute」画面で、現在のコンピュートのワーカー数・インスタンスタイプの設定項目を確認しましょう。\n3. 「もしデータ量が今の100倍になったら、スケールアウトとスケールアップのどちらを検討すべきか」を、理由とともに書き出してみましょう。\n4. 過去に実行したクエリの実行時間を見直し、「これ以上速くする必要があるか」「コストに見合っているか」を評価する視点で1つコメントを書いてみましょう。",
        modelAnswerContent:
          "**模範解答**\n\n```sql\nOPTIMIZE main.default.orders_clean ZORDER BY (customer_id);\n```\n\nデータ量が今の100倍になった場合、まずは並列処理できるワーカー数を増やす**スケールアウト**を検討します（大規模データの分散処理はワーカー数の恩恵を受けやすいため）。ただしボトルネックがデータの偏り（スキュー）や非効率なクエリにある場合は、クラスタを大きくしても処理時間は比例して縮まらないため、クエリの見直しやZ-Orderingを先に検討すべきです。",
        outcomes: [
          "Z-Orderingの目的とパーティショニングとの違いを説明できる",
          "スケールアウトとスケールアップの使い分けを理解している",
        ],
        relatedJobs: ["Data Engineer", "Analytics Engineer"],
        skillTags: ["Z-Ordering", "クラスタサイジング"],
        referenceLinks: [
          { label: "Databricks: OPTIMIZEとZ-Ordering", url: "https://docs.databricks.com/en/delta/optimize.html" },
        ],
        quizzes: [
          {
            question: "複数の列に基づいて関連データを近接配置し、クエリを高速化する技術は何ですか？",
            options: [
              { label: "Z-Ordering", isCorrect: true },
              { label: "VACUUM", isCorrect: false },
              { label: "Auto Termination", isCorrect: false },
            ],
          },
        ],
      },
      {
        slug: "monitoring-alerting-cost-optimization",
        title: "監視・アラートとコスト最適化",
        type: LessonType.TEXT,
        attentionText:
          "パイプラインが1週間前から静かに失敗し続けていた——誰も気づかないまま、報告書には間違ったデータが載り続けていたとしたら？",
        relevanceText:
          "監視・アラートとコスト最適化の視点は、パイプラインを「作る人」から「安心して任せられる運用者」へとステップアップするために欠かせない、実務そのものの視点です。",
        lectureContent:
          "## 監視すべき代表的な指標\n\n- **Job成功/失敗の履歴**: 失敗が続いていないか\n- **実行時間の推移**: 徐々に遅くなっていないか（データ量増加やスキュー〈偏り〉の兆候）\n- **データ品質チェックの結果**: 品質チェックに失敗した回数\n- **クラスタの起動時間・コスト**: 想定より高額になっていないか\n\n## アラートの設計\n\nDatabricks Workflowsでは、Jobが失敗した際にメールやSlack通知を送るよう設定できます。「誰が」「どんな条件で」「どのチャンネルに」通知を受け取るかを事前に設計しておくことで、障害対応の初動が大きく変わります。\n\n## コスト最適化の継続的な取り組み\n\n- 使われなくなったJob・クラスタ・テーブルの棚卸し\n- Auto Terminationの見直し\n- Job ClusterとAll-Purpose Clusterの使い分けの徹底\n- 過剰にスケジュールされたJob（例：不要に頻繁な実行）の見直し",
        exampleContent:
          "実務では、月次でクラウドのコストレポートを確認し、「想定外にコストがかかっているJobやクラスタが無いか」を棚卸しするのが一般的です。小さな見直しの積み重ねが、年間で大きなコスト差になります。",
        handsOnContent:
          "**ハンズオン課題**\n\n1. Databricks Free Editionの「Jobs & Pipelines」画面で、過去に作成・実行したJobの実行履歴（成功/失敗、実行時間）を確認してください。\n2. Job設定の中に、失敗時の通知先（メールアドレスなど）を設定する項目があるか確認しましょう。\n3. これまでのレッスンで作成したテーブル・Job・Notebookを一覧にし、「本当に必要なものはどれか」を棚卸しする表を作ってみましょう（学習用の練習ですが、実務の棚卸し作業を疑似体験する目的です）。\n4. 「監視すべき指標」を自分の言葉で3つ挙げ、それぞれなぜ重要かを1行で説明してください。",
        modelAnswerContent:
          "**模範解答**\n\n監視すべき代表的な指標：\n\n1. **Job成功/失敗の履歴** — 失敗が続くと障害が放置されている兆候だから\n2. **実行時間の推移** — 徐々に遅くなっているなら、データ量増加や偏り（スキュー）の兆候だから\n3. **クラスタの起動時間・コスト** — 想定より高額になっていないか継続的に確認しないと、コストが静かに膨らむため\n\n棚卸しでは「今も使われているか」「削除・統合できないか」の観点で、テーブル・Job・Notebookを一覧化し、Auto Terminationの見直しやJob Cluster/All-Purpose Clusterの使い分け徹底とあわせて整理します。",
        outcomes: [
          "パイプライン運用で監視すべき代表的な指標を説明できる",
          "継続的なコスト最適化の取り組み方をイメージできる",
        ],
        relatedJobs: ["Data Engineer", "Analytics Engineer"],
        skillTags: ["監視・アラート", "コスト最適化"],
        referenceLinks: [
          { label: "Databricks: Jobの監視とアラート設定", url: "https://docs.databricks.com/en/jobs/index.html" },
        ],
        quizzes: [
          {
            question: "パイプライン運用において継続的に見直すべきこととして最も適切なものはどれですか？",
            options: [
              { label: "使われなくなったJobやクラスタの棚卸し、Auto Terminationの見直し", isCorrect: true },
              { label: "一度設定したクラスタサイズは変更しないこと", isCorrect: false },
              { label: "アラートは設定せず、手動で毎回確認すること", isCorrect: false },
            ],
          },
        ],
      },
    ],
  },
  {
    slug: "capstone-open-data-mini-platform",
    title: "実務総合演習：オープンデータで作るミニデータ基盤",
    description:
      "架空の実務シナリオに沿って、公開APIからのデータ取得からBI可視化までを一気通貫で行う、これまでの学習の集大成となる演習コースです。",
    missionText:
      "このコースを終えると、データ取得・加工・格納・可視化までを自分ひとりで一通り組み立てられるようになります。ここまでの学習が「実務でできること」として形になる、最後の総仕上げです。",
    closingColumn:
      "## コラム：あなたはもう、「学んでいる人」ではない\n\nLevel 1で表の見方から始まったあなたは、ここまでの過程で、外部APIからのデータ取得、メダリオンアーキテクチャの設計、Unity Catalogによる権限制御、Workflowsによる自動化、そしてDelta Sharingによる安全な共有までを、すべて自分の手で組み立てました。\n\nこれは、もう「勉強中の人」の実績ではありません。実務で通用する、データ基盤構築の経験です。ぜひこの経験を、職務経歴書や面接の言葉にして、次の一歩（副業案件への応募、キャリアチェンジ）に活かしてください。そして、学び続けることを止めないでください——ここがゴールではなく、スタートラインです。",
    level: 5,
    lessons: [
      {
        slug: "capstone-scenario-and-extract",
        title: "お題設定とデータ取得（Extract）：気象オープンデータAPIを叩く",
        type: LessonType.EXERCISE,
        attentionText:
          "あなたは小売企業のデータ基盤担当としてアサインされました。ある日、店長からこんな依頼が届きます——「天気と来店・売上の関係を分析したい」。",
        relevanceText:
          "ここまでLevel 1〜4で学んだ知識を総動員する、実務そのものの疑似体験がここから始まります。実務のETLは、この「外部データの取得」から始まることがほとんどです。",
        lectureContent:
          "## 今回のお題\n\n架空の小売企業で、次のような依頼を受けたとします。\n\n> 「雨の日と晴れの日で来店数に違いがあるか知りたい。まずは天気データを集めてほしい」\n\nこうした依頼に応えるには、まず信頼できる外部データソースからデータを取得（Extract）する必要があります。今回は、**Open-Meteo**という無料・登録不要の気象オープンデータAPIを使います。\n\n## Open-Meteo APIの概要\n\n- エンドポイント例: `https://api.open-meteo.com/v1/forecast`\n- クエリパラメータで緯度・経度、取得したい項目（最高気温、最低気温、降水量など）、期間を指定します\n- APIキーの登録が不要なため、学習用途に適しています\n\n```\nGET https://api.open-meteo.com/v1/forecast?latitude=35.6895&longitude=139.6917&daily=temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=Asia%2FTokyo\n```\n\nこのURLは、東京（緯度35.6895、経度139.6917）の日別の最高気温・最低気温・降水量を、直近の予報期間分まとめて返します。\n\nこのコースでは、この後のレッスンで「メダリオンアーキテクチャ」「権限制御」「コンピュート運用」「Delta Sharing」まで扱います。今回取得する生データは、その最初の入口（Bronze層の材料）になります。",
        exampleContent:
          "```python\nimport requests\n\nurl = \"https://api.open-meteo.com/v1/forecast\"\nparams = {\n    \"latitude\": 35.6895,\n    \"longitude\": 139.6917,\n    \"daily\": \"temperature_2m_max,temperature_2m_min,precipitation_sum\",\n    \"timezone\": \"Asia/Tokyo\",\n}\n\nresponse = requests.get(url, params=params)\ndata = response.json()\nprint(data[\"daily\"].keys())\n# dict_keys(['time', 'temperature_2m_max', 'temperature_2m_min', 'precipitation_sum'])\n```\n\nAPIから返ってくるのは、`time`（日付）・`temperature_2m_max`（最高気温）・`temperature_2m_min`（最低気温）・`precipitation_sum`（降水量合計）がそれぞれ配列になったJSONです。このままでは分析しづらいため、次のレッスンで表形式のデータに変換します。",
        handsOnContent:
          "**ハンズオン課題（Databricks Free Edition推奨）**\n\n1. Databricks Free EditionでPythonノートブックを新規作成してください。\n2. `requests` を使って、上記のOpen-Meteo APIを実際に呼び出し、レスポンスのJSONを表示してみましょう（緯度・経度はお住まいの地域や好きな都市に変えても構いません）。\n3. 取得したJSONを、そのまま（生データとして）Databricksのボリュームまたはワークスペースのファイルとして保存してみましょう。\n4. 「なぜ生データをまず保存するのか」を自分の言葉で1〜2行メモしてください（ヒント：ETLのどのステップに相当するか、Level 3の学習を思い出しましょう）。",
        modelAnswerContent:
          "**模範解答**\n\n```python\nimport requests\n\nurl = \"https://api.open-meteo.com/v1/forecast\"\nparams = {\n    \"latitude\": 35.6895,\n    \"longitude\": 139.6917,\n    \"daily\": \"temperature_2m_max,temperature_2m_min,precipitation_sum\",\n    \"timezone\": \"Asia/Tokyo\",\n}\nresponse = requests.get(url, params=params)\ndata = response.json()\n\nimport json\nwith open(\"/Volumes/main/default/raw/weather_raw.json\", \"w\") as f:\n    json.dump(data, f)\n```\n\n生データをまず無加工で保存しておくのは、後工程（Transform）でバグがあった場合に、APIを再度叩き直すことなく「生データからやり直せる」ようにするためです（これが次のレッスンで扱うBronze層の役割です）。",
        outcomes: [
          "外部の公開APIからHTTP経由でデータを取得できる",
          "取得した生データをまず保存する（Extract）ことの意味を説明できる",
        ],
        relatedJobs: ["Data Engineer", "Data Analyst", "Analytics Engineer"],
        skillTags: ["外部API連携", "requestsライブラリ"],
        referenceLinks: [
          { label: "Open-Meteo API公式ドキュメント", url: "https://open-meteo.com/en/docs" },
          { label: "Python requestsライブラリ", url: "https://requests.readthedocs.io/en/latest/" },
        ],
        quizzes: [
          {
            question: "Open-Meteo APIを利用する際に必要なものはどれですか？",
            options: [
              { label: "APIキーの事前登録", isCorrect: false },
              { label: "緯度・経度などのクエリパラメータ", isCorrect: true },
              { label: "有料プランへの加入", isCorrect: false },
            ],
          },
        ],
      },
      {
        slug: "capstone-medallion-design",
        title: "データ基盤の設計図を描く：メダリオンアーキテクチャの設計",
        type: LessonType.TEXT,
        attentionText:
          "「とりあえずデータを取得して、とりあえずテーブルに保存する」——それで一度は動くかもしれません。しかし、半年後にチームメンバーが増えたとき、そのテーブルの意味を説明できますか？",
        relevanceText:
          "思いつきでテーブルを作るだけの実装者と、設計してから作るデータ基盤担当者の違いは、まさにここに現れます。ここから先のレッスンは、すべてこの設計に基づいて進みます。",
        lectureContent:
          "## なぜ「設計してから作る」のか\n\nこれまでのレッスンでは`analytics.weather_daily`のような単一のテーブルにすべてを詰め込んでいました。実務でこれをやると、「生データが欲しい」「整形済みが欲しい」「集計済みが欲しい」という異なるニーズがすべて1つのテーブルに混ざり、次第に誰も安心して触れないテーブルになっていきます。\n\n## メダリオンアーキテクチャの3層\n\n- **Bronze（生データ層）**：APIやファイルから取得した生データを、ほぼ無加工のまま保存する層。「何が起きたか」の記録そのものであり、後から何度でも作り直せる出発点\n- **Silver（整形済み層）**：欠損値処理・型変換・重複排除など、Level 3で学んだクレンジングを経た、信頼できる粒度のデータ\n- **Gold（集計済み層）**：BIやダッシュボードがそのまま読みにいく、ビジネスの問いに答えるための集計済みテーブル\n\n## この演習での設計\n\n今回構築するデータ基盤は、以下の3層構成とします。\n\n```\nbronze.weather_raw      -- Open-Meteo APIの生JSONをほぼそのまま格納\nsilver.weather_daily    -- 型変換・欠損値処理・is_rainy列を追加した日次データ\ngold.weather_daily_summary -- is_rainyごとの集計済みサマリー（ダッシュボードが読む先）\n```\n\nテーブルをどこに置くかも設計のうちです。カタログ名は`capstone`、スキーマ名を`bronze`/`silver`/`gold`とし、`capstone.bronze.weather_raw`のように命名します。",
        exampleContent:
          "例えば「Silverのテーブルにバグがあった」と分かった場合、Bronzeの生データさえ無事なら、Silverの変換ロジックを直してBronzeから作り直すだけで復旧できます。逆にBronze層自体を都度上書きしてしまう設計だと、過去の生データが失われ、やり直しがきかなくなります。",
        handsOnContent:
          "**設計課題（コードを書く前に、まず設計する）**\n\n1. `capstone`という名前のカタログを作る想定で、`bronze`・`silver`・`gold`の3つのスキーマ名を決めてください（本レッスンの案をそのまま使っても構いません）。\n2. 各層に置くテーブルを1つずつ、テーブル名と主な列構成を紙またはメモに書き出してください（`bronze.weather_raw`, `silver.weather_daily`, `gold.weather_daily_summary`）。\n3. 「Silver層でどんな変換（欠損値処理・型変換・列追加）を行うか」を箇条書きで3つ挙げてください。\n4. 「もしSilver層に誤りが見つかったら、どこから作り直せば良いか」を自分の言葉で説明してください。",
        modelAnswerContent:
          "**模範解答**\n\n```\ncapstone.bronze.weather_raw\n  - raw_json STRING, ingested_at TIMESTAMP\ncapstone.silver.weather_daily\n  - date DATE, temp_max DOUBLE, temp_min DOUBLE, precipitation DOUBLE, is_rainy BOOLEAN\ncapstone.gold.weather_daily_summary\n  - is_rainy BOOLEAN, day_count INT, avg_temp_max DOUBLE, avg_precipitation DOUBLE\n```\n\nSilver層で行う変換：①JSONの配列を1日1行の表形式に変換、②気温・降水量を数値型に変換、③`is_rainy`列を追加。\n\nSilver層に誤りが見つかった場合は、Bronze層の生データ（`weather_raw`）は無加工のまま残っているため、Silverへの変換ロジックだけを修正し、Bronzeから再実行すればSilverを正しい状態に作り直せます。",
        outcomes: [
          "Bronze/Silver/Goldそれぞれの役割を説明できる",
          "コードを書く前にテーブル構成を設計する視点を持てる",
        ],
        relatedJobs: ["Data Engineer", "Data Platform Engineer", "Analytics Engineer"],
        skillTags: ["メダリオンアーキテクチャ設計", "Bronze/Silver/Gold"],
        referenceLinks: [
          { label: "Databricks: メダリオンアーキテクチャ", url: "https://www.databricks.com/glossary/medallion-architecture" },
          { label: "Databricks: Lakehouseの基礎", url: "https://docs.databricks.com/en/lakehouse/index.html" },
        ],
        quizzes: [
          {
            question: "メダリオンアーキテクチャにおいて、BIやダッシュボードが直接読みにいく層はどれですか？",
            options: [
              { label: "Bronze", isCorrect: false },
              { label: "Silver", isCorrect: false },
              { label: "Gold", isCorrect: true },
            ],
          },
        ],
      },
      {
        slug: "capstone-bronze-silver-transform",
        title: "Bronze→Silver：生データの取り込みと整形",
        type: LessonType.EXERCISE,
        attentionText:
          "APIから取得したJSONをそのまま眺めていても、「雨の日と晴れの日の違い」は見えてきません。設計した層構成に沿って、実際にデータを流し込んでいきましょう。",
        relevanceText:
          "Level 1〜3で学んだSQL・DataFrame・Delta Lakeの知識と、前レッスンで決めた設計がここで一気につながり、「設計を実装に落とし込む」実務そのものの工程を体験します。",
        lectureContent:
          "## Bronze層：生データをそのまま格納する\n\n前レッスンで取得したJSONを、加工せずにそのまま1つの列（例：`raw_json STRING`）として保存するのがBronze層です。\n\n```python\nimport json\n\nraw_text = json.dumps(data)\nbronze_df = spark.createDataFrame([(raw_text,)], [\"raw_json\"])\nbronze_df = bronze_df.withColumn(\"ingested_at\", current_timestamp())\nbronze_df.write.mode(\"append\").saveAsTable(\"capstone.bronze.weather_raw\")\n```\n\n`mode(\"append\")`にしておくことで、APIを日々呼び出すたびにBronzeへ蓄積されていき、過去の生データが失われません。\n\n## Silver層：クレンジングと変換\n\n```python\nimport pandas as pd\n\ndaily = data[\"daily\"]\npdf = pd.DataFrame({\n    \"date\": daily[\"time\"],\n    \"temp_max\": daily[\"temperature_2m_max\"],\n    \"temp_min\": daily[\"temperature_2m_min\"],\n    \"precipitation\": daily[\"precipitation_sum\"],\n})\n\nsilver_df = spark.createDataFrame(pdf)\nsilver_df = silver_df.withColumn(\"is_rainy\", silver_df.precipitation > 0)\nsilver_df.write.mode(\"overwrite\").saveAsTable(\"capstone.silver.weather_daily\")\n```\n\nSilverは「洗い替え（overwrite）」でも構いませんが、実務では前レッスンで学んだMERGEによる増分更新にすることが多く、次のレッスンで扱うオーケストレーションと合わせて考えます。",
        exampleContent:
          "```sql\nSELECT date, temp_max, temp_min, precipitation, is_rainy\nFROM capstone.silver.weather_daily\nORDER BY date;\n```\n\nBronzeに生データを蓄積しつつ、Silverには「今の最新の正しい状態」を持たせる、という役割分担がポイントです。",
        handsOnContent:
          "**ハンズオン課題**\n\n1. `capstone`カタログと`bronze`/`silver`/`gold`スキーマを作成してください（`CREATE CATALOG`・`CREATE SCHEMA`。Free Editionでカタログ作成権限が無い場合は、既存の`main`カタログの中にスキーマとして`bronze`/`silver`/`gold`を作る形で代用してください）。\n2. 取得したJSONを`raw_json`列と`ingested_at`列を持つDataFrameにして、`capstone.bronze.weather_raw`にappendで保存してください。\n3. JSONを`date`・`temp_max`・`temp_min`・`precipitation`・`is_rainy`列に変換し、`capstone.silver.weather_daily`にoverwriteで保存してください。\n4. Bronzeに対して同じAPI呼び出しをもう一度実行し、appendで2回分のデータが蓄積されていることを`SELECT COUNT(*)`で確認してください。",
        modelAnswerContent:
          "**模範解答**\n\n```python\nimport json\nfrom pyspark.sql.functions import current_timestamp\n\nraw_text = json.dumps(data)\nbronze_df = spark.createDataFrame([(raw_text,)], [\"raw_json\"])\nbronze_df = bronze_df.withColumn(\"ingested_at\", current_timestamp())\nbronze_df.write.mode(\"append\").saveAsTable(\"capstone.bronze.weather_raw\")\n\nimport pandas as pd\ndaily = data[\"daily\"]\npdf = pd.DataFrame({\n    \"date\": daily[\"time\"],\n    \"temp_max\": daily[\"temperature_2m_max\"],\n    \"temp_min\": daily[\"temperature_2m_min\"],\n    \"precipitation\": daily[\"precipitation_sum\"],\n})\nsilver_df = spark.createDataFrame(pdf).withColumn(\"is_rainy\", pdf[\"precipitation\"] > 0)\nsilver_df.write.mode(\"overwrite\").saveAsTable(\"capstone.silver.weather_daily\")\n```\n```sql\nSELECT COUNT(*) FROM capstone.bronze.weather_raw; -- 2回実行後は2件\n```",
        outcomes: [
          "設計したBronze/Silver層の構成を実際にテーブルとして実装できる",
          "appendとoverwriteの使い分けを踏まえてデータを格納できる",
        ],
        relatedJobs: ["Data Engineer", "Analytics Engineer", "Data Pipeline Assistant"],
        skillTags: ["Bronze層実装", "Silver層実装"],
        referenceLinks: [
          { label: "Databricks: Delta Lakeとは", url: "https://docs.databricks.com/en/delta/index.html" },
        ],
        quizzes: [
          {
            question: "Bronze層のテーブルへのデータ書き込みで、過去の生データを失わないために適した書き込みモードはどれですか？",
            options: [
              { label: "append", isCorrect: true },
              { label: "overwrite", isCorrect: false },
              { label: "ignore", isCorrect: false },
            ],
          },
        ],
      },
      {
        slug: "capstone-gold-aggregation",
        title: "Gold層の構築：ダッシュボードが読みにいく集計テーブル",
        type: LessonType.EXERCISE,
        attentionText:
          "ダッシュボードのたびに同じ集計クエリをBIツールから毎回実行していたら、データ量が増えるほど表示は遅くなり、コストもかさみます。",
        relevanceText:
          "「集計はGoldテーブルとして事前に用意しておく」という発想を持てるかどうかが、その場しのぎの実装者と、運用まで見据えたデータ基盤担当者の分かれ目です。",
        lectureContent:
          "## なぜ集計をテーブルとして持つのか\n\nBIツールがSilverの生に近いデータに対して毎回集計クエリを投げると、データ量が増えるにつれてダッシュボードの表示が遅くなり、同じ集計が何度も繰り返し実行されることになります。Gold層に集計済みテーブルとして持たせておけば、ダッシュボードは軽いテーブルを読むだけで済みます。\n\n## Goldテーブルの作成\n\n```sql\nCREATE OR REPLACE TABLE capstone.gold.weather_daily_summary AS\nSELECT\n  is_rainy,\n  COUNT(*) AS day_count,\n  ROUND(AVG(temp_max), 1) AS avg_temp_max,\n  ROUND(AVG(precipitation), 1) AS avg_precipitation\nFROM capstone.silver.weather_daily\nGROUP BY is_rainy;\n```\n\n`CREATE OR REPLACE TABLE ... AS SELECT`（CTAS）は、Silverの最新状態からGoldを作り直すシンプルな方法です。Silverが更新されるたびにこのSQLを再実行すれば、Goldも最新の集計に保たれます（この「再実行のタイミング」を自動化するのが次のレッスンで扱うWorkflowsです）。",
        exampleContent:
          "実務では、「日次サマリー」「月次サマリー」のように粒度の異なる複数のGoldテーブルを用意することがよくあります。ダッシュボードの用途に応じて適切な粒度のGoldテーブルを参照させることで、BI側のクエリをシンプルかつ高速に保てます。",
        handsOnContent:
          "**ハンズオン課題**\n\n1. `CREATE OR REPLACE TABLE ... AS SELECT`を使い、`capstone.silver.weather_daily`から`capstone.gold.weather_daily_summary`を作成してください。\n2. 作成したGoldテーブルの中身を`SELECT *`で確認してください。\n3. Silver側のデータが増えた想定で、同じCTAS文をもう一度実行し、Goldテーブルが最新の状態に置き換わることを確認してください。\n4. 「BIツールがSilverではなくGoldを読みにいくべき理由」を自分の言葉で1〜2行にまとめてください。",
        modelAnswerContent:
          "**模範解答**\n\n```sql\nCREATE OR REPLACE TABLE capstone.gold.weather_daily_summary AS\nSELECT\n  is_rainy,\n  COUNT(*) AS day_count,\n  ROUND(AVG(temp_max), 1) AS avg_temp_max,\n  ROUND(AVG(precipitation), 1) AS avg_precipitation\nFROM capstone.silver.weather_daily\nGROUP BY is_rainy;\n\nSELECT * FROM capstone.gold.weather_daily_summary;\n```\n\nBIツールがSilverではなくGoldを読むべき理由は、Silverは生に近い粒度でデータ量が多く、集計のたびに毎回計算し直すのは非効率だからです。Goldに事前集計しておくことで、ダッシュボードは軽い読み取りだけで済み、表示速度とコストの両面で有利になります。",
        outcomes: [
          "CTAS（CREATE TABLE AS SELECT）でGoldテーブルを構築できる",
          "BIがGold層を読みにいく設計の意図を説明できる",
        ],
        relatedJobs: ["Analytics Engineer", "BI Engineer", "Data Engineer"],
        skillTags: ["CTAS", "Gold層設計"],
        referenceLinks: [
          { label: "Databricks SQL言語マニュアル", url: "https://docs.databricks.com/en/sql/language-manual/index.html" },
        ],
        quizzes: [
          {
            question: "BIツールがSilverではなくGold層のテーブルを読みにいく主な理由はどれですか？",
            options: [
              { label: "Silverにはアクセス権限が無いから", isCorrect: false },
              { label: "事前に集計済みのため軽く高速に読み取れるから", isCorrect: true },
              { label: "Goldにしかデータが存在しないから", isCorrect: false },
            ],
          },
        ],
      },
      {
        slug: "capstone-governance-permissions",
        title: "権限制御とガバナンス：Unity Catalogでこの基盤を守る",
        type: LessonType.TEXT,
        attentionText:
          "自分一人で作っている間は気にならなくても、チームが増えたとき「誰でもGoldを書き換えられる」「分析担当がBronzeの生データまで見えてしまう」状態は、事故のもとになります。",
        relevanceText:
          "権限設計は、単なる実装者には求められないが、データ基盤を任される担当者には必ず求められる仕事です。ここができて初めて「トータルで基盤を任せられる人材」に一歩近づきます。",
        lectureContent:
          "## この演習における役割設計\n\n架空の組織として、以下の2つの役割を想定します。\n\n- **data-engineers**：Bronze/Silver/Goldすべてのテーブルを作成・更新できる（このパイプラインを実装・運用する担当）\n- **data-analysts**：Goldのみ参照できる（ダッシュボードを作る担当。生データや中間データには触れさせない）\n\n## Unity Catalogでの権限付与\n\n```sql\nGRANT USE CATALOG ON CATALOG capstone TO `data-analysts`;\nGRANT USE SCHEMA ON SCHEMA capstone.gold TO `data-analysts`;\nGRANT SELECT ON SCHEMA capstone.gold TO `data-analysts`;\n\nGRANT ALL PRIVILEGES ON CATALOG capstone TO `data-engineers`;\n```\n\nポイントは「最小権限の原則」です。data-analystsにはGoldへの参照権限だけを与え、Bronze/Silverには一切アクセスできないようにします。こうしておくことで、生データに含まれるかもしれない機微な情報への意図しないアクセスを防ぎ、集計後の安全なデータだけを分析担当に見せることができます。\n\n## 権限の確認\n\n```sql\nSHOW GRANTS ON CATALOG capstone;\nSHOW GRANTS ON SCHEMA capstone.gold;\n```",
        exampleContent:
          "実務では、「全員が管理者権限を持つ」状態は一見便利に見えても、誤操作によるテーブル削除やデータ漏洩のリスクを高めます。役割ごとに権限を分けておくことで、事故の影響範囲を最小限にできます。",
        handsOnContent:
          "**ハンズオン課題**\n\n1. `capstone`カタログと`gold`スキーマに対して、`data-analysts`グループ（Free Editionでグループ作成ができない場合は架空のグループ名のままで構いません）にGoldのみの参照権限を与えるGRANT文を書いてください。\n2. `data-engineers`グループには、カタログ全体への管理権限を与えるGRANT文を書いてください。\n3. `SHOW GRANTS`で、意図した権限が設定されているか（実行できる環境なら）確認してください。\n4. 「なぜdata-analystsにBronze/Silverへのアクセスを与えないのか」を自分の言葉で説明してください。",
        modelAnswerContent:
          "**模範解答**\n\n```sql\nGRANT USE CATALOG ON CATALOG capstone TO `data-analysts`;\nGRANT USE SCHEMA ON SCHEMA capstone.gold TO `data-analysts`;\nGRANT SELECT ON SCHEMA capstone.gold TO `data-analysts`;\n\nGRANT ALL PRIVILEGES ON CATALOG capstone TO `data-engineers`;\n\nSHOW GRANTS ON SCHEMA capstone.gold;\n```\n\ndata-analystsにBronze/Silverへのアクセスを与えない理由は、Bronzeが加工前の生データであり誤った解釈をされるリスクがあること、Silverも中間状態でありビジネス上の正式な数値として扱うべきではないためです。最小権限の原則に従い、分析担当には「意思決定に使ってよい」と保証されたGoldだけを見せます。",
        outcomes: [
          "役割に応じた最小権限のアクセス制御を設計・付与できる",
          "Bronze/Silver/Goldそれぞれへのアクセス範囲を意図を持って制限できる",
        ],
        relatedJobs: ["Data Platform Engineer", "Data Engineer", "Databricks管理者"],
        skillTags: ["Unity Catalog権限設計", "最小権限の原則"],
        referenceLinks: [
          { label: "Databricks: Unity Catalogとは", url: "https://docs.databricks.com/en/data-governance/unity-catalog/index.html" },
        ],
        quizzes: [
          {
            question: "この演習の役割設計で、data-analystsに与えるべき権限として最も適切なものはどれですか？",
            options: [
              { label: "Bronze/Silver/Goldすべてへの編集権限", isCorrect: false },
              { label: "Goldスキーマへの参照（SELECT）権限のみ", isCorrect: true },
              { label: "カタログ全体の管理者権限", isCorrect: false },
            ],
          },
        ],
      },
      {
        slug: "capstone-compute-orchestration",
        title: "コンピュートとWorkflowsによるパイプラインの自動化",
        type: LessonType.EXERCISE,
        attentionText:
          "ここまでの処理を、あなたが毎朝手作業でノートブックを1つずつ実行していくつもりですか？それでは「担当者が休んだ日はデータが更新されない基盤」になってしまいます。",
        relevanceText:
          "手作業のパイプラインを、依存関係とスケジュールを持つ自動運用の仕組みに変える力が、単発の実装者と、任せられる基盤担当者の違いを決定づけます。",
        lectureContent:
          "## パイプライン全体を1つのWorkflowにする\n\nこれまで個別に実行してきたBronze取り込み・Silver変換・Gold集計を、依存関係を持つ1つのWorkflow（Job）としてまとめます。\n\n```\nTask 1: extract_and_bronze（API取得 → Bronze保存）\n   ↓ 成功したら\nTask 2: silver_transform（Bronze → Silver変換）\n   ↓ 成功したら\nTask 3: gold_aggregate（Silver → Gold集計）\n```\n\n## コンピュートの選び方\n\n- Task 1〜3はいずれも数分で終わる軽量な処理のため、**Job Cluster**または**Serverless Compute**を使い、実行後は自動終了させるのが適切です（Level 2で学んだAuto Terminationの考え方の実践）。\n- 開発中の試行錯誤には別途All-Purpose Clusterを使い、本番相当のWorkflow実行にはJob Clusterを使う、という使い分けを徹底します。\n\n## スケジュールと失敗時の通知\n\nWorkflowsでは「毎日午前6時に実行」のようなCron形式のスケジュールと、いずれかのタスクが失敗した際のメール通知を設定できます。これにより、担当者が気づかないうちにパイプラインが止まり続ける事態を防ぎます。",
        exampleContent:
          "例えば、Task 2（Silver変換）が失敗した場合、Task 3（Gold集計）は実行されず、古いGoldデータがそのまま残ります。この「失敗したら後続を止める」という依存関係の設定こそが、誤った集計結果をダッシュボードに表示させない安全装置になります。",
        handsOnContent:
          "**ハンズオン課題**\n\n1. Databricks Free Editionの「Jobs & Pipelines」で新しいJobを作成し、これまでのレッスンで作ったBronze取り込み・Silver変換・Gold集計のノートブック（またはセル）を、それぞれ別タスクとして登録してください。\n2. タスク間に「前のタスクが成功したら次を実行する」という依存関係を設定してください。\n3. コンピュートの設定で、Job Cluster（またはServerless Compute）を選択し、実行後に自動終了する構成になっているか確認してください。\n4. スケジュール設定でCron形式の実行時刻を設定し、失敗時のメール通知先を設定してください（実際に有効化するかは任意です）。",
        modelAnswerContent:
          "**模範解答例**\n\n- タスク構成：`extract_and_bronze` → `silver_transform` → `gold_aggregate` の順に依存関係を設定（Databricks UIでは各タスクの「Depends on」に前段タスクを指定）\n- コンピュート：3タスクとも軽量処理のためJob Cluster（最小構成、Auto Termination有効）を選択\n- スケジュール：`0 6 * * *`（毎日午前6時）\n- 通知：失敗時に自分（またはチームのメーリングリスト）宛にメール通知が届くよう設定\n\nこの構成により、silver_transformが失敗した場合はgold_aggregateが実行されず、古い（間違っていない）Goldデータが保たれたまま、担当者に失敗が通知されます。",
        outcomes: [
          "複数タスクの依存関係を持つWorkflowを構築できる",
          "処理内容に応じたコンピュートの選定とAuto Terminationの適用ができる",
        ],
        relatedJobs: ["Data Engineer", "Data Platform Engineer", "Analytics Engineer"],
        skillTags: ["Workflowsオーケストレーション", "コンピュート選定"],
        referenceLinks: [
          { label: "Databricks Workflows（Jobs）の概要", url: "https://docs.databricks.com/en/jobs/index.html" },
          { label: "Databricks Compute（クラスタ）の概要", url: "https://docs.databricks.com/en/compute/index.html" },
        ],
        quizzes: [
          {
            question: "silver_transformタスクが失敗した場合、依存関係が正しく設定されていればgold_aggregateタスクはどうなりますか？",
            options: [
              { label: "実行されず、古いGoldデータがそのまま保たれる", isCorrect: true },
              { label: "空のデータで強制的に実行される", isCorrect: false },
              { label: "自動的にBronzeのデータを直接ダッシュボードに表示する", isCorrect: false },
            ],
          },
        ],
      },
      {
        slug: "capstone-delta-sharing",
        title: "Delta Sharingで社外の関係者とデータを安全に共有する",
        type: LessonType.TEXT,
        attentionText:
          "本部の企画チームが「このデータを見たい」と言ってきました。ただし、彼らはDatabricksのアカウントを持っていません。CSVをメールで送りますか？",
        relevanceText:
          "Databricksアカウントを持たない相手にも、コピーを作らず安全にデータを共有できる技術を知っていることは、単一組織内の実装者を超えた「データ基盤全体の窓口」としての価値になります。",
        lectureContent:
          "## Delta Sharingとは\n\nDelta Sharingは、Databricksのオープンなデータ共有プロトコルです。共有元は特定のテーブルを「共有（Share）」として定義し、共有先はDatabricksのアカウントを持っていなくても、Delta Sharingクライアント（Pythonライブラリなど）を使ってそのデータを読み取ることができます。\n\n## メールでのファイル送付との違い\n\n- **ファイル送付**：送った時点のスナップショットがコピーされ、元データが更新されても相手には反映されない。機微なデータが複数の場所に散らばるリスクがある\n- **Delta Sharing**：データ自体はコピーされず、共有元のテーブルを都度参照する形になるため、元データが更新されれば共有先が見る内容も自動的に最新化される。アクセス権限も共有元でいつでも取り消せる\n\n## 共有の作成（イメージ）\n\n```sql\nCREATE SHARE weather_gold_share;\nALTER SHARE weather_gold_share ADD TABLE capstone.gold.weather_daily_summary;\n\nCREATE RECIPIENT hq_planning_team;\n\nGRANT SELECT ON SHARE weather_gold_share TO RECIPIENT hq_planning_team;\n```\n\n共有するのはGold層のテーブルのみとし、Bronze/Silverは共有しない、という判断もガバナンス設計（前レッスン）の延長線上にあります。",
        exampleContent:
          "本部企画チームがDatabricksのアカウントを持っていなくても、Delta Sharingクライアント経由で`weather_daily_summary`の最新データをPandas DataFrameとして読み込めます。データがこちらのDelta Lake上に留まったまま「見せる」ことができる点が、コピーを配布する方法との決定的な違いです。",
        handsOnContent:
          "**設計・記述課題**\n\n1. `capstone.gold.weather_daily_summary`だけを共有する`Share`を作成するSQL文を書いてください（Bronze/Silverは含めないでください）。\n2. 社外の受信者（Recipient）を1つ想定し、作成するSQL文を書いてください。\n3. その受信者に、作成したShareへの参照権限を与えるGRANT文を書いてください。\n4. 「なぜBronze/Silverではなく、Goldだけを共有対象にするのか」を、前レッスンの権限制御の考え方と関連づけて説明してください。",
        modelAnswerContent:
          "**模範解答**\n\n```sql\nCREATE SHARE weather_gold_share;\nALTER SHARE weather_gold_share ADD TABLE capstone.gold.weather_daily_summary;\n\nCREATE RECIPIENT hq_planning_team;\nGRANT SELECT ON SHARE weather_gold_share TO RECIPIENT hq_planning_team;\n```\n\nBronze/Silverではなく Goldだけを共有する理由は、社外の相手には「意思決定に使ってよい」と保証された集計済みデータだけを見せるべきであり、生データや中間データを外部に渡すと、機微な情報の混入や意図しない誤解釈のリスクが生じるためです。これは前レッスンの「最小権限の原則」を、組織の外側に対しても適用した考え方です。",
        outcomes: [
          "Delta Sharingの仕組みとファイル送付との違いを説明できる",
          "共有範囲をGold層に限定する設計判断ができる",
        ],
        relatedJobs: ["Data Platform Engineer", "Data Engineer", "Databricks管理者"],
        skillTags: ["Delta Sharing"],
        referenceLinks: [
          { label: "Databricks: Delta Sharingとは", url: "https://www.databricks.com/product/delta-sharing" },
        ],
        quizzes: [
          {
            question: "Delta Sharingがメールでのファイル送付と比べて優れている点として最も適切なものはどれですか？",
            options: [
              { label: "元データが更新されると共有先の参照内容も自動的に最新化される", isCorrect: true },
              { label: "共有先もDatabricksのアカウントを必ず持つ必要がある", isCorrect: false },
              { label: "共有する前にすべてのデータをファイルに変換する必要がある", isCorrect: false },
            ],
          },
        ],
      },
      {
        slug: "capstone-bi-visualization",
        title: "Gold層からのBI可視化：ダッシュボードで意思決定を支援する",
        type: LessonType.EXERCISE,
        attentionText:
          "どれだけ精緻な分析をしても、店長に「結局どういうこと？」と聞き返されたら、その分析は伝わっていません。",
        relevanceText:
          "集計結果を分かりやすく可視化し、意思決定に繋げる力は、Data AnalystやBI Engineerとして評価される「伝わる仕事」の総仕上げです。data-analysts役割がGold層だけを参照する、という前レッスンの権限設計もここで実際に活きてきます。",
        lectureContent:
          "## Goldテーブルを読むだけで済むダッシュボード\n\n`capstone.gold.weather_daily_summary`はすでに集計済みのため、ダッシュボード側では複雑な集計クエリを書く必要がありません。\n\n```sql\nSELECT is_rainy, day_count, avg_temp_max, avg_precipitation\nFROM capstone.gold.weather_daily_summary;\n```\n\n## ダッシュボードとしての可視化\n\nDatabricksのSQLエディタでは、クエリ結果からそのままグラフ（棒グラフ・折れ線グラフなど）を作成し、ダッシュボードにまとめることができます。「日別の気温推移」「雨の日の日数」などをグラフにすることで、依頼者に一目で伝わる資料になります。",
        exampleContent:
          "例えば、日別の最高気温を折れ線グラフにし、降水量を棒グラフで重ねて表示すると、「気温が下がった日に雨が降っている」といった傾向が視覚的に把握できます。これは、実際のBIツール（Databricks SQLダッシュボードやTableau等）で日常的に行われている可視化パターンです。",
        handsOnContent:
          "**ハンズオン課題**\n\n1. `capstone.gold.weather_daily_summary`に対してSELECT文を実行し、結果を確認してください。\n2. Databricks SQLエディタのグラフ機能を使い、日別の気温推移を折れ線グラフとして可視化してみましょう（Silver層の`weather_daily`を使っても構いません）。\n3. 作成したグラフを1つ以上ダッシュボードに追加してみましょう（Databricks SQL Dashboards機能）。\n4. 「この結果から、店舗担当者に何を伝えられるか」を2〜3行の言葉でまとめてください。",
        modelAnswerContent:
          "**模範解答**\n\n```sql\nSELECT is_rainy, day_count, avg_temp_max, avg_precipitation\nFROM capstone.gold.weather_daily_summary;\n```\n\nダッシュボードには、`is_rainy`ごとの平均最高気温を比較する棒グラフと、日別の気温推移の折れ線グラフを追加します。店舗担当者への報告例：「雨の日は晴れの日より平均気温が低く、来店数が減る傾向が示唆されます。雨予報の日は在庫やシフトを控えめに調整することを検討してください。」",
        outcomes: [
          "集計済みのGoldテーブルを使って軽量にダッシュボードを構築できる",
          "集計結果をグラフ化し、意思決定に繋がる言葉でまとめられる",
        ],
        relatedJobs: ["BI Engineer", "Analytics Engineer", "Data Analyst"],
        skillTags: ["Databricks SQLダッシュボード", "データ可視化"],
        referenceLinks: [
          { label: "Databricks SQLダッシュボード", url: "https://docs.databricks.com/en/dashboards/index.html" },
        ],
        quizzes: [
          {
            question: "集計・可視化の目的として、このレッスンで最も強調されていることは何ですか？",
            options: [
              { label: "SQLの実行速度を上げること", isCorrect: false },
              { label: "依頼者が状況を一目で理解し、意思決定に活かせるようにすること", isCorrect: true },
              { label: "できるだけ多くのグラフを作ること", isCorrect: false },
            ],
          },
        ],
      },
      {
        slug: "capstone-wrap-up",
        title: "総まとめ：Databricks担当者としてデータ基盤を任せられる人材へ",
        type: LessonType.TEXT,
        attentionText:
          "Level 1で「行と列」から始まったあなたの学習が、気づけばメダリオンアーキテクチャの設計、権限制御、パイプラインの自動化、社外へのデータ共有まで辿り着きました。",
        relevanceText:
          "この経験を「実務でどう語れるか」に変換することが、副業案件への応募や面接で「単なる実装者ではなく、基盤を任せられる人材」として自信を持って一歩を踏み出すための、最後の総仕上げです。",
        lectureContent:
          "## あなたがこのコースで実際に行ったこと\n\n1. 公開APIから外部データを取得した（Extract）\n2. メダリオンアーキテクチャ（Bronze/Silver/Gold）を設計し、実装した\n3. Unity Catalogで役割ごとのアクセス権限を設計・付与した（ガバナンス）\n4. Workflowsで依存関係とスケジュールを持つパイプラインに自動化した（コンピュート運用）\n5. Delta Sharingで社外の関係者にGold層のデータを安全に共有した\n6. 集計・可視化を行い、ビジネスの問いに答える資料を作った（BI）\n\nこれは、実務のデータ基盤運用の縮図です。企業の現場では、扱うデータの種類や規模が変わるだけで、行っている工程の骨格は今回とほとんど同じです。\n\n## 「単なる実装者」と「基盤を任せられる人材」の違い\n\nコードを書いてテーブルを作れるだけでは「実装者」です。今回のように、**設計してから作る**（メダリオン）、**誰が何にアクセスできるかを決める**（ガバナンス）、**止まらない仕組みにする**（オーケストレーション）、**社外との境界を安全に設計する**（Delta Sharing）まで一通りできることが、「Databricks担当者としてデータ基盤全体を任せられる人材」であることの証明になります。\n\n## どのポジションで、この経験が使えるか\n\n- **Data Engineer / Data Platform Engineer**：メダリオンアーキテクチャの設計・実装・運用、パイプラインのオーケストレーション\n- **Analytics Engineer**：Silver/Goldの設計、BIとの橋渡し\n- **Databricks管理者**：Unity Catalogによる権限設計、Delta Sharingを含むガバナンス全体の統括\n- **BI Engineer / Data Analyst**：Goldテーブルを起点にしたダッシュボード設計、意思決定支援",
        exampleContent:
          "面接や職務経歴書では、「Open-Meteo APIから気象データを取得し、メダリオンアーキテクチャで整理したうえで、Unity Catalogによる権限制御とWorkflowsによる自動化、Delta Sharingによる社外共有までを含む小規模データ基盤を個人で構築した」という経験として説明できます。実務未経験であっても、基盤全体を見渡して構築した経験として、単なる「SQLが書ける」を超えたアピールになります。",
        handsOnContent:
          "**振り返り課題**\n\n1. 今回構築したデータ基盤（Bronze→Silver→Gold、権限設計、Workflows、Delta Sharing）を、図や箇条書きで書き出してみましょう。\n2. その中で「一番苦労したこと」「一番『実務っぽい』と感じたこと」をそれぞれ1つ書き出してみましょう。\n3. 目指すポジション（Data Engineer、Databricks管理者など）を1つ選び、今回の経験のうちどの部分を面接でアピールするか、2〜3行でまとめてください。\n4. 次に学んでみたいテーマ（例：より大規模なデータ、Snowflakeなど他サービス、CI/CDを使ったデータ基盤の自動デプロイなど）を1つ考えてみましょう。",
        modelAnswerContent:
          "**模範解答例**\n\n図：`Open-Meteo API → Bronze（生データ蓄積）→ Silver（クレンジング）→ Gold（集計）→ ダッシュボード` に加え、`Unity Catalogによる役割別権限`と`Workflowsによる自動実行`が全体を支え、`Delta Sharing`でGoldの一部が社外にも共有されている構成。\n\nアピール例（Data Platform Engineer志望の場合）：「個人開発ながら、単なるETL実装にとどまらず、メダリオンアーキテクチャによる設計、Unity Catalogでの最小権限アクセス制御、Workflowsによる自動運用、Delta Sharingでの社外共有までを一通り構築した経験があります。」",
        outcomes: [
          "メダリオンアーキテクチャ・ガバナンス・オーケストレーション・Delta Sharingを含む一連のデータ基盤を自分の言葉で説明できる",
          "この経験が実務のどのポジション（特にデータ基盤全体を任される役割）で活きるかを説明できる",
        ],
        relatedJobs: ["Data Engineer", "Data Platform Engineer", "Analytics Engineer", "BI Engineer", "Data Analyst"],
        skillTags: ["データ基盤設計力", "キャリア接続"],
        referenceLinks: [
          { label: "Databricks: メダリオンアーキテクチャ", url: "https://www.databricks.com/glossary/medallion-architecture" },
        ],
        quizzes: [
          {
            question:
              "このコースで構築した内容のうち、「単なる実装者」と「データ基盤を任せられる人材」を分ける要素として最も適切な組み合わせはどれですか？",
            options: [
              { label: "SQLを書けることと、グラフを作れること", isCorrect: false },
              { label: "設計（メダリオン）・権限制御（ガバナンス）・自動化（オーケストレーション）・安全な共有（Delta Sharing）", isCorrect: true },
              { label: "できるだけ多くのプログラミング言語を使うこと", isCorrect: false },
            ],
          },
        ],
      },
    ],
  },
];

export async function seedDatabase(prisma: PrismaClient) {
  console.log("Seeding app settings...");
  await prisma.appSetting.upsert({
    where: { key: "signup_enabled" },
    create: { key: "signup_enabled", value: "true" },
    update: {},
  });

  console.log("Seeding courses...");
  for (let courseIndex = 0; courseIndex < courses.length; courseIndex++) {
    const courseSeed = courses[courseIndex];

    const course = await prisma.course.upsert({
      where: { slug: courseSeed.slug },
      create: {
        slug: courseSeed.slug,
        title: courseSeed.title,
        description: courseSeed.description,
        missionText: courseSeed.missionText,
        closingColumn: courseSeed.closingColumn,
        level: courseSeed.level,
        orderIndex: courseIndex,
        isPublished: true,
      },
      update: {
        title: courseSeed.title,
        description: courseSeed.description,
        missionText: courseSeed.missionText,
        closingColumn: courseSeed.closingColumn,
        level: courseSeed.level,
        orderIndex: courseIndex,
      },
    });

    for (let lessonIndex = 0; lessonIndex < courseSeed.lessons.length; lessonIndex++) {
      const lessonSeed = courseSeed.lessons[lessonIndex];

      const lesson = await prisma.lesson.upsert({
        where: { courseId_slug: { courseId: course.id, slug: lessonSeed.slug } },
        create: {
          courseId: course.id,
          slug: lessonSeed.slug,
          title: lessonSeed.title,
          type: lessonSeed.type,
          orderIndex: lessonIndex,
          attentionText: lessonSeed.attentionText,
          relevanceText: lessonSeed.relevanceText,
          lectureContent: lessonSeed.lectureContent,
          exampleContent: lessonSeed.exampleContent,
          handsOnContent: lessonSeed.handsOnContent,
          modelAnswerContent: lessonSeed.modelAnswerContent,
          outcomesJson: JSON.stringify(lessonSeed.outcomes),
          relatedJobs: lessonSeed.relatedJobs.join(","),
          skillTagsJson: JSON.stringify(lessonSeed.skillTags),
          referenceLinksJson: JSON.stringify(lessonSeed.referenceLinks),
        },
        update: {
          title: lessonSeed.title,
          type: lessonSeed.type,
          orderIndex: lessonIndex,
          attentionText: lessonSeed.attentionText,
          relevanceText: lessonSeed.relevanceText,
          lectureContent: lessonSeed.lectureContent,
          exampleContent: lessonSeed.exampleContent,
          handsOnContent: lessonSeed.handsOnContent,
          modelAnswerContent: lessonSeed.modelAnswerContent,
          outcomesJson: JSON.stringify(lessonSeed.outcomes),
          relatedJobs: lessonSeed.relatedJobs.join(","),
          skillTagsJson: JSON.stringify(lessonSeed.skillTags),
          referenceLinksJson: JSON.stringify(lessonSeed.referenceLinks),
        },
      });

      // Replace quizzes for this lesson to keep seeding idempotent.
      await prisma.quiz.deleteMany({ where: { lessonId: lesson.id } });

      for (let quizIndex = 0; quizIndex < lessonSeed.quizzes.length; quizIndex++) {
        const quizSeed = lessonSeed.quizzes[quizIndex];
        await prisma.quiz.create({
          data: {
            lessonId: lesson.id,
            question: quizSeed.question,
            orderIndex: quizIndex,
            options: {
              create: quizSeed.options.map((option, optionIndex) => ({
                label: option.label,
                isCorrect: option.isCorrect,
                orderIndex: optionIndex,
              })),
            },
          },
        });
      }
    }
  }

  console.log("Seeding admin user...");
  const bcrypt = await import("bcryptjs");
  const adminPasswordHash = await bcrypt.hash("Admin1234!", 10);
  await prisma.user.upsert({
    where: { email: "admin@example.com" },
    create: {
      email: "admin@example.com",
      passwordHash: adminPasswordHash,
      displayName: "管理者",
      isAdmin: true,
    },
    update: {},
  });

  console.log("Seed complete.");
}
