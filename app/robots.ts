import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/api/admin', '/auth'],
      },
      {
        userAgent: 'GPTBot',
        allow: '/',
        disallow: ['/admin', '/api/admin', '/auth'],
      },
    ],
    sitemap: 'https://longxiaclub.com/sitemap.xml',
  };
}
