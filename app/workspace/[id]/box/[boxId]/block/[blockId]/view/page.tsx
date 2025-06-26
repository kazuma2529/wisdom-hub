"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { ArrowLeft, Edit, Loader2, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useAuth } from "@/lib/hooks/use-auth";
import { useAuthRedirect } from "@/lib/hooks/use-auth-redirect";
import { useProgressTracker, ACTIVITY_TYPES } from "@/lib/hooks/use-progress-tracker";
import { blockQueries } from "@/lib/supabase/queries";
import type { Block } from "@/lib/types";

export default function BlockViewPage({ 
  params 
}: { 
  params: Promise<{ id: string; boxId: string; blockId: string }>
}) {
  const resolvedParams = use(params);
  const { user } = useAuth();
  const { isReady } = useAuthRedirect({ requireAuth: true });

  // 進捗追跡
  const { startActivity, endActivity, logActivity } = useProgressTracker({
    blockId: resolvedParams.blockId
  });

  // 状態管理
  const [block, setBlock] = useState<Block | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ブロックデータ取得
  const fetchBlock = async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);
      const blockData = await blockQueries.getById(resolvedParams.blockId);
      setBlock(blockData);
    } catch (err) {
      console.error("ブロック取得エラー:", err);
      setError(err instanceof Error ? err.message : "ブロックの取得に失敗しました");
    } finally {
      setLoading(false);
    }
  };

  // 初回データ取得と進捗追跡開始
  useEffect(() => {
    fetchBlock();
    
    // ブロック読み込み活動開始
    if (user && resolvedParams.blockId) {
      startActivity(ACTIVITY_TYPES.BLOCK_READ);
    }

    // ページ離脱時に活動終了
    return () => {
      endActivity();
    };
  }, [user, resolvedParams.blockId, startActivity, endActivity]);

  // 認証チェック
  if (!isReady || !user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        <LoadingSpinner showLogo />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col items-center justify-center min-h-[50vh]">
            <Loader2 className="h-8 w-8 animate-spin text-wisdom-600 mb-4" />
            <p className="text-gray-600">ブロックを読み込み中...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col items-center justify-center min-h-[50vh]">
            <p className="text-red-500 mb-4">{error}</p>
            <div className="flex gap-2">
              <Button onClick={fetchBlock} variant="outline">
                再試行
              </Button>
              <Button asChild variant="ghost">
                <Link href={`/workspace/${resolvedParams.id}/box/${resolvedParams.boxId}`}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  ボックスに戻る
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!block) {
    return (
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col items-center justify-center min-h-[50vh]">
            <p className="text-gray-600 mb-4">ブロックが見つかりません</p>
            <Button asChild>
              <Link href={`/workspace/${resolvedParams.id}/box/${resolvedParams.boxId}`}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                ボックスに戻る
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* ヘッダー */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-3 max-w-4xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href={`/workspace/${resolvedParams.id}/box/${resolvedParams.boxId}`}>
                <Button variant="ghost" size="sm" className="hover:bg-gray-100">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              <span className="text-sm text-gray-600">記事を閲覧中</span>
            </div>

            <Link href={`/workspace/${resolvedParams.id}/box/${resolvedParams.boxId}/block/${resolvedParams.blockId}`}>
              <Button 
                size="sm" 
                className="bg-wisdom-600 hover:bg-wisdom-700 text-white"
              >
                <Edit className="h-4 w-4 mr-1" />
                編集
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* メインコンテンツ */}
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* カバー画像 */}
        {block.cover_image_url && (
          <div className="mb-8">
            <img
              src={block.cover_image_url}
              alt={block.title}
              className="w-full h-auto max-h-[400px] object-cover rounded-lg shadow-lg"
            />
          </div>
        )}

        {/* タイトル */}
        <h1 className="text-4xl font-bold text-gray-900 mb-8 leading-tight">
          {block.title}
        </h1>

        {/* 内容 */}
        {block.content ? (
          <div 
            className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-p:leading-relaxed prose-a:text-blue-600 prose-strong:text-gray-900 prose-blockquote:border-l-wisdom-400 prose-blockquote:bg-wisdom-50 prose-code:bg-gray-100 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-pre:bg-gray-900 prose-pre:text-white"
            dangerouslySetInnerHTML={{ __html: block.content }}
          />
        ) : (
          <div className="text-center py-16">
            <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">
              内容がまだ記録されていません。
            </p>
            <p className="text-gray-400 text-base mt-2">
              編集ボタンから記事を書き始めましょう。
            </p>
          </div>
        )}
      </div>
    </div>
  );
} 