#!/usr/bin/env node
/**
 * Product Hunt API - Client Credentials 模式
 * 不需要用户授权，直接用 API Key + API Secret 换 Token
 * 
 * 使用方式:
 *   node scripts/ph-client-auth.js
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

// ===================== 配置 =====================
const CONFIG = {
  // 从 Product Hunt 开发者后台获取
  api_key: process.env.PH_API_KEY || '',
  api_secret: process.env.PH_API_SECRET || '',
  
  // 存放token的文件
  token_file: path.join(__dirname, '..', 'data', 'ph-token.json'),
  
  // 输出文件
  output_file: path.join(__dirname, '..', 'data', 'product-hunt-data.json')
};

// ===================== 获取 Token =====================

/**
 * 用 Client Credentials 获取 Token
 * 文档: https://api.producthunt.com/v2/docs/oauth_client_only_authentication
 */
async function getClientToken() {
  const postData = JSON.stringify({
    client_id: CONFIG.api_key,
    client_secret: CONFIG.api_secret,
    grant_type: 'client_credentials'
  });
  
  return new Promise((resolve, reject) => {
    const req = https.request({
      hostname: 'api.producthunt.com',
      path: '/v2/oauth/token',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          if (result.access_token) {
            resolve(result.access_token);
          } else {
            reject(new Error('No access_token: ' + data));
          }
        } catch (e) {
          reject(e);
        }
      });
    });
    
    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

/**
 * 保存token
 */
function saveToken(token) {
  const data = {
    access_token: token,
    created_at: new Date().toISOString()
  };
  fs.writeFileSync(CONFIG.token_file, JSON.stringify(data, null, 2));
}

/**
 * 加载token
 */
function loadToken() {
  try {
    if (fs.existsSync(CONFIG.token_file)) {
      return JSON.parse(fs.readFileSync(CONFIG.token_file, 'utf8')).access_token;
    }
  } catch (e) {}
  return null;
}

// ===================== 获取数据 =====================

async function fetchProducts(token) {
  // 获取更多产品
  const query = `
    query {
      posts(first: 50, order: VOTES) {
        edges {
          node {
            id
            name
            tagline
            votesCount
            url
            thumbnail {
              url
            }
            launchedAt
          }
        }
      }
    }
  `;
  
  return new Promise((resolve, reject) => {
    const req = https.request({
      hostname: 'api.producthunt.com',
      path: '/v2/api/graphql',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          resolve(result);
        } catch (e) {
          reject(e);
        }
      });
    });
    
    req.on('error', reject);
    req.write(JSON.stringify({ query }));
    req.end();
  });
}

// ===================== 主流程 =====================

async function main() {
  console.log('🚀 Product Hunt API (Client Credentials)\n');
  
  // 检查配置
  if (!CONFIG.api_key || !CONFIG.api_secret) {
    console.log('❌ 请先配置环境变量:');
    console.log('   export PH_API_KEY="你的API Key"');
    console.log('   export PH_API_SECRET="你的API Secret"');
    console.log('\n在 Product Hunt 开发者后台获取: https://www.producthunt.com/v2/developer');
    process.exit(1);
  }
  
  // 获取token
  let token = loadToken();
  if (!token) {
    console.log('📡 获取访问Token...');
    token = await getClientToken();
    saveToken(token);
    console.log('✅ Token获取成功\n');
  } else {
    console.log('✅ 使用已有Token\n');
  }
  
  // 获取数据
  console.log('📡 获取热门产品...');
  const data = await fetchProducts(token);
  
  // 解析数据 - 保留所有产品，按热度排序
  const products = data.data?.posts?.edges?.map(e => e.node) || [];
  
  // 映射到统一格式（保留所有，热门优先）
  const formattedProducts = products
    .map(p => ({
      name: p.name,
      description: p.tagline,
      votes: p.votesCount,
      url: p.url,
      thumbnail: p.thumbnail?.url || '',
      heat_score: Math.round(p.votesCount / 50),
      rank: 0
    }))
    .sort((a, b) => b.votes - a.votes)
    .map((p, i) => ({...p, rank: i + 1}));
  
  const formatted = {
    timestamp: new Date().toISOString(),
    source: 'producthunt',
    products: formattedProducts
  };
  
  // 保存
  fs.writeFileSync(CONFIG.output_file, JSON.stringify(formatted, null, 2));
  console.log(`✅ 已保存 ${formattedProducts.length} 个产品`);
  
  // 显示前5
  console.log('\n🏆 Top 5 Products:');
  formatted.products.slice(0, 5).forEach((p, i) => {
    console.log(`  ${i + 1}. ${p.name} (${p.votes} votes)`);
  });
}

main().catch(console.error);