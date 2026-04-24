'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { TrendingUp, Zap, ArrowUpRight, Star, Download, Flame } from 'lucide-react';
import { Tool, Skill } from '@/types';

interface LeaderboardData {
  tools: Tool[];
  skills: Skill[];
  loading: boolean;
  error: string | null;
}

export default function Leaderboard() {
  const [data, setData] = useState<LeaderboardData>({
    tools: [],
    skills: [],
    loading: true,
    error: null
  });

  useEffect(() => {
    let cancelled = false;

    // 超时保护：8秒后自动停止 loading
    const timeoutId = setTimeout(() => {
      if (!cancelled) {
        setData(prev => ({
          ...prev,
          loading: false,
          error: '加载超时，请稍后重试'
        }));
      }
    }, 8000);

    // 并行获取工具和技能数据
    Promise.all([
      fetch('/api/leaderboard?type=tools&limit=5').then(r => {
        if (!r.ok) throw new Error(`Tools API: ${r.status}`);
        return r.json();
      }),
      fetch('/api/leaderboard?type=skills&limit=5').then(r => {
        if (!r.ok) throw new Error(`Skills API: ${r.status}`);
        return r.json();
      })
    ])
      .then(([toolsRes, skillsRes]) => {
        if (cancelled) return;
        clearTimeout(timeoutId);
        setData({
          tools: toolsRes?.success ? (toolsRes.data || []).slice(0, 5) : [],
          skills: skillsRes?.success ? (skillsRes.data || []).slice(0, 5) : [],
          loading: false,
          error: null
        });
      })
      .catch(error => {
        if (cancelled) return;
        clearTimeout(timeoutId);
        console.error('Failed to fetch leaderboard:', error);
        setData({
          tools: [],
          skills: [],
          loading: false,
          error: '加载失败，请刷新页面重试'
        });
      });

    return () => {
      cancelled = true;
      clearTimeout(timeoutId);
    };
  }, []);

  if (data.loading) {
    return (
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8">
            {[1, 2].map((i) => (
              <div key={i} className="bg-white rounded-3xl border border-slate-200 shadow-lg p-6">
                <div className="animate-pulse">
                  <div className="h-12 bg-slate-200 rounded-2xl mb-6"></div>
                  <div className="space-y-4">
                    {[1, 2, 3, 4, 5].map((j) => (
                      <div key={j} className="h-16 bg-slate-100 rounded-xl"></div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (data.error) {
    return (
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12 bg-white rounded-3xl border border-slate-200">
            <p className="text-slate-500">{data.error}</p>
          </div>
        </div>
      </section>
    );
  }

  const topTools = data.tools.slice(0, 5);
  const topSkills = data.skills.slice(0, 5);

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
              {topTools.length === 0 ? (
                <div className="p-8 text-center text-slate-400">暂无数据</div>
              ) : (
                topTools.map((tool, index) => (
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
                      <p className="text-sm text-slate-500 truncate">{tool.description?.slice(0, 25)}...</p>
                    </div>

                    {/* Growth */}
                    <div className="flex items-center space-x-1 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-100 ml-3">
                      <Flame className="w-3.5 h-3.5 text-emerald-500" />
                      <span className="text-sm font-medium text-emerald-600">+{tool.heatGrowth || 0}%</span>
                    </div>
                  </Link>
                ))
              )}
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
              {topSkills.length === 0 ? (
                <div className="p-8 text-center text-slate-400">暂无数据</div>
              ) : (
                topSkills.map((skill, index) => (
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
                      <p className="text-sm text-slate-500 truncate">{skill.description?.slice(0, 25)}...</p>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center space-x-3 ml-3">
                      <div className="flex items-center space-x-1 px-2.5 py-1 rounded-full bg-blue-50 border border-blue-100">
                        <Star className="w-3 h-3 text-blue-500" />
                        <span className="text-xs font-medium text-blue-600">{skill.successRate || 90}%</span>
                      </div>
                      <div className="flex items-center space-x-1 text-slate-400">
                        <Download className="w-3.5 h-3.5" />
                        <span className="text-xs">{((skill.installCount || 0) / 1000).toFixed(1)}k</span>
                      </div>
                    </div>
                  </Link>
                ))
              )}
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
