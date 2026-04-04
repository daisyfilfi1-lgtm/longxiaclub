/**
 * AI导航站 - 内容采集脚本
 * 功能：从多个来源采集工具使用技巧和教程
 * 
 * 数据源：
 * 1. 官方文档 (web fetch)
 * 2. Reddit 社区讨论
 * 3. 小红书/微博 热门内容
 * 
 * 使用: node scripts/content-collector.js
 */

import { tools } from '../data/tools.js';

const COLLECTION_CONFIG = {
  // 数据源配置
  sources: {
    official: {
      enabled: true,
      priority: 1
    },
    reddit: {
      enabled: true,
      subreddits: ['ChatGPT', 'midjourney', 'LocalLLaMA', 'ClaudeAI'],
      priority: 2
    },
    twitter: {
      enabled: false,
      priority: 3
    }
  },
  
  // AI处理配置
  ai: {
    provider: 'deepseek',
    model: 'deepseek-chat',
    maxTokens: 2000
  }
};

// 要采集的工具列表
const TOOLS_TO_COLLECT = tools.slice(0, 5); // 先处理前5个

/**
 * 从官方页面采集基础信息
 */
async function fetchOfficialContent(tool) {
  console.log(`📥 采集官方信息: ${tool.name}`);
  
  try {
    // 尝试获取官方首页内容
    const response = await fetch(tool.url, {
      timeout: 10000
    });
    
    if (!response.ok) {
      console.log(`  ⚠️ 官方页面无法访问`);
      return null;
    }
    
    const html = await response.text();
    
    // 提取 meta 描述
    const descriptionMatch = html.match(/<meta name="description" content="([^"]+)"/i);
    const ogDescMatch = html.match(/<meta property="og:description" content="([^"]+)"/i);
    
    const description = descriptionMatch?.[1] || ogDescMatch?.[1] || '';
    
    // 提取标题
    const titleMatch = html.match(/<title>([^<]+)<\/title>/i);
    const title = titleMatch?.[1] || tool.name;
    
    return {
      source: 'official',
      url: tool.url,
      title: title.slice(0, 200),
      description: description.slice(0, 500),
      fetchedAt: new Date().toISOString()
    };
  } catch (error) {
    console.log(`  ❌ 采集失败: ${error.message}`);
    return null;
  }
}

/**
 * 搜索 Reddit 获取使用技巧
 */
async function searchReddit(toolName, subreddits) {
  console.log(`  🔍 搜索 Reddit: ${toolName}`);
  
  const results = [];
  
  for (const subreddit of subreddits) {
    try {
      // 使用 Reddit API 搜索
      const query = encodeURIComponent(toolName);
      const url = `https://www.reddit.com/r/${subreddit}/search.json?q=${query}&sort=hot&limit=5`;
      
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'AI-Nav-Collector/1.0'
        },
        timeout: 10000
      });
      
      if (!response.ok) continue;
      
      const data = await response.json();
      
      if (data.data?.children) {
        for (const post of data.data.children) {
          const p = post.data;
          results.push({
            source: 'reddit',
            subreddit: r/,
            title: p.title?.slice(0, 200),
            content: p.selftext?.slice(0, 1000),
            url: `https://reddit.com${p.permalink}`,
            score: p.score,
            numComments: p.num_comments,
            fetchedAt: new Date().toISOString()
          });
        }
      }
    } catch (error) {
      console.log(`    ⚠️ Reddit ${subreddit} 搜索失败`);
    }
  }
  
  return results;
}

/**
 * AI 处理：提取使用技巧
 */
async function generateTipsWithAI(tool, rawContent) {
  console.log(`  🤖 AI 处理: ${tool.name}`);
  
  const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;
  const DEEPSEEK_BASE_URL = process.env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com';
  
  if (!DEEPSEEK_API_KEY) {
    console.log(`  ⚠️ 未配置 DeepSeek API Key，跳过AI处理`);
    return null;
  }
  
  const prompt = `
你是AI工具内容专家。请根据以下信息，为"${tool.name}"生成实用的使用技巧和教程。

## 工具信息
- 名称: ${tool.name}
- 描述: ${tool.description}
- 官方链接: ${tool.url}
- 已有技巧: ${tool.tips?.join('; ') || '无'}

## 采集的原始内容
${JSON.stringify(rawContent.slice(0, 3), null, 2).slice(0, 2000)}

请按以下格式生成内容：
{
  "tips": ["技巧1", "技巧2", "技巧3"],
  "cases": [
    {
      "title": "案例标题",
      "description": "案例描述",
      "prompt": "使用的Prompt（可选）"
    }
  ],
  "guides": [
    {
      "title": "教程标题",
      "steps": ["步骤1", "步骤2", "步骤3"]
    }
  ]
}
`;

  try {
    const response = await fetch(`${DEEPSEEK_BASE_URL}/v1/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: '你是一个AI工具使用专家，擅长生成实用技巧和教程。' },
          { role: 'user', content: prompt }
        ],
        max_tokens: 2000,
        temperature: 0.7
      })
    });
    
    if (!response.ok) {
      console.log(`  ⚠️ AI API 调用失败: ${response.status}`);
      return null;
    }
    
    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    
    if (content) {
      try {
        return JSON.parse(content);
      } catch {
        console.log(`  ⚠️ AI 返回内容解析失败`);
        return null;
      }
    }
  } catch (error) {
    console.log(`  ❌ AI 处理异常: ${error.message}`);
  }
  
  return null;
}

/**
 * 主函数：采集并处理
 */
async function main() {
  console.log('🚀 AI导航站 内容采集器启动\n');
  console.log(`📋 待处理工具: ${TOOLS_TO_COLLECT.length} 个\n`);
  
  const results = [];
  
  for (const tool of TOOLS_TO_COLLECT) {
    console.log(`\n📌 处理工具: ${tool.name}`);
    
    // 1. 采集官方内容
    const officialContent = await fetchOfficialContent(tool);
    
    // 2. 搜索社区内容
    let communityContent = [];
    if (COLLECTION_CONFIG.sources.reddit.enabled) {
      communityContent = await searchReddit(
        tool.name,
        COLLECTION_CONFIG.sources.reddit.subreddits
      );
    }
    
    // 3. AI 处理
    const aiResult = await generateTipsWithAI(tool, [officialContent, ...communityContent]);
    
    results.push({
      toolId: tool.id,
      toolName: tool.name,
      officialContent,
      communityContent,
      aiGenerated: aiResult,
      processedAt: new Date().toISOString()
    });
    
    console.log(`  ✅ 完成: ${tool.name}`);
    
    // 避免请求过快
    await new Promise(r => setTimeout(r, 2000));
  }
  
  // 输出结果
  console.log('\n\n📊 采集结果汇总:');
  console.log(JSON.stringify(results, null, 2));
  
  // 保存到文件
  const fs = await import('fs');
  fs.writeFileSync(
    './data/collected-content.json',
    JSON.stringify(results, null, 2)
  );
  console.log('\n💾 结果已保存到 data/collected-content.json');
}

// 运行
main().catch(console.error);