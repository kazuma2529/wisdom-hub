"use client";

import { useState, useRef } from 'react';
import { ImageIcon, Upload, X, Loader2 } from 'lucide-react';
import { Button } from './button';
import { cn } from '@/lib/utils';
import imageCompression from 'browser-image-compression';
import { uploadCoverImage } from '@/lib/supabase/storage';

interface CoverImageUploadProps {
  userId: string;
  currentImageUrl?: string;
  onImageChange: (url: string | null) => void;
  disabled?: boolean;
  className?: string;
}

export function CoverImageUpload({
  userId,
  currentImageUrl,
  onImageChange,
  disabled = false,
  className
}: CoverImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentImageUrl || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 推奨サイズ
  const RECOMMENDED_WIDTH = 1280;
  const RECOMMENDED_HEIGHT = 670;

  const resizeImage = async (file: File): Promise<File> => {
    const options = {
      maxWidthOrHeight: Math.max(RECOMMENDED_WIDTH, RECOMMENDED_HEIGHT),
      useWebWorker: true,
      fileType: 'image/jpeg' as const,
      quality: 0.8,
    };

    try {
      // まず圧縮
      const compressedFile = await imageCompression(file, options);
      
      // Canvas で正確なサイズにリサイズ
      return new Promise((resolve) => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d')!;
        const img = new Image();
        
        img.onload = () => {
          // アスペクト比を計算
          const aspectRatio = img.width / img.height;
          const targetAspectRatio = RECOMMENDED_WIDTH / RECOMMENDED_HEIGHT;
          
          let sourceX = 0, sourceY = 0, sourceWidth = img.width, sourceHeight = img.height;
          
          // 中央部分をクロップ
          if (aspectRatio > targetAspectRatio) {
            // 横長の画像：幅を調整
            sourceWidth = img.height * targetAspectRatio;
            sourceX = (img.width - sourceWidth) / 2;
          } else if (aspectRatio < targetAspectRatio) {
            // 縦長の画像：高さを調整
            sourceHeight = img.width / targetAspectRatio;
            sourceY = (img.height - sourceHeight) / 2;
          }
          
          // Canvas サイズを設定
          canvas.width = RECOMMENDED_WIDTH;
          canvas.height = RECOMMENDED_HEIGHT;
          
          // 画像を描画
          ctx.drawImage(
            img,
            sourceX, sourceY, sourceWidth, sourceHeight,
            0, 0, RECOMMENDED_WIDTH, RECOMMENDED_HEIGHT
          );
          
          // Blob として出力
          canvas.toBlob((blob) => {
            if (blob) {
              const resizedFile = new File([blob], compressedFile.name, {
                type: 'image/jpeg',
                lastModified: Date.now(),
              });
              resolve(resizedFile);
            }
          }, 'image/jpeg', 0.8);
        };
        
        img.src = URL.createObjectURL(compressedFile);
      });
    } catch (error) {
      console.error('画像リサイズエラー:', error);
      return file; // リサイズに失敗した場合は元のファイルを返す
    }
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // 画像ファイルかチェック
    if (!file.type.startsWith('image/')) {
      alert('画像ファイルを選択してください。');
      return;
    }

    try {
      setUploading(true);

      // プレビュー表示
      const previewUrl = URL.createObjectURL(file);
      setPreview(previewUrl);

      // 画像をリサイズ
      const resizedFile = await resizeImage(file);

      // アップロード（既存のuploadCoverImage関数を使用）
      const result = await uploadCoverImage(resizedFile, userId);

      // 古いプレビューURLをクリーンアップ
      if (previewUrl !== currentImageUrl) {
        URL.revokeObjectURL(previewUrl);
      }

      setPreview(result.url);
      onImageChange(result.url);
    } catch (error) {
      console.error('アップロードエラー:', error);
      alert('画像のアップロードに失敗しました。');
      setPreview(currentImageUrl || null);
    } finally {
      setUploading(false);
      // ファイル入力をリセット
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemove = () => {
    setPreview(null);
    onImageChange(null);
  };

  const handleClick = () => {
    if (!disabled && !uploading) {
      fileInputRef.current?.click();
    }
  };

  return (
    <div className={cn("space-y-2", className)}>
      {/* アップロードエリア - スリムな横長デザイン */}
      <div
        onClick={handleClick}
        className={cn(
          "relative overflow-hidden rounded-lg border-2 border-dashed transition-all duration-200",
          preview
            ? "border-gray-200 hover:border-gray-300"
            : "border-gray-300 hover:border-gray-400 cursor-pointer",
          disabled && "opacity-50 cursor-not-allowed",
          uploading && "cursor-wait"
        )}
        style={{
          height: '120px', // 固定高さでスリムに
          minHeight: '120px'
        }}
      >
        {preview ? (
          <>
            <img
              src={preview}
              alt="カバー画像プレビュー"
              className="w-full h-full object-cover"
            />
            {!disabled && !uploading && (
              <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center">
                <div className="opacity-0 hover:opacity-100 transition-opacity duration-200">
                  <Button
                    variant="secondary"
                    size="sm"
                    className="mr-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleClick();
                    }}
                  >
                    <Upload className="h-4 w-4 mr-1" />
                    変更
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemove();
                    }}
                  >
                    <X className="h-4 w-4 mr-1" />
                    削除
                  </Button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full p-4 text-center">
            {uploading ? (
              <>
                <Loader2 className="h-8 w-8 text-gray-400 animate-spin mb-2" />
                <p className="text-sm text-gray-600">アップロード中...</p>
              </>
            ) : (
              <>
                <ImageIcon className="h-8 w-8 text-gray-400 mb-2" />
                <p className="text-sm text-gray-600 font-medium">カバー画像をアップロード</p>
                <p className="text-xs text-gray-400 mt-1">
                  推奨: {RECOMMENDED_WIDTH} × {RECOMMENDED_HEIGHT}px | 自動調整
                </p>
              </>
            )}
          </div>
        )}
      </div>

      {/* 隠しファイル入力 */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
        disabled={disabled || uploading}
      />
    </div>
  );
} 