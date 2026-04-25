/**
 * 知识图谱自组织引擎 — Layer 3
 * 
 * 基于 gbrain 模式的三重加权关系评分算法：
 * 自动计算 tools ↔ skills ↔ scenes 之间的关联度，
 * 替代手工维护的 relatedSkills 数组。
 * 
 * 算法：
 *   relationScore(A, B) = 
 *     sceneTagOverlap * 0.35 + 
 *     techTagOverlap(A) * 0.25 + 
 *     categoryMatch * 0.15 + 
 *     compatibilityMatch * 0.15 +
 *     semanticMatch * 0.10
 * 
 * 输出：每个工具 → 关联工具列表（含分数和关系类型）
 *       每个工具/Skill → 关联 Skill/工具列表
 *       每个 Scene → 关联的工具和 Skill（自动计算聚合）
 */

import { Tool, Skill, Scene } from '@/types';
import { tools as rawTools, skills as rawSkills, scenes as rawScenes } from '@/data/tools';

export interface Relation {
  id: string;
  name: string;
  type: 'tool' | 'skill';
  score: number;
  tags: string[];        // 哪些维度产生了关联
  icon?: string;
  description?: string;
}

const SCENE_WEIGHT = 0.35;
const TECH_WEIGHT = 0.25;
const CATEGORY_WEIGHT = 0.15;
const COMPATIBILITY_WEIGHT = 0.15;
const SEMANTIC_WEIGHT = 0.10;

/**
 * Jaccard 相似度
 */
function jaccard(a: string[], b: string[]): number {
  if (a.length === 0 || b.length === 0) return 0;
  const setA = new Set(a);
  const setB = new Set(b);
  let intersect = 0;
  for (const item of setA) {
    if (setB.has(item)) intersect++;
  }
  const union = new Set([...setA, ...setB]).size;
  return intersect / union;
}

/**
 * 计算工具与 Skill 之间的关联分数
 */
function calculateToolSkillScore(tool: Tool, skill: Skill): { score: number; reasons: string[] } {
  const reasons: string[] = [];
  let score = 0;

  // 1. sceneTags 重合 (工具的场景标签 vs Skill 的 category)
  const sceneOverlap = tool.sceneTags.filter(st => 
    skill.category === st || 
    skill.name.includes(st) || 
    st.includes(skill.category)
  ).length;
  if (sceneOverlap > 0) {
    const sceneScore = Math.min(sceneOverlap / 3, 1) * SCENE_WEIGHT;
    score += sceneScore;
    reasons.push(`场景匹配(${tool.sceneTags.filter(st => skill.category === st || skill.name.includes(st) || st.includes(skill.category)).slice(0, 2).join(',')})`);
  }

  // 2. techTags vs Skill 的技术暗示
  const techKeywords = ['AI', 'NLP', 'CodeGen', 'Generative', 'Diffusion', 'Search', 'RAG', 'Agent'];
  const skillTechMatches = techKeywords.filter(kw => 
    skill.description.includes(kw) || skill.name.includes(kw)
  ).length;
  const toolTechIntersect = tool.techTags.filter(tt => 
    skill.description.includes(tt) || skill.name.includes(tt.split(/(?=[A-Z])/).join(' '))
  ).length;
  if (toolTechIntersect > 0 || skillTechMatches > 0) {
    const techScore = Math.min((toolTechIntersect + skillTechMatches) / 4, 1) * TECH_WEIGHT;
    score += techScore;
    if (toolTechIntersect > 0) reasons.push(`技术标签`);
  }

  // 3. category 一致性
  if (tool.category === skill.category) {
    score += CATEGORY_WEIGHT;
    reasons.push(`同品类`);
  }

  // 4. compatibility 交叉 (Skill 兼容该工具)
  if (skill.compatibility && skill.compatibility.includes(tool.name)) {
    score += COMPATIBILITY_WEIGHT;
    reasons.push(`推荐搭配`);
  }

  // 5. 语义匹配 (tool 的 prompt scene 是否与 skill category 相关)
  const toolPromptScenes = tool.prompts.map(p => p.scene);
  const semanticMatch = toolPromptScenes.filter(s => 
    skill.category.includes(s) || s.includes(skill.category) || skill.name.includes(s)
  ).length;
  if (semanticMatch > 0) {
    score += Math.min(semanticMatch / 3, 1) * SEMANTIC_WEIGHT;
    if (reasons.length === 0) reasons.push('场景适配');
  }

  score = Math.round(score * 100) / 100;
  return { score, reasons };
}

/**
 * 计算工具与工具之间的关联分数
 */
