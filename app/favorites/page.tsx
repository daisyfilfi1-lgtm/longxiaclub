'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Heart, Trash2, ExternalLink, Bookmark, ArrowLeft } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { tools, skills, scenes } from '@/data/tools';

export default function FavoritesPage() {
  const [activeTab, setActiveTab] = useState<'tools' | 'skills' | 'scenes'>('tools');

  // Mock favorites - in real app, this would come from localStorage or API
  const favoriteTools = tools.slice(0, 3);
  const favoriteSkills = skills.slice(0, 2);
  const favoriteScenes = scenes.slice(0, 2);

  return (
    <main className="min-h-screen bg-slate-50 dot-pattern">
      <div className="fixed inset-0 bg-gradient-mint pointer-events-none" />
      
      <Navbar />
      
      <div className="relative pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <Link
            href="/"
            className="inline-flex items-center space-x-2 text-slate-500 hover:text-teal-600 transition-colors mb-8"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>返回首页</span>
          </Link>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-800 mb-2">我的收藏</h1>
            <p className="text-slate-500">管理你收藏的工具、Skill和场景方案</p>
          </div>

          {/* Tabs */}
          <div className="flex space-x-2 bg-white p-1.5 rounded-2xl border border-slate-200 mb-8 w-fit shadow-sm">
            {[
              { id: 'tools', label: '工具', count: favoriteTools.length, icon: '🔧' },
              { id: 'skills', label: 'Skill', count: favoriteSkills.length, icon: '⚡' },
              { id: 'scenes', label: '场景', count: favoriteScenes.length, icon: '🎯' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-6 py-3 rounded-xl text-sm font-medium transition-all flex items-center space-x-2 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-lg'
                    : 'text-slate-600 hover:text-teal-600 hover:bg-teal-50'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
                <span className={`px-2 py-0.5 rounded-full text-xs ${
                  activeTab === tab.id ? 'bg-white/20' : 'bg-slate-100'
                }`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeTab === 'tools' && favoriteTools.map((tool) => (
              <div
                key={tool.id}
                className="group p-6 rounded-2xl bg-white border border-slate-200 hover:border-teal-300 hover:shadow-lg hover:shadow-teal-100 transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center text-3xl">
                    {tool.logo}
                  </div>
                  <button className="p-2.5 rounded-xl bg-rose-50 text-rose-500 hover:bg-rose-100 transition-colors border border-rose-100">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-2">{tool.name}</h3>
                <p className="text-sm text-slate-500 mb-4">{tool.description}</p>
                <Link
                  href={`/tools/${tool.id}`}
                  className="inline-flex items-center space-x-1 text-teal-600 hover:text-teal-700 text-sm font-medium"
                >
                  <span>查看详情</span>
                  <ExternalLink className="w-4 h-4" />
                </Link>
              </div>
            ))}

            {activeTab === 'skills' && favoriteSkills.map((skill) => (
              <div
                key={skill.id}
                className="group p-6 rounded-2xl bg-white border border-slate-200 hover:border-purple-300 hover:shadow-lg hover:shadow-purple-100 transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-14 h-14 rounded-2xl bg-purple-100 flex items-center justify-center text-3xl border border-purple-200">
                    {skill.icon}
                  </div>
                  <button className="p-2.5 rounded-xl bg-rose-50 text-rose-500 hover:bg-rose-100 transition-colors border border-rose-100">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-2">{skill.name}</h3>
                <p className="text-sm text-slate-500 mb-4">{skill.description}</p>
                <Link
                  href={`/skills/${skill.id}`}
                  className="inline-flex items-center space-x-1 text-purple-600 hover:text-purple-700 text-sm font-medium"
                >
                  <span>查看详情</span>
                  <ExternalLink className="w-4 h-4" />
                </Link>
              </div>
            ))}

            {activeTab === 'scenes' && favoriteScenes.map((scene) => (
              <div
                key={scene.id}
                className="group p-6 rounded-2xl bg-white border border-slate-200 hover:border-teal-300 hover:shadow-lg hover:shadow-teal-100 transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="text-5xl">{scene.coverImage}</div>
                  <button className="p-2.5 rounded-xl bg-rose-50 text-rose-500 hover:bg-rose-100 transition-colors border border-rose-100">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-2">{scene.name}</h3>
                <p className="text-sm text-slate-500 mb-4">{scene.description}</p>
                <Link
                  href={`/scenes/${scene.id}`}
                  className="inline-flex items-center space-x-1 text-teal-600 hover:text-teal-700 text-sm font-medium"
                >
                  <span>查看详情</span>
                  <ExternalLink className="w-4 h-4" />
                </Link>
              </div>
            ))}
          </div>

          {((activeTab === 'tools' && favoriteTools.length === 0) ||
            (activeTab === 'skills' && favoriteSkills.length === 0) ||
            (activeTab === 'scenes' && favoriteScenes.length === 0)) && (
            <div className="text-center py-20">
              <div className="w-20 h-20 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
                <Bookmark className="w-10 h-10 text-slate-400" />
              </div>
              <h3 className="text-lg font-medium text-slate-800 mb-2">暂无收藏</h3>
              <p className="text-slate-500">去浏览并收藏你感兴趣的{activeTab === 'tools' ? '工具' : activeTab === 'skills' ? 'Skill' : '场景'}吧</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
