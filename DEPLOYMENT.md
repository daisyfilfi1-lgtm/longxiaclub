# AI导航站 - 部署指南

## 部署架构

本项目采用前后端分离架构：
- **前端**: Next.js 应用（SSR 模式）部署在 Netlify
- **后端**: Supabase（PostgreSQL + REST API）
- **自动化**: Docker 容器运行定时任务

## 环境变量配置

### 必需配置

在 Netlify 后台或本地 `.env.local` 中配置：

```bash
# Supabase 配置
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
```

### 可选配置

```bash
# DeepSeek AI（用于自动化内容生成）
DEEPSEEK_API_KEY=your-api-key
DEEPSEEK_BASE_URL=https://api.deepseek.com

# 网站配置
SITE_URL=https://your-domain.com
```

## Netlify 部署

1. 连接 GitHub 仓库到 Netlify
2. 配置构建命令：`npm run build`
3. 配置发布目录：`.next`
4. 添加环境变量（见上文）
5. 安装 Next.js 运行时插件：`@netlify/plugin-nextjs`

## Docker 自动化部署

### 使用 Docker Compose（推荐）

1. 创建 `.env` 文件：

```bash
cp .env.example .env
# 编辑 .env 填入实际值
```

2. 启动服务：

```bash
docker-compose up -d
```

### 手动构建

```bash
# 构建镜像
docker build -t skills-auto .

# 运行容器（传入环境变量）
docker run -d \
  --name skills-auto \
  --restart always \
  -e DEEPSEEK_API_KEY=your-api-key \
  -e DEEPSEEK_BASE_URL=https://api.deepseek.com \
  -e SITE_URL=https://your-domain.com \
  skills-auto
```

## 数据流说明

### 当前实现

1. **API 路由** (`/api/*`): 
   - 优先尝试从 Supabase 获取数据
   - Supabase 不可用时回退到本地数据 (`data/tools.ts`)

2. **本地数据**: 
   - 用于开发和备份
   - 生产环境建议配置 Supabase 连接

### 数据同步

- 工具/Skill 数据存储在 Supabase
- 自动化脚本可更新本地 JSON 文件
- 定期备份策略: Supabase 自动备份 + 本地 Git 版本控制

## 监控与日志

### Docker 日志

```bash
# 查看实时日志
docker-compose logs -f

# 查看历史日志
docker logs skills-auto --tail 100
```

### 健康检查

- 容器内置健康检查（每6小时）
- 可通过端口 8080 访问健康端点（如有需要）

## 故障排查

### 常见问题

1. **API 返回本地数据**
   - 检查 Supabase 环境变量是否配置
   - 检查 Supabase 服务是否正常

2. **搜索无结果**
   - 确认搜索关键词长度 >= 1
   - 检查 API 路由是否正常

3. **Docker 容器无法启动**
   - 检查环境变量是否传入
   - 查看日志: `docker logs skills-auto`

## 安全注意事项

- ⚠️ **永远不要将 API Key 提交到 Git**
- ⚠️ **使用环境变量管理所有敏感信息**
- ⚠️ **定期轮换 API Key**
- ✅ `.env.local` 已在 `.gitignore` 中

## 更新流程

1. 更新代码：`git pull`
2. 重新构建：`npm run build`
3. 重启容器：`docker-compose restart`
4. 验证部署：访问网站检查功能
