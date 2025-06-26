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