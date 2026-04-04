/**
 * 内容更新定时任务
 * 用途：每天自动采集并更新工具内容
 * 
 * 配置 Cron Job:
 * npx netlify functions:create scripts/scheduled-content-update
 * 
 * 或使用本地: node scripts/scheduled-update.js
 */

import { tools } from '../data/tools.js';

// 从已采集内容中获取
import { default as collectedContent } from '../data/collected-content.json' assert { type: "json" };

/**
 * 合并原始数据与AI生成内容
 */
function mergeContent(tool) {
  const collected = collectedContent.find(c => c.toolId === tool.id);
  
  if (!collected) {
    return {
      ...tool,
      enhancedTips: tool.tips || [],
      cases: [],
      guides: []
    };
  }
  
  return {
    ...tool,
    // 合并原有技巧 + AI生成的技巧
    enhancedTips: [
      ...(tool.tips || []),
      ...(collected.aiGenerated?.tips || [])
    ],
    // AI生成的案例
    cases: collected.aiGenerated?.cases || [],
    // AI生成的教程
    guides: collected.aiGenerated?.guides || [],
    // 内容更新时间
    contentUpdatedAt: collected.processedAt
  };
}

/**
 * 导出增强后的数据
 */
function exportEnhancedData() {
  const enhancedTools = tools.map(mergeContent);
  
  console.log('📊 增强数据预览:');
  for (const tool of enhancedTools.slice(0, 3)) {
    console.log(`\n${tool.name}:`);
    console.log(`  技巧数量: ${tool.enhancedTips?.length || 0}`);
    console.log(`  案例数量: ${tool.cases?.length || 0}`);
    console.log(`  教程数量: ${tool.guides?.length || 0}`);
  }
  
  return enhancedTools;
}

// 本地运行
if (import.meta.url === `file://${process.argv[1]}`) {
  exportEnhancedData();
}

export { mergeContent, exportEnhancedData };