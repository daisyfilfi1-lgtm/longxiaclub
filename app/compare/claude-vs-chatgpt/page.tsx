'use client';

import Link from 'next/link';
import { ArrowRight, Check, X as XIcon, Minus, Zap, Code, Brain, DollarSign, MessageSquare, Image, Globe, Bot, Network, Terminal, Sparkles, Lightbulb, BarChart3, FileText } from 'lucide-react';

type Winner = 'claude' | 'chatgpt' | 'draw';

interface CompareItem {
  label: string;
  claude: string;
  chatgpt: string;
  winner: Winner;
}

const comparisonData = {
  title: 'Claude vs ChatGPT：2026年AI对话模型深度对比',
  subtitle: '两大AI对话模型全方位PK — 价格、推理、代码、长文本、多模态全面横评',
  lastUpdated: '2026-04-29',
  items: [
    { label: '月费价格', claude: 'Claude Pro $20/月（无限对话+优先访问）', chatgpt: 'ChatGPT Plus $20/月（GPT-4o+o系列）', winner: 'draw' as Winner },
    { label: '推理能力', claude: 'Claude 4 Sonnet/Opus — 深度推理、逻辑严谨、数学学霸', chatgpt: 'GPT-4o + o3推理模型 — 多步推理强，o3数学竞赛级', winner: 'draw' as Winner },
    { label: '代码生成质量', claude: 'Claude 4在SWE-bench 54%+，代码架构清晰', chatgpt: 'GPT-4o在SWE-bench 49%，Codex生态加持', winner: 'claude' as Winner },
    { label: '长文本处理', claude: '200K tokens上下文（Claude 4）', chatgpt: '128K tokens上下文（GPT-4 Turbo/4o）', winner: 'claude' as Winner },
    { label: '中文支持', claude: '优秀 — 多语言能力强，中文表达自然流畅', chatgpt: '优秀 — 中文质量持续提升，但偶有翻译腔', winner: 'claude' as Winner },
    { label: '多模态能力', claude: '文字+图像理解（无原生图像生成）', chatgpt: '文字+图像+语音+视频理解+DALL·E生成', winner: 'chatgpt' as Winner },
    { label: 'Agent能力', claude: 'Computer Use API + Claude Agent（MCP驱动）', chatgpt: 'GPTs + ChatGPT Tasks + 内置Browsing', winner: 'draw' as Winner },
    { label: 'MCP生态', claude: 'Claude首创MCP协议，连接工具/API生态繁荣', chatgpt: 'GPTs + Plugin生态，非MCP标准', winner: 'claude' as Winner },
    { label: 'AI编程工具', claude: 'Claude Code（终端原生Agent，深度代码理解）', chatgpt: 'Codex（OpenAI编程Agent，Canvas集成）', winner: 'draw' as Winner },
    { label: '适用场景', claude: '长文档分析、深度编程、Agent工作流、MCP工具链', chatgpt: '多模态创作、插件生态、日常对话、企业知识库', winner: 'draw' as Winner },
  ],
};

function WinnerBadge({ winner }: { winner: 'claude' | 'chatgpt' | 'draw' }) {
  if (winner === 'claude') return <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 font-medium">✅ Claude</span>;
  if (winner === 'chatgpt') return <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-medium">✅ ChatGPT</span>;
  return <span className="text-xs px-2 py-0.5 rounded-full bg-slate-500/20 text-slate-400 font-medium">⚖️ 持平</span>;
}

function WinnerIcon({ winner }: { winner: 'claude' | 'chatgpt' | 'draw' }) {
  if (winner === 'claude') return <Check className="w-4 h-4 text-amber-400" />;
  if (winner === 'chatgpt') return <Check className="w-4 h-4 text-emerald-400" />;
  return <Minus className="w-4 h-4 text-slate-400" />;
}

