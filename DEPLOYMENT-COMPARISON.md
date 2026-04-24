# 自动化脚本：本地运行 vs Docker 运行 对比

## 📊 核心区别一览

| 特性 | 本地运行 | Docker 运行 |
|------|---------|-------------|
| **环境依赖** | 需安装 Python + 依赖包 | 无需安装，自带环境 |
| **部署难度** | 简单 | 稍复杂（需安装 Docker）|
| **可移植性** | 差（换机器需重新配置）| 好（一次构建，到处运行）|
| **隔离性** | 无（影响宿主机）| 高（容器隔离）|
| **定时任务** | 需配置系统 crontab | 内置 crontab |
| **日志管理** | 手动管理 | 自动收集，统一查看 |
| **重启恢复** | 需手动重启 | 自动重启（--restart always）|
| **资源占用** | 低 | 稍高（容器开销）|

---

## 🖥️ 本地运行详解

### 适用场景
- 个人开发/测试
- 临时运行几次
- 熟悉 Python 环境配置
- 不想学习 Docker

### 运行方式

```bash
# 1. 安装 Python 依赖
pip install -r requirements.txt

# 2. 直接运行
python scripts/skills-auto.py --mode update

# 或手动运行生成
python scripts/skills-auto.py --mode generate
```

### 定时任务配置（Windows）

```powershell
# 使用任务计划程序（Task Scheduler）
# 1. 打开任务计划程序
# 2. 创建基本任务
# 3. 设置每天凌晨 2 点触发
# 4. 操作：启动程序
# 5. 程序：python
# 6. 参数：scripts/skills-auto.py --mode update
# 7. 起始于：项目目录
```

### 定时任务配置（Mac/Linux）

```bash
# 编辑 crontab
crontab -e

# 添加定时任务（每天凌晨 2 点）
0 2 * * * cd /path/to/ai-nav && python scripts/skills-auto.py --mode update >> /var/log/skills-auto.log 2>&1

# 查看定时任务
crontab -l
```

### ✅ 优点
- 简单直接，无需学习 Docker
- 资源占用少
- 调试方便

### ❌ 缺点
- **换电脑需重新配置环境**
- **依赖冲突**：与系统其他 Python 项目可能冲突
- **定时任务不稳定**：电脑关机/睡眠时不执行
- **日志分散**：需要手动管理日志文件

---

## 🐳 Docker 运行详解

### 适用场景
- 生产环境长期运行
- 需要 7×24 小时稳定执行
- 多机器部署
- 团队协作（环境一致性）

### 运行方式

```bash
# 1. 配置环境变量
cp .env.docker.example .env
# 编辑 .env 文件

# 2. 一键启动
docker-compose up -d

# 3. 查看日志
docker-compose logs -f
```

### 容器内部结构

```
Docker 容器 (ai-nav-auto)
├── Python 3.11 (已安装)
├── 定时任务 (crontab)
│   └── 每天 2:00 AM 运行 skills-auto.py
├── 工作目录 /app
│   ├── skills-auto.py
│   └── data/
├── 日志 /var/log/skills-auto.log
└── 环境变量（从 .env 传入）
```

### ✅ 优点

1. **环境一致性**
   ```bash
   # 在 Mac、Windows、Linux 上运行完全一致
   # 无需担心 "在我机器上能运行" 的问题
   ```

2. **自带定时任务**
   ```dockerfile
   # Dockerfile 中已配置
   RUN echo "0 2 * * * cd /app && python skills-auto.py --mode update" >> /var/spool/cron/crontabs/root
   ```

3. **自动重启**
   ```yaml
   # docker-compose.yml
   restart: always  # 崩溃后自动重启
   ```

4. **日志集中管理**
   ```bash
   docker-compose logs -f  # 实时查看所有日志
   ```

5. **资源隔离**
   - 不影响宿主机其他程序
   - 独立的文件系统

### ❌ 缺点

1. **需要学习 Docker**
   - 基础概念（镜像、容器、卷）
   - 常用命令

2. **资源开销**
   - 占用额外内存（约 100-200MB）
   - 首次构建耗时

3. **文件权限**
   - 卷挂载可能有权限问题

---

## 🎯 决策指南

### 选择本地运行，如果：

- ✅ 只是临时运行几次测试
- ✅ 个人开发环境
- ✅ 不想学习 Docker
- ✅ 电脑长期开机（服务器）

**示例**：
```bash
# 偶尔运行一次生成本地数据
python scripts/skills-auto.py --mode generate

# 或手动执行更新
python scripts/skills-auto.py --mode update
```

---

### 选择 Docker，如果：

- ✅ 需要每天自动执行（无人值守）
- ✅ 部署到云服务器（阿里云/腾讯云/AWS）
- ✅ 团队协作（统一环境）
- ✅ 需要高可靠性（自动重启）

**示例**：
```bash
# 在云服务器上
docker-compose up -d
# 之后无需关心，每天自动运行
```

---

## 💡 混合方案（推荐）

对于你的项目，建议这样使用：

### 开发阶段（本地）

```bash
# 使用本地 Python 快速测试
python scripts/skills-auto.py --mode generate
```

### 生产阶段（云服务器）

```bash
# 使用 Docker 长期运行
docker-compose up -d
```

### 使用 GitHub Actions（无需服务器）

如果你不想维护服务器，可以用 **GitHub Actions** 免费执行定时任务：

```yaml
# .github/workflows/auto-update.yml
name: Auto Update Skills

on:
  schedule:
    - cron: '0 2 * * *'  # 每天凌晨 2 点
  workflow_dispatch:  # 手动触发

jobs:
  update:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Python
        uses: actions/setup-python@v4
        with:
          python-version: '3.11'
      
      - name: Install dependencies
        run: pip install -r requirements.txt
      
      - name: Run update
        env:
          DEEPSEEK_API_KEY: ${{ secrets.DEEPSEEK_API_KEY }}
        run: python scripts/skills-auto.py --mode update
      
      - name: Commit changes
        run: |
          git config user.name "GitHub Action"
          git config user.email "action@github.com"
          git add data/
          git diff --staged --quiet || git commit -m "Auto update skills"
          git push
```

**优点**：
- ✅ 完全免费
- ✅ 无需维护服务器
- ✅ 自动生成 PR/提交
- ✅ 自动保存到 Git 历史

---

## 📋 总结

| 你的情况 | 推荐方案 |
|---------|---------|
| 只是试试/测试 | 本地 Python |
| 个人使用，偶尔更新 | 本地 Python + 手动执行 |
| 需要每天自动更新 | Docker 或 GitHub Actions |
| 有云服务器 | Docker |
| 不想维护服务器 | GitHub Actions |
| 团队协作 | Docker |

**最省心的方案**：GitHub Actions（免费 + 自动 + 无需服务器）
