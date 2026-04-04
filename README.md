# AI导航站

AI 工具导航站项目，基于 Next.js + Supabase + Tailwind CSS 构建。

## 线上地址

- 主域名: `https://longxiaclub.com`
- Netlify 默认域名: `https://longxiaclub.netlify.app`

## 技术栈

- **框架**: Next.js 15 (App Router)
- **语言**: TypeScript
- **样式**: Tailwind CSS
- **后端**: Supabase (PostgreSQL)
- **部署**: Netlify / Docker
- **自动化**: Python + DeepSeek AI

## 项目结构

```
├── app/                    # Next.js App Router
│   ├── api/               # API 路由
│   ├── tools/             # 工具相关页面
│   ├── skills/            # Skill 相关页面
│   ├── scenes/            # 场景方案页面
│   └── favorites/         # 收藏夹页面
├── components/            # React 组件
├── data/                  # 本地数据文件
├── lib/                   # 工具库（Supabase 客户端等）
├── scripts/               # 自动化脚本
├── types/                 # TypeScript 类型定义
└── hooks/                 # React Hooks
```

## 本地开发

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

```bash
cp .env.example .env.local
# 编辑 .env.local 填入实际值
```

### 3. 启动开发服务器

```bash
npm run dev
```

访问 `http://localhost:3000`

## 本地构建

```bash
npm run build
npm start
```

## 数据管理

### API 路由

- `GET /api/tools` - 获取工具列表
- `GET /api/skills` - 获取 Skill 列表
- `GET /api/search?q=xxx` - 搜索
- `GET /api/leaderboard` - 获取榜单数据

### 数据源优先级

1. **Supabase** (生产环境)
2. **本地数据** (`data/tools.ts` - 开发/备份)

### 自动化脚本

```bash
# 生成 Skills
npm run skills:generate

# 采集内容
npm run skills:collect

# 完整更新
npm run skills:update
```

## 部署

### Netlify（推荐）

1. 连接 GitHub 仓库
2. 配置环境变量（参见 `.env.example`）
3. 自动部署

### Docker

```bash
# 配置环境变量
cp .env.example .env
# 编辑 .env 填入实际值

# 启动服务
docker-compose up -d
```

## 功能特性

- 🔍 实时搜索（支持工具和 Skill）
- 📊 热度榜单（产品飙升榜、Skill热门榜）
- 🏷️ 场景化分类（办公提效、内容创作、编程开发等）
- ❤️ 收藏功能（localStorage 存储）
- 🤖 AI 自动生成内容（Skills、使用技巧）
- 📱 响应式设计

## 贡献指南

1. Fork 项目
2. 创建功能分支：`git checkout -b feature/xxx`
3. 提交更改：`git commit -m 'Add xxx'`
4. 推送分支：`git push origin feature/xxx`
5. 创建 Pull Request

## 许可证

MIT
