/**
 * 知识图谱 API 路由
 * 
 * 用法:
 *   GET /api/knowledge-graph?action=related-tools&id=tool_xxx
 *   GET /api/knowledge-graph?action=related-skills&id=tool_xxx
 *   GET /api/knowledge-graph?action=related-tools-by-skill&id=skill_xxx
 *   GET /api/knowledge-graph?action=related-skills-by-skill&id=skill_xxx
 *   GET /api/knowledge-graph?action=scene-relations&sceneTag=写作创作
 *   GET /api/knowledge-graph?action=search&q=关键词
 *   GET /api/knowledge-graph?action=stats
 */

import { NextRequest } from 'next/server';
import {
  getRelatedTools,
  getRelatedSkills,
  getRelatedToolsBySkill,
  getRelatedSkillsBySkill,
  getSceneRelations,
  getGraphStats,
  searchGraph,
} from '@/lib/knowledge-graph';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action');
  const id = searchParams.get('id');
  const sceneTag = searchParams.get('sceneTag');
  const q = searchParams.get('q');
  const limit = parseInt(searchParams.get('limit') || '6');

  try {
    let data;

    switch (action) {
      case 'related-tools':
        if (!id) return Response.json({ success: false, error: 'Missing id parameter' }, { status: 400 });
        data = getRelatedTools(id, limit);
        break;

      case 'related-skills':
        if (!id) return Response.json({ success: false, error: 'Missing id parameter' }, { status: 400 });
        data = getRelatedSkills(id, limit);
        break;

      case 'related-tools-by-skill':
        if (!id) return Response.json({ success: false, error: 'Missing id parameter' }, { status: 400 });
        data = getRelatedToolsBySkill(id, limit);
        break;

      case 'related-skills-by-skill':
        if (!id) return Response.json({ success: false, error: 'Missing id parameter' }, { status: 400 });
        data = getRelatedSkillsBySkill(id, limit);
        break;

      case 'scene-relations':
        if (!sceneTag) return Response.json({ success: false, error: 'Missing sceneTag parameter' }, { status: 400 });
        data = getSceneRelations(sceneTag);
        break;

      case 'search':
        if (!q) return Response.json({ success: false, error: 'Missing q parameter' }, { status: 400 });
        data = searchGraph(q);
        break;

      case 'stats':
        data = getGraphStats();
        break;

      default:
        return Response.json(
          { success: false, error: 'Invalid action. Valid: related-tools, related-skills, related-tools-by-skill, related-skills-by-skill, scene-relations, search, stats' },
          { status: 400 }
        );
    }

    return Response.json({ success: true, data, source: 'knowledge-graph' });
  } catch (error) {
    console.error('Knowledge graph API error:', error);
    return Response.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
