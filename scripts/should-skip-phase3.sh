#!/bin/bash
#
# should-skip-phase3.sh
# 判断阶段3（导航站优化）是否可以跳过
# 用法: bash scripts/should-skip-phase3.sh
# 输出: "skip" (退出码 0) 或 "run" (退出码 1)
#

set -e

PROJECT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
CHECK_FILE="$PROJECT_DIR/.last-phase3-check"

# 1. 如果检查文件不存在 → 需要跑
if [ ! -f "$CHECK_FILE" ]; then
    echo "run"
    exit 1
fi

# 读取上次检查的时间戳（mtime 秒数）
CHECK_MTIME=$(stat -c %Y "$CHECK_FILE" 2>/dev/null)

if [ -z "$CHECK_MTIME" ]; then
    echo "run"
    exit 1
fi

# 2. 定义需要监控的文件列表（仅检查存在的文件）
FILES_TO_CHECK=(
    "$PROJECT_DIR/data/tools.ts"
    "$PROJECT_DIR/types/index.ts"
)

# 如果 scenes.ts 存在则加入
if [ -f "$PROJECT_DIR/data/scenes.ts" ]; then
    FILES_TO_CHECK+=("$PROJECT_DIR/data/scenes.ts")
fi

# 添加 app/ 下的所有 page.tsx 文件
while IFS= read -r -d '' PAGE_FILE; do
    FILES_TO_CHECK+=("$PAGE_FILE")
done < <(find "$PROJECT_DIR/app" -name "page.tsx" -type f -print0 2>/dev/null)

# 3. 检查每个文件的修改时间
for FILE in "${FILES_TO_CHECK[@]}"; do
    if [ ! -f "$FILE" ]; then
        continue
    fi
    FILE_MTIME=$(stat -c %Y "$FILE" 2>/dev/null)
    if [ -z "$FILE_MTIME" ]; then
        continue
    fi
    # 如果有任何文件比检查文件更新 → 需要跑
    if [ "$FILE_MTIME" -gt "$CHECK_MTIME" ]; then
        echo "run"
        exit 1
    fi
done

# 4. 所有文件都没有变更 → 跳过
echo "skip"
exit 0
