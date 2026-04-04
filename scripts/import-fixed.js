// 正确解析 tools.ts
const fs = require('fs');
const content = fs.readFileSync('F:/AI导航/ai-nav/data/tools.ts', 'utf8');

// 提取所有工具
const tools = [];

function extractValue(str) {
  str = str.trim();
  if (str.startsWith("'") || str.startsWith('"')) {
    return str.slice(1, -1);
  }
  if (str === 'true') return true;
  if (str === 'false') return false;
  if (str === 'null') return null;
  const num = parseFloat(str);
  if (!isNaN(num)) return num;
  return str;
}

// 方法: 找到所有 "id: 'xxx'" 位置，然后向前找到对应的 { 向后找到 }
const idRegex = /id:\s*['"](\w+)['"]/g;
let match;

while ((match = idRegex.exec(content)) !== null) {
  const id = match[1];
  
  // 找到这个 id 对应的完整对象
  const startPos = content.lastIndexOf('{', match.index);
  let braceCount = 0;
  let endPos = startPos;
  
  for (let i = startPos; i < content.length; i++) {
    if (content[i] === '{') braceCount++;
    if (content[i] === '}') braceCount--;
    if (braceCount === 0 && i > match.index) {
      endPos = i + 1;
      break;
    }
  }
  
  const toolBlock = content.substring(startPos, endPos);
  
  const tool = { id };
  
  // 提取字段
  const fields = ['name', 'logo', 'description', 'url', 'price', 'difficulty', 'heat', 'heatGrowth', 'tags', 'category'];
  
  for (const field of fields) {
    const fieldRegex = new RegExp(`${field}:\\s*([^,\\n}]+)`);
    const fieldMatch = toolBlock.match(fieldRegex);
    if (fieldMatch) {
      tool[field] = extractValue(fieldMatch[1]);
    }
  }
  
  if (tool.name) {
    tools.push(tool);
  }
}

console.log(`解析到 ${tools.length} 个工具`);
console.log('前3个:', JSON.stringify(tools.slice(0, 3), null, 2));

// 导入到 Supabase
const SUPABASE_URL = 'https://huwwsvgqxqrbawkzdqxq.supabase.co';
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh1d3dzdmdxeHFyYmF3a3pkcXhxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTE5MjEzOSwiZXhwIjoyMDkwNzY4MTM5fQ.0sRtBAV--NJfLl6y57oKjyPHp-pXXm2IeiPJIVFIDUw';

const headers = {
  'apikey': key,
  'Authorization': `Bearer ${key}`,
  'Content-Type': 'application/json',
};

async function importTools() {
  console.log('\n开始导入...');
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
    } else {
      failed++;
      const err = await res.text();
      if (failed <= 3) console.log(`✗ ${tool.id}: ${err.substring(0, 100)}`);
    }
  }
  
  console.log(`\n✅ 完成! 成功: ${success}, 失败: ${failed}`);
}

importTools();