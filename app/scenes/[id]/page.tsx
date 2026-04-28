import Link from 'next/link';
import { ArrowLeft, ArrowRight, Bookmark, CheckCircle, Zap, Wrench, Layers, Sparkles, Network, ExternalLink, Clock, User } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { scenes, tools, skills } from '@/data/tools';
import { getSceneRelations } from '@/lib/knowledge-graph';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { generateBreadcrumbJsonLd, HOME_CRUMB, SCENES_LIST_CRUMB } from '@/lib/breadcrumb';

interface Props {
  params: Promise<{ id: string }>;
}

// AI Level badge config
const aiLevelConfig: Record<string, { label: string; bg: string; text: string; border: string }> = {
  L1: { label: '⚡L1 · 基础入门', bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
  L2: { label: '🔵L2 · 标准提效', bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
  L3: { label: '🟣L3 · 专业进阶', bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
  L4: { label: '🤖L4 · 前沿高阶', bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200' },
};

// Category badge config
const categoryConfig: Record<string, { label: string; icon: string; bg: string; text: string; border: string }> = {
  personal: { label: '个人效率', icon: '🖥️', bg: 'bg-teal-50', text: 'text-teal-700', border: 'border-teal-200' },
  enterprise: { label: '企业组织', icon: '🏢', bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200' },
};

// Generate static params for all scenes
export async function generateStaticParams() {
  return scenes.map((scene) => ({
    id: scene.id,
  }));
}

// SEO metadata
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const scene = scenes.find((s) => s.id === id);
  if (!scene) return { title: '场景未找到' };
  return {
    title: `${scene.name} - 场景方案 - AI导航站`,
    description: `${scene.description} | ${scene.toolCount}款工具 | ${scene.skillCount}个Skill | ${(scene.xhsSaves / 1000).toFixed(1)}k人收藏`,
    keywords: [...scene.tags, scene.name, 'AI场景', 'AI工具', '人工智能'],
    openGraph: {
      title: `${scene.name} - AI应用场景`,
      description: scene.description,
      type: 'website',
      url: `https://longxiaclub.com/scenes/${scene.id}`,
      images: [{ url: 'https://longxiaclub.com/og-image.png', width: 1200, height: 630 }],
      siteName: 'AI导航站',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${scene.name} - AI应用场景`,
      description: scene.description,
      images: ['https://longxiaclub.com/og-image.png'],
    },
    alternates: {
      canonical: `/scenes/${scene.id}`,
    },
  };
}

export default async function SceneDetailPage({ params }: Props) {
  const { id } = await params;
  const scene = scenes.find((s) => s.id === id);
  
  if (!scene) {
    notFound();
  }

  // 知识图谱自动计算关联 — use scene.name as the matching key for sceneTags
  const sceneRelations = getSceneRelations(scene.name);
  const sceneTools = sceneRelations.tools.slice(0, 6);
  const sceneSkills = sceneRelations.skills.slice(0, 4);
  const actualToolCount = sceneRelations.tools.length;
  const actualSkillCount = sceneRelations.skills.length;

  const levelCfg = aiLevelConfig[scene.aiLevel];
  const catCfg = categoryConfig[scene.category];

  // 构建 CollectionPage JSON-LD
  const collectionJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `${scene.name} - AI应用场景方案`,
    description: scene.description,
    url: `https://longxiaclub.com/scenes/${scene.id}`,
    about: {
      '@type': 'Thing',
      name: scene.name,
      description: scene.description,
    },
    numberOfItems: actualToolCount + actualSkillCount,
    mainEntity: {
      '@type': 'ItemList',
      name: '相关AI工具与Skill',
      numberOfItems: actualToolCount + actualSkillCount,
      itemListElement: [
        ...sceneTools.map((t, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          item: {
            '@type': 'SoftwareApplication',
            name: t.name,
            description: t.description,
            url: `https://longxiaclub.com/tools/${t.id}`,
          }
        })),
        ...sceneSkills.map((s, i) => ({
          '@type': 'ListItem',
          position: sceneTools.length + i + 1,
          item: {
            '@type': 'TechArticle',
            name: s.name,
            description: s.description,
            url: `https://longxiaclub.com/skills/${s.id}`,
          }
        }))
      ]
    },
    keywords: [...scene.tags, scene.name, 'AI场景', 'AI工具'].join(', ')
  };

  // BreadcrumbList JSON-LD
  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    HOME_CRUMB,
    SCENES_LIST_CRUMB,
    { name: scene.name, url: `https://longxiaclub.com/scenes/${scene.id}` },
  ]);

  // FAQPage JSON-LD for scenes
  const sceneFaqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `什么是${scene.name}？`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `${scene.name}是AI导航站中的一个AI应用场景，${scene.description}，包含${actualToolCount}款AI工具和${actualSkillCount}个Skill。`
        }
      },
      {
        '@type': 'Question',
        name: `如何开始${scene.name}？`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `在${scene.name}场景中，你可以根据难度选择解决方案。入门方案推荐${scene.solutions.filter(s => s.difficulty === 'beginner').map(s => s.title).join('、') || '浏览相关工具列表'}。`
        }
      },
      {
        '@type': 'Question',
        name: `${scene.name}需要哪些工具？`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `在${scene.name}场景中，推荐使用的AI工具包括：${sceneTools.map(t => t.name).join('、')}。`
        }
      },
      {
        '@type': 'Question',
        name: `${scene.name}有哪些解决方案？`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: scene.solutions.length > 0
            ? `${scene.name}场景提供${scene.solutions.length}个解决方案：${scene.solutions.map(s => `${s.title}（${s.description}）`).join('；')}。`
            : `${scene.name}场景提供多套解决方案，可浏览相关工具和Skill组合。`
        }
      },
    ]
  };

  return (
    <main className="min-h-screen bg-slate-50 dot-pattern">
      <div className="fixed inset-0 bg-gradient-mint pointer-events-none" />
      
      <Navbar />
      
      {/* JSON-LD 结构化数据 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(sceneFaqJsonLd) }}
      />
      
      <div className="relative pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <Link
            href="/scenes"
            className="inline-flex items-center space-x-2 text-slate-500 hover:text-teal-600 transition-colors mb-8"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>返回场景方案</span>
          </Link>

          {/* Hero */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-teal-50 via-cyan-50 to-sky-50 border border-teal-100 p-8 lg:p-12 mb-8">
            <div className="absolute inset-0 dot-pattern opacity-30" />
            
            <div className="relative flex flex-col lg:flex-row items-center lg:items-start space-y-6 lg:space-y-0 lg:space-x-8">
              <div className="text-[8rem] lg:text-[10rem] leading-none drop-shadow-lg">
                {scene.coverImage}
              </div>
              <div className="text-center lg:text-left flex-1">
                <h1 className="text-4xl lg:text-5xl font-bold text-slate-800 mb-4">{scene.name}</h1>
                <p className="text-xl text-slate-600 mb-6">{scene.description}</p>
                
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3">
                  {/* Stats */}
                  <div className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-white border border-slate-200 shadow-sm">
                    <Bookmark className="w-5 h-5 text-rose-500" />
                    <span className="font-bold text-slate-800">{(scene.xhsSaves / 1000).toFixed(1)}k</span>
                    <span className="text-slate-500">人收藏使用</span>
                  </div>
                  <div className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-gradient-to-r from-teal-50 to-cyan-50 border border-teal-100 shadow-sm">
                    <Network className="w-5 h-5 text-teal-500" />
                    <span className="font-bold text-slate-800">{actualToolCount}</span>
                    <span className="text-slate-500">工具</span>
                    <span className="text-slate-300">·</span>
                    <span className="font-bold text-slate-800">{actualSkillCount}</span>
                    <span className="text-slate-500">Skill</span>
                  </div>
                  
                  {/* AI Level Badge */}
                  {levelCfg && (
                    <span className={`px-3 py-1.5 rounded-full font-bold text-xs border shadow-sm ${levelCfg.bg} ${levelCfg.text} ${levelCfg.border}`}>
                      {levelCfg.label}
                    </span>
                  )}
                  
                  {/* Category Badge */}
                  {catCfg && (
                    <span className={`px-4 py-2 rounded-xl text-sm font-medium border ${catCfg.bg} ${catCfg.text} ${catCfg.border}`}>
                      {catCfg.icon} {catCfg.label}
                    </span>
                  )}
                  
                  {/* Tags */}
                  {scene.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-4 py-2 rounded-xl bg-white/70 text-slate-700 text-sm border border-slate-200"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Solutions */}
          {scene.solutions.length > 0 && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-100">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <span>推荐方案</span>
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                {scene.solutions.map((solution) => (
                  <div
                    key={solution.id}
                    className={`relative overflow-hidden rounded-2xl border p-6 ${
                      solution.type === 'auto'
                        ? 'bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200'
                        : 'bg-white border-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <span className={`text-xs px-3 py-1 rounded-full font-medium border ${
                        solution.type === 'auto'
                          ? 'bg-purple-100 text-purple-700 border-purple-200'
                          : 'bg-blue-100 text-blue-700 border-blue-200'
                      }`}>
                        {solution.type === 'auto' ? '全自动Agent方案' : '半自动单品组合'}
                      </span>
                      <span className={`text-xs px-3 py-1 rounded-full font-medium border ${
                        solution.difficulty === 'beginner' ? 'bg-emerald-100 text-emerald-700 border-emerald-200' :
                        solution.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-700 border-yellow-200' :
                        'bg-red-100 text-red-700 border-red-200'
                      }`}>
                        {solution.difficulty === 'beginner' ? '入门' : solution.difficulty === 'intermediate' ? '进阶' : '高级'}
                      </span>
                    </div>
                    
                    <h3 className="text-xl font-bold text-slate-800 mb-2">{solution.title}</h3>
                    <p className="text-slate-600 mb-4">{solution.description}</p>
                    
                    {/* Tools */}
                    <div className="mb-4">
                      <p className="text-sm text-slate-500 mb-2">底层工具</p>
                      <div className="flex flex-wrap gap-2">
                        {solution.tools.map((tool) => (
                          <span
                            key={tool}
                            className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-sm text-slate-700"
                          >
                            {tool}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Effect */}
                    <div className="flex items-center space-x-2 text-emerald-700 bg-emerald-50 rounded-xl px-4 py-3 border border-emerald-200">
                      <CheckCircle className="w-5 h-5" />
                      <span className="font-medium">{solution.effect}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Related Tools */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-100">
                <Wrench className="w-5 h-5 text-white" />
              </div>
              <span>相关工具</span>
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {sceneTools.map((tool) => (
                <Link
                  key={tool.id}
                  href={`/tools/${tool.id}`}
                  className="flex items-center space-x-4 p-4 rounded-xl bg-white border border-slate-200 hover:border-teal-300 hover:shadow-md transition-all group"
                >
                  <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-2xl group-hover:bg-teal-50 transition-colors">
                    {tool.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-slate-800 group-hover:text-teal-600 transition-colors">{tool.name}</h3>
                    <p className="text-sm text-slate-500 truncate">{tool.description}</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-teal-500 group-hover:translate-x-1 transition-all" />
                </Link>
              ))}
            </div>
          </div>

          {/* Related Skills */}
          <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-100">
                <Layers className="w-5 h-5 text-white" />
              </div>
              <span>相关Skill</span>
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {sceneSkills.map((skill) => (
                <Link
                  key={skill.id}
                  href={`/skills/${skill.id}`}
                  className="flex items-center space-x-4 p-4 rounded-xl bg-white border border-slate-200 hover:border-purple-300 hover:shadow-md transition-all group"
                >
                  <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center text-2xl border border-purple-200">
                    {skill.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-slate-800 group-hover:text-purple-600 transition-colors">{skill.name}</h3>
                    <p className="text-sm text-slate-500 truncate">{skill.description}</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-purple-500 group-hover:translate-x-1 transition-all" />
                </Link>
              ))}
            </div>
          </div>

          {/* Case Studies */}
          {scene.caseStudies && scene.caseStudies.length > 0 && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center shadow-lg shadow-red-100">
                  <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </div>
                <span>精选案例</span>
              </h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {scene.caseStudies.map((cs, idx) => (
                  <a
                    key={idx}
                    href={cs.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative overflow-hidden rounded-2xl bg-white border border-slate-200 hover:border-red-300 hover:shadow-lg transition-all p-5 flex flex-col"
                  >
                    {/* Source badge */}
                    <div className="flex items-center justify-between mb-3">
                      <span className="inline-flex items-center space-x-1.5 text-xs px-2.5 py-1 rounded-full bg-red-50 text-red-600 border border-red-200 font-medium">
                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                        </svg>
                        <span>YouTube</span>
                      </span>
                      <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-red-500 transition-colors" />
                    </div>

                    {/* Title */}
                    <h3 className="font-semibold text-slate-800 group-hover:text-red-600 transition-colors mb-2 line-clamp-2">
                      {cs.title}
                    </h3>

                    {/* Description */}
                    <p className="text-sm text-slate-500 mb-3 line-clamp-2 flex-1">
                      {cs.description}
                    </p>

                    {/* Meta info */}
                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mt-auto pt-3 border-t border-slate-100">
                      {cs.creator && (
                        <span className="inline-flex items-center space-x-1">
                          <User className="w-3 h-3" />
                          <span>{cs.creator}</span>
                        </span>
                      )}
                      {cs.duration && (
                        <span className="inline-flex items-center space-x-1">
                          <Clock className="w-3 h-3" />
                          <span>{cs.duration}</span>
                        </span>
                      )}
                      {cs.skill && (
                        <span className="ml-auto px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-medium">
                          {cs.skill}
                        </span>
                      )}
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </main>
  );
}
