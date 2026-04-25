import Link from 'next/link';
import { RefreshCw, Gem, Sparkles, BookOpen, TrendingUp, ChevronLeft } from 'lucide-react';
import Navbar from '@/components/Navbar';

const allEntries = [
  {
    id: 'ev1',
    icon: '💎',
    title: '企业AI自动化场景上线',
    description: '新增企业AI自动化应用场景，覆盖智能客服、企业知识库、自动化报告三大解决方案，关联推荐8款AI工具',
    category: '内容进化',
    date: '2026-04-23',
    details: [
      '新增场景：企业AI自动化（用 🏢 图标）',
      '3套解决方案：智能客服、企业知识库、自动化报告',
      '8款工具打标：ChatGPT、Kimi、Claude、DeepSeek、通义千问、文心一言、Notion AI、Perplexity',
      '每日精选 dp8 上线'
    ]
  },
  {
    id: 'ev2',
    icon: '✨',
    title: 'Leaderboard 排序维度升级',
    description: '首页热门榜支持热度排行/趋势飙升双维度切换，用户可自由切换查看维度',
    category: '功能进化',
    date: '2026-04-23',
    details: [
      'API 新增 sort=heat|trending 参数',
      '工具榜：热度排行（按heat降序）↔ 趋势飙升（按heatGrowth降序）',
      'Skill榜：安装最多（按installCount降序）↔ 增长最快（按heatGrowth降序）',
      '前端 tab 切换组件，即时刷新数据'
    ]
  },
  {
    id: 'ev3',
    icon: '📚',
    title: '内容扩充：22款工具 + 50个Skill',
    description: '从8款工具扩充至22款，新增50个实用AI Skill，覆盖更多应用场景',
    category: '内容进化',
    date: '2026-04-21',
    details: [
      '工具从8款→22款，覆盖ChatGPT、Claude、Midjourney、Suno等主流AI',
      '新增50个Skill，按类别分层（DevOps、MLOps、数据科学等）',
      '所有工具/Skill添加了增强内容：使用技巧、实战案例、新手指南',
      '内容覆盖办公提效、内容创作、编程开发、设计创作等场景'
    ]
  },
  {
    id: 'ev4',
    icon: '📈',
    title: 'Supabase 全量集成',
    description: '完成数据库迁移，所有数据从静态JSON文件迁移至Supabase实时数据库',
    category: '功能进化',
    date: '2026-04-20',
    details: [
      '22款工具 + 50个Skill 写入 Supabase tools/skills 表',
      'API 数据源自动切换：优先 Supabase → 本地回退',
      'Netlify 环境变量配置 Supabase URL + Anon Key',
      '响应速度提升约3倍（数据库索引查询 vs JSON解析）'
    ]
  },
  {
    id: 'ev5',
    icon: '🔧',
    title: 'Lazy Supabase 客户端重构',
    description: '修复 Netlify 构建时 Supabase 环境变量缺失导致的构建崩溃',
    category: '功能进化',
    date: '2026-04-20',
    details: [
      '重构 lib/supabase.ts：从 eager singleton 改为 lazy init 模式',
      '新增 isSupabaseAvailable() 检查函数',
      'getSupabaseClient() 在环境变量缺失时返回 null 而非崩溃',
      '所有 API 路由用函数调用替代顶层 import'
    ]
  },
  {
    id: 'ev6',
    icon: '🗺️',
    title: 'SEO 基础优化完成',
    description: '添加 robots.txt、sitemap.xml、footerbar、差异化页面 title',
    category: '功能进化',
    date: '2026-04-19',
    details: [
      '配置 metadataBase 为 https://longxiaclub.com',
      '创建 robots.ts 实现 robots.txt（已通过 Google 验证）',
      '创建 sitemap.ts 生成 76 条 sitemap 记录（含所有详情页）',
      '各子页面差异化 title 和 description',
      '骨架屏超时优化：5秒自动停止加载状态'
    ]
  },
];

export default function EvolutionPage() {
  return (
    <main className="min-h-screen bg-slate-50 dot-pattern">
      <div className="fixed inset-0 bg-gradient-mint pointer-events-none" />
      <Navbar />
      
      <div className="relative pt-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Back */}
          <Link
            href="/"
            className="inline-flex items-center space-x-2 text-sm text-slate-500 hover:text-teal-600 transition-colors mb-8"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>返回首页</span>
          </Link>

          {/* Header */}
          <div className="flex items-center space-x-4 mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center shadow-lg shadow-teal-100">
              <RefreshCw className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-800">进化历程</h1>
              <p className="text-slate-500 mt-1">
                AI 导航站持续自我进化 · 每一次迭代都让网站变得更好
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-12">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 text-center">
              <div className="text-3xl font-bold bg-gradient-to-r from-teal-500 to-cyan-500 bg-clip-text text-transparent">6</div>
              <div className="text-sm text-slate-500 mt-1">进化事件</div>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200 p-6 text-center">
              <div className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">22</div>
              <div className="text-sm text-slate-500 mt-1">收录工具</div>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200 p-6 text-center">
              <div className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">50</div>
              <div className="text-sm text-slate-500 mt-1">收录Skill</div>
            </div>
          </div>

          {/* Timeline */}
          <div className="space-y-8">
            {allEntries.map((entry, index) => (
              <div key={entry.id} className="bg-white rounded-3xl border border-slate-200 shadow-lg shadow-slate-100 overflow-hidden">
                <div className="p-6">
                  <div className="flex items-start space-x-4">
                    {/* Icon */}
                    <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-2xl shrink-0">
                      {entry.icon}
                    </div>
                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-3">
                          <h2 className="text-lg font-bold text-slate-800">{entry.title}</h2>
                          <span className="text-xs px-2 py-0.5 rounded-full bg-teal-100 text-teal-700 border border-teal-200">
                            {entry.category}
                          </span>
                        </div>
                        <span className="text-sm text-slate-400">{entry.date}</span>
                      </div>
                      <p className="text-slate-600 mb-4">{entry.description}</p>
                      {/* Details */}
                      <ul className="space-y-2">
                        {entry.details.map((detail, i) => (
                          <li key={i} className="flex items-start space-x-2 text-sm text-slate-500">
                            <div className="w-1.5 h-1.5 rounded-full bg-teal-400 mt-1.5 shrink-0"></div>
                            <span>{detail}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
                {/* Timeline connector */}
                {index < allEntries.length - 1 && (
                  <div className="h-4 flex justify-center">
                    <div className="w-px h-full bg-slate-200"></div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Future */}
          <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-3xl border border-teal-200 p-8 mt-12 text-center">
            <RefreshCw className="w-8 h-8 text-teal-500 mx-auto mb-3" />
            <h2 className="text-xl font-bold text-slate-800 mb-2">进化在继续</h2>
            <p className="text-slate-600 max-w-md mx-auto">
              这个网站正在自我进化。每天通过 AI 日报收集新信息，自动扩充内容，优化体验。
              你正在见证一个自进化系统的成长。
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
