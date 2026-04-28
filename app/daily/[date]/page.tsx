import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import reports from '@/data/daily-reports/index';
import type { DailyReport, DailyReportItem, DailyReportSection } from '@/types';
import { ArrowLeft, ArrowRight, ExternalLink, Calendar, Sparkles, Lightbulb, Newspaper } from 'lucide-react';

// Import JSON data for all reports
async function getReportData(date: string): Promise<DailyReport | null> {
  try {
    const data = await import(`@/data/daily-reports/${date}.json`);
    return data.default || data;
  } catch {
    return null;
  }
}

function findAdjacentDates(date: string): { prev: string | null; next: string | null } {
  const dates = reports.map((r) => r.date).sort();
  const idx = dates.indexOf(date);
  if (idx === -1) return { prev: null, next: null };
  return {
    prev: idx > 0 ? dates[idx - 1] : null,
    next: idx < dates.length - 1 ? dates[idx + 1] : null,
  };
}

export async function generateStaticParams() {
  return reports.map((report) => ({ date: report.date }));
}

export async function generateMetadata({ params }: { params: Promise<{ date: string }> }): Promise<Metadata> {
  const { date } = await params;
  const meta = reports.find((r) => r.date === date);
  if (!meta) return { title: '日报未找到' };
  return {
    title: `${meta.title}`,
    description: meta.summary,
    openGraph: {
      title: `${meta.title} | AI导航站`,
      description: meta.summary,
      type: 'article',
      publishedTime: `${meta.date}T00:00:00+08:00`,
      url: `https://longxiaclub.com/daily/${meta.date}`,
    },
    twitter: {
      title: `${meta.title} | AI导航站`,
      description: meta.summary,
    },
    keywords: ['AI日报', meta.date, 'AI前沿', 'AI论文', 'AI资讯'],
  };
}

// Level-specific styling
const levelConfig: Record<string, { label: string; border: string; bg: string; badge: string; text: string; dot: string }> = {
  S: {
    label: 'S 级 · 一手源头',
    border: 'border-purple-200',
    bg: 'bg-purple-50/50',
    badge: 'bg-purple-100 text-purple-700',
    text: 'text-purple-800',
    dot: 'bg-purple-500',
  },
  A: {
    label: 'A 级 · 社区风向',
    border: 'border-blue-200',
    bg: 'bg-blue-50/50',
    badge: 'bg-blue-100 text-blue-700',
    text: 'text-blue-800',
    dot: 'bg-blue-500',
  },
  B: {
    label: 'B 级 · 深度解读',
    border: 'border-green-200',
    bg: 'bg-green-50/50',
    badge: 'bg-green-100 text-green-700',
    text: 'text-green-800',
    dot: 'bg-green-500',
  },
  C: {
    label: 'C 级 · 实战社区',
    border: 'border-amber-200',
    bg: 'bg-amber-50/50',
    badge: 'bg-amber-100 text-amber-700',
    text: 'text-amber-800',
    dot: 'bg-amber-500',
  },
  D: {
    label: 'D 级 · 中文精品',
    border: 'border-rose-200',
    bg: 'bg-rose-50/50',
    badge: 'bg-rose-100 text-rose-700',
    text: 'text-rose-800',
    dot: 'bg-rose-500',
  },
};

