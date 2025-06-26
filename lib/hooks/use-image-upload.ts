import { useState } from 'react';
import { uploadCoverImage, deleteCoverImage, extractFilePathFromUrl, type UploadResult } from '@/lib/supabase/storage';

interface UseImageUploadProps {
  userId: string;
  onSuccess?: (result: UploadResult) => void;
  onError?: (error: string) => void;
}

export function useImageUpload({ userId, onSuccess, onError }: UseImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // 画像をアップロード
  const uploadImage = async (file: File): Promise<UploadResult | null> => {
    if (!userId) {
      const error = 'ユーザーがログインしていません';
      setUploadError(error);
      onError?.(error);
      return null;
    }

    try {
      setIsUploading(true);
      setUploadError(null);

      const result = await uploadCoverImage(file, userId);
      
      onSuccess?.(result);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '画像のアップロードに失敗しました';
      setUploadError(errorMessage);
      onError?.(errorMessage);
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  // 画像を削除
  const deleteImage = async (imageUrl: string): Promise<boolean> => {
    try {
      const filePath = extractFilePathFromUrl(imageUrl);
      if (!filePath) {
        throw new Error('無効な画像URLです');
      }

      await deleteCoverImage(filePath);
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '画像の削除に失敗しました';
      setUploadError(errorMessage);
      onError?.(errorMessage);
      return false;
    }
  };

  // ファイル選択ハンドラー
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      uploadImage(file);
    }
  };

  // ドラッグ&ドロップ対応
  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      uploadImage(file);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  return {
    isUploading,
    uploadError,
    uploadImage,
    deleteImage,
    handleFileSelect,
    handleDrop,
    handleDragOver,
    clearError: () => setUploadError(null)
  };
} 