import Link from 'next/link';
import Navbar from '@/components/Navbar';
import ToolDetailClient from '@/components/ToolDetailClient';
import { tools, skills } from '@/data/tools';
import { getRelatedSkills, getRelatedTools } from '@/lib/knowledge-graph';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { generateBreadcrumbJsonLd, HOME_CRUMB, TOOLS_LIST_CRUMB } from '@/lib/breadcrumb';

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
    keywords: [...tool.tags, tool.category, tool.name, ...(tool.sceneTags || []), ...(tool.techTags || [])],
    openGraph: {
      title: `${tool.name} - AI工具详情`,
      description: tool.description,
      type: 'article',
      url: `https://longxiaclub.com/tools/${tool.id}`,
      images: [{ url: 'https://longxiaclub.com/og-image.png', width: 1200, height: 630 }],
      siteName: 'AI导航站',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${tool.name} - AI导航站`,
      description: tool.description,
      images: ['https://longxiaclub.com/og-image.png'],
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
    operatingSystem: 'Web',
    browserRequirements: 'Modern web browser',
    inLanguage: ['zh-CN', 'en'],
    offers: {
      '@type': 'Offer',
      price: tool.price === 'free' ? '0' : tool.price === 'freemium' ? '0' : undefined,
      priceCurrency: 'USD',
      availability: tool.price === 'free' ? 'https://schema.org/InStock' : 'https://schema.org/OnlineOnly',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: tool.heat ? (tool.heat / 20).toFixed(1) : '3.5',
      ratingCount: tool.xhsSaves || 100,
      bestRating: '5',
      worstRating: '0',
    },
    url: `https://longxiaclub.com/tools/${tool.id}`,
    image: `https://longxiaclub.com/og-image.png`,
    keywords: [...tool.tags, tool.category, ...(tool.sceneTags || [])].join(', '),
    author: {
      '@type': 'Organization',
      name: 'AI导航站',
    },
  };

  // BreadcrumbList JSON-LD
  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    HOME_CRUMB,
    TOOLS_LIST_CRUMB,
    { name: tool.name, url: `https://longxiaclub.com/tools/${tool.id}` },
  ]);

  // 如果工具有 guides，生成 FAQPage JSON-LD
  const faqJsonLd = tool.guides && tool.guides.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: tool.guides.map(guide => ({
      '@type': 'Question',
      name: `${tool.name}如何${guide.title}？`,
      acceptedAnswer: {
        '@type': 'Answer',
        text: guide.steps.join('\\n')
      }
    }))
  } : null;

  // 通用FAQ — 基于工具属性生成常见问题
  const commonFaqs = [
    {
      '@type': 'Question',
      name: `${tool.name}是什么？有什么功能？`,
      acceptedAnswer: {
        '@type': 'Answer',
        text: `${tool.name}是一款${tool.category}类AI工具。${tool.description}`
      }
    },
    {
      '@type': 'Question',
      name: `${tool.name}是免费的吗？价格多少？`,
      acceptedAnswer: {
        '@type': 'Answer',
        text: tool.price === 'free' ? `${tool.name}完全免费使用。` :
             tool.price === 'freemium' ? `${tool.name}提供免费版本，高级功能需要付费。` :
             tool.price === 'enterprise' ? `${tool.name}面向企业用户，提供定制化方案。` :
             `${tool.name}是付费工具。`
      }
    },
    {
      '@type': 'Question',
      name: `${tool.name}适合什么水平的人使用？`,
      acceptedAnswer: {
        '@type': 'Answer',
        text: tool.difficulty === 'beginner' ? `${tool.name}适合所有用户，操作简单易上手。` :
             tool.difficulty === 'intermediate' ? `${tool.name}需要一定的使用经验。` :
             `${tool.name}适合有经验的高级用户。`
      }
    },
    {
      '@type': 'Question',
      name: `${tool.name}支持中文吗？`,
      acceptedAnswer: {
        '@type': 'Answer',
        text: tool.costTags?.includes('中文友好') ? `${tool.name}支持中文，对中文用户非常友好。` :
             `${tool.name}主要支持英文，建议使用翻译工具辅助。`
      }
    },
    {
      '@type': 'Question',
      name: `${tool.name}的主要应用场景有哪些？`,
      acceptedAnswer: {
        '@type': 'Answer',
        text: `${tool.name}主要应用于：${tool.sceneTags?.join('、') || tool.tags?.join('、')}等场景。`
      }
    },
  ];

  const combinedFaqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      ...commonFaqs,
      ...(faqJsonLd?.mainEntity || [])
    ]
  };

  // ItemList JSON-LD for related tools
  const relatedToolsForJsonLd = relatedToolsFromGraph.slice(0, 10).map((rt, idx) => ({
    '@type': 'ListItem',
    position: idx + 1,
    item: {
      '@type': 'SoftwareApplication',
      name: rt.name,
      description: rt.description,
      url: `https://longxiaclub.com/tools/${rt.id}`,
    }
  }));
  const relatedSkillsForJsonLd = primaryRelatedSkills.slice(0, 10).map((rs, idx) => ({
    '@type': 'ListItem',
    position: relatedToolsFromGraph.slice(0, 10).length + idx + 1,
    item: {
      '@type': 'HowTo',
      name: rs.name,
      description: rs.description,
      url: `https://longxiaclub.com/skills/${rs.id}`,
    }
  }));
  const itemListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `${tool.name} - 关联工具和技能`,
    description: `与${tool.name}相关的AI工具和Skill推荐`,
    url: `https://longxiaclub.com/tools/${tool.id}`,
    numberOfItems: relatedToolsForJsonLd.length + relatedSkillsForJsonLd.length,
    itemListElement: [...relatedToolsForJsonLd, ...relatedSkillsForJsonLd],
  };

  return (
    <>
      {/* JSON-LD 结构化数据 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(combinedFaqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
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
