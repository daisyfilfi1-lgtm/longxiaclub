'use client';

import Link from 'next/link';
import { useState, useEffect, useMemo } from 'react';
import { Search, Filter, X, Star, Flame } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { useTools } from '@/hooks/useApi';
import { captureError } from '@/lib/monitoring';

// 价格选项
const PRICE_OPTIONS = [
  { value: 'all', label: '全部' },
  { value: 'free', label: '免费' },
  { value: 'freemium', label: '免费试用' },
  { value: 'paid', label: '付费' },
  { value: 'enterprise', label: '企业' },
];

// 难度选项
const DIFFICULTY_OPTIONS = [
  { value: 'all', label: '全部' },
  { value: 'beginner', label: '入门' },
  { value: 'intermediate', label: '进阶' },
  { value: 'advanced', label: '高级' },
];

// 分类选项
const CATEGORY_OPTIONS = [
  '全部', 'AI对话', '图像生成', '视频生成', '办公工具', '编程开发', '音频生成', '搜索工具', '设计工具'
];

export default function ToolsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  
  // 筛选状态
  const [priceFilter, setPriceFilter] = useState('all');
  const [difficultyFilter, setDifficultyFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('全部');

  // 使用 SWR 获取数据
  const { tools, isLoading, isError, error } = useTools({ limit: 100 });

  // 错误监控
  useEffect(() => {
    if (error) {
      captureError(error, { page: 'tools' });
    }
  }, [error]);

  // 过滤工具
  const filteredTools = useMemo(() => {
    return tools.filter((tool: any) => {
      // 搜索过滤
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchName = tool.name.toLowerCase().includes(q);
        const matchDesc = tool.description.toLowerCase().includes(q);
        const matchTags = tool.tags?.some((t: string) => t.toLowerCase().includes(q));
        const matchCategory = tool.category?.toLowerCase().includes(q);
        if (!matchName && !matchDesc && !matchTags && !matchCategory) return false;
      }
      // 价格过滤
      if (priceFilter !== 'all' && tool.price !== priceFilter) return false;
      // 难度过滤
      if (difficultyFilter !== 'all' && tool.difficulty !== difficultyFilter) return false;
      // 分类过滤
      if (categoryFilter !== '全部' && tool.category !== categoryFilter) return false;
      return true;
    });
  }, [tools, searchQuery, priceFilter, difficultyFilter, categoryFilter]);

  // 清除筛选
  const clearFilters = () => {
    setPriceFilter('all');
    setDifficultyFilter('all');
    setCategoryFilter('全部');
  };

  const hasActiveFilters = priceFilter !== 'all' || difficultyFilter !== 'all' || categoryFilter !== '全部';

  if (isLoading) {
    return (
      <main className="min-h-screen bg-slate-50 dot-pattern">
        <div className="fixed inset-0 bg-gradient-mint pointer-events-none" />
        <Navbar />
        <div className="pt-32 text-center">
          <div className="w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 dot-pattern">
      <div className="fixed inset-0 bg-gradient-mint pointer-events-none" />
      
      <Navbar />
      
      {/* Header */}
      <div className="relative pt-32 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h1 className="text-4xl font-bold text-slate-800 mb-4">产品中心</h1>
            <p className="text-slate-500">发现最实用的AI工具，按热度、场景、技术分类浏览</p>
          </div>
          
          {/* Search & Filter */}
          <div className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="搜索工具名称、功能、场景..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-10 py-4 rounded-xl bg-white border border-slate-200 text-slate-700 placeholder-slate-400 focus:outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-100 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center justify-center space-x-2 px-6 py-4 rounded-xl border transition-all ${
                hasActiveFilters 
                  ? 'bg-teal-50 border-teal-300 text-teal-600' 
                  : 'bg-white border-slate-200 text-slate-600 hover:border-teal-300 hover:bg-teal-50'
              }`}
            >
              <Filter className="w-5 h-5" />
              <span>筛选</span>
              {hasActiveFilters && (
                <span className="ml-1 px-2 py-0.5 text-xs bg-teal-500 text-white rounded-full">
                  {[priceFilter !== 'all', difficultyFilter !== 'all', categoryFilter !== '全部'].filter(Boolean).length}
                </span>
              )}
            </button>
          </div>

          {/* 筛选面板 */}
          {showFilters && (
            <div className="mt-6 p-6 rounded-2xl bg-white border border-slate-200 shadow-lg">
              <div className="grid sm:grid-cols-3 gap-6">
                {/* 价格筛选 */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-3">价格</label>
                  <div className="flex flex-wrap gap-2">
                    {PRICE_OPTIONS.map(opt => (
                      <button
                        key={opt.value}
                        onClick={() => setPriceFilter(opt.value)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                          priceFilter === opt.value
                            ? 'bg-teal-500 text-white'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 难度筛选 */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-3">难度</label>
                  <div className="flex flex-wrap gap-2">
                    {DIFFICULTY_OPTIONS.map(opt => (
                      <button
                        key={opt.value}
                        onClick={() => setDifficultyFilter(opt.value)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                          difficultyFilter === opt.value
                            ? 'bg-teal-500 text-white'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 分类筛选 */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-3">分类</label>
                  <div className="flex flex-wrap gap-2">
                    {CATEGORY_OPTIONS.map(cat => (
                      <button
                        key={cat}
                        onClick={() => setCategoryFilter(cat)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                          categoryFilter === cat
                            ? 'bg-teal-500 text-white'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* 清除筛选 */}
              {hasActiveFilters && (
                <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end">
                  <button
                    onClick={clearFilters}
                    className="text-sm text-slate-500 hover:text-teal-600 transition-colors"
                  >
                    清除筛选
                  </button>
                </div>
              )}
            </div>
          )}

          {/* 搜索结果提示 */}
          {searchQuery && (
            <div className="mt-4 text-center text-sm text-slate-500">
              找到 <span className="font-semibold text-teal-600">{filteredTools.length}</span> 个结果
            </div>
          )}
        </div>
      </div>

      {/* Tools Grid */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {filteredTools.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-slate-500 mb-4">没有找到匹配的工具</p>
            <button 
              onClick={() => { setSearchQuery(''); clearFilters(); }}
              className="text-teal-600 hover:underline"
            >
              清除筛选条件
            </button>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredTools.map((tool: any, index: number) => (
              <Link
                key={tool.id}
                href={`/tools/${tool.id}`}
                className="group"
                style={{ animationDelay: `${index * 30}ms` }}
              >
                <div className="relative p-6 rounded-2xl bg-white border border-slate-200 hover:border-teal-300 hover:shadow-lg hover:shadow-teal-100 transition-all duration-300 hover:-translate-y-1 h-full flex flex-col">
                  {/* Hover gradient */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-teal-50/0 to-cyan-50/0 group-hover:from-teal-50 group-hover:to-cyan-50 transition-all duration-300" />
                  
                  <div className="relative">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center text-3xl group-hover:bg-white transition-colors">
                        {tool.logo}
                      </div>
                      <div className="flex items-center space-x-1 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-100">
                        <Star className="w-3.5 h-3.5 text-amber-500" />
                        <span className="text-xs font-medium text-amber-600">{tool.heat}</span>
                      </div>
                    </div>

                    {/* Content */}
                    <h3 className="text-lg font-bold text-slate-800 mb-2 group-hover:text-teal-600 transition-colors">
                      {tool.name}
                    </h3>
                    <p className="text-sm text-slate-500 mb-4 line-clamp-2 flex-1">
                      {tool.description}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {tool.tags?.slice(0, 2).map((tag: string) => (
                        <span
                          key={tag}
                          className="text-xs px-2.5 py-1 rounded-full bg-slate-100 text-slate-600"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                      <div className="flex items-center space-x-2">
                        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                          tool.price === 'free' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                          tool.price === 'freemium' ? 'bg-blue-50 text-blue-600 border border-blue-100' :
                          tool.price === 'paid' ? 'bg-orange-50 text-orange-600 border border-orange-100' :
                          'bg-purple-50 text-purple-600 border border-purple-100'
                        }`}>
                          {tool.price === 'free' ? '免费' :
                           tool.price === 'freemium' ? '免费试用' :
                           tool.price === 'paid' ? '付费' : '企业'}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1 text-emerald-600">
                        <Flame className="w-3.5 h-3.5" />
                        <span className="text-xs font-medium">+{tool.heatGrowth}%</span>
                      </div>
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
