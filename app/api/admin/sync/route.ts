import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { tools, skills } from '@/data/tools';

const supabase = createClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_KEY || ''
);

export async function POST(request: NextRequest) {
  try {
    const results = { tools: 0, skills: 0 };

    // 同步工具
    for (const tool of tools) {
      const { error } = await supabase.from('tools').upsert({
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
        updated_at: new Date().toISOString()
      });

      if (!error) results.tools++;
    }

    // 同步 Skills
    for (const skill of skills) {
      const { error } = await supabase.from('skills').upsert({
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
        heat_growth: skill.heatGrowth,
        updated_at: new Date().toISOString()
      });

      if (!error) results.skills++;
    }

    return NextResponse.json({
      success: true,
      message: '数据同步完成',
      results
    });

  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
