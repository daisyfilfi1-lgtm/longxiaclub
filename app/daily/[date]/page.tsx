import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import reports from '@/data/daily-reports/index';
import type { DailyReportMeta } from '@/types';
import { ArrowLeft, ArrowRight, ExternalLink, Calendar, Sparkles, Lightbulb, Newspaper, BookOpen, Building2, Github, Users, Globe, MessageSquare } from 'lucide-react';

// Types matching the actual JSON data format
interface PaperItem {
  title: string;
  url: string;
  description: string;
  source: string;
}

interface BlogEntry {
  source: string;
  entries: string[];
  url: string;
}

interface BuilderItem {
  author: string;
  content: string;
  url: string;
  source: string;
}

interface GitHubItem {
  name: string;
  stars: string;
  description: string;
  url: string;
}

interface CommunityItem {
  title: string;
  url: string;
  source: string;
  description: string;
  score?: string;
}

interface SectionMap {
  papers?: { title: string; items: PaperItem[] };
  blogs?: { title: string; items: BlogEntry[] };
  builders?: { title: string; items: BuilderItem[] };
  github?: { title: string; items: GitHubItem[] };
  community?: { title: string; items: CommunityItem[] };
}

interface RawReport {
  date: string;
  title: string;
  summary: string;
  highlights: string[];
  sections: SectionMap;
  source_info: {
    data_sources: string;
    collection_time: string;
    generated_by: string;
  };
}

// Import JSON data for all reports
async function getReportData(date: string): Promise<RawReport | null> {
  try {
    const data = await import(`@/data/daily-reports/${date}.json`);
    return data.default || data;
  } catch {
    return null;
  }
}

function findAdjacentDates(date: string): { prev: string | null; next: string | null } {
  const dates = reports.map((r: DailyReportMeta) => r.date).sort();
  const idx = dates.indexOf(date);
  if (idx === -1) return { prev: null, next: null };
  return {
    prev: idx > 0 ? dates[idx - 1] : null,
    next: idx < dates.length - 1 ? dates[idx + 1] : null,
  };
}

export async function generateStaticParams() {
  return reports.map((report: DailyReportMeta) => ({ date: report.date }));
}

