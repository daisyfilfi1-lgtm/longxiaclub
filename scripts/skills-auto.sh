#!/bin/bash
# ============================================================
# AI导航站 - Skills自动化工具 (Linux/macOS)
# ============================================================
# 功能：自动生成、更新Skills内容
# 
# 使用方式：
#   ./skills-auto.sh generate   # 仅生成Skills
#   ./skills-auto.sh collect    # 仅采集内容
#   ./skills-auto.sh update     # 完整更新（采集+生成）
#   ./skills-auto.sh cron       # 定时任务模式（无输出）
#
# 定时任务设置：
#   crontab -e
#   # 每天凌晨2点执行完整更新
#   0 2 * * * /path/to/skills-auto.sh cron >> /var/log/skills-auto.log 2>&1
#
# ============================================================

# 配置区（硬编码所有配置）
DEEPSEEK_API_KEY="sk-df68886ea4624f2eaa49a5519de5e501"
DEEPSEEK_BASE_URL="https://api.deepseek.com"
SITE_URL="https://longxiaclub.com"
LOG_FILE="/var/log/skills-auto.log"

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 日志函数
log() {
    echo -e "${GREEN}[$(date '+%Y-%m-%d %H:%M:%S')]${NC} $1"
    if [ -n "$LOG_FILE" ]; then
        echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" >> "$LOG_FILE" 2>/dev/null
    fi
}

error() {
    echo -e "${RED}[ERROR]${NC} $1"
    exit 1
}

warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

# 检查依赖
check_deps() {
    command -v python3 >/dev/null 2>&1 || error "需要Python3，请先安装"
}

# 主函数
main() {
    MODE=${1:-update}
    SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
    cd "$SCRIPT_DIR"
    
    # 导出环境变量
    export DEEPSEEK_API_KEY
    export DEEPSEEK_BASE_URL
    export SITE_URL
    
    log "🚀 AI导航站 Skills自动化工具启动"
    log "📋 模式: $MODE"
    log "📁 工作目录: $SCRIPT_DIR"
    
    # 检查Python
    check_deps
    
    # 运行Python脚本
    case $MODE in
        generate)
            log "📦 生成Skills..."
            python3 skills-auto.py --mode generate
            ;;
        collect)
            log "📥 采集内容..."
            python3 skills-auto.py --mode collect
            ;;
        update)
            log "🔄 完整更新..."
            python3 skills-auto.py --mode update
            ;;
        cron)
            # 静默模式
            python3 skills-auto.py --mode update > /dev/null 2>&1
            ;;
        *)
            error "未知模式: $MODE"
            ;;
    esac
    
    if [ $? -eq 0 ]; then
        log "✅ 执行完成!"
    else
        error "执行失败"
    fi
}

# 定时任务安装函数
install_cron() {
    echo "📅 安装定时任务..."
    
    CRON_JOB="0 2 * * * cd $(pwd) && ./skills-auto.sh cron >> /var/log/skills-auto.log 2>&1"
    
    # 检查是否已存在
    if crontab -l 2>/dev/null | grep -q "skills-auto.sh"; then
        echo "⚠️ 定时任务已存在，跳过"
    else
        (crontab -l 2>/dev/null; echo "$CRON_JOB") | crontab -
        echo "✅ 定时任务已添加 (每天凌晨2点执行)"
    fi
    
    echo ""
    echo "📋 当前定时任务:"
    crontab -l 2>/dev/null | grep "skills-auto.sh" || echo "  (无)"
}

# 显示帮助
show_help() {
    echo """
╔═══════════════════════════════════════════════════════╗
║          AI导航站 - Skills自动化工具 v1.0            ║
╚═══════════════════════════════════════════════════════╝

使用方式:
  ./skills-auto.sh generate   生成Skills
  ./skills-auto.sh collect    采集内容
  ./skills-auto.sh update     完整更新
  ./skills-auto.sh cron       静默模式(用于定时任务)
  ./skills-auto.sh install     安装定时任务
  ./skills-auto.sh help       显示帮助

定时任务示例:
  crontab -e
  # 每天凌晨2点执行
  0 2 * * * /path/to/skills-auto.sh cron

配置:
  API密钥已硬编码在脚本中
  如需修改，编辑脚本顶部的配置区
"""
}

# 根据参数执行
case ${1:-help} in
    help|-h|--help)
        show_help
        ;;
    install)
        install_cron
        ;;
    *)
        main "$@"
        ;;
esac
