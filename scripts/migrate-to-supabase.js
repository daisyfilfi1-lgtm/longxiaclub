#!/usr/bin/env node
/**
 * AI导航站 - 数据迁移脚本
 * 将 data/tools.ts 的数据导入 Supabase
 * 
 * 使用方式:
 *   node scripts/migrate-to-supabase.js
 * 
 * 环境变量:
 *   SUPABASE_URL - Supabase 项目 URL
 *   SUPABASE_SERVICE_KEY - Service Role Key (用于写入数据)
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

// ===================== 配置 =====================
const TOOLS_FILE = path.join(__dirname, '..', 'data', 'tools.ts');
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://your-project.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY;

// ===================== HTTP 客户端 =====================

function request(method, path, data) {
  return new Promise((resolve, reject) => {
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
        try {
          const json = JSON.parse(body);
          resolve(json);
        } catch {
          resolve(body);
        }
      });
    });

    req.on('error', reject);
    req.setTimeout(30000, () => { req.destroy(); reject(new Error('Request timeout')); });

    if (data) req.write(JSON.stringify(data));
    req.end();
  });
}

// ===================== 数据解析 =====================

function parseToolsTS() {
  const content = fs.readFileSync(TOOLS_FILE, 'utf8');
  const lines = content.split(/\r?\n/);
  
  const tools = [];
  const skills = [];
  const scenes = [];
  
  let currentArray = null;
  let currentItem = {};
  let braceDepth = 0;
  let inString = false;
  let currentKey = '';
  let currentValue = '';
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // 检测当前在哪个数组
    if (line.includes('export const tools:')) currentArray = 'tools';
    else if (line.includes('export const skills:')) currentArray = 'skills';
    else if (line.includes('export const scenes:')) currentArray = 'scenes';
    
    if (!currentArray) continue;
    
    // 简单解析: 找 id: 'xxx' 行
    const idMatch = line.match(/^\s+id:\s*'([^']+)',?\s*$/);
    if (idMatch && (currentArray === 'tools' || currentArray === 'skills')) {
      // 保存前一个
      if (Object.keys(currentItem).length > 0) {
        if (currentArray === 'tools') tools.push(currentItem);
        else if (currentArray === 'skills') skills.push(currentItem);
      }
      currentItem = { id: idMatch[1] };
      continue;
    }
    
    // 场景
    const sceneIdMatch = line.match(/^\s+id:\s*'([^']+)',?\s*$/);
    if (sceneIdMatch && currentArray === 'scenes') {
      if (Object.keys(currentItem).length > 0) scenes.push(currentItem);
      currentItem = { id: sceneIdMatch[1] };
      continue;
    }
    
    // 解析字段 - 简单字符串匹配
    const nameMatch = line.match(/^\s+name:\s*'([^']+)',?\s*$/);
    if (nameMatch) currentItem.name = nameMatch[1];
    
    const logoMatch = line.match(/^\s+logo:\s*'([^']+)',?\s*$/);
    if (logoMatch) currentItem.logo = logoMatch[1];
    
    const descMatch = line.match(/^\s+description:\s*'([^']+)',?\s*$/);
    if (descMatch) currentItem.description = descMatch[1];
    
    const urlMatch = line.match(/^\s+url:\s*'([^']+)',?\s*$/);
    if (urlMatch) currentItem.url = urlMatch[1];
    
    const priceMatch = line.match(/^\s+price:\s*'([^']+)',?\s*$/);
    if (priceMatch) currentItem.price = priceMatch[1];
    
    const difficultyMatch = line.match(/^\s+difficulty:\s*'([^']+)',?\s*$/);
    if (difficultyMatch) currentItem.difficulty = difficultyMatch[1];
    
    const categoryMatch = line.match(/^\s+category:\s*'([^']+)',?\s*$/);
    if (categoryMatch) currentItem.category = categoryMatch[1];
    
    const heatMatch = line.match(/^\s+heat:\s*(\d+(?:\.\d+)?),?\s*$/);
    if (heatMatch) currentItem.heat = parseFloat(heatMatch[1]);
    
    const heatGrowthMatch = line.match(/^\s+heatGrowth:\s*(\d+(?:\.\d+)?),?\s*$/);
    if (heatGrowthMatch) currentItem.heatGrowth = parseFloat(heatGrowthMatch[1]);
    
    const installCountMatch = line.match(/^\s+installCount:\s*(\d+),?\s*$/);
    if (installCountMatch) currentItem.install_count = parseInt(installCountMatch[1]);
    
    const successRateMatch = line.match(/^\s+successRate:\s*(\d+(?:\.\d+)?),?\s*$/);
    if (successRateMatch) currentItem.success_rate = parseFloat(successRateMatch[1]);
    
    const ratingMatch = line.match(/^\s+rating:\s*(\d+(?:\.\d+)?),?\s*$/);
    if (ratingMatch) currentItem.rating = parseFloat(ratingMatch[1]);
    
    const authorMatch = line.match(/^\s+author:\s*'([^']+)',?\s*$/);
    if (authorMatch) currentItem.author = authorMatch[1];
    
    const versionMatch = line.match(/^\s+version:\s*'([^']+)',?\s*$/);
    if (versionMatch) currentItem.version = versionMatch[1];
    
    const iconMatch = line.match(/^\s+icon:\s*'([^']+)',?\s*$/);
    if (iconMatch) currentItem.icon = iconMatch[1];
    
    const inputMatch = line.match(/^\s+input:\s*'([^']+)',?\s*$/);
    if (inputMatch) currentItem.input = inputMatch[1];
    
    const outputMatch = line.match(/^\s+output:\s*'([^']+)',?\s*$/);
    if (outputMatch) currentItem.output = outputMatch[1];
    
    // 数组字段 (简单处理)
    if (line.includes('tags: [')) currentItem.tags = [];
    if (line.includes('techTags: [')) currentItem.tech_tags = [];
    if (line.includes('sceneTags: [')) currentItem.scene_tags = [];
    if (line.includes('costTags: [')) currentItem.cost_tags = [];
    if (line.includes('compatibility: [')) currentItem.compatibility = [];
    
    // 数组元素
    const tagMatch = line.match(/'([^']+)',?\s*$/);
    if (tagMatch && line.includes(': [')) {
      const arrayName = line.includes('tags:') ? 'tags' :
                        line.includes('techTags:') ? 'tech_tags' :
                        line.includes('sceneTags:') ? 'scene_tags' :
                        line.includes('costTags:') ? 'cost_tags' :
                        line.includes('compatibility:') ? 'compatibility' : null;
      if (arrayName && currentItem[arrayName]) {
        currentItem[arrayName].push(tagMatch[1]);
      }
    }
  }
  
  // 保存最后一个
  if (Object.keys(currentItem).length > 0) {
    if (currentArray === 'tools') tools.push(currentItem);
    else if (currentArray === 'skills') skills.push(currentItem);
    else if (currentArray === 'scenes') scenes.push(currentItem);
  }
  
  return { tools, skills, scenes };
}

// ===================== 主流程 =====================

async function migrate() {
  console.log('╔════════════════════════════════════════╗');
  console.log('║   AI导航站 - 数据迁移到 Supabase        ║');
  console.log('╚════════════════════════════════════════╝\n');

  if (!SUPABASE_KEY) {
    console.error('❌ 请设置 SUPABASE_SERVICE_KEY 环境变量');
    console.log('   示例: SUPABASE_SERVICE_KEY=xxx node scripts/migrate-to-supabase.js');
    process.exit(1);
  }

  // 解析数据
  console.log('📖 解析 data/tools.ts...');
  const { tools, skills, scenes } = parseToolsTS();
  console.log(`   解析到 ${tools.length} 个工具, ${skills.length} 个Skill, ${scenes.length} 个场景`);

  // 上传工具
  console.log('\n📤 上传工具数据...');
  let toolSuccess = 0;
  for (const tool of tools) {
    try {
      const result = await request('POST', '/rest/v1/tools', tool);
      if (result.id || result.length === 0) toolSuccess++;
    } catch (e) {
      console.log(`   ⚠️  ${tool.id}: ${e.message}`);
    }
  }
  console.log(`   ✅ 成功上传 ${toolSuccess}/${tools.length} 个工具`);

  // 上传 Skill
  console.log('\n📤 上传Skill数据...');
  let skillSuccess = 0;
  for (const skill of skills) {
    try {
      // 映射字段
      const mapped = {
        id: skill.id,
        name: skill.name,
        description: skill.description,
        category: skill.category,
        difficulty: skill.difficulty,
        author: skill.author,
        version: skill.version,
        install_count: skill.install_count,
        success_rate: skill.success_rate,
        rating: skill.rating,
        price: skill.price,
        compatibility: skill.compatibility,
        input: skill.input,
        output: skill.output,
        icon: skill.icon,
        heat: skill.heat || 50,
        heatGrowth: skill.heatGrowth || 0,
      };
      const result = await request('POST', '/rest/v1/skills', mapped);
      if (result.id || result.length === 0) skillSuccess++;
    } catch (e) {
      console.log(`   ⚠️  ${skill.id}: ${e.message}`);
    }
  }
  console.log(`   ✅ 成功上传 ${skillSuccess}/${skills.length} 个Skill`);

  // 上传场景
  console.log('\n📤 上传场景数据...');
  let sceneSuccess = 0;
  for (const scene of scenes) {
    try {
      const mapped = {
        id: scene.id,
        name: scene.name,
        icon: scene.icon,
        description: scene.description,
        tags: scene.tags,
        tool_count: scene.toolCount || scene.tool_count || 0,
        skill_count: scene.skillCount || scene.skill_count || 0,
        xhs_saves: scene.xhsSaves || scene.xhs_saves || 0,
        heat: scene.heat || 50,
      };
      const result = await request('POST', '/rest/v1/scenes', mapped);
      if (result.id || result.length === 0) sceneSuccess++;
    } catch (e) {
      console.log(`   ⚠️  ${scene.id}: ${e.message}`);
    }
  }
  console.log(`   ✅ 成功上传 ${sceneSuccess}/${scenes.length} 个场景`);

  // 验证
  console.log('\n🔍 验证数据...');
  const verifyTools = await request('GET', '/rest/v1/tools?select=id');
  const verifySkills = await request('GET', '/rest/v1/skills?select=id');
  const verifyScenes = await request('GET', '/rest/v1/scenes?select=id');
  console.log(`   工具: ${verifyTools.length}, Skill: ${verifySkills.length}, 场景: ${verifyScenes.length}`);

  console.log('\n✅ 迁移完成!');
  return { tools: toolSuccess, skills: skillSuccess, scenes: sceneSuccess };
}

if (require.main === module) {
  migrate()
    .then(({ tools, skills, scenes }) => {
      console.log(`\n📊 统计: ${tools} 工具, ${skills} Skill, ${scenes} 场景`);
      process.exit(0);
    })
    .catch(err => {
      console.error('\n❌ 迁移失败:', err.message);
      process.exit(1);
    });
}

module.exports = { migrate, parseToolsTS };
