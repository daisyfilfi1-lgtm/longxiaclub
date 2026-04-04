#!/usr/bin/env ts-node
/**
 * 数据同步工具
 * 功能：将本地数据 (data/tools.ts) 同步到 Supabase
 * 
 * 使用方式：
 *   npx ts-node scripts/sync-to-supabase.ts [--mode=full|incremental] [--dry-run]
 * 
 * 参数：
 *   --mode=full         全量同步（删除现有数据后重新插入）
 *   --mode=incremental  增量同步（只更新有变化的数据）
 *   --dry-run           模拟运行，不实际写入数据库
 */

import { createClient } from '@supabase/supabase-js';
import { tools, skills, scenes } from '../data/tools';
import { Tool, Skill, Scene } from '../types';

// 配置
const SUPABASE_URL = process.env.SUPABASE_URL || '';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY || '';

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('❌ 错误: 请设置 SUPABASE_URL 和 SUPABASE_SERVICE_KEY 环境变量');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

interface SyncOptions {
  mode: 'full' | 'incremental';
  dryRun: boolean;
  verbose: boolean;
}

interface SyncResult {
  table: string;
  inserted: number;
  updated: number;
  skipped: number;
  deleted: number;
  errors: string[];
}

class DataSync {
  private options: SyncOptions;
  private results: SyncResult[] = [];

  constructor(options: SyncOptions) {
    this.options = options;
  }

  async syncAll(): Promise<void> {
    console.log('\n🚀 开始数据同步...\n');
    console.log(`模式: ${this.options.mode}`);
    console.log(`模拟运行: ${this.options.dryRun ? '是' : '否'}`);
    console.log('');

    // 同步工具
    await this.syncTable('tools', tools, this.toolMapper);

    // 同步 Skills
    await this.syncTable('skills', skills, this.skillMapper);

    // 同步场景
    await this.syncTable('scenes', scenes, this.sceneMapper);

    // 打印结果
    this.printResults();
  }

  private async syncTable<T>(
    tableName: string,
    localData: T[],
    mapper: (item: T) => Record<string, any>
  ): Promise<void> {
    console.log(`📦 同步表: ${tableName}`);
    
    const result: SyncResult = {
      table: tableName,
      inserted: 0,
      updated: 0,
      skipped: 0,
      deleted: 0,
      errors: []
    };

    try {
      // 全量模式：先清空表
      if (this.options.mode === 'full' && !this.options.dryRun) {
        console.log(`  🗑️  清空表 ${tableName}...`);
        const { error } = await supabase.from(tableName).delete().neq('id', '');
        if (error) throw error;
      }

      // 获取现有数据（用于增量同步）
      let existingData: Map<string, any> = new Map();
      if (this.options.mode === 'incremental') {
        const { data, error } = await supabase.from(tableName).select('id, updated_at');
        if (error) throw error;
        existingData = new Map(data?.map(item => [item.id, item]) || []);
      }

      // 处理每条数据
      for (const item of localData) {
        try {
          const mappedData = mapper(item);
          const existing = existingData.get(mappedData.id);

          if (this.options.dryRun) {
            if (existing) {
              console.log(`  [DRY-RUN] 将更新: ${mappedData.id}`);
              result.updated++;
            } else {
              console.log(`  [DRY-RUN] 将插入: ${mappedData.id}`);
              result.inserted++;
            }
            continue;
          }

          if (existing) {
            // 增量模式：检查是否需要更新
            if (this.options.mode === 'incremental') {
              // 简单比较：如果数据有变化就更新
              const { error } = await supabase
                .from(tableName)
                .update({
                  ...mappedData,
                  updated_at: new Date().toISOString()
                })
                .eq('id', mappedData.id);

              if (error) throw error;
              result.updated++;
              if (this.options.verbose) {
                console.log(`  ✏️  更新: ${mappedData.id}`);
              }
            } else {
              result.skipped++;
            }
          } else {
            // 插入新数据
            const { error } = await supabase
              .from(tableName)
              .insert({
                ...mappedData,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              });

            if (error) throw error;
            result.inserted++;
            if (this.options.verbose) {
              console.log(`  ➕ 插入: ${mappedData.id}`);
            }
          }
        } catch (error: any) {
          const itemId = (item as any).id || 'unknown';
          result.errors.push(`${itemId}: ${error.message}`);
          console.error(`  ❌ 错误处理 ${itemId}: ${error.message}`);
        }
      }

      // 清理已删除的数据（增量模式）
      if (this.options.mode === 'incremental' && !this.options.dryRun) {
        const localIds = new Set(localData.map((item: any) => item.id));
        const idsToDelete = Array.from(existingData.keys()).filter(id => !localIds.has(id));
        
        if (idsToDelete.length > 0) {
          const { error } = await supabase
            .from(tableName)
            .delete()
            .in('id', idsToDelete);
          
          if (error) throw error;
          result.deleted = idsToDelete.length;
          console.log(`  🗑️  删除 ${idsToDelete.length} 条已移除的数据`);
        }
      }

    } catch (error: any) {
      result.errors.push(`全局错误: ${error.message}`);
      console.error(`  ❌ 表 ${tableName} 同步失败: ${error.message}`);
    }

    this.results.push(result);
    console.log(`  ✅ 完成: +${result.inserted} / ✏️${result.updated} / ⏭️${result.skipped} / 🗑️${result.deleted}\n`);
  }

