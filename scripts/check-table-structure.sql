-- テーブル構造確認用SQL
-- 現在のboxesとblocksテーブルの構造を確認

-- boxesテーブルの構造確認
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'boxes' 
ORDER BY ordinal_position;

-- blocksテーブルの構造確認
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'blocks' 
ORDER BY ordinal_position;

-- RLSポリシーの確認
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename IN ('boxes', 'blocks')
ORDER BY tablename, policyname; 