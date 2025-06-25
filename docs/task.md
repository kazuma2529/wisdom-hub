# 🗂️ task.md — 実装タスクブレイクダウン (Wisdom‑Hub)

> **読み方**: 各タスクは _手順_・_完了条件_・_参考リンク/コマンド_ をセットで記載。Cursor を開いた状態で上から順にこなせば **UI → ロジック → 仕上げ** の流れで v1.0 が完成する。🟢 マークは UI、🟡 はロジック/API、🔴 はテスト/仕上げを示す。

---

## 📅 フェーズ一覧

| フェーズ                 | 目安   | ゴール                           | 主タスク ID |
| ------------------------ | ------ | -------------------------------- | ----------- |
| **0. 環境構築**          | Day 0  | 開発が開始できる状態             | T‑00x       |
| **1. UI Skeleton**       | Week 1 | 主要画面を“静的”に表示           | T‑1xx       |
| **2. CRUD & 認証**       | Week 2 | ワークスペース〜ブロック DB 連携 | T‑2xx       |
| **3. AI & 進捗ログ**     | Week 3 | Dify 組込み + Progress 集計      | T‑3xx       |
| **4. PWA & 通知**        | Week 4 | オフライン + リマインドメール    | T‑4xx       |
| **5. テスト & リリース** | Week 5 | β リリース完了                   | T‑5xx       |

---

## 🔧 フェーズ 0 — 環境構築

