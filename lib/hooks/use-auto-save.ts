import { useEffect, useRef, useCallback, useState } from 'react';

interface UseAutoSaveOptions<T> {
  data: T;
  onSave: (data: T) => Promise<void>;
  delay?: number; // 自動保存の遅延時間（ミリ秒）
  enabled?: boolean; // 自動保存の有効/無効
}

interface UseAutoSaveReturn {
  isSaving: boolean;
  lastSaved: Date | null;
  saveNow: () => Promise<void>;
}

export function useAutoSave<T>({
  data,
  onSave,
  delay = 3000, // デフォルト3秒
  enabled = true
}: UseAutoSaveOptions<T>): UseAutoSaveReturn {
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const previousDataRef = useRef<T>(data);
  const isInitialMount = useRef(true);

  const saveNow = useCallback(async () => {
    if (!enabled || isSaving) return;

    try {
      setIsSaving(true);
      await onSave(data);
      setLastSaved(new Date());
      previousDataRef.current = data;
    } catch (error) {
      console.error('自動保存エラー:', error);
      // エラーハンドリングは呼び出し側に委ねる
      throw error;
    } finally {
      setIsSaving(false);
    }
  }, [data, onSave, enabled, isSaving]);

  useEffect(() => {
    // 初回マウント時は自動保存しない
    if (isInitialMount.current) {
      isInitialMount.current = false;
      previousDataRef.current = data;
      return;
    }

    // データが変更されていない場合は何もしない
    if (JSON.stringify(data) === JSON.stringify(previousDataRef.current)) {
      return;
    }

    // 既存のタイマーをクリア
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // 自動保存が有効な場合のみタイマーを設定
    if (enabled) {
      timeoutRef.current = setTimeout(() => {
        saveNow().catch(() => {
          // エラーは既にログ出力されているので、ここでは何もしない
        });
      }, delay);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [data, enabled, delay, saveNow]);

  // コンポーネントアンマウント時のクリーンアップ
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return {
    isSaving,
    lastSaved,
    saveNow
  };
} 