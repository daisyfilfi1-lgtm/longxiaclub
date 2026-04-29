'use client';

import Link from 'next/link';
import { ArrowRight, Check, X as XIcon, Minus, Zap, Code, Brain, DollarSign, FileText, Database, Puzzle, Users, Shield, WifiOff, BarChart3, MessageSquare, Globe, Sparkles, Lightbulb, GraduationCap } from 'lucide-react';

type Winner = 'notion' | 'obsidian' | 'draw';

interface CompareItem {
  label: string;
  notion: string;
  obsidian: string;
  winner: Winner;
}

const comparisonData = {
  title: 'Notion AI vs Obsidian AI：2026年AI知识管理工具深度对比',
  subtitle: '两大AI知识管理工具全方位PK — 价格、AI功能、知识管理方式、插件生态全面横评',
  lastUpdated: '2026-04-29',
  items: [
    { label: '月费价格', notion: 'Notion AI $10/月（附加在Notion免费/付费版上）', obsidian: 'Obsidian免费 + AI插件按量计费（Catppuccin等）', winner: 'obsidian' as Winner },
    { label: 'AI功能深度', notion: '原生AI深度集成：写作/摘要/翻译/问答/数据库分析', obsidian: '社区AI插件：Copilot/Smart Connections等（需配置）', winner: 'notion' as Winner },
    { label: '知识管理方式', notion: '云端数据库+看板/表格/日历（结构化强）', obsidian: '本地Markdown文件+双向链接+图谱（灵活自由）', winner: 'draw' as Winner },
    { label: '插件生态', notion: 'Limited（连接器+模板库+API集成）', obsidian: '极其丰富（1500+社区插件，AI/图表/任务管理等）', winner: 'obsidian' as Winner },
    { label: '协作能力', notion: '强 — 实时协作+评论+分享+权限管理', obsidian: '弱 — 本地优先，需Obsidian Sync/第三方方案', winner: 'notion' as Winner },
    { label: '数据隐私', notion: '云端存储，数据在Notion服务器', obsidian: '极强 — 本地存储，用户完全掌控数据', winner: 'obsidian' as Winner },
    { label: '离线能力', notion: 'APP端离线缓存，功能受限', obsidian: '强 — 本地文件，完全离线可用', winner: 'obsidian' as Winner },
    { label: '学习曲线', notion: '低 — 上手快，拖拽式操作，界面友好', obsidian: '中高 — Markdown基础要求，插件配置需学习', winner: 'notion' as Winner },
    { label: '中文社区', notion: '活跃的中文社区 + 官方中文支持', obsidian: '非常活跃的中文社区 + 国内镜像加速', winner: 'draw' as Winner },
    { label: '适用场景', notion: '团队协作、项目管理、轻量数据库、All-in-one工作台', obsidian: '个人知识库(PKM)、笔记管理、日记、知识图谱', winner: 'draw' as Winner },
  ],
};

function WinnerBadge({ winner }: { winner: 'notion' | 'obsidian' | 'draw' }) {
  if (winner === 'notion') return <span className="text-xs px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 font-medium">✅ Notion</span>;
  if (winner === 'obsidian') return <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-400 font-medium">✅ Obsidian</span>;
  return <span className="text-xs px-2 py-0.5 rounded-full bg-slate-500/20 text-slate-400 font-medium">⚖️ 持平</span>;
}

function WinnerIcon({ winner }: { winner: 'notion' | 'obsidian' | 'draw' }) {
  if (winner === 'notion') return <Check className="w-4 h-4 text-red-400" />;
  if (winner === 'obsidian') return <Check className="w-4 h-4 text-purple-400" />;
  return <Minus className="w-4 h-4 text-slate-400" />;
}

