import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Check, Zap, Code, Globe, Brain, DollarSign, Monitor, Terminal, Wrench, Layers, Bug, Puzzle, BookOpen, Sparkles, Lightbulb, BarChart3, Cpu } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Claude Code vs Cursor：2026年AI编程工具深度对比',
  description: 'Claude Code（Anthropic终端原生AI编程Agent）与Cursor（AI-first IDE编辑器）的全维度对比：价格、模型接入、IDE体验、Agent能力、多文件编辑、代码理解、调试能力、插件生态、学习曲线、适用场景——帮你选出最佳AI编程助手。',
  openGraph: {
    title: 'Claude Code vs Cursor | 2026年AI编程工具对比',
    description: '从价格到Agent能力，从IDE体验到插件生态，两大AI编程工具全方位PK。',
    type: 'article',
  },
};

type Winner = 'claude-code' | 'cursor' | 'draw';

interface CompareItem {
  label: string;
  claudeCode: string;
  cursor: string;
  winner: Winner;
}

const comparisonData = {
  title: 'Claude Code vs Cursor：2026年AI编程工具深度对比',
  subtitle: '两大AI编程工具全方位PK — 价格、体验、Agent能力、代码理解全面横评',
  lastUpdated: '2026-04-29',
  items: [
    { label: '价格', claudeCode: 'Claude Pro $20/月（包含Claude Code使用）', cursor: 'Cursor Pro $20/月（个人版）/ $40/月（商业版）', winner: 'draw' as Winner },
    { label: '模型接入', claudeCode: '专有Claude 4系列模型（Opus/Sonnet），深度优化', cursor: '多模型支持：GPT-4o、Claude 4、Gemini 2.5等，可选自带Key', winner: 'cursor' as Winner },
    { label: '终端 vs IDE体验', claudeCode: '纯终端界面（Terminal Agent），通过命令行交互，无需GUI', cursor: '完整IDE编辑器（基于VS Code），可视化界面+AI功能集成', winner: 'cursor' as Winner },
    { label: 'Agent能力', claudeCode: '强大的终端Agent，可自主执行命令、读写文件、Git操作', cursor: 'Composer + Tab补全 + 内联编辑，Agent协作模式逐步完善', winner: 'claude-code' as Winner },
    { label: '多文件编辑', claudeCode: '原生支持跨文件编辑，理解项目结构，可同时修改多个文件', cursor: 'Composer支持多文件编辑，需手动选择文件上下文', winner: 'claude-code' as Winner },
    { label: '代码理解', claudeCode: '深度代码库理解，200K上下文窗口，可加载完整项目', cursor: '基于索引的代码理解，支持代码库索引和语义搜索', winner: 'claude-code' as Winner },
    { label: '调试能力', claudeCode: '终端原生调试，可执行调试命令、分析错误栈、修复Bug', cursor: '集成VS Code调试器，AI辅助分析错误并提供修复建议', winner: 'cursor' as Winner },
    { label: '插件生态', claudeCode: 'MCP协议生态，可连接外部工具和API，扩展Agent能力', cursor: 'VS Code全插件生态 + Cursor专属扩展，数量领先', winner: 'cursor' as Winner },
    { label: '学习曲线', claudeCode: '需要熟悉终端操作和命令行，对新手有一定门槛', cursor: '熟悉的VS Code界面，VS Code用户零成本迁移', winner: 'cursor' as Winner },
    { label: '适用场景', claudeCode: '深度编程、项目重构、CI/CD集成、远程开发、自动化工作流', cursor: '日常编码、前端开发、快速原型、团队协作、代码审查', winner: 'draw' as Winner },
  ],
};

function WinnerBadge({ winner }: { winner: 'claude-code' | 'cursor' | 'draw' }) {
  if (winner === 'claude-code') return <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 font-medium">✅ Claude Code</span>;
  if (winner === 'cursor') return <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-400 font-medium">✅ Cursor</span>;
  return <span className="text-xs px-2 py-0.5 rounded-full bg-slate-500/20 text-slate-400 font-medium">⚖️ 持平</span>;
}

function WinnerIcon({ winner }: { winner: 'claude-code' | 'cursor' | 'draw' }) {
  if (winner === 'claude-code') return <Check className="w-4 h-4 text-amber-400" />;
  if (winner === 'cursor') return <Check className="w-4 h-4 text-purple-400" />;
  return <span className="w-4 h-4 text-slate-400 text-center">-</span>;
}

