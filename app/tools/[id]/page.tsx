import Link from 'next/link';
import Navbar from '@/components/Navbar';
import ToolDetailClient from '@/components/ToolDetailClient';
import { tools, skills } from '@/data/tools';
import { getRelatedSkills, getRelatedTools } from '@/lib/knowledge-graph';
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

  // 知识图谱动态计算关联
  const relatedSkillsFromGraph = getRelatedSkills(tool.id, 8);
  const relatedToolsFromGraph = getRelatedTools(tool.id, 6);
  
  // 兼容旧数据：优先用图谱结果，不足时用手工维护的
  const relatedSkillsList = skills.filter((s) => (tool.relatedSkills || []).includes(s.id));
  // 图谱结果比手工关联更丰富，优先展示
  const primaryRelatedSkills = relatedSkillsFromGraph.length >= 3 
    ? relatedSkillsFromGraph 
    : relatedSkillsList.map(s => ({
        id: s.id,
        name: s.name,
        type: 'skill' as const,
        score: 1,
        tags: ['关联Skill'],
        icon: s.icon,
        description: s.description.slice(0, 60),
      }));

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
      <ToolDetailClient 
        tool={tool} 
        relatedSkills={relatedSkillsList} 
        relatedTools={relatedToolsFromGraph}
        primaryRelatedSkills={primaryRelatedSkills}
      />
    </>
  );
}
