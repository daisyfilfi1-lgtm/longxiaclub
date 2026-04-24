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
    let data: any[] = [];
    let sourceName = '';

    // 尝试从 Supabase 获取（优先）
    if (source === 'supabase' || source === 'auto') {
      if (type === 'skills') {
        const skills = await getSkillsFromSupabase({ category, limit });
        if (skills.length > 0) {
          data = skills;
          data.sort((a: any, b: any) => (b.heat || 0) - (a.heat || 0));
          sourceName = 'supabase';
        }
      } else {
        const tools = await getToolsFromSupabase({ category, limit, orderBy: 'heat' });
        if (tools.length > 0) {
          data = tools;
          data.sort((a: any, b: any) => (b.heat || 0) - (a.heat || 0));
          sourceName = 'supabase';
        }
      }
    }

    // Supabase 无数据 → 使用本地数据，按 heat 降序
    if (data.length === 0) {
      if (type === 'skills') {
        let filtered = [...localSkills];
        if (category) {
          filtered = filtered.filter((s: any) => s.category === category);
        }
        data = filtered;
      } else {
        let filtered = [...localTools];
        if (category) {
          filtered = filtered.filter((t: any) => t.category === category);
        }
        data = filtered;
      }
      data.sort((a: any, b: any) => (b.heat || 0) - (a.heat || 0));
      sourceName = 'local';
    }

    return NextResponse.json({
      data: data.slice(0, limit),
      success: true,
      source: sourceName,
    });
  } catch (error) {
    console.error('Leaderboard API error:', error);
    // 极端回退：直接排本地数据
    const fallback = type === 'skills' ? [...localSkills] : [...localTools];
    fallback.sort((a: any, b: any) => (b.heat || 0) - (a.heat || 0));
    return NextResponse.json({
      data: fallback.slice(0, limit),
      success: true,
      source: 'local-fallback',
    });
  }
}

export const GET = withApiCache(
  handleLeaderboardRequest,
  apiCacheConfig.leaderboard
);
