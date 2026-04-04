// 更健壮的解析器
const fs = require('fs');
const content = fs.readFileSync('F:/AI导航/ai-nav/data/tools.ts', 'utf8');

console.log('File length:', content.length);

// 简单方法: 提取 id 和 name
const idMatches = content.match(/id:\s*['"](\w+)['"]/g);
const nameMatches = content.match(/name:\s*['"]([^'"]+)['"]/g);

console.log('IDs found:', idMatches?.length || 0);
console.log('Names found:', nameMatches?.length || 0);

// 手动解析
const tools = [];
const toolBlocks = content.match(/\{[\s\S]*?id:\s*['"][^'"]+['"][\s\S]*?\}/g) || [];

console.log('Tool blocks:', toolBlocks.length);

for (const block of toolBlocks.slice(0, 3)) {
  console.log('---');
  console.log(block.substring(0, 200));
}