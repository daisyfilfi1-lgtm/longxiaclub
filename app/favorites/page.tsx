'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useFavorites } from '@/hooks/useFavorites';
import { Trash2, ExternalLink, Bookmark, ArrowLeft, Star, Flame } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { tools, skills } from '@/data/tools';

export default function FavoritesPage() {
  const [activeTab, setActiveTab] = useState<'tools' | 'skills'>('tools');
  const { favorites, isLoaded, toggleToolFavorite, toggleSkillFavorite, isToolFavorite, isSkillFavorite } = useFavorites();

  // 设置页面元数据
  useEffect(() => {
    document.title = '我的收藏 - AI导航站';
    const metaDesc = document.querySelector('meta[name="description"]') || document.createElement('meta');
    metaDesc.setAttribute('name', 'description');
    metaDesc.setAttribute('content', '管理你收藏的AI工具和Skill，快速访问感兴趣的AI资源。');
    if (!metaDesc.parentNode) document.head.appendChild(metaDesc);
    
    // OG tags
    const setOG = (prop: string, content: string) => {
      const el = document.querySelector(`meta[property="${prop}"]`) || document.createElement('meta');
      el.setAttribute('property', prop);
      el.setAttribute('content', content);
      if (!el.parentNode) document.head.appendChild(el);
    };
    setOG('og:title', '我的收藏 - AI导航站');
    setOG('og:description', '管理你收藏的AI工具和Skill。');
    setOG('og:url', 'https://longxiaclub.com/favorites');
    setOG('og:type', 'website');
    setOG('og:image', 'https://longxiaclub.com/og-image.png');
    
    // Twitter
    const setTW = (name: string, content: string) => {
      const el = document.querySelector(`meta[name="${name}"]`) || document.createElement('meta');
      el.setAttribute('name', name);
      el.setAttribute('content', content);
      if (!el.parentNode) document.head.appendChild(el);
    };
    setTW('twitter:card', 'summary_large_image');
    setTW('twitter:title', '我的收藏 - AI导航站');
    setTW('twitter:description', '管理你收藏的AI工具和Skill。');
    setTW('twitter:image', 'https://longxiaclub.com/og-image.png');
    
    // Canonical
    const canon = document.querySelector('link[rel="canonical"]') || document.createElement('link');
    canon.setAttribute('rel', 'canonical');
    canon.setAttribute('href', 'https://longxiaclub.com/favorites');
    if (!canon.parentNode) document.head.appendChild(canon);
  }, []);

  // 过滤出收藏的工具和技能
  const favoriteTools = tools.filter(t => favorites.tools.includes(t.id));
  const favoriteSkills = skills.filter(s => favorites.skills.includes(s.id));

  // 未加载时显示加载状态
  if (!isLoaded) {
    return (
      <main className="min-h-screen bg-slate-50 dot-pattern">
        <Navbar />
        <div className="pt-32 text-center">
          <div className="w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-slate-500">加载中...</p>
        </div>
      </main>
    );
  }

  const tabs = [
    { id: 'tools' as const, label: '工具', count: favoriteTools.length, icon: '🔧' },
    { id: 'skills' as const, label: 'Skill', count: favoriteSkills.length, icon: '⚡' },
  ];

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
            <p className="text-slate-500">管理你收藏的工具和Skill</p>
          </div>

          {/* Tabs */}
          <div className="flex space-x-2 bg-white p-1.5 rounded-2xl border border-slate-200 mb-8 w-fit shadow-sm">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
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
          {activeTab === 'tools' && (
            favoriteTools.length > 0 ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {favoriteTools.map((tool) => (
                  <div
                    key={tool.id}
                    className="group p-6 rounded-2xl bg-white border border-slate-200 hover:border-teal-300 hover:shadow-lg hover:shadow-teal-100 transition-all"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center text-3xl">
                        {tool.logo}
                      </div>
                      <button 
                        onClick={() => toggleToolFavorite(tool.id)}
                        className="p-2.5 rounded-xl bg-rose-50 text-rose-500 hover:bg-rose-100 transition-colors border border-rose-100"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                    <h3 className="text-lg font-bold text-slate-800 mb-2">{tool.name}</h3>
                    <p className="text-sm text-slate-500 mb-4 line-clamp-2">{tool.description}</p>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-1 px-2 py-1 rounded-full bg-amber-50 border border-amber-100">
                        <Star className="w-3 h-3 text-amber-500" />
                        <span className="text-xs font-medium text-amber-600">{tool.heat}</span>
                      </div>
                      <div className="flex items-center space-x-1 text-emerald-600">
                        <Flame className="w-3 h-3" />
                        <span className="text-xs font-medium">+{tool.heatGrowth}%</span>
                      </div>
                    </div>
                    <Link
                      href={`/tools/${tool.id}`}
                      className="inline-flex items-center space-x-1 text-teal-600 hover:text-teal-700 text-sm font-medium"
                    >
                      <span>查看详情</span>
                      <ExternalLink className="w-4 h-4" />
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState type="tools" />
            )
          )}

          {activeTab === 'skills' && (
            favoriteSkills.length > 0 ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {favoriteSkills.map((skill) => (
                  <div
                    key={skill.id}
                    className="group p-6 rounded-2xl bg-white border border-slate-200 hover:border-purple-300 hover:shadow-lg hover:shadow-purple-100 transition-all"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-14 h-14 rounded-2xl bg-purple-100 flex items-center justify-center text-3xl border border-purple-200">
                        {skill.icon}
                      </div>
                      <button 
                        onClick={() => toggleSkillFavorite(skill.id)}
                        className="p-2.5 rounded-xl bg-rose-50 text-rose-500 hover:bg-rose-100 transition-colors border border-rose-100"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                    <h3 className="text-lg font-bold text-slate-800 mb-2">{skill.name}</h3>
                    <p className="text-sm text-slate-500 mb-4 line-clamp-2">{skill.description}</p>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-1 text-amber-600">
                        <Star className="w-3 h-3" />
                        <span className="text-xs font-medium">{skill.rating}</span>
                      </div>
                      <span className="text-xs px-2 py-1 rounded-full bg-slate-100 text-slate-600">
                        {skill.difficulty === 'beginner' ? '入门' : skill.difficulty === 'intermediate' ? '进阶' : '高级'}
                      </span>
                    </div>
                    <Link
                      href={`/skills/${skill.id}`}
                      className="inline-flex items-center space-x-1 text-purple-600 hover:text-purple-700 text-sm font-medium"
                    >
                      <span>查看详情</span>
                      <ExternalLink className="w-4 h-4" />
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState type="skills" />
            )
          )}
        </div>
      </div>
    </main>
  );
}

function EmptyState({ type }: { type: 'tools' | 'skills' }) {
  return (
    <div className="text-center py-20">
      <div className="w-20 h-20 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
        <Bookmark className="w-10 h-10 text-slate-400" />
      </div>
      <h3 className="text-lg font-medium text-slate-800 mb-2">暂无收藏</h3>
      <p className="text-slate-500">去浏览并收藏你感兴趣的{type === 'tools' ? '工具' : 'Skill'}吧</p>
      <Link
        href={type === 'tools' ? '/tools' : '/skills'}
        className="inline-flex items-center space-x-2 px-6 py-3 mt-6 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-medium hover:shadow-lg hover:shadow-teal-200 transition-all"
      >
        <span>去浏览</span>
        <ExternalLink className="w-4 h-4" />
      </Link>
    </div>
  );
}