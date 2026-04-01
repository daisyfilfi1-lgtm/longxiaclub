'use client';

import Link from 'next/link';
import { TrendingUp, Zap, ArrowUpRight, Star, Download, Flame } from 'lucide-react';
import { tools, skills } from '@/data/tools';

export default function Leaderboard() {
  // Sort by heat growth
  const topTools = [...tools]
    .sort((a, b) => b.heatGrowth - a.heatGrowth)
    .slice(0, 5);

  const topSkills = [...skills]
    .sort((a, b) => b.heatGrowth - a.heatGrowth)
    .slice(0, 5);

  return (
    <section className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Product Leaderboard */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-lg shadow-slate-100 overflow-hidden">
            {/* Header */}
            <div className="p-6 border-b border-slate-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center shadow-lg shadow-orange-100">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-800">产品飙升榜</h3>
                    <p className="text-sm text-slate-500">本周热度增长最快</p>
                  </div>
                </div>
                <Link
                  href="/tools?sort=trending"
                  className="p-2 rounded-xl bg-slate-50 text-slate-400 hover:text-teal-600 hover:bg-teal-50 transition-all"
                >
                  <ArrowUpRight className="w-5 h-5" />
                </Link>
              </div>
            </div>

            {/* List */}
            <div className="divide-y divide-slate-100">
              {topTools.map((tool, index) => (
                <Link
                  key={tool.id}
                  href={`/tools/${tool.id}`}
                  className="flex items-center p-4 hover:bg-slate-50 transition-colors group"
                >
                  {/* Rank */}
                  <div className="w-10 flex justify-center">
                    {index < 3 ? (
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm font-bold ${
                        index === 0 ? 'bg-gradient-to-br from-yellow-400 to-orange-500 text-white shadow-lg shadow-orange-100' :
                        index === 1 ? 'bg-gradient-to-br from-slate-300 to-slate-400 text-slate-800' :
                        'bg-gradient-to-br from-amber-500 to-amber-600 text-white'
                      }`}>
                        {index + 1}
                      </div>
                    ) : (
                      <span className="text-lg font-semibold text-slate-400">{index + 1}</span>
                    )}
                  </div>

                  {/* Icon */}
                  <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-2xl ml-3 mr-4 group-hover:bg-teal-50 transition-colors">
                    {tool.logo}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-semibold text-slate-800 group-hover:text-teal-600 transition-colors truncate">
                        {tool.name}
                      </h4>
                    </div>
                    <p className="text-sm text-slate-500 truncate">{tool.description.slice(0, 25)}...</p>
                  </div>

                  {/* Growth */}
                  <div className="flex items-center space-x-1 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-100 ml-3">
                    <Flame className="w-3.5 h-3.5 text-emerald-500" />
                    <span className="text-sm font-medium text-emerald-600">+{tool.heatGrowth}%</span>
                  </div>
                </Link>
              ))}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-slate-100">
              <Link
                href="/tools"
                className="flex items-center justify-center space-x-2 text-sm text-slate-500 hover:text-teal-600 transition-colors"
              >
                <span>查看全部工具</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Skill Leaderboard */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-lg shadow-slate-100 overflow-hidden">
            {/* Header */}
            <div className="p-6 border-b border-slate-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-100">
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-800">Skill热门榜</h3>
                    <p className="text-sm text-slate-500">本周安装/使用最多</p>
                  </div>
                </div>
                <Link
                  href="/skills?sort=trending"
                  className="p-2 rounded-xl bg-slate-50 text-slate-400 hover:text-purple-600 hover:bg-purple-50 transition-all"
                >
                  <ArrowUpRight className="w-5 h-5" />
                </Link>
              </div>
            </div>

            {/* List */}
            <div className="divide-y divide-slate-100">
              {topSkills.map((skill, index) => (
                <Link
                  key={skill.id}
                  href={`/skills/${skill.id}`}
                  className="flex items-center p-4 hover:bg-slate-50 transition-colors group"
                >
                  {/* Rank */}
                  <div className="w-10 flex justify-center">
                    {index < 3 ? (
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm font-bold ${
                        index === 0 ? 'bg-gradient-to-br from-yellow-400 to-orange-500 text-white shadow-lg shadow-orange-100' :
                        index === 1 ? 'bg-gradient-to-br from-slate-300 to-slate-400 text-slate-800' :
                        'bg-gradient-to-br from-amber-500 to-amber-600 text-white'
                      }`}>
                        {index + 1}
                      </div>
                    ) : (
                      <span className="text-lg font-semibold text-slate-400">{index + 1}</span>
                    )}
                  </div>

                  {/* Icon */}
                  <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-2xl ml-3 mr-4 group-hover:bg-purple-50 transition-colors">
                    {skill.icon}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-semibold text-slate-800 group-hover:text-purple-600 transition-colors truncate">
                        {skill.name}
                      </h4>
                    </div>
                    <p className="text-sm text-slate-500 truncate">{skill.description.slice(0, 25)}...</p>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center space-x-3 ml-3">
                    <div className="flex items-center space-x-1 px-2.5 py-1 rounded-full bg-blue-50 border border-blue-100">
                      <Star className="w-3 h-3 text-blue-500" />
                      <span className="text-xs font-medium text-blue-600">{skill.successRate}%</span>
                    </div>
                    <div className="flex items-center space-x-1 text-slate-400">
                      <Download className="w-3.5 h-3.5" />
                      <span className="text-xs">{(skill.installCount / 1000).toFixed(1)}k</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-slate-100">
              <Link
                href="/skills"
                className="flex items-center justify-center space-x-2 text-sm text-slate-500 hover:text-purple-600 transition-colors"
              >
                <span>查看全部Skill</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
