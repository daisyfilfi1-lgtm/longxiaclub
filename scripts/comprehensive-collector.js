#!/usr/bin/env node
/**
 * 综合数据采集脚本
 * 整合 GitHub + Product Hunt + Google Trends 数据
 * 
 * 使用方式: node scripts/comprehensive-collector.js
 */

const fs = require('fs');
const path = require('path');

// 数据文件路径
const GITHUB_FILE = path.join(__dirname, '..', 'data', 'github-metrics.json');
const PH_FILE = path.join(__dirname, '..', 'data', 'product-hunt-data.json');
const TRENDS_FILE = path.join(__dirname, '..', 'data', 'google-trends-data.json');
const OUTPUT_FILE = path.join(__dirname, '..', 'data', 'leaderboard-data.json');

// AI工具/项目关键词映射
const KEYWORD_MAP = {
  'ChatGPT': { github: ['openai', 'openai/openai', 'openai/chatgpt'] },
  'Claude': { github: ['anthropic', 'anthropic/claude-api'] },
  'Midjourney': { github: ['midjourney'] },
  'Cursor': { github: ['cursor-sh', 'cursor-sh/cursor'] },
  'Kimi': { github: ['moonshotai', 'moonshotai/kimi'] },
  'GPT-4': { github: ['openai', 'openai/gpt-4'] },
  'Stable Diffusion': { github: ['StabilityAI', 'stabilityai/stable-diffusion'] },
  'Runway': { github: ['runwayml'] },
  'Suno': { github: ['suno-ai', 'suno-ai/suno-api'] },
  'Perplexity': { github: ['perplexity-ai'] },
  'Gamma': { github: ['gamma-app'] },
  'HeyGen': { github: ['heygen', 'heygen-arbitrary'] },
  'Notion AI': { github: ['notion', 'notionhq/notion'] },
  'Copilot': { github: ['microsoft', 'microsoft/vscode-copilot'] },
  'DALL-E': { github: ['openai', 'openai/dall-e'] },
  'Llama': { github: ['meta-llama', 'meta-llama/llama'] },
  'LangChain': { github: ['langchain-ai', 'langchain-ai/langchain'] },
  'AutoGPT': { github: ['Significant-Gravitas', 'Significant-Gravitas/AutoGPT'] }
};

function loadJSON(filePath) {
  try {
    if (fs.existsSync(filePath)) {
      return JSON.parse(fs.readFileSync(filePath, 'utf8'));
    }
  } catch (e) {
    console.warn(`Warning: Could not load ${filePath}`);
  }
  return null;
}

function calculateCombinedHeat(githubData, phData, trendsData) {
  const combined = {};
  
  // 初始化所有关键词
  for (const keyword of Object.keys(KEYWORD_MAP)) {
    combined[keyword] = {
      keyword,
      github_heat: 0,
      ph_heat: 0,
      trends_heat: 0,
      total_heat: 0
    };
  }
  
  // 合并 GitHub 数据
  if (githubData && githubData.projects) {
    githubData.projects.forEach(repo => {
      for (const [keyword, config] of Object.entries(KEYWORD_MAP)) {
        if (config.github && config.github.some(r => 
          repo.name.toLowerCase().includes(r.toLowerCase()) ||
          (repo.full_name && repo.full_name.toLowerCase().includes(r.toLowerCase()))
        )) {
          combined[keyword].github_heat = Math.max(
            combined[keyword].github_heat,
            repo.stars || 0
          );
        }
      }
    });
  }
  
  // 合并 Product Hunt 数据
  if (phData && phData.products) {
    phData.products.forEach(product => {
      for (const keyword of Object.keys(combined)) {
        if (product.name.toLowerCase().includes(keyword.toLowerCase()) ||
            keyword.toLowerCase().includes(product.name.toLowerCase())) {
          combined[keyword].ph_heat = Math.max(
            combined[keyword].ph_heat,
            product.heat_score || product.votes || 0
          );
        }
      }
    });
  }
  
  // 合并 Google Trends 数据
  if (trendsData && trendsData.keywords) {
    trendsData.keywords.forEach(kw => {
      if (combined[kw.keyword]) {
        combined[kw.keyword].trends_heat = kw.current_heat || 0;
      }
    });
  }
  
  // 计算综合热度 (加权平均)
  const weights = {
    github: 0.5,    // GitHub Stars
    ph: 0.3,        // Product Hunt
    trends: 0.2     // Google Trends
  };
  
  const results = Object.values(combined).map(item => {
    // 归一化
    const maxGithub = Math.max(...Object.values(combined).map(i => i.github_heat), 1);
    const maxPH = Math.max(...Object.values(combined).map(i => i.ph_heat), 1);
    const maxTrends = Math.max(...Object.values(combined).map(i => i.trends_heat), 1);
    
    const normalizedGithub = item.github_heat / maxGithub * 100;
    const normalizedPH = item.ph_heat / maxPH * 100;
    const normalizedTrends = item.trends_heat / maxTrends * 100;
    
    item.total_heat = Math.round(
      normalizedGithub * weights.github +
      normalizedPH * weights.ph +
      normalizedTrends * weights.trends
    );
    
    return item;
  });
  
  // 按热度排序
  return results.sort((a, b) => b.total_heat - a.total_heat);
}

async function main() {
  console.log('🚀 Starting comprehensive data collection...\n');
  
  // 加载各数据源
  const githubData = loadJSON(GITHUB_FILE);
  const phData = loadJSON(PH_FILE);
  const trendsData = loadJSON(TRENDS_FILE);
  
  console.log('📊 Data sources loaded:');
  console.log(`  - GitHub: ${githubData?.projects?.length || 0} projects`);
  console.log(`  - Product Hunt: ${phData?.products?.length || 0} products`);
  console.log(`  - Google Trends: ${trendsData?.keywords?.length || 0} keywords`);
  
  // 计算综合热度
  const combinedData = calculateCombinedHeat(githubData, phData, trendsData);
  
  // 保存结果
  const output = {
    timestamp: new Date().toISOString(),
    sources: {
      github: githubData?.timestamp || null,
      product_hunt: phData?.timestamp || null,
      google_trends: trendsData?.timestamp || null
    },
    leaderboard: combinedData,
    summary: {
      total_items: combinedData.length,
      top_3: combinedData.slice(0, 3).map(i => i.keyword)
    }
  };
  
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(output, null, 2));
  console.log(`\n✅ Saved to ${OUTPUT_FILE}`);
  
  // 打印Top 10
  console.log('\n🏆 Top 10 AI Tools:');
  combinedData.slice(0, 10).forEach((item, i) => {
    console.log(`  ${i + 1}. ${item.keyword}: ${item.total_heat} ` +
      `(GH: ${item.github_heat}, PH: ${item.ph_heat}, Trends: ${item.trends_heat})`);
  });
}

main().catch(console.error);