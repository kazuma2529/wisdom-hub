import { createClient } from "./client";

// サポートする画像形式
const SUPPORTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg', 
  'image/png',
  'image/webp',
  'image/gif'
];

// 最大ファイルサイズ（5MB）
const MAX_FILE_SIZE = 5 * 1024 * 1024;

export interface UploadResult {
  url: string;
  path: string;
}

export interface UploadError {
  message: string;
  code?: string;
}

// ファイルバリデーション
export function validateImageFile(file: File): UploadError | null {
  if (!SUPPORTED_IMAGE_TYPES.includes(file.type)) {
    return {
      message: 'サポートされていないファイル形式です。JPEG、PNG、WebP、GIFファイルをアップロードしてください。',
      code: 'UNSUPPORTED_TYPE'
    };
  }

  if (file.size > MAX_FILE_SIZE) {
    return {
      message: 'ファイルサイズが大きすぎます。5MB以下のファイルをアップロードしてください。',
      code: 'FILE_TOO_LARGE'
    };
  }

  return null;
}

// ユニークなファイル名を生成
function generateUniqueFileName(originalName: string): string {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 15);
  const extension = originalName.split('.').pop();
  return `${timestamp}_${randomString}.${extension}`;
}

// 汎用ファイルアップロード関数
export async function uploadFile(
  file: File,
  fileName: string,
  bucket: string = 'cover_images'
): Promise<string> {
  // ファイルバリデーション（画像の場合のみ）
  if (file.type.startsWith('image/')) {
    const validationError = validateImageFile(file);
    if (validationError) {
      throw new Error(validationError.message);
    }
  }

  const supabase = createClient();
  
  try {
    // Storageにアップロード
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: true // 同じ名前のファイルがある場合は上書き
      });

    if (error) {
      console.error('ファイルアップロードエラー:', error);
      throw new Error(`ファイルのアップロードに失敗しました: ${error.message}`);
    }

    // パブリックURLを取得
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path);

    return publicUrl;
  } catch (error) {
    console.error('ファイルアップロード処理エラー:', error);
    throw error;
  }
}

// カバー画像をアップロード
export async function uploadCoverImage(
  file: File,
  userId: string
): Promise<UploadResult> {
  // ファイルバリデーション
  const validationError = validateImageFile(file);
  if (validationError) {
    throw new Error(validationError.message);
  }

  const supabase = createClient();
  
  // ユニークなファイル名を生成
  const fileName = generateUniqueFileName(file.name);
  const filePath = `${userId}/${fileName}`;

  // Storageにアップロード
  const { data, error } = await supabase.storage
    .from('cover_images')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false
    });

  if (error) {
    console.error('画像アップロードエラー:', error);
    throw new Error(`画像のアップロードに失敗しました: ${error.message}`);
  }

  // パブリックURLを取得
  const { data: { publicUrl } } = supabase.storage
    .from('cover_images')
    .getPublicUrl(data.path);

  return {
    url: publicUrl,
    path: data.path
  };
}

// カバー画像を削除
export async function deleteCoverImage(filePath: string): Promise<void> {
  const supabase = createClient();

  const { error } = await supabase.storage
    .from('cover_images')
    .remove([filePath]);

  if (error) {
    console.error('画像削除エラー:', error);
    throw new Error(`画像の削除に失敗しました: ${error.message}`);
  }
}

// 画像URLからファイルパスを抽出
export function extractFilePathFromUrl(url: string): string | null {
  try {
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split('/');
    const bucketIndex = pathParts.findIndex(part => part === 'cover_images');
    
    if (bucketIndex === -1 || bucketIndex >= pathParts.length - 1) {
      return null;
    }
    
    return pathParts.slice(bucketIndex + 1).join('/');
  } catch {
    return null;
  }
} 