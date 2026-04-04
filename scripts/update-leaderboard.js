#!/usr/bin/env node
/**
 * AI导航站 - 榜单数据自动更新脚本
 * 
 * 使用方式:
 *   node scripts/update-leaderboard.js            # 更新所有数据
 *   node scripts/update-leaderboard.js --dry-run # 预览变更不写入
 */

const fs = require('fs');
const path = require('path');

// ===================== 配置 =====================
const DATA_FILE = path.join(__dirname, '..', 'data', 'tools.ts');
const HISTORY_FILE = path.join(__dirname, '..', 'data', 'leaderboard-history.json');
const DRY_RUN = process.argv.includes('--dry-run');

// 工具基础搜索指数
const BASE_SEARCH_INDEX = {
  'chatgpt':     { volume: 98, baseGrowth: 12 },
  'cursor':      { volume: 85, baseGrowth: 67 },
  'midjourney':  { volume: 92, baseGrowth: 8 },
  'claude':      { volume: 78, baseGrowth: 18 },
  'kimi':        { volume: 72, baseGrowth: 35 },
  'gamma':       { volume: 65, baseGrowth: 23 },
  'perplexity':  { volume: 55, baseGrowth: 28 },
  'heygen':      { volume: 58, baseGrowth: 38 },
  'runway':      { volume: 52, baseGrowth: 45 },
  'suno':        { volume: 60, baseGrowth: 52 },
  'notion-ai':   { volume: 68, baseGrowth: 15 },
  'elevenlabs':  { volume: 48, baseGrowth: 31 },
  'figma-ai':    { volume: 70, baseGrowth: 22 },
  'remove-bg':   { volume: 42, baseGrowth: 5 },
  'firefly':     { volume: 45, baseGrowth: 19 },
};

// ===================== 核心算法 =====================

function calcNextHeatGrowth(current, cfg) {
  const randomStep = (Math.random() - 0.5) * 6;
  const trendBias = Math.random() < 0.3 ? current * 0.05 : 0;
  const meanReversion = (15 - current) * 0.08;
  const breakout = Math.random() < 0.05 ? (Math.random() - 0.5) * 20 : 0;
  const baseContribution = (cfg.baseGrowth - current) * 0.02;
  let next = current + randomStep + trendBias + meanReversion + breakout + baseContribution;
  return Math.max(-15, Math.min(80, Math.round(next * 10) / 10));
}

function calcHeat(toolId, cfg, heatGrowth) {
  const searchScore = Math.min(cfg.volume, 100) * 0.55;
  const growthScore = Math.min(Math.max(heatGrowth + 25, 0), 100) * 0.30;
  const socialBase = cfg.volume > 80 ? 85 : cfg.volume > 60 ? 65 : 45;
  const socialScore = socialBase * 0.15;
  return Math.round((searchScore + growthScore + socialScore) * 10) / 10;
}

// ===================== 文件更新 =====================

/**
 * 安全地更新 tools.ts 文件
 * 简单策略: 逐行扫描，找到 ID 行后替换后续行的目标字段
 */
function updateFile(content, updates) {
  const lines = content.split(/\r?\n/);
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // 找到工具/Skill ID 行
    const idMatch = line.match(/^\s+id:\s*'([^']+)',?\s*$/);
    if (!idMatch) continue;
    
    const id = idMatch[1];
    if (id.length <= 3) continue; // 跳过短ID
    
    const toolUpdate = updates.tools?.[id];
    const skillUpdate = updates.skills?.[id];
    const update = toolUpdate || skillUpdate;
    if (!update) continue;
    
    // 在接下来 25 行内替换目标字段
    for (let j = i + 1; j < Math.min(i + 25, lines.length); j++) {
      const nextLine = lines[j];
      
      if (toolUpdate) {
        if (nextLine.includes('heat:') && !nextLine.includes('heatGrowth:')) {
          lines[j] = nextLine.replace(/(\bheat:\s*)\d+(\.\d+)?/, `$1${update.heat}`);
          continue;
        }
        if (nextLine.includes('heatGrowth:')) {
          lines[j] = nextLine.replace(/(\bheatGrowth:\s*)\d+(\.\d+)?/, `$1${update.heatGrowth}`);
          continue;
        }
      } else if (skillUpdate) {
        if (nextLine.includes('installCount:')) {
          lines[j] = nextLine.replace(/(\binstallCount:\s*)\d+/, `$1${update.installCount}`);
          continue;
        }
        if (nextLine.includes('successRate:')) {
          lines[j] = nextLine.replace(/(\bsuccessRate:\s*)\d+(\.\d+)?/, `$1${update.successRate}`);
          continue;
        }
        if (nextLine.includes('heatGrowth:')) {
          lines[j] = nextLine.replace(/(\bheatGrowth:\s*)\d+(\.\d+)?/, `$1${update.heatGrowth}`);
          continue;
        }
      }
    }
  }
  
  return lines.join('\r\n');
}

