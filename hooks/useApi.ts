'use client';

import useSWR, { SWRConfiguration, mutate as swrMutate } from 'swr';
import { useCallback } from 'react';

// 默认 fetcher
const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || '请求失败');
  }
  return res.json();
};

// SWR 全局配置
export const swrConfig: SWRConfiguration = {
  fetcher,
  revalidateOnFocus: false,
  revalidateOnReconnect: true,
  dedupingInterval: 5000,  // 5秒内重复请求去重
  errorRetryCount: 3,
  errorRetryInterval: 5000, // 静态重试间隔
  onErrorRetry: (error, key, config, revalidate, { retryCount }) => {
    // 动态重试间隔：指数退避，最大30秒
    const timeout = Math.min(1000 * 2 ** retryCount, 30000);
    setTimeout(() => revalidate({ retryCount }), timeout);
  },
};

// 工具列表 Hook
export function useTools(options?: { category?: string; limit?: number }) {
  const params = new URLSearchParams();
  if (options?.category) params.set('category', options.category);
  if (options?.limit) params.set('limit', String(options.limit));
  
  const url = `/api/tools${params.toString() ? `?${params}` : ''}`;
  
  const { data, error, isLoading, mutate } = useSWR(
    url,
    fetcher,
    {
      ...swrConfig,
      revalidateOnFocus: false,
      refreshInterval: 60000,  // 1分钟自动刷新
    }
  );

  return {
    tools: data?.data || [],
    isLoading,
    isError: !!error,
    error,
    mutate,
    refresh: useCallback(() => mutate(), [mutate])
  };
}

// Skill 列表 Hook
export function useSkills(options?: { category?: string; limit?: number }) {
  const params = new URLSearchParams();
  if (options?.category) params.set('category', options.category);
  if (options?.limit) params.set('limit', String(options.limit));
  
  const url = `/api/skills${params.toString() ? `?${params}` : ''}`;
  
  const { data, error, isLoading, mutate } = useSWR(
    url,
    fetcher,
    {
      ...swrConfig,
      revalidateOnFocus: false,
      refreshInterval: 60000,
    }
  );

  return {
    skills: data?.data || [],
    isLoading,
    isError: !!error,
    error,
    mutate,
    refresh: useCallback(() => mutate(), [mutate])
  };
}

// 榜单数据 Hook
export function useLeaderboard(type: 'tools' | 'skills' = 'tools', limit: number = 10) {
  const url = `/api/leaderboard?type=${type}&limit=${limit}`;
  
  const { data, error, isLoading, mutate } = useSWR(
    url,
    fetcher,
    {
      ...swrConfig,
      refreshInterval: 30000,  // 30秒刷新（榜单数据变化较快）
    }
  );

  return {
    data: data?.data || [],
    isLoading,
    isError: !!error,
    error,
    mutate,
    refresh: useCallback(() => mutate(), [mutate])
  };
}

// 搜索 Hook（带防抖）
export function useSearch(query: string, type: 'all' | 'tools' | 'skills' = 'all') {
  const shouldFetch = query.length >= 1;
  const url = shouldFetch 
    ? `/api/search?q=${encodeURIComponent(query)}&type=${type}`
    : null;
  
  const { data, error, isLoading } = useSWR(
    url,
    fetcher,
    {
      ...swrConfig,
      dedupingInterval: 300,  // 300ms 防抖
    }
  );

  return {
    results: data?.data || { tools: [], skills: [] },
    isLoading,
    isError: !!error,
    error
  };
}

// 单个工具详情 Hook
export function useTool(id: string) {
  // 先尝试从列表缓存获取
  const { data: listData } = useSWR('/api/tools', fetcher, { revalidateOnFocus: false });
  
  const toolFromList = listData?.data?.find((t: any) => t.id === id);
  
  const { data, error, isLoading } = useSWR(
    toolFromList ? null : `/api/tools/${id}`,  // 如果列表中有，不发起请求
    fetcher,
    swrConfig
  );

  return {
    tool: toolFromList || data?.data,
    isLoading: !toolFromList && isLoading,
    isError: !!error,
    error
  };
}

// 全局刷新函数
export function refreshAll() {
  return swrMutate(
    (key) => typeof key === 'string' && key.startsWith('/api/')
  );
}

// 预加载数据
export function prefetch(url: string) {
  return swrMutate(url, fetcher(url));
}
