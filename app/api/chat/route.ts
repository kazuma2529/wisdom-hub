import { NextRequest, NextResponse } from 'next/server';
import { chatWithAI, chatWithContext } from '@/lib/dify';

// POST /api/chat - AIチャット
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, context, conversationId, userId } = body;

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'メッセージが必要です' },
        { status: 400 }
      );
    }

    // コンテキストがある場合はRAG、ない場合は通常チャット
    const response = context 
      ? await chatWithContext(message, context, conversationId, userId)
      : await chatWithAI(message, conversationId, userId);

    return NextResponse.json({
      success: true,
      answer: response.answer,
      conversationId: response.conversationId,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Chat API エラー:', error);
    
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'AIチャットでエラーが発生しました',
        success: false 
      },
      { status: 500 }
    );
  }
}

 