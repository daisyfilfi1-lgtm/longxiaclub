import Link from 'next/link';
import Navbar from '@/components/Navbar';
import ToolDetailClient from '@/components/ToolDetailClient';
import { tools, skills } from '@/data/tools';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

interface Props {
  params: Promise<{ id: string }>;
}

// 生成所有工具的静态路由（ISR）
export async function generateStaticParams() {
  return tools.map((tool) => ({
    id: tool.id,
  }));
}

// ISR 配置：每 60 秒重新生成页面
export const revalidate = 60;

// 动态元数据
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const tool = tools.find((t) => t.id === id);
  
  if (!tool) {
    return { 
      title: '工具未找到',
      robots: { index: false }
    };
  }
  
  return {
    title: `${tool.name} - AI导航站`,
    description: `${tool.description} | 热度${tool.heat} | ${tool.tags.join(', ')}`,
    keywords: [...tool.tags, tool.category, tool.name],
    openGraph: {
      title: `${tool.name} - AI工具详情`,
      description: tool.description,
      type: 'article',
      url: `https://longxiaclub.com/tools/${tool.id}`,
    },
    twitter: {
      card: 'summary_large_image',
      title: tool.name,
      description: tool.description,
    },
    alternates: {
      canonical: `/tools/${tool.id}`,
    },
  };
}

export default async function ToolDetailPage({ params }: Props) {
  const { id } = await params;
  const tool = tools.find((t) => t.id === id);
  
  if (!tool) {
    notFound();
  }

  const relatedSkillsList = skills.filter((s) => (tool.relatedSkills || []).includes(s.id));

  // 构建结构化数据（JSON-LD）
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: tool.name,
    description: tool.description,
    applicationCategory: 'AIApplication',
    offers: {
      '@type': 'Offer',
      price: tool.price === 'free' ? '0' : undefined,
      priceCurrency: 'USD'
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: (tool.heat / 20).toFixed(1),
      ratingCount: tool.xhsSaves || 100,
    }
  };

  return (
    <>
      {/* JSON-LD 结构化数据 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />
      <ToolDetailClient tool={tool} relatedSkills={relatedSkillsList} />
    </>
  );
}
