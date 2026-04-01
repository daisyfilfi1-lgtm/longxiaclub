import Link from 'next/link';
import { Search, Filter, ArrowUpRight, Star, Flame } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { tools } from '@/data/tools';

export default function ToolsPage() {
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
                className="w-full pl-12 pr-4 py-4 rounded-xl bg-white border border-slate-200 text-slate-700 placeholder-slate-400 focus:outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-100 transition-all"
              />
            </div>
            <button className="flex items-center justify-center space-x-2 px-6 py-4 rounded-xl bg-white border border-slate-200 text-slate-600 hover:border-teal-300 hover:bg-teal-50 transition-all">
              <Filter className="w-5 h-5" />
              <span>筛选</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tools Grid */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {tools.map((tool, index) => (
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
                    {tool.tags.slice(0, 2).map((tag) => (
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
      </div>
    </main>
  );
}
