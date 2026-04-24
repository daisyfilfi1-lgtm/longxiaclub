'use client';

import { useState, useEffect, useCallback, createContext, useContext } from 'react';
import {
  User,
  signIn,
  signUp,
  signOut,
  getCurrentUser,
  onAuthStateChange,
  signInWithProvider,
  resetPassword,
  updateProfile
} from '@/lib/auth';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (email: string, password: string, username?: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  signInWithGithub: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
  updateProfile: (updates: { username?: string; avatar_url?: string }) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 初始加载用户
    getCurrentUser().then(user => {
      setUser(user);
      setIsLoading(false);
    });

    // 监听认证状态变化
    const subscription = onAuthStateChange((user) => {
      setUser(user);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleSignIn = useCallback(async (email: string, password: string) => {
    const result = await signIn(email, password);
    if (result.success && result.user) {
      setUser(result.user);
    }
    return result;
  }, []);

  const handleSignUp = useCallback(async (email: string, password: string, username?: string) => {
    const result = await signUp(email, password, username);
    if (result.success && result.user) {
      setUser(result.user);
    }
    return result;
  }, []);

  const handleSignOut = useCallback(async () => {
    await signOut();
    setUser(null);
  }, []);

  const handleSignInWithGithub = useCallback(async () => {
    await signInWithProvider('github');
  }, []);

  const handleSignInWithGoogle = useCallback(async () => {
    await signInWithProvider('google');
  }, []);

  const handleResetPassword = useCallback(async (email: string) => {
    return resetPassword(email);
  }, []);

  const handleUpdateProfile = useCallback(async (updates: { username?: string; avatar_url?: string }) => {
    const result = await updateProfile(updates);
    if (result.success) {
      const user = await getCurrentUser();
      setUser(user);
    }
    return result;
  }, []);

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    signIn: handleSignIn,
    signUp: handleSignUp,
    signOut: handleSignOut,
    signInWithGithub: handleSignInWithGithub,
    signInWithGoogle: handleSignInWithGoogle,
    resetPassword: handleResetPassword,
    updateProfile: handleUpdateProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// 受保护组件包装器
export function withAuth<P extends object>(
  Component: React.ComponentType<P>,
  fallback?: React.ReactNode
) {
  return function ProtectedComponent(props: P) {
    const { user, isLoading } = useAuth();

    if (isLoading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      );
    }

    if (!user) {
      return fallback || (
        <div className="flex flex-col items-center justify-center min-h-screen">
          <p className="text-slate-500 mb-4">请先登录</p>
          <a href="/auth/login" className="text-teal-600 hover:underline">
            前往登录
          </a>
        </div>
      );
    }

    return <Component {...props} />;
  };
}
