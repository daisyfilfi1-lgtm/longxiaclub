# Docker 部署速查表

## 🚀 一键部署

```bash
# 1. 准备环境变量
cp .env.docker.example .env
# 编辑 .env 填入你的配置

# 2. 启动服务
docker-compose -f docker-compose.full.yml up -d

# 3. 查看日志
docker-compose -f docker-compose.full.yml logs -f

# 4. 访问应用
open http://localhost:3000
```

## 📋 必需的环境变量

在 `.env` 文件中配置以下变量：

```bash
# Supabase（从 Supabase Dashboard 获取）
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_KEY=eyJ...

# DeepSeek AI（从 DeepSeek 控制台获取）
DEEPSEEK_API_KEY=sk-...

# 安全密钥（自己生成随机字符串）
ADMIN_TOKEN=$(openssl rand -base64 32)
REVALIDATE_TOKEN=$(openssl rand -base64 32)
```

## 🎯 常用命令

| 命令 | 说明 |
|------|------|
| `docker-compose up -d` | 启动自动化服务 |
| `docker-compose -f docker-compose.full.yml up -d` | 启动完整环境 |
| `docker-compose logs -f` | 查看实时日志 |
| `docker-compose down` | 停止并删除容器 |
| `docker-compose restart` | 重启服务 |
| `docker ps` | 查看运行中的容器 |
| `docker stats` | 查看资源使用 |

## 🔍 故障排查

```bash
# 查看容器状态
docker-compose ps

# 查看错误日志
docker-compose logs --tail=50

# 进入容器
docker exec -it ai-nav-frontend sh

# 测试健康检查
curl http://localhost:3000/api/health

# 清理缓存重建
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

## 📊 服务端口

| 服务 | 端口 | 说明 |
|------|------|------|
| 前端 | 3000 | Next.js 应用 |
| 自动化 | - | 定时任务（无外部端口） |

## 🔐 安全检查清单

- [ ] `.env` 文件已创建并配置正确
- [ ] `.env` 文件权限设置为 600
- [ ] `.env` 已添加到 `.gitignore`
- [ ] 使用 HTTPS（生产环境）
- [ ] 定期更新镜像
