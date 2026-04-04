@echo off
chcp 65001
cls

echo ==========================================
echo    AI导航站 - GitHub 推送脚本
echo ==========================================
echo.

REM 检查 Git 是否安装
git --version >nul 2>&1
if errorlevel 1 (
    echo [错误] Git 未安装，请先安装 Git
    echo 下载地址：https://git-scm.com/download/win
    pause
    exit /b 1
)

REM 设置仓库地址（请修改为实际的仓库地址）
set REPO_URL=https://github.com/YOUR_USERNAME/ai-nav.git

echo [1/5] 检查 Git 状态...
git status

echo.
echo [2/5] 添加所有文件...
git add .

echo.
echo [3/5] 提交更改...
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

if errorlevel 1 (
    echo.
    echo [提示] 没有需要提交的更改，或已提交过
    echo.
)

echo.
echo [4/5] 检查远程仓库...
git remote -v >nul 2>&1
if errorlevel 1 (
    echo [4/5] 添加远程仓库...
    git remote add origin %REPO_URL%
    echo 已添加远程仓库：%REPO_URL%
    echo.
    echo ⚠️  请确保已修改脚本中的 REPO_URL 为你的实际仓库地址！
)

echo.
echo [5/5] 推送到 GitHub...
git push -u origin main

if errorlevel 1 (
    echo.
    echo [提示] 尝试推送到 master 分支...
    git push -u origin master
)

echo.
echo ==========================================
echo    ✅ 推送完成！
echo ==========================================
echo.
echo 下一步操作：
echo 1. 访问 GitHub 仓库查看代码
echo 2. 在 Settings -^> Secrets 中配置环境变量
echo 3. 在 Actions 中查看部署状态
echo.
pause