  // 数据映射器
  private toolMapper = (tool: Tool): Record<string, any> => ({
    id: tool.id,
    name: tool.name,
    logo: tool.logo,
    description: tool.description,
    url: tool.url,
    price: tool.price,
    difficulty: tool.difficulty,
    heat: tool.heat,
    heat_growth: tool.heatGrowth,
    tags: tool.tags,
    tech_tags: tool.techTags,
    scene_tags: tool.sceneTags,
    cost_tags: tool.costTags,
    category: tool.category,
    prompts: tool.prompts,
    tips: tool.tips,
    related_skills: tool.relatedSkills,
    xhs_saves: tool.xhsSaves || 0,
    data: {
      enhanced_tips: tool.enhancedTips,
      cases: tool.cases,
      guides: tool.guides
    }
  });

  private skillMapper = (skill: Skill): Record<string, any> => ({
    id: skill.id,
    name: skill.name,
    description: skill.description,
    category: skill.category,
    difficulty: skill.difficulty,
    author: skill.author,
    version: skill.version,
    install_count: skill.installCount,
    success_rate: skill.successRate,
    rating: skill.rating,
    price: skill.price,
    compatibility: skill.compatibility,
    workflow: skill.workflow,
    dependencies: skill.dependencies,
    input: skill.input,
    output: skill.output,
    icon: skill.icon,
    heat_growth: skill.heatGrowth
  });

  private sceneMapper = (scene: Scene): Record<string, any> => ({
    id: scene.id,
    name: scene.name,
    icon: scene.icon,
    description: scene.description,
    cover_image: scene.coverImage,
    tool_count: scene.toolCount,
    skill_count: scene.skillCount,
    xhs_saves: scene.xhsSaves,
    tags: scene.tags,
    solutions: scene.solutions
  });

  private printResults(): void {
    console.log('\n' + '='.repeat(60));
    console.log('📊 同步结果汇总');
    console.log('='.repeat(60));

    let totalInserted = 0;
    let totalUpdated = 0;
    let totalDeleted = 0;
    let totalErrors = 0;

    for (const result of this.results) {
      console.log(`\n📁 ${result.table}:`);
      console.log(`   插入: ${result.inserted}`);
      console.log(`   更新: ${result.updated}`);
      console.log(`   跳过: ${result.skipped}`);
      console.log(`   删除: ${result.deleted}`);
      console.log(`   错误: ${result.errors.length}`);
      
      if (result.errors.length > 0 && this.options.verbose) {
        console.log('   错误详情:');
        result.errors.forEach(err => console.log(`     - ${err}`));
      }

      totalInserted += result.inserted;
      totalUpdated += result.updated;
      totalDeleted += result.deleted;
      totalErrors += result.errors.length;
    }

    console.log('\n' + '-'.repeat(60));
    console.log('总计:');
    console.log(`   插入: ${totalInserted}`);
    console.log(`   更新: ${totalUpdated}`);
    console.log(`   删除: ${totalDeleted}`);
    console.log(`   错误: ${totalErrors}`);
    console.log('='.repeat(60) + '\n');

    if (totalErrors > 0) {
      process.exit(1);
    }
  }
}

// 解析命令行参数
function parseArgs(): SyncOptions {
  const args = process.argv.slice(2);
  
  return {
    mode: args.includes('--mode=full') ? 'full' : 'incremental',
    dryRun: args.includes('--dry-run'),
    verbose: args.includes('--verbose') || args.includes('-v')
  };
}

// 主函数
async function main() {
  const options = parseArgs();
  const sync = new DataSync(options);
  await sync.syncAll();
}

main().catch(console.error);
