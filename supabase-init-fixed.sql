-- ============================================================
-- AI导航站 - Supabase 数据库初始化脚本（修复版）
-- ============================================================

-- 先删除可能已存在但不完整的表（谨慎使用）
DROP TABLE IF EXISTS analytics CASCADE;
DROP TABLE IF EXISTS user_favorites CASCADE;
DROP TABLE IF EXISTS user_profiles CASCADE;
DROP TABLE IF EXISTS scenes CASCADE;
DROP TABLE IF EXISTS skills CASCADE;
DROP TABLE IF EXISTS tools CASCADE;

-- 删除触发器函数（如果存在）
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;

-- 1. 创建 tools 表
CREATE TABLE tools (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    logo TEXT,
    description TEXT,
    url TEXT,
    price TEXT CHECK (price IN ('free', 'freemium', 'paid', 'enterprise')),
    difficulty TEXT CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
    heat NUMERIC DEFAULT 0,
    heat_growth NUMERIC DEFAULT 0,
    tags TEXT[] DEFAULT '{}',
    tech_tags TEXT[] DEFAULT '{}',
    scene_tags TEXT[] DEFAULT '{}',
    cost_tags TEXT[] DEFAULT '{}',
    category TEXT,
    prompts JSONB DEFAULT '[]',
    tips TEXT[] DEFAULT '{}',
    related_skills TEXT[] DEFAULT '{}',
    xhs_saves INTEGER DEFAULT 0,
    data JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tools 表索引
CREATE INDEX idx_tools_category ON tools(category);
CREATE INDEX idx_tools_heat ON tools(heat DESC);
CREATE INDEX idx_tools_heat_growth ON tools(heat_growth DESC);

-- 2. 创建 skills 表
CREATE TABLE skills (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    category TEXT,
    difficulty TEXT CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
    author TEXT DEFAULT 'AI导航站',
    version TEXT DEFAULT '1.0.0',
    install_count INTEGER DEFAULT 0,
    success_rate INTEGER DEFAULT 90,
    rating NUMERIC DEFAULT 4.5,
    price TEXT,
    compatibility TEXT[] DEFAULT '{}',
    workflow JSONB DEFAULT '[]',
    dependencies JSONB DEFAULT '[]',
    input TEXT,
    output TEXT,
    icon TEXT,
    heat_growth NUMERIC DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Skills 表索引
CREATE INDEX idx_skills_category ON skills(category);
CREATE INDEX idx_skills_rating ON skills(rating DESC);

-- 3. 创建 scenes 表
CREATE TABLE scenes (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    icon TEXT,
    description TEXT,
    cover_image TEXT,
    tool_count INTEGER DEFAULT 0,
    skill_count INTEGER DEFAULT 0,
    xhs_saves INTEGER DEFAULT 0,
    tags TEXT[] DEFAULT '{}',
    solutions JSONB DEFAULT '[]',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Scenes 表索引
CREATE INDEX idx_scenes_tags ON scenes USING GIN(tags);

-- 4. 创建用户资料表
CREATE TABLE user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username TEXT UNIQUE,
    avatar_url TEXT,
    preferences JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. 创建用户收藏表
CREATE TABLE user_favorites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    item_type TEXT CHECK (item_type IN ('tool', 'skill')),
    item_id TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, item_type, item_id)
);

-- 收藏表索引
CREATE INDEX idx_favorites_user ON user_favorites(user_id);
CREATE INDEX idx_favorites_item ON user_favorites(item_type, item_id);

-- 6. 创建分析数据表
CREATE TABLE analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_type TEXT NOT NULL,
    event_data JSONB DEFAULT '{}',
    user_id UUID,
    session_id TEXT,
    page_path TEXT,
    user_agent TEXT,
    ip_address INET,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 分析表索引
CREATE INDEX idx_analytics_event ON analytics(event_type);
CREATE INDEX idx_analytics_created ON analytics(created_at);

-- 7. 创建自动更新触发器函数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 8. 为各表添加自动更新触发器
CREATE TRIGGER update_tools_updated_at 
    BEFORE UPDATE ON tools 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_skills_updated_at 
    BEFORE UPDATE ON skills 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_scenes_updated_at 
    BEFORE UPDATE ON scenes 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_profiles_updated_at 
    BEFORE UPDATE ON user_profiles 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- 完成提示
SELECT '✅ 所有表创建完成！' as status;
