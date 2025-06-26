"use client";

import { useState, useEffect, use } from "react";
import { FileText, Package } from "lucide-react";
import { EntityPageLayout } from "@/components/ui/entity-page-layout";
import { EntityItem } from "@/components/ui/entity-list";
import { useAuth } from "@/lib/hooks/use-auth";
import { useCreateEntity } from "@/lib/hooks/use-create-entity";
import { boxQueries, blockQueries } from "@/lib/supabase/queries";
import type { Box, Block } from "@/lib/types";

export default function BoxPage({ params }: { params: Promise<{ id: string; boxId: string }> }) {
  const { id: workspaceId, boxId } = use(params);
  const { user } = useAuth();
  const [box, setBox] = useState<Box | null>(null);
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingBlock, setEditingBlock] = useState<Block | null>(null);
  const [deletingBlock, setDeletingBlock] = useState<Block | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // ブロック作成
  const { isCreating, createEntity, error: createError } = useCreateEntity<
    { title: string; content: string; box_id: string; user_id: string },
    Block
  >({
    onSuccess: () => {
      setShowCreateDialog(false);
      fetchBlocks();
    }
  });

  // データ取得関数
  const fetchBlocks = async () => {
    try {
      setLoading(true);
      const blocksData = await blockQueries.getByBoxId(boxId);
      setBlocks(blocksData);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch blocks:', err);
      setError('ブロックの取得に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  // 初期データ取得
  useEffect(() => {
    if (user && boxId) {
      // ボックス情報を取得
      boxQueries.getById(boxId)
        .then(setBox)
        .catch(console.error);
      
      // ブロック一覧を取得
      fetchBlocks();
    }
  }, [user, boxId]);

  // エンティティリスト用のデータ変換
  const entityItems: EntityItem[] = blocks.map((block: Block) => ({
    id: block.id,
    title: block.title,
    content: block.content,
    href: `/workspace/${workspaceId}/box/${boxId}/block/${block.id}`
  }));

  // 作成フィールド定義
  const createFields = [
    {
      key: 'title',
      label: 'タイトル',
      placeholder: 'ブロックのタイトルを入力',
      required: true
    },
    {
      key: 'content',
      label: '内容',
      placeholder: 'ブロックの初期内容を入力',
      type: 'textarea' as const
    }
  ];

  // ハンドラー関数
  const handleCreateSubmit = async (data: Record<string, string>) => {
    await createEntity(
      { 
        title: data.title, 
        content: data.content || '', 
        box_id: boxId,
        user_id: user!.id 
      },
      (input) => blockQueries.create(input)
    );
  };

  const handleEdit = (entity: EntityItem) => {
    // ブロック編集は編集ページに遷移
    window.location.href = `/workspace/${workspaceId}/box/${boxId}/block/${entity.id}`;
  };

  const handleEditSubmit = async (data: Record<string, string>) => {
    // 使用されない（編集は別ページで行う）
  };

  const handleDelete = (entity: EntityItem) => {
    const block = blocks.find((b: Block) => b.id === entity.id);
    if (block) {
      setDeletingBlock(block);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingBlock) return;
    
    setIsDeleting(true);
    try {
      await blockQueries.delete(deletingBlock.id);
      setDeletingBlock(null);
      fetchBlocks();
    } catch (error) {
      console.error('Failed to delete block:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  if (!box) {
    return <div>Loading...</div>;
  }

  return (
    <EntityPageLayout
      backHref={`/workspace/${workspaceId}`}
      title={box.name}
      subtitle="ブロックを管理"
      description="学習コンテンツをブロック単位で整理しましょう"
      icon={Package}
      entities={entityItems}
      entityIcon={FileText}
      loading={loading}
      error={error}
      compact={true}
      showContent={true}
      createTitle="ブロック"
      createFields={createFields}
      isCreating={isCreating}
      createError={createError}
      showCreateDialog={showCreateDialog}
      onCreateSubmit={handleCreateSubmit}
      onCreateCancel={() => setShowCreateDialog(false)}
      onCreateOpen={() => setShowCreateDialog(true)}
      editingEntity={null} // 編集は別ページで行う
      onEdit={handleEdit}
      onEditSubmit={handleEditSubmit}
      onEditCancel={() => {}}
      deletingEntity={deletingBlock ? {
        id: deletingBlock.id,
        title: deletingBlock.title,
        content: deletingBlock.content,
        href: `/workspace/${workspaceId}/box/${boxId}/block/${deletingBlock.id}`
      } : null}
      isDeleting={isDeleting}
      onDelete={handleDelete}
      onDeleteConfirm={handleDeleteConfirm}
      onDeleteCancel={() => setDeletingBlock(null)}
      deleteWarningMessage="このブロックのすべての内容が完全に削除されます。この操作は元に戻せません。"
    />
  );
} 