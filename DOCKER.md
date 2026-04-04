# AI导航站 - Docker 部署指南

## 📋 概述

本项目提供两种 Docker 部署方式：

1. **前端服务** (`Dockerfile.frontend`) - Next.js 应用
2. **自动化服务** (`Dockerfile`) - Python 定时任务

## 🚀 快速开始

### 方式一：使用 Docker Compose（推荐）

#### 1. 准备环境变量文件

```bash
# 复制示例文件
cp .env.docker.example .env

# 编辑 .env 文件，填入实际值
nano .env
```

#### 2. 启动所有服务

```bash
# 仅启动自动化服务
docker-compose up -d

# 启动完整环境（前端 + 自动化）
docker-compose -f docker-compose.full.yml up -d
```

#### 3. 查看状态

```bash
# 查看运行状态
docker-compose ps

# 查看日志
docker-compose logs -f

# 查看特定服务日志
docker-compose logs -f frontend
```

### 方式二：手动构建和运行

#### 前端服务

```bash
# 构建镜像
docker build -f Dockerfile.frontend -t ai-nav-frontend .

# 运行容器
docker run -d \
  --name ai-nav-frontend \
  -p 3000:3000 \
  --env-file .env \
  --restart always \
  ai-nav-frontend
```

#### 自动化服务

```bash
# 构建镜像
docker build -t ai-nav-auto .

# 运行容器
docker run -d \
  --name ai-nav-auto \
  --env-file .env \
  -v ./data:/app/data \
  -v ./logs:/var/log \
  --restart always \
  ai-nav-auto
```

## 📁 环境变量配置

### 必需变量

```env
# Supabase 配置
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-key

# DeepSeek AI（用于自动化内容生成）
DEEPSEEK_API_KEY=your-api-key

# 网站配置
SITE_URL=http://localhost:3000

# 安全密钥（使用 openssl rand -base64 32 生成）
ADMIN_TOKEN=your-random-token
REVALIDATE_TOKEN=your-random-token
```

### 可选变量

```env
# DeepSeek 基础 URL（默认：https://api.deepseek.com）
DEEPSEEK_BASE_URL=https://api.deepseek.com

# 监控端点
NEXT_PUBLIC_MONITORING_ENDPOINT=https://your-monitoring.com
```

## 🔧 常用命令

### 容器管理

```bash
# 启动
docker-compose up -d

# 停止
docker-compose down

# 重启
docker-compose restart

# 重启特定服务
docker-compose restart frontend

# 更新（拉取最新代码后）
docker-compose pull
docker-compose up -d
```

### 日志查看

```bash
# 查看所有日志
docker-compose logs

# 实时查看日志
docker-compose logs -f

# 查看最近 100 行
docker-compose logs --tail=100

# 查看特定服务
docker-compose logs -f skills-auto
```

### 容器维护

```bash
# 进入容器内部
docker exec -it ai-nav-frontend sh
docker exec -it ai-nav-auto bash

# 查看资源使用
docker stats

# 清理未使用的资源
docker system prune

# 删除所有数据（谨慎使用）
docker-compose down -v
```

## 📊 服务说明

### 前端服务 (ai-nav-frontend)

- **端口**: 3000
- **健康检查**: http://localhost:3000/api/health
- **重启策略**: always
- **用户**: 非 root (nextjs:1001)

### 自动化服务 (ai-nav-auto)

- **功能**: 定时生成和更新 Skills
- **定时任务**: 每天凌晨 2 点执行
- **日志位置**: /var/log/skills-auto.log
- **数据挂载**: ./data:/app/data

## 🔒 安全建议

### 1. 使用非 root 用户运行

前端服务默认使用 `nextjs` 用户（UID: 1001）运行，降低安全风险。

### 2. 保护敏感信息

```bash
# 设置环境变量文件权限
chmod 600 .env

# 不要将 .env 提交到 Git
echo ".env" >> .gitignore
```

### 3. 使用 HTTPS

生产环境建议使用反向代理（Nginx/Caddy）启用 HTTPS：

```yaml
# docker-compose.yml 中添加
services:
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
```

### 4. 定期更新镜像

```bash
# 更新基础镜像
docker-compose pull
docker-compose up -d

# 重建镜像
docker-compose build --no-cache
docker-compose up -d
```

## 🐛 故障排查

### 问题：容器无法启动

```bash
# 查看错误日志
docker-compose logs frontend

# 检查环境变量
docker exec ai-nav-frontend env | grep NEXT_PUBLIC

# 检查端口占用
lsof -i :3000
```

### 问题：无法连接 Supabase

```bash
# 测试网络连接
docker exec ai-nav-frontend wget -qO- https://your-project.supabase.co

# 检查环境变量是否正确传入
docker exec ai-nav-frontend echo $SUPABASE_URL
```

### 问题：自动化任务不执行

```bash
# 查看定时任务
docker exec ai-nav-auto crontab -l

# 查看日志
docker exec ai-nav-auto tail -f /var/log/skills-auto.log

# 手动执行测试
docker exec ai-nav-auto python skills-auto.py --mode generate
```

## 📈 性能优化

### 1. 启用 Docker BuildKit

```bash
export DOCKER_BUILDKIT=1
export COMPOSE_DOCKER_CLI_BUILD=1
```

### 2. 使用多阶段构建

Dockerfile 已使用多阶段构建，减小最终镜像体积。

### 3. 资源限制

```yaml
# docker-compose.yml 中添加
services:
  frontend:
    deploy:
      resources:
        limits:
          cpus: '2'
          memory: 2G
        reservations:
          cpus: '0.5'
          memory: 512M
```

## 🔄 CI/CD 集成

### GitHub Actions 示例

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy to Server
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.HOST }}
          username: ${{ secrets.USERNAME }}
          key: ${{ secrets.SSH_KEY }}
          script: |
            cd /opt/ai-nav
            git pull
            docker-compose -f docker-compose.full.yml up -d --build
```

## 📚 相关文档

- [Docker 官方文档](https://docs.docker.com/)
- [Docker Compose 文档](https://docs.docker.com/compose/)
- [Next.js Docker 部署](https://nextjs.org/docs/deployment#docker-image)

## 🤝 支持

如有问题，请查看：
1. 容器日志：`docker-compose logs`
2. 健康检查：http://localhost:3000/api/health
3. 项目文档：`README.md` 和 `ARCHITECTURE.md`
