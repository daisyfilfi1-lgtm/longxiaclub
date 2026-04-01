import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'AI导航站 - 发现最佳AI工具与技能',
  description: '连接GitHub前沿技术产品与大众用户的中间层，通过场景化策展降低AI工具的发现与使用门槛',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen">
        {children}
      </body>
    </html>
  )
}
