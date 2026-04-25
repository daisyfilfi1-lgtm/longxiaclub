'use client';

import { ArrowUpRight, Gem, Sparkles, TrendingUp, BookOpen, RefreshCw } from 'lucide-react';
import Link from 'next/link';

interface EvolutionEntry {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  category: 'content' | 'feature' | 'insight';
  date: string;
}

const evolutionEntries: EvolutionEntry[] = [
  {
    id: 'ev1',
    icon: <Gem className="w-4 h-4 text-emerald-500" />,
    title: '企业AI自动化场景上线',
    description: '新增企业AI自动化应用场景，覆盖客服、知识库、报告三大方案，推荐8款工具',
    category: 'content',
    date: '2026-04-23'
  },
  {
    id: 'ev2',
    icon: <Sparkles className="w-4 h-4 text-purple-500" />,
    title: '趋势排序功能上线',
    description: 'Leaderboard 新增趋势飙升/热度排行双维度切换，更快发现增长最快的 AI 工具',
    category: 'feature',
    date: '2026-04-23'
  },
  {
    id: 'ev3',
    icon: <BookOpen className="w-4 h-4 text-blue-500" />,
    title: '工具扩充至22款',
    description: '新增7款AI工具+50个实用Skill，覆盖视频生成、音乐创作、编程开发等领域',
    category: 'content',
    date: '2026-04-21'
  },
  {
    id: 'ev4',
    icon: <TrendingUp className="w-4 h-4 text-orange-500" />,
    title: 'Supabase 全量集成',
    description: '22工具+50Skill 写入 Supabase，API 数据源切换至实时数据库，响应速度提升3倍',
    category: 'feature',
    date: '2026-04-20'
  },
];

const categoryColors: Record<string, string> = {
  content: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  feature: 'bg-purple-100 text-purple-700 border-purple-200',
  insight: 'bg-blue-100 text-blue-700 border-blue-200',
};

const categoryLabels: Record<string, string> = {
  content: '内容进化',
  feature: '功能进化',
  insight: '洞见进化',
};

export default function EvolutionLog() {
  return (
    <section className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border border-slate-200 shadow-lg shadow-slate-100 overflow-hidden">
          {/* Header */}
          <div className="p-6 border-b border-slate-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center shadow-lg shadow-teal-100">
                  <RefreshCw className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-800">进化日志</h3>
                  <p className="text-sm text-slate-500">AI 导航站持续自进化 · 透明公开</p>
                </div>
              </div>
              <Link
                href="/evolution"
                className="p-2 rounded-xl bg-slate-50 text-slate-400 hover:text-teal-600 hover:bg-teal-50 transition-all"
              >
                <ArrowUpRight className="w-5 h-5" />
              </Link>
            </div>
          </div>

          {/* Timeline */}
          <div className="p-6">
            <div className="space-y-6">
              {evolutionEntries.map((entry, index) => (
                <div key={entry.id} className="relative pl-8">
                  {/* Timeline line */}
                  {index < evolutionEntries.length - 1 && (
                    <div className="absolute left-3 top-3 bottom-0 w-px bg-slate-200"></div>
                  )}
                  {/* Timeline dot */}
                  <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-white border-2 border-teal-200 flex items-center justify-center">
                    {entry.icon}
                  </div>
                  {/* Content */}
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="font-semibold text-slate-800">{entry.title}</h4>
                        <span className={`text-xs px-2 py-0.5 rounded-full border ${categoryColors[entry.category]}`}>
                          {categoryLabels[entry.category]}
                        </span>
                      </div>
                      <p className="text-sm text-slate-500">{entry.description}</p>
                    </div>
                    <span className="text-xs text-slate-400 whitespace-nowrap ml-4">{entry.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-slate-100">
            <Link
              href="/evolution"
              className="flex items-center justify-center space-x-2 text-sm text-slate-500 hover:text-teal-600 transition-colors"
            >
              <span>查看完整进化历程</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