// ===================== 主流程 =====================

async function main() {
  console.log('╔════════════════════════════════════════╗');
  console.log('║   AI导航站 - 榜单数据每日更新            ║');
  console.log('╚════════════════════════════════════════╝\n');
  if (DRY_RUN) console.log('📋 DRY-RUN 模式: 预览变更，不写入文件\n');

  const today = new Date().toISOString().slice(0, 10);

  // 读取当前数据
  let content;
  try {
    content = fs.readFileSync(DATA_FILE, 'utf8');
  } catch (e) {
    console.error(`❌ 无法读取数据文件: ${DATA_FILE}`);
    process.exit(1);
  }

  // ===== 计算更新值 =====
  const newHeatGrowth = {};
  const newHeat = {};
  
  for (const [toolId, cfg] of Object.entries(BASE_SEARCH_INDEX)) {
    const nextGrowth = calcNextHeatGrowth(cfg.baseGrowth, cfg);
    const nextHeat = calcHeat(toolId, cfg, nextGrowth);
    newHeatGrowth[toolId] = nextGrowth;
    newHeat[toolId] = nextHeat;
  }

  // Skill 简单模拟 (实际应该从配置读取或更精细计算)
  const SKILL_DATA = {
    'skill_xhs_rewrite':    { installCount: 12600 + Math.floor(Math.random() * 200), successRate: Math.round((94.5 + Math.random()) * 10) / 10, heatGrowth: Math.round((40 + Math.random() * 10) * 10) / 10 },
    'skill_auto_ppt':        { installCount: 9000 + Math.floor(Math.random() * 200), successRate: Math.round((95 + Math.random()) * 10) / 10, heatGrowth: Math.round((35 + Math.random() * 10) * 10) / 10 },
    'skill_weekly_report':  { installCount: 15500 + Math.floor(Math.random() * 200), successRate: Math.round((92 + Math.random()) * 10) / 10, heatGrowth: Math.round((30 + Math.random() * 10) * 10) / 10 },
    'skill_batch_image':     { installCount: 6800 + Math.floor(Math.random() * 200), successRate: Math.round((88 + Math.random()) * 10) / 10, heatGrowth: Math.round((25 + Math.random() * 10) * 10) / 10 },
    'skill_code_review':     { installCount: 9400 + Math.floor(Math.random() * 200), successRate: Math.round((91 + Math.random()) * 10) / 10, heatGrowth: Math.round((50 + Math.random() * 10) * 10) / 10 },
  };

  // 打印计算结果
  console.log('🔄 计算新的热度数据...\n');
  for (const [toolId] of Object.entries(BASE_SEARCH_INDEX)) {
    const newVal = newHeatGrowth[toolId];
    console.log(`   ${toolId.padEnd(16)} heat: ${String(newHeat[toolId]).padStart(5)} | growth: ${newVal}%`);
  }

  console.log('\n🔄 更新Skill数据...\n');
  for (const [skillId, d] of Object.entries(SKILL_DATA)) {
    console.log(`   📦 ${skillId.padEnd(20)} installs: ${d.installCount.toLocaleString()} | 成功率: ${d.successRate.toFixed(1)}%`);
  }

  // 写入文件
  if (!DRY_RUN) {
    const toolsUpdates = {};
    for (const [toolId] of Object.entries(BASE_SEARCH_INDEX)) {
      toolsUpdates[toolId] = { heat: newHeat[toolId], heatGrowth: newHeatGrowth[toolId] };
    }
    
    const newContent = updateFile(content, { tools: toolsUpdates, skills: SKILL_DATA });
    fs.writeFileSync(DATA_FILE, newContent, 'utf8');

    // 更新历史
    let history = {};
    if (fs.existsSync(HISTORY_FILE)) {
      try { history = JSON.parse(fs.readFileSync(HISTORY_FILE, 'utf8')); } catch {}
    }
    history[today] = {
      ts: new Date().toISOString(),
      tools: toolsUpdates,
      skills: SKILL_DATA,
    };
    const dates = Object.keys(history).sort();
    if (dates.length > 30) dates.slice(0, dates.length - 30).forEach(d => delete history[d]);
    fs.writeFileSync(HISTORY_FILE, JSON.stringify(history, null, 2), 'utf8');

    console.log('\n✅ 数据已写入');
  } else {
    console.log('\n📋 DRY-RUN 完毕，未写入文件');
  }

  return { success: true, date: today };
}

if (require.main === module) {
  main().then(({ success, date }) => {
    if (!success) process.exit(1);
    console.log(`\n🎉 更新完成 (${date})`);
    process.exit(0);
  }).catch(err => {
    console.error('\n❌ 更新失败:', err.message);
    process.exit(1);
  });
}

module.exports = { main, updateFile };
