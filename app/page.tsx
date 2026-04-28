import Navbar from '@/components/Navbar';
import Leaderboard from '@/components/Leaderboard';
import SceneTags from '@/components/SceneTags';
import EvolutionLog from '@/components/EvolutionLog';
import { Sparkles } from 'lucide-react';

// FAQ JSON-LD for homepage
const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'AI导航站是什么？',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'AI导航站（longxiaclub.com）是一个AI工具聚合平台，连接GitHub前沿技术产品与大众用户，通过场景化策展降低AI工具的发现与使用门槛。我们收录了22+款AI工具和50+个AI Skill，覆盖AI对话、图像生成、视频生成、编程开发等多个领域。'
      }
    },
    {
      '@type': 'Question',
      name: 'AI导航站有哪些功能？',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'AI导航站提供：1) AI工具分类浏览和搜索，按热度、价格、难度筛选；2) Skill市场，可安装即用的AI技能包；3) 场景方案，基于业务场景的AI解决方案推荐；4) 工具热度排行榜和趋势监测；5) 知识图谱关联推荐，发现相关工具和技能。'
      }
    },
    {
      '@type': 'Question',
      name: 'AI导航站上的工具是免费的吗？',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'AI导航站收录的工具覆盖多种定价模式：免费（Free）、免费试用（Freemium）、付费（Paid）和企业版（Enterprise）。每个工具页面都标注了具体的价格信息，方便用户选择适合自己的工具。'
      }
    },
    {
      '@type': 'Question',
      name: 'AI导航站适合哪些人使用？',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'AI导航站适合所有对AI工具感兴趣的用户，包括：AI初学者想要快速了解热门AI工具；内容创作者寻找AI写作、绘画工具；开发者使用AI编程助手；企业用户寻找AI自动化解决方案；以及对AI Skill市场感兴趣的Agent开发者。'
      }
    },
    {
      '@type': 'Question',
      name: '如何使用AI导航站的Skill市场？',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'AI导航站的Skill市场类似App Store，提供可插拔的AI Skill组件。用户可以根据分类或搜索找到需要的Skill，查看其使用场景、工作流程、兼容平台等信息，一键安装使用。每个Skill都配有示例提示词和使用技巧。'
      }
    },
    {
      '@type': 'Question',
      name: 'AI导航站的数据来源是什么？',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'AI导航站的数据来源包括：GitHub前沿AI技术产品、社区推荐和人工策展。我们通过知识图谱技术将工具、Skill和场景关联，实现智能推荐。网站持续自我进化，通过AI日报收集新信息自动扩充内容。'
      }
    },
    {
      '@type': 'Question',
      name: 'AI导航站多久更新一次？',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'AI导航站持续更新：每日精选推荐更新，每周新增AI工具和Skill内容，每月进行功能迭代。网站通过ISR（增量静态再生）技术确保内容实时更新，同时保持快速加载体验。'
      }
    },
    {
      '@type': 'Question',
      name: '如何在AI导航站收藏工具？',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '用户可以在AI导航站注册登录后收藏喜欢的AI工具和Skill。收藏功能支持同步到云端，方便在不同设备间查看。未登录时收藏数据保存在本地浏览器中。'
      }
    }
  ]
};

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50 dot-pattern">
      {/* Background gradients */}
      <div className="fixed inset-0 bg-gradient-mint pointer-events-none" />
      
      <Navbar />
      
      {/* FAQ JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      
      <div className="relative pt-24">
        {/* Leaderboards - Main Visual */}
        <Leaderboard />
        
        {/* Scene Tags */}
        <SceneTags />

        {/* Evolution Log - Self-improvement transparency */}
        <EvolutionLog />
        
        {/* Footer */}
        <footer className="border-t border-slate-200 py-12 bg-white mt-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg font-bold gradient-text">AI导航站</span>
              </div>
              <p className="text-slate-400 text-sm">
                © 2026 AI导航站. 连接前沿AI技术与大众用户
              </p>
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
}
