import { NextResponse } from 'next/server';
import type { Skill } from '@/types';
import { getSkillsFromSupabase } from '@/lib/supabase';
import { skills as localSkills } from '@/data/tools';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

// 读取热度数据
function getHeatScores() {
  try {
    const heatScoresFile = path.join(process.cwd(), 'data', 'skill-heat-scores.json');
    if (fs.existsSync(heatScoresFile)) {
      const data = fs.readFileSync(heatScoresFile, 'utf8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error reading heat scores:', error);
  }
  return null;
}

// 增强技能数据
function enhanceSkillsWithHeat(skills: Skill[]) {
  const heatData = getHeatScores();
  if (!heatData || !heatData.skills) return skills;

  return skills.map(skill => {
    // 查找匹配的热度数据
    const heatSkill = heatData.skills.find((h: any) => 
      h.name.toLowerCase().includes(skill.name.toLowerCase()) ||
      skill.name.toLowerCase().includes(h.name.toLowerCase())
    );

    if (heatSkill) {
      // 更新热度相关字段
      return {
        ...skill,
        heat: heatSkill.total_heat || skill.heat || 0,
        heatGrowth: heatSkill.github_heat || skill.heatGrowth || 0,
        githubStars: heatSkill.stars || 0,
        githubForks: heatSkill.forks || 0
      };
    }
    return skill;
  });
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category') || undefined;
  const limit = parseInt(searchParams.get('limit') || '100');
  const source = searchParams.get('source') || 'auto'; // auto | local | supabase
  const sortBy = searchParams.get('sortBy') || 'hot'; // hot | install | rating
  const search = searchParams.get('search') || undefined;
  
  try {
    // 如果指定了 supabase，尝试从 Supabase 获取
    if (source === 'supabase') {
      const skills = await getSkillsFromSupabase({ category, limit });
      if (skills.length > 0) {
        const enhancedSkills = enhanceSkillsWithHeat(skills);
        return NextResponse.json({ data: enhancedSkills, success: true, source: 'supabase' });
      }
    }
    
    // 如果指定了 local 或 supabase 获取失败，使用本地数据
    if (source === 'local' || source === 'auto') {
      let filteredSkills: Skill[] = [...localSkills];
      
      // 按分类过滤
      if (category) {
        filteredSkills = filteredSkills.filter(s => s.category === category);
      }
      
      // 搜索过滤
      if (search) {
        const searchLower = search.toLowerCase();
        filteredSkills = filteredSkills.filter(s => 
          s.name.toLowerCase().includes(searchLower) ||
          s.description.toLowerCase().includes(searchLower) ||
          s.category.toLowerCase().includes(searchLower)
        );
      }
      
      // 增强数据
      const enhancedSkills = enhanceSkillsWithHeat(filteredSkills);
      
      // 排序
      if (sortBy === 'hot') {
        enhancedSkills.sort((a, b) => (b.heat || 0) - (a.heat || 0));
      } else if (sortBy === 'install') {
        enhancedSkills.sort((a, b) => b.installCount - a.installCount);
      } else if (sortBy === 'rating') {
        enhancedSkills.sort((a, b) => b.rating - a.rating);
      }
      
      return NextResponse.json({ 
        data: enhancedSkills.slice(0, limit), 
        success: true, 
        source: 'local' 
      });
    }
    
    return NextResponse.json({ data: [], success: true });
  } catch (error) {
    console.error('Skills API error:', error);
    // 出错时回退到本地数据
    let fallbackSkills = [...localSkills];
    
    // 简单的搜索和排序回退
    if (search) {
      const searchLower = search.toLowerCase();
      fallbackSkills = fallbackSkills.filter(s => 
        s.name.toLowerCase().includes(searchLower) ||
        s.description.toLowerCase().includes(searchLower)
      );
    }
    
    // 增强数据
    const enhancedSkills = enhanceSkillsWithHeat(fallbackSkills);
    
    if (sortBy === 'hot') {
      enhancedSkills.sort((a, b) => (b.heat || 0) - (a.heat || 0));
    } else if (sortBy === 'install') {
      enhancedSkills.sort((a, b) => b.installCount - a.installCount);
    }
    
    return NextResponse.json({ 
      data: enhancedSkills.slice(0, limit), 
      success: true, 
      source: 'local-fallback' 
    });
  }
}