export default function ComparePage() {
  const jsonLdBreadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'AI导航站', item: 'https://longxiaclub.com' },
      { '@type': 'ListItem', position: 2, name: '工具对比', item: 'https://longxiaclub.com/compare' },
      { '@type': 'ListItem', position: 3, name: 'Claude vs ChatGPT', item: 'https://longxiaclub.com/compare/claude-vs-chatgpt' },
    ],
  };

  const jsonLdFaq = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Claude和ChatGPT哪个更便宜？',
        acceptedAnswer: {
          '@type': 'Answer',
          text: '两者Pro版均为$20/月。Claude Pro提供无限对话和优先访问，ChatGPT Plus提供GPT-4o和o系列模型访问。价格完全相同，差异在功能侧重上。',
        },
      },
      {
        '@type': 'Question',
        name: 'Claude和ChatGPT哪个编程能力更强？',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Claude 4在SWE-bench基准上达到54%+，略高于GPT-4o的49%，且代码架构更清晰。但ChatGPT有Codex和GitHub Copilot生态加持，两者各有千秋。',
        },
      },
      {
        '@type': 'Question',
        name: 'Claude和ChatGPT哪个适合处理长文档？',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Claude支持200K tokens上下文，ChatGPT支持128K tokens。Claude在超长文档（如论文、合同、代码库）分析上更有优势，适合需要一次性处理大量文本的场景。',
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
        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 via-transparent to-emerald-500/10 pointer-events-none" />
        <div className="max-w-6xl mx-auto px-4 py-20 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-4">
            <Link href="/" className="inline-flex items-center text-sm text-slate-400 hover:text-white transition-colors mb-6">
              <ArrowRight className="w-4 h-4 mr-1 rotate-180" />
              返回首页
            </Link>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-center mb-4">
            <span className="bg-gradient-to-r from-amber-400 to-amber-300 bg-clip-text text-transparent">Claude</span>
            <span className="text-slate-400 mx-3">VS</span>
            <span className="bg-gradient-to-r from-emerald-400 to-emerald-300 bg-clip-text text-transparent">ChatGPT</span>
          </h1>
          <p className="text-slate-400 text-center text-lg max-w-2xl mx-auto mb-2">
            2026年AI对话模型深度对比 — 价格、推理、代码、长文本、多模态、MCP生态全方位横评
          </p>
          <p className="text-slate-500 text-center text-sm">更新于 {comparisonData.lastUpdated}</p>

          {/* Quick Stats */}
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 text-center">
              <FileText className="w-8 h-8 mx-auto mb-2 text-amber-400" />
              <div className="text-2xl font-bold text-white">200K vs 128K</div>
              <div className="text-sm text-slate-400">Claude上下文窗口领先56%</div>
            </div>
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 text-center">
              <Brain className="w-8 h-8 mx-auto mb-2 text-emerald-400" />
              <div className="text-2xl font-bold text-white">$20/月</div>
              <div className="text-sm text-slate-400">两者Pro版价格完全相同</div>
            </div>
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 text-center">
              <Image className="w-8 h-8 mx-auto mb-2 text-emerald-400" />
              <div className="text-2xl font-bold text-white">多模态</div>
              <div className="text-sm text-slate-400">ChatGPT图文音视频全栈领先</div>
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
                <span className="text-amber-400">🤖 Claude</span>
              </div>
              <div className="col-span-4 sm:col-span-3 p-3 text-sm font-medium">
                <span className="text-emerald-400">🧩 ChatGPT</span>
              </div>
              <div className="hidden sm:block sm:col-span-3 p-3 text-xs text-slate-500 text-center">胜出方</div>
            </div>

            {/* Rows */}
            {comparisonData.items.map((item, i) => (
              <div key={i} className={`col-span-12 grid grid-cols-12 ${i < comparisonData.items.length - 1 ? 'border-b border-slate-700/30' : ''}`}>
                <div className="col-span-4 sm:col-span-3 p-3 text-sm text-slate-300 font-medium flex items-center">
                  {item.label}
                </div>
                <div className={`col-span-4 sm:col-span-3 p-3 text-sm text-slate-400 flex items-center ${item.winner === 'claude' ? 'bg-amber-500/5' : ''}`}>
                  {item.claude}
                </div>
                <div className={`col-span-4 sm:col-span-3 p-3 text-sm text-slate-400 flex items-center ${item.winner === 'chatgpt' ? 'bg-emerald-500/5' : ''}`}>
                  {item.chatgpt}
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
          <div className="bg-gradient-to-br from-amber-500/10 to-amber-500/5 border border-amber-500/20 rounded-xl p-6">
            <h3 className="text-xl font-bold text-amber-300 mb-1 flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              Claude 核心优势
            </h3>
            <ul className="mt-4 space-y-2">
              <li className="flex items-start gap-2 text-slate-300 text-sm">
                <Check className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
                <span><strong>超长上下文</strong>：200K tokens，轻松处理整本书或大型代码库</span>
              </li>
              <li className="flex items-start gap-2 text-slate-300 text-sm">
                <Check className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
                <span><strong>代码能力领先</strong>：SWE-bench 54%+，代码架构清晰且少Bug</span>
              </li>
              <li className="flex items-start gap-2 text-slate-300 text-sm">
                <Check className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
                <span><strong>MCP生态首创</strong>：连接数据库/API/工具的开放协议</span>
              </li>
              <li className="flex items-start gap-2 text-slate-300 text-sm">
                <Check className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
                <span><strong>Claude Code</strong>：终端原生AI编程Agent，深度理解项目</span>
              </li>
            </ul>
          </div>
          <div className="bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 border border-emerald-500/20 rounded-xl p-6">
            <h3 className="text-xl font-bold text-emerald-300 mb-1 flex items-center gap-2">
              <Zap className="w-5 h-5" />
              ChatGPT 核心优势
            </h3>
            <ul className="mt-4 space-y-2">
              <li className="flex items-start gap-2 text-slate-300 text-sm">
                <Check className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                <span><strong>全栈多模态</strong>：文字+图像+语音+视频理解 + DALL·E图像生成</span>
              </li>
              <li className="flex items-start gap-2 text-slate-300 text-sm">
                <Check className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                <span><strong>生态体系完善</strong>：GPTs商店 + 插件 + Codex + Canvas</span>
              </li>
              <li className="flex items-start gap-2 text-slate-300 text-sm">
                <Check className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                <span><strong>推理模型</strong>：o3系列在数学/竞赛题上表现卓越</span>
              </li>
              <li className="flex items-start gap-2 text-slate-300 text-sm">
                <Check className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                <span><strong>企业级成熟度</strong>：ChatGPT Enterprise + API稳定性业界领先</span>
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
                <Bot className="w-5 h-5 text-amber-400" />
                <h3 className="text-lg font-bold text-white">选 Claude 的场景</h3>
              </div>
              <ul className="space-y-2 text-sm text-slate-300">
                <li className="flex items-start gap-2">• 需要分析超长文档（论文、合同、法律文件）</li>
                <li className="flex items-start gap-2">• 深度编程和代码架构设计，追求代码质量</li>
                <li className="flex items-start gap-2">• 使用或构建MCP工具链（Claude连接数据库/API）</li>
                <li className="flex items-start gap-2">• 终端原生AI开发体验（Claude Code）</li>
                <li className="flex items-start gap-2">• 注重中文质量和自然语言表达的创作场景</li>
              </ul>
            </div>
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-2">
                <MessageSquare className="w-5 h-5 text-emerald-400" />
                <h3 className="text-lg font-bold text-white">选 ChatGPT 的场景</h3>
              </div>
              <ul className="space-y-2 text-sm text-slate-300">
                <li className="flex items-start gap-2">• 需要多模态创作（图像生成、语音、视频理解）</li>
                <li className="flex items-start gap-2">• 使用GPTs商店和插件生态扩展功能</li>
                <li className="flex items-start gap-2">• 企业级部署，需要成熟稳定的API和合规支持</li>
                <li className="flex items-start gap-2">• 需要数学/逻辑推理（o3模型在竞赛题上领先）</li>
                <li className="flex items-start gap-2">• 日常对话+联网搜索+知识库的一站式体验</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Final Verdict */}
        <div className="bg-gradient-to-br from-amber-500/10 via-indigo-500/10 to-emerald-500/10 border border-amber-500/20 rounded-xl p-8">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-yellow-400" />
            最终结论
          </h2>
          <div className="space-y-4 text-slate-300 leading-relaxed">
            <p>
              <strong className="text-white">Claude (Anthropic)</strong> 是2026年AI对话模型的<strong className="text-amber-300">长文本和代码之王</strong>。200K上下文窗口、SWE-bench领先的代码能力、MCP协议生态、Claude Code终端Agent，这些特性使它在深度技术场景中无可匹敌。如果你需要分析超长文档、深度编程、或者构建Agent工具链，Claude是更优选择。
            </p>
            <p>
              <strong className="text-white">ChatGPT (OpenAI)</strong> 是2026年AI对话模型的<strong className="text-emerald-300">全能多模态冠军</strong>。全栈多模态（文字/图像/语音/视频/DALL·E）、GPTs+插件生态、o3推理模型、ChatGPT Enterprise企业级方案，让它成为大多数用户的一站式AI平台。生态成熟度、用户基数和多模态能力是ChatGPT的核心壁垒。
            </p>
          </div>
          <div className="mt-6 p-5 bg-slate-800/50 rounded-lg border border-slate-700/50">
            <p className="text-slate-400 text-sm">
              💡 <strong className="text-slate-300">综合建议：</strong>两者Pro版同为$20/月，最佳策略是<strong className="text-amber-300">Claude</strong> + <strong className="text-emerald-300">ChatGPT</strong>组合使用。用Claude处理长文档、深度编程和MCP工具链，用ChatGPT做多模态创作、日常对话和GPTs生态。这样既能享受Claude在长文本和代码上的优势，又能利用ChatGPT的全能生态。如果只能选一个：技术深度用户选Claude，全能场景用户选ChatGPT。
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
            href="/compare/cursor-vs-copilot"
            className="inline-flex items-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-slate-300 hover:text-white transition-all"
          >
            ← Cursor vs Copilot
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
