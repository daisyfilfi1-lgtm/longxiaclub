import Link from 'next/link';
import { ExternalLink, Heart, Share2, Copy, CheckCircle, Sparkles, Lightbulb, ArrowLeft, Flame, Star } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { tools, skills } from '@/data/tools';
import { notFound } from 'next/navigation';

interface Props {
  params: Promise<{ id: string }>;
}

// Generate static params for all tools
export async function generateStaticParams() {
  return tools.map((tool) => ({
    id: tool.id,
  }));
}

export default async function ToolDetailPage({ params }: Props) {
  const { id } = await params;
  const tool = tools.find((t) => t.id === id);
  
  if (!tool) {
    notFound();
  }

  const relatedSkillsList = skills.filter((s) => tool.relatedSkills.includes(s.id));

  return (
    <main className="min-h-screen bg-slate-50 dot-pattern">
      <div className="fixed inset-0 bg-gradient-mint pointer-events-none" />
      
      <Navbar />
      
      <div className="relative pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <Link
            href="/tools"
            className="inline-flex items-center space-x-2 text-slate-500 hover:text-teal-600 transition-colors mb-8"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>返回产品中心</span>
          </Link>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Hero Card */}
              <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-lg shadow-slate-100">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center space-x-6">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-teal-100 to-cyan-100 flex items-center justify-center text-5xl border border-teal-200">
                      {tool.logo}
                    </div>
                    <div>
                      <h1 className="text-3xl font-bold text-slate-800 mb-2">{tool.name}</h1>
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-100">
                          <Star className="w-4 h-4 text-amber-500" />
                          <span className="font-semibold text-amber-600">{tool.heat}</span>
                          <span className="text-sm text-amber-600/70">热度</span>
                        </div>
                        <div className="flex items-center space-x-1 text-emerald-600">
                          <Flame className="w-4 h-4" />
                          <span className="font-medium">+{tool.heatGrowth}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-3">
                    <button className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-400 hover:text-rose-500 hover:border-rose-200 hover:bg-rose-50 transition-all">
                      <Heart className="w-5 h-5" />
                    </button>
                    <button className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-400 hover:text-slate-600 transition-all">
                      <Share2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {tool.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1.5 rounded-full bg-teal-50 border border-teal-100 text-teal-700 text-sm font-medium"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                {/* Description */}
                <p className="text-slate-600 mb-8 leading-relaxed text-lg">{tool.description}</p>

                {/* Meta Info */}
                <div className="flex flex-wrap items-center gap-4">
                  <a
                    href={tool.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-medium hover:shadow-lg hover:shadow-teal-200 transition-all"
                  >
                    <span>访问官网</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                  <div className="flex items-center space-x-3">
                    <span className={`px-4 py-2 rounded-xl font-medium text-sm ${
                      tool.price === 'free' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                      tool.price === 'freemium' ? 'bg-blue-50 text-blue-600 border border-blue-100' :
                      tool.price === 'paid' ? 'bg-orange-50 text-orange-600 border border-orange-100' :
                      'bg-purple-50 text-purple-600 border border-purple-100'
                    }`}>
                      {tool.price === 'free' ? '免费' :
                       tool.price === 'freemium' ? '免费试用' :
                       tool.price === 'paid' ? '付费' : '企业版'}
                    </span>
                    <span className="px-4 py-2 rounded-xl bg-slate-50 text-slate-600 text-sm border border-slate-200">
                      {tool.difficulty === 'beginner' ? '入门' : tool.difficulty === 'intermediate' ? '进阶' : '高级'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Scenes */}
              <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-lg shadow-slate-100">
                <h2 className="text-xl font-bold text-slate-800 mb-6">🎯 适用场景</h2>
                <div className="flex flex-wrap gap-3">
                  {tool.sceneTags.map((scene) => (
                    <Link
                      key={scene}
                      href={`/scenes?tag=${scene}`}
                      className="px-5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 hover:text-teal-600 hover:border-teal-300 hover:bg-teal-50 transition-all"
                    >
                      {scene}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Tips */}
              <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-lg shadow-slate-100">
                <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center space-x-2">
                  <Lightbulb className="w-5 h-5 text-amber-500" />
                  <span>💡 使用技巧</span>
                </h2>
                <div className="space-y-4">
                  {tool.tips.map((tip, index) => (
                    <div key={index} className="flex items-start space-x-4 p-4 rounded-xl bg-slate-50">
                      <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center flex-shrink-0">
                        <CheckCircle className="w-4 h-4 text-emerald-600" />
                      </div>
                      <p className="text-slate-600 leading-relaxed">{tip}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Prompts */}
              <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-lg shadow-slate-100">
                <h2 className="text-xl font-bold text-slate-800 mb-6">📝 Prompt案例库</h2>
                <div className="space-y-4">
                  {tool.prompts.map((prompt) => (
                    <div key={prompt.id} className="rounded-2xl bg-slate-50 border border-slate-200 overflow-hidden">
                      <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-white">
                        <div>
                          <span className="text-xs text-slate-500 uppercase tracking-wider">{prompt.scene}</span>
                          <h3 className="font-semibold text-slate-800 mt-1">{prompt.title}</h3>
                        </div>
                        <button className="p-2 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors">
                          <Copy className="w-4 h-4 text-slate-400" />
                        </button>
                      </div>
                      <div className="p-6 bg-slate-800">
                        <pre className="text-sm text-slate-300 whitespace-pre-wrap font-mono leading-relaxed">{prompt.content}</pre>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Related Skills */}
              {relatedSkillsList.length > 0 && (
                <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-lg shadow-slate-100">
                  <h3 className="font-bold text-slate-800 mb-4">🔗 关联Skill</h3>
                  <div className="space-y-3">
                    {relatedSkillsList.map((skill) => (
                      <Link
                        key={skill.id}
                        href={`/skills/${skill.id}`}
                        className="flex items-center space-x-3 p-3 rounded-xl bg-slate-50 hover:bg-purple-50 transition-colors group"
                      >
                        <span className="text-2xl">{skill.icon}</span>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-slate-800 text-sm group-hover:text-purple-600 transition-colors truncate">{skill.name}</h4>
                          <p className="text-xs text-slate-500 truncate">{skill.description.slice(0, 20)}...</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Tech Tags */}
              <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-lg shadow-slate-100">
                <h3 className="font-bold text-slate-800 mb-4">🏷️ 技术标签</h3>
                <div className="flex flex-wrap gap-2">
                  {tool.techTags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs px-3 py-1.5 rounded-full bg-slate-100 text-slate-600"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Cost Tags */}
              <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-lg shadow-slate-100">
                <h3 className="font-bold text-slate-800 mb-4">💰 成本标签</h3>
                <div className="flex flex-wrap gap-2">
                  {tool.costTags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Social Proof */}
              {tool.xhsSaves && (
                <div className="p-6 rounded-2xl bg-gradient-to-br from-rose-50 to-pink-50 border border-rose-100">
                  <h3 className="font-bold text-rose-600 mb-2">📱 社媒热度</h3>
                  <p className="text-3xl font-bold text-slate-800">
                    {(tool.xhsSaves / 10000).toFixed(1)}万
                  </p>
                  <p className="text-sm text-rose-500">小红书收藏数</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
