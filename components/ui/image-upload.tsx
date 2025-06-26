import React, { useRef } from 'react';
import { Upload, X, Loader2, Image as ImageIcon } from 'lucide-react';
import { Button } from './button';
import { Card, CardContent } from './card';
import { useImageUpload } from '@/lib/hooks/use-image-upload';
import { type UploadResult } from '@/lib/supabase/storage';

interface ImageUploadProps {
  userId: string;
  currentImageUrl?: string;
  onImageChange: (imageUrl: string | null) => void;
  className?: string;
  disabled?: boolean;
}

export function ImageUpload({ 
  userId, 
  currentImageUrl, 
  onImageChange, 
  className = "",
  disabled = false 
}: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { 
    isUploading, 
    uploadError, 
    handleFileSelect, 
    handleDrop, 
    handleDragOver,
    deleteImage,
    clearError 
  } = useImageUpload({
    userId,
    onSuccess: (result: UploadResult) => {
      onImageChange(result.url);
    },
    onError: (error: string) => {
      console.error('画像アップロードエラー:', error);
    }
  });

  const handleUploadClick = () => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleRemoveImage = async () => {
    if (currentImageUrl && !disabled) {
      const success = await deleteImage(currentImageUrl);
      if (success) {
        onImageChange(null);
      }
    }
  };

  return (
    <div className={className}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
        disabled={disabled || isUploading}
      />
      
      <Card className="relative">
        <CardContent className="p-0">
          {currentImageUrl ? (
            // 画像が設定されている場合
            <div className="relative group">
              <img
                src={currentImageUrl}
                alt="カバー画像"
                className="w-full h-48 object-cover rounded-lg"
              />
              {!disabled && (
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={handleUploadClick}
                    disabled={isUploading}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    変更
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleRemoveImage}
                    disabled={isUploading}
                  >
                    <X className="h-4 w-4 mr-2" />
                    削除
                  </Button>
                </div>
              )}
            </div>
          ) : (
            // 画像が未設定の場合
            <div
              className="h-48 border-2 border-dashed border-muted-foreground/25 rounded-lg flex flex-col items-center justify-center gap-4 cursor-pointer hover:border-muted-foreground/50 transition-colors"
              onClick={handleUploadClick}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
            >
              {isUploading ? (
                <>
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">アップロード中...</p>
                </>
              ) : (
                <>
                  <ImageIcon className="h-12 w-12 text-muted-foreground" />
                  <div className="text-center">
                    <p className="text-sm font-medium">カバー画像をアップロード</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      クリックまたはドラッグ&ドロップ
                    </p>
                    <p className="text-xs text-muted-foreground">
                      JPEG, PNG, WebP, GIF (最大5MB)
                    </p>
                  </div>
                </>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {uploadError && (
        <div className="mt-2 p-2 bg-destructive/10 border border-destructive/20 rounded-md">
          <div className="flex items-center justify-between">
            <p className="text-sm text-destructive">{uploadError}</p>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearError}
              className="h-auto p-1"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
} 