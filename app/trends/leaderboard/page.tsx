import Navbar from '@/components/Navbar';
import { Flame, Github, TrendingUp, BarChart3 } from 'lucide-react';
import type { Metadata } from 'next';
import leaderboardData from '@/data/leaderboard-data.json';

export const metadata: Metadata = {
  title: 'AI工具综合热度排行榜 | longxiaclub.com',
  description: '基于GitHub星标热度、ProductHunt投票热度、Google Trends搜索热度的AI工具综合排名，多维度计算AI关键词热度指数，每周更新。',
  openGraph: {
    title: 'AI工具综合热度排行榜 | longxiaclub.com',
    description: '综合 GitHub、ProductHunt、Google Trends 三大数据源的 AI 工具热度排名',
    url: 'https://longxiaclub.com/trends/leaderboard',
    type: 'website',
  },
};

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  name: '面包屑导航',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'AI导航站', item: 'https://longxiaclub.com' },
    { '@type': 'ListItem', position: 2, name: '趋势榜单', item: 'https://longxiaclub.com/trends' },
    { '@type': 'ListItem', position: 3, name: '综合热度榜', item: 'https://longxiaclub.com/trends/leaderboard' },
  ],
};

const itemListJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'AI工具综合热度排行榜',
  description: '基于GitHub星标、ProductHunt投票和Google Trends搜索热度的AI工具综合排名',
  url: 'https://longxiaclub.com/trends/leaderboard',
  numberOfItems: leaderboardData.leaderboard.length,
  itemListOrder: 'Descending',
};

function HeatBar({ value, maxValue, color }: { value: number; maxValue: number; color: string }) {
  const width = maxValue > 0 ? Math.round((value / maxValue) * 100) : 0;
  return (
    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
      <div
        className={`h-full rounded-full transition-all duration-500 ${color}`}
        style={{ width: `${width}%` }}
      />
    </div>
  );
}

function getRankColor(index: number): string {
  if (index === 0) return 'text-amber-500';
  if (index === 1) return 'text-slate-400';
  if (index === 2) return 'text-orange-600';
  return 'text-slate-500';
}

function getRankBadge(index: number): string {
  if (index === 0) return 'bg-amber-100 text-amber-700 border-amber-200';
  if (index === 1) return 'bg-slate-100 text-slate-600 border-slate-200';
  if (index === 2) return 'bg-orange-100 text-orange-700 border-orange-200';
  return 'bg-slate-50 text-slate-500 border-slate-100';
}

