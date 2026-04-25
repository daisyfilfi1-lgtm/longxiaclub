'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useFavorites } from '@/hooks/useFavorites';
import { ExternalLink, Heart, Share2, Copy, CheckCircle, Lightbulb, ArrowLeft, Flame, Star, Sparkles } from 'lucide-react';

import { Tool, Skill, Scene } from '@/types';
import type { Relation } from '@/lib/knowledge-graph';

interface Props {
  tool: Tool;
  relatedSkills: Skill[];
  relatedTools: Relation[];
  primaryRelatedSkills: Relation[];
}

export default function ToolDetailClient({ tool, relatedSkills, relatedTools, primaryRelatedSkills }: Props) {
  const { isLoaded, isToolFavorite, toggleToolFavorite } = useFavorites();
  const [copiedPrompt, setCopiedPrompt] = useState<string | null>(null);

  const isFavorite = isLoaded && isToolFavorite(tool.id);

  // 复制 Prompt
  const handleCopyPrompt = (promptId: string, content: string) => {
    navigator.clipboard.writeText(content);
    setCopiedPrompt(promptId);
    setTimeout(() => setCopiedPrompt(null), 2000);
  };

  // 分享功能
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${tool.name} - AI导航站`,
        text: tool.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('链接已复制到剪贴板');
    }
  };

  const priceLabel = {
    'free': '免费',
    'freemium': '免费试用',
    'paid': '付费',
    'enterprise': '企业版'
  }[tool.price] || '免费';

  const priceClass = {
    'free': 'bg-emerald-50 text-emerald-600 border border-emerald-100',
    'freemium': 'bg-blue-50 text-blue-600 border border-blue-100',
    'paid': 'bg-orange-50 text-orange-600 border border-orange-100',
    'enterprise': 'bg-purple-50 text-purple-600 border border-purple-100'
  }[tool.price] || '';

  const difficultyLabel = {
    'beginner': '入门',
    'intermediate': '进阶',
    'advanced': '高级'
  }[tool.difficulty] || '入门';

  return (
    <main className="min-h-screen bg-slate-50 dot-pattern">
      <div className="fixed inset-0 bg-gradient-mint pointer-events-none" />
      
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
                    <button 
                      onClick={() => toggleToolFavorite(tool.id)}
                      className={`p-3 rounded-xl border transition-all ${
                        isFavorite 
                          ? 'bg-rose-50 border-rose-200 text-rose-500' 
                          : 'bg-slate-50 border border-slate-200 text-slate-400 hover:text-rose-500 hover:border-rose-200 hover:bg-rose-50'
                      }`}
                    >
                      <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
                    </button>
                    <button 
                      onClick={handleShare}
                      className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-400 hover:text-slate-600 transition-all"
                    >
                      <Share2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {tool.tags.map((tag: string) => (
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
                    <span className={`px-4 py-2 rounded-xl font-medium text-sm ${priceClass}`}>
                      {priceLabel}
                    </span>
                    <span className="px-4 py-2 rounded-xl bg-slate-50 text-slate-600 text-sm border border-slate-200">
                      {difficultyLabel}
                    </span>
                  </div>
                </div>
              </div>

              {/* Scenes */}
              <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-lg shadow-slate-100">
                <h2 className="text-xl font-bold text-slate-800 mb-6">🎯 适用场景</h2>
                <div className="flex flex-wrap gap-3">
                  {tool.sceneTags.map((scene: string) => (
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

              {/* Tips - 包含原有技巧 + AI增强技巧 */}
              <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-lg shadow-slate-100">
                <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center space-x-2">
                  <Lightbulb className="w-5 h-5 text-amber-500" />
                  <span>💡 使用技巧</span>
                  {(tool as any).enhancedTips && (tool as any).enhancedTips.length > 0 && (
                    <span className="ml-2 px-2 py-0.5 text-xs bg-amber-100 text-amber-700 rounded-full">
                      AI精选
                    </span>
                  )}
                </h2>
                <div className="space-y-4">
                  {/* 原有技巧 */}
                  {tool.tips.map((tip: string, index: number) => (
                    <div key={`original-${index}`} className="flex items-start space-x-4 p-4 rounded-xl bg-slate-50">
                      <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center flex-shrink-0">
                        <CheckCircle className="w-4 h-4 text-emerald-600" />
                      </div>
                      <p className="text-slate-600 leading-relaxed">{tip}</p>
                    </div>
                  ))}
                  {/* AI增强技巧 */}
                  {(tool as any).enhancedTips?.map((tip: string, index: number) => (
                    <div key={`enhanced-${index}`} className="flex items-start space-x-4 p-4 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-100">
                      <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0">
                        <Sparkles className="w-4 h-4 text-amber-600" />
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
                  {tool.prompts.map((prompt: any) => (
                    <div key={prompt.id} className="rounded-2xl bg-slate-50 border border-slate-200 overflow-hidden">
                      <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-white">
                        <div>
                          <span className="text-xs text-slate-500 uppercase tracking-wider">{prompt.scene}</span>
                          <h3 className="font-semibold text-slate-800 mt-1">{prompt.title}</h3>
                        </div>
                        <button 
                          onClick={() => handleCopyPrompt(prompt.id, prompt.content)}
                          className={`p-2 rounded-lg transition-colors ${
                            copiedPrompt === prompt.id 
                              ? 'bg-emerald-100 text-emerald-600' 
                              : 'bg-slate-50 hover:bg-slate-100 text-slate-400'
                          }`}
                        >
                          {copiedPrompt === prompt.id ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        </button>
                      </div>
                      <div className="p-6 bg-slate-800">
                        <pre className="text-sm text-slate-300 whitespace-pre-wrap font-mono leading-relaxed">{prompt.content}</pre>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* AI Cases - 实战案例 */}
              {(tool as any).cases && (tool as any).cases.length > 0 && (
                <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-lg shadow-slate-100">
                  <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center space-x-2">
                    <Sparkles className="w-5 h-5 text-purple-500" />
                    <span>🎯 实战案例</span>
                  </h2>
                  <div className="space-y-4">
                    {(tool as any).cases.map((caseItem: any, index: number) => (
                      <div key={index} className="p-5 rounded-xl bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-100">
                        <h3 className="font-semibold text-slate-800 mb-2">{caseItem.title}</h3>
                        <p className="text-sm text-slate-600 mb-3">{caseItem.description}</p>
                        {caseItem.prompt && (
                          <div className="p-3 rounded-lg bg-slate-800">
                            <p className="text-xs text-slate-400 mb-1">Prompt:</p>
                            <pre className="text-sm text-slate-300 whitespace-pre-wrap font-mono">{caseItem.prompt.slice(0, 150)}...</pre>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* AI Guides - 教程 */}
              {(tool as any).guides && (tool as any).guides.length > 0 && (
                <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-lg shadow-slate-100">
                  <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center space-x-2">
                    <Sparkles className="w-5 h-5 text-teal-500" />
                    <span>📚 入门教程</span>
                  </h2>
                  <div className="space-y-4">
                    {(tool as any).guides.map((guide: any, index: number) => (
                      <div key={index} className="p-5 rounded-xl bg-gradient-to-r from-teal-50 to-cyan-50 border border-teal-100">
                        <h3 className="font-semibold text-slate-800 mb-3">{guide.title}</h3>
                        <ol className="space-y-2">
                          {guide.steps?.map((step: string, stepIndex: number) => (
                            <li key={stepIndex} className="flex items-start space-x-2 text-sm text-slate-600">
                              <span className="w-5 h-5 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center text-xs font-medium flex-shrink-0">
                                {stepIndex + 1}
                              </span>
                              <span>{step.replace(/^\d+\.\s*/, '')}</span>
                            </li>
                          ))}
                        </ol>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* 知识图谱推荐 — 关联 Skill */}
            {primaryRelatedSkills.length > 0 && (
              <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-lg shadow-slate-100">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-slate-800">🔗 知识图谱推荐</h3>
                  <span className="text-xs bg-purple-50 text-purple-600 px-2 py-0.5 rounded-full">
                    自动关联
                  </span>
                </div>
                <div className="space-y-3">
                  {primaryRelatedSkills.map((rel) => (
                    <Link
                      key={rel.id}
                      href={`/skills/${rel.id}`}
                      className="flex items-center space-x-3 p-3 rounded-xl bg-slate-50 hover:bg-purple-50 transition-colors group"
                    >
                      <span className="text-2xl">{rel.icon}</span>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-slate-800 text-sm group-hover:text-purple-600 transition-colors truncate">{rel.name}</h4>
                        <div className="flex items-center space-x-1 mt-0.5">
                          {rel.tags.slice(0, 2).map((tag, i) => (
                            <span key={i} className="text-[10px] bg-purple-50 text-purple-500 px-1.5 py-0.5 rounded-full">{tag}</span>
                          ))}
                          <span className="text-[10px] text-slate-400">{Math.round(rel.score * 100)}%</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* 知识图谱推荐 — 关联工具 */}
            {relatedTools.length > 0 && (
              <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-lg shadow-slate-100">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-slate-800">🎯 搭配工具</h3>
                  <span className="text-xs bg-cyan-50 text-cyan-600 px-2 py-0.5 rounded-full">
                    自动推荐
                  </span>
                </div>
                <div className="space-y-3">
                  {relatedTools.map((rel) => (
                    <Link
                      key={rel.id}
                      href={`/tools/${rel.id}`}
                      className="flex items-center space-x-3 p-3 rounded-xl bg-slate-50 hover:bg-cyan-50 transition-colors group"
                    >
                      <span className="text-2xl">{rel.icon}</span>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-slate-800 text-sm group-hover:text-cyan-600 transition-colors truncate">{rel.name}</h4>
                        <p className="text-xs text-slate-500 truncate">{rel.description?.slice(0, 30)}...</p>
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
                  {tool.techTags.map((tag: string) => (
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
                  {tool.costTags.map((tag: string) => (
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