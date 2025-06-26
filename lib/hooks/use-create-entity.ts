import { useState, useCallback } from 'react';

export interface UseCreateEntityOptions<TInput, TOutput> {
  onSuccess?: (entity: TOutput) => void;
  onError?: (error: Error) => void;
}

export interface UseCreateEntityReturn<TInput, TOutput> {
  isCreating: boolean;
  error: string | null;
  createEntity: (input: TInput, createFn: (input: TInput) => Promise<TOutput>) => Promise<TOutput | null>;
  clearError: () => void;
}

/**
 * エンティティ作成処理を管理する共通Hook
 */
export function useCreateEntity<TInput, TOutput>(
  options: UseCreateEntityOptions<TInput, TOutput> = {}
): UseCreateEntityReturn<TInput, TOutput> {
  const { onSuccess, onError } = options;
  
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createEntity = useCallback(async (
    input: TInput,
    createFn: (input: TInput) => Promise<TOutput>
  ): Promise<TOutput | null> => {
    try {
      setIsCreating(true);
      setError(null);
      const result = await createFn(input);
      onSuccess?.(result);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '作成に失敗しました';
      setError(errorMessage);
      onError?.(err as Error);
      console.error('useCreateEntity エラー:', err);
      return null;
    } finally {
      setIsCreating(false);
    }
  }, [onSuccess, onError]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    isCreating,
    error,
    createEntity,
    clearError
  };
} 