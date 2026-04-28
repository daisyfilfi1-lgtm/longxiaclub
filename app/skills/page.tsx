'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Search, Filter, ArrowUpRight, Download, Star, CheckCircle, TrendingUp, Award } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { skills as localSkills } from '@/data/tools';
import type { Skill } from '@/types';

// 强制动态渲染，防止预渲染失败
export const dynamic = 'force-dynamic';

type SortBy = 'hot' | 'install' | 'rating';

export default function SkillsPage() {
  const [skills, setSkills] = useState<Skill[]>(localSkills);
  const [sortBy, setSortBy] = useState<SortBy>('hot');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // 加载数据
  useEffect(() => {
    const fetchSkills = async () => {
      setIsLoading(true);
      try {
        const res = await fetch('/api/skills');
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.data.length > 0) {
            setSkills(data.data);
          }
        }
      } catch (error) {
        console.error('Failed to fetch skills:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSkills();
  }, []);

  // JSON-LD 结构化数据注入
  useEffect(() => {
    document.title = 'Skill市场 - AI导航站 | 发现AI技能';
    const metaDesc = document.querySelector('meta[name="description"]') || document.createElement('meta');
    metaDesc.setAttribute('name', 'description');
    metaDesc.setAttribute('content', '为Agent选购可插拔的Skill组件，像App Store一样选购工作流。50+个AI Skill覆盖办公提效、内容创作、编程开发等场景。');
    if (!metaDesc.parentNode) document.head.appendChild(metaDesc);
    
    // Open Graph
    const setOG = (prop: string, content: string) => {
      const el = document.querySelector(`meta[property="${prop}"]`) || document.createElement('meta');
      el.setAttribute('property', prop);
      el.setAttribute('content', content);
      if (!el.parentNode) document.head.appendChild(el);
    };
    setOG('og:title', 'Skill市场 - AI导航站 | 发现AI技能');
    setOG('og:description', '为Agent选购可插拔的Skill组件，50+个AI Skill覆盖办公提效、内容创作、编程开发等场景。');
    setOG('og:url', 'https://longxiaclub.com/skills');
    setOG('og:type', 'website');
    setOG('og:image', 'https://longxiaclub.com/og-image.png');
    
    // Twitter Card
    const setTW = (name: string, content: string) => {
      const el = document.querySelector(`meta[name="${name}"]`) || document.createElement('meta');
      el.setAttribute('name', name);
      el.setAttribute('content', content);
      if (!el.parentNode) document.head.appendChild(el);
    };
    setTW('twitter:card', 'summary_large_image');
    setTW('twitter:title', 'Skill市场 - AI导航站 | 发现AI技能');
    setTW('twitter:description', '为Agent选购可插拔的Skill组件，50+个AI Skill覆盖多场景。');
    setTW('twitter:image', 'https://longxiaclub.com/og-image.png');
    
    // Canonical
    const canon = document.querySelector('link[rel="canonical"]') || document.createElement('link');
    canon.setAttribute('rel', 'canonical');
    canon.setAttribute('href', 'https://longxiaclub.com/skills');
    if (!canon.parentNode) document.head.appendChild(canon);
    
    // JSON-LD
    const existing = document.querySelectorAll('[data-jsonld="skills-list"]');
    existing.forEach(el => el.remove());
    
    const breadcrumbJsonLd = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'AI导航站', item: 'https://longxiaclub.com' },
        { '@type': 'ListItem', position: 2, name: 'Skill市场', item: 'https://longxiaclub.com/skills' },
      ],
    };
    
    // ItemList: list all skills
    const itemListJsonLd = {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: 'AI Skill市场',
      description: '为Agent选购可插拔的Skill组件，50+个AI Skill覆盖办公提效、内容创作、编程开发等场景。',
      url: 'https://longxiaclub.com/skills',
      numberOfItems: skills.length,
      itemListOrder: 'Descending',
      itemListElement: skills.map((s, idx) => ({
        '@type': 'ListItem',
        position: idx + 1,
        item: {
          '@type': 'HowTo',
          name: s.name,
          description: s.description,
          url: `https://longxiaclub.com/skills/${s.id}`,
        }
      })),
    };
    
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.setAttribute('data-jsonld', 'skills-list');
    script.textContent = JSON.stringify([breadcrumbJsonLd, itemListJsonLd]);
    document.head.appendChild(script);
    
    return () => {
      const toRemove = document.querySelectorAll('[data-jsonld="skills-list"]');
      toRemove.forEach(el => el.remove());
    };
  }, []);

  // 排序和过滤
  const processedSkills = [...skills]
    .filter(skill => 
      !searchQuery || 
      skill.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      skill.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      skill.category.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'hot') return (b.heatGrowth || 0) - (a.heatGrowth || 0);
      if (sortBy === 'install') return b.installCount - a.installCount;
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0;
    });

  return (
    <main className="min-h-screen bg-slate-50 dot-pattern">
      <div className="fixed inset-0 bg-gradient-mint pointer-events-none" />
      
      <Navbar />
      
      {/* Header */}
      <div className="relative pt-32 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h1 className="text-4xl font-bold text-slate-800 mb-4">Skill市场</h1>
            <p className="text-slate-500">为Agent选购可插拔的Skill组件，像App Store一样选购工作流</p>
          </div>
          
          {/* Search & Filter */}
          <div className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="搜索Skill名称、功能、场景..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-xl bg-white border border-slate-200 text-slate-700 placeholder-slate-400 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all"
              />
            </div>
            <button className="flex items-center justify-center space-x-2 px-6 py-4 rounded-xl bg-white border border-slate-200 text-slate-600 hover:border-purple-300 hover:bg-purple-50 transition-all">
              <Filter className="w-5 h-5" />
              <span>筛选</span>
            </button>
          </div>

          {/* Sort Buttons */}
          <div className="flex items-center justify-center gap-3">
            <span className="text-sm text-slate-500">排序:</span>
            <button
              onClick={() => setSortBy('hot')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                sortBy === 'hot'
                  ? 'bg-purple-100 text-purple-700 border border-purple-200'
                  : 'bg-white text-slate-600 border border-slate-200 hover:border-purple-200'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              <span>热度增长</span>
            </button>
            <button
              onClick={() => setSortBy('install')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                sortBy === 'install'
                  ? 'bg-purple-100 text-purple-700 border border-purple-200'
                  : 'bg-white text-slate-600 border border-slate-200 hover:border-purple-200'
              }`}
            >
              <Download className="w-4 h-4" />
              <span>安装量</span>
            </button>
            <button
              onClick={() => setSortBy('rating')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                sortBy === 'rating'
                  ? 'bg-purple-100 text-purple-700 border border-purple-200'
                  : 'bg-white text-slate-600 border border-slate-200 hover:border-purple-200'
              }`}
            >
              <Award className="w-4 h-4" />
              <span>评分</span>
            </button>
          </div>
        </div>
      </div>

      {/* Skills Grid */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-slate-500">加载中...</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {processedSkills.map((skill, index) => (
              <Link
                key={skill.id}
                href={`/skills/${skill.id}`}
                className="group cursor-pointer"
                style={{ animationDelay: `${index * 30}ms` }}
              >
                <div className="relative p-6 rounded-2xl bg-white border border-slate-200 hover:border-purple-300 hover:shadow-lg hover:shadow-purple-100 transition-all duration-300 hover:-translate-y-1 h-full flex flex-col">
                  {/* Hover gradient */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-50/0 to-pink-50/0 group-hover:from-purple-50 group-hover:to-pink-50 transition-all duration-300" />
                  
                  <div className="relative">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center text-3xl border border-purple-200">
                        {skill.icon}
                      </div>
                      <div className="flex items-center space-x-1 px-2.5 py-1 rounded-full bg-purple-50 border border-purple-100">
                        <Star className="w-3.5 h-3.5 text-purple-500" />
                        <span className="text-xs font-medium text-purple-600">{skill.rating}</span>
                      </div>
                    </div>

                    {/* Hot Badge */}
                    {sortBy === 'hot' && (skill.heatGrowth || 0) > 30 && (
                      <div className="absolute -top-2 -right-2 px-2 py-1 rounded-full bg-gradient-to-r from-rose-500 to-orange-500 text-white text-xs font-bold shadow-lg">
                        🔥 热门
                      </div>
                    )}

                    {/* Content */}
                    <h3 className="text-lg font-bold text-slate-800 mb-2 group-hover:text-purple-600 transition-colors">
                      {skill.name}
                    </h3>
                    <p className="text-sm text-slate-500 mb-4 line-clamp-2 flex-1">
                      {skill.description}
                    </p>

                    {/* Category Tag */}
                    <div className="mb-3">
                      <span className="text-xs px-2 py-1 rounded-full bg-slate-100 text-slate-600">
                        {skill.category}
                      </span>
                    </div>

                    {/* Workflow Steps */}
                    <div className="flex items-center space-x-2 mb-4">
                      {skill.workflow.slice(0, 3).map((step, idx) => (
                        <div key={step.step} className="flex items-center">
                          <div className="w-7 h-7 rounded-lg bg-purple-100 flex items-center justify-center text-xs font-bold text-purple-600 border border-purple-200">
                            {step.step}
                          </div>
                          {idx < 2 && <div className="w-3 h-px bg-slate-200" />}
                        </div>
                      ))}
                    </div>

                    {/* Footer */}
                    <div className="pt-4 border-t border-slate-100">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                            skill.price === 'free' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                            skill.price === 'member' ? 'bg-purple-50 text-purple-600 border border-purple-100' :
                            'bg-orange-50 text-orange-600 border border-orange-100'
                          }`}>
                            {skill.price === 'free' ? '免费' :
                             skill.price === 'member' ? '会员' : `¥${skill.price}`}
                          </span>
                          <div className="flex items-center space-x-1 text-xs text-slate-500">
                            <CheckCircle className="w-3 h-3 text-emerald-500" />
                            <span>{skill.successRate}%</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-1 text-slate-400">
                          <Download className="w-3.5 h-3.5" />
                          <span className="text-xs">{(skill.installCount / 1000).toFixed(1)}k</span>
                        </div>
                      </div>
                      
                      {/* Compatibility Tags */}
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {skill.compatibility.slice(0, 3).map((agent) => (
                          <span
                            key={agent}
                            className="text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-500"
                          >
                            {agent}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
        
        {!isLoading && processedSkills.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-500">没有找到匹配的Skill</p>
          </div>
        )}
      </div>
    </main>
  );
}
