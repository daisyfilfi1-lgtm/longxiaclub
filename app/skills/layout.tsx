import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Skill市场',
  description: '浏览和发现AI技能（Skill），从入门到高级，涵盖办公提效、内容创作、编程开发、设计创作等场景。',
  openGraph: {
    title: 'Skill市场 | AI导航站',
    description: '浏览和发现AI技能（Skill），从入门到高级',
    images: [{
      url: 'https://longxiaclub.com/og-image.png',
      width: 1200,
      height: 630,
      alt: 'AI Skill市场',
    }],
  },
}

export default function SkillsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
