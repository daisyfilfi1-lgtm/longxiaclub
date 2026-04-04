// 最后尝试 - 使用 remote schema 或 exec_sql RPC
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh1d3dzdmdxeHFyYmF3a3pkcXhxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTE5MjEzOSwiZXhwIjoyMDkwNzY4MTM5fQ.0sRtBAV--NJfLl6y57oKjyPHp-pXXm2IeiPJIVFIDUw';
const h = { 'apikey': key, 'Authorization': 'Bearer ' + key, 'Content-Type': 'application/json' };

(async () => {
  // 尝试调用 exec_sql 函数
  const r = await fetch('https://huwwsvgqxqrbawkzdqxq.supabase.co/rest/v1/rpc/exec_sql', {
    method: 'POST',
    headers: h,
    body: JSON.stringify({ query: 'SELECT 1' })
  });
  console.log('RPC exec_sql:', r.status);
  const text = await r.text();
  console.log(text.substring(0, 500));
})();