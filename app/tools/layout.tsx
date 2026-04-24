import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '产品中心',
  description: '发现最实用的AI工具，按热度、场景、技术分类浏览。涵盖ChatGPT、Midjourney、Stable Diffusion等热门AI工具。',
  openGraph: {
    title: '产品中心 | AI导航站',
    description: '发现最实用的AI工具，按热度、场景、技术分类浏览',
    images: [{
      url: 'https://longxiaclub.com/og-image.png',
      width: 1200,
      height: 630,
      alt: 'AI工具导航 - 产品中心',
    }],
  },
}

export default function ToolsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
