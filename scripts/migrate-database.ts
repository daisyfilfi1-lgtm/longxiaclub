#!/usr/bin/env ts-node
/**
 * 数据库迁移工具
 * 功能：初始化或更新 Supabase 数据库表结构
 * 
 * 使用方式：
 *   npx ts-node scripts/migrate-database.ts [--reset]
 * 
 * 参数：
 *   --reset  重置数据库（删除所有表后重建）
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL || '';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY || '';

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('❌ 错误: 请设置 SUPABASE_URL 和 SUPABASE_SERVICE_KEY 环境变量');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

interface Migration {
  name: string;
  sql: string;
}

const migrations: Migration[] = [
  {
    name: 'create_tools_table',
    sql: `
      CREATE TABLE IF NOT EXISTS tools (
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

      CREATE INDEX IF NOT EXISTS idx_tools_category ON tools(category);
      CREATE INDEX IF NOT EXISTS idx_tools_heat ON tools(heat DESC);
      CREATE INDEX IF NOT EXISTS idx_tools_heat_growth ON tools(heat_growth DESC);
    `
  },
  {
    name: 'create_skills_table',
    sql: `
      CREATE TABLE IF NOT EXISTS skills (
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

      CREATE INDEX IF NOT EXISTS idx_skills_category ON skills(category);
      CREATE INDEX IF NOT EXISTS idx_skills_rating ON skills(rating DESC);
    `
  },
  {
    name: 'create_scenes_table',
    sql: `
      CREATE TABLE IF NOT EXISTS scenes (
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

      CREATE INDEX IF NOT EXISTS idx_scenes_tags ON scenes USING GIN(tags);
    `
  },
  {
    name: 'create_users_table',
    sql: `
      CREATE TABLE IF NOT EXISTS user_profiles (
        id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
        username TEXT UNIQUE,
        avatar_url TEXT,
        preferences JSONB DEFAULT '{}',
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS user_favorites (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
        item_type TEXT CHECK (item_type IN ('tool', 'skill')),
        item_id TEXT NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        UNIQUE(user_id, item_type, item_id)
      );

      CREATE INDEX IF NOT EXISTS idx_favorites_user ON user_favorites(user_id);
      CREATE INDEX IF NOT EXISTS idx_favorites_item ON user_favorites(item_type, item_id);
    `
  },
  {
    name: 'create_analytics_table',
    sql: `
      CREATE TABLE IF NOT EXISTS analytics (
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

      CREATE INDEX IF NOT EXISTS idx_analytics_event ON analytics(event_type);
      CREATE INDEX IF NOT EXISTS idx_analytics_created ON analytics(created_at);
    `
  },
  {
    name: 'create_updated_at_trigger',
    sql: `
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = NOW();
        RETURN NEW;
      END;
      $$ language 'plpgsql';

      DO $$
      BEGIN
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'tools') THEN
          DROP TRIGGER IF EXISTS update_tools_updated_at ON tools;
          CREATE TRIGGER update_tools_updated_at BEFORE UPDATE ON tools
            FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
        END IF;

        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'skills') THEN
          DROP TRIGGER IF EXISTS update_skills_updated_at ON skills;
          CREATE TRIGGER update_skills_updated_at BEFORE UPDATE ON skills
            FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
        END IF;

        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'scenes') THEN
          DROP TRIGGER IF EXISTS update_scenes_updated_at ON scenes;
          CREATE TRIGGER update_scenes_updated_at BEFORE UPDATE ON scenes
            FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
        END IF;
      END $$;
    `
  }
];

class DatabaseMigrator {
  private reset: boolean;

  constructor(reset: boolean = false) {
    this.reset = reset;
  }

  async migrate(): Promise<void> {
    console.log('\n🗄️  数据库迁移工具\n');
    
    if (this.reset) {
      console.log('⚠️  警告: 将重置数据库（删除所有数据）\n');
      await this.resetDatabase();
    }

    console.log('开始执行迁移...\n');

    for (const migration of migrations) {
      await this.executeMigration(migration);
    }

    console.log('\n✅ 所有迁移执行完成\n');
  }

  private async resetDatabase(): Promise<void> {
    const tables = ['user_favorites', 'user_profiles', 'analytics', 'tools', 'skills', 'scenes'];
    
    for (const table of tables) {
      try {
        console.log(`  🗑️  删除表: ${table}`);
        await supabase.rpc('exec_sql', { 
          sql: `DROP TABLE IF EXISTS ${table} CASCADE;` 
        });
      } catch (error) {
        // 表可能不存在，忽略错误
      }
    }
    console.log('');
  }

  private async executeMigration(migration: Migration): Promise<void> {
    try {
      console.log(`  📜 ${migration.name}...`);
      
      // 使用 Supabase 的 SQL 执行功能
      const { error } = await supabase.rpc('exec_sql', { sql: migration.sql });
      
      if (error) {
        // 如果没有 exec_sql 函数，尝试直接执行
        console.log(`     使用替代方法执行...`);
        
        // 分割 SQL 语句并逐个执行
        const statements = migration.sql
          .split(';')
          .map(s => s.trim())
          .filter(s => s.length > 0);

        for (const statement of statements) {
          const { error: stmtError } = await supabase.rpc('exec_sql', { 
            sql: statement + ';' 
          });
          
          if (stmtError && !stmtError.message.includes('does not exist')) {
            throw stmtError;
          }
        }
      }
      
      console.log(`     ✅ 完成`);
    } catch (error: any) {
      console.log(`     ⚠️  ${error.message}`);
      // 某些错误可以忽略（如表已存在）
      if (!error.message.includes('already exists')) {
        console.error(`     详细错误:`, error);
      }
    }
  }
}

// 解析命令行参数
const reset = process.argv.includes('--reset');

const migrator = new DatabaseMigrator(reset);
migrator.migrate().catch(error => {
  console.error('\n❌ 迁移失败:', error);
  process.exit(1);
});