function calculateToolToolScore(a: Tool, b: Tool): { score: number; reasons: string[] } {
  const reasons: string[] = [];
  let score = 0;

  // 1. sceneTags Jaccard
  const s = jaccard(a.sceneTags, b.sceneTags);
  if (s > 0) {
    score += s * SCENE_WEIGHT;
    reasons.push(`共同场景`);
  }

  // 2. techTags Jaccard
  const t = jaccard(a.techTags, b.techTags);
  if (t > 0) {
    score += t * TECH_WEIGHT;
    reasons.push(`同技术领域`);
  }

  // 3. 同品类
  if (a.category === b.category) {
    score += CATEGORY_WEIGHT;
    reasons.push(`同品类`);
  }

  // 4. 同价格段
  if (a.price === b.price) {
    // 价格段匹配是弱信号
    score += 0.05;
    reasons.push(`同价格段`);
  }

  score = Math.round(score * 100) / 100;
  return { score, reasons };
}

/**
 * 计算 Skill 与 Skill 之间的关联分数
 */
function calculateSkillSkillScore(a: Skill, b: Skill): { score: number; reasons: string[] } {
  const reasons: string[] = [];
  let score = 0;

  // 同品类（权重更高）
  if (a.category === b.category) {
    score += 0.40;
    reasons.push(`同类别`);
  }

  // difficulty 匹配
  if (a.difficulty === b.difficulty) {
    score += 0.15;
  }

  // compatibility 重叠
  const compatOverlap = (a.compatibility || []).filter(c => (b.compatibility || []).includes(c)).length;
  if (compatOverlap > 0) {
    score += Math.min(compatOverlap * 0.10, 0.25);
    if (compatOverlap > 0) reasons.push(`共用工具`);
  }

  // 依赖链
  const aDeps = (a.dependencies || []).map(d => d.name);
  const bDeps = (b.dependencies || []).map(d => d.name);
  if (jaccard(aDeps, bDeps) > 0) {
    score += 0.10;
    reasons.push(`共同依赖`);
  }

  score = Math.round(score * 100) / 100;
  return { score, reasons };
}

/**
 * 获取某个工具的相关工具（同类或共同场景下的其他工具）
 */
export function getRelatedTools(toolId: string, limit: number = 6): Relation[] {
  const tool = rawTools.find(t => t.id === toolId);
  if (!tool) return [];

  const scores: Relation[] = [];
  
  for (const other of rawTools) {
    if (other.id === toolId) continue;
    const { score, reasons } = calculateToolToolScore(tool, other);
    if (score >= 0.15) {
      scores.push({
        id: other.id,
        name: other.name,
        type: 'tool',
        score,
        tags: reasons,
        icon: other.logo,
        description: other.description.slice(0, 60),
      });
    }
  }

  return scores.sort((a, b) => b.score - a.score).slice(0, limit);
}

/**
 * 获取与某个工具最匹配的 Skill（知识图谱推荐）
 */
export function getRelatedSkills(toolId: string, limit: number = 6): Relation[] {
  const tool = rawTools.find(t => t.id === toolId);
  if (!tool) return [];

  const scores: Relation[] = [];
  
  for (const skill of rawSkills) {
    const { score, reasons } = calculateToolSkillScore(tool, skill);
    if (score >= 0.10) {
      scores.push({
        id: skill.id,
        name: skill.name,
        type: 'skill',
        score,
        tags: reasons,
        icon: skill.icon,
        description: skill.description.slice(0, 60),
      });
    }
  }

  return scores.sort((a, b) => b.score - a.score).slice(0, limit);
}

/**
 * 获取与某个 Skill 最匹配的工具
 */
export function getRelatedToolsBySkill(skillId: string, limit: number = 6): Relation[] {
  const skill = rawSkills.find(s => s.id === skillId);
  if (!skill) return [];

  const scores: Relation[] = [];
  
  for (const tool of rawTools) {
    const { score, reasons } = calculateToolSkillScore(tool, skill);
    if (score >= 0.10) {
      scores.push({
        id: tool.id,
        name: tool.name,
        type: 'tool',
        score,
        tags: reasons,
        icon: tool.logo,
        description: tool.description.slice(0, 60),
      });
    }
  }

  return scores.sort((a, b) => b.score - a.score).slice(0, limit);
}

/**
 * 获取与某个 Skill 相关的其他 Skill
 */
export function getRelatedSkillsBySkill(skillId: string, limit: number = 6): Relation[] {
  const skill = rawSkills.find(s => s.id === skillId);
  if (!skill) return [];

  const scores: Relation[] = [];
  
  for (const other of rawSkills) {
    if (other.id === skillId) continue;
    const { score, reasons } = calculateSkillSkillScore(skill, other);
    if (score >= 0.20) {
      scores.push({
        id: other.id,
        name: other.name,
        type: 'skill',
        score,
        tags: reasons,
        icon: other.icon,
        description: other.description.slice(0, 60),
      });
    }
  }

  return scores.sort((a, b) => b.score - a.score).slice(0, limit);
}

