# Databricks学習アプリ

データモデリングなどの基礎からDatabricksの応用までを、座学とハンズオンで段階的に学べる学習プラットフォームです。
`docs/prd.md` の実装指示書に基づいて構築しています。

## 技術スタック

| レイヤー | 採用技術 |
|---|---|
| フロントエンド | Next.js 16 (App Router) / TypeScript / Tailwind CSS v4 |
| バックエンド | Next.js Route Handlers（REST API） |
| 認証 | NextAuth (Auth.js) v5 / Credentials Provider / bcrypt / JWTセッション |
| DB / ORM | Prisma 6 + PostgreSQL（Vercel Postgres / Neon） |
| フォーム / バリデーション | react-hook-form + zod |
| コンテンツ描画 | react-markdown + remark-gfm |
| テスト | ESLint / `next build`（型チェック含む） / Playwright（E2E） |

個人開発・無料枠運用を前提に、依存を最小限に絞っています。

## セットアップ（ローカル開発）

PostgreSQLへの接続が必要です。ローカルにPostgreSQLがある場合はそれを、無い場合は本番用に作成したVercel Postgres/Neonのデータベースをそのまま開発用にも使う想定です（詳細は後述のデプロイ手順を参照）。

```bash
npm install
cp .env.example .env       # DATABASE_URL / DATABASE_URL_UNPOOLED を実際の接続文字列に変更
npx prisma migrate dev     # スキーマを適用
npm run db:seed            # カリキュラムのサンプルデータを投入
npm run dev
```

`http://localhost:3000` を開くとランディングページが表示されます。

### 環境変数（`.env`）

| 変数 | 説明 |
|---|---|
| `DATABASE_URL` | Prismaが実行時に使うプール接続文字列（pgbouncer経由） |
| `DATABASE_URL_UNPOOLED` | `prisma migrate` が使う直接接続文字列（マイグレーションはプーラー非対応のため） |
| `AUTH_SECRET` | NextAuthのセッション署名用シークレット。本番では必ずランダムな値に変更（`openssl rand -base64 32`） |
| `NEXTAUTH_URL` | アプリのベースURL（現状メール送信をスキップしているため実質未使用。将来メール送信を有効化する際に使用） |

Vercelプロジェクトに Postgres ストレージを接続すると、`DATABASE_URL` と `DATABASE_URL_UNPOOLED` は自動的に環境変数として注入されます。ローカル開発でも同じ値を使う場合は `vercel env pull .env` で取得できます（Vercel CLIのインストール・ログインが必要）。

サインアップ受付のON/OFFは環境変数ではなく `AppSetting` テーブルの `signup_enabled` で管理します（`prisma studio` 等で直接更新するか、Phase 2の管理画面から変更する想定）。

### シードデータ

`prisma/seed.ts` が以下を投入します。

- Level 1〜4、計7コース・14レッスン分のカリキュラム（1コース目「データ入門とSQLの基礎」はフル実装、他は導入レッスンを収録）
- 管理者ユーザー: `admin@example.com` / `Admin1234!`（**本番投入前に必ずパスワードを変更してください**）
- アプリ設定（`AppSetting`）: `signup_enabled`（サインアップ受付可否）、`motivational_messages`（ダッシュボードに表示するモチベーションメッセージのプール）

## 主な機能（MVPスコープ）

- ID/PW認証（サインアップ・ログイン・ログアウト・パスワード再設定・退会）
- サインアップの管理者向けON/OFF切り替え（`AppSetting.signup_enabled`）
- コース一覧・コース詳細・レッスン詳細（「学ぶ・試す・確認する」の3層構成）
- 小テスト（選択式）と即時フィードバック
- 学習進捗のリアルタイム保存（レッスン単位・コース単位）
- ダッシュボード：現在のレベル、進捗率、次の学習目標、達成バッジ、身につけたスキル、目指せる役割（求人キーワード）
- 学習進捗ページ：コース別進捗と学習履歴
- マイページ：アカウント情報、退会処理

ARCSモデル（Attention/Relevance/Confidence/Satisfaction）に基づき、各レッスンの導入文・キャリア接続・段階的な難易度・進捗バッジという形で反映しています（詳細は `docs/prd.md` 参照）。

## ディレクトリ構成（抜粋）

```
prisma/schema.prisma      DBスキーマ（User / Course / Lesson / 進捗 / Quiz / AppSetting 等）
prisma/seed.ts            カリキュラムのシードデータ
src/auth.ts               NextAuth設定（Credentials Provider, JWTセッション）
src/proxy.ts              認証必須ルートの保護（旧middleware.ts、Next.js 16の新命名）
src/lib/progress.ts        学習進捗の集計ロジック（レベル・バッジ・次の目標等）
src/app/(各ページ)         ランディング/認証/ダッシュボード/コース/レッスン等
src/app/api/(各API)        REST API（PRD記載のエンドポイントに準拠）
tests/e2e/                Playwright E2Eテスト
```

## テスト

```bash
npm run lint      # ESLint
npm run build     # 本番ビルド + 型チェック
npm run test:e2e  # Playwright E2E（サインアップ→レッスン完了→進捗確認の一連の流れを検証）
```

`test:e2e` は `.env` の `DATABASE_URL` に対して `migrate deploy`（差分なしなら何もしない）とシード（upsertのため冪等）を実行してから起動します。テストは毎回タイムスタンプ付きの新規メールアドレスでユーザーを作成するだけなので、既存の開発データを壊すことはありません。

