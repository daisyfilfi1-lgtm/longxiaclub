import { MetadataRoute } from 'next';
import { tools, skills, scenes } from '@/data/tools';
import reports from '@/data/daily-reports/index';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://longxiaclub.com';

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
    { url: `${baseUrl}/tools`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/skills`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: `${baseUrl}/scenes`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/daily`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/evolution`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.3 },
    { url: `${baseUrl}/favorites`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.3 },
    { url: `${baseUrl}/trends`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.7 },
    { url: `${baseUrl}/trends/leaderboard`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.7 },
    { url: `${baseUrl}/trends/github`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.6 },
    { url: `${baseUrl}/trends/producthunt`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.6 },
    { url: `${baseUrl}/compare`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.6 },
  ];

  // Tool detail pages
  const toolPages: MetadataRoute.Sitemap = tools.map((tool) => ({
    url: `${baseUrl}/tools/${tool.id}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  // Skill detail pages
  const skillPages: MetadataRoute.Sitemap = skills.map((skill) => ({
    url: `${baseUrl}/skills/${skill.id}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));

  // Scene detail pages
  const scenePages: MetadataRoute.Sitemap = scenes.map((scene) => ({
    url: `${baseUrl}/scenes/${scene.id}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  // Daily report pages
  const dailyPages: MetadataRoute.Sitemap = reports.map((report) => ({
    url: `${baseUrl}/daily/${report.date}`,
    lastModified: new Date(report.date),
    changeFrequency: 'never' as const,
    priority: 0.5,
  }));

  // Compare pages
  const compareSlugs = [
    'chatgpt-vs-deepseek',
    'claude-code-vs-cursor',
    'claude-vs-chatgpt',
    'cursor-vs-copilot',
    'notion-vs-obsidian',
    'openclaw-vs-hermes',
    'perplexity-vs-gemini',
  ];
  const comparePages: MetadataRoute.Sitemap = compareSlugs.map((slug) => ({
    url: `${baseUrl}/compare/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.5,
  }));

  return [
    ...staticPages,
    ...toolPages,
    ...skillPages,
    ...scenePages,
    ...dailyPages,
    ...comparePages,
  ];
}
