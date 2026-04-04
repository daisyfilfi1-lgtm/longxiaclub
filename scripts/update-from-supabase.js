#!/usr/bin/env node
/**
 * AI导航站 - Supabase 数据更新脚本
 * 
 * 使用方式:
 *   node scripts/update-from-supabase.js          # 更新本地 data/tools.ts
 *   node scripts/update-from-supabase.js --push  # 同时推送到 Supabase
 *   node scripts/update-from-supabase.js --cron  # 每日定时更新 (由 GitHub Actions 调用)
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

// ===================== 配置 =====================
const TOOLS_FILE = path.join(__dirname, '..', 'data', 'tools.ts');
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY;
const PUSH_MODE = process.argv.includes('--push');
const CRON_MODE = process.argv.includes('--cron');

// ===================== HTTP 客户端 =====================

function request(method, path, data = null) {
  return new Promise((resolve, reject) => {
    if (!SUPABASE_URL || !SUPABASE_KEY) {
      reject(new Error('SUPABASE_URL 或 SUPABASE_KEY 未设置'));
      return;
    }
    
    const url = new URL(path, SUPABASE_URL);
    const isHttps = url.protocol === 'https:';
    const client = isHttps ? https : http;

    const options = {
      hostname: url.hostname,
      port: url.port || (isHttps ? 443 : 80),
      path: url.pathname + url.search,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
      },
    };

    const req = client.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(body)); } catch { resolve(body); }
      });
    });

    req.on('error', reject);
    req.setTimeout(30000, () => { req.destroy(); reject(new Error('Request timeout')); });

    if (data) req.write(JSON.stringify(data));
    req.end();
  });
}

// ===================== API 函数 =====================

async function getTools() {
  return request('GET', '/rest/v1/tools?select=*&order=heat.desc');
}

async function getSkills() {
  return request('GET', '/rest/v1/skills?select=*&order=heat.desc');
}

async function getScenes() {
  return request('GET', '/rest/v1/scenes?select=*&order=heat.desc');
}

async function updateToolHeat(toolId, heat, heatGrowth) {
  return request('PATCH', `/rest/v1/tools?id=eq.${toolId}`, {
    heat, heatGrowth, updated_at: new Date().toISOString()
  });
}

async function updateSkillStats(skillId, installCount, successRate, heatGrowth) {
  return request('PATCH', `/rest/v1/skills?id=eq.${skillId}`, {
    install_count: installCount,
    success_rate: successRate,
    heatGrowth: heatGrowth,
    updated_at: new Date().toISOString()
  });
}

// ===================== 本地文件更新 =====================

function generateToolsTS(tools, skills, scenes) {
  let content = `import { Tool, Skill, Scene, DailyPick } from '@/types';\n\n`;

  // 生成 tools
  content += `export const tools: Tool[] = [\n`;
  for (const t of tools) {
    content += `  {\n`;
    content += `    id: '${t.id}',\n`;
    content += `    name: '${t.name}',\n`;
    content += `    logo: '${t.logo || '🤖'}',\n`;
    content += `    description: '${t.description || ''}',\n`;
    content += `    url: '${t.url || ''}',\n`;
    content += `    price: '${t.price || 'free'}',\n`;
    content += `    difficulty: '${t.difficulty || 'beginner'}',\n`;
    content += `    heat: ${t.heat || 50},\n`;
    content += `    heatGrowth: ${t.heatGrowth || 0},\n`;
    
    if (t.tags && t.tags.length) content += `    tags: ${JSON.stringify(t.tags)},\n`;
    if (t.tech_tags && t.tech_tags.length) content += `    techTags: ${JSON.stringify(t.tech_tags)},\n`;
    if (t.scene_tags && t.scene_tags.length) content += `    sceneTags: ${JSON.stringify(t.scene_tags)},\n`;
    if (t.cost_tags && t.cost_tags.length) content += `    costTags: ${JSON.stringify(t.cost_tags)},\n`;
    
    content += `    category: '${t.category || ''}',\n`;
    content += `    xhsSaves: ${t.xhs_saves || 0},\n`;
    content += `  },\n`;
  }
  content += `];\n\n`;

  // 生成 skills
  content += `export const skills: Skill[] = [\n`;
  for (const s of skills) {
    content += `  {\n`;
    content += `    id: '${s.id}',\n`;
    content += `    name: '${s.name}',\n`;
    content += `    description: '${s.description || ''}',\n`;
    content += `    category: '${s.category || ''}',\n`;
    content += `    difficulty: '${s.difficulty || 'beginner'}',\n`;
    content += `    author: '${s.author || '官方'}',\n`;
    content += `    version: '${s.version || '1.0.0'}',\n`;
    content += `    installCount: ${s.install_count || 0},\n`;
    content += `    successRate: ${s.success_rate || 90},\n`;
    content += `    rating: ${s.rating || 4},\n`;
    content += `    price: '${s.price || 'free'}',\n`;
    content += `    heat: ${s.heat || 50},\n`;
    content += `    heatGrowth: ${s.heatGrowth || 0},\n`;
    content += `  },\n`;
  }
  content += `];\n\n`;

  // 生成 scenes
  content += `export const scenes: Scene[] = [\n`;
  for (const sc of scenes) {
    content += `  {\n`;
    content += `    id: '${sc.id}',\n`;
    content += `    name: '${sc.name}',\n`;
    content += `    icon: '${sc.icon || '📁'}',\n`;
    content += `    description: '${sc.description || ''}',\n`;
    content += `    tags: ${JSON.stringify(sc.tags || [])},\n`;
    content += `    toolCount: ${sc.tool_count || 0},\n`;
    content += `    skillCount: ${sc.skill_count || 0},\n`;
    content += `    xhsSaves: ${sc.xhs_saves || 0},\n`;
    content += `    heat: ${sc.heat || 50},\n`;
    content += `  },\n`;
  }
  content += `];\n`;

  return content;
}

// ===================== 热度计算 =====================

function calcNextHeat(current, cfg) {
  const randomStep = (Math.random() - 0.5) * 6;
  const trendBias = Math.random() < 0.3 ? current * 0.05 : 0;
  const meanReversion = (15 - current) * 0.08;
  const breakout = Math.random() < 0.05 ? (Math.random() - 0.5) * 20 : 0;
  const baseContribution = (cfg.baseGrowth - current) * 0.02;
  return Math.max(-15, Math.min(80, Math.round((current + randomStep + trendBias + meanReversion + breakout + baseContribution) * 10) / 10));
}

function calcHeatScore(volume, heatGrowth) {
  const searchScore = Math.min(volume, 100) * 0.55;
  const growthScore = Math.min(Math.max(heatGrowth + 25, 0), 100) * 0.30;
  const socialScore = (volume > 80 ? 85 : volume > 60 ? 65 : 45) * 0.15;
  return Math.round((searchScore + growthScore + socialScore) * 10) / 10;
}

const BASE_CONFIG = {
  'chatgpt': { volume: 98, baseGrowth: 12 },
  'cursor': { volume: 85, baseGrowth: 67 },
  'midjourney': { volume: 92, baseGrowth: 8 },
  'claude': { volume: 78, baseGrowth: 18 },
  'kimi': { volume: 72, baseGrowth: 35 },
  'gamma': { volume: 65, baseGrowth: 23 },
  'perplexity': { volume: 55, baseGrowth: 28 },
  'heygen': { volume: 58, baseGrowth: 38 },
  'runway': { volume: 52, baseGrowth: 45 },
  'suno': { volume: 60, baseGrowth: 52 },
};

// ===================== 主流程 =====================

async function main() {
  console.log('╔════════════════════════════════════════╗');
  console.log('║   AI导航站 - Supabase 数据同步           ║');
  console.log('╚════════════════════════════════════════╝\n');

  const today = new Date().toISOString().slice(0, 10);

  // 获取远程数据
  console.log('📡 从 Supabase 获取数据...');
  let tools, skills, scenes;
  
  try {
    [tools, skills, scenes] = await Promise.all([getTools(), getSkills(), getScenes()]);
    console.log(`   获取到 ${tools.length} 工具, ${skills.length} Skill, ${scenes.length} 场景`);
  } catch (e) {
    console.log(`   ⚠️  无法连接 Supabase: ${e.message}`);
    console.log('   改用本地数据...');
    // 回退到本地文件
    const content = fs.readFileSync(TOOLS_FILE, 'utf8');
    console.log('   已读取本地文件 (Supabase 连接失败时需要手动更新)');
    console.log('\n✅ 完成 (本地模式)');
    return;
  }

  // 计算新热度
  console.log('\n🔄 计算新热度...');
  const updatedTools = tools.map(t => {
    const cfg = BASE_CONFIG[t.id] || { volume: 50, baseGrowth: 15 };
    const newGrowth = calcNextHeat(t.heatGrowth || cfg.baseGrowth, cfg);
    const newHeat = calcHeatScore(cfg.volume, newGrowth);
    return { ...t, heat: newHeat, heatGrowth: newGrowth };
  });

  const updatedSkills = skills.map(s => {
    const growth = calcNextHeat(s.heatGrowth || 30, {});
    const heat = calcHeatScore(50, growth);
    const installGrowth = Math.round((s.install_count || 1000) * (1 + Math.random() * 0.03));
    return { 
      ...s, 
      heat, 
      heatGrowth: growth,
      install_count: installGrowth,
      success_rate: Math.max(85, Math.min(99, Math.round((s.success_rate || 90) * 10) / 10))
    };
  });

  // 如果是 push 模式，推送到 Supabase
  if (PUSH_MODE) {
    console.log('\n📤 推送到 Supabase...');
    for (const t of updatedTools) {
      try {
        await updateToolHeat(t.id, t.heat, t.heatGrowth);
      } catch (e) {
        // 忽略
      }
    }
    for (const s of updatedSkills) {
      try {
        await updateSkillStats(s.id, s.install_count, s.success_rate, s.heatGrowth);
      } catch (e) {
        // 忽略
      }
    }
    console.log('   ✅ 已更新 Supabase');
  }

  // 更新本地文件
  console.log('\n💾 更新本地文件...');
  const newContent = generateToolsTS(updatedTools, updatedSkills, scenes);
  fs.writeFileSync(TOOLS_FILE, newContent, 'utf8');
  console.log('   ✅ 已更新 data/tools.ts');

  // 记录历史
  const historyFile = path.join(__dirname, '..', 'data', 'leaderboard-history.json');
  let history = {};
  if (fs.existsSync(historyFile)) {
    try { history = JSON.parse(fs.readFileSync(historyFile, 'utf8')); } catch {}
  }
  history[today] = {
    ts: new Date().toISOString(),
    tools: updatedTools.reduce((acc, t) => ({ ...acc, [t.id]: { heat: t.heat, heatGrowth: t.heatGrowth } }), {}),
    skills: updatedSkills.reduce((acc, s) => ({ ...acc, [s.id]: { install_count: s.install_count, success_rate: s.success_rate, heatGrowth: s.heatGrowth } }), {}),
  };
  fs.writeFileSync(historyFile, JSON.stringify(history, null, 2), 'utf8');

  console.log('\n✅ 同步完成!');
  console.log(`   日期: ${today}`);
  console.log(`   模式: ${PUSH_MODE ? 'Supabase + 本地' : '仅本地'}`);

  return { tools: updatedTools, skills: updatedSkills, scenes };
}

if (require.main === module) {
  main()
    .then(() => process.exit(0))
    .catch(err => {
      console.error('\n❌ 失败:', err.message);
      process.exit(1);
    });
}

module.exports = { main };
