// 测试 Supabase Management API
const headers = {
  'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh1d3dzdmdxeHFyYmF3a3pkcXhxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTE5MjEzOSwiZXhwIjoyMDkwNzY4MTM5fQ.0sRtBAV--NJfLl6y57oKjyPHp-pXXm2IeiPJIVFIDUw',
  'Content-Type': 'application/json',
};

async function test() {
  // 测试 Management API
  const res = await fetch('https://api.supabase.com/v1/projects/huwwsvgqxqrbawkzdqxq', { headers });
  console.log('Management API:', res.status);
  
  if (res.ok) {
    const data = await res.json();
    console.log('Project:', data);
  } else {
    const err = await res.text();
    console.log('Error:', err);
  }
}

test().catch(console.error);