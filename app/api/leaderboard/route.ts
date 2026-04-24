import { NextResponse } from 'next/server';
import { getToolsFromSupabase, getSkillsFromSupabase } from '@/lib/supabase';
import { tools as localTools, skills as localSkills } from '@/data/tools';
import { withApiCache, apiCacheConfig } from '@/lib/api-cache';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

// 外部热度数据增强（可选，不阻塞核心数据）
function tryEnrichWithExternalData(items: any[], type: 'tools' | 'skills') {
  try {
    if (type === 'tools') {
      const filePath = path.join(process.cwd(), 'data', 'leaderboard-data.json');
      if (fs.existsSync(filePath)) {
        const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        if (data?.leaderboard) {
          const heatMap = new Map<string, any>(
            data.leaderboard.map((item: any) => [item.keyword.toLowerCase(), item])
          );
          return items.map((item: any) => {
            const match: any = heatMap.get(item.name?.toLowerCase());
            if (match) {
              return {
                ...item,
                heat: Math.max(item.heat || 0, match.total_heat || 0),
                heatGrowth: match.growth || item.heatGrowth || 0,
                _enriched: true,
              };
            }
            return item;
          });
        }
      }
    } else {
      const filePath = path.join(process.cwd(), 'data', 'skill-heat-scores.json');
      if (fs.existsSync(filePath)) {
        const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        if (data?.skills) {
          const heatMap = new Map<string, any>(
            data.skills.map((s: any) => [s.name?.toLowerCase(), s])
          );
          return items.map((item: any) => {
            const match: any = heatMap.get(item.name?.toLowerCase());
            if (match) {
              return {
                ...item,
                heat: Math.max(item.heat || 0, Math.round(match.total_heat || 0)),
                githubStars: match.stars || item.githubStars || 0,
                _enriched: true,
              };
            }
            return item;
          });
        }
      }
    }
  } catch (e) {
    console.warn('Leaderboard enrichment skipped (non-blocking):', e);
  }
  return items;
}

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
          data = tryEnrichWithExternalData(skills, 'skills');
          data.sort((a: any, b: any) => (b.heat || 0) - (a.heat || 0));
          sourceName = 'supabase';
        }
      } else {
        const tools = await getToolsFromSupabase({ category, limit, orderBy: 'heat' });
        if (tools.length > 0) {
          data = tryEnrichWithExternalData(tools, 'tools');
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
        data = tryEnrichWithExternalData(filtered, 'skills');
      } else {
        let filtered = [...localTools];
        if (category) {
          filtered = filtered.filter((t: any) => t.category === category);
        }
        data = tryEnrichWithExternalData(filtered, 'tools');
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