export default function ComparePage() {
  const jsonLdBreadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'AI导航站', item: 'https://longxiaclub.com' },
      { '@type': 'ListItem', position: 2, name: '工具对比', item: 'https://longxiaclub.com/compare' },
      { '@type': 'ListItem', position: 3, name: 'Notion AI vs Obsidian AI', item: 'https://longxiaclub.com/compare/notion-vs-obsidian' },
    ],
  };

  const jsonLdFaq = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Notion AI和Obsidian AI哪个更便宜？',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Obsidian完全免费，AI功能通过社区插件实现（如Copilot插件按API用量计费）。Notion AI是$10/月的附加订阅，需要先有Notion账号（免费版可用）。长期来看，Obsidian的总体拥有成本更低。',
        },
      },
      {
        '@type': 'Question',
        name: 'Notion AI和Obsidian AI哪个更适合个人知识管理？',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Obsidian更适合个人知识管理（PKM）。它的本地Markdown存储、双向链接、知识图谱和丰富的社区插件生态，非常适合构建个人知识体系。Notion更适合团队协作和结构化数据库管理。',
        },
      },
      {
        '@type': 'Question',
        name: 'Notion AI和Obsidian AI的数据隐私哪个更好？',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Obsidian的数据隐私远优于Notion。Obsidian的笔记存储在本地Markdown文件中，用户完全掌控数据。Notion的数据存储在云端服务器上，虽然加密但用户不直接控制底层数据。',
        },
      },
    ],
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFaq) }} />

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 via-transparent to-purple-500/10 pointer-events-none" />
        <div className="max-w-6xl mx-auto px-4 py-20 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-4">
            <Link href="/" className="inline-flex items-center text-sm text-slate-400 hover:text-white transition-colors mb-6">
              <ArrowRight className="w-4 h-4 mr-1 rotate-180" />
              返回首页
            </Link>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-center mb-4">
            <span className="bg-gradient-to-r from-red-400 to-red-300 bg-clip-text text-transparent">Notion AI</span>
            <span className="text-slate-400 mx-3">VS</span>
            <span className="bg-gradient-to-r from-purple-400 to-purple-300 bg-clip-text text-transparent">Obsidian AI</span>
          </h1>
          <p className="text-slate-400 text-center text-lg max-w-2xl mx-auto mb-2">
            2026年AI知识管理工具深度对比 — 价格、AI功能、知识管理方式、插件生态全方位横评
          </p>
          <p className="text-slate-500 text-center text-sm">更新于 {comparisonData.lastUpdated}</p>

          {/* Quick Stats */}
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 text-center">
              <DollarSign className="w-8 h-8 mx-auto mb-2 text-purple-400" />
              <div className="text-2xl font-bold text-white">免费</div>
              <div className="text-sm text-slate-400">Obsidian核心功能完全免费</div>
            </div>
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 text-center">
              <Users className="w-8 h-8 mx-auto mb-2 text-red-400" />
              <div className="text-2xl font-bold text-white">团队协作</div>
              <div className="text-sm text-slate-400">Notion实时协作能力碾压Obsidian</div>
            </div>
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 text-center">
              <Puzzle className="w-8 h-8 mx-auto mb-2 text-purple-400" />
              <div className="text-2xl font-bold text-white">1500+</div>
              <div className="text-sm text-slate-400">Obsidian社区插件数量遥遥领先</div>
            </div>
          </div>
        </div>
      </div>

      {/* Comparison Table */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-xl overflow-hidden mb-12">
          <div className="grid grid-cols-12 gap-0">
            {/* Header */}
            <div className="col-span-12 grid grid-cols-12 border-b border-slate-700/50 bg-slate-800/50">
              <div className="col-span-4 sm:col-span-3 p-3 text-sm font-medium text-slate-500">对比维度</div>
              <div className="col-span-4 sm:col-span-3 p-3 text-sm font-medium">
                <span className="text-red-400">📝 Notion</span>
              </div>
              <div className="col-span-4 sm:col-span-3 p-3 text-sm font-medium">
                <span className="text-purple-400">💎 Obsidian</span>
              </div>
              <div className="hidden sm:block sm:col-span-3 p-3 text-xs text-slate-500 text-center">胜出方</div>
            </div>

            {/* Rows */}
            {comparisonData.items.map((item, i) => (
              <div key={i} className={`col-span-12 grid grid-cols-12 ${i < comparisonData.items.length - 1 ? 'border-b border-slate-700/30' : ''}`}>
                <div className="col-span-4 sm:col-span-3 p-3 text-sm text-slate-300 font-medium flex items-center">
                  {item.label}
                </div>
                <div className={`col-span-4 sm:col-span-3 p-3 text-sm text-slate-400 flex items-center ${item.winner === 'notion' ? 'bg-red-500/5' : ''}`}>
                  {item.notion}
                </div>
                <div className={`col-span-4 sm:col-span-3 p-3 text-sm text-slate-400 flex items-center ${item.winner === 'obsidian' ? 'bg-purple-500/5' : ''}`}>
                  {item.obsidian}
                </div>
                <div className="hidden sm:flex sm:col-span-3 p-3 items-center justify-center">
                  <WinnerBadge winner={item.winner} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Summary Cards */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <div className="bg-gradient-to-br from-red-500/10 to-red-500/5 border border-red-500/20 rounded-xl p-6">
            <h3 className="text-xl font-bold text-red-300 mb-1 flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              Notion AI 核心优势
            </h3>
            <ul className="mt-4 space-y-2">
              <li className="flex items-start gap-2 text-slate-300 text-sm">
                <Check className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                <span><strong>原生AI深度集成</strong>：写作/摘要/翻译/问答开箱即用</span>
              </li>
              <li className="flex items-start gap-2 text-slate-300 text-sm">
                <Check className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                <span><strong>实时团队协作</strong>：多人同时编辑、评论、权限管理</span>
              </li>
              <li className="flex items-start gap-2 text-slate-300 text-sm">
                <Check className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                <span><strong>数据库驱动</strong>：表格/看板/日历/时间线多种视图</span>
              </li>
              <li className="flex items-start gap-2 text-slate-300 text-sm">
                <Check className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                <span><strong>低学习成本</strong>：拖拽式操作，上手极快</span>
              </li>
            </ul>
          </div>
          <div className="bg-gradient-to-br from-purple-500/10 to-purple-500/5 border border-purple-500/20 rounded-xl p-6">
            <h3 className="text-xl font-bold text-purple-300 mb-1 flex items-center gap-2">
              <Zap className="w-5 h-5" />
              Obsidian AI 核心优势
            </h3>
            <ul className="mt-4 space-y-2">
              <li className="flex items-start gap-2 text-slate-300 text-sm">
                <Check className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
                <span><strong>完全免费</strong>：核心功能免费，AI插件按需付费</span>
              </li>
              <li className="flex items-start gap-2 text-slate-300 text-sm">
                <Check className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
                <span><strong>本地Markdown</strong>：纯文本文件，完全掌控数据</span>
              </li>
              <li className="flex items-start gap-2 text-slate-300 text-sm">
                <Check className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
                <span><strong>1500+插件生态</strong>：AI/图表/任务/日记/发布无所不包</span>
              </li>
              <li className="flex items-start gap-2 text-slate-300 text-sm">
                <Check className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
                <span><strong>双向链接+图谱</strong>：构建个人知识体系的最佳工具</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Scenario Recommendations */}
        <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-xl p-8 mb-12">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <Lightbulb className="w-6 h-6 text-yellow-400" />
            场景化推荐
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-2">
                <MessageSquare className="w-5 h-5 text-red-400" />
                <h3 className="text-lg font-bold text-white">选 Notion AI 的场景</h3>
              </div>
              <ul className="space-y-2 text-sm text-slate-300">
                <li className="flex items-start gap-2">• 团队协作知识库，需要多人实时编辑和权限管理</li>
                <li className="flex items-start gap-2">• 项目管理+文档+数据库一体化的All-in-one需求</li>
                <li className="flex items-start gap-2">• 希望开箱即用、无需配置复杂的AI功能</li>
                <li className="flex items-start gap-2">• 需要结构化数据管理（看板、表格、日历视图）</li>
                <li className="flex items-start gap-2">• 非技术团队成员，追求低学习成本</li>
              </ul>
            </div>
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-2">
                <Database className="w-5 h-5 text-purple-400" />
                <h3 className="text-lg font-bold text-white">选 Obsidian AI 的场景</h3>
              </div>
              <ul className="space-y-2 text-sm text-slate-300">
                <li className="flex items-start gap-2">• 个人知识管理(PKM)，构建第二大脑知识体系</li>
                <li className="flex items-start gap-2">• 数据隐私敏感，希望完全掌控自己的笔记数据</li>
                <li className="flex items-start gap-2">• 喜欢自定义和折腾，享受1500+插件的自由度</li>
                <li className="flex items-start gap-2">• 需要离线可用（飞机上/网络差的地方也能用）</li>
                <li className="flex items-start gap-2">• 预算有限，希望核心功能免费 + AI按需付费</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Final Verdict */}
        <div className="bg-gradient-to-br from-red-500/10 via-indigo-500/10 to-purple-500/10 border border-red-500/20 rounded-xl p-8">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-yellow-400" />
            最终结论
          </h2>
          <div className="space-y-4 text-slate-300 leading-relaxed">
            <p>
              <strong className="text-white">Notion AI</strong> 是2026年<strong className="text-red-300">团队协作和AI一体化的最佳选择</strong>。原生AI深度集成（写作/摘要/翻译/问答）、强大的数据库视图（看板/表格/日历）、实时多人协作、低学习成本，使Notion成为团队知识管理的首选。如果你需要的是一个All-in-one的团队工作台，Notion AI是最省心的方案。
            </p>
            <p>
              <strong className="text-white">Obsidian AI</strong> 是2026年<strong className="text-purple-300">个人知识管理和数据自主的最佳选择</strong>。完全免费（核心功能）、本地Markdown存储（数据完全自主）、1500+插件生态（无限扩展性）、双向链接知识图谱，使Obsidian成为个人知识管理（PKM）爱好者的终极工具。如果你追求的是数据自主、灵活性和长期知识体系的构建，Obsidian无可替代。
            </p>
          </div>
          <div className="mt-6 p-5 bg-slate-800/50 rounded-lg border border-slate-700/50">
            <p className="text-slate-400 text-sm">
              💡 <strong className="text-slate-300">综合建议：</strong>两者不冲突，最佳策略是<strong className="text-red-300">Notion</strong> + <strong className="text-purple-300">Obsidian</strong>组合使用。用Notion做团队协作和项目管理，用Obsidian做个人知识库和日记。Notion负责"对外协作"，Obsidian负责"对内思考"。如果只能选一个：团队用户选Notion，个人知识管理用户选Obsidian。
            </p>
          </div>
        </div>

        {/* Related Links */}
        <div className="mt-12 flex flex-wrap gap-4 justify-center">
          <Link
            href="/compare/perplexity-vs-gemini"
            className="inline-flex items-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-slate-300 hover:text-white transition-all"
          >
            ← Perplexity vs Gemini
          </Link>
          <Link
            href="/compare/claude-vs-chatgpt"
            className="inline-flex items-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-slate-300 hover:text-white transition-all"
          >
            ← Claude vs ChatGPT
          </Link>
          <Link
            href="/tools"
            className="inline-flex items-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-slate-300 hover:text-white transition-all"
          >
            浏览所有AI工具
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </main>
  );
}