| #            | タスク                       | 手順 (概要)                                                                                                                                                                                              | 完了条件                                  |
| ------------ | ---------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------- |
| **T‑001 🟢** | **Node & pnpm** インストール | `brew install node` → `npm i -g pnpm@latest`                                                                                                                                                             | `node -v` `pnpm -v` が表示される          |
| **T‑002 🟢** | Next.js プロジェクト作成     | `pnpm create next-app@latest wisdom-hub --ts --tailwind --eslint`                                                                                                                                        | 開発サーバー `pnpm dev` で空白ページ表示  |
| **T‑003 🟢** | shadcn/ui & Tailwind 設定    | `pnpm dlx shadcn-ui@latest init` → `npx shadcn-ui add button`                                                                                                                                            | ボタンコンポーネントが描画される          |
| **T‑004 🟡** | **Supabase CLI + MCP 接続**  | ① [https://supabase.com/docs/guides/getting-started/mcp](https://supabase.com/docs/guides/getting-started/mcp) を開く<br>② PAT 発行<br>③ Cursor で `Supabase: Connect MCP` 実行 → PAT & Project-Ref 入力 | `Supabase` サイドバーに DB スキーマが表示 |
| **T‑005 🟡** | `.env.local` 設定            | Cursor で `⌘⇧P → New Env` → 下記キーを貼付:<br>`NEXT_PUBLIC_SUPABASE_URL`<br>`NEXT_PUBLIC_SUPABASE_ANON_KEY`                                                                                             | env エラーなく dev 起動                   |

> **Tips:** MCP PAT は _ユーザー単位_。新規プロジェクトを追加したら _Project‑Ref_ を変える必要あり。

---

## 🖼️ フェーズ 1 — UI Skeleton

| #            | タスク                       | 手順                                                                      | 完了条件                                   |
| ------------ | ---------------------------- | ------------------------------------------------------------------------- | ------------------------------------------ |
| **T‑101 🟢** | レイアウト & 下部ナビ (G01)  | `layout.tsx` に shadcn `NavigationMenu` を実装。アイコンは lucide‑react。 | ホーム/学習データ/マイページ 3 タブ表示    |
| **T‑102 🟢** | ホーム（ワークスペース一覧） | `app/dashboard/page.tsx` 作成。ダミーデータでカード UI。                  | カード押下でダイアログ表示 (仮)            |
| **T‑103 🟢** | ボックスページ UI (G02)      | 画像 ①＆③ を参考に `workspace/[id]/page.tsx` を静的実装。                 | リスト+カードの 2 セクションが整列         |
| **T‑104 🟢** | ブロック一覧 UI (G03)        | 添付 ② レイアウトで `workspace/[id]/box/[id]/page.tsx`                    | アイコン付きリスト化                       |
| **T‑105 🟢** | ブロック編集 UI (G04)        | `editor.tsx` に tiptap ＋ cover uploader プレースホルダ                   | 画像アップロード入力と Markdown エリア表示 |

---

## 🗄️ フェーズ 2 — CRUD & 認証

| #            | タスク                    | 手順                                                                     | 完了条件                              |
| ------------ | ------------------------- | ------------------------------------------------------------------------ | ------------------------------------- |
| **T‑201 🟡** | Supabase Schema Migration | `supabase db reset` → `schema.sql` (requirements の ER 図) を apply      | DB に各テーブル生成                   |
| **T‑202 🟡** | Row Level Security ON     | MCP → _Authentication → Policies_ で `auth.uid() = user_id` ポリシー追加 | 未ログイン時 SELECT 拒否確認          |
| **T‑203 🟡** | Auth UI 組込              | `@supabase/auth-helpers-nextjs` & shadcn `Dialog` で LoginModal。        | Email/PW 登録後、自動ログイン         |
| **T‑204 🟡** | ワークスペース CRUD Hooks | `useWorkspaces.ts` 作成 → `select/insert/update/delete`                  | カードが DB と同期                    |
| **T‑205 🟡** | ボックス & ブロック CRUD  | `useBoxes.tsx` `useBlocks.tsx` 追加                                      | UI 操作で DB 反映                     |
| **T‑206 🟡** | Cover Image Upload        | `supabase.storage.from('cover_images').upload()` ラッパー                | 画像 URL が `blocks.cover_url` に保存 |

---

## 🤖 フェーズ 3 — AI & 進捗ログ

| #            | タスク               | 手順                                                                              | 完了条件                      |
| ------------ | -------------------- | --------------------------------------------------------------------------------- | ----------------------------- |
| **T‑301 🟡** | Dify API ラッパー    | `lib/dify.ts` で `POST /v1/chat/completions`                                      | CLI でレスポンス確認          |
| **T‑302 🟡** | ChatDrawer 実装      | `components/chatbot/Drawer.tsx`：右下 FAB + Slide-in UI                           | 送受信が表示される            |
| **T‑303 🟡** | RAG コンテキスト渡し | ブロック本文を要約し `context:` に付与                                            | Dify が自分の内容を回答に反映 |
| **T‑304 🟡** | Progress Log Trigger | `useBlocks.tsx` の `createBlock` / `readBlock` 内で RPC or Edge Function 呼び出し | `progress_logs` に行追加      |
| **T‑305 🟡** | 学習データ画面 (G05) | 線形チャート: `blocks_created`/`blocks_read`                                      | 今月の統計が表示              |

---

## 🌐 フェーズ 4 — PWA & 通知

| #            | タスク                   | 手順                                                      | 完了条件                          |
| ------------ | ------------------------ | --------------------------------------------------------- | --------------------------------- |
| **T‑401 🟡** | Next‑PWA 導入            | `pnpm i next-pwa` → `next.config.js` 設定                 | `Add to Home` プロンプト発火      |
| **T‑402 🟡** | Workbox キャッシュ       | `runtimeCaching` で `/blocks/*` を `StaleWhileRevalidate` | 機内モードでも既読ブロック読める  |
| **T‑403 🟡** | Edge Function: cron-mail | `supabase functions new cron-mail` → Resend API で送信    | 月曜 09:05 JST にテストメール到達 |
| **T‑404 🟡** | 通知 ON/OFF UI           | マイページで `notify_enabled` を toggle                   | OFF でメールが来ない              |

---

## ✅ フェーズ 5 — テスト & リリース

| #            | タスク                   | 手順                               | 完了条件                                                            |
| ------------ | ------------------------ | ---------------------------------- | ------------------------------------------------------------------- |
| **T‑501 🔴** | ユニットテスト           | `vitest` + React Testing Library   | CRUD Hooks 80% Coverage                                             |
| **T‑502 🔴** | Playwright E2E           | Home → ブロック作成シナリオ        | CI でパス                                                           |
| **T‑503 🔴** | Lighthouse Audit         | `pnpm dlx @lhci/cli autorun`       | PWA 100 / Perf 90↑                                                  |
| **T‑504 🔴** | Vercel Production Deploy | `main` ブランチにタグ `v1.0.0`     | [https://wisdom-hub.vercel.app](https://wisdom-hub.vercel.app) 公開 |
| **T‑505 🔴** | README & Loom デモ       | 機能概要 / セットアップ / デモ動画 | GitHub リポジトリ整備完了                                           |

---

## 📌 補足

- **Cursor MCP Tips**: スキーマ変更時は _右クリック → Apply Migration_ で DB 反映。失敗時はログを確認して `supabase migrations repair`。
- **非エンジニア向け**: CLI コマンドに不安があるときは必ず _Cursor AI パネル_ に“このコマンドで合ってる？”と質問して安全確認。
- **ワークフロー**: `feat/XXXX` ブランチ → PR → GitHub Actions で Lint & Test → Merge → Vercel Preview → 検証して本番へ。

> **Enjoy Building!** 迷ったらこの `task.md` をチェックし、上からタスク ID を潰していけば必ず完成します 🎉
