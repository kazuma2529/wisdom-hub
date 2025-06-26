-- blocksテーブルにcover_image_url列を追加
-- T-206 Cover Image Upload 対応

ALTER TABLE blocks 
ADD COLUMN cover_image_url TEXT;

-- 列にコメントを追加
COMMENT ON COLUMN blocks.cover_image_url IS 'ブロックのカバー画像URL（Supabase Storage）';

-- インデックスを追加（必要に応じて）
-- CREATE INDEX idx_blocks_cover_image_url ON blocks(cover_image_url) WHERE cover_image_url IS NOT NULL; 