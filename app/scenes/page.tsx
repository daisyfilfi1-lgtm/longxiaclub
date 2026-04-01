import Link from 'next/link';
import { ArrowUpRight, Bookmark, Layers } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { scenes } from '@/data/tools';

export default function ScenesPage() {
  return (
    <main className="min-h-screen bg-slate-50 dot-pattern">
      <div className="fixed inset-0 bg-gradient-mint pointer-events-none" />
      
      <Navbar />
      
      {/* Header */}
      <div className="relative pt-32 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto">
            <h1 className="text-4xl font-bold text-slate-800 mb-4">场景方案</h1>
            <p className="text-slate-500">基于业务场景的解决方案推荐系统，整合工具和Skill</p>
          </div>
        </div>
      </div>

      {/* Scenes Grid */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {scenes.map((scene, index) => (
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
                <div className="relative h-48 bg-gradient-to-br from-teal-50 via-cyan-50 to-sky-50 flex items-center justify-center overflow-hidden">
                  <div className="absolute inset-0 dot-pattern opacity-20" />
                  <span className="relative text-8xl drop-shadow-lg transform group-hover:scale-110 transition-transform duration-300">
                    {scene.coverImage}
                  </span>
                </div>

                {/* Content */}
                <div className="relative p-6">
                  <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-teal-600 transition-colors">
                    {scene.name}
                  </h3>
                  <p className="text-sm text-slate-500 mb-4">{scene.description}</p>

                  {/* Stats */}
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="flex items-center space-x-1.5 text-sm text-slate-500">
                      <Layers className="w-4 h-4" />
                      <span className="font-semibold text-slate-800">{scene.toolCount}</span>
                      <span>工具</span>
                    </div>
                    <div className="flex items-center space-x-1.5 text-sm text-slate-500">
                      <span className="font-semibold text-slate-800">{scene.skillCount}</span>
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
      </div>
    </main>
  );
}
