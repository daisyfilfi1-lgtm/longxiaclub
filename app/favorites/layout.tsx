import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '我的收藏',
  description: '管理你的AI工具和Skill收藏列表。收藏感兴趣的工具和技能，方便快速访问和对比。',
  robots: {
    index: false,
    follow: false,
  },
}

export default function FavoritesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
