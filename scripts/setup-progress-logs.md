# Progress Logs テーブルセットアップ

## 概要

学習進捗を記録するための `progress_logs` テーブルを作成します。

## セットアップ手順

### 1. Supabase SQL Editor でテーブル作成

Supabase ダッシュボードの SQL Editor で以下の SQL を実行してください：

```sql
-- progress_logsテーブルの作成
CREATE TABLE IF NOT EXISTS progress_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    block_id UUID NOT NULL REFERENCES blocks(id) ON DELETE CASCADE,
    activity_type TEXT NOT NULL,
    duration_minutes INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- インデックスの作成
CREATE INDEX IF NOT EXISTS idx_progress_logs_user_id ON progress_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_progress_logs_block_id ON progress_logs(block_id);
CREATE INDEX IF NOT EXISTS idx_progress_logs_created_at ON progress_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_progress_logs_user_created ON progress_logs(user_id, created_at);

-- Row Level Security (RLS) の有効化
ALTER TABLE progress_logs ENABLE ROW LEVEL SECURITY;

-- RLSポリシーの作成
CREATE POLICY "Users can view own progress logs" ON progress_logs
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress logs" ON progress_logs
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own progress logs" ON progress_logs
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own progress logs" ON progress_logs
    FOR DELETE USING (auth.uid() = user_id);
```

### 2. テーブル作成の確認

以下の SQL でテーブルが正しく作成されたことを確認してください：

```sql
-- テーブル構造の確認
SELECT
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'progress_logs'
ORDER BY ordinal_position;
```

### 3. 機能テスト

- ブロックを編集・保存して進捗ログが記録されることを確認
- 学習データページで統計が表示されることを確認

## トラブルシューティング

### エラー: `relation "progress_logs" does not exist`

このエラーが表示される場合は、上記の SQL を実行してテーブルを作成してください。

### RLS エラー

RLS (Row Level Security) が正しく設定されていない場合は、ポリシーの作成 SQL を再実行してください。

## 活動タイプ

以下の活動タイプが自動記録されます：

- `block_create` - ブロック作成
- `block_edit` - ブロック編集（保存時に 5 分として記録）
- `block_read` - ブロック閲覧（ページ滞在時間を記録）
- `block_delete` - ブロック削除
- `chat_interaction` - AI 対話
- `image_upload` - 画像アップロード
