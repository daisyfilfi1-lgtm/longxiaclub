// 尝试直接插入来创建表
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh1d3dzdmdxeHFyYmF3a3pkcXhxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTE5MjEzOSwiZXhwIjoyMDkwNzY4MTM5fQ.0sRtBAV--NJfLl6y57oKjyPHp-pXXm2IeiPJIVFIDUw';
const h = { 'apikey': key, 'Authorization': 'Bearer ' + key, 'Content-Type': 'application/json' };

(async () => {
  const r = await fetch('https://huwwsvgqxqrbawkzdqxq.supabase.co/rest/v1/tools', {
    method: 'POST',
    headers: h,
    body: JSON.stringify([{ id: 'test', name: 'Test Tool', description: 'Test', heat: 50 }])
  });
  console.log('Insert:', r.status);
  console.log(await r.text());
})();