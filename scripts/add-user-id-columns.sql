-- boxesとblocksテーブルにuser_id列を追加
-- T-402 エラー修正対応

-- boxesテーブルにuser_id列を追加
ALTER TABLE boxes 
ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- blocksテーブルにuser_id列を追加
ALTER TABLE blocks 
ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- 列にコメントを追加
COMMENT ON COLUMN boxes.user_id IS 'ボックスの所有者ID（認証ユーザー）';
COMMENT ON COLUMN blocks.user_id IS 'ブロックの所有者ID（認証ユーザー）';

-- インデックスを追加
CREATE INDEX idx_boxes_user_id ON boxes(user_id);
CREATE INDEX idx_blocks_user_id ON blocks(user_id);

-- RLS（Row Level Security）ポリシーを追加
-- boxesテーブルのポリシー
ALTER TABLE boxes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own boxes" ON boxes
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own boxes" ON boxes
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own boxes" ON boxes
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own boxes" ON boxes
    FOR DELETE USING (auth.uid() = user_id);

-- blocksテーブルのポリシー
ALTER TABLE blocks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own blocks" ON blocks
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own blocks" ON blocks
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own blocks" ON blocks
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own blocks" ON blocks
    FOR DELETE USING (auth.uid() = user_id); 