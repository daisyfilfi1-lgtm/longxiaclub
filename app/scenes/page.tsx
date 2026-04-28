'use client';

import Link from 'next/link';
import { ArrowUpRight, Bookmark, Layers, Network } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { scenes } from '@/data/tools';
import { getSceneRelations } from '@/lib/knowledge-graph';
import { useState, useMemo } from 'react';

// AI Level badge colors
const aiLevelConfig: Record<string, { label: string; bg: string; text: string; border: string }> = {
  L1: { label: '⚡L1', bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
  L2: { label: '🔵L2', bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
  L3: { label: '🟣L3', bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
  L4: { label: '🤖L4', bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200' },
};

type CategoryTab = 'all' | 'personal' | 'enterprise';

const categoryConfig: Record<string, { label: string; icon: string }> = {
  all: { label: '全部场景', icon: '📋' },
  personal: { label: '个人效率', icon: '🖥️' },
  enterprise: { label: '企业组织', icon: '🏢' },
};

export default function ScenesPage() {
  const [activeTab, setActiveTab] = useState<CategoryTab>('all');

  // 知识图谱预先计算所有场景的统计数据
  const sceneStats = Object.fromEntries(
    scenes.map(scene => {
      const rel = getSceneRelations(scene.tags[0]);
      return [scene.id, { toolCount: rel.tools.length, skillCount: rel.skills.length }];
    })
  );

  // Filter scenes by category tab
  const filteredScenes = useMemo(() => {
    if (activeTab === 'all') return scenes;
    return scenes.filter(scene => scene.category === activeTab);
  }, [activeTab]);

  // Count by category
  const counts = useMemo(() => ({
    all: scenes.length,
    personal: scenes.filter(s => s.category === 'personal').length,
    enterprise: scenes.filter(s => s.category === 'enterprise').length,
  }), []);

  return (
    <main className="min-h-screen bg-slate-50 dot-pattern">
      <div className="fixed inset-0 bg-gradient-mint pointer-events-none" />
      
      <Navbar />
      
      {/* Header */}
      <div className="relative pt-32 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto">
            <h1 className="text-4xl font-bold text-slate-800 mb-4">场景方案</h1>
            <p className="text-slate-500">基于业务场景的解决方案推荐系统，整合工具和Skill</p>
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-6">
        <div className="flex items-center justify-center space-x-3">
          {(Object.entries(categoryConfig) as [CategoryTab, { label: string; icon: string }][]).map(([key, config]) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 ${
                activeTab === key
                  ? 'bg-white shadow-lg shadow-teal-100 border border-teal-200 text-teal-700'
                  : 'bg-white/60 hover:bg-white hover:shadow-md border border-slate-200 text-slate-600 hover:text-slate-800'
              }`}
            >
              <span>{config.icon}</span>
              <span>{config.label}</span>
              <span className={`ml-1 text-xs px-2 py-0.5 rounded-full ${
                activeTab === key
                  ? 'bg-teal-100 text-teal-600'
                  : 'bg-slate-100 text-slate-500'
              }`}>
                {counts[key]}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Scenes Grid */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {filteredScenes.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-slate-400 text-lg">暂无此分类的场景方案</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredScenes.map((scene, index) => (
              <Link
                key={scene.id}
                href={`/scenes/${scene.id}`}
                className="group"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="relative overflow-hidden rounded-2xl bg-white border border-slate-200 hover:border-teal-300 hover:shadow-xl hover:shadow-teal-100 transition-all duration-300 hover:-translate-y-1">
                  {/* Gradient overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-teal-50/0 to-cyan-50/0 group-hover:from-teal-50 group-hover:to-cyan-50 transition-all duration-300" />
                  
                  {/* Cover */}
                  <div className={`relative h-48 flex items-center justify-center overflow-hidden ${
                    scene.category === 'enterprise'
                      ? 'bg-gradient-to-br from-indigo-50 via-blue-50 to-sky-50'
                      : 'bg-gradient-to-br from-teal-50 via-cyan-50 to-sky-50'
                  }`}>
                    <div className="absolute inset-0 dot-pattern opacity-20" />
                    <span className="relative text-8xl drop-shadow-lg transform group-hover:scale-110 transition-transform duration-300">
                      {scene.coverImage}
                    </span>
                    
                    {/* AI Level Badge - top right */}
                    <div className={`absolute top-3 right-3 px-2.5 py-1 rounded-full font-bold text-xs border shadow-sm ${
                      aiLevelConfig[scene.aiLevel]?.bg || 'bg-slate-50'
                    } ${
                      aiLevelConfig[scene.aiLevel]?.text || 'text-slate-600'
                    } ${
                      aiLevelConfig[scene.aiLevel]?.border || 'border-slate-200'
                    }`}>
                      {aiLevelConfig[scene.aiLevel]?.label || scene.aiLevel}
                    </div>

                    {/* Category Badge - top left */}
                    <div className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-medium border shadow-sm ${
                      scene.category === 'enterprise'
                        ? 'bg-indigo-50 text-indigo-600 border-indigo-200'
                        : 'bg-teal-50 text-teal-600 border-teal-200'
                    }`}>
                      {scene.category === 'enterprise' ? '🏢 企业组织' : '🖥️ 个人效率'}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="relative p-6">
                    <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-teal-600 transition-colors">
                      {scene.name}
                    </h3>
                    <p className="text-sm text-slate-500 mb-4">{scene.description}</p>

                    {/* Stats — 知识图谱自动计算 */}
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="flex items-center space-x-1.5 text-sm text-slate-500">
                        <Layers className="w-4 h-4" />
                        <span className="font-semibold text-slate-800">{sceneStats[scene.id]?.toolCount || scene.toolCount}</span>
                        <span>工具</span>
                      </div>
                      <div className="flex items-center space-x-1.5 text-sm text-slate-500">
                        <Network className="w-4 h-4" />
                        <span className="font-semibold text-slate-800">{sceneStats[scene.id]?.skillCount || scene.skillCount}</span>
                        <span>Skill</span>
                      </div>
                    </div>

                    {/* XHS Saves */}
                    <div className="flex items-center space-x-2 mb-4 p-3 rounded-xl bg-rose-50 border border-rose-100">
                      <Bookmark className="w-4 h-4 text-rose-500" />
                      <span className="text-sm text-rose-600">
                        已被 <span className="font-semibold text-slate-800">{(scene.xhsSaves / 1000).toFixed(1)}k</span> 人收藏
                      </span>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2">
                      {scene.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-xs px-2.5 py-1 rounded-full bg-slate-100 text-slate-600"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* CTA */}
                    <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-sm text-slate-500 group-hover:text-teal-600 transition-colors">查看方案</span>
                      <ArrowUpRight className="w-5 h-5 text-slate-400 group-hover:text-teal-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
