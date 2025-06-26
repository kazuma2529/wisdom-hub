import { useState, useCallback } from 'react';

export interface UseAsyncDataOptions<T> {
  initialData?: T;
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
}

export interface UseAsyncDataReturn<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  execute: (fn: () => Promise<T>) => Promise<void>;
  setData: (data: T | null | ((prev: T | null) => T | null)) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

/**
 * 非同期データ取得とローディング・エラー状態を管理する共通Hook
 */
export function useAsyncData<T>(options: UseAsyncDataOptions<T> = {}): UseAsyncDataReturn<T> {
  const { initialData = null, onSuccess, onError } = options;
  
  const [data, setData] = useState<T | null>(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(async (fn: () => Promise<T>) => {
    try {
      setLoading(true);
      setError(null);
      const result = await fn();
      setData(result);
      onSuccess?.(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'エラーが発生しました';
      setError(errorMessage);
      onError?.(err as Error);
      console.error('useAsyncData エラー:', err);
    } finally {
      setLoading(false);
    }
  }, [onSuccess, onError]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    data,
    loading,
    error,
    execute,
    setData,
    setError,
    clearError
  };
} 