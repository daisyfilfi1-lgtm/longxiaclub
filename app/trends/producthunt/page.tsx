import Navbar from '@/components/Navbar';
import { TrendingUp, ExternalLink, ThumbsUp } from 'lucide-react';
import type { Metadata } from 'next';
import productHuntData from '@/data/product-hunt-data.json';

export const metadata: Metadata = {
  title: 'ProductHunt AI新品排行榜 | longxiaclub.com',
  description: '来自 ProductHunt 的最新AI产品排行，按投票数排序，发现本周最受欢迎的AI创新产品和工具。',
  openGraph: {
    title: 'ProductHunt AI新品排行榜 | longxiaclub.com',
    description: '来自 ProductHunt 的最新AI产品排行，按投票数排序',
    url: 'https://longxiaclub.com/trends/producthunt',
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
    { '@type': 'ListItem', position: 3, name: 'ProductHunt新品榜', item: 'https://longxiaclub.com/trends/producthunt' },
  ],
};

const itemListJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'ProductHunt AI新品排行榜',
  description: '来自 ProductHunt 的最新AI产品排行',
  url: 'https://longxiaclub.com/trends/producthunt',
  numberOfItems: productHuntData.products.length,
  itemListOrder: 'Descending',
};

function getVoteColor(votes: number): string {
  if (votes >= 300) return 'bg-amber-100 text-amber-700 border-amber-200';
  if (votes >= 150) return 'bg-teal-100 text-teal-700 border-teal-200';
  if (votes >= 100) return 'bg-blue-100 text-blue-700 border-blue-200';
  return 'bg-slate-100 text-slate-600 border-slate-200';
}

export default function ProductHuntPage() {
  const products = [...productHuntData.products].sort((a, b) => b.votes - a.votes);

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
            <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-teal-50 border border-teal-200 text-teal-700 text-sm font-medium mb-6">
              <TrendingUp className="w-4 h-4" />
              <span>ProductHunt · 本周新品</span>
            </div>
            <h1 className="text-4xl font-bold text-slate-800 mb-4">
              ProductHunt 新品榜
            </h1>
            <p className="text-slate-500 leading-relaxed">
              来自 ProductHunt 的最新 AI 产品，按社区投票数排序。
              发现本周最受欢迎的 AI 创新产品。
            </p>
          </div>
        </div>
      </div>

      {/* Products List */}
      <div className="relative pb-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-4">
            {products.map((product, index) => (
              <a
                key={product.name}
                href={product.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group block"
              >
                <div className="relative p-6 rounded-2xl bg-white border border-slate-200 hover:border-teal-300 hover:shadow-lg hover:shadow-teal-100 transition-all duration-300 hover:-translate-y-0.5">
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-teal-50/0 to-cyan-50/0 group-hover:from-teal-50 group-hover:to-cyan-50 transition-all duration-300" />
                  
                  <div className="relative flex items-start space-x-5">
                    {/* Rank + Votes */}
                    <div className="flex flex-col items-center space-y-2 min-w-[60px]">
                      <span className={`inline-flex items-center justify-center w-8 h-8 rounded-lg text-sm font-bold ${index < 3 ? 'bg-teal-100 text-teal-700 border border-teal-200' : 'bg-slate-100 text-slate-500 border border-slate-200'}`}>
                        {index + 1}
                      </span>
                      <span className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-semibold ${getVoteColor(product.votes)}`}>
                        <ThumbsUp className="w-3 h-3" />
                        <span>{product.votes}</span>
                      </span>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3 mb-1">
                        <h3 className="text-lg font-bold text-slate-800 group-hover:text-teal-600 transition-colors truncate">
                          {product.name}
                        </h3>
                        <ExternalLink className="w-4 h-4 text-slate-300 group-hover:text-teal-500 flex-shrink-0 transition-colors" />
                      </div>
                      <p className="text-sm text-slate-500 leading-relaxed">
                        {product.description}
                      </p>
                    </div>

                    {/* Arrow indicator */}
                    <div className="hidden sm:flex items-center self-center">
                      <span className="text-teal-400 group-hover:text-teal-600 transition-colors">
                        <ExternalLink className="w-5 h-5" />
                      </span>
                    </div>
                  </div>
                </div>
              </a>
            ))}
          </div>

          {/* Footer info */}
          <div className="mt-8 text-center">
            <p className="text-sm text-slate-400">
              共 {products.length} 个产品 · 数据更新于 {new Date(productHuntData.timestamp).toLocaleDateString('zh-CN')} · 数据来源：ProductHunt API
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
