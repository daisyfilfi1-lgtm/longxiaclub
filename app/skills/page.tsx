import Link from 'next/link';
import { Search, Filter, ArrowUpRight, Download, Star, CheckCircle } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { skills } from '@/data/tools';

export default function SkillsPage() {
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
          <div className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="搜索Skill名称、功能、场景..."
                className="w-full pl-12 pr-4 py-4 rounded-xl bg-white border border-slate-200 text-slate-700 placeholder-slate-400 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all"
              />
            </div>
            <button className="flex items-center justify-center space-x-2 px-6 py-4 rounded-xl bg-white border border-slate-200 text-slate-600 hover:border-purple-300 hover:bg-purple-50 transition-all">
              <Filter className="w-5 h-5" />
              <span>筛选</span>
            </button>
          </div>
        </div>
      </div>

      {/* Skills Grid */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {skills.map((skill, index) => (
            <Link
              key={skill.id}
              href={`/skills/${skill.id}`}
              className="group"
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

                  {/* Content */}
                  <h3 className="text-lg font-bold text-slate-800 mb-2 group-hover:text-purple-600 transition-colors">
                    {skill.name}
                  </h3>
                  <p className="text-sm text-slate-500 mb-4 line-clamp-2 flex-1">
                    {skill.description}
                  </p>

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
      </div>
    </main>
  );
}
