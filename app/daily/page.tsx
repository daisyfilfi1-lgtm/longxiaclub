import type { Metadata } from 'next';
import reports from '@/data/daily-reports/index';
import Link from 'next/link';
import { Newspaper, Calendar, ArrowRight, Sparkles } from 'lucide-react';

export const metadata: Metadata = {
  title: 'AI日报 — 每日AI前沿资讯',
  description: '每日精选AI前沿论文、大厂动态、社区风向和深度解读，覆盖S/A/B/C/D五级内容体系，助你快速掌握AI行业脉动。',
  openGraph: {
    title: 'AI日报 — 每日AI前沿资讯 | AI导航站',
    description: '每日精选AI前沿论文、大厂动态、社区风向和深度解读，覆盖S/A/B/C/D五级内容体系。',
    type: 'website',
    url: 'https://longxiaclub.com/daily',
  },
  twitter: {
    title: 'AI日报 — 每日AI前沿资讯 | AI导航站',
    description: '每日精选AI前沿论文、大厂动态、社区风向和深度解读。',
  },
  keywords: ['AI日报', 'AI前沿', 'AI论文', '每日AI资讯', 'AI导航站日报'],
};

const levelColors: Record<string, { bg: string; text: string; label: string }> = {
  S: { bg: 'bg-purple-100', text: 'text-purple-700', label: '前沿' },
  A: { bg: 'bg-blue-100', text: 'text-blue-700', label: '社区' },
  B: { bg: 'bg-green-100', text: 'text-green-700', label: '深度' },
  C: { bg: 'bg-amber-100', text: 'text-amber-700', label: '实战' },
  D: { bg: 'bg-rose-100', text: 'text-rose-700', label: '中文' },
};

function BreadcrumbJsonLd() {
  const json = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    name: '面包屑导航',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'AI导航站', item: 'https://longxiaclub.com' },
      { '@type': 'ListItem', position: 2, name: 'AI日报', item: 'https://longxiaclub.com/daily' },
    ],
  };
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }} />
  );
}

function CollectionPageJsonLd() {
  const json = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'AI日报存档',
    description: '每日精选AI前沿论文、大厂动态、社区风向和深度解读',
    url: 'https://longxiaclub.com/daily',
    about: {
      '@type': 'Thing',
      name: '人工智能',
    },
  };
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }} />
  );
}

export default function DailyArchivePage() {
  return (
    <main className="min-h-screen bg-slate-50 dot-pattern">
      <div className="fixed inset-0 bg-gradient-mint pointer-events-none" />
      
      <BreadcrumbJsonLd />
      <CollectionPageJsonLd />

      {/* Navbar placeholder — same spacing */}
      <div className="h-16" />

      <div className="relative pt-8 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center shadow-lg shadow-teal-200">
              <Newspaper className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-800">AI日报</h1>
              <p className="text-slate-500 text-sm mt-1">每日精选AI前沿资讯 · 五级内容体系 · Daisy AI Agent 自动生成</p>
            </div>
          </div>

          {/* Level legend */}
          <div className="flex flex-wrap gap-2 mt-6 mb-8">
            {Object.entries(levelColors).map(([level, colors]) => (
              <span
                key={level}
                className={`inline-flex items-center space-x-1 px-3 py-1.5 rounded-full text-xs font-medium ${colors.bg} ${colors.text}`}
              >
                <span className="font-bold">{level}</span>
                <span>/{colors.label}</span>
              </span>
            ))}
          </div>

          {/* Reports list */}
          <div className="space-y-4">
            {reports.map((report) => (
              <Link
                key={report.date}
                href={`/daily/${report.date}`}
                className="group block p-6 rounded-2xl bg-white border border-slate-200 hover:border-teal-300 hover:shadow-lg hover:shadow-teal-100/30 transition-all duration-300"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    {/* Date badge */}
                    <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-100 mb-3">
                      <Calendar className="w-3.5 h-3.5 text-teal-500" />
                      <span className="text-sm font-medium text-teal-700">{report.date}</span>
                    </div>

                    {/* Title */}
                    <h2 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-teal-600 transition-colors">
                      {report.title}
                    </h2>

                    {/* Summary */}
                    <p className="text-sm text-slate-500 leading-relaxed mb-3 line-clamp-2">
                      {report.summary}
                    </p>

                    {/* Highlights */}
                    <div className="flex flex-wrap gap-2">
                      {report.highlights.map((h, i) => (
                        <span
                          key={i}
                          className="text-xs px-2.5 py-1 rounded-md bg-slate-50 border border-slate-100 text-slate-600"
                        >
                          🔥 {h}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center text-teal-500 group-hover:text-teal-600 flex-shrink-0 mt-2">
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Empty state */}
          {reports.length === 0 && (
            <div className="text-center py-20">
              <Newspaper className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-slate-600 mb-2">暂无日报</h3>
              <p className="text-slate-400">AI日报正在生成中，敬请期待</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