export default function LeaderboardPage() {
  const items = leaderboardData.leaderboard
    .filter(item => item.total_heat > 0)
    .sort((a, b) => b.total_heat - a.total_heat);

  const maxTotalHeat = items.length > 0 ? items[0].total_heat : 100;

  return (
    <main className="min-h-screen bg-slate-50 dot-pattern">
      <div className="fixed inset-0 bg-gradient-mint pointer-events-none" />
      <Navbar />

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
      />

      {/* Header */}
      <div className="relative pt-32 pb-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-orange-50 border border-orange-200 text-orange-700 text-sm font-medium mb-6">
              <Flame className="w-4 h-4" />
              <span>综合热度 · 多源聚合</span>
            </div>
            <h1 className="text-4xl font-bold text-slate-800 mb-4">
              综合热度排行榜
            </h1>
            <p className="text-slate-500 leading-relaxed">
              综合 GitHub 星标热度、ProductHunt 投票热度和 Google Trends 搜索热度，
              计算 AI 关键词的综合热度指数。
            </p>
          </div>

          {/* Data source info */}
          <div className="grid grid-cols-3 gap-4 mb-10 max-w-xl mx-auto">
            <div className="flex items-center justify-center space-x-2 px-4 py-3 rounded-xl bg-white border border-slate-200">
              <Github className="w-4 h-4 text-slate-600" />
              <span className="text-xs text-slate-500">GitHub 热度</span>
            </div>
            <div className="flex items-center justify-center space-x-2 px-4 py-3 rounded-xl bg-white border border-slate-200">
              <TrendingUp className="w-4 h-4 text-teal-600" />
              <span className="text-xs text-slate-500">PH 投票热度</span>
            </div>
            <div className="flex items-center justify-center space-x-2 px-4 py-3 rounded-xl bg-white border border-slate-200">
              <BarChart3 className="w-4 h-4 text-blue-600" />
              <span className="text-xs text-slate-500">Trends 热度</span>
            </div>
          </div>
        </div>
      </div>

      {/* Leaderboard Table */}
      <div className="relative pb-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            {/* Table Header */}
            <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-4 bg-slate-50 border-b border-slate-200 text-xs font-medium text-slate-500 uppercase tracking-wider">
              <div className="col-span-1 text-center">#</div>
              <div className="col-span-3">关键词</div>
              <div className="col-span-2 text-center">综合热度</div>
              <div className="col-span-2 text-center">
                <span className="flex items-center justify-center space-x-1">
                  <Github className="w-3 h-3" />
                  <span>GitHub</span>
                </span>
              </div>
              <div className="col-span-2 text-center">
                <span className="flex items-center justify-center space-x-1">
                  <TrendingUp className="w-3 h-3" />
                  <span>ProductHunt</span>
                </span>
              </div>
              <div className="col-span-2 text-center">
                <span className="flex items-center justify-center space-x-1">
                  <BarChart3 className="w-3 h-3" />
                  <span>Trends</span>
                </span>
              </div>
            </div>

            {/* Table Rows */}
            {items.map((item, index) => (
              <div
                key={item.keyword}
                className={`grid grid-cols-12 gap-4 px-6 py-5 items-center border-b border-slate-100 last:border-b-0 hover:bg-slate-50 transition-colors ${
                  index < 3 ? 'bg-gradient-to-r from-amber-50/30 via-transparent to-transparent' : ''
                }`}
              >
                {/* Rank */}
                <div className="col-span-1 flex justify-center">
                  <span className={`inline-flex items-center justify-center w-8 h-8 rounded-lg text-sm font-bold ${getRankBadge(index)}`}>
                    {index + 1}
                  </span>
                </div>

                {/* Keyword */}
                <div className="col-span-3">
                  <span className="font-semibold text-slate-800">{item.keyword}</span>
                </div>

                {/* Total Heat */}
                <div className="col-span-2 flex flex-col items-center space-y-1">
                  <span className={`text-lg font-bold ${getRankColor(index)}`}>
                    {item.total_heat}
                  </span>
                  <div className="w-full max-w-[80px]">
                    <HeatBar value={item.total_heat} maxValue={maxTotalHeat} color="bg-gradient-to-r from-orange-400 to-red-500" />
                  </div>
                </div>

                {/* GitHub Heat */}
                <div className="col-span-2 flex flex-col items-center space-y-1">
                  <span className="text-sm font-semibold text-slate-700">{item.github_heat}</span>
                  <div className="w-full max-w-[60px]">
                    <HeatBar value={item.github_heat} maxValue={maxTotalHeat} color="bg-slate-500" />
                  </div>
                </div>

                {/* PH Heat */}
                <div className="col-span-2 flex flex-col items-center space-y-1">
                  <span className="text-sm font-semibold text-teal-700">{item.ph_heat}</span>
                  <div className="w-full max-w-[60px]">
                    <HeatBar value={item.ph_heat} maxValue={maxTotalHeat} color="bg-teal-500" />
                  </div>
                </div>

                {/* Trends Heat */}
                <div className="col-span-2 flex flex-col items-center space-y-1">
                  <span className="text-sm font-semibold text-blue-700">{item.trends_heat}</span>
                  <div className="w-full max-w-[60px]">
                    <HeatBar value={item.trends_heat} maxValue={maxTotalHeat} color="bg-blue-500" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Footer info */}
          <div className="mt-8 text-center">
            <p className="text-sm text-slate-400">
              数据更新于 {new Date(leaderboardData.timestamp).toLocaleDateString('zh-CN')} · 
              数据来源：GitHub API, ProductHunt API, Google Trends · 
              {leaderboardData.summary.total_items} 个关键词
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
