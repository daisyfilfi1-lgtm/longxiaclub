import Link from 'next/link';
import { Newspaper, ArrowRight, Sparkles } from 'lucide-react';
import reports from '@/data/daily-reports/index';
import type { DailyReport } from '@/types';

// Level tag styling
const levelStyles: Record<string, string> = {
  S: 'bg-purple-100 text-purple-700',
  A: 'bg-blue-100 text-blue-700',
  B: 'bg-green-100 text-green-700',
  C: 'bg-amber-100 text-amber-700',
  D: 'bg-rose-100 text-rose-700',
};

async function getTodayReport(): Promise<DailyReport | null> {
  try {
    const today = reports[0]; // Most recent report
    if (!today) return null;
    const data = await import(`@/data/daily-reports/${today.date}.json`);
    return data.default || data;
  } catch {
    return null;
  }
}

export default async function DailyBrief() {
  const report = await getTodayReport();
  if (!report) return null;

  // Collect items from S/A/C levels with titles
  const topItems: { title: string; level: string }[] = [];

  if (report.sections.S?.items) {
    for (const item of report.sections.S.items.slice(0, 3)) {
      if (item.title) topItems.push({ title: item.title, level: 'S' });
    }
  }

  if (report.sections.A?.items) {
    for (const item of report.sections.A.items.slice(0, 2)) {
      if (item.title) topItems.push({ title: item.title, level: 'A' });
    }
  }

  if (report.sections.C?.items) {
    for (const item of report.sections.C.items.slice(0, 1)) {
      if (item.title) topItems.push({ title: item.title, level: 'C' });
    }
  }

  // Limit to 5 items
  const displayItems = topItems.slice(0, 5);

  return (
    <section className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          href={`/daily/${report.date}`}
          className="group block p-6 rounded-3xl bg-white border border-slate-200 hover:border-teal-300 hover:shadow-lg hover:shadow-teal-100/30 transition-all duration-300"
        >
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center shadow-lg shadow-teal-100">
                <Newspaper className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-800 group-hover:text-teal-600 transition-colors">
                  今日AI速览
                </h3>
                <p className="text-xs text-slate-400">
                  {report.date} · 共收录 { 
                    (report.sections.S?.items?.length || 0) +
                    (report.sections.A?.items?.length || 0) +
                    (report.sections.B?.items?.length || 0) +
                    (report.sections.C?.items?.length || 0) +
                    (report.sections.D?.items?.length || 0)
                  } 条资讯
                </p>
              </div>
            </div>
            <div className="hidden sm:flex items-center space-x-1 text-sm font-medium text-teal-600 group-hover:text-teal-700 transition-colors">
              <span>查看完整日报</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Items list */}
          <div className="space-y-2.5">
            {displayItems.map((item, i) => (
              <div
                key={i}
                className="flex items-center space-x-3 p-2.5 rounded-xl bg-slate-50 hover:bg-teal-50 transition-colors"
              >
                <span
                  className={`inline-flex items-center justify-center w-7 h-6 rounded-md text-xs font-bold flex-shrink-0 ${
                    levelStyles[item.level] || 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {item.level}
                </span>
                <span className="text-sm text-slate-700 leading-snug line-clamp-1 flex-1">
                  {item.title}
                </span>
              </div>
            ))}
          </div>

          {/* Footer CTA for mobile */}
          <div className="sm:hidden mt-4 flex items-center justify-center space-x-2 text-sm font-medium text-teal-600">
            <span>查看完整日报</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </Link>
      </div>
    </section>
  );
}
