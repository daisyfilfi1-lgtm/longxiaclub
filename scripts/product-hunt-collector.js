#!/usr/bin/env node
/**
 * Product Hunt 数据采集脚本
 * 获取每日热门AI产品热度
 * 
 * 使用方式: node scripts/product-hunt-collector.js
 */

const fs = require('fs');
const path = require('path');

const OUTPUT_FILE = path.join(__dirname, '..', 'data', 'product-hunt-data.json');

// Product Hunt API (公开API)
const PH_API_URL = 'https://www.producthunt.com/v0/posts';
const PH_CATEGORIES = ['ai', 'software', 'developer-tools', 'productivity'];

// 模拟数据 - 实际应该通过API获取
// Product Hunt 没有公开的简单API，这里用模拟数据演示结构
// 实际可考虑: 付费API / 网页爬虫 / 手动维护热门列表

function getMockProductHuntData() {
  const mockProducts = [
    {
      name: 'GPT-4o',
      description: 'OpenAI最新一代旗舰模型',
      votes: 5000,
      category: 'ai',
      url: 'https://openai.com',
      launched_at: '2026-04-01'
    },
    {
      name: 'Claude 4',
      description: 'Anthropic最新AI助手',
      votes: 4200,
      category: 'ai',
      url: 'https://claude.ai',
      launched_at: '2026-03-28'
    },
    {
      name: 'Cursor',
      description: 'AI驱动的代码编辑器',
      votes: 3800,
      category: 'developer-tools',
      url: 'https://cursor.sh',
      launched_at: '2024-01'
    },
    {
      name: 'Notion AI',
      description: 'AI赋能的笔记工具',
      votes: 3500,
      category: 'productivity',
      url: 'https://notion.so',
      launched_at: '2023-02'
    },
    {
      name: 'Midjourney V6',
      description: 'AI图像生成最新版本',
      votes: 3200,
      category: 'ai',
      url: 'https://midjourney.com',
      launched_at: '2023-12'
    },
    {
      name: 'Suno V4',
      description: 'AI音乐生成工具',
      votes: 2800,
      category: 'ai',
      url: 'https://suno.ai',
      launched_at: '2024-03'
    },
    {
      name: 'Perplexity',
      description: 'AI搜索引擎',
      votes: 2600,
      category: 'ai',
      url: 'https://perplexity.ai',
      launched_at: '2023-08'
    },
    {
      name: 'Runway Gen-3',
      description: 'AI视频生成工具',
      votes: 2400,
      category: 'ai',
      url: 'https://runwayml.com',
      launched_at: '2024-06'
    },
    {
      name: 'HeyGen',
      description: 'AI数字人视频',
      votes: 2200,
      category: 'ai',
      url: 'https://heygen.com',
      launched_at: '2023-05'
    },
    {
      name: 'Gamma',
      description: 'AI PPT生成工具',
      votes: 2000,
      category: 'productivity',
      url: 'https://gamma.app',
      launched_at: '2023-11'
    }
  ];

  return mockProducts.map(product => ({
    ...product,
    heat_score: Math.round(product.votes / 50),
    rank: 0
  })).sort((a, b) => b.votes - a.votes).map((p, i) => ({...p, rank: i + 1}));
}

async function fetchProductHuntData() {
  console.log('📡 Fetching Product Hunt data...');
  
  // 实际项目中应该:
  // 1. 使用 Product Hunt API (需要认证)
  // 2. 或者使用第三方数据服务
  // 3. 或者定期爬虫获取
  
  // 这里使用模拟数据作为演示
  const data = getMockProductHuntData();
  
  return {
    timestamp: new Date().toISOString(),
    source: 'producthunt',
    products: data,
    total: data.length
  };
}

async function main() {
  try {
    console.log('🚀 Starting Product Hunt data collection...');
    
    const data = await fetchProductHuntData();
    
    // 保存到文件
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(data, null, 2));
    console.log(`✅ Saved ${data.products.length} products to ${OUTPUT_FILE}`);
    
    // 打印前5名
    console.log('\n📊 Top 5 Products:');
    data.products.slice(0, 5).forEach((p, i) => {
      console.log(`  ${i + 1}. ${p.name} (${p.votes} votes)`);
    });
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

main();