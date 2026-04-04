import { NextResponse } from 'next/server';
import { getToolsFromSupabase, getSkillsFromSupabase } from '@/lib/supabase';
import { tools as localTools, skills as localSkills } from '@/data/tools';
import { withApiCache, apiCacheConfig } from '@/lib/api-cache';

export const dynamic = 'force-dynamic';

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
          return NextResponse.json({ 
            data: skills, 
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
      filteredSkills.sort((a, b) => (b.heatGrowth || 0) - (a.heatGrowth || 0));
      return NextResponse.json({ 
        data: filteredSkills.slice(0, limit), 
        success: true, 
        source: 'local' 
      });
    } else {
      let filteredTools = [...localTools];
      if (category) {
        filteredTools = filteredTools.filter(t => t.category === category);
      }
      filteredTools.sort((a, b) => b.heat - a.heat);
      return NextResponse.json({ 
        data: filteredTools.slice(0, limit), 
        success: true, 
        source: 'local' 
      });
    }
  } catch (error) {
    console.error('Leaderboard API error:', error);
    const data = type === 'skills' 
      ? localSkills.slice(0, limit) 
      : localTools.slice(0, limit);
    return NextResponse.json({ 
      data, 
      success: true, 
      source: 'local-fallback' 
    });
  }
}

export const GET = withApiCache(
  handleLeaderboardRequest,
  apiCacheConfig.leaderboard
);
