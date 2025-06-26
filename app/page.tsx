"use client";

import { AuthButton } from "@/components/auth-button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useAuthRedirect } from "@/lib/hooks/use-auth-redirect";
import { GlowPills } from "@/components/landing/glow-pills";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen, Brain, Zap, Star, Crown } from "lucide-react";
import Link from "next/link";

export default function LandingPage() {
  const { isReady } = useAuthRedirect({ requireAuth: false });

  // ローディング中は基本的なローディング画面を表示
  if (!isReady) {
    return (
      <main className="min-h-screen bg-[#020202] flex items-center justify-center">
        <LoadingSpinner showLogo className="text-white" />
      </main>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* 背景グラデーション */}
      <div className="absolute inset-0 bg-gradient-to-br from-wisdom-50 via-white to-wisdom-100" />
      
      {/* グローピル背景 */}
      <GlowPills />
      
      {/* ナビゲーション */}
      <nav className="relative z-10 flex justify-between items-center p-6 lg:px-8">
        <div className="flex items-center space-x-2 entrance-animation">
          <Crown className="h-8 w-8 text-wisdom-400 animate-glow" />
          <span className="text-2xl font-bold text-gradient-premium">
            Wisdom Hub
          </span>
        </div>
        <div className="entrance-animation animate-delay-200">
          <AuthButton />
        </div>
      </nav>

      {/* メインコンテンツ */}
      <main className="relative z-10 container mx-auto px-6 pt-16 lg:pt-24">
        {/* ヒーローセクション */}
        <div className="text-center max-w-4xl mx-auto">
          {/* プレミアムバッジ */}
          <div className="inline-flex items-center space-x-2 bg-wisdom-50 border border-wisdom-200 rounded-full px-4 py-2 mb-8 entrance-animation animate-delay-100">
            <Star className="h-4 w-4 text-wisdom-400 animate-pulse" />
            <span className="text-sm font-medium text-wisdom-700">
              AI支援学習プラットフォーム
            </span>
            <Zap className="h-4 w-4 text-wisdom-400 animate-pulse" />
          </div>

          {/* メインタイトル */}
          <h1 className="text-5xl lg:text-7xl font-bold mb-8 entrance-animation animate-delay-200">
            <span className="text-gradient-premium">
              学びを
            </span>
            <br />
            <span className="text-gradient-premium">
              革新する
            </span>
          </h1>

          {/* サブタイトル */}
          <p className="text-xl lg:text-2xl text-dark-600 mb-12 max-w-2xl mx-auto leading-relaxed entrance-animation animate-delay-300">
            AIが支援する次世代学習プラットフォームで、
            <br className="hidden sm:block" />
            あなたの知識を体系化し、学習効率を最大化しましょう
          </p>

          {/* CTAボタン */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16 entrance-animation animate-delay-500">
            <Link href="/dashboard">
              <Button className="btn-premium text-white px-8 py-4 text-lg font-semibold group">
                今すぐ始める
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Button 
              variant="outline" 
              className="border-wisdom-300 text-wisdom-700 hover:bg-wisdom-50 px-8 py-4 text-lg scale-hover"
            >
              詳細を見る
            </Button>
          </div>
        </div>

        {/* 機能カード */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-24">
          <div className="card-premium rounded-2xl p-8 text-center floating entrance-animation animate-delay-300">
            <div className="w-16 h-16 bg-gradient-to-br from-wisdom-400 to-wisdom-600 rounded-2xl flex items-center justify-center mx-auto mb-6 glow-accent">
              <BookOpen className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-dark-700 mb-4">
              構造化学習
            </h3>
            <p className="text-dark-600 leading-relaxed">
              ワークスペース→ボックス→ブロックの階層構造で、知識を体系的に整理
            </p>
          </div>

          <div className="card-premium rounded-2xl p-8 text-center floating entrance-animation animate-delay-500" style={{ animationDelay: '1s' }}>
            <div className="w-16 h-16 bg-gradient-to-br from-wisdom-400 to-wisdom-600 rounded-2xl flex items-center justify-center mx-auto mb-6 glow-accent">
              <Brain className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-dark-700 mb-4">
              AI学習支援
            </h3>
            <p className="text-dark-600 leading-relaxed">
              高度なAIチャットボットがあなたの学習をリアルタイムでサポート
            </p>
          </div>

          <div className="card-premium rounded-2xl p-8 text-center floating entrance-animation animate-delay-700" style={{ animationDelay: '2s' }}>
            <div className="w-16 h-16 bg-gradient-to-br from-wisdom-400 to-wisdom-600 rounded-2xl flex items-center justify-center mx-auto mb-6 glow-accent">
              <Zap className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-dark-700 mb-4">
              進捗可視化
            </h3>
            <p className="text-dark-600 leading-relaxed">
              学習時間と進捗を自動追跡し、成長を可視化してモチベーション向上
            </p>
          </div>
        </div>

        {/* 最終CTA */}
        <div className="text-center pb-24">
          <div className="bg-gradient-to-r from-wisdom-400 to-wisdom-600 rounded-3xl p-12 max-w-4xl mx-auto card-premium entrance-animation animate-delay-300">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
              学習革命を体験しよう
            </h2>
            <p className="text-wisdom-100 text-lg mb-8 max-w-2xl mx-auto">
              今すぐWisdom Hubに参加して、AIと共に学ぶ新しい体験を始めませんか？
            </p>
            <Link href="/auth/sign-up">
              <Button className="bg-white text-wisdom-600 hover:bg-wisdom-50 px-10 py-4 text-lg font-semibold scale-hover shimmer">
                無料で始める
                <Crown className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
