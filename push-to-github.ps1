# AI导航站 - GitHub 推送脚本 (PowerShell)

$ErrorActionPreference = "Stop"

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "   AI导航站 - GitHub 推送脚本" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

# 检查 Git
Write-Host "[1/5] 检查 Git 安装..." -ForegroundColor Yellow
try {
    $gitVersion = git --version
    Write-Host "✅ Git 已安装: $gitVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Git 未安装，请先安装 Git" -ForegroundColor Red
    Write-Host "下载地址：https://git-scm.com/download/win"
    exit 1
}

# 配置（请修改为你的仓库地址）
$repoUrl = "https://github.com/YOUR_USERNAME/ai-nav.git"

Write-Host ""
Write-Host "[2/5] 检查 Git 状态..." -ForegroundColor Yellow
git status

Write-Host ""
Write-Host "[3/5] 添加所有文件..." -ForegroundColor Yellow
git add .

Write-Host ""
Write-Host "[4/5] 提交更改..." -ForegroundColor Yellow
$commitMessage = @"
🎉 Initial commit: AI导航站完整项目

包含功能：
- Next.js 前端（工具展示、Skill市场、场景方案）
- Supabase 后端集成
- 用户认证系统
- API 缓存策略
- ISR 静态生成
- 自动化内容生成
- 后台管理系统
- Docker 部署支持
- GitHub Actions 自动化
"@

try {
    git commit -m $commitMessage
    Write-Host "✅ 提交成功" -ForegroundColor Green
} catch {
    Write-Host "⚠️  没有需要提交的更改，或已提交过" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "[5/5] 检查并配置远程仓库..." -ForegroundColor Yellow
$remote = git remote -v 2>$null
if (-not $remote) {
    Write-Host "添加远程仓库..." -ForegroundColor Yellow
    git remote add origin $repoUrl
    Write-Host "已添加远程仓库：$repoUrl" -ForegroundColor Green
    Write-Host "⚠️  请确保已修改脚本中的仓库地址为你实际的地址！" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "[6/5] 推送到 GitHub..." -ForegroundColor Yellow
try {
    git push -u origin main
    Write-Host "✅ 推送到 main 分支成功" -ForegroundColor Green
} catch {
    Write-Host "尝试推送到 master 分支..." -ForegroundColor Yellow
    try {
        git push -u origin master
        Write-Host "✅ 推送到 master 分支成功" -ForegroundColor Green
    } catch {
        Write-Host "❌ 推送失败，请检查错误信息" -ForegroundColor Red
        exit 1
    }
}

Write-Host ""
Write-Host "==========================================" -ForegroundColor Green
Write-Host "   ✅ 推送完成！" -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Green
Write-Host ""
Write-Host "下一步操作：" -ForegroundColor Cyan
Write-Host "1. 访问 GitHub 仓库查看代码"
Write-Host "2. 在 Settings -> Secrets 中配置环境变量"
Write-Host "3. 在 Actions 中查看部署状态"
Write-Host ""

Read-Host "按 Enter 键退出"
