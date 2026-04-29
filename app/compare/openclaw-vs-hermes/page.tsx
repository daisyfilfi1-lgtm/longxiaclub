import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Check, Zap, Code, Globe, Brain, DollarSign, Users, Server, Wrench, Terminal, Languages, Cpu, Sparkles, Lightbulb, BarChart3, Shield } from 'lucide-react';

export const metadata: Metadata = {
  title: 'OpenClaw vs Hermes Agent：2026年AI Agent工具深度对比',
  description: 'OpenClaw（开源多模型Agent框架）与Hermes Agent（Nous Research开发）全维度对比：开源性、模型支持、安装复杂度、使用场景、社区生态、自定义能力、第三方API接入、编程能力、中文支持、适用用户——帮你选出最佳AI Agent框架。',
  openGraph: {
    title: 'OpenClaw vs Hermes Agent | 2026年AI Agent对比',
    description: '从开源性到编程能力，从安装复杂度到社区生态，两大AI Agent框架全方位PK。',
    type: 'article',
  },
};

type Winner = 'openclaw' | 'hermes' | 'draw';

interface CompareItem {
  label: string;
  openclaw: string;
  hermes: string;
  winner: Winner;
}

const comparisonData = {
  title: 'OpenClaw vs Hermes Agent：2026年AI Agent工具深度对比',
  subtitle: '两大AI Agent框架全方位PK — 开源、模型支持、场景、生态全面横评',
  lastUpdated: '2026-04-29',
  items: [
    { label: '开源性', openclaw: '完全开源（MIT协议），代码公开可审查，社区驱动开发', hermes: '完全开源（Apache 2.0），由Nous Research主导开发，社区友好', winner: 'draw' as Winner },
    { label: '模型支持', openclaw: '内置多模型支持：Claude、GPT-4、DeepSeek、Llama、Gemini等主流模型', hermes: '支持任意API接口，灵活配置，可与任何大模型集成', winner: 'draw' as Winner },
    { label: '安装复杂度', openclaw: 'Docker一键部署 + 自动化脚本，5分钟完成安装，新手友好', hermes: 'pip安装 + 配置文件，需要一定Python基础，安装较灵活', winner: 'openclaw' as Winner },
    { label: '使用场景', openclaw: '浏览器自动化、数据分析、内容创作、知识检索、多步工作流', hermes: '编程助手、代码生成、终端Agent、API集成、DevOps自动化', winner: 'openclaw' as Winner },
    { label: '社区生态', openclaw: 'GitHub 30K+ Stars，活跃Discord社区，中文社区繁荣（QQ群+微信群）', hermes: 'GitHub 15K+ Stars，Nous Research官方支持，英文社区为主', winner: 'openclaw' as Winner },
    { label: '自定义能力', openclaw: '插件架构 + 工具库，支持自定义Agent行为和扩展功能模块', hermes: '高度可定制的配置文件 + Prompt模板系统，灵活度极高', winner: 'hermes' as Winner },
    { label: '第三方API接入', openclaw: '内置API网关，支持OpenAI/Anthropic/Google等标准协议', hermes: '任意HTTP API均可接入，支持自定义认证和请求格式', winner: 'hermes' as Winner },
    { label: '编程能力', openclaw: '支持Python/JavaScript/Shell脚本执行，代码生成质量中等', hermes: '专为编程优化，支持多语言代码生成、调试、审查，Agent编程能力强', winner: 'hermes' as Winner },
    { label: '中文支持', openclaw: '中文文档完善，社区中文活跃，界面支持中文配置', hermes: '英文为主，中文文档有限，但模型本身可通过配置使用中文', winner: 'openclaw' as Winner },
    { label: '适用用户', openclaw: 'AI爱好者和初学者、内容创作者、需要快速自动化工作流的用户', hermes: '开发者、程序员、需要深度定制Agent行为的DevOps团队', winner: 'openclaw' as Winner },
  ],
};

