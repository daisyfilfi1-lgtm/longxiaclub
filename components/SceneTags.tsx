'use client';

import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { sceneTags } from '@/data/tools';

export default function SceneTags() {
  return (
    <section className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">场景方案</h2>
            <p className="text-slate-500">选择你的业务场景，发现最佳AI工具组合</p>
          </div>
          <Link
            href="/scenes"
            className="hidden sm:flex items-center space-x-1 text-sm text-slate-500 hover:text-teal-600 transition-colors"
          >
            <span>查看全部</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
        
        {/* Tags Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
          {sceneTags.map((tag, index) => (
            <Link
              key={tag.id}
              href={`/scenes/${tag.id}`}
              className="group"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="relative p-6 rounded-2xl bg-white border border-slate-200 hover:border-teal-300 hover:shadow-lg hover:shadow-teal-100 transition-all duration-300 hover:-translate-y-1 overflow-hidden">
                {/* Hover gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-teal-50/0 to-cyan-50/0 group-hover:from-teal-50 group-hover:to-cyan-50 transition-all duration-300" />
                
                {/* Content */}
                <div className="relative flex flex-col items-center text-center">
                  <span className="text-4xl mb-3 transform group-hover:scale-110 transition-transform duration-300">
                    {tag.icon}
                  </span>
                  <span className="text-sm font-medium text-slate-700 group-hover:text-teal-700 transition-colors">
                    {tag.name}
                  </span>
                </div>

                {/* Corner arrow */}
                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ArrowUpRight className="w-4 h-4 text-teal-500" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
