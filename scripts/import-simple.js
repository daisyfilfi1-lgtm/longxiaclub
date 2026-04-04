// 更新表结构并导入数据
const SUPABASE_URL = 'https://huwwsvgqxqrbawkzdqxq.supabase.co';
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh1d3dzdmdxeHFyYmF3a3pkcXhxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTE5MjEzOSwiZXhwIjoyMDkwNzY4MTM5fQ.0sRtBAV--NJfLl6y57oKjyPHp-pXXm2IeiPJIVFIDUw';

const headers = {
  'apikey': key,
  'Authorization': `Bearer ${key}`,
  'Content-Type': 'application/json',
  'Prefer': 'return=representation',
};

// 简化版工具数据 - 只用数据库已有的字段
function parseToolsSimple() {
  const fs = require('fs');
  const content = fs.readFileSync('F:/AI导航/ai-nav/data/tools.ts', 'utf8');
  const lines = content.split(/\r?\n/);
  const tools = [];
  
  let inTool = false;
  let currentTool = {};
  let braceLevel = 0;
  
  for (const line of lines) {
    const trimmed = line.trim();
    
    if (trimmed === '{') {
      if (braceLevel === 0) {
        inTool = true;
        currentTool = {};
      }
      braceLevel++;
    } else if (trimmed === '}') {
      braceLevel--;
      if (braceLevel === 0 && inTool) {
        inTool = false;
        if (currentTool.id) {
          tools.push({
            id: currentTool.id,
            name: currentTool.name,
            logo: currentTool.logo,
            description: currentTool.description,
            url: currentTool.url,
            price: currentTool.price,
            difficulty: currentTool.difficulty,
            heat: currentTool.heat,
            heatGrowth: currentTool.heatGrowth,
            tags: currentTool.tags,
            category: currentTool.category,
          });
        }
      }
    } else if (inTool && braceLevel === 1) {
      const match = trimmed.match(/^(\w+):\s*(.+?)(?:,\s*)?$/);
      if (match) {
        const [, k, v] = match;
        let val = v.trim().replace(/,$/, '');
        
        if (val.startsWith("'") || val.startsWith('"')) {
          val = val.slice(1, -1);
        } else if (!isNaN(val) && val !== '') {
          val = parseFloat(val);
        }
        
        currentTool[k] = val;
      }
    }
  }
  
  return tools;
}

async function importData() {
  console.log('解析工具数据...');
  const tools = parseToolsSimple();
  console.log(`找到 ${tools.length} 个工具`);
  
  // 逐条插入
  let success = 0;
  let failed = 0;
  
  for (const tool of tools) {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/tools`, {
      method: 'POST',
      headers,
      body: JSON.stringify([tool]),
    });
    
    if (res.ok) {
      success++;
      console.log(`✓ ${success}/${tools.length}: ${tool.name}`);
    } else {
      failed++;
      const err = await res.text();
      console.log(`✗ ${tool.name}: ${err.substring(0, 50)}`);
    }
  }
  
  console.log(`\n完成! 成功: ${success}, 失败: ${failed}`);
}

importData();