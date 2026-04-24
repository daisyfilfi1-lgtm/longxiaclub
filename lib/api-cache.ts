/**
 * API 路由缓存中间件
 * 为 Next.js API 路由提供缓存功能
 */

import { NextRequest, NextResponse } from 'next/server';
import { globalCache, generateCacheKey } from './cache';

interface CacheOptions {
  ttl?: number;           // 缓存时间（秒）
  keyGenerator?: (req: NextRequest) => string;
  bypassHeader?: string;  // 跳过头部的名称
  varyByHeaders?: string[];  // 根据哪些 header 变化
}

// 默认缓存时间（5分钟）
const DEFAULT_TTL = 300;

// 生成缓存 key
function generateApiCacheKey(req: NextRequest, options: CacheOptions = {}): string {
  if (options.keyGenerator) {
    return options.keyGenerator(req);
  }

  const url = new URL(req.url);
  const params: Record<string, string> = {};
  
  // 添加查询参数
  url.searchParams.forEach((value, key) => {
    params[key] = value;
  });

  // 添加 vary headers
  if (options.varyByHeaders) {
    options.varyByHeaders.forEach(header => {
      const value = req.headers.get(header);
      if (value) {
        params[`header_${header}`] = value;
      }
    });
  }

  return generateCacheKey(`api:${url.pathname}`, params);
}

// 缓存中间件
export function withApiCache(
  handler: (req: NextRequest) => Promise<NextResponse>,
  options: CacheOptions = {}
): (req: NextRequest) => Promise<NextResponse> {
  return async (req: NextRequest) => {
    // 检查是否需要跳过缓存
    const bypassValue = options.bypassHeader 
      ? req.headers.get(options.bypassHeader)
      : req.headers.get('x-bypass-cache');

    if (bypassValue === 'true') {
      const response = await handler(req);
      response.headers.set('x-cache', 'BYPASS');
      return response;
    }

    // POST/PUT/DELETE 请求不缓存
    if (!['GET', 'HEAD'].includes(req.method)) {
      return handler(req);
    }

    const cacheKey = generateApiCacheKey(req, options);
    const ttl = options.ttl || DEFAULT_TTL;

    // 尝试从缓存获取
    const cached = globalCache.get<{ body: string; headers: Record<string, string> }>(cacheKey);
    
    if (cached) {
      const response = new NextResponse(cached.body, {
        status: 200,
        headers: {
          ...cached.headers,
          'x-cache': 'HIT',
          'x-cache-key': cacheKey
        }
      });
      return response;
    }

    // 执行处理器
    const response = await handler(req);

    // 只缓存成功响应
    if (response.status === 200) {
      try {
        const body = await response.text();
        const headers: Record<string, string> = {};
        
        // 复制关键 headers
        ['content-type'].forEach(header => {
          const value = response.headers.get(header);
          if (value) headers[header] = value;
        });

        // 存入缓存
        globalCache.set(cacheKey, { body, headers }, ttl);

        // 返回新响应
        return new NextResponse(body, {
          status: 200,
          headers: {
            ...headers,
            'x-cache': 'MISS',
            'x-cache-key': cacheKey
          }
        });
      } catch (error) {
        // 缓存失败不影响响应
        console.error('Cache error:', error);
      }
    }

    return response;
  };
}

// API 路由配置
export const apiCacheConfig = {
  // 工具列表缓存
  tools: {
    ttl: 600,  // 10分钟
    varyByHeaders: []
  },
  // Skill 列表缓存
  skills: {
    ttl: 600,
    varyByHeaders: []
  },
  // 榜单缓存（较短）
  leaderboard: {
    ttl: 60,  // 1分钟
    varyByHeaders: []
  },
  // 搜索结果缓存（很短）
  search: {
    ttl: 30,  // 30秒
    varyByHeaders: []
  }
};
