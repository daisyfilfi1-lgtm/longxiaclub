'use client';

import Link from 'next/link';
import { ArrowRight, Check, X as XIcon, Minus, Zap, Code, Brain, DollarSign, Terminal, GitBranch, Layers, Users, Sparkles, Lightbulb, BarChart3, Globe, Monitor } from 'lucide-react';

type Winner = 'cursor' | 'copilot' | 'draw';

interface CompareItem {
  label: string;
  cursor: string;
  copilot: string;
  winner: Winner;
}

const comparisonData = {
  title: 'Cursor vs GitHub Copilot：2026年AI编程工具深度对比',
  subtitle: '两大AI编程助手全方位PK — 价格、模型、代码理解、Tab补全、Agent能力全面对比',
  lastUpdated: '2026-04-29',
  items: [
    { label: '月费价格', cursor: 'Pro $20/月（无限补全+500次高级请求）', copilot: '个人 $10/月（有限补全+300次对话）', winner: 'copilot' as Winner },
    { label: '模型接入', cursor: '多模型：GPT-4o/Claude Sonnet/DeepSeek/自研模型', copilot: 'GPT-4独占（Copilot Chat）', winner: 'cursor' as Winner },
    { label: '代码理解深度', cursor: '全项目索引 + 多文件语义理解 + AST解析', copilot: '基于GitHub上下文 + 当前文件理解', winner: 'cursor' as Winner },
    { label: 'Tab补全准确率', cursor: '约58%（基于多模型融合，持续提升中）', copilot: '约68%（深耕补全多年，精准度领先）', winner: 'copilot' as Winner },
    { label: '上下文管理', cursor: '@file/@folder/@web 智能引用 + Composer全局上下文', copilot: '文件引用 + 最近编辑历史', winner: 'cursor' as Winner },
    { label: 'Agent模式', cursor: '原生Agent模式：自动读取文件/终端/浏览器预览', copilot: 'Copilot Agent（2026新加入，能力有限）', winner: 'cursor' as Winner },
    { label: '多文件编辑', cursor: 'Composer：一次Prompt修改多个文件，智能联动', copilot: '逐文件编辑，需手动切换', winner: 'cursor' as Winner },
    { label: 'Rules定制', cursor: '.cursorrules + 项目级规则模板生态', copilot: '.github/copilot-instructions.md', winner: 'cursor' as Winner },
    { label: '集成编辑器', cursor: '基于VS Code深度定制（独立编辑器）', copilot: 'VS Code / JetBrains / 其他编辑器插件', winner: 'copilot' as Winner },
    { label: '适用场景', cursor: '重度AI编程用户、全栈开发、Agent工作流', copilot: '轻量补全、日常编码、多IDE环境', winner: 'draw' as Winner },
  ],
};

function WinnerBadge({ winner }: { winner: 'cursor' | 'copilot' | 'draw' }) {
  if (winner === 'cursor') return <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 font-medium">✅ Cursor</span>;
  if (winner === 'copilot') return <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-medium">✅ Copilot</span>;
  return <span className="text-xs px-2 py-0.5 rounded-full bg-slate-500/20 text-slate-400 font-medium">⚖️ 持平</span>;
}

function WinnerIcon({ winner }: { winner: 'cursor' | 'copilot' | 'draw' }) {
  if (winner === 'cursor') return <Check className="w-4 h-4 text-blue-400" />;
  if (winner === 'copilot') return <Check className="w-4 h-4 text-emerald-400" />;
  return <Minus className="w-4 h-4 text-slate-400" />;
}

