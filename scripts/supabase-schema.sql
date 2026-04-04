-- AI导航站数据库 schema (Supabase)
-- 运行方式: 在 Supabase SQL Editor 中执行

-- ==================== 工具表 ====================
CREATE TABLE tools (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  logo TEXT,
  description TEXT,
  url TEXT,
  price TEXT, -- 'free', 'freemium', 'paid'
  difficulty TEXT, -- 'beginner', 'intermediate', 'advanced'
  heat DECIMAL(5,1) DEFAULT 50,
  heatGrowth DECIMAL(5,1) DEFAULT 0,
  tags TEXT[], -- 标签数组
  tech_tags TEXT[], -- 技术标签
  scene_tags TEXT[], -- 场景标签
  cost_tags TEXT[], -- 成本标签
  category TEXT,
  prompts JSONB, -- Prompt模板数组
  tips TEXT[], -- 使用技巧
  related_skills TEXT[], -- 关联的Skill ID
  xhs_saves INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==================== Skill表 ====================
CREATE TABLE skills (
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
  price TEXT, -- 'free', 'member', 'paid'
  compatibility TEXT[], -- 支持的平台
  workflow JSONB, -- 工作流步骤
  dependencies JSONB, -- 依赖工具
  input TEXT,
  output TEXT,
  icon TEXT,
  heat DECIMAL(5,1) DEFAULT 50,
  heatGrowth DECIMAL(5,1) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==================== 场景表 ====================
CREATE TABLE scenes (
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

-- ==================== 每日榜单历史 ====================
CREATE TABLE leaderboard_history (
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

-- ==================== 用户收藏 ====================
CREATE TABLE favorites (
  id SERIAL PRIMARY KEY,
  user_id TEXT NOT NULL, -- 简化的用户ID (实际应该用 auth.users)
  item_id TEXT NOT NULL,
  item_type TEXT NOT NULL, -- 'tool', 'skill'
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, item_id, item_type)
);

-- ==================== 索引 ====================
CREATE INDEX idx_tools_heat ON tools(heat DESC);
CREATE INDEX idx_tools_category ON tools(category);
CREATE INDEX idx_tools_scene_tags ON tools USING GIN(scene_tags);
CREATE INDEX idx_skills_heat ON skills(heat DESC);
CREATE INDEX idx_skills_category ON skills(category);
CREATE INDEX idx_skills_install_count ON skills(install_count DESC);
CREATE INDEX idx_leaderboard_date ON leaderboard_history(date);
CREATE INDEX idx_favorites_user ON favorites(user_id);

-- ==================== RLS 策略 ====================
ALTER TABLE tools ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE scenes ENABLE ROW LEVEL SECURITY;
ALTER TABLE leaderboard_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

-- 公开读取
CREATE POLICY "Public read tools" ON tools FOR SELECT USING (true);
CREATE POLICY "Public read skills" ON skills FOR SELECT USING (true);
CREATE POLICY "Public read scenes" ON scenes FOR SELECT USING (true);
CREATE POLICY "Public read leaderboard" ON leaderboard_history FOR SELECT USING (true);

-- 需要认证的操作
CREATE POLICY "Authenticated insert favorites" ON favorites FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated delete favorites" ON favorites FOR DELETE USING (auth.role() = 'authenticated');

-- ==================== 初始化数据函数 ====================
CREATE OR REPLACE FUNCTION init_sample_data()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  -- 插入示例场景
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
END;
$$;

-- 执行初始化
SELECT init_sample_data();

-- 创建更新热度的函数
CREATE OR REPLACE FUNCTION update_tool_heat(tool_id TEXT, new_heat DECIMAL, new_growth DECIMAL)
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE tools 
  SET heat = new_heat, heatGrowth = new_growth, updated_at = NOW()
  WHERE id = tool_id;
END;
$$;

-- 创建每日更新历史记录函数
CREATE OR REPLACE FUNCTION record_daily_stats(p_date DATE)
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  -- 记录工具热度
  INSERT INTO leaderboard_history (date, tool_id, heat, heat_growth)
  SELECT p_date, id, heat, heatGrowth FROM tools
  ON CONFLICT (date, tool_id, skill_id) DO UPDATE
  SET heat = EXCLUDED.heat, heat_growth = EXCLUDED.heat_growth;
  
  -- 记录Skill安装量
  INSERT INTO leaderboard_history (date, skill_id, install_count, success_rate)
  SELECT p_date, id, install_count, success_rate FROM skills
  ON CONFLICT (date, tool_id, skill_id) DO UPDATE
  SET install_count = EXCLUDED.install_count, success_rate = EXCLUDED.success_rate;
END;
$$;

-- 创建获取今日榜单的函数
CREATE OR REPLACE FUNCTION get_today_leaderboard(p_type TEXT DEFAULT 'tools')
RETURNS TABLE(
  id TEXT,
  name TEXT,
  logo TEXT,
  heat DECIMAL(5,1),
  heat_growth DECIMAL(5,1),
  category TEXT,
  description TEXT
)
LANGUAGE plpgsql
AS $$
BEGIN
  IF p_type = 'skills' THEN
    RETURN QUERY 
    SELECT s.id, s.name, s.icon::TEXT, s.heat, s.heatGrowth, s.category, s.description
    FROM skills s ORDER BY s.heat DESC LIMIT 20;
  ELSE
    RETURN QUERY 
    SELECT t.id, t.name, t.logo::TEXT, t.heat, t.heatGrowth, t.category, t.description
    FROM tools t ORDER BY t.heat DESC LIMIT 20;
  END IF;
END;
$$;

SELECT '✅ 数据库初始化完成!' as result;
