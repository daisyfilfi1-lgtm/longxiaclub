// 测试 Supabase 连接
const SUPABASE_URL = 'https://huwwsvgqxqrbawkzdqxq.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh1d3dzdmdxeHFyYmF3a3pkcXhxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTE5MjEzOSwiZXhwIjoyMDkwNzY4MTM5fQ.0sRtBAV--NJfLl6y57oKjyPHp-pXXm2IeiPJIVFIDUw';

async function test() {
  // 测试表是否存在
  const tables = ['tools', 'skills', 'scenes'];
  
  for (const table of tables) {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?select=count&limit=1`, {
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
      },
    });
    console.log(`${table}: ${res.status} ${res.statusText}`);
    if (res.status !== 200) {
      const err = await res.text();
      console.log(`  Error: ${err}`);
    }
  }
}

test().catch(console.error);