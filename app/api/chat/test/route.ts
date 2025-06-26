import { NextResponse } from 'next/server';
import { chatWithAI } from '@/lib/dify';

// GET /api/chat/test - Dify API接続テスト
export async function GET() {
  try {
    const testResponse = await chatWithAI('テスト接続です。簡単に挨拶してください。');
    
    return NextResponse.json({
      success: true,
      message: 'Dify API接続成功',
      testResponse: testResponse.answer,
      conversationId: testResponse.conversationId,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Dify接続テストエラー:', error);
    
    return NextResponse.json(
      { 
        success: false,
        error: error instanceof Error ? error.message : 'Dify API接続に失敗しました',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
} 