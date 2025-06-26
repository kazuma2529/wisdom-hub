"use client";

import { useEffect, useState } from "react";

/**
 * クライアントサイドでのマウント状態を管理するフック
 * SSR/CSR ハイドレーション問題を解決するために使用
 */
export function useMount() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return isMounted;
} 