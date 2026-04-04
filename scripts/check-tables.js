// 用 fetch 直接调用 Supabase API
const SUPABASE_URL = 'https://huwwsvgqxqrbawkzdqxq.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh1d3dzdmdxeHFyYmF3a3pkcXhxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTE5MjEzOSwiZXhwIjoyMDkwNzY4MTM5fQ.0sRtBAV--NJfLl6y57oKjyPHp-pXXm2IeiPJIVFIDUw';

const headers = {
  'apikey': SUPABASE_KEY,
  'Authorization': `Bearer ${SUPABASE_KEY}`,
  'Content-Type': 'application/json',
};

// 1. 尝试插入一条记录来"创建"表 - 这不会真正创建表，但可以测试
// 2. 或者查询 schema

async function main() {
  // 检查项目信息
  console.log('Testing connection...');
  
  // 尝试访问 rest/v1/
  const res = await fetch(`${SUPABASE_URL}/rest/v1/`, { headers });
  console.log('Root status:', res.status);
  
  // 尝试获取表列表 (需要用 pg_catalog)
  const pgRes = await fetch(`${SUPABASE_URL}/rest/v1/pg_catalog/pg_tables?schemaname=eq.public`, { headers });
  console.log('Tables status:', pgRes.status);
  if (pgRes.ok) {
    const tables = await pgRes.json();
    console.log('Tables:', JSON.stringify(tables, null, 2));
  } else {
    const err = await pgRes.text();
    console.log('Tables error:', err);
  }
}

main().catch(console.error);