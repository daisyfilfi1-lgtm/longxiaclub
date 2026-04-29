'use client';

import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { ArrowUpRight, GitCompare, BarChart3, Star, Zap } from 'lucide-react';

interface CompareItem {
  id: string;
  name: string;
  desc: string;
  href: string;
  color1: string;
  color2: string;
  gradient: string;
  badge: string;
  tag1: string;
  tag2: string;
  stats: string;
}

const compareItems: CompareItem[] = [
  {
    id: 'chatgpt-vs-deepseek',
    name: 'ChatGPT vs DeepSeek',
    desc: 'OpenAI 与 DeepSeek 旗舰模型的全面对决 — 价格差10倍、中文能力、代码能力、生态对比',
    href: '/compare/chatgpt-vs-deepseek/',
    color1: 'from-emerald-400 to-emerald-300',
    color2: 'from-violet-400 to-violet-300',
    gradient: 'from-emerald-500/10 via-transparent to-violet-500/10',
    badge: '最受欢迎',
    tag1: 'ChatGPT',
    tag2: 'DeepSeek',
    stats: 'API价格差10倍 · 上下文1M vs 128K',
  },
  {
    id: 'cursor-vs-copilot',
    name: 'Cursor vs GitHub Copilot',
    desc: '两大AI编程助手深度对比 — 智能程度、价格、IDE集成、代码生成质量哪家强？',
    href: '/compare/cursor-vs-copilot/',
    color1: 'from-purple-400 to-purple-300',
    color2: 'from-blue-400 to-blue-300',
    gradient: 'from-purple-500/10 via-transparent to-blue-500/10',
    badge: '开发者推荐',
    tag1: 'Cursor',
    tag2: 'Copilot',
    stats: '月活超千万 · 编程效率提升50%+',
  },
  {
    id: 'claude-vs-chatgpt',
    name: 'Claude vs ChatGPT',
    desc: 'Anthropic vs OpenAI — 长文本、代码、MCP生态、多模态全方位对比测评',
    href: '/compare/claude-vs-chatgpt/',
    color1: 'from-amber-400 to-amber-300',
    color2: 'from-emerald-400 to-emerald-300',
    gradient: 'from-amber-500/10 via-transparent to-emerald-500/10',
    badge: '热门对比',
    tag1: 'Claude',
    tag2: 'ChatGPT',
    stats: '200K vs 128K上下文 · 同为$20/月',
  },
  {
    id: 'perplexity-vs-gemini',
    name: 'Perplexity vs Google Gemini',
    desc: 'AI搜索引擎 vs 全能AI助手 — 搜索精度、实时信息、多模态能力的巅峰对决',
    href: '/compare/perplexity-vs-gemini/',
    color1: 'from-teal-400 to-teal-300',
    color2: 'from-blue-400 to-blue-300',
    gradient: 'from-teal-500/10 via-transparent to-blue-500/10',
    badge: '搜索王者',
    tag1: 'Perplexity',
    tag2: 'Gemini',
    stats: '实时搜索对决 · 多模态能力PK',
  },
  {
    id: 'notion-vs-obsidian',
    name: 'Notion AI vs Obsidian AI',
    desc: 'AI增强笔记工具巅峰对决 — AI写作、知识管理、插件生态全面对比',
    href: '/compare/notion-vs-obsidian/',
    color1: 'from-sky-400 to-sky-300',
    color2: 'from-orange-400 to-orange-300',
    gradient: 'from-sky-500/10 via-transparent to-orange-500/10',
    badge: '效率工具',
    tag1: 'Notion AI',
    tag2: 'Obsidian AI',
    stats: '双月活超500万 · AI笔记时代',
  },
];

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'AI导航站', item: 'https://longxiaclub.com' },
    { '@type': 'ListItem', position: 2, name: '工具对比', item: 'https://longxiaclub.com/compare' },
  ],
};

export default function CompareListPage() {
  return (
    <main className="min-h-screen bg-slate-50 dot-pattern">
      <div className="fixed inset-0 bg-gradient-mint pointer-events-none" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      <Navbar />

      {/* Header */}
      <div className="relative pt-32 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto">
            <div className="flex items-center justify-center mb-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center shadow-lg shadow-teal-200">
                <GitCompare className="w-7 h-7 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-slate-800 mb-4">工具对比</h1>
            <p className="text-slate-500">AI工具全方位PK，帮你找到最适合的那一个</p>
          </div>
        </div>
      </div>

      {/* Compare Cards Grid */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {compareItems.map((item, index) => (
            <Link
              key={item.id}
              href={item.href}
              className="group"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="relative overflow-hidden rounded-2xl bg-white border border-slate-200 hover:border-teal-300 hover:shadow-xl hover:shadow-teal-100 transition-all duration-300 hover:-translate-y-1">
                {/* Gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-teal-50/0 to-cyan-50/0 group-hover:from-teal-50 group-hover:to-cyan-50 transition-all duration-300" />

                {/* Top gradient banner */}
                <div className={`h-32 bg-gradient-to-br ${item.gradient} flex items-center justify-center relative overflow-hidden`}>
                  <div className="absolute inset-0 dot-pattern opacity-20" />
                  <div className="relative flex items-center gap-4">
                    <div className={`text-4xl font-bold bg-gradient-to-r ${item.color1} bg-clip-text text-transparent drop-shadow-lg`}>
                      {item.tag1}
                    </div>
                    <div className="text-2xl font-bold text-slate-400">VS</div>
                    <div className={`text-4xl font-bold bg-gradient-to-r ${item.color2} bg-clip-text text-transparent drop-shadow-lg`}>
                      {item.tag2}
                    </div>
                  </div>

                  {/* Badge */}
                  <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-medium bg-white/90 text-teal-700 border border-teal-200 shadow-sm">
                    {item.badge}
                  </div>
                </div>

                {/* Content */}
                <div className="relative p-6">
                  <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-teal-600 transition-colors">
                    {item.name}
                  </h3>
                  <p className="text-sm text-slate-500 mb-4">{item.desc}</p>

                  {/* Stats */}
                  <div className="flex items-center space-x-1.5 text-sm text-slate-500 mb-4 p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <BarChart3 className="w-4 h-4 text-teal-500" />
                    <span className="text-slate-600">{item.stats}</span>
                  </div>

                  {/* CTA */}
                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-sm text-slate-500 group-hover:text-teal-600 transition-colors">查看详细对比</span>
                    <ArrowUpRight className="w-5 h-5 text-slate-400 group-hover:text-teal-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
