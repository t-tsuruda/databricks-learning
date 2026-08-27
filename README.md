# Databricks学習アプリ

データモデリングなどの基礎からDatabricksの応用までを、座学とハンズオンで段階的に学べる学習プラットフォームです。
`docs/prd.md` の実装指示書に基づいて構築しています。

## 技術スタック

| レイヤー | 採用技術 |
|---|---|
| フロントエンド | Next.js 16 (App Router) / TypeScript / Tailwind CSS v4 |
| バックエンド | Next.js Route Handlers（REST API） |
| 認証 | NextAuth (Auth.js) v5 / Credentials Provider / bcrypt / JWTセッション |
| DB / ORM | Prisma 6 + SQLite（ローカル開発）※本番はPostgreSQLへの切り替えを想定 |
| フォーム / バリデーション | react-hook-form + zod |
| コンテンツ描画 | react-markdown + remark-gfm |
| テスト | ESLint / `next build`（型チェック含む） / Playwright（E2E） |

個人開発・無料枠運用を前提に、依存を最小限に絞っています。

## セットアップ

```bash
npm install
cp .env.example .env   # まだ無ければ作成し、値を確認・調整
npx prisma migrate dev # ローカルSQLite (prisma/dev.db) にスキーマを適用
npm run db:seed        # カリキュラムのサンプルデータを投入
npm run dev
```

`http://localhost:3000` を開くとランディングページが表示されます。

### 環境変数（`.env`）

| 変数 | 説明 |
|---|---|
| `DATABASE_URL` | Prismaの接続文字列。ローカルは `file:./dev.db`（SQLite） |
| `AUTH_SECRET` | NextAuthのセッション署名用シークレット。本番では必ずランダムな値に変更 |
| `NEXTAUTH_URL` | アプリのベースURL（パスワード再設定リンクの生成にも使用） |

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

`test:e2e` は専用のSQLiteファイル（`prisma/e2e-test.db`）にマイグレーション・シードを行ってから起動するため、開発用DBには影響しません。

## セキュリティ対策

- パスワードは bcrypt でハッシュ化（平文保存なし）
- セッションはJWT・HttpOnly・SameSite=Lax Cookie
- 独自APIはOrigin/Refererチェックによる簡易CSRF対策を実装（NextAuth自体のエンドポイントは内蔵のCSRFトークンで保護）
- 入力値はすべて zod でサーバーサイド検証
- サインアップ・パスワード再設定エンドポイントにレート制限（プロセス内メモリベース。**サーバーレス環境では複数インスタンス間で共有されないため、本番運用時は Upstash Redis 等の外部ストアへの置き換えを推奨**）
- セキュリティヘッダー（CSP, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy）を `next.config.ts` で設定
- パスワード再設定は「登録されたメールアドレスかどうかを問わず同じ応答を返す」ことでユーザー列挙を防止

## メール送信について（要接続）

パスワード再設定メールは `src/lib/mailer.ts` の `sendMail()` を通じて送信される設計になっていますが、
**現時点ではメールプロバイダが未接続のため、実際には送信されずサーバーログに出力されるだけです。**
本番でパスワード再設定・メール認証を機能させるには、Resend / SendGrid / AWS SES などのプロバイダとの接続が必要です。接続する際はご相談ください。

## デプロイ・ホスティングについて（要承認）

`docs/prd.md` の技術スタック提案は Vercel（フロントエンド）+ Supabase/Railway/Render（PostgreSQL）+ GitHub Actions（CI/CD）です。
現時点ではこれらの外部サービスは未接続・未作成のため、以下は実施していません。

- Vercel / Supabase 等のアカウント作成・プロジェクト作成
- 本番用PostgreSQLへの接続情報の設定・デプロイ
- GitHub Actionsワークフローの追加

デプロイを進める場合は、以下のいずれかの方法をご希望に応じて対応します。

1. Vercel + Supabase（PRD推奨構成、無料枠あり）
2. Render / Fly.io など、常時起動サーバーが必要な構成（レート制限をプロセス内で保持できる利点あり）
3. その他ご希望のホスティング

本番移行時は `prisma/schema.prisma` の `datasource` を `provider = "postgresql"` に変更し、`DATABASE_URL` を発行されたPostgreSQL接続文字列に差し替えてください（Prismaのテーブル定義はそのまま利用可能です）。

## 今後の拡張（Phase 2以降、docs/prd.md参照）

- コメント/Q&A機能、学習進捗のSNS共有
- 学習リマインドメール・通知
- 管理者画面（コース/レッスンのCRUD、AppSettingのGUI編集）
- 質問生成AIアシスタント
- Databricks Notebook連携・実行コードの保存
- Snowflakeなど他サービスの学習コース追加
- 単体・統合テストの拡充（Vitest等）
