// 创建表 - 直接发送 SQL 给 Supabase
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh1d3dzdmdxeHFyYmF3a3pkcXhxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTE5MjEzOSwiZXhwIjoyMDkwNzY4MTM5fQ.0sRtBAV--NJfLl6y57oKjyPHp-pXXm2IeiPJIVFIDUw';

// 直接通过 REST 尝试 - 不行 DDL
// 使用 API 端点创建表

// 方案：通过 pg_dump 风格的 API
// 或者直接用 Node.js + pg 客户端 - 但需要额外安装

console.log('=== 极简创建表步骤 ===');
console.log('');
console.log('1. 打开: https://supabase.com/dashboard/project/huwwsvgqxqrbawkzdqxq/editor');
console.log('');
console.log('2. 点击 "New Table"');
console.log('   Table name: tools');
console.log('');
console.log('3. 添加列:');
console.log('   - id (text, primary key)');
console.log('   - name (text)');
console.log('   - logo (text)');  
console.log('   - description (text)');
console.log('   - url (text)');
console.log('   - price (text)');
console.log('   - difficulty (text)');
console.log('   - heat (numeric)');
console.log('   - heatGrowth (numeric)');
console.log('   - tags (text[])');
console.log('   - category (text)');
console.log('');
console.log('4. 点击 "Save"');
console.log('');
console.log('5. 同样方式创建 scenes 表');
console.log('');
console.log('完成后告诉我！');