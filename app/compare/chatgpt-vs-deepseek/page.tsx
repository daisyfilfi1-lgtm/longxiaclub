import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Check, X as XIcon, Minus, Sparkles, Zap, Globe, Code, Brain, DollarSign, FileText, MessageSquare, Languages, Lightbulb, BarChart3 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'ChatGPT vs DeepSeek 全面对比 | 2026年哪个AI更胜一筹',
  description: 'ChatGPT（OpenAI GPT-4o/GPT-4.1）与DeepSeek（DeepSeek-V3/R1）的全维度对比：价格、模型能力、上下文窗口、推理能力、中文支持、代码生成、API定价——帮你选最适合的AI工具。',
  openGraph: {
    title: 'ChatGPT vs DeepSeek 全面对比 | 2026年',
    description: '从价格到性能，从中文支持到代码能力，一篇文章看懂两大AI模型怎么选。',
    type: 'article',
  },
};

type Winner = 'chatgpt' | 'deepseek' | 'draw';

interface CompareItem {
  label: string;
  chatgpt: string;
  deepseek: string;
  winner: Winner;
}

interface CompareCategory {
  title: string;
  icon: string;
  items: CompareItem[];
}

const comparisonData: {
  title: string;
  subtitle: string;
  lastUpdated: string;
  categories: CompareCategory[];
  summaries: { chatgpt: string; deepseek: string };
  verdict: { title: string; points: string[] };
} = {
  title: 'ChatGPT vs DeepSeek 全面对比',
  subtitle: '两大AI模型全方位PK，帮你做出最合适的选择',
  lastUpdated: '2026-04-29',
  categories: [
    {
      title: '💰 价格对比',
      icon: 'DollarSign',
      items: [
        { label: '免费版', chatgpt: 'GPT-3.5 / GPT-4o Mini（有限额度）', deepseek: 'DeepSeek-V3（完整功能免费）', winner: 'deepseek' },
        { label: 'Plus/会员', chatgpt: '$20/月 — GPT-4o完整访问', deepseek: '无会员计划，API按量计费', winner: 'chatgpt' },
        { label: '高级计划', chatgpt: '$200/月 Pro（无限访问+o系列）', deepseek: '无高级订阅', winner: 'chatgpt' },
        { label: 'API价格（输入）', chatgpt: 'GPT-4o: $2.50/百万tokens', deepseek: 'DeepSeek-V3: $0.27/百万tokens', winner: 'deepseek' },
        { label: 'API价格（输出）', chatgpt: 'GPT-4o: $10.00/百万tokens', deepseek: 'DeepSeek-V3: $1.10/百万tokens', winner: 'deepseek' },
        { label: '性价比评级', chatgpt: '⭐⭐⭐ 中高端', deepseek: '⭐⭐⭐⭐⭐ 极致性价比', winner: 'deepseek' },
      ]
    },
    {
      title: '🧠 模型能力',
      icon: 'Brain',
      items: [
        { label: '旗舰模型', chatgpt: 'GPT-4o / GPT-4.1', deepseek: 'DeepSeek-V3 / DeepSeek-R1', winner: 'draw' },
        { label: '推理模型', chatgpt: 'o1 / o3（付费）', deepseek: 'DeepSeek-R1（免费）', winner: 'deepseek' },
        { label: '上下文窗口', chatgpt: '128K tokens（GPT-4 Turbo）', deepseek: '1M tokens（DeepSeek-V3）', winner: 'deepseek' },
        { label: '多模态', chatgpt: '文字+图像+语音+视频理解', deepseek: '纯文本（R1）/ 文字+图像（V3）', winner: 'chatgpt' },
        { label: '联网搜索', chatgpt: '内置Browsing插件', deepseek: '需要手动开启联网搜索', winner: 'chatgpt' },
        { label: '知识截止', chatgpt: '2025年10月', deepseek: '2025年5月', winner: 'chatgpt' },
      ]
    },
    {
      title: '🌍 中文支持',
      icon: 'Languages',
      items: [
        { label: '中文理解', chatgpt: '优秀 — 对中文语境的把握越来越准', deepseek: '卓越 — 原生中文模型，母语级理解', winner: 'deepseek' },
        { label: '中文创作', chatgpt: '良好的中文写作，但偶尔有翻译腔', deepseek: '地道的中文表达，更符合中文阅读习惯', winner: 'deepseek' },
        { label: '中文代码注释', chatgpt: '可使用中文注释', deepseek: '更自然的中文代码沟通', winner: 'deepseek' },
        { label: '中国特色场景', chatgpt: '需手动prompt引导', deepseek: '更懂微信/小红书/抖音等国内平台', winner: 'deepseek' },
        { label: 'API中文响应', chatgpt: '稳定可靠', deepseek: '更流畅，且成本极低', winner: 'deepseek' },
      ]
    },
    {
      title: '💻 代码能力',
      icon: 'Code',
      items: [
        { label: '代码生成质量', chatgpt: 'GPT-4o 在SWE-bench 49.2%', deepseek: 'DeepSeek-V3 在SWE-bench 49.6%', winner: 'draw' },
        { label: '前端开发', chatgpt: '优秀的React/Vue组件生成', deepseek: '同样出色的前端能力', winner: 'draw' },
        { label: '后端开发', chatgpt: '全面的后端语言支持', deepseek: '擅长Python/Java后端', winner: 'draw' },
        { label: 'Debug能力', chatgpt: 'GPT-4o 逐步推理调试', deepseek: 'R1 展现推理路径，定位精准', winner: 'deepseek' },
        { label: '代码审查', chatgpt: '良好的代码审查和优化建议', deepseek: '结合R1推理的深度审查', winner: 'draw' },
        { label: 'AI编程工具集成', chatgpt: 'Cursor/GitHub Copilot/Codex', deepseek: 'Cursor/Continue.dev/OpenClaw', winner: 'chatgpt' },
      ]
    },
    {
      title: '🎯 场景推荐',
      icon: 'Zap',
      items: [
        { label: '日常对话问答', chatgpt: '优秀', deepseek: '优秀', winner: 'draw' },
        { label: '学术论文写作', chatgpt: '非常强（GPT-4o风格）', deepseek: '不错（中文论文更佳）', winner: 'chatgpt' },
        { label: '超长文档分析', chatgpt: '一般（128K上限）', deepseek: '极强（1M上下文处理整本小说）', winner: 'deepseek' },
        { label: '多模态创作', chatgpt: '全面（图/文/音/视频）', deepseek: '有限', winner: 'chatgpt' },
        { label: '中文内容营销', chatgpt: '不错，需适当prompt', deepseek: '原生优势，更懂中国用户', winner: 'deepseek' },
        { label: '企业批量API', chatgpt: '成本较高', deepseek: '极致性价比', winner: 'deepseek' },
      ]
    },
  ],
  summaries: {
    chatgpt: 'ChatGPT的优势在于多模态能力、完善的生态体系（GPTs、插件、Codex）、以及在企业级场景中的稳定性和文档支持。如果你需要多模态交互、使用AI编程工具（Cursor/Copilot）、或者需要丰富的插件生态，ChatGPT是更好的选择。',
    deepseek: 'DeepSeek的优势在于极致的性价比（API价格是GPT-4o的1/10）、1M超长上下文窗口、原生中文理解能力、以及R1推理模型的免费使用。如果你主要处理中文内容、需要分析超长文档、或者预算有限但需要高质量AI能力，DeepSeek是最佳选择。',
  },
  verdict: {
    title: '最终建议',
    points: [
      '📱 如果你需要多模态交互（视频理解、图像生成）→ 选 ChatGPT',
      '💻 如果你需要AI编程助手（Cursor/Copilot）→ 选 ChatGPT（但DeepSeek也可用）',
      '📚 如果你经常处理超长文档（论文、合同、报告）→ 选 DeepSeek（1M上下文）',
      '🇨🇳 如果你主要使用中文创作内容 → 选 DeepSeek（更地道）',
      '💰 如果预算有限但需要高质量API → 选 DeepSeek（成本低90%）',
      '🔬 如果你需要强大的推理能力（数学/逻辑/编程）→ DeepSeek R1免费使用',
      '🏢 企业级稳定性和多模态 → ChatGPT 更成熟',
    ],
  },
};

