import Link from 'next/link';
import Navbar from '@/components/Navbar';
import ToolDetailClient from '@/components/ToolDetailClient';
import { tools, skills } from '@/data/tools';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

interface Props {
  params: Promise<{ id: string }>;
}

// 生成所有工具的静态路由
export async function generateStaticParams() {
  return tools.map((tool) => ({
    id: tool.id,
  }));
}

// SEO metadata
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const tool = tools.find((t) => t.id === id);
  if (!tool) return { title: '工具未找到' };
  return {
    title: `${tool.name} - AI导航站`,
    description: `${tool.description} | 热度${tool.heat} | ${tool.tags.join(', ')}`,
    openGraph: {
      title: `${tool.name} - AI工具详情`,
      description: tool.description,
      type: 'website',
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

  return (
    <>
      <Navbar />
      <ToolDetailClient tool={tool} relatedSkills={relatedSkillsList} />
    </>
  );
}