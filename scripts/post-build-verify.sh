#!/bin/bash
#
# post-build-verify.sh — 构建后自动验收脚本
# 在 npm run build 之后执行，验证构建产物完整性和质量
# 直接从 .next/server/app/ 下的生成HTML中检查，不启动服务
#
# 用法: bash scripts/post-build-verify.sh
# 返回值: 0=全部通过, 1=有检查项失败
#

set -o pipefail

PROJECT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
BUILD_DIR="$PROJECT_DIR/.next/server/app"
REPORT_DIR="$PROJECT_DIR/data/daily-reports"

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

PASS=0
FAIL=0
WARN=0

check() {
    local name="$1"
    local result="$2"
    if [ "$result" = "pass" ]; then
        echo -e "  ${GREEN}✓${NC} $name"
        PASS=$((PASS + 1))
    elif [ "$result" = "warn" ]; then
        echo -e "  ${YELLOW}⚠${NC} $name"
        WARN=$((WARN + 1))
    else
        echo -e "  ${RED}✗${NC} $name — $3"
        FAIL=$((FAIL + 1))
    fi
}

echo ""
echo "═══════════════════════════════════════"
echo "  构建后自动验收"
echo "═══════════════════════════════════════"
echo ""

# ── 1. 构建产物存在性 ──
echo "  [1/6] 构建产物完整性"
echo "  ─────────────────────────"

# 1a. 首页存在
HOMEPAGE_HTML=""
if [ -f "$BUILD_DIR/page.html" ]; then
    HOMEPAGE_HTML="$BUILD_DIR/page.html"
    check "首页 (page.html) 存在" "pass"
elif [ -f "$BUILD_DIR/index.html" ]; then
    HOMEPAGE_HTML="$BUILD_DIR/index.html"
    check "首页 (index.html) 存在" "pass"
else
    check "首页 存在" "fail" "page.html 或 index.html 均缺失"
fi

# 1b. 日报列表页存在
if [ -f "$BUILD_DIR/daily.html" ]; then
    check "日报列表页 存在" "pass"
else
    check "日报列表页 存在" "fail" ".next/server/app/daily.html 缺失"
fi

# 1c. 最新日报详情页存在
LATEST_REPORT=$(ls -t "$BUILD_DIR/daily/"*.html 2>/dev/null | head -1)
if [ -n "$LATEST_REPORT" ]; then
    LATEST_DATE=$(basename "$LATEST_REPORT" .html)
    check "日报详情页 ($LATEST_DATE) 存在" "pass"
else
    check "日报详情页" "fail" ".next/server/app/daily/ 下无 HTML 文件"
fi

# 1d. 核心页面 — tools/scenes/skills
for page in tools scenes skills; do
    if [ -f "$BUILD_DIR/$page.html" ]; then
        check "$page 页面 存在" "pass"
    else
        check "$page 页面 存在" "warn" ".next/server/app/$page.html 缺失"
    fi
done

echo ""

# ── 2. 首页关键内容 ──
echo "  [2/6] 首页内容检查"
echo "  ─────────────────────────"

if [ -n "$HOMEPAGE_HTML" ] && [ -f "$HOMEPAGE_HTML" ]; then

    # 2a. 页面标题
    if grep -q '<title>AI导航站' "$HOMEPAGE_HTML" 2>/dev/null; then
        check "首页标题" "pass"
    else
        check "首页标题" "fail" "未找到 <title>AI导航站"
    fi

    # 2b. 结构化数据 — WebSite JSON-LD
    if grep -q 'application/ld+json' "$HOMEPAGE_HTML" 2>/dev/null; then
        if grep -q '"@type":"WebSite"' "$HOMEPAGE_HTML" 2>/dev/null; then
            check "结构化数据 (WebSite)" "pass"
        else
            check "结构化数据 (WebSite)" "warn" "未找到 WebSite JSON-LD"
        fi
    else
        check "结构化数据" "warn" "无 application/ld+json"
    fi

    # 2c. OG 标签
    if grep -q 'og:title' "$HOMEPAGE_HTML" 2>/dev/null; then
        check "OG 标签" "pass"
    else
        check "OG 标签" "fail" "无 og:title"
    fi

    # 2d. 页面渲染出内容（非空白）
    HTML_SIZE=$(wc -c < "$HOMEPAGE_HTML")
    if [ "$HTML_SIZE" -gt 5000 ]; then
        check "首页 HTML 大小 ($((HTML_SIZE/1024))KB)" "pass"
    else
        check "首页 HTML 大小" "fail" "仅 ${HTML_SIZE} 字节，可能渲染失败"
    fi
fi

echo ""

# ── 3. 最新日报内容校验 ──
echo "  [3/6] 最新日报内容检查"
echo "  ─────────────────────────"

