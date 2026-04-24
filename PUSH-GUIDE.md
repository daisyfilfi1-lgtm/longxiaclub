# 🚀 代码推送指南

## 📋 推送前检查清单

- [ ] 所有代码已保存
- [ ] 环境变量已配置（`.env.local` 不被提交）
- [ ] GitHub 仓库已创建
- [ ] GitHub Secrets 已配置

---

## 🔧 第一步：配置 GitHub Secrets

在 GitHub 仓库页面 → Settings → Secrets and variables → Actions 中添加以下 secrets：

### 必需 Secrets

| Secret 名称 | 说明 | 获取方式 |
|------------|------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase 项目 URL | Supabase Dashboard → Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase 匿名密钥 | Supabase Dashboard → Settings → API |
| `DEEPSEEK_API_KEY` | DeepSeek API 密钥 | DeepSeek 控制台 |

### 可选 Secrets

| Secret 名称 | 说明 | 默认值 |
|------------|------|--------|
| `DEEPSEEK_BASE_URL` | DeepSeek API 地址 | https://api.deepseek.com |
| `SITE_URL` | 网站域名 | https://longxiaclub.com |
| `NETLIFY_AUTH_TOKEN` | Netlify 部署令牌（如使用自动部署则不需要）| - |
| `NETLIFY_SITE_ID` | Netlify 站点 ID | - |

---

## 📤 第二步：推送代码

### 方式一：命令行推送（推荐）

```bash
# 1. 确保在正确的目录
cd f:\AI导航\ai-nav

# 2. 初始化 Git（如果尚未初始化）
git init

# 3. 添加远程仓库（替换为你的仓库地址）
git remote add origin https://github.com/YOUR_USERNAME/ai-nav.git

# 4. 添加所有文件
git add .

# 5. 提交更改
git commit -m "🎉 Initial commit: AI导航站完整项目

包含功能：
- Next.js 前端（工具展示、Skill市场、场景方案）
- Supabase 后端集成
- 用户认证系统
- API 缓存策略
- ISR 静态生成
- 自动化内容生成
- 后台管理系统
- Docker 部署支持
- GitHub Actions 自动化"

# 6. 推送到 GitHub
git push -u origin main

# 如果是 master 分支
git push -u origin master
```

### 方式二：使用 VS Code 图形界面

1. 打开 VS Code
2. 点击左侧源代码管理图标（Ctrl+Shift+G）
3. 输入提交信息
4. 点击提交并推送

---

## 🔍 第三步：验证部署

### 1. 检查 GitHub Actions

访问：`https://github.com/YOUR_USERNAME/ai-nav/actions`

应该看到：
- ✅ PR Check - 通过
- ✅ Deploy Frontend - 成功（如果使用 Netlify 自动部署，此步骤可省略）

### 2. 检查自动化任务

等待到每天凌晨 2 点（UTC），或手动触发：

```
GitHub 仓库 → Actions → Auto Update Skills → Run workflow
```

### 3. 验证网站

访问你的网站地址，确认：
- [ ] 首页正常加载
- [ ] 工具列表显示
- [ ] 搜索功能正常
- [ ] 后台管理可访问

---

## 🔄 后续更新流程

### 日常开发

```bash
# 修改代码后
git add .
git commit -m "✨ 新增功能：xxx"
git push
```

### 手动触发自动化更新

```bash
# 本地立即更新
python scripts/skills-auto.py --mode update

# 或推送到 GitHub 触发 Actions
# GitHub 仓库 → Actions → Auto Update Skills → Run workflow
```

---

## 🛠️ 故障排查

### 问题：推送被拒绝

```bash
# 先拉取远程更改
git pull origin main

# 解决冲突后重新推送
git push
```

### 问题：GitHub Actions 失败

1. 检查 Secrets 是否配置正确
2. 查看 Actions 日志获取详细错误
3. 本地测试：`npm run build`

### 问题：Netlify 部署失败

- 确保 `netlify.toml` 配置正确
- 检查构建命令：`npm run build`
- 检查发布目录：`.next` 或 `dist`

---

## 📁 重要文件说明

```
.github/
├── workflows/
│   ├── auto-update-skills.yml    # 自动更新 Skills
│   ├── deploy-frontend.yml       # 前端部署
│   └── pr-check.yml              # PR 检查
```

这些文件确保：
1. 每天自动更新 Skills 内容
2. 代码推送到 main 分支后自动部署
3. PR 合并前自动检查代码

---

## ✅ 推送完成后的状态

```
✅ 代码在 GitHub 上
✅ Netlify 自动部署已启用
✅ GitHub Actions 自动化运行
✅ 每天自动更新 Skills 数据
```

现在你的网站已经具备完整的 CI/CD 流程！
