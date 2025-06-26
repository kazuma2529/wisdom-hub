"use client";

import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Trash2, Bot, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useChat } from '@/lib/hooks/use-chat';
import { useAuth } from '@/lib/hooks/use-auth';
import type { DifyMessage } from '@/lib/types';
import { cn } from '@/lib/utils';

interface ChatDrawerProps {
  context?: string; // 学習コンテキスト
  className?: string;
}

export function ChatDrawer({ context, className }: ChatDrawerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const { user } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    messages,
    isLoading,
    error,
    sendMessage,
    clearMessages
  } = useChat({
    userId: user?.id,
    context
  });

  // メッセージ追加時に自動スクロール
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // チャット開閉時にフォーカス管理
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const message = inputMessage;
    setInputMessage('');
    await sendMessage(message);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (timestamp: Date) => {
    return new Intl.DateTimeFormat('ja-JP', {
      hour: '2-digit',
      minute: '2-digit'
    }).format(timestamp);
  };

  return (
    <>
      {/* FABボタン */}
      <Button
        onClick={() => setIsOpen(true)}
        className={cn(
          "fixed bottom-24 right-6 h-14 w-14 rounded-full shadow-lg z-40",
          "bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600",
          "transition-all duration-300 hover:scale-110",
          className
        )}
        size="icon"
      >
        <MessageCircle className="h-6 w-6 text-white" />
      </Button>

      {/* チャットドロワー */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-end p-4">
          {/* オーバーレイ */}
          <div 
            className="absolute inset-0 bg-black/20 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          
          {/* チャットパネル */}
          <Card className="relative w-full max-w-md h-[600px] flex flex-col shadow-2xl animate-in slide-in-from-right-full duration-300">
            {/* ヘッダー */}
            <CardHeader className="flex-shrink-0 pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Bot className="h-5 w-5 text-purple-500" />
                  学習支援AI
                </CardTitle>
                <div className="flex items-center gap-1">
                  {messages.length > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearMessages}
                      className="h-8 w-8 p-0"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsOpen(false)}
                    className="h-8 w-8 p-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              {context && (
                <p className="text-xs text-muted-foreground">
                  📚 学習コンテキスト: 現在のブロック内容を参照
                </p>
              )}
            </CardHeader>

            {/* メッセージエリア */}
            <CardContent className="flex-1 flex flex-col min-h-0 p-4 pt-0">
              <ScrollArea className="flex-1 pr-4">
                <div className="space-y-4">
                  {messages.length === 0 ? (
                    <div className="text-center text-muted-foreground py-8">
                      <Bot className="h-12 w-12 mx-auto mb-3 text-purple-300" />
                      <p className="text-sm">
                        こんにちは！学習支援AIです。
                        <br />
                        何でもお気軽にお聞きください。
                      </p>
                    </div>
                  ) : (
                    messages.map((message, index) => (
                      <MessageBubble 
                        key={index} 
                        message={message} 
                        formatTime={formatTime}
                      />
                    ))
                  )}
                  
                  {isLoading && (
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                        <Bot className="h-4 w-4 text-purple-600" />
                      </div>
                      <div className="flex-1 bg-muted rounded-lg p-3">
                        <LoadingSpinner size="sm" text="考え中..." />
                      </div>
                    </div>
                  )}
                </div>
                <div ref={messagesEndRef} />
              </ScrollArea>

              {/* 入力エリア */}
              <div className="flex-shrink-0 pt-4 border-t">
                <div className="flex gap-2">
                  <Input
                    ref={inputRef}
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="メッセージを入力..."
                    disabled={isLoading}
                    className="flex-1"
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!inputMessage.trim() || isLoading}
                    size="icon"
                    className="bg-purple-500 hover:bg-purple-600"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
                {error && (
                  <p className="text-xs text-red-500 mt-2">
                    {error}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}

// メッセージバブルコンポーネント
interface MessageBubbleProps {
  message: DifyMessage;
  formatTime: (timestamp: Date) => string;
}

function MessageBubble({ message, formatTime }: MessageBubbleProps) {
  const isUser = message.role === 'user';

  return (
    <div className={cn(
      "flex items-start gap-3",
      isUser && "flex-row-reverse"
    )}>
      {/* アバター */}
      <div className={cn(
        "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center",
        isUser 
          ? "bg-blue-100" 
          : "bg-purple-100"
      )}>
        {isUser ? (
          <User className="h-4 w-4 text-blue-600" />
        ) : (
          <Bot className="h-4 w-4 text-purple-600" />
        )}
      </div>

      {/* メッセージ */}
      <div className={cn(
        "flex-1 max-w-[85%]",
        isUser && "flex flex-col items-end"
      )}>
        <div className={cn(
          "rounded-lg p-3 text-sm",
          isUser
            ? "bg-blue-500 text-white"
            : "bg-muted text-foreground"
        )}>
          <p className="whitespace-pre-wrap break-words">
            {message.content}
          </p>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          {formatTime(message.timestamp)}
        </p>
      </div>
    </div>
  );
} 