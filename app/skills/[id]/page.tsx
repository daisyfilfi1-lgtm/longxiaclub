import Link from 'next/link';
import { ExternalLink, Heart, Share2, Download, Star, CheckCircle, GitBranch, ArrowLeft } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { skills, tools } from '@/data/tools';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

interface Props {
  params: Promise<{ id: string }>;
}

// Generate static params for all skills
export async function generateStaticParams() {
  return skills.map((skill) => ({
    id: skill.id,
  }));
}

// SEO metadata
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const skill = skills.find((s) => s.id === id);
  if (!skill) return { title: 'Skill未找到' };
  return {
    title: `${skill.name} - Skill市场 - AI导航站`,
    description: `${skill.description} | 安装${(skill.installCount / 1000).toFixed(1)}k | 成功率${skill.successRate}%`,
    openGraph: {
      title: `${skill.name} - AI Skill详情`,
      description: skill.description,
      type: 'website',
    },
  };
}

export default async function SkillDetailPage({ params }: Props) {
  const { id } = await params;
  const skill = skills.find((s) => s.id === id);
  
  if (!skill) {
    notFound();
  }

  const requiredTools = skill.dependencies
    .map((dep) => tools.find((t) => t.name === dep.name))
    .filter(Boolean);

  return (
    <main className="min-h-screen bg-slate-50 dot-pattern">
      <div className="fixed inset-0 bg-gradient-mint pointer-events-none" />
      
      <Navbar />
      
      <div className="relative pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <Link
            href="/skills"
            className="inline-flex items-center space-x-2 text-slate-500 hover:text-purple-600 transition-colors mb-8"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>返回Skill市场</span>
          </Link>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Hero Card */}
              <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-lg shadow-slate-100">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center space-x-6">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center text-5xl border border-purple-200">
                      {skill.icon}
                    </div>
                    <div>
                      <div className="flex items-center space-x-3 mb-2">
                        <h1 className="text-3xl font-bold text-slate-800">{skill.name}</h1>
                        <span className="text-xs px-3 py-1 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                          v{skill.version}
                        </span>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-100">
                          <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                          <span className="font-semibold text-amber-600">{skill.rating}</span>
                        </div>
                        <span className="text-emerald-600 font-medium">📈 +{skill.heatGrowth}%</span>
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

                {/* Description */}
                <p className="text-slate-600 mb-6 leading-relaxed text-lg">{skill.description}</p>

                {/* Meta */}
                <div className="flex flex-wrap items-center gap-3 mb-6">
                  <span className="px-4 py-2 rounded-xl bg-purple-50 text-purple-700 text-sm font-medium border border-purple-100">
                    {skill.category}
                  </span>
                  <span className={`px-4 py-2 rounded-xl text-sm font-medium border ${
                    skill.difficulty === 'beginner' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                    skill.difficulty === 'intermediate' ? 'bg-yellow-50 text-yellow-600 border-yellow-100' :
                    'bg-red-50 text-red-600 border-red-100'
                  }`}>
                    {skill.difficulty === 'beginner' ? '入门' : skill.difficulty === 'intermediate' ? '进阶' : '高级'}
                  </span>
                  <span className={`px-4 py-2 rounded-xl text-sm font-medium border ${
                    skill.price === 'free' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                    skill.price === 'member' ? 'bg-purple-50 text-purple-600 border-purple-100' :
                    'bg-orange-50 text-orange-600 border-orange-100'
                  }`}>
                    {skill.price === 'free' ? '免费' : skill.price === 'member' ? '会员专享' : `¥${skill.price}`}
                  </span>
                </div>

                {/* Install Button */}
                <button className="inline-flex items-center space-x-2 px-8 py-4 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium hover:shadow-lg hover:shadow-purple-200 transition-all">
                  <Download className="w-5 h-5" />
                  <span>一键安装</span>
                </button>
              </div>

              {/* Workflow */}
              <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-lg shadow-slate-100">
                <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center space-x-2">
                  <GitBranch className="w-5 h-5 text-purple-500" />
                  <span>⚡ 工作流程</span>
                </h2>
                <div className="space-y-4">
                  {skill.workflow.map((step, idx) => (
                    <div key={step.step} className="flex items-start space-x-4">
                      <div className="flex flex-col items-center">
                        <div className="w-10 h-10 rounded-xl bg-purple-100 border border-purple-200 flex items-center justify-center text-lg font-bold text-purple-600">
                          {step.step}
                        </div>
                        {idx < skill.workflow.length - 1 && (
                          <div className="w-px h-10 bg-slate-200 my-1" />
                        )}
                      </div>
                      <div className="flex-1 pt-2">
                        <h3 className="font-semibold text-slate-800 mb-1">{step.title}</h3>
                        <p className="text-sm text-slate-500">{step.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Input/Output */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-lg shadow-slate-100">
                  <h3 className="font-bold text-slate-800 mb-3 flex items-center space-x-2">
                    <span className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 text-sm">IN</span>
                    <span>输入</span>
                  </h3>
                  <p className="text-slate-600 text-sm">{skill.input}</p>
                </div>
                <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-lg shadow-slate-100">
                  <h3 className="font-bold text-slate-800 mb-3 flex items-center space-x-2">
                    <span className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600 text-sm">OUT</span>
                    <span>输出</span>
                  </h3>
                  <p className="text-slate-600 text-sm">{skill.output}</p>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Stats */}
              <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-lg shadow-slate-100">
                <h3 className="font-bold text-slate-800 mb-4">📊 数据统计</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50">
                    <span className="text-slate-500">安装次数</span>
                    <span className="font-bold text-slate-800">{(skill.installCount / 1000).toFixed(1)}k</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50">
                    <span className="text-slate-500">成功率</span>
                    <div className="flex items-center space-x-1">
                      <CheckCircle className="w-4 h-4 text-emerald-500" />
                      <span className="font-bold text-slate-800">{skill.successRate}%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50">
                    <span className="text-slate-500">用户评分</span>
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                      <span className="font-bold text-slate-800">{skill.rating}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Dependencies */}
              <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-lg shadow-slate-100">
                <h3 className="font-bold text-slate-800 mb-4">🔗 依赖工具</h3>
                <div className="space-y-3">
                  {skill.dependencies.map((dep) => {
                    const tool = tools.find((t) => t.name === dep.name);
                    return (
                      <div key={dep.name} className="flex items-center space-x-3 p-3 rounded-xl bg-slate-50">
                        <span className="text-2xl">{tool?.logo || '🔧'}</span>
                        <div className="flex-1">
                          <h4 className="font-medium text-slate-800 text-sm">{dep.name}</h4>
                          {dep.minVersion && (
                            <p className="text-xs text-slate-500">最低版本: {dep.minVersion}</p>
                          )}
                        </div>
                        {dep.optional && (
                          <span className="text-xs px-2 py-1 rounded-full bg-slate-200 text-slate-600">
                            可选
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Compatibility */}
              <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-lg shadow-slate-100">
                <h3 className="font-bold text-slate-800 mb-4">✅ 兼容平台</h3>
                <div className="flex flex-wrap gap-2">
                  {skill.compatibility.map((agent) => (
                    <span
                      key={agent}
                      className="px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-600 text-sm font-medium border border-emerald-100"
                    >
                      {agent}
                    </span>
                  ))}
                </div>
              </div>

              {/* Author */}
              <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-lg shadow-slate-100">
                <h3 className="font-bold text-slate-800 mb-4">👤 开发者</h3>
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-lg font-bold text-white">
                    {skill.author[0]}
                  </div>
                  <div>
                    <p className="font-medium text-slate-800">{skill.author}</p>
                    <p className="text-xs text-slate-500">认证开发者</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
