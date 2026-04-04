/**
 * AI导航站 - 直接执行 SQL Schema
 * 运行方式: node scripts/init-db.js
 */

const fs = require('fs');
const path = require('path');

const SUPABASE_URL = 'https://huwwsvgqxqrbawkzdqxq.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh1d3dzdmdxeHFyYmF3a3pkcXhxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTE5MjEzOSwiZXhwIjoyMDkwNzY4MTM5fQ.0sRtBAV--NJfLl6y57oKjyPHp-pXXm2IeiPJIVFIDUw';

const schemaSQL = fs.readFileSync(path.join(__dirname, 'supabase-schema.sql'), 'utf8');

// 分割 SQL 语句并逐个执行
const statements = schemaSQL
  .split(';')
  .map(s => s.trim())
  .filter(s => s.length > 0 && !s.startsWith('--'));

async function execSQL(sql) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
    method: 'POST',
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query: sql }),
  });
  return res.json();
}

async function main() {
  console.log('🚀 开始初始化数据库...');
  
  // 先创建表 (使用 REST API 直接插入)
  const tables = [
    {
      table: 'tools',
      columns: {
        id: 'text',
        name: 'text',
        logo: 'text',
        description: 'text',
        url: 'text',
        price: 'text',
        difficulty: 'text',
        heat: 'numeric',
        heatGrowth: 'numeric',
        tags: 'text[]',
        tech_tags: 'text[]',
        scene_tags: 'text[]',
        cost_tags: 'text[]',
        category: 'text',
        prompts: 'jsonb',
        tips: 'text[]',
        related_skills: 'text[]',
        xhs_saves: 'integer',
        created_at: 'timestamptz',
        updated_at: 'timestamptz',
      },
    },
    {
      table: 'skills',
      columns: {
        id: 'text',
        name: 'text',
        description: 'text',
        category: 'text',
        difficulty: 'text',
        author: 'text',
        version: 'text',
        install_count: 'integer',
        success_rate: 'numeric',
        rating: 'numeric',
        price: 'text',
        compatibility: 'text[]',
        workflow: 'jsonb',
        dependencies: 'jsonb',
        input: 'text',
        output: 'text',
        icon: 'text',
        heat: 'numeric',
        heatGrowth: 'numeric',
        created_at: 'timestamptz',
        updated_at: 'timestamptz',
      },
    },
    {
      table: 'scenes',
      columns: {
        id: 'text',
        name: 'text',
        icon: 'text',
        description: 'text',
        tags: 'text[]',
        tool_count: 'integer',
        skill_count: 'integer',
        xhs_saves: 'integer',
        heat: 'numeric',
        created_at: 'timestamptz',
        updated_at: 'timestamptz',
      },
    },
    {
      table: 'leaderboard_history',
      columns: {
        id: 'serial',
        date: 'date',
        tool_id: 'text',
        skill_id: 'text',
        heat: 'numeric',
        heat_growth: 'numeric',
        install_count: 'integer',
        success_rate: 'numeric',
        created_at: 'timestamptz',
      },
    },
    {
      table: 'favorites',
      columns: {
        id: 'serial',
        user_id: 'text',
        item_id: 'text',
        item_type: 'text',
        created_at: 'timestamptz',
      },
    },
  ];

  // 直接用 SQL 执行创建表
  const createSQL = `
    -- 工具表
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

    -- Skills表
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

    -- 场景表
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

    -- 榜单历史
    CREATE TABLE IF NOT EXISTS leaderboard_history (
      id SERIAL PRIMARY KEY,
      date DATE NOT NULL,
      tool_id TEXT,
      skill_id TEXT,
      heat DECIMAL(5,1),
      heat_growth DECIMAL(5,1),
      install_count INTEGER,
      success_rate DECIMAL(5,2),
      created_at TIMESTAMPTZ DEFAULT NOW(),
      UNIQUE(date, tool_id, skill_id)
    );

    -- 收藏
    CREATE TABLE IF NOT EXISTS favorites (
      id SERIAL PRIMARY KEY,
      user_id TEXT NOT NULL,
      item_id TEXT NOT NULL,
      item_type TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      UNIQUE(user_id, item_id, item_type)
    );

    -- 索引
    CREATE INDEX IF NOT EXISTS idx_tools_heat ON tools(heat DESC);
    CREATE INDEX IF NOT EXISTS idx_tools_category ON tools(category);
    CREATE INDEX IF NOT EXISTS idx_skills_heat ON skills(heat DESC);
    CREATE INDEX IF NOT EXISTS idx_skills_category ON skills(category);
    CREATE INDEX IF NOT EXISTS idx_scenes_heat ON scenes(heat DESC);

    -- 初始化场景数据
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
  `;

  console.log('Creating tables...');
  const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
    method: 'POST',
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=minimal',
    },
    body: JSON.stringify({ query: createSQL }),
  });

  console.log('Response:', response.status, response.statusText);
  
  if (!response.ok) {
    const err = await response.text();
    console.error('Error:', err);
    return;
  }

  console.log('✅ 数据库表创建成功！');
  console.log('接下来运行: node scripts/migrate-to-supabase.js 导入工具数据');
}

main().catch(console.error);