function WinnerBadge({ winner }: { winner: 'openclaw' | 'hermes' | 'draw' }) {
  if (winner === 'openclaw') return <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 font-medium">✅ OpenClaw</span>;
  if (winner === 'hermes') return <span className="text-xs px-2 py-0.5 rounded-full bg-fuchsia-500/20 text-fuchsia-400 font-medium">✅ Hermes</span>;
  return <span className="text-xs px-2 py-0.5 rounded-full bg-slate-500/20 text-slate-400 font-medium">⚖️ 持平</span>;
}

function WinnerIcon({ winner }: { winner: 'openclaw' | 'hermes' | 'draw' }) {
  if (winner === 'openclaw') return <Check className="w-4 h-4 text-cyan-400" />;
  if (winner === 'hermes') return <Check className="w-4 h-4 text-fuchsia-400" />;
  return <span className="w-4 h-4 text-slate-400 text-center">-</span>;
}

export default function ComparePage() {
  const jsonLdBreadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'AI导航站', item: 'https://longxiaclub.com' },
      { '@type': 'ListItem', position: 2, name: '工具对比', item: 'https://longxiaclub.com/compare' },
      { '@type': 'ListItem', position: 3, name: 'OpenClaw vs Hermes Agent', item: 'https://longxiaclub.com/compare/openclaw-vs-hermes' },
    ],
  };

  const jsonLdFaq = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'OpenClaw和Hermes Agent哪个更适合入门？',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'OpenClaw更适合入门，它提供Docker一键部署和自动化脚本，5分钟内即可完成安装，并配有完善的中文文档和活跃的中文社区。Hermes Agent需要一定的Python基础和配置经验，更适合有编程背景的用户。',
        },
      },
      {
        '@type': 'Question',
        name: 'OpenClaw和Hermes Agent哪个编程能力更强？',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Hermes Agent在编程方面更出色，它专为编程优化，支持多语言代码生成、调试和审查，Agent编程能力在同类工具中表现突出。OpenClaw也支持代码执行，但编程能力相对均衡。',
        },
      },
      {
        '@type': 'Question',
        name: 'OpenClaw和Hermes Agent哪个开源协议更友好？',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'OpenClaw采用MIT协议，Hermes Agent采用Apache 2.0协议。两者都是宽松的开源协议，允许商业使用和修改。MIT协议更简洁，Apache 2.0提供了更明确的专利授权条款，两者都是开发者友好的选择。',
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
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-fuchsia-500/10 pointer-events-none" />
        <div className="max-w-6xl mx-auto px-4 py-20 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-4">
            <Link href="/compare" className="inline-flex items-center text-sm text-slate-400 hover:text-white transition-colors mb-6">
              <ArrowRight className="w-4 h-4 mr-1 rotate-180" />
              返回对比列表
            </Link>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-center mb-4">
            <span className="bg-gradient-to-r from-cyan-400 to-cyan-300 bg-clip-text text-transparent">OpenClaw</span>
            <span className="text-slate-400 mx-3">VS</span>
            <span className="bg-gradient-to-r from-fuchsia-400 to-fuchsia-300 bg-clip-text text-transparent">Hermes</span>
          </h1>
          <p className="text-slate-400 text-center text-lg max-w-2xl mx-auto mb-2">
            {comparisonData.subtitle}
          </p>
          <p className="text-slate-500 text-center text-sm">更新于 {comparisonData.lastUpdated}</p>

          {/* Quick Stats */}
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 text-center">
              <Shield className="w-8 h-8 mx-auto mb-2 text-cyan-400" />
              <div className="text-2xl font-bold text-white">开源</div>
              <div className="text-sm text-slate-400">两者均为宽松开源许可</div>
            </div>
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 text-center">
              <Users className="w-8 h-8 mx-auto mb-2 text-fuchsia-400" />
              <div className="text-2xl font-bold text-white">30K+ / 15K+</div>
              <div className="text-sm text-slate-400">GitHub Stars：OpenClaw领先</div>
            </div>
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 text-center">
              <Wrench className="w-8 h-8 mx-auto mb-2 text-cyan-400" />
              <div className="text-2xl font-bold text-white">5min</div>
              <div className="text-sm text-slate-400">OpenClaw一键部署快至5分钟</div>
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
                <span className="text-cyan-400">🔧 OpenClaw</span>
              </div>
              <div className="col-span-4 sm:col-span-3 p-3 text-sm font-medium">
                <span className="text-fuchsia-400">🤖 Hermes</span>
              </div>
              <div className="hidden sm:block sm:col-span-3 p-3 text-xs text-slate-500 text-center">胜出方</div>
            </div>

            {/* Rows */}
            {comparisonData.items.map((item, i) => (
              <div key={i} className={`col-span-12 grid grid-cols-12 ${i < comparisonData.items.length - 1 ? 'border-b border-slate-700/30' : ''}`}>
                <div className="col-span-4 sm:col-span-3 p-3 text-sm text-slate-300 font-medium flex items-center">
                  {item.label}
                </div>
                <div className={`col-span-4 sm:col-span-3 p-3 text-sm text-slate-400 flex items-center ${item.winner === 'openclaw' ? 'bg-cyan-500/5' : ''}`}>
                  {item.openclaw}
                </div>
                <div className={`col-span-4 sm:col-span-3 p-3 text-sm text-slate-400 flex items-center ${item.winner === 'hermes' ? 'bg-fuchsia-500/5' : ''}`}>
                  {item.hermes}
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
          <div className="bg-gradient-to-br from-cyan-500/10 to-cyan-500/5 border border-cyan-500/20 rounded-xl p-6">
            <h3 className="text-xl font-bold text-cyan-300 mb-1 flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              OpenClaw 核心优势
            </h3>
            <ul className="mt-4 space-y-2">
              <li className="flex items-start gap-2 text-slate-300 text-sm">
                <Check className="w-4 h-4 text-cyan-400 mt-0.5 flex-shrink-0" />
                <span><strong>新手友好</strong>：Docker一键部署，5分钟快速上手</span>
              </li>
              <li className="flex items-start gap-2 text-slate-300 text-sm">
                <Check className="w-4 h-4 text-cyan-400 mt-0.5 flex-shrink-0" />
                <span><strong>社区强大</strong>：30K+ GitHub Stars，中英文社区活跃</span>
              </li>
              <li className="flex items-start gap-2 text-slate-300 text-sm">
                <Check className="w-4 h-4 text-cyan-400 mt-0.5 flex-shrink-0" />
                <span><strong>中文支持好</strong>：完整中文文档 + 中文社区支持</span>
              </li>
              <li className="flex items-start gap-2 text-slate-300 text-sm">
                <Check className="w-4 h-4 text-cyan-400 mt-0.5 flex-shrink-0" />
                <span><strong>场景丰富</strong>：浏览器自动化、数据分析、内容创作全覆盖</span>
              </li>
            </ul>
          </div>
          <div className="bg-gradient-to-br from-fuchsia-500/10 to-fuchsia-500/5 border border-fuchsia-500/20 rounded-xl p-6">
            <h3 className="text-xl font-bold text-fuchsia-300 mb-1 flex items-center gap-2">
              <Zap className="w-5 h-5" />
              Hermes Agent 核心优势
            </h3>
            <ul className="mt-4 space-y-2">
              <li className="flex items-start gap-2 text-slate-300 text-sm">
                <Check className="w-4 h-4 text-fuchsia-400 mt-0.5 flex-shrink-0" />
                <span><strong>编程能力突出</strong>：专为编程优化，Agent编程能力强</span>
              </li>
              <li className="flex items-start gap-2 text-slate-300 text-sm">
                <Check className="w-4 h-4 text-fuchsia-400 mt-0.5 flex-shrink-0" />
                <span><strong>任意API接入</strong>：支持自定义HTTP API，灵活度极高</span>
              </li>
              <li className="flex items-start gap-2 text-slate-300 text-sm">
                <Check className="w-4 h-4 text-fuchsia-400 mt-0.5 flex-shrink-0" />
                <span><strong>高度可定制</strong>：配置文件 + Prompt模板，灵活自定义Agent行为</span>
              </li>
              <li className="flex items-start gap-2 text-slate-300 text-sm">
                <Check className="w-4 h-4 text-fuchsia-400 mt-0.5 flex-shrink-0" />
                <span><strong>DevOps友好</strong>：集成终端Agent能力，适合自动化运维场景</span>
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
                <Cpu className="w-5 h-5 text-cyan-400" />
                <h3 className="text-lg font-bold text-white">选 OpenClaw 的场景</h3>
              </div>
              <ul className="space-y-2 text-sm text-slate-300">
                <li className="flex items-start gap-2">• AI初学者和小白用户，希望快速上手AI Agent工具</li>
                <li className="flex items-start gap-2">• 需要浏览器自动化、内容创作、数据采集等场景</li>
                <li className="flex items-start gap-2">• 中文用户，需要完善的中文文档和社区支持</li>
                <li className="flex items-start gap-2">• 寻找一键部署方案，不想折腾配置和环境</li>
                <li className="flex items-start gap-2">• 社区驱动开发，喜欢活跃的开源生态</li>
              </ul>
            </div>
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-2">
                <Terminal className="w-5 h-5 text-fuchsia-400" />
                <h3 className="text-lg font-bold text-white">选 Hermes Agent 的场景</h3>
              </div>
              <ul className="space-y-2 text-sm text-slate-300">
                <li className="flex items-start gap-2">• 开发者/程序员，需要深度Agent编程辅助</li>
                <li className="flex items-start gap-2">• 需要对接任意自定义API的灵活接入场景</li>
                <li className="flex items-start gap-2">• DevOps团队，需要终端Agent自动化运维</li>
                <li className="flex items-start gap-2">• 喜欢高度定制化和Prompt模板化的工作方式</li>
                <li className="flex items-start gap-2">• 有Python基础，不抗拒命令行配置</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Final Verdict */}
        <div className="bg-gradient-to-br from-cyan-500/10 via-indigo-500/10 to-fuchsia-500/10 border border-cyan-500/20 rounded-xl p-8">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-yellow-400" />
            最终结论
          </h2>
          <div className="space-y-4 text-slate-300 leading-relaxed">
            <p>
              <strong className="text-white">OpenClaw</strong> 是2026年AI Agent框架的<strong className="text-cyan-300">入门首选和场景全能型</strong>选择。Docker一键部署、30K+ Stars的活跃社区、完善的中文支持、丰富的内置场景（浏览器自动化、内容创作等），使其成为AI爱好者和非开发者的最佳选择。如果你希望快速体验AI Agent的能力，OpenClaw是最轻松的上手路径。
            </p>
            <p>
              <strong className="text-white">Hermes Agent (Nous Research)</strong> 是2026年AI Agent框架的<strong className="text-fuchsia-300">开发者和定制化首选</strong>。专为编程优化的Agent能力、任意API的灵活接入、高度可定制的配置文件系统，使它成为程序员和DevOps团队的利器。如果你需要深度定制Agent行为、对接自定义API、或者需要强大的Agent编程辅助，Hermes是更贴合的选择。
            </p>
          </div>
          <div className="mt-6 p-5 bg-slate-800/50 rounded-lg border border-slate-700/50">
            <p className="text-slate-400 text-sm">
              💡 <strong className="text-slate-300">综合建议：</strong>两者开源且互补。<strong className="text-cyan-300">非开发者选OpenClaw</strong>（低门槛+丰富场景+中文支持），<strong className="text-fuchsia-300">开发者选Hermes Agent</strong>（编程能力强+高度定制+API灵活）。都是开源免费的工具，可以同时尝试，根据实际使用场景决定主力工具。
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
