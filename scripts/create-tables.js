// 创建表和导入数据 - 使用 Supabase Management API
const SUPABASE_URL = 'https://huwwsvgqxqrbawkzdqxq.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh1d3dzdmdxeHFyYmF3a3pkcXhxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTE5MjEzOSwiZXhwIjoyMDkwNzY4MTM5fQ.0sRtBAV--NJfLl6y57oKjyPHp-pXXm2IeiPJIVFIDUw';

const fs = require('fs');
const path = require('path');

// 读取并解析 tools.ts
function parseTools() {
  const content = fs.readFileSync(path.join(__dirname, '..', 'data', 'tools.ts'), 'utf8');
  const tools = [];
  const lines = content.split(/\r?\n/);
  
  let inTool = false;
  let currentTool = {};
  let braceLevel = 0;
  let currentKey = '';
  let inString = false;
  let buffer = '';
  
  for (const line of lines) {
    const trimmed = line.trim();
    
    if (trimmed.startsWith('export const tools')) {
      continue;
    }
    
    if (trimmed === '[' || trimmed === '];') {
      continue;
    }
    
    if (trimmed === '{') {
      inTool = true;
      currentTool = {};
      braceLevel = 1;
      continue;
    }
    
    if (trimmed === '}') {
      braceLevel--;
      if (braceLevel === 0 && inTool) {
        inTool = false;
        if (currentTool.id) {
          tools.push(currentTool);
        }
      }
      continue;
    }
    
    if (inTool) {
      // 解析 key: value
      const match = trimmed.match(/^(\w+):\s*(.+?)(?:,\s*)?$/);
      if (match) {
        const [, key, val] = match;
        let value = val.trim();
        
        if (value.startsWith("'") || value.startsWith('"')) {
          value = value.slice(1, -1);
        } else if (value === 'true') {
          value = true;
        } else if (value === 'false') {
          value = false;
        } else if (value === 'null') {
          value = null;
        } else if (/^\d+\.?\d*$/.test(value)) {
          value = parseFloat(value);
        }
        
        currentTool[key] = value;
      }
    }
  }
  
  return tools;
}

// 使用 PostgREST 创建表 (通过 SQL 函数)
async function createTables() {
  console.log('Creating tables via SQL...');
  
  // SQL 创建表语句
  const sql = `
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
      tech_tags TEXT[],
      scene_tags TEXT[],
      cost_tags TEXT[],
      category TEXT,
      prompts JSONB,
      tips TEXT[],
      related_skills TEXT[],
      xhs_saves INTEGER DEFAULT 0,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );
    
    CREATE TABLE IF NOT EXISTS skills (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT,
      category TEXT,
      difficulty TEXT,
      author TEXT,
      version TEXT,
      install_count INTEGER DEFAULT 0,
      success_rate DECIMAL(5,2) DEFAULT 90,
      rating DECIMAL(3,1) DEFAULT 4,
      price TEXT,
      compatibility TEXT[],
      workflow JSONB,
      dependencies JSONB,
      input TEXT,
      output TEXT,
      icon TEXT,
      heat DECIMAL(5,1) DEFAULT 50,
      heatGrowth DECIMAL(5,1) DEFAULT 0,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );
    
    CREATE TABLE IF NOT EXISTS scenes (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      icon TEXT,
      description TEXT,
      tags TEXT[],
      tool_count INTEGER DEFAULT 0,
      skill_count INTEGER DEFAULT 0,
      xhs_saves INTEGER DEFAULT 0,
      heat DECIMAL(5,1) DEFAULT 50,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );
    
    CREATE INDEX IF NOT EXISTS idx_tools_heat ON tools(heat DESC);
    CREATE INDEX IF NOT EXISTS idx_tools_category ON tools(category);
    CREATE INDEX IF NOT EXISTS idx_skills_heat ON skills(heat DESC);
    CREATE INDEX IF NOT EXISTS idx_skills_category ON skills(category);
    
    INSERT INTO scenes (id, name, icon, description, tags, tool_count, skill_count, xhs_saves, heat)
    VALUES 
      ('scene_catering', '🍜 餐饮行业', '🍜', '餐饮行业AI工具集', ARRAY['餐饮', '小红书', '本地生活'], 5, 3, 50000, 75),
      ('scene_ecommerce', '🛒 电商运营', '🛒', '电商运营AI工具集', ARRAY['电商', '带货', '淘宝'], 8, 4, 120000, 85),
      ('scene_video', '🎬 视频创作', '🎬', '视频创作AI工具集', ARRAY['视频', '剪辑', '短视频'], 6, 2, 80000, 80),
      ('scene_office', '📊 办公提效', '📊', '办公提效AI工具集', ARRAY['办公', '周报', 'PPT'], 10, 5, 150000, 90),
      ('scene_academic', '📚 学术研究', '📚', '学术研究AI工具集', ARRAY['学术', '论文', '翻译'], 4, 2, 30000, 65),
      ('scene_medical', '🏥 医疗健康', '🏥', '医疗健康AI工具集', ARRAY['医疗', '健康', '问诊'], 3, 1, 25000, 60),
      ('scene_design', '🎨 设计创意', '🎨', '设计创意AI工具集', ARRAY['设计', '插画', '海报'], 5, 2, 45000, 70),
      ('scene_dev', '💻 编程开发', '💻', '编程开发AI工具集', ARRAY['编程', '代码', '开发'], 12, 6, 200000, 95)
    ON CONFLICT (id) DO NOTHING;
  `.trim();

  // 尝试通过 API 执行 - 需要用 management API
  // 这个 key 不支持 direct SQL
  
  console.log('SQL ready but cannot execute directly.');
  console.log('Please run this SQL in Supabase SQL Editor:');
  console.log('---');
  console.log(sql.substring(0, 500) + '...');
}

createTables().catch(console.error);