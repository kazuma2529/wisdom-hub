"use client";

import { useState, useCallback } from 'react';
import type { DifyMessage } from '@/lib/types';

interface UseChatProps {
  userId?: string;
  context?: string; // 学習コンテキスト（ブロックの内容など）
}

interface UseChatReturn {
  messages: DifyMessage[];
  isLoading: boolean;
  error: string | null;
  conversationId: string | null;
  sendMessage: (message: string) => Promise<void>;
  clearMessages: () => void;
  clearError: () => void;
}

export function useChat({ userId, context }: UseChatProps = {}): UseChatReturn {
  const [messages, setMessages] = useState<DifyMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [conversationId, setConversationId] = useState<string | null>(null);

  const sendMessage = useCallback(async (message: string) => {
    if (!message.trim()) return;

    const userMessage: DifyMessage = {
      role: 'user',
      content: message.trim(),
      timestamp: new Date()
    };

    // ユーザーメッセージを即座に表示
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: message.trim(),
          context,
          conversationId,
          userId: userId || `user-${Date.now()}`
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'チャットでエラーが発生しました');
      }

      if (!data.success) {
        throw new Error(data.error || 'AIからの応答を取得できませんでした');
      }

      // AIの応答を追加
      const aiMessage: DifyMessage = {
        role: 'assistant',
        content: data.answer,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
      
      // 会話IDを保存（継続的な会話のため）
      if (data.conversationId) {
        setConversationId(data.conversationId);
      }

    } catch (err) {
      console.error('チャット送信エラー:', err);
      const errorMessage = err instanceof Error ? err.message : 'チャットでエラーが発生しました';
      setError(errorMessage);

      // エラーメッセージを会話に追加
      const errorAiMessage: DifyMessage = {
        role: 'assistant',
        content: `申し訳ございません。${errorMessage}\n\nしばらく待ってから再試行してください。`,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorAiMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [context, conversationId, userId]);

  const clearMessages = useCallback(() => {
    setMessages([]);
    setConversationId(null);
    setError(null);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    messages,
    isLoading,
    error,
    conversationId,
    sendMessage,
    clearMessages,
    clearError
  };
} 