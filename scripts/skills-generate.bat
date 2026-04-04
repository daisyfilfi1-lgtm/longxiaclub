@echo off
chcp 65001 >nul
title AI导航站 - Skills自动化工具

echo.
echo  ╔═══════════════════════════════════════════════════════╗
echo  ║          AI导航站 - Skills自动化工具 v1.0            ║
echo  ╚═══════════════════════════════════════════════════════╝
echo.

REM 检查Python
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ 未找到Python，请先安装Python 3.8+
    echo    下载地址: https://www.python.org/downloads/
    pause
    exit /b 1
)

REM 获取模式参数
set MODE=%1
if "%MODE%"=="" set MODE=update

echo 📋 运行模式: %MODE%
echo.

REM 设置环境变量（硬编码配置）
set DEEPSEEK_API_KEY=sk-df68886ea4624f2eaa49a5519de5e501
set DEEPSEEK_BASE_URL=https://api.deepseek.com
set SITE_URL=https://longxiaclub.com

REM 切换到脚本目录
cd /d "%~dp0"

REM 运行Python脚本
echo 🚀 启动自动化工具...
echo.
python skills-auto.py --mode %MODE%

echo.
if errorlevel 1 (
    echo ❌ 执行失败!
    pause
    exit /b 1
) else (
    echo ✅ 执行完成!
    echo.
    echo 📌 如需查看生成的Skills，请检查 data/generated-skills.json
    pause
)
