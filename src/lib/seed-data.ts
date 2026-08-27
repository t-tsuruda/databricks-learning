import type { PrismaClient, LessonType as LessonTypeT } from "@prisma/client";
import { LessonType } from "@prisma/client";

type QuizSeed = {
  question: string;
  options: { label: string; isCorrect: boolean }[];
};

type LessonSeed = {
  slug: string;
  title: string;
  type: LessonTypeT;
  introText: string;
  lectureContent: string;
  exampleContent: string;
  handsOnContent: string;
  outcomes: string[];
  relatedJobs: string[];
  quizzes: QuizSeed[];
};

type CourseSeed = {
  slug: string;
  title: string;
  description: string;
  missionText: string;
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
    level: 1,
    lessons: [
      {
        slug: "what-is-data",
        title: "データとは何か：表形式データの基本",
        type: LessonType.TEXT,
        introText:
          "すべてのデータ活用は「データを正しく理解すること」から始まります。この章では、業務で扱う表形式データ(テーブル)の基本構造を理解し、これから学ぶSQLやDatabricksの土台を作ります。",
        lectureContent:
          "## 表形式データの基本\n\nビジネスの現場で扱うデータの多くは「行(レコード)」と「列(カラム)」で構成される表形式データです。\n\n- **行(Row)**: 1件のデータ(例:1人の顧客、1件の注文)\n- **列(Column)**: データの属性(例:顧客名、注文日、金額)\n- **主キー(Primary Key)**: 各行を一意に識別するID\n\nDatabricksやSQLデータベースでは、こうした表を「テーブル」と呼び、複数のテーブルを組み合わせて分析を行います。",
        exampleContent:
          "例えば、以下のような `orders`(注文)テーブルを考えます。\n\n| order_id | customer_name | amount | order_date |\n|---|---|---|---|\n| 1 | 田中 | 3000 | 2026-01-05 |\n| 2 | 鈴木 | 5400 | 2026-01-06 |\n\nこの表から「合計売上はいくらか」「一番多く買っている顧客は誰か」を求めるのがデータ分析の第一歩です。",
        handsOnContent:
          "**ハンズオン課題**\n\n1. 手元の紙またはメモアプリに、あなたの好きな題材(本棚、家計簿、好きな曲リストなど)を表形式データとして書き出してみましょう。\n2. 行・列・主キーがそれぞれ何にあたるかを1行ずつ書き添えてください。\n3. できたら「確認する」に進み、理解度チェックに答えましょう。",
        outcomes: [
          "表形式データの行・列・主キーの意味を説明できる",
          "身の回りの情報を表形式データとして捉え直せる",
        ],
        relatedJobs: ["Data Analyst", "Reporting Analyst", "BI Support"],
        quizzes: [
          {
            question: "表形式データにおいて「1件のデータ」を表す単位はどれですか？",
            options: [
              { label: "列(Column)", isCorrect: false },
              { label: "行(Row)", isCorrect: true },
              { label: "テーブル名", isCorrect: false },
            ],
          },
        ],
      },
      {
        slug: "sql-select-basics",
        title: "SQLの基本：SELECT文でデータを取り出す",
        type: LessonType.EXERCISE,
        introText:
          "SQLはデータ活用の共通言語です。まずは最も基本的な `SELECT` 文をマスターし、テーブルから必要な情報だけを取り出せるようになりましょう。",
        lectureContent:
          "## SELECT文の基本構文\n\n```sql\nSELECT カラム名\nFROM テーブル名\nWHERE 条件;\n```\n\n- `SELECT`: 取得したい列を指定\n- `FROM`: 対象のテーブルを指定\n- `WHERE`: 絞り込み条件を指定\n\nこの3つを組み合わせるだけで、大量のデータから必要な情報だけを抽出できます。",
        exampleContent:
          "```sql\n-- 3000円より高い注文だけを取得する\nSELECT customer_name, amount\nFROM orders\nWHERE amount > 3000;\n```\n\nこのクエリは `orders` テーブルから、`amount` が3000より大きい行の `customer_name` と `amount` を取り出します。",
        handsOnContent:
          "**ハンズオン課題(Databricks Free Edition推奨)**\n\n1. Databricks Free EditionのSQLエディタ、または任意のSQL実行環境を開きます。\n2. サンプルテーブル(`samples.tpch.orders` など、Databricksが提供するサンプルデータ)に対して `SELECT` 文を実行し、上位10件を表示してみましょう。\n3. `WHERE` 句を使って、任意の条件(金額・日付など)で絞り込みを行いましょう。",
        outcomes: [
          "SELECT / FROM / WHERE の役割を説明できる",
          "簡単な条件でデータを絞り込むSQLを書ける",
        ],
        relatedJobs: ["Data Analyst", "Reporting Analyst", "Junior Data Engineer"],
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
        introText:
          "1件ずつのデータではなく「全体の傾向」を掴めるようになると、データ分析の価値が一気に高まります。集計関数とGROUP BYを学びましょう。",
        lectureContent:
          "## 集計関数とGROUP BY\n\n- `COUNT()`: 件数を数える\n- `SUM()`: 合計を求める\n- `AVG()`: 平均を求める\n- `GROUP BY`: 指定した列の値ごとにグループ化して集計する\n\n```sql\nSELECT customer_name, SUM(amount) AS total_amount\nFROM orders\nGROUP BY customer_name;\n```",
        exampleContent:
          "上記のクエリを実行すると、顧客ごとの合計購入金額が一覧で得られます。これは「優良顧客はだれか」を把握する際によく使われる分析パターンです。",
        handsOnContent:
          "**ハンズオン課題**\n\n1. サンプルの注文データに対して、顧客ごとの合計金額を集計するSQLを書いて実行しましょう。\n2. `ORDER BY total_amount DESC` を追加し、合計金額が多い順に並び替えてみましょう。\n3. 結果からどの顧客が最も貢献しているかをメモしましょう。",
        outcomes: [
          "COUNT/SUM/AVGなど集計関数を使える",
          "GROUP BYでデータをグループ単位に集計できる",
        ],
        relatedJobs: ["Data Analyst", "BI Support", "Junior Data Engineer"],
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
        introText:
          "実務のデータは1つのテーブルで完結しません。複数テーブルをどう分割し、どう繋げるかという「データモデリング」の考え方を学びます。",
        lectureContent:
          "## テーブルを分割する理由\n\n顧客情報を注文テーブルに毎回書き込むと、同じ情報が重複し、更新漏れが起きやすくなります。そこで、\n\n- `customers`(顧客マスタ)\n- `orders`(注文トランザクション)\n\nのようにテーブルを分割し、`customer_id` で紐づける設計(正規化)を行います。これによりデータの一貫性が保たれ、実務でのETL・分析基盤設計の土台になります。",
        exampleContent:
          "```sql\nSELECT o.order_id, c.customer_name, o.amount\nFROM orders o\nJOIN customers c ON o.customer_id = c.customer_id;\n```\n\nJOINを使うことで、分割されたテーブルを結合し、必要な情報を1つの結果として取得できます。",
        handsOnContent:
          "**ハンズオン課題**\n\n1. 「顧客マスタ」と「注文」の2つの表を紙やスプレッドシートで設計してみましょう。\n2. 共通のID(顧客ID)で2つの表を結びつける設計にしましょう。\n3. 可能であれば、SQL環境でJOINを使って実際に結合結果を確認しましょう。",
        outcomes: [
          "テーブルを分割する理由(正規化)を説明できる",
          "JOINを使って複数テーブルを結合できる",
        ],
        relatedJobs: ["Data Analyst", "Data Engineer Intern", "Analytics Engineer"],
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
    ],
  },
  {
    slug: "python-for-data",
    title: "Pythonでのデータ操作基礎",
    description: "PythonとpandasライクなDataFrame操作で、SQLでは難しい柔軟なデータ処理を学びます。",
    missionText:
      "このコースを終えると、Pythonでデータを読み込み、加工し、簡単な集計ができるようになります。ETLの実装言語としての第一歩です。",
    level: 1,
    lessons: [
      {
        slug: "python-basics-for-data",
        title: "データ処理のためのPython基礎",
        type: LessonType.TEXT,
        introText:
          "PythonはDatabricksを含む多くのデータ基盤で標準的に使われる言語です。データ処理に必要な最低限の文法を押さえましょう。",
        lectureContent:
          "## 変数・リスト・辞書\n\n```python\nsales = [3000, 5400, 1200]\ntotal = sum(sales)\naverage = total / len(sales)\n```\n\nデータエンジニアリングでは、こうした基本構文の組み合わせでデータの読み込み・変換・書き出しを行います。",
        exampleContent:
          "```python\norders = [\n    {\"customer\": \"田中\", \"amount\": 3000},\n    {\"customer\": \"鈴木\", \"amount\": 5400},\n]\ntotal = sum(o[\"amount\"] for o in orders)\nprint(total)  # 8300\n```",
        handsOnContent:
          "**ハンズオン課題**\n\n1. Databricks Free EditionのノートブックでPythonセルを1つ作成してください。\n2. 上記のような辞書のリストを自分で作り、合計金額を計算するコードを書いて実行してみましょう。",
        outcomes: ["Pythonの基本文法(変数・リスト・辞書)を使える", "簡単な集計処理をコードで書ける"],
        relatedJobs: ["Data Engineer Intern", "Junior Data Engineer"],
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
        slug: "dataframe-basics",
        title: "DataFrameでデータを扱う",
        type: LessonType.EXERCISE,
        introText:
          "DataFrameは表形式データをコードで扱うための標準的な仕組みです。Databricksの中心的な操作対象でもあります。",
        lectureContent:
          "## DataFrameの基本操作\n\nDataFrameは行と列を持つ表形式のデータ構造です。Databricksでは主にPySparkのDataFrameを使いますが、考え方はpandasと共通しています。\n\n- フィルタリング:条件で行を絞り込む\n- 選択:必要な列だけ取り出す\n- 集計:グループごとに集計する",
        exampleContent:
          "```python\n# PySparkの例\ndf.filter(df.amount > 3000).select(\"customer_name\", \"amount\").show()\n```\n\nSQLの `WHERE` や `SELECT` に近い操作を、コードで表現できます。",
        handsOnContent:
          "**ハンズオン課題**\n\n1. Databricks Free Editionでサンプルデータを読み込み、DataFrameとして表示してください。\n2. `filter` と `select` を使って、条件に合うデータだけを抽出してみましょう。",
        outcomes: ["DataFrameの基本的な考え方を理解する", "filter/selectでデータを加工できる"],
        relatedJobs: ["Data Engineer Intern", "Analytics Engineer"],
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
    ],
  },
  {
    slug: "data-modeling-fundamentals",
    title: "データモデリング基礎編",
    description: "ディメンションとファクト、スタースキーマなど、分析基盤の設計に欠かせない考え方を学びます。",
    missionText:
      "このレベルに到達すると、データ分析の下準備と簡単なパイプライン構築に参加できるようになります。",
    level: 1,
    lessons: [
      {
        slug: "fact-dimension",
        title: "ファクトテーブルとディメンションテーブル",
        type: LessonType.TEXT,
        introText:
          "分析基盤の世界では「何を計測するか(ファクト)」と「どう切り口で見るか(ディメンション)」を分けて設計します。",
        lectureContent:
          "## ファクトとディメンション\n\n- **ファクトテーブル**: 売上金額、注文数など「測定値」を持つテーブル\n- **ディメンションテーブル**: 顧客、商品、日付など「切り口」を持つテーブル\n\nこの分離により、様々な切り口で同じ指標を分析できるようになります(スタースキーマ)。",
        exampleContent:
          "`fact_sales`(売上ファクト)と `dim_customer`(顧客ディメンション)、`dim_date`(日付ディメンション)を組み合わせることで、「月別」「顧客別」「地域別」など多様な集計が可能になります。",
        handsOnContent:
          "**ハンズオン課題**\n\n1. あなたが知っているサービス(ECサイトなど)を題材に、ファクトテーブルとディメンションテーブルを1つずつ考えてみましょう。\n2. それぞれにどんな列が必要かを書き出してみましょう。",
        outcomes: ["ファクト/ディメンションの違いを説明できる", "スタースキーマの基本構造をイメージできる"],
        relatedJobs: ["Analytics Engineer", "Junior Data Engineer"],
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
    ],
  },
  {
    slug: "databricks-lakehouse-intro",
    title: "Databricksとlakehouseの基礎",
    description: "Databricksが提唱するLakehouseアーキテクチャの考え方と、Workspaceの基本構成を学びます。",
    missionText:
      "このレベルに到達すると、Databricksの全体像を理解し、実際の操作に自信を持って進めるようになります。",
    level: 2,
    lessons: [
      {
        slug: "what-is-lakehouse",
        title: "Lakehouseとは何か",
        type: LessonType.TEXT,
        introText:
          "Databricksを理解する第一歩は「Lakehouse」という考え方を知ることです。データウェアハウスとデータレイクの良いところを組み合わせた概念です。",
        lectureContent:
          "## データウェアハウス・データレイク・Lakehouse\n\n- **データウェアハウス**: 構造化データに強いが、柔軟性やコストに課題\n- **データレイク**: あらゆる形式のデータを安価に貯められるが、品質管理が難しい\n- **Lakehouse**: データレイクの上にウェアハウス的な信頼性・管理機能を載せたアーキテクチャ\n\nDatabricksはこのLakehouseをDelta Lakeという技術で実現しています。",
        exampleContent:
          "例えば、生ログデータ(非構造化)をそのまま安価に保存しつつ、そこから整形したテーブルに対してSQLで高速に分析できるのがLakehouseの強みです。",
        handsOnContent:
          "**ハンズオン課題(Databricks Free Edition)**\n\n1. Databricks Free Editionにサインアップし、Workspaceにログインしてみましょう。\n2. 画面上でCatalog(データ)とWorkspace(ノートブック)の違いを確認しましょう。",
        outcomes: ["Lakehouseの概念を説明できる", "Databricks Workspaceにログインできる"],
        relatedJobs: ["Junior Data Engineer", "Analytics Engineer(初級)"],
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
        introText:
          "Workspaceの画面構成を知ることで、迷わず学習・実践を進められるようになります。",
        lectureContent:
          "## Workspaceの主要な要素\n\n- **Notebook**: SQL/Pythonなどのコードを対話的に実行する場所\n- **Cluster**: コードを実行する計算リソース\n- **Catalog**: テーブルやデータへのアクセスを管理する仕組み(Unity Catalog)\n- **Jobs**: ノートブックなどを定期実行するための機能",
        exampleContent:
          "毎朝決まった時間にETL処理を実行したい場合は、ノートブックを作成し、それをJobsに登録してスケジュール実行させます。",
        handsOnContent:
          "**ハンズオン課題**\n\n1. Databricks Free Editionで新しいNotebookを作成してください。\n2. 簡単なPythonコード(例:`print(\"Hello Databricks\")`)を実行し、動作を確認しましょう。",
        outcomes: ["Notebook/Cluster/Catalog/Jobsの役割を説明できる", "Notebookを作成しコードを実行できる"],
        relatedJobs: ["Junior Data Engineer", "Analytics Engineer(初級)"],
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
    ],
  },
  {
    slug: "delta-lake-jobs",
    title: "Delta LakeとJobsの基礎",
    description: "Databricksの中核技術であるDelta Lakeの特徴と、Jobsによる自動実行の基本を学びます。",
    missionText:
      "このコースを終えると、Databricksを使って簡単なデータパイプラインを運用できるようになります。",
    level: 2,
    lessons: [
      {
        slug: "delta-lake-basics",
        title: "Delta Lakeとは何か",
        type: LessonType.TEXT,
        introText:
          "Delta LakeはDatabricksのLakehouseを支える中核技術です。信頼性の高いデータ管理の仕組みを学びましょう。",
        lectureContent:
          "## Delta Lakeの特徴\n\n- **ACIDトランザクション**: データの整合性を保証\n- **タイムトラベル**: 過去の任意の時点のデータを参照可能\n- **スキーマ管理**: テーブル構造の変更を安全に管理\n\nこれらにより、データレイクでも信頼性の高いテーブル管理が可能になります。",
        exampleContent:
          "```sql\n-- 1時間前のテーブルの状態を確認する(タイムトラベル)\nSELECT * FROM orders VERSION AS OF 3;\n```",
        handsOnContent:
          "**ハンズオン課題**\n\n1. Databricks Free Editionで簡単なDeltaテーブルを作成してください。\n2. データを1件追加・更新し、`DESCRIBE HISTORY` コマンドで変更履歴を確認してみましょう。",
        outcomes: ["Delta Lakeの主要な特徴を説明できる", "Deltaテーブルの変更履歴を確認できる"],
        relatedJobs: ["Junior Data Engineer", "Analytics Engineer(初級)"],
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
    ],
  },
  {
    slug: "etl-pipeline-design",
    title: "ETLパイプライン設計",
    description: "実務レベルのETL(抽出・変換・格納)パイプラインの設計と品質管理の考え方を学びます。",
    missionText:
      "このコースを終えると、実務に近いデータパイプラインの設計・実装ができるようになります。",
    level: 3,
    lessons: [
      {
        slug: "etl-basics",
        title: "ETLの基本設計：Extract, Transform, Load",
        type: LessonType.EXERCISE,
        introText:
          "ETLはデータエンジニアリングの中心的な仕事です。抽出・変換・格納の3ステップを、Databricksでどう実装するかを学びます。",
        lectureContent:
          "## ETLの3ステップ\n\n1. **Extract(抽出)**: 元データ(DB、ファイル、APIなど)から読み込む\n2. **Transform(変換)**: 欠損値処理、型変換、結合などでデータを整形する\n3. **Load(格納)**: 分析用のテーブルに書き込む\n\nDatabricksではこれらをNotebookとJobsで組み合わせて実装します。",
        exampleContent:
          "```python\nraw_df = spark.read.csv(\"/data/raw/orders.csv\", header=True)\nclean_df = raw_df.dropna().withColumnRenamed(\"amt\", \"amount\")\nclean_df.write.mode(\"overwrite\").saveAsTable(\"analytics.orders_clean\")\n```",
        handsOnContent:
          "**ハンズオン課題**\n\n1. Databricks Free Editionでサンプルの生データを読み込んでください。\n2. 欠損値の除去・列名の整形を行い、新しいテーブルとして保存しましょう。\n3. 保存したテーブルに対してSQLで集計を行い、正しく変換できているか確認しましょう。",
        outcomes: ["ETLの3ステップを説明できる", "簡単なETL処理をNotebookで実装できる"],
        relatedJobs: ["Data Engineer", "Data Pipeline Assistant"],
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
    ],
  },
  {
    slug: "performance-and-ops",
    title: "パフォーマンスチューニングと運用",
    description: "パイプラインの性能改善と、実務での安定運用に必要な考え方を学びます。",
    missionText:
      "このコースを終えると、パイプラインの性能改善と安定運用まで見据えたエンジニアリングができるようになります。",
    level: 4,
    lessons: [
      {
        slug: "performance-basics",
        title: "パフォーマンス改善の基本的な考え方",
        type: LessonType.TEXT,
        introText:
          "実務では「動くこと」だけでなく「速く・安定して動くこと」が求められます。パフォーマンス改善の基本的な視点を学びます。",
        lectureContent:
          "## パフォーマンス改善の基本\n\n- **パーティショニング**: データを適切な単位に分割し、処理範囲を絞る\n- **キャッシュ**: 繰り返し使うデータをメモリに保持する\n- **不要な列・行の早期除外**: 処理の最初の段階でデータ量を減らす\n\nこれらはDatabricksに限らず、多くのデータ基盤で共通する考え方です。",
        exampleContent:
          "例えば、日付でパーティショニングされたテーブルに対して、特定の日付範囲だけを読み込むクエリは、全件スキャンより大幅に高速化されます。",
        handsOnContent:
          "**ハンズオン課題**\n\n1. これまでのハンズオンで作成したテーブルのクエリ実行時間を確認してみましょう。\n2. `WHERE` 句で日付範囲を絞った場合と絞らない場合の実行時間を比較してみましょう。",
        outcomes: ["パフォーマンス改善の基本的な考え方を説明できる", "パーティショニングの効果をイメージできる"],
        relatedJobs: ["Data Engineer", "Analytics Engineer"],
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
    ],
  },
];

const motivationalMessages = [
  "最初の1歩は小さくても、あなたはすでにデータの入口に立っている",
  "この単元を終えると、実務でよく使うデータ処理の基礎が身につく",
  "今のあなたは、未経験者ではなく『学び始めた人』だ",
  "次のステップに進むと、業務で使うスキルに近づく",
  "あなたの成長は、求人での価値に直結している",
];

export async function seedDatabase(prisma: PrismaClient) {
  console.log("Seeding app settings...");
  await prisma.appSetting.upsert({
    where: { key: "signup_enabled" },
    create: { key: "signup_enabled", value: "true" },
    update: {},
  });
  await prisma.appSetting.upsert({
    where: { key: "motivational_messages" },
    create: { key: "motivational_messages", value: JSON.stringify(motivationalMessages) },
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
        level: courseSeed.level,
        orderIndex: courseIndex,
        isPublished: true,
      },
      update: {
        title: courseSeed.title,
        description: courseSeed.description,
        missionText: courseSeed.missionText,
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
          introText: lessonSeed.introText,
          lectureContent: lessonSeed.lectureContent,
          exampleContent: lessonSeed.exampleContent,
          handsOnContent: lessonSeed.handsOnContent,
          outcomesJson: JSON.stringify(lessonSeed.outcomes),
          relatedJobs: lessonSeed.relatedJobs.join(","),
        },
        update: {
          title: lessonSeed.title,
          type: lessonSeed.type,
          orderIndex: lessonIndex,
          introText: lessonSeed.introText,
          lectureContent: lessonSeed.lectureContent,
          exampleContent: lessonSeed.exampleContent,
          handsOnContent: lessonSeed.handsOnContent,
          outcomesJson: JSON.stringify(lessonSeed.outcomes),
          relatedJobs: lessonSeed.relatedJobs.join(","),
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
