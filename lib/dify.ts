// Dify AI API ラッパー
// T-301: Dify API ラッパー実装

import type { 
  DifyMessage, 
  DifyChatRequest, 
  DifyChatResponse, 
  DifyError 
} from '@/lib/types';

// 環境変数の取得
const DIFY_API_KEY = process.env.DIFY_API_KEY;
const DIFY_BASE_URL = process.env.NEXT_PUBLIC_DIFY_BASE_URL || 'https://api.dify.ai/v1';

// APIキーの存在チェック
if (!DIFY_API_KEY) {
  console.warn('⚠️ DIFY_API_KEY が設定されていません。環境変数を確認してください。');
}

/**
 * Dify APIにチャットメッセージを送信
 * @param request - チャットリクエスト
 * @returns Promise<DifyChatResponse>
 */
export async function sendChatMessage(request: DifyChatRequest): Promise<DifyChatResponse> {
  if (!DIFY_API_KEY) {
    throw new Error('Dify APIキーが設定されていません。環境変数 DIFY_API_KEY を確認してください。');
  }

  try {
    const response = await fetch(`${DIFY_BASE_URL}/chat-messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${DIFY_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: request.inputs || {},
        query: request.query,
        response_mode: request.response_mode || 'blocking',
        conversation_id: request.conversation_id || '',
        user: request.user || `user-${Date.now()}`,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Dify API エラー (${response.status}): ${errorData.message || response.statusText}`);
    }

    const data: DifyChatResponse = await response.json();
    return data;
  } catch (error) {
    console.error('Dify API 呼び出しエラー:', error);
    throw error instanceof Error ? error : new Error('Dify API呼び出しに失敗しました');
  }
}

/**
 * 簡単なチャット送信（ユーザー向けヘルパー関数）
 * @param message - ユーザーのメッセージ
 * @param conversationId - 会話ID（継続する場合）
 * @param userId - ユーザーID
 * @returns Promise<string> - AIの回答
 */
export async function chatWithAI(
  message: string, 
  conversationId?: string, 
  userId?: string
): Promise<{ answer: string; conversationId: string }> {
  try {
    const response = await sendChatMessage({
      query: message,
      conversation_id: conversationId,
      user: userId || `user-${Date.now()}`,
      response_mode: 'blocking'
    });

    return {
      answer: response.answer,
      conversationId: response.conversation_id
    };
  } catch (error) {
    console.error('AI チャットエラー:', error);
    throw new Error('AIとの通信に失敗しました。しばらく待ってから再試行してください。');
  }
}

/**
 * 学習コンテキスト付きチャット（RAG対応）
 * @param message - ユーザーのメッセージ  
 * @param context - 学習コンテキスト（ブロックの内容など）
 * @param conversationId - 会話ID
 * @param userId - ユーザーID
 * @returns Promise<string> - AIの回答
 */
export async function chatWithContext(
  message: string,
  context?: string,
  conversationId?: string,
  userId?: string
): Promise<{ answer: string; conversationId: string }> {
  try {
    // コンテキストがある場合は、メッセージに追加
    const enhancedMessage = context 
      ? `【学習コンテキスト】\n${context}\n\n【質問】\n${message}`
      : message;

    const response = await sendChatMessage({
      query: enhancedMessage,
      conversation_id: conversationId,
      user: userId || `user-${Date.now()}`,
      response_mode: 'blocking',
      inputs: {
        context: context || ''
      }
    });

    return {
      answer: response.answer,
      conversationId: response.conversation_id
    };
  } catch (error) {
    console.error('コンテキスト付きチャットエラー:', error);
    throw new Error('AIとの通信に失敗しました。しばらく待ってから再試行してください。');
  }
}

/**
 * APIの接続テスト
 * @returns Promise<boolean>
 */
export async function testDifyConnection(): Promise<boolean> {
  try {
    const response = await chatWithAI('こんにちは、テストメッセージです。');
    return response.answer.length > 0;
  } catch (error) {
    console.error('Dify接続テスト失敗:', error);
    return false;
  }
} 