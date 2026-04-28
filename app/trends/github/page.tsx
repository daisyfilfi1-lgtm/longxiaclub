import Navbar from '@/components/Navbar';
import { Github, Star, GitFork } from 'lucide-react';
import type { Metadata } from 'next';
import githubMetrics from '@/data/github-metrics.json';

export const metadata: Metadata = {
  title: 'GitHub热门AI开源项目排行榜 | longxiaclub.com',
  description: 'GitHub 上最受关注的 AI 开源项目排名，按星标数排序，追踪开源 AI 技术的最新进展和热门仓库。',
  openGraph: {
    title: 'GitHub热门AI开源项目排行榜 | longxiaclub.com',
    description: 'GitHub 上最受关注的 AI 开源项目排名，按星标数排序',
    url: 'https://longxiaclub.com/trends/github',
    type: 'website',
  },
};

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  name: '面包屑导航',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'AI导航站', item: 'https://longxiaclub.com' },
    { '@type': 'ListItem', position: 2, name: '趋势榜单', item: 'https://longxiaclub.com/trends' },
    { '@type': 'ListItem', position: 3, name: 'GitHub热门项目', item: 'https://longxiaclub.com/trends/github' },
  ],
};

const itemListJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'GitHub热门AI开源项目排行榜',
  description: 'GitHub 上最受关注的 AI 开源项目排名',
  url: 'https://longxiaclub.com/trends/github',
  numberOfItems: githubMetrics.repositories.length,
  itemListOrder: 'Descending',
};

function formatNumber(num: number): string {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
}

function getRepoUrl(fullName: string): string {
  return `https://github.com/${fullName}`;
}

export default function GitHubPage() {
  const repos = [...githubMetrics.repositories].sort((a, b) => b.stars - a.stars);

  return (
    <main className="min-h-screen bg-slate-50 dot-pattern">
      <div className="fixed inset-0 bg-gradient-mint pointer-events-none" />
      <Navbar />

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
      />

      {/* Header */}
      <div className="relative pt-32 pb-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-sm font-medium mb-6">
              <Github className="w-4 h-4" />
              <span>GitHub · 开源项目</span>
            </div>
            <h1 className="text-4xl font-bold text-slate-800 mb-4">
              GitHub 热门项目
            </h1>
            <p className="text-slate-500 leading-relaxed">
              GitHub 上最受关注的 AI 开源项目，按星标数排名。
              追踪开源 AI 技术的最新进展。
            </p>
          </div>
        </div>
      </div>

      {/* Repo List */}
      <div className="relative pb-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-4">
            {repos.map((repo, index) => (
              <a
                key={repo.full_name}
                href={getRepoUrl(repo.full_name)}
                target="_blank"
                rel="noopener noreferrer"
                className="group block"
              >
                <div className="relative p-6 rounded-2xl bg-white border border-slate-200 hover:border-slate-400 hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5">
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-slate-50/0 to-slate-100/0 group-hover:from-slate-50 group-hover:to-slate-100 transition-all duration-300" />
                  
                  <div className="relative flex items-start space-x-5">
                    {/* Rank */}
                    <div className="flex flex-col items-center space-y-2 min-w-[60px]">
                      <span className={`inline-flex items-center justify-center w-8 h-8 rounded-lg text-sm font-bold ${
                        index === 0 ? 'bg-amber-100 text-amber-700 border border-amber-200' :
                        index === 1 ? 'bg-slate-200 text-slate-700 border border-slate-300' :
                        index === 2 ? 'bg-orange-100 text-orange-700 border border-orange-200' :
                        'bg-slate-100 text-slate-500 border border-slate-200'
                      }`}>
                        {index + 1}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3 mb-1">
                        <Github className="w-5 h-5 text-slate-400 flex-shrink-0" />
                        <h3 className="text-lg font-bold text-slate-800 group-hover:text-teal-600 transition-colors truncate">
                          {repo.full_name}
                        </h3>
                      </div>
                      {repo.description && (
                        <p className="text-sm text-slate-500 leading-relaxed mb-4 line-clamp-2">
                          {repo.description}
                        </p>
                      )}

                      {/* Stats */}
                      <div className="flex items-center space-x-6">
                        <div className="flex items-center space-x-1.5">
                          <Star className="w-4 h-4 text-amber-500" />
                          <span className="text-sm font-semibold text-slate-700">{formatNumber(repo.stars)}</span>
                          <span className="text-xs text-slate-400">stars</span>
                        </div>
                        <div className="flex items-center space-x-1.5">
                          <GitFork className="w-4 h-4 text-slate-400" />
                          <span className="text-sm font-semibold text-slate-700">{formatNumber(repo.forks)}</span>
                          <span className="text-xs text-slate-400">forks</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </a>
            ))}
          </div>

          {/* Footer info */}
          <div className="mt-8 text-center">
            <p className="text-sm text-slate-400">
              共 {repos.length} 个仓库 · 数据更新于 {new Date(githubMetrics.timestamp).toLocaleDateString('zh-CN')} · 数据来源：GitHub API
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
