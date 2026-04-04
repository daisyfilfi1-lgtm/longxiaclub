// 修正 tags 数组格式
const fs = require('fs');
const content = fs.readFileSync('F:/AI导航/ai-nav/data/tools.ts', 'utf8');

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

const idRegex = /id:\s*['"](\w+)['"]/g;
let match;

while ((match = idRegex.exec(content)) !== null) {
  const id = match[1];
  
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
  
  // 基础字段
  const fields = ['name', 'logo', 'description', 'url', 'price', 'difficulty', 'heat', 'category'];
  
  for (const field of fields) {
    const fieldRegex = new RegExp(`${field}:\\s*([^,\\n}]+)`);
    const fieldMatch = toolBlock.match(fieldRegex);
    if (fieldMatch) {
      tool[field] = extractValue(fieldMatch[1]);
    }
  }
  
  // tags 需要特殊处理 - 转为数组
  const tagsMatch = toolBlock.match(/tags:\s*\[([^\]]+)\]/);
  if (tagsMatch) {
    const tagsStr = tagsMatch[1];
    const tagMatches = tagsStr.match(/['"]([^'"]+)['"]/g);
    if (tagMatches) {
      tool.tags = tagMatches.map(t => t.replace(/['"]/g, ''));
    }
  }
  
  if (tool.name) {
    tools.push(tool);
  }
}

console.log(`解析到 ${tools.length} 个工具`);

const SUPABASE_URL = 'https://huwwsvgqxqrbawkzdqxq.supabase.co';
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh1d3dzdmdxeHFyYmF3a3pkcXhxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTE5MjEzOSwiZXhwIjoyMDkwNzY4MTM5fQ.0sRtBAV--NJfLl6y57oKjyPHp-pXXm2IeiPJIVFIDUw';

const headers = {
  'apikey': key,
  'Authorization': `Bearer ${key}`,
  'Content-Type': 'application/json',
};

async function importTools() {
  console.log('开始导入...');
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
      process.stdout.write('.');
    } else {
      failed++;
      const err = await res.text();
      if (failed <= 3) console.log(`\n✗ ${tool.id}: ${err.substring(0, 150)}`);
    }
  }
  
  console.log(`\n✅ 完成! 成功: ${success}, 失败: ${failed}`);
}

importTools();