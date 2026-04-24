import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '场景方案',
  description: '基于业务场景的AI解决方案推荐系统。根据你的业务场景（办公、内容创作、编程、设计等）找到最佳AI工具组合和Skill搭配。',
  openGraph: {
    title: '场景方案 | AI导航站',
    description: '基于业务场景的AI解决方案推荐',
    images: [{
      url: 'https://longxiaclub.com/og-image.png',
      width: 1200,
      height: 630,
      alt: 'AI场景方案',
    }],
  },
}

export default function ScenesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
