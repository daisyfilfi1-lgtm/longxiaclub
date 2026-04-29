'use client';

import Link from 'next/link';
import { ArrowRight, Check, X as XIcon, Minus, Zap, Code, Brain, DollarSign, Search, Globe, Clock, Camera, FileText, MessageSquare, Languages, Sparkles, Lightbulb, BarChart3 } from 'lucide-react';

type Winner = 'perplexity' | 'gemini' | 'draw';

interface CompareItem {
  label: string;
  perplexity: string;
  gemini: string;
  winner: Winner;
}

const comparisonData = {
  title: 'Perplexity vs Google Gemini：2026年AI搜索与助手深度对比',
  subtitle: 'AI搜索与多模态助手全方位PK — 价格、搜索能力、多模态、实时数据全面横评',
  lastUpdated: '2026-04-29',
  items: [
    { label: '月费价格', perplexity: 'Pro $20/月（无限搜索+Pro模型）', gemini: 'Gemini Advanced $19.99/月（Google One整合）', winner: 'draw' as Winner },
    { label: '搜索能力', perplexity: '专业AI搜索引擎+深度研究模式+多源交叉验证', gemini: 'Google搜索整合+Gemini推理（信息全面）', winner: 'perplexity' as Winner },
    { label: '信息准确性', perplexity: '多源引用+溯源深度+专业化研究', gemini: 'Google知识图谱背书（权威性高）', winner: 'draw' as Winner },
    { label: '多模态能力', perplexity: '基础图像理解（有限多模态）', gemini: 'Gemini 2.0原生多模态：图/音/视频+生成', winner: 'gemini' as Winner },
    { label: '实时数据', perplexity: '实时搜索+全网索引+深度研究方向', gemini: '实时搜索+Google索引（覆盖面最广）', winner: 'draw' as Winner },
    { label: '长文本处理', perplexity: 'Claude/GPT模型驱动的长文本分析', gemini: 'Gemini 1M tokens上下文（碾压级优势）', winner: 'gemini' as Winner },
    { label: '代码能力', perplexity: '基础代码生成（依赖底层模型）', gemini: 'Gemini 2.0代码生成+Google Colab深度集成', winner: 'gemini' as Winner },
    { label: '中文支持', perplexity: '良好的中文搜索和回答', gemini: '优秀中文支持（Google翻译+国内优化）', winner: 'draw' as Winner },
    { label: '适用场景', perplexity: '深度研究、学术调研、事实核查、专业搜索', gemini: '多模态创作、长文档分析、Google生态整合', winner: 'draw' as Winner },
  ],
};

function WinnerBadge({ winner }: { winner: 'perplexity' | 'gemini' | 'draw' }) {
  if (winner === 'perplexity') return <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 font-medium">✅ Perplexity</span>;
  if (winner === 'gemini') return <span className="text-xs px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-400 font-medium">✅ Gemini</span>;
  return <span className="text-xs px-2 py-0.5 rounded-full bg-slate-500/20 text-slate-400 font-medium">⚖️ 持平</span>;
}

function WinnerIcon({ winner }: { winner: 'perplexity' | 'gemini' | 'draw' }) {
  if (winner === 'perplexity') return <Check className="w-4 h-4 text-blue-400" />;
  if (winner === 'gemini') return <Check className="w-4 h-4 text-orange-400" />;
  return <Minus className="w-4 h-4 text-slate-400" />;
}