/**
 * 获取 Scene 的自动关联工具和 Skill
 * 基于 sceneTags 匹配，比手工维护的 toolCount/skillCount 更准确
 */
export function getSceneRelations(sceneTag: string): { tools: Relation[]; skills: Relation[] } {
  const relatedTools: Relation[] = [];
  const relatedSkills: Relation[] = [];

  for (const tool of rawTools) {
    if (tool.sceneTags.includes(sceneTag)) {
      relatedTools.push({
        id: tool.id,
        name: tool.name,
        type: 'tool',
        score: 1.0,
        tags: ['场景匹配'],
        icon: tool.logo,
        description: tool.description.slice(0, 60),
      });
    }
  }

  for (const skill of rawSkills) {
    if (skill.category === sceneTag || skill.description.includes(sceneTag)) {
      relatedSkills.push({
        id: skill.id,
        name: skill.name,
        type: 'skill',
        score: 0.8,
        tags: ['场景匹配'],
        icon: skill.icon,
        description: skill.description.slice(0, 60),
      });
    }
  }

  return {
    tools: relatedTools.sort((a, b) => b.score - a.score),
    skills: relatedSkills.sort((a, b) => b.score - a.score),
  };
}

/**
 * 获取图谱全景数据（用于演化页面）
 */
export function getGraphStats() {
  const totalEdges = rawTools.length * rawSkills.length;
  
  // 强关联边（分数 >= 0.25）
  let strongEdges = 0;
  for (const tool of rawTools) {
    for (const skill of rawSkills) {
      const { score } = calculateToolSkillScore(tool, skill);
      if (score >= 0.25) strongEdges++;
    }
  }

  return {
    nodes: rawTools.length + rawSkills.length,
    toolNodes: rawTools.length,
    skillNodes: rawSkills.length,
    possibleEdges: totalEdges,
    strongEdges,
    connectionDensity: (strongEdges / totalEdges * 100).toFixed(1),
  };
}

/**
 * 搜索知识图谱（多维度语义搜索替代）
 */
export function searchGraph(query: string): { tools: Relation[]; skills: Relation[] } {
  const q = query.toLowerCase();
  const matchedTools: Relation[] = [];
  const matchedSkills: Relation[] = [];

  for (const tool of rawTools) {
    let score = 0;
    const reasons: string[] = [];
    
    if (tool.name.toLowerCase().includes(q)) { score += 0.5; reasons.push('名称匹配'); }
    if (tool.description.toLowerCase().includes(q)) { score += 0.3; reasons.push('描述匹配'); }
    if (tool.tags.some(t => t.toLowerCase().includes(q))) { score += 0.4; reasons.push('标签匹配'); }
    if (tool.sceneTags.some(s => s.toLowerCase().includes(q))) { score += 0.2; reasons.push('场景匹配'); }
    if (tool.techTags.some(t => t.toLowerCase().includes(q))) { score += 0.2; reasons.push('技术匹配'); }
    if (tool.category.toLowerCase().includes(q)) { score += 0.3; reasons.push('品类匹配'); }

    if (score > 0) {
      matchedTools.push({
        id: tool.id,
        name: tool.name,
        type: 'tool',
        score: Math.min(score, 1),
        tags: reasons,
        icon: tool.logo,
        description: tool.description.slice(0, 60),
      });
    }
  }

  for (const skill of rawSkills) {
    let score = 0;
    const reasons: string[] = [];

    if (skill.name.toLowerCase().includes(q)) { score += 0.5; reasons.push('名称匹配'); }
    if (skill.description.toLowerCase().includes(q)) { score += 0.3; reasons.push('描述匹配'); }
    if (skill.category.toLowerCase().includes(q)) { score += 0.3; reasons.push('类别匹配'); }
    if ((skill.compatibility || []).some(c => c.toLowerCase().includes(q))) { score += 0.2; reasons.push('兼容匹配'); }

    if (score > 0) {
      matchedSkills.push({
        id: skill.id,
        name: skill.name,
        type: 'skill',
        score: Math.min(score, 1),
        tags: reasons,
        icon: skill.icon,
        description: skill.description.slice(0, 60),
      });
    }
  }

  return {
    tools: matchedTools.sort((a, b) => b.score - a.score),
    skills: matchedSkills.sort((a, b) => b.score - a.score),
  };
}

export { rawTools, rawSkills, rawScenes };
