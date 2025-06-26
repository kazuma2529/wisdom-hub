"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Loader2, ImageIcon, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { CoverImageUpload } from "@/components/ui/cover-image-upload";
import { ChatDrawer } from "@/components/chatbot/chat-drawer";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useAuth } from "@/lib/hooks/use-auth";
import { useAuthRedirect } from "@/lib/hooks/use-auth-redirect";
import { useAutoSave } from "@/lib/hooks/use-auto-save";
import { useProgressTracker, ACTIVITY_TYPES } from "@/lib/hooks/use-progress-tracker";
import { blockQueries } from "@/lib/supabase/queries";
import type { Block } from "@/lib/types";
import { cn } from "@/lib/utils";

interface BlockData {
  title: string;
  content: string;
  coverImageUrl: string | null;
}

export default function BlockEditorPage({ 
  params 
}: { 
  params: Promise<{ id: string; boxId: string; blockId: string }>
}) {
  const resolvedParams = use(params);
  const router = useRouter();
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

  // フォーム状態
  const [blockData, setBlockData] = useState<BlockData>({
    title: "",
    content: "",
    coverImageUrl: null
  });

  // 自動保存機能
  const { isSaving, lastSaved, saveNow } = useAutoSave({
    data: blockData,
    onSave: async (data) => {
      if (!block || !user) return;
      
      await blockQueries.update(block.id, {
        title: data.title.trim(),
        content: data.content.trim() || undefined,
        cover_image_url: data.coverImageUrl || undefined
      });
      
      // 進捗ログ記録
      await logActivity(ACTIVITY_TYPES.BLOCK_EDIT, 2); // 2分記録
    },
    delay: 3000, // 3秒後に自動保存
    enabled: !!block && !!user
  });

  // ブロックデータ取得
  const fetchBlock = async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);
      const blockData = await blockQueries.getById(resolvedParams.blockId);
      setBlock(blockData);
      setBlockData({
        title: blockData.title,
        content: blockData.content || "",
        coverImageUrl: blockData.cover_image_url || null
      });
    } catch (err) {
      console.error("ブロック取得エラー:", err);
      setError(err instanceof Error ? err.message : "ブロックの取得に失敗しました");
    } finally {
      setLoading(false);
    }
  };

  // 手動保存処理
  const handleManualSave = async () => {
    try {
      await saveNow();
      // 保存後、ボックス表示画面に遷移
      router.push(`/workspace/${resolvedParams.id}/box/${resolvedParams.boxId}`);
    } catch (err) {
      console.error("保存エラー:", err);
      setError(err instanceof Error ? err.message : "保存に失敗しました");
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

  // チャット用のコンテキスト作成
  const chatContext = block ? `
ブロックタイトル: ${block.title}
ブロック内容:
${block.content || '（内容なし）'}
` : undefined;

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
        <ChatDrawer context={chatContext} />
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
        <ChatDrawer context={chatContext} />
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
        <ChatDrawer context={chatContext} />
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
              <div className="text-sm text-gray-600">
                {isSaving ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-3 w-3 animate-spin" />
                    <span>保存中...</span>
                  </div>
                ) : lastSaved ? (
                  <div className="flex items-center gap-2">
                    <Clock className="h-3 w-3" />
                    <span>
                      {lastSaved.toLocaleTimeString('ja-JP', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })} に保存済み
                    </span>
                  </div>
                ) : null}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleManualSave}>
                <Save className="h-4 w-4 mr-1" />
                保存
              </Button>
              <Button 
                size="sm" 
                onClick={handleManualSave}
                className="bg-wisdom-600 hover:bg-wisdom-700 text-white"
              >
                完了
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* メインコンテンツ */}
      <div className="container mx-auto px-4 py-8 max-w-4xl pb-20">
        {/* カバー画像 */}
        <div className="mb-8">
          <CoverImageUpload
            userId={user?.id || ""}
            currentImageUrl={blockData.coverImageUrl || undefined}
            onImageChange={(url) => setBlockData(prev => ({ ...prev, coverImageUrl: url }))}
            disabled={isSaving}
          />
        </div>

        {/* タイトル */}
        <div className="mb-8">
          <Input
            value={blockData.title}
            onChange={(e) => setBlockData(prev => ({ ...prev, title: e.target.value }))}
            placeholder="タイトル"
            className="text-4xl font-bold border-none px-0 py-4 focus:ring-0 focus:border-none shadow-none text-gray-900 placeholder-gray-400"
            style={{ fontSize: '2.5rem', lineHeight: '1.2' }}
            disabled={isSaving}
          />
        </div>

        {/* リッチテキストエディタ */}
        <div className="mb-20">
          <RichTextEditor
            content={blockData.content}
            onChange={(content) => setBlockData(prev => ({ ...prev, content }))}
            placeholder="読んだ本の感想を書いてみませんか？"
            disabled={isSaving}
          />
        </div>
      </div>

      <ChatDrawer context={chatContext} />
    </div>
  );
} 