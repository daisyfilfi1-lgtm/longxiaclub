import type { Metadata } from 'next'
import './globals.css'
import { Providers } from './providers'

export const metadata: Metadata = {
  metadataBase: new URL('https://longxiaclub.com'),
  title: {
    default: 'AI导航站 - 发现最佳AI工具与技能',
    template: '%s | AI导航站',
  },
  description: '连接GitHub前沿技术产品与大众用户的中间层，通过场景化策展降低AI工具的发现与使用门槛，收录22+款AI工具和50+个AI Skill。',
  keywords: ['AI工具', 'AI导航', 'AI技能', '人工智能', 'ChatGPT', 'Midjourney', 'Claude', 'AI导航站', 'longxiaclub'],
  authors: [{ name: 'AI导航站' }],
  creator: 'AI导航站',
  publisher: 'AI导航站',
  applicationName: 'AI导航站',
  category: 'technology',
  classification: 'AI工具导航',
  openGraph: {
    title: 'AI导航站 - 发现最佳AI工具与技能',
    description: '连接前沿AI技术与大众用户，收录22+款AI工具和50+个AI Skill，场景化策展降低AI工具的发现门槛。',
    type: 'website',
    url: 'https://longxiaclub.com',
    siteName: 'AI导航站',
    locale: 'zh_CN',
    images: [{
      url: 'https://longxiaclub.com/og-image.png',
      width: 1200,
      height: 630,
      alt: 'AI导航站 - 发现最佳AI工具与技能',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI导航站 - 发现最佳AI工具与技能',
    description: '连接前沿AI技术与大众用户，场景化策展降低AI工具的发现门槛。',
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
  // WebSite + Organization + SearchAction JSON-LD for homepage
  const websiteJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'AI导航站',
    alternateName: 'longxiaclub.com',
    url: 'https://longxiaclub.com',
    description: '连接GitHub前沿技术产品与大众用户的中间层，通过场景化策展降低AI工具的发现与使用门槛',
    inLanguage: 'zh-CN',
    publisher: {
      '@type': 'Organization',
      name: 'AI导航站',
      url: 'https://longxiaclub.com',
      logo: {
        '@type': 'ImageObject',
        url: 'https://longxiaclub.com/favicon.svg',
      },
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://longxiaclub.com/tools?q={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <html lang="zh-CN">
      <body className="min-h-screen">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
