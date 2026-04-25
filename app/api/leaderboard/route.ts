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
  const sort = searchParams.get('sort') || 'heat';
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
          // 多维排序
          if (sort === 'trending') {
            data.sort((a: any, b: any) => (b.heatGrowth || 0) - (a.heatGrowth || 0));
          } else {
            data.sort((a: any, b: any) => (b.heat || b.install_count || 0) - (a.heat || a.install_count || 0));
          }
          sourceName = 'supabase';
        }
      } else {
        const tools = await getToolsFromSupabase({ category, limit, orderBy: 'heat' });
        if (tools.length > 0) {
          data = tools;
          // 多维排序
          if (sort === 'trending') {
            data.sort((a: any, b: any) => (b.heatGrowth || 0) - (a.heatGrowth || 0));
          } else if (sort === 'new') {
            data.sort((a: any, b: any) => {
              const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
              const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
              return dateB - dateA;
            });
          } else {
            data.sort((a: any, b: any) => (b.heat || 0) - (a.heat || 0));
          }
          sourceName = 'supabase';
        }
      }
    }

    // Supabase 无数据 → 使用本地数据
    if (data.length === 0) {
      let filtered: any[] = [];
      
      if (type === 'skills') {
        filtered = [...localSkills];
        if (category) {
          filtered = filtered.filter((s: any) => s.category === category);
        }
        // 按 sort 维度排序
        if (sort === 'trending') {
          filtered.sort((a: any, b: any) => (b.heatGrowth || 0) - (a.heatGrowth || 0));
        } else {
          filtered.sort((a: any, b: any) => (b.installCount || 0) - (a.installCount || 0));
        }
      } else {
        filtered = [...localTools];
        if (category) {
          filtered = filtered.filter((t: any) => t.category === category);
        }
        // 按 sort 维度排序
        if (sort === 'trending') {
          filtered.sort((a: any, b: any) => (b.heatGrowth || 0) - (a.heatGrowth || 0));
        } else {
          filtered.sort((a: any, b: any) => (b.heat || 0) - (a.heat || 0));
        }
      }
      data = filtered;
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
    if (sort === 'trending') {
      fallback.sort((a: any, b: any) => (b.heatGrowth || 0) - (a.heatGrowth || 0));
    } else {
      const sortKey = type === 'skills' ? 'installCount' : 'heat';
      fallback.sort((a: any, b: any) => (b[sortKey] || 0) - (a[sortKey] || 0));
    }
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