export default function ComparePage() {
  const jsonLdBreadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'AI导航站', item: 'https://longxiaclub.com' },
      { '@type': 'ListItem', position: 2, name: '工具对比', item: 'https://longxiaclub.com/compare' },
      { '@type': 'ListItem', position: 3, name: 'Cursor vs GitHub Copilot', item: 'https://longxiaclub.com/compare/cursor-vs-copilot' },
    ],
  };

  const jsonLdFaq = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Cursor和GitHub Copilot哪个更便宜？',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'GitHub Copilot个人版$10/月更便宜，但Cursor Pro $20/月提供更多高级功能如多模型接入、Agent模式和Composer多文件编辑。',
        },
      },
      {
        '@type': 'Question',
        name: 'Cursor和GitHub Copilot在代码补全上谁更强？',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'GitHub Copilot的Tab补全准确率约68%，略高于Cursor的约58%。Copilot深耕补全领域多年，精准度仍然领先。',
        },
      },
      {
        '@type': 'Question',
        name: 'AI编程新手应该选Cursor还是Copilot？',
        acceptedAnswer: {
          '@type': 'Answer',
          text: '轻量用户和跨IDE开发者建议选GitHub Copilot（$10/月，插件化）。重度AI编程用户和追求Agent工作流建议选Cursor（$20/月，多模型+Composer）。',
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
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-emerald-500/10 pointer-events-none" />
        <div className="max-w-6xl mx-auto px-4 py-20 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-4">
            <Link href="/" className="inline-flex items-center text-sm text-slate-400 hover:text-white transition-colors mb-6">
              <ArrowRight className="w-4 h-4 mr-1 rotate-180" />
              返回首页
            </Link>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-center mb-4">
            <span className="bg-gradient-to-r from-blue-400 to-blue-300 bg-clip-text text-transparent">Cursor</span>
            <span className="text-slate-400 mx-3">VS</span>
            <span className="bg-gradient-to-r from-emerald-400 to-emerald-300 bg-clip-text text-transparent">GitHub Copilot</span>
          </h1>
          <p className="text-slate-400 text-center text-lg max-w-2xl mx-auto mb-2">
            2026年AI编程工具深度对比 — 价格、模型、Agent能力、补全准确率全方位横评
          </p>
          <p className="text-slate-500 text-center text-sm">更新于 {comparisonData.lastUpdated}</p>

          {/* Quick Stats */}
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 text-center">
              <DollarSign className="w-8 h-8 mx-auto mb-2 text-emerald-400" />
              <div className="text-2xl font-bold text-white">2x 价差</div>
              <div className="text-sm text-slate-400">Copilot $10/月 vs Cursor $20/月</div>
            </div>
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 text-center">
              <Users className="w-8 h-8 mx-auto mb-2 text-blue-400" />
              <div className="text-2xl font-bold text-white">10M+</div>
              <div className="text-sm text-slate-400">Copilot全球用户量领先</div>
            </div>
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 text-center">
              <Zap className="w-8 h-8 mx-auto mb-2 text-blue-400" />
              <div className="text-2xl font-bold text-white">7/10</div>
              <div className="text-sm text-slate-400">Cursor Agent + 多模型优势项</div>
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
                <span className="text-blue-400 cursor-logo">🧩 Cursor</span>
              </div>
              <div className="col-span-4 sm:col-span-3 p-3 text-sm font-medium">
                <span className="text-emerald-400 copilot-logo">🤖 Copilot</span>
              </div>
              <div className="hidden sm:block sm:col-span-3 p-3 text-xs text-slate-500 text-center">胜出方</div>
            </div>

            {/* Rows */}
            {comparisonData.items.map((item, i) => (
              <div key={i} className={`col-span-12 grid grid-cols-12 ${i < comparisonData.items.length - 1 ? 'border-b border-slate-700/30' : ''}`}>
                <div className="col-span-4 sm:col-span-3 p-3 text-sm text-slate-300 font-medium flex items-center">
                  {item.label}
                </div>
                <div className={`col-span-4 sm:col-span-3 p-3 text-sm text-slate-400 flex items-center ${item.winner === 'cursor' ? 'bg-blue-500/5' : ''}`}>
                  {item.cursor}
                </div>
                <div className={`col-span-4 sm:col-span-3 p-3 text-sm text-slate-400 flex items-center ${item.winner === 'copilot' ? 'bg-emerald-500/5' : ''}`}>
                  {item.copilot}
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
          <div className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 border border-blue-500/20 rounded-xl p-6">
            <h3 className="text-xl font-bold text-blue-300 mb-1 flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              Cursor 核心优势
            </h3>
            <ul className="mt-4 space-y-2">
              <li className="flex items-start gap-2 text-slate-300 text-sm">
                <Check className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                <span><strong>多模型接入</strong>：GPT-4o / Claude / DeepSeek 自由切换</span>
              </li>
              <li className="flex items-start gap-2 text-slate-300 text-sm">
                <Check className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                <span><strong>Agent原生能力</strong>：自动读写文件、运行终端命令、预览效果</span>
              </li>
              <li className="flex items-start gap-2 text-slate-300 text-sm">
                <Check className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                <span><strong>Composer多文件编辑</strong>：一次Prompt联动修改多个文件</span>
              </li>
              <li className="flex items-start gap-2 text-slate-300 text-sm">
                <Check className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                <span><strong>深度代码理解</strong>：全项目索引 + AST解析 + 智能引用</span>
              </li>
            </ul>
          </div>
          <div className="bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 border border-emerald-500/20 rounded-xl p-6">
            <h3 className="text-xl font-bold text-emerald-300 mb-1 flex items-center gap-2">
              <Zap className="w-5 h-5" />
              GitHub Copilot 核心优势
            </h3>
            <ul className="mt-4 space-y-2">
              <li className="flex items-start gap-2 text-slate-300 text-sm">
                <Check className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                <span><strong>价格更亲民</strong>：$10/月，仅为Cursor的一半</span>
              </li>
              <li className="flex items-start gap-2 text-slate-300 text-sm">
                <Check className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                <span><strong>Tab补全精准</strong>：深耕多年，补全准确率和体验行业领先</span>
              </li>
              <li className="flex items-start gap-2 text-slate-300 text-sm">
                <Check className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                <span><strong>跨IDE支持</strong>：VS Code / JetBrains / 其他编辑器均可使用</span>
              </li>
              <li className="flex items-start gap-2 text-slate-300 text-sm">
                <Check className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                <span><strong>Git生态集成</strong>：无缝对接GitHub PR、Issue、Code Review</span>
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
                <Code className="w-5 h-5 text-blue-400" />
                <h3 className="text-lg font-bold text-white">选 Cursor 的场景</h3>
              </div>
              <ul className="space-y-2 text-sm text-slate-300">
                <li className="flex items-start gap-2">• 重度AI编程用户，每天使用AI辅助超过4小时</li>
                <li className="flex items-start gap-2">• 需要Agent工作流（自动读文件/写代码/运行测试）</li>
                <li className="flex items-start gap-2">• 全栈开发，需要一次性修改多个关联文件</li>
                <li className="flex items-start gap-2">• 想自由切换GPT-4o/Claude/DeepSeek等模型</li>
                <li className="flex items-start gap-2">• 愿意为深度代码理解支付更高价格</li>
              </ul>
            </div>
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-2">
                <Terminal className="w-5 h-5 text-emerald-400" />
                <h3 className="text-lg font-bold text-white">选 Copilot 的场景</h3>
              </div>
              <ul className="space-y-2 text-sm text-slate-300">
                <li className="flex items-start gap-2">• 轻量编程辅助，主要用Tab补全和内联建议</li>
                <li className="flex items-start gap-2">• 跨IDE用户，需要在VS Code/JetBrains间切换</li>
                <li className="flex items-start gap-2">• 预算敏感的独立开发者（$10/月更友好）</li>
                <li className="flex items-start gap-2">• 深度使用GitHub生态（PR/Issue/Actions）</li>
                <li className="flex items-start gap-2">• 追求补全准确率，信任微软/OpenAI的模型能力</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Final Verdict */}
        <div className="bg-gradient-to-br from-blue-500/10 via-indigo-500/10 to-emerald-500/10 border border-blue-500/20 rounded-xl p-8">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-yellow-400" />
            最终结论
          </h2>
          <div className="space-y-4 text-slate-300 leading-relaxed">
            <p>
              <strong className="text-white">Cursor</strong> 是2026年AI编程工具的<strong className="text-blue-300">功能天花板</strong>。多模型接入（GPT-4o/Claude/DeepSeek）、原生Agent模式、Composer多文件编辑、深度代码理解，这些能力使它成为重度AI编程用户和全栈开发者的首选。缺点是价格是Copilot的两倍，且Tab补全准确率还有提升空间。
            </p>
            <p>
              <strong className="text-white">GitHub Copilot</strong> 是2026年AI编程工具的<strong className="text-emerald-300">性价比之王</strong>。$10/月的亲民价格、行业领先的Tab补全体验、跨IDE无缝使用、深度Git生态集成，让它在主流开发者群体中拥有最大的用户基盘。Agent能力是新加入的功能，但已经展现了追赶的势头。
            </p>
          </div>
          <div className="mt-6 p-5 bg-slate-800/50 rounded-lg border border-slate-700/50">
            <p className="text-slate-400 text-sm">
              💡 <strong className="text-slate-300">综合建议：</strong>如果预算允许且追求极致AI开发体验，<strong className="text-blue-300">Cursor</strong>是更优选。如果价格敏感或多IDE使用，<strong className="text-emerald-300">GitHub Copilot</strong>更具性价比。很多高级开发者选择<strong className="text-slate-200">两者兼用</strong>：Cursor作为主力开发环境，Copilot在JetBrains等非VS Code环境中作为补充。
            </p>
          </div>
        </div>

        {/* Related Links */}
        <div className="mt-12 flex flex-wrap gap-4 justify-center">
          <Link
            href="/compare/chatgpt-vs-deepseek"
            className="inline-flex items-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-slate-300 hover:text-white transition-all"
          >
            ← ChatGPT vs DeepSeek
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