export async function generateMetadata({ params }: { params: Promise<{ date: string }> }): Promise<Metadata> {
  const { date } = await params;
  const meta = reports.find((r: DailyReportMeta) => r.date === date);
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

// Section config with colors and icons
const sectionConfig: Record<string, { label: string; icon: React.ReactNode; border: string; bg: string; badge: string; text: string }> = {
  papers: {
    label: '📄 前沿论文',
    icon: <BookOpen className="w-5 h-5" />,
    border: 'border-purple-200',
    bg: 'bg-purple-50/50',
    badge: 'bg-purple-100 text-purple-700',
    text: 'text-purple-800',
  },
  blogs: {
    label: '🏢 大厂博客',
    icon: <Building2 className="w-5 h-5" />,
    border: 'border-blue-200',
    bg: 'bg-blue-50/50',
    badge: 'bg-blue-100 text-blue-700',
    text: 'text-blue-800',
  },
  builders: {
    label: '👷 AI Builder 动态',
    icon: <Users className="w-5 h-5" />,
    border: 'border-amber-200',
    bg: 'bg-amber-50/50',
    badge: 'bg-amber-100 text-amber-700',
    text: 'text-amber-800',
  },
  github: {
    label: '🐙 GitHub 热门项目',
    icon: <Github className="w-5 h-5" />,
    border: 'border-green-200',
    bg: 'bg-green-50/50',
    badge: 'bg-green-100 text-green-700',
    text: 'text-green-800',
  },
  community: {
    label: '🌐 社区热点',
    icon: <Globe className="w-5 h-5" />,
    border: 'border-rose-200',
    bg: 'bg-rose-50/50',
    badge: 'bg-rose-100 text-rose-700',
    text: 'text-rose-800',
  },
};

function SectionCard({ sectionKey, section }: { sectionKey: string; section: any }) {
  const cfg = sectionConfig[sectionKey];
  if (!cfg || !section) return null;

  const hasItems = section.items && section.items.length > 0;
  if (!hasItems) return null;

  return (
    <section className={`rounded-2xl border ${cfg.border} ${cfg.bg} overflow-hidden`}>
      {/* Header */}
      <div className={`px-6 py-4 border-b ${cfg.border} flex items-center gap-3`}>
        <span className={cfg.text}>{cfg.icon}</span>
        <h2 className={`text-lg font-bold ${cfg.text}`}>{cfg.label}</h2>
      </div>

      <div className="p-6 space-y-4">
        {sectionKey === 'papers' && section.items.map((item: PaperItem, i: number) => (
          <PaperCard key={i} item={item} />
        ))}
        {sectionKey === 'blogs' && section.items.map((item: BlogEntry, i: number) => (
          <BlogCard key={i} item={item} />
        ))}
        {sectionKey === 'builders' && section.items.map((item: BuilderItem, i: number) => (
          <BuilderCard key={i} item={item} />
        ))}
        {sectionKey === 'github' && section.items.map((item: GitHubItem, i: number) => (
          <GitHubCard key={i} item={item} />
        ))}
        {sectionKey === 'community' && section.items.map((item: CommunityItem, i: number) => (
          <CommunityCard key={i} item={item} />
        ))}
      </div>
    </section>
  );
}

function PaperCard({ item }: { item: PaperItem }) {
  return (
    <div className="p-4 rounded-xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
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
      {item.source && (
        <span className="inline-block text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-600 mb-1">
          {item.source}
        </span>
      )}
      {item.description && (
        <p className="text-xs text-slate-500 leading-relaxed mt-1">{item.description}</p>
      )}
    </div>
  );
}

function BlogCard({ item }: { item: BlogEntry }) {
  return (
    <div className="p-4 rounded-xl bg-white border border-slate-100 shadow-sm">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-sm font-bold text-slate-700">{item.source}</span>
        {item.url && (
          <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-xs text-teal-600 hover:text-teal-700">
            原文 →
          </a>
        )}
      </div>
      {item.entries && item.entries.length > 0 && (
        <ul className="space-y-1.5">
          {item.entries.map((entry: string, i: number) => (
            <li key={i} className="text-xs text-slate-600 flex items-start gap-1.5">
              <span className="text-teal-400 mt-0.5">▸</span>
              <span className="leading-relaxed">{entry}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function BuilderCard({ item }: { item: BuilderItem }) {
  return (
    <div className="p-4 rounded-xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-2 mb-1">
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-slate-800">{item.author}</span>
          {item.source && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">{item.source}</span>
          )}
        </div>
        {item.url && (
          <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-blue-500 transition-colors flex-shrink-0 mt-0.5">
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        )}
      </div>
      <p className="text-xs text-slate-500 leading-relaxed">{item.content}</p>
    </div>
  );
}

function GitHubCard({ item }: { item: GitHubItem }) {
  return (
    <div className="flex items-start gap-3 p-4 rounded-xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-all">
      <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center text-sm flex-shrink-0">
        📦
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-medium text-slate-800 text-sm">{item.name}</span>
          <span className="text-xs px-1.5 py-0.5 rounded bg-amber-50 text-amber-600 font-mono">
            ★ {item.stars && !isNaN(Number(item.stars)) ? Number(item.stars).toLocaleString() : item.stars}
          </span>
          {item.url && (
            <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-teal-500 transition-colors">
              <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>
        {item.description && (
          <p className="text-xs text-slate-500 mt-0.5">{item.description}</p>
        )}
      </div>
    </div>
  );
}

function CommunityCard({ item }: { item: CommunityItem }) {
  return (
    <div className="p-4 rounded-xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
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
      <div className="flex items-center gap-2 mb-1">
        {item.source && (
          <span className="text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-600">
            {item.source}
          </span>
        )}
        {item.score && (
          <span className="text-xs px-2 py-0.5 rounded bg-amber-50 text-amber-700">
            [{item.score} pts]
          </span>
        )}
      </div>
      {item.description && (
        <p className="text-xs text-slate-500 leading-relaxed mt-1">{item.description}</p>
      )}
    </div>
  );
}

export default async function DailyDetailPage({ params }: { params: Promise<{ date: string }> }) {
  const { date } = await params;
  const meta = reports.find((r: DailyReportMeta) => r.date === date);
  if (!meta) notFound();

  const report = await getReportData(date);
  if (!report) notFound();

  const { prev, next } = findAdjacentDates(date);

  // Limit highlight display to top 5
  const displayHighlights = (report.highlights || []).slice(0, 5);

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

  const sectionOrder = ['papers', 'blogs', 'builders', 'github', 'community'] as const;

  return (
    <main className="min-h-screen bg-slate-50">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(newsArticleJsonLd) }} />

      {/* Navbar placeholder */}
      <div className="h-16" />

      <div className="relative pt-8 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back link */}
          <Link
            href="/daily"
            className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-teal-600 transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>返回日报列表</span>
          </Link>

          {/* Date display */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-50 border border-teal-100 mb-4">
            <Calendar className="w-4 h-4 text-teal-500" />
            <span className="text-sm font-medium text-teal-700">{report.date}</span>
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-4 leading-tight">
            {report.title}
          </h1>

          {/* Summary */}
          <p className="text-base text-slate-500 leading-relaxed max-w-3xl mb-6">
            {report.summary}
          </p>

          {/* Highlights */}
          {displayHighlights.length > 0 && (
            <div className="mb-8 p-5 rounded-2xl bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-200">
              <h3 className="text-sm font-bold text-orange-800 mb-3 flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                <span>今日看点</span>
              </h3>
              <ul className="space-y-2">
                {displayHighlights.map((h: string, i: number) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-orange-900">
                    <span className="text-orange-400 mt-0.5 font-medium">{i + 1}.</span>
                    <span className="leading-relaxed">{h}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Section navigation */}
          <div className="flex flex-wrap gap-2 mb-8 sticky top-20 z-10 pb-2">
            {sectionOrder.map((key) => {
              const section = report.sections[key as keyof SectionMap];
              if (!section || !section.items || section.items.length === 0) return null;
              const cfg = sectionConfig[key];
              return (
                <a
                  key={key}
                  href={`#section-${key}`}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium ${cfg?.badge || 'bg-slate-100 text-slate-600'} hover:opacity-80 transition-opacity`}
                >
                  {cfg?.label || key}
                </a>
              );
            })}
          </div>

          {/* Sections */}
          <div className="space-y-8" id="sections">
            {sectionOrder.map((key) => {
              const section = report.sections[key as keyof SectionMap];
              if (!section || !section.items || section.items.length === 0) return null;
              return (
                <div key={key} id={`section-${key}`}>
                  <SectionCard sectionKey={key} section={section} />
                </div>
              );
            })}
          </div>

          {/* Source info */}
          {report.source_info && (
            <div className="mt-10 p-5 rounded-2xl bg-white border border-slate-200 text-xs text-slate-400 space-y-1">
              <p>📡 数据来源：{report.source_info.data_sources}</p>
              <p>⏰ 采集时间：{report.source_info.collection_time}</p>
              <p>🤖 日报由 {report.source_info.generated_by} 自动生成</p>
            </div>
          )}

          {/* Prev/Next navigation */}
          <div className="mt-10 flex items-center justify-between">
            {prev ? (
              <Link
                href={`/daily/${prev}`}
                className="flex items-center gap-2 px-4 py-3 rounded-xl bg-white border border-slate-200 hover:border-teal-300 hover:shadow-md transition-all text-sm text-slate-700 hover:text-teal-600"
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
                className="flex items-center gap-2 px-4 py-3 rounded-xl bg-white border border-slate-200 hover:border-teal-300 hover:shadow-md transition-all text-sm text-slate-700 hover:text-teal-600"
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
