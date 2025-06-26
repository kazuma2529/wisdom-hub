"use client";

import { useState, useEffect } from "react";
import { FolderOpen, Home } from "lucide-react";
import { EntityPageLayout } from "@/components/ui/entity-page-layout";
import { EntityItem } from "@/components/ui/entity-list";
import { useAsyncData } from "@/lib/hooks/use-async-data";
import { useCreateEntity } from "@/lib/hooks/use-create-entity";
import { workspaceQueries } from "@/lib/supabase/queries";
import { useAuth } from "@/lib/hooks/use-auth";
import type { Workspace } from "@/lib/types";

export default function DashboardPage() {
  const { user } = useAuth();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingWorkspace, setEditingWorkspace] = useState<Workspace | null>(null);
  const [deletingWorkspace, setDeletingWorkspace] = useState<Workspace | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // ワークスペース一覧取得
  const { data: workspaces, loading, error, execute: fetchWorkspaces } = useAsyncData<Workspace[]>({
    initialData: []
  });

  // ワークスペース作成
  const { isCreating, createEntity, error: createError } = useCreateEntity<
    { name: string; description: string; user_id: string },
    Workspace
  >({
    onSuccess: () => {
      setShowCreateDialog(false);
      fetchWorkspaces(() => workspaceQueries.getAll(user!.id));
    }
  });

  // 初期データ取得
  useEffect(() => {
    if (user) {
      fetchWorkspaces(() => workspaceQueries.getAll(user.id));
    }
  }, [user, fetchWorkspaces]);

  // エンティティリスト用のデータ変換
  const entityItems: EntityItem[] = (workspaces || []).map(workspace => ({
    id: workspace.id,
    title: workspace.name,
    description: workspace.description,
    href: `/workspace/${workspace.id}`
  }));

  // 作成フィールド定義
  const createFields = [
    {
      key: 'name',
      label: 'タイトル',
      placeholder: 'ワークスペース名を入力',
      required: true
    },
    {
      key: 'description',
      label: '説明',
      placeholder: 'ワークスペースの説明を入力',
      type: 'textarea' as const
    }
  ];

  // ハンドラー関数
  const handleCreateSubmit = async (data: Record<string, string>) => {
    await createEntity(
      { name: data.name, description: data.description, user_id: user!.id },
      (input) => workspaceQueries.create(input)
    );
  };

  const handleEdit = (entity: EntityItem) => {
    const workspace = workspaces?.find(w => w.id === entity.id);
    if (workspace) {
      setEditingWorkspace(workspace);
    }
  };

  const handleEditSubmit = async (data: Record<string, string>) => {
    if (!editingWorkspace) return;
    
    try {
      await workspaceQueries.update(editingWorkspace.id, {
        name: data.name,
        description: data.description
      });
      setEditingWorkspace(null);
      fetchWorkspaces(() => workspaceQueries.getAll(user!.id));
    } catch (error) {
      console.error('Failed to update workspace:', error);
    }
  };

  const handleDelete = (entity: EntityItem) => {
    const workspace = workspaces?.find(w => w.id === entity.id);
    if (workspace) {
      setDeletingWorkspace(workspace);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingWorkspace) return;
    
    setIsDeleting(true);
    try {
      await workspaceQueries.delete(deletingWorkspace.id);
      setDeletingWorkspace(null);
      fetchWorkspaces(() => workspaceQueries.getAll(user!.id));
    } catch (error) {
      console.error('Failed to delete workspace:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <EntityPageLayout
      title="ダッシュボード"
      subtitle="学習の拠点"
      description="ワークスペースを管理して学習を整理しましょう"
      icon={Home}
      showBackButton={false}
      entities={entityItems}
      entityIcon={FolderOpen}
      loading={loading}
      error={error}
      createTitle="ワークスペース"
      createFields={createFields}
      isCreating={isCreating}
      createError={createError}
      showCreateDialog={showCreateDialog}
      onCreateSubmit={handleCreateSubmit}
      onCreateCancel={() => setShowCreateDialog(false)}
      onCreateOpen={() => setShowCreateDialog(true)}
      editingEntity={editingWorkspace ? {
        id: editingWorkspace.id,
        title: editingWorkspace.name,
        description: editingWorkspace.description,
        href: `/workspace/${editingWorkspace.id}`
      } : null}
      onEdit={handleEdit}
      onEditSubmit={handleEditSubmit}
      onEditCancel={() => setEditingWorkspace(null)}
      deletingEntity={deletingWorkspace ? {
        id: deletingWorkspace.id,
        title: deletingWorkspace.name,
        description: deletingWorkspace.description,
        href: `/workspace/${deletingWorkspace.id}`
      } : null}
      isDeleting={isDeleting}
      onDelete={handleDelete}
      onDeleteConfirm={handleDeleteConfirm}
      onDeleteCancel={() => setDeletingWorkspace(null)}
      deleteWarningMessage="このワークスペース内のすべてのボックスとブロックが完全に削除されます。この操作は元に戻せません。"
    />
  );
} 