#!/usr/bin/env ts-node
/**
 * 数据库备份工具
 * 功能：备份 Supabase 数据到本地 JSON 文件
 * 
 * 使用方式：
 *   npx ts-node scripts/backup-database.ts [--output=./backups]
 */

import { createClient } from '@supabase/supabase-js';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';

const SUPABASE_URL = process.env.SUPABASE_URL || '';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY || '';

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('❌ 错误: 请设置 SUPABASE_URL 和 SUPABASE_SERVICE_KEY 环境变量');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

interface BackupOptions {
  outputDir: string;
}

class DatabaseBackup {
  private options: BackupOptions;

  constructor(options: BackupOptions) {
    this.options = options;
  }

  async backup(): Promise<void> {
    console.log('\n💾 数据库备份工具\n');
    
    // 创建备份目录
    if (!existsSync(this.options.outputDir)) {
      mkdirSync(this.options.outputDir, { recursive: true });
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupDir = join(this.options.outputDir, `backup-${timestamp}`);
    mkdirSync(backupDir, { recursive: true });

    console.log(`备份目录: ${backupDir}\n`);

    // 备份各表
    await this.backupTable('tools', backupDir);
    await this.backupTable('skills', backupDir);
    await this.backupTable('scenes', backupDir);
    await this.backupTable('user_profiles', backupDir);
    await this.backupTable('user_favorites', backupDir);
    await this.backupTable('analytics', backupDir);

    // 创建备份信息文件
    const info = {
      timestamp: new Date().toISOString(),
      supabase_url: SUPABASE_URL,
      tables: ['tools', 'skills', 'scenes', 'user_profiles', 'user_favorites', 'analytics']
    };
    
    writeFileSync(
      join(backupDir, 'backup-info.json'),
      JSON.stringify(info, null, 2)
    );

    console.log('\n✅ 备份完成\n');
  }

  private async backupTable(tableName: string, backupDir: string): Promise<void> {
    try {
      console.log(`  📦 备份表: ${tableName}...`);
      
      const { data, error, count } = await supabase
        .from(tableName)
        .select('*', { count: 'exact' });

      if (error) {
        if (error.message.includes('does not exist')) {
          console.log(`     ⚠️ 表不存在，跳过`);
          return;
        }
        throw error;
      }

      const filePath = join(backupDir, `${tableName}.json`);
      writeFileSync(filePath, JSON.stringify(data || [], null, 2));
      
      console.log(`     ✅ ${data?.length || 0} 条记录`);
    } catch (error: any) {
      console.error(`     ❌ 错误: ${error.message}`);
    }
  }
}

// 解析命令行参数
function parseArgs(): BackupOptions {
  const args = process.argv.slice(2);
  const outputArg = args.find(arg => arg.startsWith('--output='));
  
  return {
    outputDir: outputArg ? outputArg.split('=')[1] : './backups'
  };
}

const options = parseArgs();
const backup = new DatabaseBackup(options);

backup.backup().catch(error => {
  console.error('\n❌ 备份失败:', error);
  process.exit(1);
});
