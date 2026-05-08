#!/usr/bin/env python3
"""
Ops State Manager — 项目管理状态文件的读写工具

用法:
  python3 ops_state.py <project_dir> read          # 读取当前状态 (输出JSON)
  python3 ops_state.py <project_dir> write <field>=<value> ...  # 更新字段
  python3 ops_state.py <project_dir> backlog add <id> <priority> <desc>  # 添加backlog项
  python3 ops_state.py <project_dir> backlog done <id>  # 标记backlog完成

示例:
  python3 ops_state.py /mnt/f/共享/AI导航/ai-nav read
  python3 ops_state.py /mnt/f/共享/AI导航/ai-nav write last_run.status=ok last_run.date=2026-05-07
  python3 ops_state.py /mnt/f/共享/AI导航/ai-nav backlog add content_fresh "high" "更新首页推荐工具列表"
"""

import json, sys, os, datetime
from pathlib import Path

STATE_FILE = ".ops-state.json"

def load(project_dir):
    path = Path(project_dir) / STATE_FILE
    if not path.exists():
        print(f"[ERROR] 状态文件不存在: {path}", file=sys.stderr)
        sys.exit(1)
    return json.loads(path.read_text())

def save(project_dir, state):
    path = Path(project_dir) / STATE_FILE
    path.write_text(json.dumps(state, indent=2, ensure_ascii=False) + "\n")

def cmd_read(project_dir):
    state = load(project_dir)
    print(json.dumps(state, indent=2, ensure_ascii=False))

def cmd_write(project_dir, updates):
    state = load(project_dir)
    for pair in updates:
        if "=" not in pair:
            print(f"[ERROR] 无效的更新格式: {pair} (需要 key=value)", file=sys.stderr)
            continue
        key, value = pair.split("=", 1)
        # 支持点号路径: last_run.status=ok
        parts = key.split(".")
        obj = state
        for p in parts[:-1]:
            if p not in obj:
                obj[p] = {}
            obj = obj[p]
        # 智能类型转换
        if value.lower() in ("true", "false"):
            value = value.lower() == "true"
        elif value == "null":
            value = None
        elif value.isdigit():
            value = int(value)
        try:
            value = float(value)
        except:
            pass
        obj[parts[-1]] = value
    # 自动更新 last_run.date 到今日
    if any("last_run" in k for k in updates):
        today = datetime.date.today().isoformat()
        state.setdefault("last_run", {})["date"] = today
    save(project_dir, state)
    print(f"[OK] 状态已更新")

def cmd_backlog(project_dir, action, args):
    state = load(project_dir)
    if "backlog" not in state:
        state["backlog"] = []
    
    if action == "add":
        if len(args) < 3:
            print("[ERROR] backlog add 需要: <id> <priority> <desc>", file=sys.stderr)
            sys.exit(1)
        item = {
            "id": args[0],
            "priority": args[1],
            "desc": " ".join(args[2:]),
            "created": datetime.date.today().isoformat()
        }
        # 去重
        state["backlog"] = [i for i in state["backlog"] if i.get("id") != item["id"]]
        state["backlog"].append(item)
        print(f"[OK] backlog 已添加: {item['id']}")
    elif action == "done":
        if len(args) < 1:
            print("[ERROR] backlog done 需要: <id>", file=sys.stderr)
            sys.exit(1)
        state["backlog"] = [i for i in state["backlog"] if i.get("id") != args[0]]
        print(f"[OK] backlog 已完成: {args[0]}")
    else:
        print(f"[ERROR] 未知的 backlog 操作: {action}", file=sys.stderr)
        sys.exit(1)
    
    save(project_dir, state)

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print(__doc__)
        sys.exit(1)
    
    project_dir = sys.argv[1]
    command = sys.argv[2]
    args = sys.argv[3:]
    
    commands = {
        "read": cmd_read,
        "write": cmd_write,
        "backlog": cmd_backlog,
    }
    
    if command not in commands:
        print(f"[ERROR] 未知命令: {command}", file=sys.stderr)
        print(f"可用命令: {', '.join(commands.keys())}", file=sys.stderr)
        sys.exit(1)
    
    if command == "read":
        commands[command](project_dir)
    elif command == "write":
        commands[command](project_dir, args)
    elif command == "backlog":
        if not args:
            print("[ERROR] backlog 需要子命令: add 或 done", file=sys.stderr)
            sys.exit(1)
        commands[command](project_dir, args[0], args[1:])
