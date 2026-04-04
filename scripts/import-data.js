/**
 * 完整初始化脚本 - 一旦表创建完成，运行此脚本导入数据
 */
const SUPABASE_URL = 'https://huwwsvgqxqrbawkzdqxq.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh1d3dzdmdxeHFyYmF3a3pkcXhxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTE5MjEzOSwiZXhwIjoyMDkwNzY4MTM5fQ.0sRtBAV--NJfLl6y57oKjyPHp-pXXm2IeiPJIVFIDUw';

const fs = require('fs');
const path = require('path');

const headers = {
  'apikey': SUPABASE_KEY,
  'Authorization': `Bearer ${SUPABASE_KEY}`,
  'Content-Type': 'application/json',
  'Prefer': 'return=representation',
};

// 解析 tools.ts
function parseToolsTS() {
  const content = fs.readFileSync(path.join(__dirname, '..', 'data', 'tools.ts'), 'utf8');
  const lines = content.split(/\r?\n/);
  const tools = [];
  
  let inToolsArray = false;
  let currentTool = {};
  let braceCount = 0;
  let currentKey = '';
  let buffer = '';
  let inString = false;
  let stringChar = '';
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    if (line.includes('export const tools: Tool[]')) {
      inToolsArray = true;
      continue;
    }
    
    if (!inToolsArray) continue;
    
    // 追踪大括号
    for (let j = 0; j < line.length; j++) {
      const char = line[j];
      
      if ((char === '"' || char === "'") && line.substring(j-1, j) !== '\\') {
        if (!inString) {
          inString = true;
          stringChar = char;
        } else if (char === stringChar) {
          inString = false;
          stringChar = '';
        }
        buffer += char;
      } else if (!inString) {
        if (char === '{') {
          braceCount++;
          if (braceCount === 1) {
            currentTool = {};
          }
          buffer += char;
        } else if (char === '}') {
          braceCount--;
          buffer += char;
          if (braceCount === 0 && Object.keys(currentTool).length > 0) {
            tools.push(currentTool);
            currentTool = {};
          }
        } else if (char === ':' && braceCount === 1) {
          // 找到 key
          const keyMatch = buffer.trim().match(/(\w+)\s*$/);
          if (keyMatch) {
            currentKey = keyMatch[1];
            buffer = '';
          }
        } else if (char === ',' && braceCount === 1 && currentKey) {
          // 值结束
          let value = buffer.trim();
          if (value.startsWith("'") && value.endsWith("'")) {
            value = value.slice(1, -1);
          } else if (value.startsWith('"') && value.endsWith('"')) {
            value = value.slice(1, -1);
          } else if (value === 'true') {
            value = true;
          } else if (value === 'false') {
            value = false;
          } else if (!isNaN(value) && value !== '') {
            value = parseFloat(value);
          }
          currentTool[currentKey] = value;
          currentKey = '';
          buffer = '';
        } else {
          buffer += char;
        }
      } else {
        buffer += char;
      }
    }
  }
  
  return tools;
}

async function importTools() {
  console.log('📥 解析 tools.ts...');
  const tools = parseToolsTS();
  console.log(`   找到 ${tools.length} 个工具`);
  
  // 批量导入 (每批 50 条)
  const batchSize = 50;
  let successCount = 0;
  let errorCount = 0;
  
  for (let i = 0; i < tools.length; i += batchSize) {
    const batch = tools.slice(i, i + batchSize);
    
    const res = await fetch(`${SUPABASE_URL}/rest/v1/tools`, {
      method: 'POST',
      headers,
      body: JSON.stringify(batch),
    });
    
    if (res.ok) {
      successCount += batch.length;
      console.log(`   已导入 ${successCount}/${tools.length}`);
    } else {
      const err = await res.text();
      errorCount += batch.length;
      console.log(`   错误: ${err.substring(0, 100)}`);
    }
  }
  
  console.log(`\n✅ 完成! 成功: ${successCount}, 失败: ${errorCount}`);
}

// 先测试表是否存在
(async () => {
  const testRes = await fetch(`${SUPABASE_URL}/rest/v1/tools?select=count&limit=1`, { headers });
  if (testRes.status === 404) {
    console.log('❌ 表不存在! 请先创建表');
    console.log('\n请在 Supabase SQL Editor 执行:');
    console.log('https://supabase.com/dashboard/project/huwwsvgqxqrbawkzdqxq/sql');
  } else {
    console.log('✅ 表已存在，开始导入...');
    await importTools();
  }
})();