## セキュリティ対策

- パスワードは bcrypt でハッシュ化（平文保存なし）
- セッションはJWT・HttpOnly・SameSite=Lax Cookie
- 独自APIはOrigin/Refererチェックによる簡易CSRF対策を実装（NextAuth自体のエンドポイントは内蔵のCSRFトークンで保護）
- 入力値はすべて zod でサーバーサイド検証
- サインアップ・パスワード再設定エンドポイントにレート制限（プロセス内メモリベース。**サーバーレス環境では複数インスタンス間で共有されないため、本番運用時は Upstash Redis 等の外部ストアへの置き換えを推奨**）
- セキュリティヘッダー（CSP, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy）を `next.config.ts` で設定
- パスワード再設定は「登録されたメールアドレスかどうかを問わず同じ応答を返す」ことでユーザー列挙を防止

## メール送信について（意図的に未実装）

パスワード再設定メールは `src/lib/mailer.ts` の `sendMail()` を通じて送信される設計になっていますが、
**運用者の判断により、外部メールサービスとの接続は行わずスキップしています。** 実際にはメールは送信されず、内容はサーバーログに出力されるだけです（パスワード再設定リンクを本人だけに渡す手段が無いため、現状パスワード再設定機能は実質使えません）。
将来メール送信を有効化する場合は、Resend / SendGrid / AWS SES などのプロバイダと接続し、`sendMail()` の中身を差し替えてください。

## デプロイ・ホスティング

`docs/prd.md` の提案どおり、**Vercel（フロントエンド + サーバーレス関数）+ PostgreSQL（Vercel Postgres／Neonベース、無料枠）** 構成にしています。`prisma/schema.prisma` は既に `provider = "postgresql"` に切り替え済みで、`npm run build` は `prisma migrate deploy` を自動実行してからNext.jsをビルドします（Vercelのビルドでもそのまま動作します）。

Vercelのアカウント作成・プロジェクト作成・DBプロビジョニングはこちらの権限では実行できないため、**以下の手順をユーザー側で実施してください。**完了後に教えていただければ、動作確認とデプロイURLの確認まで対応します。

### 1. Vercelプロジェクトの作成

1. https://vercel.com/signup で、GitHubアカウント（`t-tsuruda`）でサインアップ/ログイン
2. 「Add New...」→「Project」→ GitHubリポジトリ `t-tsuruda/databricks-learning` をImport
3. インポート画面で **Branch** を `claude/databricks-learning-app-abrbay` に設定（mainにマージ済みでない場合。マージ後にmainへ切り替えても構いません）
4. Framework Presetは自動で「Next.js」が検出されるはずです。そのままDeployせず、**先に「2. Postgresデータベースの接続」を完了してから初回デプロイ**してください

### 2. Postgresデータベースの接続

1. 作成したVercelプロジェクトの **Storage** タブを開く
2. 「Create Database」→ **Postgres**（Neonベース）を選択し、無料プランで作成
3. プロジェクトに接続（Connect）すると、`DATABASE_URL` と `DATABASE_URL_UNPOOLED` が自動的にプロジェクトの環境変数に追加されます（Production/Preview/Development全てに設定するのがおすすめです）

### 3. 環境変数の追加

プロジェクトの **Settings → Environment Variables** で、以下を追加してください（Production環境に必須）。

| 変数名 | 値 |
|---|---|
| `AUTH_SECRET` | `C7HvL6/F+f9VZIE9QzRPiX0kqDdx9WRyJuoKsq4TZsU=`（今回の作業用に生成したランダム値。他のサービスと使い回さないでください） |
| `NEXTAUTH_URL` | デプロイ後に発行されるURL（例: `https://databricks-learning.vercel.app`）。任意設定でOK（メール送信をスキップしているため実質未使用） |

### 4. デプロイ

Storageの接続と環境変数の設定が終わったら、Vercelダッシュボードから「Deploy」（または空コミットのpush）でデプロイを実行してください。ビルド時に `prisma migrate deploy` が自動実行され、本番DBにテーブルが作成されます。**ただしシードデータ（カリキュラム・管理者ユーザー）は自動投入されないため、初回デプロイ後に一度だけ以下を実行してください：**

```bash
# ローカルから本番DBに向けて実行する場合
DATABASE_URL="<Vercelからコピーした本番用DATABASE_URL_UNPOOLED>" npx tsx prisma/seed.ts
```

（`vercel env pull .env.production` で環境変数一式をローカルに落として実行するのが簡単です）

デプロイが完了し、上記の情報（プロジェクトのURL、または完了した旨）を共有いただければ、動作確認を行います。

### 補足：レート制限について

`src/lib/rate-limit.ts` はプロセス内メモリベースの簡易レート制限です。Vercelのサーバーレス関数は複数インスタンスに分散するため、この仕組みは**インスタンスごとに独立してカウントされ、本来期待するほど厳密には効きません**（完全に無効なわけではなく、各インスタンス単位では機能します）。アクセスが増えてきたら Upstash Redis 等の外部ストアに置き換えることを推奨します。

## 今後の拡張（Phase 2以降、docs/prd.md参照）

- コメント/Q&A機能、学習進捗のSNS共有
- 学習リマインドメール・通知
- 管理者画面（コース/レッスンのCRUD、AppSettingのGUI編集）
- 質問生成AIアシスタント
- Databricks Notebook連携・実行コードの保存
- Snowflakeなど他サービスの学習コース追加
- 単体・統合テストの拡充（Vitest等）
