-- 快速创建表 (复制此全部到 SQL Editor 执行)
-- https://supabase.com/dashboard/project/huwwsvgqxqrbawkzdqxq/sql

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

CREATE TABLE IF NOT EXISTS scenes (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  icon TEXT,
  description TEXT,
  tags TEXT[],
  heat DECIMAL(5,1) DEFAULT 50
);

INSERT INTO scenes (id, name, icon, description, tags, heat) VALUES 
('scene_dev', '💻 编程开发', '💻', '编程开发AI工具集', ARRAY['编程', '代码'], 95),
('scene_office', '📊 办公提效', '📊', '办公提效AI工具集', ARRAY['办公'], 90),
('scene_video', '🎬 视频创作', '🎬', '视频创作AI工具集', ARRAY['视频'], 80)
ON CONFLICT (id) DO NOTHING;

SELECT '完成!' as result;