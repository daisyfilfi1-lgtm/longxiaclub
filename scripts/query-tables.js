// 查询数据库中的表
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh1d3dzdmdxeHFyYmF3a3pkcXhxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTE5MjEzOSwiZXhwIjoyMDkwNzY4MTM5fQ.0sRtBAV--NJfLl6y57oKjyPHp-pXXm2IeiPJIVFIDUw';
const h = { 'apikey': key, 'Authorization': 'Bearer ' + key };

(async () => {
  // Try to query information_schema
  const r = await fetch('https://huwwsvgqxqrbawkzdqxq.supabase.co/rest/v1/information_schema.tables?schema=eq.public', { headers: h });
  console.log('Status:', r.status);
  const d = await r.text();
  console.log('Data:', d.substring(0, 1000));
})();