# ✅ 推送前检查清单

## 📋 必须完成的步骤

### 1. 创建 GitHub 仓库

- [ ] 访问 https://github.com/new
- [ ] 输入仓库名：`ai-nav`
- [ ] 选择 Public（开源）或 Private（私有）
- [ ] 不要勾选 "Initialize this repository with a README"
- [ ] 点击 "Create repository"

### 2. 配置 GitHub Secrets

仓库页面 → **Settings** → **Secrets and variables** → **Actions** → **New repository secret**

添加以下 Secrets：

#### 必需配置

| Secret 名称 | 值 | 获取位置 |
|------------|-----|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://xxxx.supabase.co` | Supabase Dashboard → Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJ...` | Supabase Dashboard → Settings → API |
| `DEEPSEEK_API_KEY` | `sk-...` | DeepSeek 控制台 |

#### 可选配置

| Secret 名称 | 值 | 说明 |
|------------|-----|------|
| `SITE_URL` | `https://longxiaclub.com` | 你的网站域名 |
| `DEEPSEEK_BASE_URL` | `https://api.deepseek.com` | DeepSeek API 地址 |

### 3. 修改推送脚本

编辑 `push-to-github.bat` 或 `push-to-github.ps1`：

```bash
# 将这一行修改为你的实际仓库地址
set REPO_URL=https://github.com/YOUR_USERNAME/ai-nav.git
```

### 4. 检查文件完整性

确保以下文件存在：

```
✅ .github/workflows/auto-update-skills.yml
✅ .github/workflows/deploy-frontend.yml
✅ .github/workflows/pr-check.yml
✅ scripts/skills-auto.py
✅ scripts/sync-to-supabase.ts
✅ scripts/migrate-database.ts
✅ lib/supabase.ts
✅ lib/auth.ts
✅ lib/cache.ts
✅ hooks/useApi.ts
✅ hooks/useAuth.ts
✅ app/admin/page.tsx
✅ app/auth/login/page.tsx
✅ app/api/health/route.ts
✅ next.config.ts
✅ netlify.toml
✅ package.json
✅ requirements.txt
```

### 5. 执行推送

双击运行：
```
push-to-github.bat
```

或在 PowerShell 中运行：
```powershell
.\push-to-github.ps1
```

---

## 🔍 推送后验证

### 1. 检查 GitHub 仓库

访问 `https://github.com/YOUR_USERNAME/ai-nav`

- [ ] 代码已上传
- [ ] 文件结构正确

### 2. 检查 GitHub Actions

访问 `https://github.com/YOUR_USERNAME/ai-nav/actions`

- [ ] Actions 已启用
- [ ] 工作流文件已加载

### 3. 配置 Netlify（如需要）

如果你使用 Netlify 部署：

1. 访问 https://app.netlify.com/
2. 点击 "Add new site" → "Import an existing project"
3. 选择 GitHub 仓库
4. 配置：
   - Build command: `npm run build`
   - Publish directory: `.next` 或 `dist`
5. 添加环境变量（与 GitHub Secrets 相同）
6. 点击 Deploy

### 4. 验证自动化

手动触发一次自动化任务：

1. 访问 `https://github.com/YOUR_USERNAME/ai-nav/actions`
2. 点击 "Auto Update Skills"
3. 点击 "Run workflow"
4. 选择 mode: `update`
5. 点击 "Run workflow"
6. 等待执行完成

---

## 🎯 预期结果

推送完成后，你将拥有：

✅ **代码托管**：GitHub 仓库  
✅ **自动部署**：Push 到 main 自动部署到 Netlify  
✅ **自动更新**：每天凌晨 2 点自动更新 Skills  
✅ **PR 检查**：合并前自动检查代码  
✅ **后台管理**：访问 `/admin` 管理系统  

---

## 🆘 常见问题

### Q: 推送时提示 "Permission denied"

A: 配置 GitHub 认证
```bash
git config --global user.name "Your Name"
git config --global user.email "your@email.com"

# 使用 HTTPS 令牌或 SSH 密钥
```

### Q: GitHub Actions 显示 "This workflow has no runs yet"

A: 正常，等工作流触发条件满足后就会有记录：
- Push 到 main 分支
- 或手动触发

### Q: 如何修改 Secrets？

A: Settings → Secrets → 点击 Secret 名称 → Update

---

## 📞 需要帮助？

1. 查看 `PUSH-GUIDE.md` 详细指南
2. 查看 `DEPLOYMENT.md` 部署文档
3. 查看 GitHub Actions 日志获取错误信息
