// 最后尝试 - 通过 Supabase API 直接创建表
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh1d3dzdmdxeHFyYmF3a3pkcXhxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTE5MjEzOSwiZXhwIjoyMDkwNzY4MTM5fQ.0sRtBAV--NJfLl6y57oKjyPHp-pXXm2IeiPJIVFIDUw';

// 通过数据库函数创建表
const createSQL = `
CREATE TABLE IF NOT EXISTS tools (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  logo TEXT,
  description TEXT,
  url TEXT,
  price TEXT,
  difficulty TEXT,
  heat DECIMAL(5,1) DEFAULT 50,
  heatGrowth DECIMAL(5,1) DEFAULT 0,
  tags TEXT[],
  category TEXT
);
`;

const h = { 
  'apikey': key, 
  'Authorization': 'Bearer ' + key, 
  'Content-Type': 'application/json',
  'Prefer': 'params=silent'
};

// 尝试通过 postgrest 创建 - 这个 API 不支持 DDL
// 只能用 SQL Editor

console.log('Cannot create tables via REST API.');
console.log('');
console.log('=== 请手动执行以下步骤 ===');
console.log('');
console.log('1. 打开: https://supabase.com/dashboard/project/huwwsvgqxqrbawkzdqxq/sql');
console.log('');
console.log('2. 复制以下 SQL 并执行:');
console.log('');
console.log('-- 工具表');
console.log('CREATE TABLE IF NOT EXISTS tools (');
console.log('  id TEXT PRIMARY KEY,');
console.log('  name TEXT NOT NULL,');
console.log('  logo TEXT,');
console.log('  description TEXT,');
console.log('  url TEXT,');
console.log('  price TEXT,');
console.log('  difficulty TEXT,');
console.log('  heat DECIMAL(5,1) DEFAULT 50,');
console.log('  heatGrowth DECIMAL(5,1) DEFAULT 0,');
console.log('  tags TEXT[],');
console.log('  category TEXT');
console.log(');');
console.log('');
console.log('-- 场景表');
console.log('CREATE TABLE IF NOT EXISTS scenes (');
console.log('  id TEXT PRIMARY KEY,');
console.log('  name TEXT NOT NULL,');
console.log('  icon TEXT,');
console.log('  description TEXT,');
console.log('  tags TEXT[],');
console.log('  tool_count INTEGER DEFAULT 0,');
console.log('  skill_count INTEGER DEFAULT 0,');
console.log('  heat DECIMAL(5,1) DEFAULT 50');
console.log(');');
console.log('');
console.log('-- 插入场景数据');
console.log("INSERT INTO scenes (id, name, icon, description, tags, tool_count, skill_count, heat) VALUES ('scene_dev', '💻 编程开发', '💻', '编程开发AI工具集', ARRAY['编程', '代码'], 10, 5, 95) ON CONFLICT (id) DO NOTHING;");
console.log('');
console.log('执行完成后告诉我，我立即导入数据！');