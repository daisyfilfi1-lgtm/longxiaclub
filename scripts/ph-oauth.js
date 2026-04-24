#!/usr/bin/env node
/**
 * Product Hunt OAuth 认证 + 数据获取
 * 
 * 使用方式:
 * 1. 首次运行: node scripts/ph-oauth.js
 * 2. 后续运行: node scripts/ph-oauth.js --run
 */

const fs = require('fs');
const path = require('path');
const http = require('http');
const https = require('https');
const url = require('url');

// ===================== 配置 =====================
const CONFIG = {
  // 在 https://www.producthunt.com/v2/developer 创建应用获取
  client_id: process.env.PH_CLIENT_ID || '',
  client_secret: process.env.PH_CLIENT_SECRET || '',
  
  // Redirect URI - 你的网站
  redirect_uri: 'https://www.longxiaclub.com/api/auth/callback',
  
  // 存放token的文件
  token_file: path.join(__dirname, '..', 'data', 'ph-token.json'),
  
  // 输出文件
  output_file: path.join(__dirname, '..', 'data', 'product-hunt-data.json')
};

// ===================== OAuth 流程 =====================

/**
 * 启动本地OAuth服务器（用于本地开发）
 * 生产环境应该用你的网站作为回调
 */
function startOAuthServer() {
  return new Promise((resolve, reject) => {
    const server = http.createServer((req, res) => {
      const query = url.parse(req.url, true).query;
      
      if (query.code) {
        // 收到授权码
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end('<h1>授权成功！可以关闭此窗口。</h1><p>正在获取Token...</p>');
        server.close();
        resolve(query.code);
      } else {
        res.writeHead(400);
        res.end('No code received');
      }
    });
    
    server.listen(3000, () => {
      console.log('等待授权...\n');
    });
  });
}

/**
 * 生成授权URL
 */
function getAuthUrl() {
  const params = new URLSearchParams({
    client_id: CONFIG.client_id,
    redirect_uri: CONFIG.redirect_uri,
    response_type: 'code'
  });
  
  return `https://api.producthunt.com/v2/oauth/authorize?${params}`;
}

/**
 * 用code换token
 */
async function exchangeCodeForToken(code) {
  const postData = JSON.stringify({
    client_id: CONFIG.client_id,
    client_secret: CONFIG.client_secret,
    code: code,
    grant_type: 'authorization_code',
    redirect_uri: CONFIG.redirect_uri
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
            reject(new Error(data));
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
  console.log('Token已保存');
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

/**
 * 获取Product Hunt数据
 */
async function fetchProducts(token) {
  const query = `
    query {
      posts(first: 20, order: VOTES) {
        edges {
          node {
            id
            name
            tagline
            votesCount
            url
            launchedAt
            categories {
              name
            }
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
  console.log('🚀 Product Hunt OAuth + Data Fetch\n');
  
  // 检查是否有token
  let token = loadToken();
  
  if (!token) {
    // 需要OAuth
    if (!CONFIG.client_id || !CONFIG.client_secret) {
      console.log('❌ 请先配置环境变量:');
      console.log('   export PH_CLIENT_ID="your_client_id"');
      console.log('   export PH_CLIENT_SECRET="your_client_secret"');
      console.log('\n或在 https://www.producthunt.com/v2/developer 创建应用');
      console.log('\n应用设置中的Redirect URI设置为:');
      console.log(CONFIG.redirect_uri);
      process.exit(1);
    }
    
    // 启动OAuth
    const code = await startOAuthServer();
    console.log('\n获取到授权码:', code);
    
    // 换token
    console.log('正在交换Token...');
    token = await exchangeCodeForToken(code);
    saveToken(token);
  }
  
  // 获取数据
  console.log('\n📡 正在获取热门产品...');
  const data = await fetchProducts(token);
  
  // 解析数据
  const products = data.data?.posts?.edges?.map(e => e.node) || [];
  
  const formatted = {
    timestamp: new Date().toISOString(),
    source: 'producthunt',
    products: products.map(p => ({
      name: p.name,
      description: p.tagline,
      votes: p.votesCount,
      url: p.url,
      category: p.categories?.[0]?.name || 'ai',
      heat_score: Math.round(p.votesCount / 50),
      rank: 0
    })).sort((a, b) => b.votes - a.votes)
      .map((p, i) => ({...p, rank: i + 1}))
  };
  
  // 保存
  fs.writeFileSync(CONFIG.output_file, JSON.stringify(formatted, null, 2));
  console.log(`\n✅ 已保存 ${products.length} 个产品到 ${CONFIG.output_file}`);
  
  // 显示前5
  console.log('\n🏆 Top 5 Products:');
  formatted.products.slice(0, 5).forEach((p, i) => {
    console.log(`  ${i + 1}. ${p.name} (${p.votes} votes)`);
  });
}

main().catch(console.error);