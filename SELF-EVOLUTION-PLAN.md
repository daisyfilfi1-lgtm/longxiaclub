# longxiaclub.com 自我进化计划

## 进化框架来源

基于四大开源项目的核心设计模式：

### 1. hermes-agent-self-evolution (NousResearch)
核心：GEPA 演化循环（Generate, Evaluate, Pool, Adapt）
- 自动生成Skill → 评分 → 保留Top-K → 变异/交叉
- 约束门控：硬约束（阻塞型）+软约束（评分型）
- DSPy 优化器：系统自动调优Prompt
- Eval数据集：自动化质量评判标准

### 2. gbrain (garrytan)
核心：知识图谱自组织
- 自动链接提取：WikiLinks → 实体关系发现
- Hybrid Search：关键词+向量RRF融合
- Backlink Boost：被引用越多，权重越高
- 自动时间线：Markdown中提取事件时间轴

### 3. agentic-stack
核心：跨Harness可移植
- Hermes/Cline/Goose/Copilot 统一Skill格式
- Skill = Prompt + 工具清单 + 约束条件
- 声明式配置，工具无关

### 4. awesome-hermes-agent (0xNyk)
核心：生态分类体系
- 233+ 项目按领域分层分类
- 过滤策略：Active维护/Star数/文档完整度

---

## 导航站应用：5层进化管道

### Layer 1: 内容自动进化（立即可以做）
📍 基于 cron + Supabase

当前：22 tools, 50 skills — 手动维护
进化后：
- cron 每日自动收集AI资讯 → 提取新工具/新技能
- 自动检查 GitHub Trending → 发现新AI工具
- 自动更新 tools/skills 数据库

### Layer 2: 推荐引擎自进化（立即可以做）
📍 基于 gbrain Hybrid Search + Backlink Boost

当前：Leaderboard 按 heat 排序
进化后：
- 用户点击行为 → 自动增加 heat 分值
- 场景关联 → "浏览了ChatGPT还想看"
- 多维度排序：热度/时间/场景相关性

### Layer 3: 知识图谱自组织（1-2周内）
📍 基于 gbrain 链接提取

当前：标签独立，无关联关系
进化后：
- 工具-场景-技能 自动关联
- 相似工具聚类（如：视频生成类自动组）
- 热门组合推荐（ChatGPT+Claude 互补使用）

### Layer 4: 跨平台Skill复用（1-2周内）
📍 基于 agentic-stack

当前：Skill只存在于本站
进化后：
- 站内 Skill → Hermes/Goose 可用格式
- "Import to Hermes" 一键导出
- 用户可下载Skill在本地AI环境使用

### Layer 5: AI日报 → 自进化循环（持续）
📍 GEPA 演化循环

当前：cron 推送日报
进化后：
- 日报中包含 "新工具建议"
- 用户确认后自动加入数据库
- 每周分析：哪些内容访问高 → 强化同类
- 每月总结：进化报告

---

## 立即落地（本次Session）

### Step 1: 扩充推荐引擎
在 Leaderboard 组件中新增维度：
- "热度" (heat) ✓ 已有
- "新增" (new) — 按创建日期排序
- "趋势" (trending) — 近期heat增长最快

### Step 2: 强化排行榜API
```typescript
/api/leaderboard?type=tools&sort=trending&limit=10
```

### Step 3: 工具详情页增强
- 关联推荐：查看该工具的用户还看了
- 场景关联：该工具适合的场景

### Step 4: 每日进化和发现
- 导航站新增 "开发日志" 或 "更新日志" 页面
- 展示每次进化的内容（新增工具、优化功能）
- 透明化进化过程，吸引社区参与

---

## 进化指标

| 指标 | 当前 | 目标 | 衡量方式 |
|------|------|------|----------|
| 工具数量 | 22 | 100+ | Supabase tools 表 |
| 技能数量 | 50 | 200+ | Supabase skills 表 |
| 场景数量 | 4 | 10+ | scenes 数组 |
| 用户点击率 | N/A | >30% | 埋点统计 |
| 内容更新频率 | 手动的 | 每日自动化 | Supabase 日志 |
