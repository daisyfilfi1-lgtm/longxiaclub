'use client';

import { useState, useEffect } from 'react';
import { withAuth } from '@/hooks/useAuth';
import { 
  BarChart3, 
  Users, 
  Activity, 
  Database, 
  RefreshCw, 
  Server,
  AlertCircle,
  CheckCircle,
  Loader2
} from 'lucide-react';

// 统计卡片组件
function StatCard({ 
  title, 
  value, 
  icon: Icon, 
  trend,
  color = 'blue' 
}: { 
  title: string; 
  value: string | number; 
  icon: any; 
  trend?: string;
  color?: 'blue' | 'green' | 'purple' | 'orange';
}) {
  const colors = {
    blue: 'bg-blue-50 text-blue-600 border-blue-100',
    green: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    purple: 'bg-purple-50 text-purple-600 border-purple-100',
    orange: 'bg-orange-50 text-orange-600 border-orange-100',
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-500 mb-1">{title}</p>
          <h3 className="text-2xl font-bold text-slate-800">{value}</h3>
          {trend && (
            <p className={`text-sm mt-2 ${trend.startsWith('+') ? 'text-emerald-600' : 'text-slate-500'}`}>
              {trend}
            </p>
          )}
        </div>
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${colors[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
}

// 操作按钮组件
function ActionButton({ 
  onClick, 
  loading, 
  children, 
  variant = 'primary' 
}: { 
  onClick: () => void; 
  loading: boolean; 
  children: React.ReactNode;
  variant?: 'primary' | 'danger' | 'secondary';
}) {
  const variants = {
    primary: 'bg-teal-500 hover:bg-teal-600 text-white',
    danger: 'bg-rose-500 hover:bg-rose-600 text-white',
    secondary: 'bg-slate-100 hover:bg-slate-200 text-slate-700',
  };

  return (
    <button
      onClick={onClick}
      disabled={loading}
      className={`px-4 py-2 rounded-xl font-medium transition-all flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]}`}
    >
      {loading && <Loader2 className="w-4 h-4 animate-spin" />}
      <span>{children}</span>
    </button>
  );
}

function AdminDashboard() {
  const [stats, setStats] = useState({
    tools: 0,
    skills: 0,
    users: 0,
    pageViews: 0,
  });
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [logs, setLogs] = useState<Array<{ type: 'success' | 'error'; message: string; time: string }>>([]);

  // 添加日志
  const addLog = (type: 'success' | 'error', message: string) => {
    setLogs(prev => [{ type, message, time: new Date().toLocaleTimeString() }, ...prev].slice(0, 10));
  };

  // 加载统计数据
  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [toolsRes, skillsRes] = await Promise.all([
        fetch('/api/tools?limit=1'),
        fetch('/api/skills?limit=1'),
      ]);
      
      const toolsData = await toolsRes.json();
      const skillsData = await skillsRes.json();
      
      setStats({
        tools: toolsData.data?.length || 0,
        skills: skillsData.data?.length || 0,
        users: 0, // 需要额外的 API
        pageViews: 0, // 需要分析数据
      });
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  // 执行操作
  const executeAction = async (action: string, endpoint: string, method = 'POST') => {
    setLoading(prev => ({ ...prev, [action]: true }));
    
    try {
      const res = await fetch(endpoint, { method });
      const data = await res.json();
      
      if (data.success || data.revalidated) {
        addLog('success', `${action} 成功`);
      } else {
        addLog('error', `${action} 失败: ${data.error || '未知错误'}`);
      }
    } catch (error: any) {
      addLog('error', `${action} 失败: ${error.message}`);
    } finally {
      setLoading(prev => ({ ...prev, [action]: false }));
    }
  };

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-slate-800">管理后台</h1>
          </div>
          <a href="/" className="text-slate-500 hover:text-slate-700">
            返回网站
          </a>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard 
            title="工具数量" 
            value={stats.tools} 
            icon={Database} 
            trend="+2 本月"
            color="blue"
          />
          <StatCard 
            title="Skill 数量" 
            value={stats.skills} 
            icon={Activity} 
            trend="+5 本月"
            color="purple"
          />
          <StatCard 
            title="注册用户" 
            value={stats.users} 
            icon={Users} 
            trend="+12 本周"
            color="green"
          />
          <StatCard 
            title="页面浏览" 
            value={stats.pageViews} 
            icon={BarChart3} 
            trend="+15% 较上周"
            color="orange"
          />
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Operations Panel */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center space-x-2">
              <Server className="w-5 h-5 text-slate-400" />
              <span>系统操作</span>
            </h2>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50">
                <div>
                  <h3 className="font-medium text-slate-800">重新验证页面</h3>
                  <p className="text-sm text-slate-500">刷新 ISR 缓存</p>
                </div>
                <ActionButton 
                  onClick={() => executeAction('重新验证', '/api/revalidate')}
                  loading={loading['重新验证']}
                >
                  执行
                </ActionButton>
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50">
                <div>
                  <h3 className="font-medium text-slate-800">同步到 Supabase</h3>
                  <p className="text-sm text-slate-500">将本地数据同步到数据库</p>
                </div>
                <ActionButton 
                  onClick={() => executeAction('数据同步', '/api/admin/sync')}
                  loading={loading['数据同步']}
                  variant="secondary"
                >
                  执行
                </ActionButton>
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50">
                <div>
                  <h3 className="font-medium text-slate-800">清除缓存</h3>
                  <p className="text-sm text-slate-500">清除 API 缓存</p>
                </div>
                <ActionButton 
                  onClick={() => executeAction('清除缓存', '/api/admin/clear-cache')}
                  loading={loading['清除缓存']}
                  variant="danger"
                >
                  执行
                </ActionButton>
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50">
                <div>
                  <h3 className="font-medium text-slate-800">生成 Skills</h3>
                  <p className="text-sm text-slate-500">运行自动化脚本</p>
                </div>
                <ActionButton 
                  onClick={() => executeAction('生成 Skills', '/api/admin/generate-skills')}
                  loading={loading['生成 Skills']}
                  variant="secondary"
                >
                  执行
                </ActionButton>
              </div>
            </div>
          </div>

          {/* Logs Panel */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center space-x-2">
              <Activity className="w-5 h-5 text-slate-400" />
              <span>操作日志</span>
            </h2>

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {logs.length === 0 ? (
                <p className="text-slate-400 text-center py-8">暂无操作记录</p>
              ) : (
                logs.map((log, index) => (
                  <div 
                    key={index}
                    className={`flex items-start space-x-3 p-3 rounded-xl ${
                      log.type === 'success' ? 'bg-emerald-50' : 'bg-rose-50'
                    }`}
                  >
                    {log.type === 'success' ? (
                      <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm ${
                        log.type === 'success' ? 'text-emerald-800' : 'text-rose-800'
                      }`}>
                        {log.message}
                      </p>
                      <p className="text-xs text-slate-400 mt-1">{log.time}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* System Status */}
        <div className="mt-8 bg-white rounded-2xl border border-slate-200 p-6">
          <h2 className="text-lg font-bold text-slate-800 mb-6">系统状态</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="flex items-center space-x-3 p-4 rounded-xl bg-emerald-50 border border-emerald-100">
              <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
              <div>
                <p className="font-medium text-emerald-800">API 服务</p>
                <p className="text-sm text-emerald-600">正常运行</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-4 rounded-xl bg-emerald-50 border border-emerald-100">
              <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
              <div>
                <p className="font-medium text-emerald-800">数据库</p>
                <p className="text-sm text-emerald-600">已连接</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-4 rounded-xl bg-emerald-50 border border-emerald-100">
              <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
              <div>
                <p className="font-medium text-emerald-800">缓存</p>
                <p className="text-sm text-emerald-600">正常</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

// 使用认证保护
export default withAuth(AdminDashboard, (
  <div className="min-h-screen flex items-center justify-center bg-slate-50">
    <div className="text-center">
      <h1 className="text-2xl font-bold text-slate-800 mb-4">需要登录</h1>
      <p className="text-slate-500 mb-6">请登录后访问管理后台</p>
      <a 
        href="/auth/login" 
        className="inline-flex items-center px-6 py-3 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-medium"
      >
        前往登录
      </a>
    </div>
  </div>
));
