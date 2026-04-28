import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { Flame, TrendingUp, Github, ArrowRight } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI工具趋势榜单 | longxiaclub.com',
  description: '基于GitHub星标、ProductHunt投票和Google Trends的AI工具实时热度排名，发现最前沿的AI技术趋势，追踪AI行业动态。',
  openGraph: {
    title: 'AI工具趋势榜单 | longxiaclub.com',
    description: '基于GitHub星标、ProductHunt投票和Google Trends的AI工具实时热度排名',
    url: 'https://longxiaclub.com/trends',
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
  ],
};

const cards = [
  {
    href: '/trends/leaderboard',
    title: '综合热度榜',
    description: '综合 GitHub 星标、ProductHunt 投票和 Google Trends 搜索热度，计算 AI 关键词的综合热度排名。',
    icon: Flame,
    gradient: 'from-orange-400 to-red-500',
    bgGradient: 'from-orange-50 to-red-50',
    borderColor: 'border-orange-200',
    hoverBorder: 'group-hover:border-orange-300',
  },
  {
    href: '/trends/producthunt',
    title: 'ProductHunt 新品榜',
    description: '来自 ProductHunt 的最新 AI 产品，按投票数排序，发现本周最受欢迎的 AI 创新产品。',
    icon: TrendingUp,
    gradient: 'from-teal-400 to-cyan-500',
    bgGradient: 'from-teal-50 to-cyan-50',
    borderColor: 'border-teal-200',
    hoverBorder: 'group-hover:border-teal-300',
  },
  {
    href: '/trends/github',
    title: 'GitHub 热门项目',
    description: 'GitHub 上最受关注的 AI 开源项目，按星标数排名，追踪开源 AI 技术的最新进展。',
    icon: Github,
    gradient: 'from-slate-600 to-slate-800',
    bgGradient: 'from-slate-50 to-slate-100',
    borderColor: 'border-slate-200',
    hoverBorder: 'group-hover:border-slate-400',
  },
];

export default function TrendsPage() {
  return (
    <main className="min-h-screen bg-slate-50 dot-pattern">
      <div className="fixed inset-0 bg-gradient-mint pointer-events-none" />
      <Navbar />

      {/* BreadcrumbList JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      {/* Header */}
      <div className="relative pt-32 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-teal-50 border border-teal-200 text-teal-700 text-sm font-medium mb-6">
              <Flame className="w-4 h-4" />
              <span>实时数据 · 多源聚合</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">
              AI工具<em className="not-italic gradient-text">趋势榜单</em>
            </h1>
            <p className="text-lg text-slate-500 leading-relaxed">
              基于 GitHub 星标、ProductHunt 投票和 Google Trends 搜索热度的 AI 工具实时排名，
              帮助你发现最前沿的 AI 技术趋势。
            </p>
          </div>

          {/* Cards Grid */}
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {cards.map((card) => (
              <Link
                key={card.href}
                href={card.href}
                className={`group relative p-8 rounded-2xl bg-white border ${card.borderColor} ${card.hoverBorder} hover:shadow-lg transition-all duration-300 hover:-translate-y-1 flex flex-col`}
              >
                {/* Icon */}
                <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${card.gradient} text-white mb-5 w-fit shadow-lg`}>
                  <card.icon className="w-6 h-6" />
                </div>

                {/* Title */}
                <h2 className="text-xl font-bold text-slate-800 mb-3 group-hover:text-teal-600 transition-colors">
                  {card.title}
                </h2>

                {/* Description */}
                <p className="text-sm text-slate-500 leading-relaxed flex-1 mb-6">
                  {card.description}
                </p>

                {/* CTA */}
                <div className="flex items-center text-sm font-medium text-teal-600 group-hover:text-teal-700 transition-colors">
                  <span>查看榜单</span>
                  <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>

                {/* Hover background */}
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${card.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10`} />
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Data source note */}
      <div className="relative pb-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm text-slate-400">
            数据来源：GitHub API · ProductHunt API · Google Trends · 每日自动更新
          </p>
        </div>
      </div>
    </main>
  );
}
