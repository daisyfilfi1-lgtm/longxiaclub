'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, ArrowUpRight, Sparkles, Bookmark } from 'lucide-react';
import { dailyPicks } from '@/data/tools';

export default function DailyPick() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentPick = dailyPicks[currentIndex];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? dailyPicks.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === dailyPicks.length - 1 ? 0 : prev + 1));
  };

  return (
    <section className="relative py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-100">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800">今日精选</h2>
          </div>
          
          {/* Navigation Arrows */}
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrev}
              className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-500 hover:text-teal-600 hover:border-teal-300 hover:shadow-md transition-all"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNext}
              className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-500 hover:text-teal-600 hover:border-teal-300 hover:shadow-md transition-all"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Main Card */}
        <div className="relative overflow-hidden rounded-3xl bg-white border border-slate-200 shadow-xl shadow-slate-100">
          {/* Gradient accent */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-teal-400 via-cyan-500 to-sky-500" />
          
          <div className="grid lg:grid-cols-2 gap-0">
            {/* Left: Visual */}
            <div className="relative p-8 lg:p-12 flex items-center justify-center min-h-[320px] lg:min-h-[400px] bg-gradient-to-br from-teal-50 via-cyan-50 to-sky-50">
              {/* Background decoration */}
              <div className="absolute inset-0 dot-pattern opacity-30" />
              
              {/* Icon container */}
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-teal-300/30 to-cyan-300/30 blur-3xl rounded-full" />
                <div className="relative text-[10rem] lg:text-[12rem] leading-none animate-fade-in drop-shadow-lg">
                  {currentPick.coverImage}
                </div>
              </div>
            </div>

            {/* Right: Content */}
            <div className="p-8 lg:p-12 flex flex-col justify-center border-t lg:border-t-0 lg:border-l border-slate-100">
              {/* Date badge */}
              <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-teal-50 border border-teal-100 w-fit mb-6">
                <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
                <span className="text-sm text-teal-700">每日更新 · {currentPick.date}</span>
              </div>

              {/* Title & Description */}
              <h3 className="text-3xl lg:text-4xl font-bold text-slate-800 mb-4 leading-tight">
                {currentPick.sceneName}
              </h3>
              <p className="text-lg text-slate-500 mb-8 leading-relaxed">
                {currentPick.description}
              </p>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <p className="text-2xl font-bold text-slate-800 mb-1">{currentPick.toolCount}</p>
                  <p className="text-sm text-slate-500">个工具</p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <p className="text-2xl font-bold text-slate-800 mb-1">{currentPick.skillCount}</p>
                  <p className="text-sm text-slate-500">个Skill</p>
                </div>
                <div className="p-4 rounded-2xl bg-gradient-to-br from-rose-50 to-pink-50 border border-rose-100">
                  <div className="flex items-center space-x-1 mb-1">
                    <Bookmark className="w-4 h-4 text-rose-500" />
                    <p className="text-2xl font-bold text-slate-800">{(currentPick.xhsSaves / 10000).toFixed(1)}万</p>
                  </div>
                  <p className="text-sm text-rose-600">人收藏</p>
                </div>
              </div>

              {/* CTA */}
              <Link
                href={`/scenes/${currentPick.sceneId}`}
                className="inline-flex items-center justify-center space-x-2 px-8 py-4 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-medium hover:shadow-lg hover:shadow-teal-200 transition-all group"
              >
                <span>查看完整方案</span>
                <ArrowUpRight className="w-5 h-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>
            </div>
          </div>
        </div>

        {/* Pagination Dots */}
        <div className="flex justify-center space-x-2 mt-6">
          {dailyPicks.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentIndex 
                  ? 'w-8 bg-gradient-to-r from-teal-400 to-cyan-500' 
                  : 'w-2 bg-slate-300 hover:bg-slate-400'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