const iconMap: Record<string, React.ReactNode> = {
  DollarSign: <DollarSign className="w-5 h-5" />,
  Brain: <Brain className="w-5 h-5" />,
  Languages: <Languages className="w-5 h-5" />,
  Code: <Code className="w-5 h-5" />,
  Zap: <Zap className="w-5 h-5" />,
};

function WinnerBadge({ winner }: { winner: 'chatgpt' | 'deepseek' | 'draw' }) {
  if (winner === 'chatgpt') return <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-medium">ChatGPT ✓</span>;
  if (winner === 'deepseek') return <span className="text-xs px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-400 font-medium">DeepSeek ✓</span>;
  return <span className="text-xs px-2 py-0.5 rounded-full bg-slate-500/20 text-slate-400 font-medium">持平</span>;
}

export default function ComparePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-violet-500/10 pointer-events-none" />
        <div className="max-w-6xl mx-auto px-4 py-20 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-4">
            <Link href="/" className="inline-flex items-center text-sm text-slate-400 hover:text-white transition-colors mb-6">
              <ArrowRight className="w-4 h-4 mr-1 rotate-180" />
              返回首页
            </Link>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-center mb-4">
            <span className="bg-gradient-to-r from-emerald-400 to-emerald-300 bg-clip-text text-transparent">ChatGPT</span>
            <span className="text-slate-400 mx-3">VS</span>
            <span className="bg-gradient-to-r from-violet-400 to-violet-300 bg-clip-text text-transparent">DeepSeek</span>
          </h1>
          <p className="text-slate-400 text-center text-lg max-w-2xl mx-auto mb-2">
            两大AI模型全方位PK — 价格、性能、中文支持、代码能力全面对比
          </p>
          <p className="text-slate-500 text-center text-sm">更新于 {comparisonData.lastUpdated}</p>

          {/* Quick Stats */}
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 text-center">
              <DollarSign className="w-8 h-8 mx-auto mb-2 text-emerald-400" />
              <div className="text-2xl font-bold text-white">1/10</div>
              <div className="text-sm text-slate-400">DeepSeek API成本低至ChatGPT的1/10</div>
            </div>
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 text-center">
              <FileText className="w-8 h-8 mx-auto mb-2 text-violet-400" />
              <div className="text-2xl font-bold text-white">1M vs 128K</div>
              <div className="text-sm text-slate-400">上下文窗口：DeepSeek胜出8倍</div>
            </div>
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 text-center">
              <Globe className="w-8 h-8 mx-auto mb-2 text-emerald-400" />
              <div className="text-2xl font-bold text-white">#1</div>
              <div className="text-sm text-slate-400">ChatGPT生态与多模态更完善</div>
            </div>
          </div>
        </div>
      </div>

      {/* Comparison Tables */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {comparisonData.categories.map((category, idx) => (
          <div key={idx} className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-emerald-400">{iconMap[category.icon]}</span>
              <h2 className="text-xl font-bold text-white">{category.title}</h2>
            </div>
            
            <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-xl overflow-hidden">
              <div className="grid grid-cols-12 gap-0">
                {/* Header */}
                <div className="col-span-12 grid grid-cols-12 border-b border-slate-700/50">
                  <div className="col-span-4 sm:col-span-3 p-3 text-sm font-medium text-slate-500">对比项</div>
                  <div className="col-span-4 sm:col-span-4 p-3 text-sm font-medium">
                    <span className="text-emerald-400">ChatGPT</span>
                  </div>
                  <div className="col-span-4 sm:col-span-4 p-3 text-sm font-medium">
                    <span className="text-violet-400">DeepSeek</span>
                  </div>
                  <div className="hidden sm:block sm:col-span-1 p-3 text-xs text-slate-500 text-center">胜出</div>
                </div>
                
                {/* Rows */}
                {category.items.map((item, i) => (
                  <div key={i} className={`col-span-12 grid grid-cols-12 ${i < category.items.length - 1 ? 'border-b border-slate-700/30' : ''}`}>
                    <div className="col-span-4 sm:col-span-3 p-3 text-sm text-slate-300 font-medium flex items-center">
                      {item.label}
                    </div>
                    <div className={`col-span-4 sm:col-span-4 p-3 text-sm text-slate-400 flex items-center ${item.winner === 'chatgpt' ? 'bg-emerald-500/5' : ''}`}>
                      {item.chatgpt}
                    </div>
                    <div className={`col-span-4 sm:col-span-4 p-3 text-sm text-slate-400 flex items-center ${item.winner === 'deepseek' ? 'bg-violet-500/5' : ''}`}>
                      {item.deepseek}
                    </div>
                    <div className="hidden sm:flex sm:col-span-1 p-3 items-center justify-center">
                      <WinnerBadge winner={item.winner} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}

        {/* Summary Section */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <div className="bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 border border-emerald-500/20 rounded-xl p-6">
            <h3 className="text-xl font-bold text-emerald-300 mb-1 flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              ChatGPT 优势场景
            </h3>
            <p className="text-slate-300 mt-3 leading-relaxed">
              {comparisonData.summaries.chatgpt}
            </p>
          </div>
          <div className="bg-gradient-to-br from-violet-500/10 to-violet-500/5 border border-violet-500/20 rounded-xl p-6">
            <h3 className="text-xl font-bold text-violet-300 mb-1 flex items-center gap-2">
              <Zap className="w-5 h-5" />
              DeepSeek 优势场景
            </h3>
            <p className="text-slate-300 mt-3 leading-relaxed">
              {comparisonData.summaries.deepseek}
            </p>
          </div>
        </div>

        {/* Verdict */}
        <div className="bg-gradient-to-br from-blue-500/10 to-indigo-500/10 border border-blue-500/20 rounded-xl p-8">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <Lightbulb className="w-6 h-6 text-yellow-400" />
            {comparisonData.verdict.title}
          </h2>
          <ul className="space-y-3">
            {comparisonData.verdict.points.map((point, i) => (
              <li key={i} className="text-slate-300 leading-relaxed flex items-start gap-2">
                <span className="mt-0.5">•</span>
                <span>{point}</span>
              </li>
            ))}
          </ul>
          <div className="mt-6 p-4 bg-slate-800/50 rounded-lg border border-slate-700/50">
            <p className="text-slate-400 text-sm">
              💡 <strong className="text-slate-300">综合建议：</strong>两者不是非此即彼的关系。最佳策略是两者都用——日常中文创作和长文档分析用DeepSeek（免费+性能强劲），多模态和AI编程用ChatGPT（生态完善）。这样既能享受DeepSeek的极致性价比，又能利用ChatGPT的成熟生态。
            </p>
          </div>
        </div>

        {/* Related Tools */}
        <div className="mt-12 text-center">
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
