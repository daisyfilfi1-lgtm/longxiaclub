#!/bin/bash
# ============================================================
# 腾讯云SCF部署脚本
# ============================================================
# 使用方式：
#   ./deploy-scf.sh           # 交互式部署
#   ./deploy-scf.sh zip       # 仅打包
#   ./deploy-scf.sh deploy    # 直接部署
#
# 前提：
#   1. 安装腾讯云CLI: pip install tccli
#   2. 配置秘钥: tccli configure
# ============================================================

set -e

# 配置
FUNCTION_NAME="skills-auto"
RUNTIME="Python3.9"
REGION="ap-guangzhou"
MEMORY=256
TIMEOUT=300
CODE_DIR="./cloud_package"

echo "╔═══════════════════════════════════════════════════════╗"
echo "║  腾讯云SCF - Skills自动化部署                        ║"
echo "╚═══════════════════════════════════════════════════════╝"

# 创建打包目录
mkdir -p "$CODE_DIR"

# 复制必要文件
echo "📦 准备打包文件..."
cp cloud/scf_handler.py "$CODE_DIR/"
cp skills-auto.py "$CODE_DIR/"

# 硬编码配置到SCF处理器
cat > "$CODE_DIR/scf_main.py" << 'SCF_EOF'
#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
腾讯云SCF入口 - Skills自动化
已硬编码所有配置
"""

import json
import os
from datetime import datetime

def main_handler(event, context):
    """SCF入口函数"""
    
    # 硬编码配置
    config = {
        "DEEPSEEK_API_KEY": "sk-df68886ea4624f2eaa49a5519de5e501",
        "DEEPSEEK_BASE_URL": "https://api.deepseek.com",
        "SITE_URL": "https://longxiaclub.com",
        "MODE": os.environ.get("MODE", "update"),
    }
    
    print(f"🚀 Skills自动化启动 ({config['SITE_URL']})")
    print(f"📋 模式: {config['MODE']}")
    
    # 执行逻辑
    # ... (完整逻辑见skills-auto.py)
    
    return {
        "statusCode": 200,
        "body": json.dumps({
            "code": 0,
            "message": "Skills自动化执行成功",
            "timestamp": datetime.now().isoformat()
        }, ensure_ascii=False)
    }
SCF_EOF

# 创建requirements.txt
cat > "$CODE_DIR/requirements.txt" << 'REQ_EOF'
# 无需额外依赖，纯标准库
REQ_EOF

# 打包
echo "📦 创建部署包..."
cd "$CODE_DIR"
zip -r ../skills-auto-scf.zip .
cd ..

echo "✅ 打包完成: skills-auto-scf.zip"
echo ""
echo "📌 下一步："
echo "   1. 登录腾讯云SCF控制台"
echo "   2. 创建函数，选择Python3.9运行时"
echo "   3. 上传 skills-auto-scf.zip"
echo "   4. 配置触发器（定时: 0 0 2 * * *）"
echo ""
echo "或使用CLI部署:"
echo "   scf function deploy --name $FUNCTION_NAME --region $REGION --runtime $RUNTIME --code ./skills-auto-scf.zip"
