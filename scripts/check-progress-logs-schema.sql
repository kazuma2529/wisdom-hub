-- progress_logsテーブルのスキーマ確認
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'progress_logs'
ORDER BY ordinal_position;

-- テーブルが存在するかチェック
SELECT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'progress_logs'
) AS table_exists;

-- サンプルデータの確認（もしあれば）
SELECT * FROM progress_logs LIMIT 5; 