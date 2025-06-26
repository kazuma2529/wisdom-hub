"use client";

import { User, Settings, Bell, LogOut, Mail, Calendar, Crown, Star, Shield, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/lib/hooks/use-auth";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { GlowPills } from "@/components/landing/glow-pills";

export default function ProfilePage() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSignOut = async () => {
    setIsLoading(true);
    try {
      await signOut();
      router.push("/");
    } catch (error) {
      console.error("ログアウトエラー:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // ユーザーの登録日を取得
  const createdAt = user?.created_at 
    ? new Date(user.created_at).toLocaleDateString("ja-JP")
    : "不明";

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* 背景グラデーション */}
      <div className="absolute inset-0 bg-gradient-to-br from-wisdom-50 via-white to-wisdom-100" />
      <GlowPills />
      
      <div className="relative z-10 container mx-auto px-4 py-6">
        {/* ヘッダー */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center space-x-2 bg-wisdom-50 border border-wisdom-200 rounded-full px-4 py-2 mb-4 entrance-animation">
            <Crown className="h-4 w-4 text-wisdom-400 animate-pulse" />
            <span className="text-sm font-medium text-wisdom-700">
              プレミアムアカウント
            </span>
            <Star className="h-4 w-4 text-wisdom-400 animate-pulse" />
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold mb-4 entrance-animation animate-delay-200">
            <span className="text-gradient-premium">マイページ</span>
          </h1>
          <p className="text-xl text-dark-600 entrance-animation animate-delay-300">アカウント設定と通知管理</p>
        </div>

        {/* プロフィール情報 */}
        <div className="card-premium rounded-2xl p-8 mb-8 entrance-animation animate-delay-400">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-wisdom-400 to-wisdom-600 rounded-2xl flex items-center justify-center glow-accent">
              <User className="h-8 w-8 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gradient-premium">プロフィール情報</h2>
              <p className="text-dark-600">基本的なアカウント情報</p>
            </div>
          </div>
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-wisdom-50 to-white rounded-xl border border-wisdom-100 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center">
                  <Mail className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-dark-700">メールアドレス</p>
                  <p className="text-sm text-dark-500">{user?.email}</p>
                </div>
              </div>
              <Button variant="outline" size="sm" className="scale-hover" disabled>
                変更
              </Button>
            </div>
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-wisdom-50 to-white rounded-xl border border-wisdom-100 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-dark-700">登録日</p>
                  <p className="text-sm text-dark-500">{createdAt}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-wisdom-50 to-white rounded-xl border border-wisdom-100 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg flex items-center justify-center">
                  <Shield className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-dark-700">パスワード</p>
                  <p className="text-sm text-dark-500">最終変更: 登録時</p>
                </div>
              </div>
              <Button variant="outline" size="sm" className="scale-hover" disabled>
                変更
              </Button>
            </div>
          </div>
        </div>

        {/* 通知設定 */}
        <div className="card-premium rounded-2xl p-8 mb-8 entrance-animation animate-delay-500">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-wisdom-400 to-wisdom-600 rounded-2xl flex items-center justify-center glow-accent">
              <Bell className="h-8 w-8 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gradient-premium">通知設定</h2>
              <p className="text-dark-600">リマインダーと通知の管理</p>
            </div>
          </div>
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-wisdom-50 to-white rounded-xl border border-wisdom-100 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg flex items-center justify-center">
                  <Mail className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-dark-700">学習リマインダー</p>
                  <p className="text-sm text-dark-500">週次でメール通知を送信</p>
                </div>
              </div>
              <Switch defaultChecked disabled className="data-[state=checked]:bg-wisdom-500" />
            </div>
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-wisdom-50 to-white rounded-xl border border-wisdom-100 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gradient-to-br from-red-400 to-red-600 rounded-lg flex items-center justify-center">
                  <Bell className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-dark-700">ブラウザ通知</p>
                  <p className="text-sm text-dark-500">デスクトップ通知を表示</p>
                </div>
              </div>
              <Switch disabled />
            </div>
          </div>
        </div>

        {/* アプリ設定 */}
        <div className="card-premium rounded-2xl p-8 mb-8 entrance-animation animate-delay-600">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-wisdom-400 to-wisdom-600 rounded-2xl flex items-center justify-center glow-accent">
              <Settings className="h-8 w-8 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gradient-premium">アプリ設定</h2>
              <p className="text-dark-600">アプリの動作設定</p>
            </div>
          </div>
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-wisdom-50 to-white rounded-xl border border-wisdom-100 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-400 to-indigo-600 rounded-lg flex items-center justify-center">
                  <Settings className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-dark-700">ダークモード</p>
                  <p className="text-sm text-dark-500">テーマを自動で切り替え</p>
                </div>
              </div>
              <Switch defaultChecked disabled className="data-[state=checked]:bg-wisdom-500" />
            </div>
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-wisdom-50 to-white rounded-xl border border-wisdom-100 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-teal-600 rounded-lg flex items-center justify-center">
                  <Zap className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-dark-700">オフライン同期</p>
                  <p className="text-sm text-dark-500">データをローカルに保存</p>
                </div>
              </div>
              <Switch defaultChecked disabled className="data-[state=checked]:bg-wisdom-500" />
            </div>
          </div>
        </div>

        {/* アクションボタン */}
        <div className="text-center entrance-animation animate-delay-700">
          <div className="card-premium rounded-2xl p-8 max-w-md mx-auto">
            <div className="w-16 h-16 bg-gradient-to-br from-red-400 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-6 glow-accent">
              <LogOut className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-dark-700 mb-4">アカウント管理</h3>
            <p className="text-dark-500 mb-6">セッションを終了してログアウトします</p>
            <Button 
              onClick={handleSignOut}
              disabled={isLoading}
              className="w-full btn-premium text-lg py-4"
              variant="destructive"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  ログアウト中...
                </>
              ) : (
                <>
                  <LogOut className="h-5 w-5 mr-2" />
                  ログアウト
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
} 