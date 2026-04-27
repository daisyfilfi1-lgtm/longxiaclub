/**
 * 用户认证工具
 * 基于 Supabase Auth
 */

import { createClient } from '@supabase/supabase-js';
import type { SupabaseClient } from '@supabase/supabase-js';

let _authClient: SupabaseClient | null = null;

export function getAuthClient(): SupabaseClient | null {
  if (_authClient) return _authClient;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
  if (!supabaseUrl || !supabaseKey) {
    console.warn('Supabase auth not configured. Auth features disabled.');
    return null;
  }
  _authClient = createClient(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  });
  return _authClient;
}

// 用户类型
export interface User {
  id: string;
  email: string;
  username?: string;
  avatar_url?: string;
  created_at: string;
}

// 认证响应
export interface AuthResponse {
  success: boolean;
  user?: User;
  error?: string;
}

// 注册
export async function signUp(email: string, password: string, username?: string): Promise<AuthResponse> {
  try {
    const client = getAuthClient();
    if (!client) return { success: false, error: '认证服务未配置' };

    const { data, error } = await client.auth.signUp({
      email,
      password,
      options: {
        data: {
          username: username || email.split('@')[0],
        }
      }
    });

    if (error) throw error;

    if (data.user) {
      return {
        success: true,
        user: {
          id: data.user.id,
          email: data.user.email!,
          username: data.user.user_metadata?.username,
          created_at: data.user.created_at,
        }
      };
    }

    return { success: false, error: '注册失败' };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// 登录
export async function signIn(email: string, password: string): Promise<AuthResponse> {
  try {
    const client = getAuthClient();
    if (!client) return { success: false, error: '认证服务未配置' };

    const { data, error } = await client.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    if (data.user) {
      return {
        success: true,
        user: {
          id: data.user.id,
          email: data.user.email!,
          username: data.user.user_metadata?.username,
          avatar_url: data.user.user_metadata?.avatar_url,
          created_at: data.user.created_at,
        }
      };
    }

    return { success: false, error: '登录失败' };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// 第三方登录
export async function signInWithProvider(provider: 'github' | 'google') {
  const client = getAuthClient();
  if (!client) return { data: null, error: { name: 'AuthNotConfigured', message: '认证服务未配置', status: 503 } };

  const { data, error } = await client.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    }
  });

  return { data, error };
}

// 登出
export async function signOut(): Promise<{ success: boolean; error?: string }> {
  try {
    const client = getAuthClient();
    if (!client) return { success: false, error: '认证服务未配置' };

    const { error } = await client.auth.signOut();
    if (error) throw error;
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// 获取当前用户
export async function getCurrentUser(): Promise<User | null> {
  try {
    const client = getAuthClient();
    if (!client) return null;

    const { data: { user }, error } = await client.auth.getUser();
    
    if (error || !user) return null;

    return {
      id: user.id,
      email: user.email!,
      username: user.user_metadata?.username,
      avatar_url: user.user_metadata?.avatar_url,
      created_at: user.created_at,
    };
  } catch {
    return null;
  }
}

// 监听认证状态变化
export function onAuthStateChange(callback: (user: User | null) => void) {
  const client = getAuthClient();
  if (!client) return { unsubscribe: () => {} };

  const { data: { subscription } } = client.auth.onAuthStateChange(
    async (event, session) => {
      if (session?.user) {
        callback({
          id: session.user.id,
          email: session.user.email!,
          username: session.user.user_metadata?.username,
          avatar_url: session.user.user_metadata?.avatar_url,
          created_at: session.user.created_at,
        });
      } else {
        callback(null);
      }
    }
  );

  return subscription;
}

// 重置密码
export async function resetPassword(email: string): Promise<{ success: boolean; error?: string }> {
  try {
    const client = getAuthClient();
    if (!client) return { success: false, error: '认证服务未配置' };

    const { error } = await client.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });
    
    if (error) throw error;
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// 更新用户资料
export async function updateProfile(updates: { username?: string; avatar_url?: string }) {
  try {
    const client = getAuthClient();
    if (!client) return { success: false, error: '认证服务未配置' };

    const { error } = await client.auth.updateUser({
      data: updates
    });
    
    if (error) throw error;
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
