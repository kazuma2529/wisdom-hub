import { createClient } from "./client";
import type { Workspace, Box, Block, ProgressLog } from '@/lib/types';

// ワークスペース操作
export const workspaceQueries = {
  // ユーザーのワークスペース一覧取得
  async getAll(userId: string) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('workspaces')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data as Workspace[];
  },

  // 特定のワークスペース取得
  async getById(id: string) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('workspaces')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data as Workspace;
  },

  // ワークスペース作成
  async create(workspace: Omit<Workspace, 'id' | 'created_at' | 'updated_at'>) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('workspaces')
      .insert([workspace])
      .select()
      .single();
    
    if (error) throw error;
    return data as Workspace;
  },

  // ワークスペース更新
  async update(id: string, updates: Partial<Pick<Workspace, 'name' | 'description'>>) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('workspaces')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data as Workspace;
  },

  // ワークスペース削除
  async delete(id: string) {
    const supabase = createClient();
    const { error } = await supabase
      .from('workspaces')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};

// ボックス操作
export const boxQueries = {
  // ワークスペース内のボックス一覧取得
  async getByWorkspaceId(workspaceId: string) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('boxes')
      .select('*')
      .eq('workspace_id', workspaceId)
      .order('created_at', { ascending: true });
    
    if (error) throw error;
    return data as Box[];
  },

  // 特定のボックス取得
  async getById(id: string) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('boxes')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data as Box;
  },

  // ボックス作成
  async create(box: Omit<Box, 'id' | 'created_at' | 'updated_at'>) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('boxes')
      .insert([box])
      .select()
      .single();
    
    if (error) throw error;
    return data as Box;
  },

  // ボックス更新
  async update(id: string, updates: Partial<Pick<Box, 'name' | 'description'>>) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('boxes')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data as Box;
  },

  // ボックス削除
  async delete(id: string) {
    const supabase = createClient();
    const { error } = await supabase
      .from('boxes')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};

// ブロック操作
export const blockQueries = {
  // ボックス内のブロック一覧取得
  async getByBoxId(boxId: string) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('blocks')
      .select('*')
      .eq('box_id', boxId)
      .order('created_at', { ascending: true });
    
    if (error) throw error;
    return data as Block[];
  },

  // 特定のブロック取得
  async getById(id: string) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('blocks')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data as Block;
  },

  // ブロック作成
  async create(block: Omit<Block, 'id' | 'created_at' | 'updated_at'>) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('blocks')
      .insert([block])
      .select()
      .single();
    
    if (error) throw error;
    return data as Block;
  },

  // ブロック更新
  async update(id: string, updates: Partial<Pick<Block, 'title' | 'content' | 'cover_image_url'>>) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('blocks')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data as Block;
  },

  // ブロック削除
  async delete(id: string) {
    const supabase = createClient();
    const { error } = await supabase
      .from('blocks')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};

// 学習進捗操作
export const progressQueries = {
  // ユーザーの進捗ログ取得
  async getByUserId(userId: string) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('progress_logs')
      .select(`
        *,
        blocks:block_id (
          title,
          boxes:box_id (
            name,
            workspaces:workspace_id (name)
          )
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  // 進捗ログ作成（重複チェック付き）
  async create(progress: Omit<ProgressLog, 'id'>) {
    const supabase = createClient();
    
    // 同じブロックの同じ活動タイプが今日既に存在するかチェック
    const today = new Date().toISOString().split('T')[0];
    const { data: existingLogs, error: checkError } = await supabase
      .from('progress_logs')
      .select('*')
      .eq('user_id', progress.user_id)
      .eq('block_id', progress.block_id)
      .eq('activity_type', progress.activity_type)
      .gte('created_at', `${today}T00:00:00.000Z`)
      .lt('created_at', `${today}T23:59:59.999Z`)
      .order('created_at', { ascending: false })
      .limit(1);

    if (checkError) throw checkError;

    // 既存のログがある場合は更新、ない場合は新規作成
    if (existingLogs && existingLogs.length > 0) {
      const existingLog = existingLogs[0];
      const updatedDuration = (existingLog.duration_minutes || 0) + (progress.duration_minutes || 0);
      
      const { data, error } = await supabase
        .from('progress_logs')
        .update({
          duration_minutes: updatedDuration,
          created_at: progress.created_at || new Date().toISOString()
        })
        .eq('id', existingLog.id)
        .select()
        .single();
        
      if (error) throw error;
      return data as ProgressLog;
    } else {
      // 新規作成
      const { data, error } = await supabase
        .from('progress_logs')
        .insert([progress])
        .select()
        .single();
      
      if (error) throw error;
      return data as ProgressLog;
    }
  },

  // 進捗ログを強制的に新規作成（統合しない）
  async createNew(progress: Omit<ProgressLog, 'id'>) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('progress_logs')
      .insert([progress])
      .select()
      .single();
    
    if (error) throw error;
    return data as ProgressLog;
  },

  // 期間指定で進捗ログ取得
  async getByDateRange(userId: string, startDate: string, endDate: string) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('progress_logs')
      .select('*')
      .eq('user_id', userId)
      .gte('created_at', startDate)
      .lte('created_at', endDate)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as ProgressLog[];
  },

  // 日別学習統計を取得
  async getDailyStats(userId: string, days: number = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    const supabase = createClient();
    const { data, error } = await supabase
      .from('progress_logs')
      .select('activity_type, duration_minutes, created_at')
      .eq('user_id', userId)
      .gte('created_at', startDate.toISOString())
      .order('created_at', { ascending: true });

    if (error) throw error;
    
    // 日別にグループ化
    const dailyStats = (data as any[]).reduce((acc, log) => {
      const date = new Date(log.created_at).toISOString().split('T')[0];
      
      if (!acc[date]) {
        acc[date] = {
          date,
          totalMinutes: 0,
          activities: 0,
          types: new Set<string>()
        };
      }
      
      acc[date].totalMinutes += log.duration_minutes || 0;
      acc[date].activities += 1;
      acc[date].types.add(log.activity_type);
      
      return acc;
    }, {} as Record<string, any>);

    return Object.values(dailyStats).map((stat: any) => ({
      ...stat,
      types: Array.from(stat.types)
    }));
  },

  // 学習サマリー統計を取得
  async getSummaryStats(userId: string) {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const supabase = createClient();
    const { data, error } = await supabase
      .from('progress_logs')
      .select('activity_type, duration_minutes, created_at')
      .eq('user_id', userId)
      .gte('created_at', thirtyDaysAgo.toISOString());

    if (error) throw error;

    const logs = data as any[];
    const totalMinutes = logs.reduce((sum, log) => sum + (log.duration_minutes || 0), 0);
    const totalActivities = logs.length;
    const uniqueDays = new Set(
      logs.map(log => new Date(log.created_at).toISOString().split('T')[0])
    ).size;

    const activityTypes = logs.reduce((acc, log) => {
      acc[log.activity_type] = (acc[log.activity_type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalMinutes,
      totalHours: Math.round(totalMinutes / 60 * 10) / 10,
      totalActivities,
      activeDays: uniqueDays,
      averageMinutesPerDay: uniqueDays > 0 ? Math.round(totalMinutes / uniqueDays) : 0,
      activityTypes
    };
  }
}; 