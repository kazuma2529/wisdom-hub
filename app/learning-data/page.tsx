"use client";

import { useState, useEffect } from "react";
import { TrendingUp, Calendar, Target, Clock, Loader2, Crown, Star, Zap, BookOpen } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/hooks/use-auth";
import { progressQueries, workspaceQueries } from "@/lib/supabase/queries";
import { GlowPills } from "@/components/landing/glow-pills";
import type { Workspace } from "@/lib/types";

export default function LearningDataPage() {
  const { user } = useAuth();
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [progressLogs, setProgressLogs] = useState<any[]>([]);
  const [summaryStats, setSummaryStats] = useState<any>(null);
  const [dailyStats, setDailyStats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // データ取得
  const fetchData = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const [workspacesData, progressData] = await Promise.all([
        workspaceQueries.getAll(user.id),
        progressQueries.getByUserId(user.id)
      ]);
      
      // 進捗統計は個別に取得（エラーが発生してもアプリを止めない）
      let summaryData = null;
      let dailyData = [];
      
      try {
        summaryData = await progressQueries.getSummaryStats(user.id);
      } catch (statsError) {
        console.warn('統計データの取得に失敗しました:', statsError);
      }
      
      try {
        dailyData = await progressQueries.getDailyStats(user.id, 7);
      } catch (dailyError) {
        console.warn('日別データの取得に失敗しました:', dailyError);
      }
      
      setWorkspaces(workspacesData);
      setProgressLogs(progressData || []);
      setSummaryStats(summaryData);
      setDailyStats(dailyData);
    } catch (err) {
      console.error("データ取得エラー:", err);
      console.error("エラー詳細:", JSON.stringify(err, null, 2));
      setError(err instanceof Error ? err.message : "データの取得に失敗しました");
    } finally {
      setLoading(false);
    }
  };

  // 初回データ取得
  useEffect(() => {
    fetchData();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen relative overflow-hidden">
        {/* 背景グラデーション */}
        <div className="absolute inset-0 bg-gradient-to-br from-wisdom-50 via-white to-wisdom-100" />
        <GlowPills />
        
        <div className="relative z-10 container mx-auto px-4 py-6">
          <div className="flex flex-col items-center justify-center min-h-[50vh]">
            <div className="w-16 h-16 bg-gradient-to-br from-wisdom-400 to-wisdom-600 rounded-2xl flex items-center justify-center mb-6 glow-accent animate-pulse">
              <BookOpen className="h-8 w-8 text-white" />
            </div>
            <Loader2 className="h-8 w-8 animate-spin text-wisdom-600 mb-4" />
            <p className="text-wisdom-700 font-medium">学習データを読み込み中...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen relative overflow-hidden">
        {/* 背景グラデーション */}
        <div className="absolute inset-0 bg-gradient-to-br from-wisdom-50 via-white to-wisdom-100" />
        <GlowPills />
        
        <div className="relative z-10 container mx-auto px-4 py-6">
          <div className="flex flex-col items-center justify-center min-h-[50vh]">
            <div className="w-16 h-16 bg-gradient-to-br from-red-400 to-red-600 rounded-2xl flex items-center justify-center mb-6">
              <Zap className="h-8 w-8 text-white" />
            </div>
            <p className="text-red-600 mb-4 font-medium">{error}</p>
            <Button onClick={fetchData} className="btn-premium">
              再試行
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // 統計計算
  const totalWorkspaces = workspaces.length;
  const totalProgress = progressLogs.length;
  const recentProgress = progressLogs.filter(log => {
    const logDate = new Date(log.created_at);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return logDate >= weekAgo;
  }).length;

  // 最新の学習日
  const lastLearningDate = progressLogs.length > 0 
    ? new Date(progressLogs[0].created_at).toLocaleDateString("ja-JP")
    : "まだ学習記録がありません";

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* 背景グラデーション */}
      <div className="absolute inset-0 bg-gradient-to-br from-wisdom-50 via-white to-wisdom-100" />
      <GlowPills />
      
      <div className="relative z-10 container mx-auto px-4 py-6">
        {/* ヘッダー */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center space-x-2 bg-wisdom-50 border border-wisdom-200 rounded-full px-4 py-2 mb-4 entrance-animation">
            <Star className="h-4 w-4 text-wisdom-400 animate-pulse" />
            <span className="text-sm font-medium text-wisdom-700">
              学習進捗ダッシュボード
            </span>
            <TrendingUp className="h-4 w-4 text-wisdom-400 animate-pulse" />
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold mb-4 entrance-animation animate-delay-200">
            <span className="text-gradient-premium">学習データ</span>
          </h1>
          <p className="text-xl text-dark-600 entrance-animation animate-delay-300">あなたの学習進捗を可視化します</p>
        </div>

        {/* データがない場合の表示 */}
        {totalWorkspaces === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-wisdom-400 to-wisdom-600 rounded-3xl flex items-center justify-center mb-8 glow-accent floating">
              <TrendingUp className="h-12 w-12 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gradient-premium mb-4">学習データがありません</h2>
            <p className="text-dark-600 mb-8 max-w-md text-lg">
              まずはワークスペースを作成して、学習の旅を始めましょう
            </p>
            <Button className="btn-premium text-lg px-8 py-4">
              <Crown className="mr-2 h-5 w-5" />
              学習を始める
            </Button>
          </div>
        ) : (
          <>
            {/* 統計カード */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
              <div className="card-premium rounded-2xl p-6 entrance-animation">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-dark-600">総学習時間</h3>
                  <div className="w-10 h-10 bg-gradient-to-br from-wisdom-400 to-wisdom-600 rounded-xl flex items-center justify-center glow-accent">
                    <Clock className="h-5 w-5 text-white" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-gradient-premium mb-2">{summaryStats?.totalHours || 0}時間</div>
                <p className="text-sm text-dark-500">過去30日間の学習時間</p>
              </div>

              <div className="card-premium rounded-2xl p-6 entrance-animation animate-delay-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-dark-600">学習活動数</h3>
                  <div className="w-10 h-10 bg-gradient-to-br from-wisdom-400 to-wisdom-600 rounded-xl flex items-center justify-center glow-accent">
                    <TrendingUp className="h-5 w-5 text-white" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-gradient-premium mb-2">{summaryStats?.totalActivities || 0}</div>
                <p className="text-sm text-dark-500">過去30日間の活動回数</p>
              </div>

              <div className="card-premium rounded-2xl p-6 entrance-animation animate-delay-300">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-dark-600">活動日数</h3>
                  <div className="w-10 h-10 bg-gradient-to-br from-wisdom-400 to-wisdom-600 rounded-xl flex items-center justify-center glow-accent">
                    <Calendar className="h-5 w-5 text-white" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-gradient-premium mb-2">{summaryStats?.activeDays || 0}日</div>
                <p className="text-sm text-dark-500">過去30日間の学習日数</p>
              </div>

              <div className="card-premium rounded-2xl p-6 entrance-animation animate-delay-400">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-dark-600">1日平均時間</h3>
                  <div className="w-10 h-10 bg-gradient-to-br from-wisdom-400 to-wisdom-600 rounded-xl flex items-center justify-center glow-accent">
                    <Target className="h-5 w-5 text-white" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-gradient-premium mb-2">{summaryStats?.averageMinutesPerDay || 0}分</div>
                <p className="text-sm text-dark-500">1日あたりの学習時間</p>
              </div>
            </div>

            {/* 過去7日間の学習パターン */}
            {dailyStats.length > 0 && (
              <div className="card-premium rounded-2xl p-8 mb-8 entrance-animation animate-delay-500">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-wisdom-400 to-wisdom-600 rounded-xl flex items-center justify-center glow-accent">
                    <Calendar className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gradient-premium">過去7日間の学習パターン</h2>
                    <p className="text-dark-600">日別の学習活動を表示</p>
                  </div>
                </div>
                <div className="space-y-4">
                  {dailyStats
                    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                    .map((day, index) => (
                      <div key={day.date} className="flex items-center justify-between p-4 bg-gradient-to-r from-wisdom-50 to-white rounded-xl border border-wisdom-100 hover:shadow-lg transition-all duration-300" style={{ animationDelay: `${index * 100}ms` }}>
                        <div>
                          <p className="font-semibold text-dark-700">
                            {new Date(day.date).toLocaleDateString('ja-JP', { 
                              month: 'short', 
                              day: 'numeric',
                              weekday: 'short'
                            })}
                          </p>
                          <p className="text-sm text-dark-500">
                            {day.activities}回の活動
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-gradient-premium">{day.totalMinutes}分</p>
                          <p className="text-xs text-dark-500">
                            {day.types.join(', ')}
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* 最近の学習記録 */}
            <div className="card-premium rounded-2xl p-8 entrance-animation animate-delay-600">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-wisdom-400 to-wisdom-600 rounded-xl flex items-center justify-center glow-accent">
                  <BookOpen className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gradient-premium">最近の学習記録</h2>
                  <p className="text-dark-600">最新の学習活動を表示</p>
                </div>
              </div>
              {progressLogs.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gradient-to-br from-wisdom-400 to-wisdom-600 rounded-2xl flex items-center justify-center mx-auto mb-6 glow-accent">
                    <Star className="h-8 w-8 text-white" />
                  </div>
                  <p className="text-dark-600 text-lg mb-2">学習記録がありません</p>
                  <p className="text-sm text-dark-500">
                    ブロックを完了すると、ここに記録が表示されます
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {progressLogs.slice(0, 10).map((log, index) => (
                    <div key={log.id} className="flex items-center justify-between p-4 bg-gradient-to-r from-wisdom-50 to-white rounded-xl border border-wisdom-100 hover:shadow-lg transition-all duration-300" style={{ animationDelay: `${index * 50}ms` }}>
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-wisdom-400 to-wisdom-600 rounded-lg flex items-center justify-center">
                          <BookOpen className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <p className="font-semibold text-dark-700">{log.blocks?.title || "不明なブロック"}</p>
                          <p className="text-sm text-dark-500">
                            {log.blocks?.boxes?.workspaces?.name || "不明なワークスペース"} / {log.blocks?.boxes?.name || "不明なボックス"}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-dark-600">
                          {new Date(log.created_at).toLocaleDateString("ja-JP")}
                        </p>
                        {log.duration_minutes && (
                          <p className="text-xs text-wisdom-600 font-medium">
                            {log.duration_minutes}分
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
} 