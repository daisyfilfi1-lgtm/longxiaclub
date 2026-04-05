#!/usr/bin/env node
/**
 * Google Trends 数据采集脚本
 * 获取AI相关关键词的搜索趋势
 * 
 * 使用方式: node scripts/google-trends-collector.js
 */

const fs = require('fs');
const path = require('path');

const OUTPUT_FILE = path.join(__dirname, '..', 'data', 'google-trends-data.json');

// 追踪的AI关键词
const AI_KEYWORDS = [
  'ChatGPT',
  'Midjourney',
  'Claude',
  'Cursor',
  'Kimi',
  'GPT-4',
  'AI',
  'LLM',
  'LLM',
  'AIGC',
  'Stable Diffusion',
  'Runway',
  'Suno',
  'Perplexity',
  'Gamma',
  'HeyGen',
  'Notion AI',
  'Copilot',
  'DALL-E',
  'Llama'
];

// Google Trends API 模拟数据
// 实际应使用 pytrends 或 google-trends-api 库

function getMockTrendsData() {
  const now = Date.now();
  const oneDay = 24 * 60 * 60 * 1000;
  
  // 生成模拟趋势数据
  return AI_KEYWORDS.map(keyword => {
    // 模拟基础热度 (0-100)
    const baseHeat = Math.random() * 60 + 40;
    
    // 模拟30天趋势
    const trends = [];
    for (let i = 29; i >= 0; i--) {
      const date = new Date(now - i * oneDay);
      const variation = (Math.random() - 0.5) * 20;
      trends.push({
        date: date.toISOString().split('T')[0],
        value: Math.max(0, Math.min(100, Math.round(baseHeat + variation)))
      });
    }
    
    // 计算热度增长
    const recentAvg = trends.slice(-7).reduce((a, b) => a + b.value, 0) / 7;
    const olderAvg = trends.slice(-14, -7).reduce((a, b) => a + b.value, 0) / 7;
    const growth = recentAvg - olderAvg;
    
    return {
      keyword,
      current_heat: Math.round(recentAvg),
      growth: Math.round(growth * 10) / 10,
      peak_30d: Math.max(...trends.map(t => t.value)),
      trend: trends,
      last_updated: new Date().toISOString()
    };
  }).sort((a, b) => b.current_heat - a.current_heat);
}

async function fetchGoogleTrends() {
  console.log('📡 Fetching Google Trends data...');
  
  // 实际项目中应该:
  // 1. 使用 google-trends-api 库
  // 2. 或使用 pytrends (Python)
  // 3. 或使用 SerpAPI 等付费服务
  
  // 这里使用模拟数据
  const data = getMockTrendsData();
  
  return {
    timestamp: new Date().toISOString(),
    source: 'google_trends',
    keywords: data,
    total_keywords: data.length
  };
}

async function main() {
  try {
    console.log('🚀 Starting Google Trends data collection...');
    
    const data = await fetchGoogleTrends();
    
    // 保存到文件
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(data, null, 2));
    console.log(`✅ Saved ${data.keywords.length} keywords to ${OUTPUT_FILE}`);
    
    // 打印前10名
    console.log('\n📊 Top 10 Trending Keywords:');
    data.keywords.slice(0, 10).forEach((k, i) => {
      console.log(`  ${i + 1}. ${k.keyword}: ${k.current_heat} (${k.growth > 0 ? '+' : ''}${k.growth})`);
    });
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

main();