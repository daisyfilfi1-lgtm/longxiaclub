import { NextResponse } from 'next/server';
import { getToolsFromSupabase, getSkillsFromSupabase } from '@/lib/supabase';
import { tools as localTools, skills as localSkills } from '@/data/tools';
import { withApiCache, apiCacheConfig } from '@/lib/api-cache';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

// 读取综合热度数据
function getComprehensiveHeat() {
  try {
    const filePath = path.join(process.cwd(), 'data', 'leaderboard-data.json');
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error reading comprehensive heat:', error);
  }
  return null;
}

// 读取各数据源
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

// 增强工具数据（综合多数据源）
function enhanceToolsWithHeat(tools: any[]) {
  const comprehensiveData = getComprehensiveHeat();
  if (!comprehensiveData || !comprehensiveData.leaderboard) return tools;

  const heatMap: Record<string, any> = {};
  comprehensiveData.leaderboard.forEach((item: any) => {
    heatMap[item.keyword.toLowerCase()] = item;
  });

  return tools.map(tool => {
    const toolName = tool.name.toLowerCase();
    const heatData = heatMap[toolName] || 
                     Object.values(heatMap).find((h: any) => 
                       h.keyword.toLowerCase().includes(toolName) ||
                       toolName.includes(h.keyword.toLowerCase())
                     );

    if (heatData) {
      return {
        ...tool,
        heat: heatData.total_heat || tool.heat || 0,
        heatGrowth: heatData.growth || tool.heatGrowth || 0,
        githubStars: heatData.github_heat || 0,
        phScore: heatData.ph_heat || 0,
        trendsScore: heatData.trends_heat || 0,
        sources: {
          github: heatData.github_heat > 0,
          productHunt: heatData.ph_heat > 0,
          googleTrends: heatData.trends_heat > 0
        }
      };
    }
    return tool;
  });
}

// 增强技能数据
function enhanceSkillsWithHeat(skills: any[]) {
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

async function handleLeaderboardRequest(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type') || 'tools';
  const limit = parseInt(searchParams.get('limit') || '20');
  const category = searchParams.get('category') || undefined;
  const source = searchParams.get('source') || 'auto';
  
  try {
    // 尝试从 Supabase 获取
    if (source === 'supabase' || source === 'auto') {
      if (type === 'skills') {
        const skills = await getSkillsFromSupabase({ category, limit });
        if (skills.length > 0) {
          const enhancedSkills = enhanceSkillsWithHeat(skills);
          // 按热度排序
          enhancedSkills.sort((a: any, b: any) => (b.heat || 0) - (a.heat || 0));
          return NextResponse.json({ 
            data: enhancedSkills, 
            success: true, 
            source: 'supabase' 
          });
        }
      } else {
        const tools = await getToolsFromSupabase({ category, limit, orderBy: 'heat' });
        if (tools.length > 0) {
          return NextResponse.json({ 
            data: tools, 
            success: true, 
            source: 'supabase' 
          });
        }
      }
    }
    
    // 本地数据回退
    if (type === 'skills') {
      let filteredSkills = [...localSkills];
      if (category) {
        filteredSkills = filteredSkills.filter(s => s.category === category);
      }
      // 增强数据
      const enhancedSkills = enhanceSkillsWithHeat(filteredSkills);
      // 按热度排序
      enhancedSkills.sort((a: any, b: any) => (b.heat || 0) - (a.heat || 0));
      return NextResponse.json({ 
        data: enhancedSkills.slice(0, limit), 
        success: true, 
        source: 'local' 
      });
    } else {
      let filteredTools = [...localTools];
      if (category) {
        filteredTools = filteredTools.filter(t => t.category === category);
      }
      // 增强工具数据（多数据源）
      const enhancedTools = enhanceToolsWithHeat(filteredTools);
      enhancedTools.sort((a: any, b: any) => (b.heat || 0) - (a.heat || 0));
      return NextResponse.json({ 
        data: enhancedTools.slice(0, limit), 
        success: true, 
        source: 'local' 
      });
    }
  } catch (error) {
    console.error('Leaderboard API error:', error);
    let data = type === 'skills' ? [...localSkills] : [...localTools];
    if (type === 'skills') {
      // 增强技能数据
      data = enhanceSkillsWithHeat(data);
      // 按热度排序
      data.sort((a: any, b: any) => (b.heat || 0) - (a.heat || 0));
    } else {
      // 增强工具数据（多数据源）
      data = enhanceToolsWithHeat(data);
      data.sort((a: any, b: any) => (b.heat || 0) - (a.heat || 0));
    }
    return NextResponse.json({ 
      data: data.slice(0, limit), 
      success: true, 
      source: 'local-fallback' 
    });
  }
}

export const GET = withApiCache(
  handleLeaderboardRequest,
  apiCacheConfig.leaderboard
);
