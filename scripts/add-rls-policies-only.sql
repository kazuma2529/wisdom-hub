-- RLSポリシーとインデックスのみ追加
-- user_idカラムが既に存在する場合用

-- インデックスを追加（存在しない場合のみ）
CREATE INDEX IF NOT EXISTS idx_boxes_user_id ON boxes(user_id);
CREATE INDEX IF NOT EXISTS idx_blocks_user_id ON blocks(user_id);

-- RLS（Row Level Security）を有効化
ALTER TABLE boxes ENABLE ROW LEVEL SECURITY;
ALTER TABLE blocks ENABLE ROW LEVEL SECURITY;

-- 既存のポリシーを削除（存在する場合）
DROP POLICY IF EXISTS "Users can view their own boxes" ON boxes;
DROP POLICY IF EXISTS "Users can insert their own boxes" ON boxes;
DROP POLICY IF EXISTS "Users can update their own boxes" ON boxes;
DROP POLICY IF EXISTS "Users can delete their own boxes" ON boxes;

DROP POLICY IF EXISTS "Users can view their own blocks" ON blocks;
DROP POLICY IF EXISTS "Users can insert their own blocks" ON blocks;
DROP POLICY IF EXISTS "Users can update their own blocks" ON blocks;
DROP POLICY IF EXISTS "Users can delete their own blocks" ON blocks;

-- boxesテーブルのRLSポリシー
CREATE POLICY "Users can view their own boxes" ON boxes
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own boxes" ON boxes
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own boxes" ON boxes
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own boxes" ON boxes
    FOR DELETE USING (auth.uid() = user_id);

-- blocksテーブルのRLSポリシー
CREATE POLICY "Users can view their own blocks" ON blocks
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own blocks" ON blocks
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own blocks" ON blocks
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own blocks" ON blocks
    FOR DELETE USING (auth.uid() = user_id); 