"use client";

import { useState, useEffect, use } from "react";
import { Package, FolderOpen } from "lucide-react";
import { EntityPageLayout } from "@/components/ui/entity-page-layout";
import { EntityItem } from "@/components/ui/entity-list";
import { useAuth } from "@/lib/hooks/use-auth";
import { useAsyncData } from "@/lib/hooks/use-async-data";
import { useCreateEntity } from "@/lib/hooks/use-create-entity";
import { workspaceQueries, boxQueries } from "@/lib/supabase/queries";
import type { Workspace, Box } from "@/lib/types";

export default function WorkspacePage({ params }: { params: Promise<{ id: string }> }) {
  const { id: workspaceId } = use(params);
  const { user } = useAuth();
  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingBox, setEditingBox] = useState<Box | null>(null);
  const [deletingBox, setDeletingBox] = useState<Box | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // ボックス一覧取得
  const { data: boxes, loading, error, execute: fetchBoxes } = useAsyncData<Box[]>({
    initialData: []
  });

  // ボックス作成
  const { isCreating, createEntity, error: createError } = useCreateEntity<
    { name: string; description: string; workspace_id: string; user_id: string },
    Box
  >({
    onSuccess: () => {
      setShowCreateDialog(false);
      fetchBoxes(() => boxQueries.getByWorkspaceId(workspaceId));
    }
  });

  // 初期データ取得
  useEffect(() => {
    if (user && workspaceId) {
      // ワークスペース情報を取得
      workspaceQueries.getById(workspaceId)
        .then(setWorkspace)
        .catch(console.error);
      
      // ボックス一覧を取得
      fetchBoxes(() => boxQueries.getByWorkspaceId(workspaceId));
    }
  }, [user, workspaceId, fetchBoxes]);

  // エンティティリスト用のデータ変換
  const entityItems: EntityItem[] = (boxes || []).map(box => ({
    id: box.id,
    title: box.name,
    description: box.description,
    href: `/workspace/${workspaceId}/box/${box.id}`
  }));

  // 作成フィールド定義
  const createFields = [
    {
      key: 'name',
      label: 'タイトル',
      placeholder: 'ボックス名を入力',
      required: true
    },
    {
      key: 'description',
      label: '説明',
      placeholder: 'ボックスの説明を入力',
      type: 'textarea' as const
    }
  ];

  // ハンドラー関数
  const handleCreateSubmit = async (data: Record<string, string>) => {
    await createEntity(
      { 
        name: data.name, 
        description: data.description, 
        workspace_id: workspaceId,
        user_id: user!.id 
      },
      (input) => boxQueries.create(input)
    );
  };

  const handleEdit = (entity: EntityItem) => {
    const box = boxes?.find(b => b.id === entity.id);
    if (box) {
      setEditingBox(box);
    }
  };

  const handleEditSubmit = async (data: Record<string, string>) => {
    if (!editingBox) return;
    
    try {
      await boxQueries.update(editingBox.id, {
        name: data.name,
        description: data.description
      });
      setEditingBox(null);
      fetchBoxes(() => boxQueries.getByWorkspaceId(workspaceId));
    } catch (error) {
      console.error('Failed to update box:', error);
    }
  };

  const handleDelete = (entity: EntityItem) => {
    const box = boxes?.find(b => b.id === entity.id);
    if (box) {
      setDeletingBox(box);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingBox) return;
    
    setIsDeleting(true);
    try {
      await boxQueries.delete(deletingBox.id);
      setDeletingBox(null);
      fetchBoxes(() => boxQueries.getByWorkspaceId(workspaceId));
    } catch (error) {
      console.error('Failed to delete box:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  if (!workspace) {
    return <div>Loading...</div>;
  }

  return (
    <EntityPageLayout
      backHref="/dashboard"
      title={workspace.name}
      subtitle="ボックスを整理"
      description="学習内容をボックスに分類して整理しましょう"
      icon={FolderOpen}
      entities={entityItems}
      entityIcon={Package}
      loading={loading}
      error={error}
      createTitle="ボックス"
      createFields={createFields}
      isCreating={isCreating}
      createError={createError}
      showCreateDialog={showCreateDialog}
      onCreateSubmit={handleCreateSubmit}
      onCreateCancel={() => setShowCreateDialog(false)}
      onCreateOpen={() => setShowCreateDialog(true)}
      editingEntity={editingBox ? {
        id: editingBox.id,
        title: editingBox.name,
        description: editingBox.description,
        href: `/workspace/${workspaceId}/box/${editingBox.id}`
      } : null}
      onEdit={handleEdit}
      onEditSubmit={handleEditSubmit}
      onEditCancel={() => setEditingBox(null)}
      deletingEntity={deletingBox ? {
        id: deletingBox.id,
        title: deletingBox.name,
        description: deletingBox.description,
        href: `/workspace/${workspaceId}/box/${deletingBox.id}`
      } : null}
      isDeleting={isDeleting}
      onDelete={handleDelete}
      onDeleteConfirm={handleDeleteConfirm}
      onDeleteCancel={() => setDeletingBox(null)}
      deleteWarningMessage="このボックス内のすべてのブロックが完全に削除されます。この操作は元に戻せません。"
    />
  );
} 