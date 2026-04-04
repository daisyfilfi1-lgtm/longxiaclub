// 查询数据库中的工具数量
const SUPABASE_URL = 'https://huwwsvgqxqrbawkzdqxq.supabase.co';
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh1d3dzdmdxeHFyYmF3a3pkcXhxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTE5MjEzOSwiZXhwIjoyMDkwNzY4MTM5fQ.0sRtBAV--NJfLl6y57oKjyPHp-pXXm2IeiPJIVFIDUw';

const headers = {
  'apikey': key,
  'Authorization': `Bearer ${key}`,
};

(async () => {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/tools?select=id,name,category,heat&order=heat.desc&limit=10`, { headers });
  const tools = await res.json();
  console.log('Top 10 tools:', JSON.stringify(tools, null, 2));
  
  // 获取总数
  const countRes = await fetch(`${SUPABASE_URL}/rest/v1/tools?select=count`, { headers });
  const countData = await countRes.json();
  console.log('\nTotal count:', countData);
})();