export default function ComparePage() {
  const jsonLdBreadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'AI导航站', item: 'https://longxiaclub.com' },
      { '@type': 'ListItem', position: 2, name: '工具对比', item: 'https://longxiaclub.com/compare' },
      { '@type': 'ListItem', position: 3, name: 'Claude Code vs Cursor', item: 'https://longxiaclub.com/compare/claude-code-vs-cursor' },
    ],
  };

  const jsonLdFaq = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Claude Code和Cursor哪个更便宜？',
        acceptedAnswer: {
          '@type': 'Answer',
          text: '两者价格相近：Claude Code包含在Claude Pro ($20/月)中，Cursor Pro个人版也是$20/月。Cursor还有$40/月的商业版。在基础价格上两者打平，但Claude Code无需额外订阅即可使用Claude系列模型。',
        },
      },
      {
        '@type': 'Question',
        name: 'Claude Code和Cursor哪个更适合日常开发？',
        acceptedAnswer: {
          '@type': 'Answer',
          text: '日常开发推荐Cursor。它基于VS Code，拥有熟悉的IDE界面和完整的插件生态，学习成本极低。VS Code用户可以零成本迁移。Claude Code更适合深度编程和自动化工作流，但需要熟悉终端操作。',
        },
      },
      {
        '@type': 'Question',
        name: 'Claude Code的Agent能力真的比Cursor强吗？',
        acceptedAnswer: {
          '@type': 'Answer',
          text: '是的。Claude Code作为终端原生Agent，可以自主执行命令、读写文件、进行Git操作，在项目重构和自动化工作流方面表现突出。Cursor的Composer和Agent模式也在不断进化，但在自主执行能力上Claude Code目前领先。',
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
        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 via-transparent to-purple-500/10 pointer-events-none" />
        <div className="max-w-6xl mx-auto px-4 py-20 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-4">
            <Link href="/compare" className="inline-flex items-center text-sm text-slate-400 hover:text-white transition-colors mb-6">
              <ArrowRight className="w-4 h-4 mr-1 rotate-180" />
              返回对比列表
            </Link>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-center mb-4">
            <span className="bg-gradient-to-r from-amber-400 to-amber-300 bg-clip-text text-transparent">Claude Code</span>
            <span className="text-slate-400 mx-3">VS</span>
            <span className="bg-gradient-to-r from-purple-400 to-purple-300 bg-clip-text text-transparent">Cursor</span>
          </h1>
          <p className="text-slate-400 text-center text-lg max-w-2xl mx-auto mb-2">
            {comparisonData.subtitle}
          </p>
          <p className="text-slate-500 text-center text-sm">更新于 {comparisonData.lastUpdated}</p>

          {/* Quick Stats */}
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 text-center">
              <DollarSign className="w-8 h-8 mx-auto mb-2 text-amber-400" />
              <div className="text-2xl font-bold text-white">$20/月</div>
              <div className="text-sm text-slate-400">价格持平，同为$20起</div>
            </div>
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 text-center">
              <Terminal className="w-8 h-8 mx-auto mb-2 text-amber-400" />
              <div className="text-2xl font-bold text-white">Agent</div>
              <div className="text-sm text-slate-400">Claude Code终端Agent领先</div>
            </div>
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 text-center">
              <Monitor className="w-8 h-8 mx-auto mb-2 text-purple-400" />
              <div className="text-2xl font-bold text-white">IDE</div>
              <div className="text-sm text-slate-400">Cursor完整IDE更易上手</div>
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
                <span className="text-amber-400">💻 Claude Code</span>
              </div>
              <div className="col-span-4 sm:col-span-3 p-3 text-sm font-medium">
                <span className="text-purple-400">✏️ Cursor</span>
              </div>
              <div className="hidden sm:block sm:col-span-3 p-3 text-xs text-slate-500 text-center">胜出方</div>
            </div>

            {/* Rows */}
            {comparisonData.items.map((item, i) => (
              <div key={i} className={`col-span-12 grid grid-cols-12 ${i < comparisonData.items.length - 1 ? 'border-b border-slate-700/30' : ''}`}>
                <div className="col-span-4 sm:col-span-3 p-3 text-sm text-slate-300 font-medium flex items-center">
                  {item.label}
                </div>
                <div className={`col-span-4 sm:col-span-3 p-3 text-sm text-slate-400 flex items-center ${item.winner === 'claude-code' ? 'bg-amber-500/5' : ''}`}>
                  {item.claudeCode}
                </div>
                <div className={`col-span-4 sm:col-span-3 p-3 text-sm text-slate-400 flex items-center ${item.winner === 'cursor' ? 'bg-purple-500/5' : ''}`}>
                  {item.cursor}
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
              Claude Code 核心优势
            </h3>
            <ul className="mt-4 space-y-2">
              <li className="flex items-start gap-2 text-slate-300 text-sm">
                <Check className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
                <span><strong>终端Agent自主执行</strong>：自主执行命令、读写文件、Git操作，无需人工干预</span>
              </li>
              <li className="flex items-start gap-2 text-slate-300 text-sm">
                <Check className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
                <span><strong>200K上下文</strong>：可加载完整项目，深度理解代码库结构</span>
              </li>
              <li className="flex items-start gap-2 text-slate-300 text-sm">
                <Check className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
                <span><strong>跨文件编辑</strong>：原生支持多文件同时修改，适合大型重构</span>
              </li>
              <li className="flex items-start gap-2 text-slate-300 text-sm">
                <Check className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
                <span><strong>MCP生态</strong>：通过MCP协议连接外部工具、数据库和API</span>
              </li>
            </ul>
          </div>
          <div className="bg-gradient-to-br from-purple-500/10 to-purple-500/5 border border-purple-500/20 rounded-xl p-6">
            <h3 className="text-xl font-bold text-purple-300 mb-1 flex items-center gap-2">
              <Zap className="w-5 h-5" />
              Cursor 核心优势
            </h3>
            <ul className="mt-4 space-y-2">
              <li className="flex items-start gap-2 text-slate-300 text-sm">
                <Check className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
                <span><strong>IDE体验</strong>：基于VS Code，可视化界面 + AI功能无缝集成</span>
              </li>
              <li className="flex items-start gap-2 text-slate-300 text-sm">
                <Check className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
                <span><strong>多模型支持</strong>：GPT-4o、Claude 4、Gemini 2.5等自由切换</span>
              </li>
              <li className="flex items-start gap-2 text-slate-300 text-sm">
                <Check className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
                <span><strong>VS Code生态</strong>：全插件兼容，VS Code用户零成本迁移</span>
              </li>
              <li className="flex items-start gap-2 text-slate-300 text-sm">
                <Check className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
                <span><strong>低学习曲线</strong>：熟悉的IDE界面，无需命令行经验</span>
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
                <Terminal className="w-5 h-5 text-amber-400" />
                <h3 className="text-lg font-bold text-white">选 Claude Code 的场景</h3>
              </div>
              <ul className="space-y-2 text-sm text-slate-300">
                <li className="flex items-start gap-2">• 深度编程和大型项目重构，需要AI自主执行复杂任务</li>
                <li className="flex items-start gap-2">• CI/CD集成和自动化工作流，终端原生Agent优势明显</li>
                <li className="flex items-start gap-2">• 远程开发（SSH/容器），无需GUI界面即可编程</li>
                <li className="flex items-start gap-2">• 需要200K上下文窗口理解完整代码库</li>
                <li className="flex items-start gap-2">• 已经是终端爱好者或Vim/Emacs用户</li>
              </ul>
            </div>
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-2">
                <Monitor className="w-5 h-5 text-purple-400" />
                <h3 className="text-lg font-bold text-white">选 Cursor 的场景</h3>
              </div>
              <ul className="space-y-2 text-sm text-slate-300">
                <li className="flex items-start gap-2">• 日常编码和前端开发，习惯IDE可视化操作</li>
                <li className="flex items-start gap-2">• VS Code用户，想要零成本迁移到AI编程工具</li>
                <li className="flex items-start gap-2">• 需要多模型自由切换（GPT-4o/Claude/Gemini）</li>
                <li className="flex items-start gap-2">• 团队协作，需要代码审查和共享配置</li>
                <li className="flex items-start gap-2">• 新手程序员，希望低门槛上手AI编程</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Final Verdict */}
        <div className="bg-gradient-to-br from-amber-500/10 via-indigo-500/10 to-purple-500/10 border border-amber-500/20 rounded-xl p-8">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-yellow-400" />
            最终结论
          </h2>
          <div className="space-y-4 text-slate-300 leading-relaxed">
            <p>
              <strong className="text-white">Claude Code (Anthropic)</strong> 是2026年AI编程工具的<strong className="text-amber-300">终端Agent之王</strong>。强大的Agent自主执行能力、200K上下文窗口、原生跨文件编辑、MCP生态扩展，这些特性使它在深度编程、项目重构、CI/CD自动化等场景中无可匹敌。如果你是一个习惯终端的开发者，或者需要AI自主完成复杂的开发任务，Claude Code是你最好的选择。
            </p>
            <p>
              <strong className="text-white">Cursor</strong> 是2026年AI编程工具的<strong className="text-purple-300">IDE体验王者</strong>。基于VS Code的完整IDE体验、多模型支持（GPT-4o/Claude/Gemini）、VS Code全插件生态、极低的学习曲线，让它成为大多数开发者的日常编程首选。如果你追求即开即用的AI编程体验，不想改变已有的开发习惯，Cursor是最自然的选择。
            </p>
          </div>
          <div className="mt-6 p-5 bg-slate-800/50 rounded-lg border border-slate-700/50">
            <p className="text-slate-400 text-sm">
              💡 <strong className="text-slate-300">综合建议：</strong>两者互补而非替代。<strong className="text-amber-300">日常编码用Cursor</strong>（IDE体验+多模型+低门槛），<strong className="text-purple-300">深度编程和自动化用Claude Code</strong>（Agent能力+长上下文+MCP）。两者同为$20/月，预算允许的话可以同时订阅，根据场景灵活切换。
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
            href="/compare/claude-vs-chatgpt"
            className="inline-flex items-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-slate-300 hover:text-white transition-all"
          >
            ← Claude vs ChatGPT
          </Link>
          <Link
            href="/compare"
            className="inline-flex items-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-slate-300 hover:text-white transition-all"
          >
            查看所有对比
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </main>
  );
}
