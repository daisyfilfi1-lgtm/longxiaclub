#!/usr/bin/env ts-node
import { createClient } from '@supabase/supabase-js';
import { tools } from '../data/tools';

const supabase = createClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_KEY || ''
);

async function syncTools() {
  console.log('📦 同步 tools 表...\n');
  
  let success = 0;
  let failed = 0;
  
  for (const tool of tools) {
    try {
      const { error } = await supabase.from('tools').insert({
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
        },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
      
      if (error) {
        console.log(`  ❌ ${tool.id}: ${error.message}`);
        failed++;
      } else {
        console.log(`  ✅ ${tool.id}`);
        success++;
      }
    } catch (error: any) {
      console.log(`  ❌ ${tool.id}: ${error.message}`);
      failed++;
    }
  }
  
  console.log(`\n完成: ${success} 成功, ${failed} 失败`);
}

syncTools();
