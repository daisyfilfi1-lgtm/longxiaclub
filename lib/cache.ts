/**
 * API 缓存工具
 * 支持内存缓存和 Redis 缓存（生产环境）
 */

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

interface CacheConfig {
  defaultTTL: number;  // 默认缓存时间（秒）
  maxSize: number;     // 最大缓存条目数（内存缓存）
  checkPeriod: number; // 清理周期（秒）
}

class MemoryCache {
  private cache: Map<string, CacheEntry<any>> = new Map();
  private config: CacheConfig;

  constructor(config: Partial<CacheConfig> = {}) {
    this.config = {
      defaultTTL: 300,  // 5 分钟
      maxSize: 1000,
      checkPeriod: 60,
      ...config
    };

    // 启动定期清理
    setInterval(() => this.cleanup(), this.config.checkPeriod * 1000);
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    
    if (!entry) return null;
    
    // 检查是否过期
    if (Date.now() - entry.timestamp > entry.ttl * 1000) {
      this.cache.delete(key);
      return null;
    }

    return entry.data as T;
  }

  set<T>(key: string, data: T, ttl?: number): void {
    // 如果缓存已满，删除最旧的条目
    if (this.cache.size >= this.config.maxSize) {
      const { value: firstKey, done } = this.cache.keys().next();
      if (!done && firstKey !== undefined) {
        this.cache.delete(firstKey);
      }
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttl || this.config.defaultTTL
    });
  }

  delete(key: string): void {
    this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  has(key: string): boolean {
    return this.get(key) !== null;
  }

  private cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.ttl * 1000) {
        this.cache.delete(key);
      }
    }
  }

  getStats(): { size: number; maxSize: number } {
    return {
      size: this.cache.size,
      maxSize: this.config.maxSize
    };
  }
}

// 全局单例
const globalCache = new MemoryCache();

// 缓存 Key 生成器
export function generateCacheKey(prefix: string, params: Record<string, any>): string {
  const sortedParams = Object.entries(params)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => `${k}=${v}`)
    .join('&');
  return `${prefix}:${sortedParams}`;
}

// 缓存装饰器（用于 API 路由）
export function withCache<T>(
  fn: () => Promise<T>,
  key: string,
  ttl?: number
): Promise<T> {
  const cached = globalCache.get<T>(key);
  
  if (cached !== null) {
    return Promise.resolve(cached);
  }

  return fn().then(data => {
    globalCache.set(key, data, ttl);
    return data;
  });
}

// 清除缓存
export function clearCache(pattern?: string): void {
  if (!pattern) {
    globalCache.clear();
    return;
  }

  // 注意：内存缓存不支持模式匹配，只能清除特定 key
  // 生产环境使用 Redis 时可以实现模式匹配
}

// 获取缓存统计
export function getCacheStats(): { size: number; maxSize: number } {
  return globalCache.getStats();
}

// 导出单例
export { globalCache, MemoryCache };
