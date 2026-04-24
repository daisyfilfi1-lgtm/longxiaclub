# AI导航站 - 开发指南

## 项目概述

AI导航站是一个AI工具聚合平台，采用 Next.js + Supabase + Tailwind CSS 技术栈。

## 技术决策

### 1. 为什么选择 SSR 而不是静态导出？

虽然静态导出性能更好，但项目需要：
- API 路由用于数据获取
- 动态搜索功能
- 用户认证
- 实时数据更新

### 2. 数据源优先级

API 路由实现双数据源策略：
1. **优先尝试 Supabase**: 生产环境使用
2. **本地数据回退** (`data/tools.ts` - 开发/备份)

### 3. 缓存策略

- **API 路由缓存**: 内存缓存 (5-10分钟)
- **客户端缓存**: SWR (自动刷新、去重)
- **页面缓存**: ISR (增量静态再生)

### 4. 认证方案

使用 Supabase Auth：
- 邮箱/密码登录
- 第三方 OAuth (GitHub, Google)
- JWT Token 自动刷新

## 目录结构

```
app/                      # Next.js App Router
├── api/                  # API 路由
│   ├── admin/           # 后台管理 API
│   ├── tools/           # 工具 API
│   ├── skills/          # Skills API
│   ├── search/          # 搜索 API
│   ├── leaderboard/     # 榜单 API
│   └── revalidate/      # ISR 重新验证
├── tools/               # 工具相关页面
├── skills/              # Skill 相关页面
├── scenes/              # 场景方案页面
├── admin/               # 后台管理页面
├── auth/                # 认证页面
├── providers.tsx        # 全局 Providers
└── layout.tsx           # 根布局

components/              # React 组件
├── *.tsx               # 业务组件

lib/                     # 工具库
├── supabase.ts         # Supabase 客户端
├── cache.ts            # 缓存工具
├── api-cache.ts        # API 缓存中间件
├── auth.ts             # 认证工具
└── monitoring.ts       # 监控工具

data/                    # 静态数据
└── tools.ts            # 工具/Skill/场景数据

hooks/                   # React Hooks
├── useApi.ts           # SWR 数据获取
├── useAuth.ts          # 认证状态
└── useFavorites.ts     # 收藏功能

scripts/                 # 自动化脚本
├── sync-to-supabase.ts # 数据同步
├── migrate-database.ts # 数据库迁移
├── backup-database.ts  # 数据备份
└── skill-generator.js  # Skill 生成

types/                   # TypeScript 类型
└── index.ts            # 所有类型定义
```

## API 路由规范

### 通用响应格式

```typescript
{
  success: boolean;
  data: any;
  source?: 'supabase' | 'local' | 'local-fallback';
  cached?: boolean;
  error?: string;
}
```

### 缓存头部

API 响应包含缓存状态：
- `x-cache: HIT` - 命中缓存
- `x-cache: MISS` - 未命中缓存
- `x-cache: BYPASS` - 跳过缓存

### 查询参数

- `source=auto|local|supabase`: 指定数据源
- `limit=n`: 限制返回数量
- `category=xxx`: 按分类过滤

## 组件开发规范

### 数据获取

**服务端组件** (Server Components):
```tsx
import { tools } from '@/data/tools';

export default async function Page() {
  // 直接使用本地数据或 fetch
  const data = await fetch('/api/tools');
  return <Component data={data} />;
}
```

**客户端组件** (Client Components):
```tsx
'use client';
import { useTools } from '@/hooks/useApi';

export default function Component() {
  const { tools, isLoading, error } = useTools();
  // 自动缓存和刷新
}
```

### 加载状态

```tsx
if (isLoading) return <LoadingSkeleton />;
if (error) return <ErrorMessage error={error} />;
```

## 环境变量

### 必需

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-key
```

### 可选

```bash
# DeepSeek AI
DEEPSEEK_API_KEY=your-api-key
DEEPSEEK_BASE_URL=https://api.deepseek.com

# 管理后台
ADMIN_TOKEN=your-admin-token
REVALIDATE_TOKEN=your-revalidate-token

# 监控
NEXT_PUBLIC_MONITORING_ENDPOINT=https://your-monitoring.com
```

## 部署检查清单

- [ ] 环境变量已配置
- [ ] Supabase 数据库表已创建 (`npm run db:migrate`)
- [ ] 数据已同步 (`npm run db:sync`)
- [ ] 构建通过 (`npm run build`)
- [ ] API 路由测试通过
- [ ] 搜索功能正常
- [ ] 认证流程测试通过
- [ ] 后台管理访问正常

## 常用命令

```bash
# 开发
npm run dev

# 构建
npm run build

# 类型检查
npm run type-check

# 数据库操作
npm run db:migrate          # 迁移数据库
npm run db:sync             # 同步数据到 Supabase
npm run db:sync:full        # 全量同步
npm run db:backup           # 备份数据

# Skill 生成
npm run skills:generate     # 生成 Skills
npm run skills:update       # 更新 Skills
```

## 性能优化

### 1. ISR (增量静态再生)

页面级缓存：
```tsx
export const revalidate = 60; // 60秒重新生成
```

### 2. API 缓存

路由级缓存：
```tsx
export const GET = withApiCache(handler, { ttl: 600 });
```

### 3. 客户端缓存

SWR 自动处理：
```tsx
const { data } = useSWR('/api/tools', fetcher, {
  revalidateOnFocus: false,
  refreshInterval: 60000
});
```

## 安全注意事项

- ⚠️ **永远不要提交 API Key 到 Git**
- ⚠️ **使用环境变量管理所有敏感信息**
- ⚠️ **定期轮换 API Key**
- ✅ `.env.local` 已在 `.gitignore` 中
- ✅ 管理后台需要登录
- ✅ API 路由验证权限

## 监控和日志

### 错误监控

```tsx
import { captureError } from '@/lib/monitoring';

try {
  // ...
} catch (error) {
  captureError(error, { context: 'page' });
}
```

### 性能监控

```tsx
import { trackPerformance } from '@/lib/monitoring';

trackPerformance('page_load', loadTime, { page: 'tools' });
```

## 常见问题

### Q: API 返回本地数据而不是 Supabase 数据？

A: 检查环境变量是否配置。API 会在 Supabase 不可用时自动回退到本地数据。

### Q: 如何添加新工具？

1. 在 `data/tools.ts` 的 `tools` 数组中添加
2. 运行 `npm run db:sync` 同步到数据库
3. 重新部署

### Q: 缓存未更新？

A: 可以：
1. 访问 `/admin` 后台手动清除缓存
2. 调用 `/api/revalidate` API
3. 等待缓存自动过期

### Q: 用户收藏如何同步？

A: 登录后，收藏数据会自动同步到 Supabase。未登录时存储在 localStorage。

## 扩展阅读

- [Next.js 文档](https://nextjs.org/docs)
- [Supabase 文档](https://supabase.com/docs)
- [SWR 文档](https://swr.vercel.app/)
- [Tailwind CSS 文档](https://tailwindcss.com/docs)
