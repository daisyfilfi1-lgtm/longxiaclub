import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://huwwsvgqxqrbawkzdqxq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh1d3dzdmdxeHFyYmF3a3pkcXhxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM3Mjk1NTMsImV4cCI6MjA1OTMwNTU1M30.W1Kk3EFHHcICM-HqCAJeZOO4Qw3Js8rt_nj6gC-RmQTY';

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false },
});

async function test() {
  // 检查 tools 表
  const { data: tools, error: toolsError } = await supabase
    .from('tools')
    .select('id, name')
    .limit(5);
  
  console.log('=== Tools ===');
  if (toolsError) console.error('Error:', toolsError.message, toolsError.code);
  else console.log('Tools:', JSON.stringify(tools));
  console.log('Count:', tools?.length || 0);

  // 检查 skills 表
  const { data: skills, error: skillsError } = await supabase
    .from('skills')
    .select('id, name')
    .limit(5);
  
  console.log('\n=== Skills ===');
  if (skillsError) console.error('Error:', skillsError.message, skillsError.code);
  else console.log('Skills:', JSON.stringify(skills));
  console.log('Count:', skills?.length || 0);
}

test().catch(console.error);
