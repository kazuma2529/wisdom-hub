# Supabase Storage セットアップ手順

Cover Image Upload 機能を使用するために、Supabase Storage にバケットを作成し、データベースのスキーマを更新する必要があります。

## 🚨 重要：データベーススキーマの更新

**最初に、データベースに cover_image_url 列を追加する必要があります。**

### 1. データベーススキーマ更新

1. [Supabase Dashboard](https://supabase.com/dashboard) → **SQL Editor** に移動
2. 以下の SQL を実行：

```sql
-- blocksテーブルにcover_image_url列を追加
ALTER TABLE blocks
ADD COLUMN cover_image_url TEXT;

-- 列にコメントを追加
COMMENT ON COLUMN blocks.cover_image_url IS 'ブロックのカバー画像URL（Supabase Storage）';
```

## 2. Supabase ダッシュボードでバケット作成

1. [Supabase Dashboard](https://supabase.com/dashboard) にアクセス
2. プロジェクトを選択
3. 左メニューから「Storage」を選択
4. 「New bucket」をクリック
5. 以下の設定でバケットを作成：

### cover_images バケット

- **Name**: `cover_images`
- **Public bucket**: ✅ チェックを入れる
- **File size limit**: `5242880` (5MB)
- **Allowed MIME types**: `image/*`

## 3. RLS (Row Level Security) ポリシー設定

バケット作成後、以下のポリシーを設定してください：

### アップロード許可ポリシー

```sql
-- ログインユーザーが自分のフォルダにアップロード可能
CREATE POLICY "Users can upload to own folder" ON storage.objects
FOR INSERT WITH CHECK (
  auth.uid()::text = (storage.foldername(name))[1]
  AND bucket_id = 'cover_images'
);
```

### 読み取り許可ポリシー

```sql
-- 全員が画像を閲覧可能（パブリックバケットのため）
CREATE POLICY "Public can view images" ON storage.objects
FOR SELECT USING (bucket_id = 'cover_images');
```

### 削除許可ポリシー

```sql
-- ログインユーザーが自分のファイルを削除可能
CREATE POLICY "Users can delete own files" ON storage.objects
FOR DELETE USING (
  auth.uid()::text = (storage.foldername(name))[1]
  AND bucket_id = 'cover_images'
);
```

## 4. SQL 実行方法

1. Supabase Dashboard の「SQL Editor」に移動
2. 上記の SQL 文を一つずつ実行
3. 各クエリが成功することを確認

## 5. 動作確認

1. アプリケーションを起動
2. ブロック編集画面に移動
3. カバー画像アップロード機能が正常に動作することを確認

## トラブルシューティング

### アップロードエラーが発生する場合

1. バケット名が正しいか確認
2. RLS ポリシーが正しく設定されているか確認
3. ファイルサイズが 5MB 以下か確認
4. サポートされている画像形式（JPEG, PNG, WebP, GIF）か確認

### 画像が表示されない場合

1. バケットがパブリックに設定されているか確認
2. 画像 URL が正しく生成されているか確認
3. ブラウザの開発者ツールでネットワークエラーを確認

### 保存エラー「Could not find the 'cover_image_url' column」が発生する場合

1. **手順 1 のデータベーススキーマ更新**が完了しているか確認
2. SQL エディタで以下のクエリを実行して列が存在することを確認：
   ```sql
   SELECT column_name, data_type
   FROM information_schema.columns
   WHERE table_name = 'blocks' AND column_name = 'cover_image_url';
   ```
