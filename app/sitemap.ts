import { MetadataRoute } from 'next'
import { tools, skills, scenes } from '@/data/tools'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://longxiaclub.com'

  const staticPages = [
    { url: baseUrl, changeFrequency: 'daily' as const, priority: 1.0, lastModified: new Date() },
    { url: `${baseUrl}/tools`, changeFrequency: 'daily' as const, priority: 0.9, lastModified: new Date() },
    { url: `${baseUrl}/skills`, changeFrequency: 'daily' as const, priority: 0.9, lastModified: new Date() },
    { url: `${baseUrl}/scenes`, changeFrequency: 'weekly' as const, priority: 0.8, lastModified: new Date() },
    { url: `${baseUrl}/favorites`, changeFrequency: 'weekly' as const, priority: 0.5, lastModified: new Date() },
    { url: `${baseUrl}/auth/login`, changeFrequency: 'monthly' as const, priority: 0.3, lastModified: new Date() },
  ]

  const toolPages = tools.map(tool => ({
    url: `${baseUrl}/tools/${tool.id}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  const skillPages = skills.map(skill => ({
    url: `${baseUrl}/skills/${skill.id}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  const scenePages = scenes.map(scene => ({
    url: `${baseUrl}/scenes/${scene.id}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }))

  return [...staticPages, ...toolPages, ...skillPages, ...scenePages]
}
