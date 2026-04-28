import { MetadataRoute } from 'next'
import { tools, skills, scenes } from '@/data/tools'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://longxiaclub.com'
  const now = new Date()

  const staticPages = [
    { url: baseUrl, changeFrequency: 'daily' as const, priority: 1.0, lastModified: now },
    { url: `${baseUrl}/tools`, changeFrequency: 'daily' as const, priority: 0.9, lastModified: now },
    { url: `${baseUrl}/skills`, changeFrequency: 'daily' as const, priority: 0.9, lastModified: now },
    { url: `${baseUrl}/scenes`, changeFrequency: 'weekly' as const, priority: 0.8, lastModified: now },
    { url: `${baseUrl}/favorites`, changeFrequency: 'weekly' as const, priority: 0.5, lastModified: now },
    { url: `${baseUrl}/evolution`, changeFrequency: 'weekly' as const, priority: 0.6, lastModified: now },
    { url: `${baseUrl}/auth/login`, changeFrequency: 'monthly' as const, priority: 0.3, lastModified: now },
  ]

  const toolPages = tools.map(tool => {
    const lastMod = (tool as any).contentUpdatedAt ? new Date((tool as any).contentUpdatedAt) : now;
    return {
      url: `${baseUrl}/tools/${tool.id}`,
      lastModified: lastMod,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    };
  })

  const skillPages = skills.map(skill => {
    const lastMod = skill.version ? now : now;
    return {
      url: `${baseUrl}/skills/${skill.id}`,
      lastModified: lastMod,
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    };
  })

  const scenePages = scenes.map(scene => ({
    url: `${baseUrl}/scenes/${scene.id}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  return [...staticPages, ...toolPages, ...skillPages, ...scenePages]
}
