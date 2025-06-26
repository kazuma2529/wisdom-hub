"use client";

import { useCallback, useRef } from 'react';
import { useAuth } from './use-auth';
import { progressQueries } from '@/lib/supabase/queries';
import type { ProgressLog } from '@/lib/types';

interface UseProgressTrackerProps {
  blockId?: string;
}

interface UseProgressTrackerReturn {
  startActivity: (activityType: string) => void;
  endActivity: () => Promise<void>;
  logActivity: (activityType: string, durationMinutes?: number) => Promise<void>;
}

export function useProgressTracker({ blockId }: UseProgressTrackerProps = {}): UseProgressTrackerReturn {
  const { user } = useAuth();
  const activityStartTime = useRef<Date | null>(null);
  const currentActivityType = useRef<string | null>(null);

  // 活動開始
  const startActivity = useCallback((activityType: string) => {
    activityStartTime.current = new Date();
    currentActivityType.current = activityType;
  }, []);

  // 活動終了
  const endActivity = useCallback(async () => {
    if (!activityStartTime.current || !currentActivityType.current || !user || !blockId) {
      return;
    }

    const endTime = new Date();
    const durationMinutes = Math.round(
      (endTime.getTime() - activityStartTime.current.getTime()) / (1000 * 60)
    );

    // 最低1分の活動として記録
    const actualDuration = Math.max(durationMinutes, 1);

    try {
      const result = await progressQueries.create({
        user_id: user.id,
        block_id: blockId,
        activity_type: currentActivityType.current,
        duration_minutes: actualDuration,
        created_at: endTime.toISOString()
      });

      console.log(`進捗ログ記録完了: ${currentActivityType.current} - ${actualDuration}分`);
      console.log('記録結果:', result);
    } catch (error) {
      // progress_logsテーブルが存在しない場合の処理
      if (error && typeof error === 'object' && 'message' in error) {
        const errorMessage = (error as any).message;
        if (errorMessage.includes('relation "progress_logs" does not exist')) {
          console.warn('progress_logsテーブルが存在しません。scripts/create-progress-logs-table.sqlを実行してください。');
          return;
        }
      }
      
      console.error('進捗ログ記録エラー:', error);
      console.error('エラー詳細:', JSON.stringify(error, null, 2));
      // エラーが発生してもアプリを停止させない
    } finally {
      // リセット
      activityStartTime.current = null;
      currentActivityType.current = null;
    }
  }, [user, blockId]);

  // 直接活動ログを記録
  const logActivity = useCallback(async (activityType: string, durationMinutes = 1) => {
    if (!user || !blockId) return;

    try {
      const result = await progressQueries.create({
        user_id: user.id,
        block_id: blockId,
        activity_type: activityType,
        duration_minutes: durationMinutes,
        created_at: new Date().toISOString()
      });

      console.log(`進捗ログ記録完了: ${activityType} - ${durationMinutes}分`);
      console.log('記録結果:', result);
    } catch (error) {
      // progress_logsテーブルが存在しない場合の処理
      if (error && typeof error === 'object' && 'message' in error) {
        const errorMessage = (error as any).message;
        if (errorMessage.includes('relation "progress_logs" does not exist')) {
          console.warn('progress_logsテーブルが存在しません。scripts/create-progress-logs-table.sqlを実行してください。');
          return;
        }
      }
      
      console.error('進捗ログ記録エラー:', error);
      console.error('エラー詳細:', JSON.stringify(error, null, 2));
    }
  }, [user, blockId]);

  return {
    startActivity,
    endActivity,
    logActivity
  };
}

// 活動タイプの定数
export const ACTIVITY_TYPES = {
  BLOCK_CREATE: 'block_create',
  BLOCK_EDIT: 'block_edit',
  BLOCK_READ: 'block_read',
  BLOCK_DELETE: 'block_delete',
  CHAT_INTERACTION: 'chat_interaction',
  IMAGE_UPLOAD: 'image_upload'
} as const;

export type ActivityType = typeof ACTIVITY_TYPES[keyof typeof ACTIVITY_TYPES]; 