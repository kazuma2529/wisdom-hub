"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GlowPills } from "./glow-pills";
import { BookOpen, ArrowRight } from "lucide-react";

export function Hero() {
  return (
    <section className="relative isolate flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#020202] text-white">
      {/* 背景のブラー効果 */}
      <div className="absolute inset-0 bg-gradient-radial from-gray-900/20 via-transparent to-transparent" />
      
      {/* グローピル */}
      <GlowPills />
      
      {/* メインコンテンツ */}
      <div className="relative z-10 flex flex-col items-center text-center px-4 max-w-6xl mx-auto">
        {/* ロゴバッジ */}
        <Badge className="mb-8 bg-purple-500/10 text-purple-200 border-purple-500/20 hover:bg-purple-500/20 transition-colors duration-300">
          <div className="w-2 h-2 bg-purple-400 rounded-full mr-2 animate-pulse" />
          Wisdom-Hub
        </Badge>

        {/* メイン見出し */}
        <h1 className="font-bold leading-tight mb-6">
          <span className="block text-5xl sm:text-6xl md:text-8xl text-white">
            Elevate Your
          </span>
          <span className="block text-5xl sm:text-6xl md:text-8xl text-gradient">
            Learning Journey
          </span>
        </h1>

        {/* サブコピー */}
        <p className="mt-6 max-w-2xl text-lg sm:text-xl text-gray-300 leading-relaxed">
          AIとあなたの知識で、学びを再発明するパーソナル・ナレッジツール。
          ワークスペース、ボックス、ブロックで体系的に学習内容を整理し、
          AIチャットボットがあなたの学習をサポートします。
        </p>

        {/* CTA */}
        <div className="mt-12 flex flex-col sm:flex-row gap-4">
          <Button 
            size="lg" 
            className="bg-white text-black hover:bg-gray-100 transition-all duration-300 transform hover:scale-105"
            asChild
          >
            <Link href="/auth/sign-up" className="flex items-center gap-2">
              無料で始める
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          
          <Button 
            variant="outline" 
            size="lg"
            className="border-gray-600 text-gray-300 hover:bg-gray-800 transition-all duration-300"
            asChild
          >
            <Link href="/dashboard" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              デモを見る
            </Link>
          </Button>
        </div>

        {/* 追加情報 */}
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-3xl">
          <div className="text-center">
            <div className="text-2xl font-bold text-white mb-2">∞</div>
            <div className="text-gray-400">無制限のワークスペース</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-white mb-2">🤖</div>
            <div className="text-gray-400">AI学習アシスタント</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-white mb-2">📊</div>
            <div className="text-gray-400">進捗の可視化</div>
          </div>
        </div>
      </div>
    </section>
  );
} 