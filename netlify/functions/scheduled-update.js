/**
 * 每日内容更新定时任务
 * 
 * 配置: 在 netlify.toml 中启用定时触发
 * 触发: 每天 UTC 0:00 (北京时间 08:00)
 * 
 * 任务:
 * 1. 抓取 Product Hunt 今日热门
 * 2. 更新 GitHub Trending
 * 3. 更新 Google Trends
 * 4. 计算工具热度
 * 5. 更新 Leaderboard
 */

const { tools } = require('../data/tools.js');

// 模拟数据更新（实际需要连接数据库）
async function runDailyUpdate() {
  console.log('🔄 开始每日内容更新...');
  const startTime = Date.now();
  
  try {
    // 1. 更新工具热度数据
    console.log('📊 更新工具热度...');
    
    // 2. 重新计算所有工具的热度分数
    const updatedTools = tools.map(tool => {
      // 模拟热度计算
      const baseScore = tool.stars || 0;
      const recencyBonus = Math.random() * 10; // 模拟近期活跃度
      const heatScore = Math.round((baseScore / 1000) + recencyBonus);
      
      return {
        ...tool,
        heatScore,
        lastUpdated: new Date().toISOString()
      };
    });
    
    // 3. 更新 leaderboard
    const leaderboard = updatedTools
      .sort((a, b) => b.heatScore - a.heatScore)
      .slice(0, 20)
      .map((t, i) => ({ rank: i + 1, id: t.id, heatScore: t.heatScore }));
    
    console.log('📈 更新 Leaderboard 完成');
    console.log('Top 5:', leaderboard.slice(0, 5).map(l => `${l.id}: ${l.heatScore}`).join(', '));
    
    // 4. 生成每日报告
    const report = {
      timestamp: new Date().toISOString(),
      toolsCount: updatedTools.length,
      leaderboard: leaderboard.slice(0, 10),
      duration: Date.now() - startTime
    };
    
    console.log('✅ 每日更新完成:', report);
    
    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, report })
    };
    
  } catch (error) {
    console.error('❌ 更新失败:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
}

// Netlify Scheduled Functions 入口
exports.handler = async (event, context) => {
  // 验证触发来源
  if (event.source === 'scheduled' || event.httpMethod === 'GET') {
    return runDailyUpdate();
  }
  
  return {
    statusCode: 403,
    body: JSON.stringify({ error: 'Forbidden' })
  };
};