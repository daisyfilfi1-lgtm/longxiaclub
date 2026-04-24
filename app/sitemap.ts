import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://longxiaclub.com'

  const staticPages = [
    { url: baseUrl, changeFrequency: 'daily' as const, priority: 1.0 },
    { url: `${baseUrl}/tools`, changeFrequency: 'daily' as const, priority: 0.9 },
    { url: `${baseUrl}/skills`, changeFrequency: 'daily' as const, priority: 0.9 },
    { url: `${baseUrl}/scenes`, changeFrequency: 'weekly' as const, priority: 0.8 },
    { url: `${baseUrl}/favorites`, changeFrequency: 'weekly' as const, priority: 0.5 },
    { url: `${baseUrl}/auth/login`, changeFrequency: 'monthly' as const, priority: 0.3 },
  ]

  return staticPages.map(page => ({
    url: page.url,
    lastModified: new Date(),
    changeFrequency: page.changeFrequency,
    priority: page.priority,
  }))
}