export default function ComparePage() {
  const jsonLdBreadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'AI导航站', item: 'https://longxiaclub.com' },
      { '@type': 'ListItem', position: 2, name: '工具对比', item: 'https://longxiaclub.com/compare' },
      { '@type': 'ListItem', position: 3, name: 'Perplexity vs Google Gemini', item: 'https://longxiaclub.com/compare/perplexity-vs-gemini' },
    ],
  };

  const jsonLdFaq = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Perplexity和Google Gemini哪个更适合做研究？',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Perplexity是专业AI搜索引擎，深度研究模式可以多源交叉验证并提供详细引用，更适合学术调研和事实核查。Gemini的搜索能力也很强，但专业性上Perplexity略胜一筹。',
        },
      },
      {
        '@type': 'Question',
        name: 'Perplexity和Google Gemini哪个多模态能力更强？',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Google Gemini 2.0的多模态能力明显更强，支持图像、音频、视频理解和生成。Perplexity的多模态能力相对基础，主要依赖底层模型的能力。',
        },
      },
      {
        '@type': 'Question',
        name: 'Perplexity和Google Gemini的定价对比？',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Perplexity Pro $20/月，提供无限搜索和Pro模型访问。Gemini Advanced $19.99/月，且包含Google One 2TB存储空间。价格几乎相同，但Gemini的Google One整合更具附加价值。',
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
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-orange-500/10 pointer-events-none" />
        <div className="max-w-6xl mx-auto px-4 py-20 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-4">
            <Link href="/" className="inline-flex items-center text-sm text-slate-400 hover:text-white transition-colors mb-6">
              <ArrowRight className="w-4 h-4 mr-1 rotate-180" />
              返回首页
            </Link>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-center mb-4">
            <span className="bg-gradient-to-r from-blue-400 to-blue-300 bg-clip-text text-transparent">Perplexity</span>
            <span className="text-slate-400 mx-3">VS</span>
            <span className="bg-gradient-to-r from-orange-400 to-orange-300 bg-clip-text text-transparent">Google Gemini</span>
          </h1>
          <p className="text-slate-400 text-center text-lg max-w-2xl mx-auto mb-2">
            2026年AI搜索与助手深度对比 — 搜索能力、多模态、实时数据、长文本全方位横评
          </p>
          <p className="text-slate-500 text-center text-sm">更新于 {comparisonData.lastUpdated}</p>

          {/* Quick Stats */}
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 text-center">
              <Search className="w-8 h-8 mx-auto mb-2 text-blue-400" />
              <div className="text-2xl font-bold text-white">深度研究</div>
              <div className="text-sm text-slate-400">Perplexity专业搜索 + 多源引用</div>
            </div>
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 text-center">
              <Camera className="w-8 h-8 mx-auto mb-2 text-orange-400" />
              <div className="text-2xl font-bold text-white">全栈多模态</div>
              <div className="text-sm text-slate-400">Gemini图/音/视频全面领先</div>
            </div>
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 text-center">
              <FileText className="w-8 h-8 mx-auto mb-2 text-orange-400" />
              <div className="text-2xl font-bold text-white">1M + 128K</div>
              <div className="text-sm text-slate-400">Gemini上下文是Perplexity的8倍</div>
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
                <span className="text-blue-400">🔍 Perplexity</span>
              </div>
              <div className="col-span-4 sm:col-span-3 p-3 text-sm font-medium">
                <span className="text-orange-400">✨ Gemini</span>
              </div>
              <div className="hidden sm:block sm:col-span-3 p-3 text-xs text-slate-500 text-center">胜出方</div>
            </div>

            {/* Rows */}
            {comparisonData.items.map((item, i) => (
              <div key={i} className={`col-span-12 grid grid-cols-12 ${i < comparisonData.items.length - 1 ? 'border-b border-slate-700/30' : ''}`}>
                <div className="col-span-4 sm:col-span-3 p-3 text-sm text-slate-300 font-medium flex items-center">
                  {item.label}
                </div>
                <div className={`col-span-4 sm:col-span-3 p-3 text-sm text-slate-400 flex items-center ${item.winner === 'perplexity' ? 'bg-blue-500/5' : ''}`}>
                  {item.perplexity}
                </div>
                <div className={`col-span-4 sm:col-span-3 p-3 text-sm text-slate-400 flex items-center ${item.winner === 'gemini' ? 'bg-orange-500/5' : ''}`}>
                  {item.gemini}
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
              Perplexity 核心优势
            </h3>
            <ul className="mt-4 space-y-2">
              <li className="flex items-start gap-2 text-slate-300 text-sm">
                <Check className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                <span><strong>专业AI搜索</strong>：多源交叉验证+深度研究模式+详细引用</span>
              </li>
              <li className="flex items-start gap-2 text-slate-300 text-sm">
                <Check className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                <span><strong>搜索体验极佳</strong>：直接回答问题+引用来源，无需翻阅链接</span>
              </li>
              <li className="flex items-start gap-2 text-slate-300 text-sm">
                <Check className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                <span><strong>深度研究模式</strong>：多轮迭代搜索，生成研究报告</span>
              </li>
              <li className="flex items-start gap-2 text-slate-300 text-sm">
                <Check className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                <span><strong>多模型支持</strong>：底层可切换GPT-4o/Claude等模型</span>
              </li>
            </ul>
          </div>
          <div className="bg-gradient-to-br from-orange-500/10 to-orange-500/5 border border-orange-500/20 rounded-xl p-6">
            <h3 className="text-xl font-bold text-orange-300 mb-1 flex items-center gap-2">
              <Zap className="w-5 h-5" />
              Google Gemini 核心优势
            </h3>
            <ul className="mt-4 space-y-2">
              <li className="flex items-start gap-2 text-slate-300 text-sm">
                <Check className="w-4 h-4 text-orange-400 mt-0.5 flex-shrink-0" />
                <span><strong>全栈多模态</strong>：原生图像/音频/视频理解和生成能力</span>
              </li>
              <li className="flex items-start gap-2 text-slate-300 text-sm">
                <Check className="w-4 h-4 text-orange-400 mt-0.5 flex-shrink-0" />
                <span><strong>1M超长上下文</strong>：处理超长文档、代码库、视频内容</span>
              </li>
              <li className="flex items-start gap-2 text-slate-300 text-sm">
                <Check className="w-4 h-4 text-orange-400 mt-0.5 flex-shrink-0" />
                <span><strong>Google生态整合</strong>：Gmail/Drive/Colab/Youtube无缝衔接</span>
              </li>
              <li className="flex items-start gap-2 text-slate-300 text-sm">
                <Check className="w-4 h-4 text-orange-400 mt-0.5 flex-shrink-0" />
                <span><strong>代码能力</strong>：Gemini 2.0代码生成 + Google Colab深度集成</span>
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
                <Globe className="w-5 h-5 text-blue-400" />
                <h3 className="text-lg font-bold text-white">选 Perplexity 的场景</h3>
              </div>
              <ul className="space-y-2 text-sm text-slate-300">
                <li className="flex items-start gap-2">• 专业学术研究，需要多源交叉验证和详细引用</li>
                <li className="flex items-start gap-2">• 事实核查和深度调研，追求信息准确性</li>
                <li className="flex items-start gap-2">• 快速获取"一句话回答+可靠来源"的搜索体验</li>
                <li className="flex items-start gap-2">• 生成研究报告或知识汇总（深度研究模式）</li>
                <li className="flex items-start gap-2">• 不想被广告和SEO内容干扰的纯净搜索</li>
              </ul>
            </div>
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-2">
                <Camera className="w-5 h-5 text-orange-400" />
                <h3 className="text-lg font-bold text-white">选 Gemini 的场景</h3>
              </div>
              <ul className="space-y-2 text-sm text-slate-300">
                <li className="flex items-start gap-2">• 需要多模态交互（图像/视频/音频理解生成）</li>
                <li className="flex items-start gap-2">• 处理超长文档或视频内容（1M上下文）</li>
                <li className="flex items-start gap-2">• 深度使用Google生态（Gmail/Drive/Colab）</li>
                <li className="flex items-start gap-2">• 需要AI编程+云开发环境（Google Colab集成）</li>
                <li className="flex items-start gap-2">• 性价比优先（Gemini Advanced含2TB Google One）</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Final Verdict */}
        <div className="bg-gradient-to-br from-blue-500/10 via-indigo-500/10 to-orange-500/10 border border-blue-500/20 rounded-xl p-8">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-yellow-400" />
            最终结论
          </h2>
          <div className="space-y-4 text-slate-300 leading-relaxed">
            <p>
              <strong className="text-white">Perplexity</strong> 是2026年<strong className="text-blue-300">AI搜索引擎的专业标杆</strong>。它的深度研究模式、多源交叉验证、详细引用溯源，以及对搜索体验的极致追求，使它成为学术研究人员、事实核查者和深度信息需求的用户首选。如果你追求的是精准、可靠、透明的信息获取体验，Perplexity无可替代。
            </p>
            <p>
              <strong className="text-white">Google Gemini</strong> 是2026年<strong className="text-orange-300">全能AI助手的整合之王</strong>。1M超长上下文、全栈多模态能力、Google生态的无缝整合、以及极具竞争力的定价（含2TB Google One），让Gemini成为一个几乎覆盖所有场景的一站式AI平台。它的搜索能力虽然不如Perplexity专业，但综合能力更强。
            </p>
          </div>
          <div className="mt-6 p-5 bg-slate-800/50 rounded-lg border border-slate-700/50">
            <p className="text-slate-400 text-sm">
              💡 <strong className="text-slate-300">综合建议：</strong>两者同为约$20/月，但定位完全不同。<strong className="text-blue-300">Perplexity</strong>是你的专业搜索和研究工具，<strong className="text-orange-300">Gemini</strong>是你的全能AI助手。最佳组合是：日常搜索和研究用Perplexity，多模态创作、长文档处理和Google生态工作流用Gemini。如果只选一个：重度搜索用户选Perplexity，追求综合能力选Gemini。
            </p>
          </div>
        </div>

        {/* Related Links */}
        <div className="mt-12 flex flex-wrap gap-4 justify-center">
          <Link
            href="/compare/claude-vs-chatgpt"
            className="inline-flex items-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-slate-300 hover:text-white transition-all"
          >
            ← Claude vs ChatGPT
          </Link>
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