function SectionCard({ level, section }: { level: string; section: DailyReportSection }) {
  const cfg = levelConfig[level] || levelConfig['C'];
  
  return (
    <section className={`rounded-2xl border ${cfg.border} ${cfg.bg} overflow-hidden`}>
      {/* Header */}
      <div className={`px-6 py-4 border-b ${cfg.border} flex items-center space-x-3`}>
        <span className={`w-3 h-3 rounded-full ${cfg.dot}`} />
        <h2 className={`text-lg font-bold ${cfg.text}`}>{cfg.label}</h2>
      </div>

      <div className="p-6 space-y-6">
        {/* Main items */}
        {section.items && section.items.length > 0 && (
          <div className="space-y-4">
            {section.items.map((item: DailyReportItem, i: number) => (
              <ItemCard key={i} item={item} />
            ))}
          </div>
        )}

        {/* Subsections */}
        {section.subsections && section.subsections.length > 0 && (
          <div className="space-y-6">
            {section.subsections.map((sub, si) => (
              <div key={si}>
                <h3 className="font-bold text-slate-700 mb-3 text-base">{sub.title}</h3>
                <div className="space-y-3">
                  {sub.entries.map((entry: any, ei: number) => (
                    <SubEntryCard key={ei} entry={entry} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Note */}
        {section.note && (
          <p className="text-sm text-slate-400 italic">{section.note}</p>
        )}

        {/* GitHub projects (C level) */}
        {section.github_projects && section.github_projects.length > 0 && (
          <div className="space-y-3">
            {section.github_projects.map((proj: DailyReportItem, i: number) => (
              <div key={i} className="flex items-start space-x-3 p-3 rounded-xl bg-white/70 border border-slate-100">
                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-sm flex-shrink-0">
                  📦
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-slate-800 text-sm">{proj.name}</span>
                    <span className="text-xs px-1.5 py-0.5 rounded bg-amber-50 text-amber-600 font-mono">★ {proj.stars?.toLocaleString()}</span>
                  </div>
                  {proj.description && (
                    <p className="text-xs text-slate-500 mt-0.5">{proj.description}</p>
                  )}
                  {proj.insight && (
                    <p className="text-xs text-teal-600 mt-1 flex items-start space-x-1">
                      <Lightbulb className="w-3 h-3 mt-0.5 flex-shrink-0" />
                      <span>{proj.insight}</span>
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function ItemCard({ item }: { item: DailyReportItem }) {
  return (
    <div className="p-4 rounded-xl bg-white border border-slate-100 shadow-sm">
      {/* Title with link */}
      {item.title && (
        <div className="flex items-start justify-between gap-2 mb-1">
          <h4 className="font-semibold text-slate-800 text-sm leading-snug">
            {item.title}
          </h4>
          {item.url && (
            <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-teal-500 transition-colors flex-shrink-0 mt-1">
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      )}

      {/* Creator info for D level */}
      {item.creator && (
        <div className="flex items-center space-x-2 mb-1">
          <span className="text-sm font-medium text-slate-700">{item.creator}</span>
          {item.platform && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-rose-50 text-rose-600">{item.platform}</span>
          )}
          {item.blog && (
            <a href={item.blog} target="_blank" rel="noopener noreferrer" className="text-xs text-teal-600 hover:text-teal-700">博客 →</a>
          )}
        </div>
      )}

      {/* Source badge */}
      {item.source && (
        <span className="inline-block text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-600 mb-1">
          {item.source}
        </span>
      )}

      {/* HN score */}
      {item.score && (
        <span className="inline-flex items-center space-x-1 text-xs px-2 py-0.5 rounded bg-amber-50 text-amber-700 mb-1 ml-1">
          <span>[{item.score}pts]</span>
        </span>
      )}

      {/* Likes */}
      {(item.likes || item.retweets) && (
        <div className="flex items-center space-x-3 text-xs text-slate-400 mb-1">
          {item.likes && <span>❤️ {item.likes.toLocaleString()}</span>}
          {item.retweets && <span>🔄 {item.retweets.toLocaleString()}</span>}
        </div>
      )}

      {/* Stars */}
      {item.stars && (
        <span className="inline-block text-xs px-2 py-0.5 rounded bg-amber-50 text-amber-600 font-mono mb-1">
          ★ {item.stars.toLocaleString()}
        </span>
      )}

      {/* Description */}
      {item.description && (
        <p className="text-xs text-slate-500 leading-relaxed mt-1">{item.description}</p>
      )}

      {/* Items list (for Anthropic/Google entries) */}
      {item.items && item.items.length > 0 && (
        <ul className="mt-2 space-y-1">
          {item.items.map((itm: string, i: number) => (
            <li key={i} className="text-xs text-slate-600 flex items-start space-x-1.5">
              <span className="text-slate-300 mt-0.5">•</span>
              <span>{itm}</span>
            </li>
          ))}
        </ul>
      )}

      {/* Insight */}
      {item.insight && (
        <div className="mt-2 pt-2 border-t border-slate-50 flex items-start space-x-1.5">
          <Lightbulb className="w-3.5 h-3.5 text-teal-500 mt-0.5 flex-shrink-0" />
          <p className="text-xs text-teal-600 leading-relaxed">{item.insight}</p>
        </div>
      )}
    </div>
  );
}

function SubEntryCard({ entry }: { entry: any }) {
  // For company blog entries (Anthropic, Google)
  if (entry.source && entry.items) {
    return (
      <div className="p-3 rounded-xl bg-white border border-slate-100">
        <div className="flex items-center space-x-2 mb-2">
          <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">{entry.source}</span>
          {entry.insight && (
            <Lightbulb className="w-3 h-3 text-teal-400" />
          )}
        </div>
        <ul className="space-y-1">
          {entry.items.map((itm: string, i: number) => (
            <li key={i} className="text-xs text-slate-600 flex items-start space-x-1.5">
              <span className="text-slate-300 mt-1">•</span>
              <span>{itm}</span>
            </li>
          ))}
        </ul>
        {entry.insight && (
          <p className="mt-2 text-xs text-teal-600 leading-relaxed border-t border-slate-50 pt-2">{entry.insight}</p>
        )}
      </div>
    );
  }

  // For GitHub trending entries
  if (entry.name) {
    return (
      <div className="flex items-start space-x-3 p-3 rounded-xl bg-white border border-slate-100">
        <div className="text-lg flex-shrink-0">📦</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2">
            <span className="font-medium text-slate-800 text-sm">{entry.name}</span>
            <span className="text-xs px-1.5 py-0.5 rounded bg-amber-50 text-amber-600 font-mono">★ {entry.stars?.toLocaleString()}</span>
          </div>
          {entry.description && <p className="text-xs text-slate-500 mt-0.5">{entry.description}</p>}
          {entry.insight && (
            <p className="text-xs text-teal-600 mt-1 flex items-start space-x-1">
              <Lightbulb className="w-3 h-3 mt-0.5 flex-shrink-0" />
              <span>{entry.insight}</span>
            </p>
          )}
        </div>
      </div>
    );
  }

  return null;
}

export default async function DailyDetailPage({ params }: { params: Promise<{ date: string }> }) {
  const { date } = await params;
  const meta = reports.find((r) => r.date === date);
  if (!meta) notFound();

  const report = await getReportData(date);
  if (!report) notFound();

  const { prev, next } = findAdjacentDates(date);

  // NewsArticle JSON-LD
  const newsArticleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: report.title,
    description: report.summary,
    datePublished: `${date}T00:00:00+08:00`,
    dateModified: `${date}T23:59:59+08:00`,
    author: {
      '@type': 'Organization',
      name: 'AI导航站 Daisy Agent',
    },
    publisher: {
      '@type': 'Organization',
      name: 'AI导航站',
      url: 'https://longxiaclub.com',
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://longxiaclub.com/daily/${date}`,
    },
  };

  const sectionOrder = ['S', 'A', 'B', 'C', 'D'] as const;

  return (
    <main className="min-h-screen bg-slate-50 dot-pattern">
      <div className="fixed inset-0 bg-gradient-mint pointer-events-none" />
      
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(newsArticleJsonLd) }} />

      {/* Navbar placeholder */}
      <div className="h-16" />

      <div className="relative pt-8 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back link */}
          <Link
            href="/daily"
            className="inline-flex items-center space-x-2 text-sm text-slate-500 hover:text-teal-600 transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>返回日报列表</span>
          </Link>

          {/* Header */}
          <div className="mb-8">
            {/* Date badge */}
            <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-teal-50 border border-teal-100 mb-4">
              <Calendar className="w-4 h-4 text-teal-500" />
              <span className="text-sm font-medium text-teal-700">{report.date}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-4 leading-tight">
              {report.title}
            </h1>

            <p className="text-base text-slate-500 leading-relaxed max-w-3xl">
              {report.summary}
            </p>

            {/* Highlights */}
            {report.highlights && report.highlights.length > 0 && (
              <div className="mt-6 p-5 rounded-2xl bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-200">
                <h3 className="text-sm font-bold text-orange-800 mb-3 flex items-center space-x-2">
                  <span>🔥</span>
                  <span>今日看点</span>
                </h3>
                <ul className="space-y-2">
                  {report.highlights.map((h, i) => (
                    <li key={i} className="flex items-start space-x-2 text-sm text-orange-900">
                      <span className="text-orange-400 mt-0.5">{i + 1}.</span>
                      <span className="leading-relaxed">{h}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Level navigation */}
          <div className="flex flex-wrap gap-2 mb-8 sticky top-20 z-10 pb-2">
            {sectionOrder.map((level) => {
              const cfg = levelConfig[level];
              return (
                <a
                  key={level}
                  href={`#section-${level}`}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium ${cfg.badge} hover:opacity-80 transition-opacity`}
                >
                  {cfg.label}
                </a>
              );
            })}
          </div>

          {/* Sections */}
          <div className="space-y-8" id="sections">
            {sectionOrder.map((level) => {
              const section = report.sections[level];
              if (!section) return null;
              const hasContent =
                (section.items && section.items.length > 0) ||
                (section.subsections && section.subsections.length > 0) ||
                (section.github_projects && section.github_projects.length > 0);
              if (!hasContent) return null;

              return (
                <div key={level} id={`section-${level}`}>
                  <SectionCard level={level} section={section} />
                </div>
              );
            })}
          </div>

          {/* Source info */}
          <div className="mt-10 p-5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-400 space-y-1">
            <p>数据来源：{report.source_info?.data_sources}</p>
            <p>采集时间：{report.source_info?.collection_time}</p>
            <p>日报由 {report.source_info?.generated_by} 自动生成</p>
          </div>

          {/* Prev/Next navigation */}
          <div className="mt-10 flex items-center justify-between">
            {prev ? (
              <Link
                href={`/daily/${prev}`}
                className="flex items-center space-x-2 px-4 py-3 rounded-xl bg-white border border-slate-200 hover:border-teal-300 hover:shadow-md transition-all text-sm text-slate-700 hover:text-teal-600"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>前一日：{prev}</span>
              </Link>
            ) : (
              <div />
            )}
            {next ? (
              <Link
                href={`/daily/${next}`}
                className="flex items-center space-x-2 px-4 py-3 rounded-xl bg-white border border-slate-200 hover:border-teal-300 hover:shadow-md transition-all text-sm text-slate-700 hover:text-teal-600"
              >
                <span>后一日：{next}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <div />
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
