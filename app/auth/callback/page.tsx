'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getAuthClient } from '@/lib/auth';

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    // 处理 OAuth 回调
    const client = getAuthClient();
    if (!client) {
      router.push('/?error=auth_unavailable');
      return;
    }
    client.auth.onAuthStateChange((event, _session) => {
      if (event === 'SIGNED_IN') {
        router.push('/');
      }
    });
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-slate-500">登录中...</p>
      </div>
    </div>
  );
}