if [ -n "$LATEST_REPORT" ]; then
    DAILY_HTML="$LATEST_REPORT"

    # 3a. 标题匹配
    DAILY_TITLE=$(grep -oP '(?<=<title>)[^<]+' "$DAILY_HTML" 2>/dev/null | head -1)
    if echo "$DAILY_TITLE" | grep -q "AI 日报"; then
        check "日报标题: $DAILY_TITLE" "pass"
    else
        check "日报标题" "fail" "未包含 'AI 日报'"
    fi

    # 3b. NewsArticle JSON-LD
    if grep -q '"@type":"NewsArticle"' "$DAILY_HTML" 2>/dev/null; then
        check "日报结构化数据 (NewsArticle)" "pass"
    else
        check "日报结构化数据 (NewsArticle)" "fail" "无 NewsArticle JSON-LD"
    fi

    # 3c. 有"今日看点"区域
    if grep -q '今日看点' "$DAILY_HTML" 2>/dev/null; then
        check "日报亮点区 (今日看点)" "pass"
    else
        check "日报亮点区 (今日看点)" "warn" "无 '今日看点' 区域"
    fi

    # 3d. 至少有一个section渲染出来了
    if grep -q 'id=\"section-' "$DAILY_HTML" 2>/dev/null; then
        SECTION_COUNT=$(grep -c 'id=\"section-' "$DAILY_HTML" 2>/dev/null)
        check "日报 Section 数: $SECTION_COUNT" "pass"
    else
        check "日报 Section" "fail" "无任何 id=\"section-\" 元素，所有section为空"
    fi

    # 3e. 有前/后日导航
    if grep -q '前一日' "$DAILY_HTML" 2>/dev/null || grep -q '后一日' "$DAILY_HTML" 2>/dev/null; then
        check "日报前后导航" "pass"
    else
        check "日报前后导航" "warn" "无前/后日导航链接"
    fi

    # 3f. 数据来源信息
    if grep -q '数据来源' "$DAILY_HTML" 2>/dev/null; then
        check "日报数据来源信息" "pass"
    else
        check "日报数据来源信息" "warn" "无数据来源信息"
    fi
fi

echo ""

# ── 4. JSON源文件完整性 ──
echo "  [4/6] JSON 数据文件检查"
echo "  ─────────────────────────"

if [ -d "$REPORT_DIR" ]; then
    # 4a. index.ts 存在且有效
    if [ -f "$REPORT_DIR/index.ts" ]; then
        INDEX_SIZE=$(wc -c < "$REPORT_DIR/index.ts")
        if [ "$INDEX_SIZE" -gt 100 ]; then
            check "日报索引 index.ts" "pass"
        fi
    fi

    # 4b. 最新日报JSON存在且格式有效
    TODAY=$(date +%Y-%m-%d)
    LATEST_JSON=$(ls -t "$REPORT_DIR/"*.json 2>/dev/null | head -1)
    if [ -n "$LATEST_JSON" ]; then
        JSON_NAME=$(basename "$LATEST_JSON")
        if python3 -c "import json; json.load(open('$LATEST_JSON'))" 2>/dev/null; then
            check "$JSON_NAME JSON格式" "pass"
        else
            check "$JSON_NAME JSON格式" "fail" "JSON 解析失败"
        fi

        # 4c. JSON必须有 highlights
        HIGHLIGHT_COUNT=$(python3 -c "import json; d=json.load(open('$LATEST_JSON')); print(len(d.get('highlights',[])))" 2>/dev/null)
        if [ "$HIGHLIGHT_COUNT" -ge 5 ]; then
            check "highlights $HIGHLIGHT_COUNT 条" "pass"
        elif [ "$HIGHLIGHT_COUNT" -gt 0 ]; then
            check "highlights $HIGHLIGHT_COUNT 条" "warn" "建议至少5条"
        else
            check "highlights" "fail" "无 highlights"
        fi
    fi
fi

echo ""

# ── 5. 每日速览（DailyBrief）在首页的渲染状态 ──
echo "  [5/6] 每日速览显示检查"
echo "  ─────────────────────────"
echo "  （注：每日速览为客户端懒加载组件，不在SSG静态HTML中）"
echo ""

# 检查DailyBrief组件代码是否存在且导入了正确类型
DAILY_BRIEF_PATH="$PROJECT_DIR/components/DailyBrief.tsx"
if [ -f "$DAILY_BRIEF_PATH" ]; then
    DB_SIZE=$(wc -c < "$DAILY_BRIEF_PATH")
    if [ "$DB_SIZE" -gt 500 ]; then
        check "DailyBrief 组件存在 ($((DB_SIZE/1024))KB)" "pass"
    fi
    
    # 检查DailyBrief是否使用了有效的section引用
    if grep -q 'sectionConfig\[item.section\]' "$DAILY_BRIEF_PATH" 2>/dev/null; then
        check "DailyBrief 使用新版 section 引用" "pass"
    elif grep -q 'levelStyles\[item.level\]' "$DAILY_BRIEF_PATH" 2>/dev/null; then
        check "DailyBrief 使用旧版 level 引用" "warn" "可能未更新到新版 sections 格式"
    fi
fi

echo ""

# ── 6. 404/错误页面 ──
echo "  [6/6] 错误页面"
echo "  ─────────────────────────"

if [ -f "$BUILD_DIR/_not-found.html" ]; then
    NF_SIZE=$(wc -c < "$BUILD_DIR/_not-found.html")
    if [ "$NF_SIZE" -gt 500 ]; then
        check "404 页面存在 ($((NF_SIZE/1024))KB)" "pass"
    fi
fi

# check if build output has any error logs
BUILD_LOG="$PROJECT_DIR/.next/build-manifest.json"
if [ -f "$BUILD_LOG" ]; then
    check "构建清单存在" "pass"
fi

echo ""
echo "═══════════════════════════════════════"
echo -e "  结果: ${GREEN}${PASS} 通过${NC}  ${YELLOW}${WARN} 警告${NC}  ${RED}${FAIL} 失败${NC}"
echo "═══════════════════════════════════════"
echo ""

exit $FAIL
