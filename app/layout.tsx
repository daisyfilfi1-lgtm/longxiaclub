import type { Metadata } from 'next'
import './globals.css'
import { Providers } from './providers'

export const metadata: Metadata = {
  metadataBase: new URL('https://longxiaclub.com'),
  title: {
    default: 'AI导航站 - 发现最佳AI工具与技能',
    template: '%s | AI导航站',
  },
  description: '连接GitHub前沿技术产品与大众用户的中间层，通过场景化策展降低AI工具的发现与使用门槛',
  keywords: ['AI工具', 'AI导航', 'AI技能', '人工智能', 'ChatGPT', 'Midjourney'],
  authors: [{ name: 'AI导航站' }],
  openGraph: {
    title: 'AI导航站 - 发现最佳AI工具与技能',
    description: '连接前沿AI技术与大众用户',
    type: 'website',
    url: 'https://longxiaclub.com',
    siteName: 'AI导航站',
    images: [{
      url: 'https://longxiaclub.com/og-image.png',
      width: 1200,
      height: 630,
      alt: 'AI导航站',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI导航站 - 发现最佳AI工具与技能',
    description: '连接前沿AI技术与大众用户',
    images: ['https://longxiaclub.com/og-image.png'],
  },
  icons: {
    icon: [{ url: '/favicon.ico', sizes: 'any' }, { url: '/favicon.svg', type: 'image/svg+xml' }],
    apple: '/favicon.svg',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
