#!/usr/bin/env tsx
/**
 * manage-content.ts — Unified Content Management CLI for AI导航站
 *
 * Usage:
 *   npx tsx scripts/manage-content.ts add-tool <name> <category> <icon> <url> [<price>] [<difficulty>]
 *   npx tsx scripts/manage-content.ts enhance-all
 *   npx tsx scripts/manage-content.ts validate
 *   npx tsx scripts/manage-content.ts sync-scenes
 *
 * Principles:
 *   - One file to manage all content operations
 *   - Auto-discovers sceneTags from tool definitions
 *   - Reads/writes directly to data/tools.ts
 */

import * as fs from 'fs';
import * as path from 'path';
import { generateForTool } from './generate-enhanced-content';

// ─── Paths ──────────────────────────────────────────────────────────────────

const PROJECT_ROOT = path.resolve(__dirname, '..');
const TOOLS_FILE = path.join(PROJECT_ROOT, 'data', 'tools.ts');

// ─── Types ──────────────────────────────────────────────────────────────────

type Price = 'free' | 'freemium' | 'paid' | 'enterprise';
type Difficulty = 'beginner' | 'intermediate' | 'advanced';

interface ToolDef {
  id: string;
  name: string;
  logo: string;
  description: string;
  url: string;
  price: Price;
  difficulty: Difficulty;
  heat: number;
  heatGrowth: number;
  tags: string[];
  techTags: string[];
  sceneTags: string[];
  costTags: string[];
  prompts: { id: string; title: string; content: string; scene: string }[];
  tips: string[];
  relatedSkills: string[];
  xhsSaves?: number;
  category: string;
}

// ─── Scene/Category Mapping ────────────────────────────────────────────────

const CATEGORY_TO_SCENE: Record<string, string[]> = {
  'AI对话': ['办公提效', '内容创作', '编程开发'],
  '图像生成': ['设计创作', '内容创作', '电商运营'],
  '视频生成': ['内容创作', '短视频'],
  '音频生成': ['内容创作', '短视频'],
  '编程开发': ['编程开发'],
  '办公工具': ['办公提效'],
  'AI搜索': ['学术研究', '办公提效'],
  '3D生成': ['设计创作', '内容创作'],
};

const DEFAULT_SCENE_TAGS = ['办公提效'];

// ─── ID generation ──────────────────────────────────────────────────────────

function toId(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\u4e00-\u9fff]+/g, '_')
    .replace(/^_|_$/g, '')
    .replace(/_{2,}/g, '_');
}

function escapeTS(str: string): string {
  return str
    .replace(/\\/g, '\\\\')
    .replace(/`/g, '\\`')
    .replace(/\${/g, '\\${')
    .replace(/'/g, "\\'")
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '');
}

// ─── 1. ADD-TOOL ────────────────────────────────────────────────────────────

function cmdAddTool(args: string[]) {
  if (args.length < 4) {
    console.error('Usage: npx tsx scripts/manage-content.ts add-tool <name> <category> <icon> <url> [<price>] [<difficulty>]');
    console.error('');
    console.error('  <name>       Tool display name (e.g. "My Tool")');
    console.error('  <category>   Category (AI对话, 图像生成, 视频生成, 音频生成, 编程开发, 办公工具, AI搜索, 3D生成)');
    console.error('  <icon>       Emoji or icon string (e.g. "🤖")');
    console.error('  <url>        URL (e.g. "https://example.com")');
    console.error('  <price>      Price model: free | freemium | paid | enterprise (default: free)');
    console.error('  <difficulty> Difficulty: beginner | intermediate | advanced (default: beginner)');
    process.exit(1);
  }

  const [name, category, icon, url] = args;
  const price: Price = (args[4] as Price) || 'free';
  const difficulty: Difficulty = (args[5] as Difficulty) || 'beginner';
  const id = toId(name);

  const sceneTags = CATEGORY_TO_SCENE[category] || DEFAULT_SCENE_TAGS;

  const toolEntry = `  { id: '${id}', name: '${name}', logo: '${icon}', description: '${name} is an AI tool for ${category}', url: '${url}', price: '${price}', difficulty: '${difficulty}', heat: 50, heatGrowth: 10, tags: ['${category}', 'AI'], techTags: ['GenerativeAI'], sceneTags: [${sceneTags.map(s => `'${s}'`).join(', ')}], costTags: ['${price === 'free' ? 'Free' : price === 'freemium' ? 'Freemium' : 'Paid'}'], category: '${category}', prompts: [], tips: ['Learn how to use ${name} effectively'], relatedSkills: [] },`;

  // Read current tools.ts
  const source = fs.readFileSync(TOOLS_FILE, 'utf-8');
  const lines = source.split('\n');

  // Find the line with 'export const tools: Tool[] = ['
  let toolsStart = -1;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('export const tools:')) {
      toolsStart = i;
      break;
    }
  }
  if (toolsStart === -1) {
    console.error('ERROR: Could not find tools array in tools.ts');
    process.exit(1);
  }

  // Find the closing '];' of the tools array — first '];' after toolsStart
  let toolsEnd = -1;
  for (let i = toolsStart; i < lines.length; i++) {
    const trimmed = lines[i].trim();
    if (trimmed === '];') {
      toolsEnd = i;
      break;
    }
  }
  if (toolsEnd === -1) {
    console.error('ERROR: Could not find end of tools array');
    process.exit(1);
  }

  // Check if tool already exists
  for (let i = toolsStart; i <= toolsEnd; i++) {
    if (lines[i].includes(`id: '${id}'`)) {
      console.error(`ERROR: Tool with id '${id}' already exists in tools.ts`);
      process.exit(1);
    }
  }

  // Insert before the closing '];'
  const before = lines.slice(0, toolsEnd);
  const after = lines.slice(toolsEnd);

  const newLines = [...before, '', '  // Added by manage-content.ts', toolEntry, ...after];
  fs.writeFileSync(TOOLS_FILE, newLines.join('\n'), 'utf-8');

  console.log(`✅ Added tool '${name}' (id: ${id}) to tools.ts`);
  console.log(`   Category: ${category}`);
  console.log(`   SceneTags: ${sceneTags.join(', ')}`);
  console.log(`   Price: ${price}, Difficulty: ${difficulty}`);
  console.log('');
  console.log(`   Next steps:`);
  console.log(`   - Run 'npx tsx scripts/manage-content.ts enhance-all' to generate enhanced content`);
  console.log(`   - Run 'npx tsx scripts/manage-content.ts sync-scenes' to check for missing scenes`);
  console.log(`   - Edit the description, tags, prompts, and tips as needed`);
}

// ─── 2. ENHANCE-ALL ─────────────────────────────────────────────────────────

function cmdEnhanceAll() {
  // Dynamic import to avoid TS build issues
  const toolsFilePath = path.resolve(PROJECT_ROOT, 'data', 'tools.ts');

  if (!fs.existsSync(toolsFilePath)) {
    console.error(`ERROR: Could not find tools.ts at ${toolsFilePath}`);
    process.exit(1);
  }

  const source = fs.readFileSync(toolsFilePath, 'utf-8');
  const lines = source.split('\n');

  // Find AI_ENHANCED_CONTENT block bounds
  const bounds = findAIContentBounds(lines);
  if (!bounds) {
    console.error('ERROR: Could not find AI_ENHANCED_CONTENT block in tools.ts');
    process.exit(1);
  }

  // Extract existing tool IDs from the content block
  const contentLines = lines.slice(bounds.valueOpenLine, bounds.endLine + 1);
  const existingIds = new Set<string>();
  for (const line of contentLines) {
    const match = line.match(/^\s{2}(\w+):\s*\{/);
    if (match) existingIds.add(match[1]);
  }

  console.log(`Found ${existingIds.size} tools in AI_ENHANCED_CONTENT`);

  // Now we need to load tools to know which ones are missing enhanced content
  // Since we can't import easily, let's scan the tools array for IDs
  const toolIds = extractToolIds(lines);
  const toolsToGenerate = toolIds.filter(id => !existingIds.has(id));

  if (toolsToGenerate.length === 0) {
    console.log('✓ All tools already have enhanced content. Nothing to do.');
    process.exit(0);
  }

  console.log(`Generating enhanced content for ${toolsToGenerate.length} tools...`);

  // For each missing tool, we need its data. Extract minimal tool info from source.
  const generatedEntries: string[] = [];

  for (const toolId of toolsToGenerate) {
    const toolInfo = extractToolInfo(lines, toolId);
    if (!toolInfo) {
      console.warn(`  ⚠ Could not extract info for '${toolId}', skipping`);
      continue;
    }

    try {
      const content = generateForTool(toolInfo as any);
      generatedEntries.push(formatContent(toolId, content));
      console.log(`  ✓ ${toolId} (${toolInfo.name})`);
    } catch (err) {
      console.warn(`  ⚠ Failed to generate for '${toolId}': ${err}`);
    }
  }

  if (generatedEntries.length === 0) {
    console.log('No new content generated. Check for errors above.');
    process.exit(0);
  }

  // Insert new entries before the closing '};'
  const beforeClosing = lines.slice(0, bounds.endLine);
  const afterClosing = lines.slice(bounds.endLine);

  // Ensure the last existing entry has a trailing comma
  let lastEntryIdx = bounds.endLine - 1;
  while (lastEntryIdx > bounds.valueOpenLine) {
    const trimmed = lines[lastEntryIdx].trim();
    if (trimmed === '}' || trimmed === '},') break;
    lastEntryIdx--;
  }
  if (lastEntryIdx > bounds.valueOpenLine && lines[lastEntryIdx].trim() === '}') {
    beforeClosing[lastEntryIdx] = lines[lastEntryIdx] + ',';
  }

  const newLines: string[] = [];
  for (let i = 0; i < generatedEntries.length; i++) {
    if (i > 0) newLines.push('');
    const entryLines = generatedEntries[i].split('\n');
    for (const el of entryLines) {
      newLines.push(el);
    }
    newLines[newLines.length - 1] = newLines[newLines.length - 1] + ',';
  }

  const finalLines = [...beforeClosing, '', ...newLines, ...afterClosing];
  fs.writeFileSync(TOOLS_FILE, finalLines.join('\n'), 'utf-8');

  console.log();
  console.log(`✅ Successfully patched ${TOOLS_FILE}`);
  console.log(`   Added enhanced content for ${generatedEntries.length} tools:`);
  for (const entry of generatedEntries) {
    const firstLine = entry.split('\n')[0];
    const idMatch = firstLine.match(/^\s{2}(\w+):/);
    if (idMatch) console.log(`   - ${idMatch[1]}`);
  }
}

// ─── 3. VALIDATE ────────────────────────────────────────────────────────────

interface ValidationIssue {
  severity: 'error' | 'warning' | 'info';
  message: string;
  details?: string;
}

function cmdValidate() {
  const source = fs.readFileSync(TOOLS_FILE, 'utf-8');
  const lines = source.split('\n');
  const issues: ValidationIssue[] = [];

  // Extract all data
  const allToolIds = extractToolIds(lines);
  const allSceneTags = extractAllSceneTags(lines);
  const sceneNames = extractSceneNames(lines);
  const dailyPickSceneIds = extractDailyPickSceneIds(lines);
  const sceneIdsInScenes = extractSceneIds(lines);

  console.log('🔍 Running content integrity validation...\n');

  // 1. Check: Each scene tag has a corresponding scene
  const sceneNameSet = new Set(sceneNames);
  const sceneTagSet = new Set(allSceneTags);

  for (const tag of allSceneTags) {
    if (!sceneNameSet.has(tag)) {
      // Check if scene name partially matches
      const partialMatch = sceneNames.find(n => n.includes(tag) || tag.includes(n));
      if (partialMatch) {
        issues.push({
          severity: 'warning',
          message: `SceneTag "${tag}" doesn't have an exact scene match, but "${partialMatch}" is close`,
        });
      } else {
        issues.push({
          severity: 'error',
          message: `SceneTag "${tag}" has NO matching scene — create a scene or update the tool's sceneTags`,
        });
      }
    }
  }

  // 2. Check: Scenes that have no tools matching their name
  for (const name of sceneNames) {
    if (!sceneTagSet.has(name)) {
      issues.push({
        severity: 'warning',
        message: `Scene "${name}" has no tools with matching sceneTags — add "${name}" to tool.sceneTags or remove the scene`,
      });
    }
  }

  // 3. Check: Daily picks pointing to non-existent scenes
  const sceneIdSet = new Set(sceneIdsInScenes);
  for (const dpId of dailyPickSceneIds) {
    if (!sceneIdSet.has(dpId)) {
      issues.push({
        severity: 'error',
        message: `DailyPick references sceneId "${dpId}" which does not exist in scenes array`,
      });
    }
  }

  // 4. Check: Orphaned tools (tools with sceneTags that match no scene names)
  const orphanedToolIds = findOrphanedTools(lines, sceneNames);
  if (orphanedToolIds.length > 0) {
    issues.push({
      severity: 'warning',
      message: `${orphanedToolIds.length} tools have sceneTags that don't match any scene name`,
      details: orphanedToolIds.join(', '),
    });
  }

  // 5. Check: Price value consistency
  const priceValues = new Set<string>();
  for (let i = 0; i < lines.length; i++) {
    const m = lines[i].match(/price:\s*'([^']+)'/);
    if (m) priceValues.add(m[1]);
  }
  const validPrices = ['free', 'freemium', 'paid', 'enterprise'];
  for (const p of priceValues) {
    if (!validPrices.includes(p)) {
      issues.push({
        severity: 'error',
        message: `Invalid price value "${p}" found — must be one of: ${validPrices.join(', ')}`,
      });
    }
  }

  // 6. Check: All tools have sceneTags
  const toolsWithoutSceneTags = findToolsWithoutSceneTags(lines);
  if (toolsWithoutSceneTags.length > 0) {
    issues.push({
      severity: 'warning',
      message: `${toolsWithoutSceneTags.length} tools have no sceneTags`,
      details: toolsWithoutSceneTags.join(', '),
    });
  }

  // 7. Check: AI_ENHANCED_CONTENT has no stale entries (tools that no longer exist)
  const staleContent = findStaleEnhancedContent(lines, allToolIds);
  if (staleContent.length > 0) {
    issues.push({
      severity: 'warning',
      message: `AI_ENHANCED_CONTENT has ${staleContent.length} entries for tools that no longer exist`,
      details: staleContent.join(', '),
    });
  }

  // ─── Report ──────────────────────────────────────────────────────────────
  const errors = issues.filter(i => i.severity === 'error');
  const warnings = issues.filter(i => i.severity === 'warning');
  const infos = issues.filter(i => i.severity === 'info');

  console.log(`📊 Summary:`);
  console.log(`   Tools:       ${allToolIds.length}`);
  console.log(`   Scenes:      ${sceneNames.length}`);
  console.log(`   SceneTags:   ${allSceneTags.length}`);
  console.log(`   DailyPicks:  ${dailyPickSceneIds.length}`);
  console.log();

  if (issues.length === 0) {
    console.log('✅ All integrity checks passed! No issues found.');
    process.exit(0);
  }

  console.log(`⚠ Found ${issues.length} issue(s):`);
  console.log(`   ${errors.length} errors, ${warnings.length} warnings, ${infos.length} info`);

  for (const issue of issues) {
    const icon = issue.severity === 'error' ? '❌' : issue.severity === 'warning' ? '⚠️' : 'ℹ️';
    console.log(`\n  ${icon} [${issue.severity.toUpperCase()}] ${issue.message}`);
    if (issue.details) {
      console.log(`     Details: ${issue.details}`);
    }
  }

  process.exit(errors.length > 0 ? 1 : 0);
}

// ─── 4. SYNC-SCENES ─────────────────────────────────────────────────────────

function cmdSyncScenes() {
  const source = fs.readFileSync(TOOLS_FILE, 'utf-8');
  const lines = source.split('\n');

  const allSceneTags = extractAllSceneTags(lines);
  const sceneNames = extractSceneNames(lines);

  const sceneNameSet = new Set(sceneNames);

  // Count how many tools use each scene tag
  const tagUsage = new Map<string, number>();
  for (const tag of allSceneTags) {
    tagUsage.set(tag, (tagUsage.get(tag) || 0) + 1);
  }

  // Unique scene tags
  const uniqueTags = [...new Set(allSceneTags)].sort();

  console.log('🔍 Scene Tag Analysis\n');

  console.log(`Found ${uniqueTags.length} unique scene tags used across tools:`);
  for (const tag of uniqueTags) {
    const count = tagUsage.get(tag) || 0;
    const hasScene = sceneNameSet.has(tag);
    const status = hasScene ? '✅' : '❌ MISSING';
    console.log(`  ${status} "${tag}" — used by ${count} tool(s)`);
  }

  console.log();

  // Missing scenes
  const missingScenes = uniqueTags.filter(tag => !sceneNameSet.has(tag));

  if (missingScenes.length === 0) {
    console.log('✅ All scene tags have matching scenes!');
    process.exit(0);
  }

  console.log(`⚠ ${missingScenes.length} scene tag(s) have no corresponding scene:`);
  for (const tag of missingScenes) {
    const count = tagUsage.get(tag) || 0;
    console.log(`\n  ❌ "${tag}" (used by ${count} tools)`);

    // Find which tools use this tag
    const usingTools = findToolsUsingSceneTag(lines, tag);
    if (usingTools.length > 0) {
      console.log(`     Used by: ${usingTools.join(', ')}`);
    }

    console.log(`\n     Recommended scene definition:`);
    console.log(`     { id: 'scene_${toId(tag)}', name: '${tag}', icon: '🔧', description: 'AI for ${tag} scenarios', coverImage: '🔧', toolCount: ${count}, skillCount: 0, xhsSaves: 0, tags: ['${tag}'], solutions: [] },`);
  }

  console.log();
  console.log('💡 Tip: Add the missing scene(s) to the scenes array in data/tools.ts');
}

// ─── PARSING HELPERS ────────────────────────────────────────────────────────

function extractToolIds(lines: string[]): string[] {
  const ids: string[] = [];
  let inToolsArray = false;
  for (const line of lines) {
    if (line.includes('export const tools:')) inToolsArray = true;
    if (inToolsArray && line.trim() === '];') break;
    if (inToolsArray) {
      const m = line.match(/id:\s*'([^']+)'/);
      if (m) ids.push(m[1]);
    }
  }
  return ids;
}

function extractToolInfo(lines: string[], toolId: string): { id: string; name: string; category: string; tips: string[]; prompts: any[] } | null {
  let inToolsArray = false;
  let found = false;
  let braceDepth = 0;
  let toolBlock = '';
  let inTool = false;

  for (const line of lines) {
    if (line.includes('export const tools:')) {
      inToolsArray = true;
      continue;
    }
    if (!inToolsArray) continue;
    if (line.trim() === '];') break;

    if (inTool || line.includes(`id: '${toolId}'`)) {
      inTool = true;
      toolBlock += line + '\n';

      for (const ch of line) {
        if (ch === '{') braceDepth++;
        if (ch === '}') braceDepth--;
      }
      if (braceDepth === 0 && toolBlock.trim()) {
        found = true;
        break;
      }
    }
  }

  if (!found) return null;

  const nameM = toolBlock.match(/name:\s*'([^']+)'/);
  const catM = toolBlock.match(/category:\s*'([^']+)'/);

  // Extract scene tags
  const sceneTags: string[] = [];
  const sceneM = toolBlock.match(/sceneTags:\s*\[([^\]]+)\]/);
  if (sceneM) {
    const tagsStr = sceneM[1];
    const tagMatches = tagsStr.match(/'([^']+)'/g);
    if (tagMatches) {
      for (const t of tagMatches) {
        sceneTags.push(t.replace(/'/g, ''));
      }
    }
  }

  // Extract tips
  const tips: string[] = [];
  const tipSectionM = toolBlock.match(/tips:\s*\[([^\]]*?)\](?=\s*,)/);
  if (tipSectionM) {
    const tipMatches = tipSectionM[1].match(/'([^']+)'/g);
    if (tipMatches) {
      for (const t of tipMatches) {
        tips.push(t.replace(/'/g, ''));
      }
    }
  }

  // Extract prompts
  const prompts: any[] = [];
  const promptRegex = /\{ id:\s*'([^']+)',\s*title:\s*'([^']+)',\s*content:\s*'([^']+)',\s*scene:\s*'([^']+)'\s*\}/g;
  let pm;
  while ((pm = promptRegex.exec(toolBlock)) !== null) {
    prompts.push({ id: pm[1], title: pm[2], content: pm[3], scene: pm[4] });
  }

  return {
    id: toolId,
    name: nameM ? nameM[1] : toolId,
    category: catM ? catM[1] : 'AI对话',
    tips,
    prompts,
    sceneTags,
  };
}

function extractAllSceneTags(lines: string[]): string[] {
  const tags: string[] = [];
  let inToolsArray = false;
  for (const line of lines) {
    if (line.includes('export const tools:')) inToolsArray = true;
    if (inToolsArray && line.trim() === '];') break;
    if (inToolsArray) {
      const m = line.match(/sceneTags:\s*\[([^\]]+)\]/);
      if (m) {
        const tagMatches = m[1].match(/'([^']+)'/g);
        if (tagMatches) {
          for (const t of tagMatches) {
            tags.push(t.replace(/'/g, ''));
          }
        }
      }
    }
  }
  return tags;
}

function extractSceneNames(lines: string[]): string[] {
  const names: string[] = [];
  let inScenes = false;
  for (const line of lines) {
    if (line.includes('export const scenes:') || line.includes('export const scenes:')) inScenes = true;
    if (inScenes && line.trim() === '];') break;
    if (inScenes) {
      const m = line.match(/name:\s*'([^']+)'/);
      if (m) names.push(m[1]);
    }
  }
  return names;
}

function extractSceneIds(lines: string[]): string[] {
  const ids: string[] = [];
  let inScenes = false;
  for (const line of lines) {
    if (line.includes('export const scenes:')) inScenes = true;
    if (inScenes && line.trim() === '];') break;
    if (inScenes) {
      const m = line.match(/id:\s*'([^']+)'/);
      if (m) ids.push(m[1]);
    }
  }
  return ids;
}

function extractDailyPickSceneIds(lines: string[]): string[] {
  const ids: string[] = [];
  let inDP = false;
  for (const line of lines) {
    if (line.includes('export const dailyPicks:')) inDP = true;
    if (inDP && line.trim() === '];') break;
    if (inDP) {
      const m = line.match(/sceneId:\s*'([^']+)'/);
      if (m) ids.push(m[1]);
    }
  }
  return ids;
}

function findOrphanedTools(lines: string[], sceneNames: string[]): string[] {
  const orphaned: string[] = [];
  let inToolsArray = false;
  let currentId = '';
  let currentTags: string[] = [];

  for (const line of lines) {
    if (line.includes('export const tools:')) {
      inToolsArray = true;
      continue;
    }
    if (!inToolsArray) continue;
    if (line.trim() === '];') break;

    // Track current tool id
    // Match lines like { id: '...' at the start
    const idM = line.match(/\{?\s*id:\s*'([^']+)'/);
    if (idM) currentId = idM[1];

    const tagM = line.match(/sceneTags:\s*\[([^\]]+)\]/);
    if (tagM) {
      const tags = tagM[1];
      const tagMatches = tags.match(/'([^']+)'/g);
      if (tagMatches) {
        currentTags = tagMatches.map((t: string) => t.replace(/'/g, ''));
      }
    }

    // When we hit the end of a tool entry (a line that's just '},' or '}'), check
    if (line.trim() === '},' || (line.trim() === '}' && currentId)) {
      if (currentTags.length === 0) {
        orphaned.push(currentId);
      } else {
        const hasMatch = currentTags.some(t => sceneNames.includes(t));
        if (!hasMatch) {
          orphaned.push(currentId);
        }
      }
      currentId = '';
      currentTags = [];
    }
  }

  return orphaned;
}

function findToolsWithoutSceneTags(lines: string[]): string[] {
  const ids: string[] = [];
  let inToolsArray = false;

  for (const line of lines) {
    if (line.includes('export const tools:')) inToolsArray = true;
    if (inToolsArray && line.trim() === '];') break;
    if (!inToolsArray) continue;

    const idM = line.match(/id:\s*'([^']+)'/);
    if (idM && !line.includes('sceneTags:')) {
      ids.push(idM[1]);
    }
  }
  return ids;
}

function findToolsUsingSceneTag(lines: string[], tag: string): string[] {
  const tools: string[] = [];
  let inToolsArray = false;

  for (const line of lines) {
    if (line.includes('export const tools:')) inToolsArray = true;
    if (inToolsArray && line.trim() === '];') break;
    if (!inToolsArray) continue;

    if (line.includes(`'${tag}'`)) {
      const idM = line.match(/id:\s*'([^']+)'/);
      if (idM) tools.push(idM[1]);
    }
  }
  return tools;
}

function findStaleEnhancedContent(lines: string[], validToolIds: string[]): string[] {
  const stale: string[] = [];
  const validSet = new Set(validToolIds);

  let inEnhanced = false;
  let inValue = false;
  let foundOpeningBrace = false;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.includes('AI_ENHANCED_CONTENT')) inEnhanced = true;
    if (inEnhanced && line.trim() === '};') break;
    
    // Only check within the VALUE (after the = {) not the type annotation
    if (inEnhanced && !foundOpeningBrace) {
      if (line.includes('= {')) {
        foundOpeningBrace = true;
        inValue = true;
      }
      continue;
    }
    
    if (inValue) {
      const m = line.match(/^\s{2}(\w+):\s*\{/);
      if (m && !validSet.has(m[1])) {
        stale.push(m[1]);
      }
    }
  }

  return stale;
}

function findAIContentBounds(lines: string[]): { declLine: number; valueOpenLine: number; endLine: number } | null {
  let declLine = -1;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('AI_ENHANCED_CONTENT')) {
      declLine = i;
      break;
    }
  }
  if (declLine === -1) return null;

  let braceDepth = 0;
  let inValue = false;
  let foundEquals = false;
  let valueOpenLine = declLine;

  for (let i = declLine; i < lines.length; i++) {
    const line = lines[i];
    for (const ch of line) {
      if (inValue) {
        if (ch === '{') braceDepth++;
        if (ch === '}') braceDepth--;
      } else {
        if (ch === '=') foundEquals = true;
        if (foundEquals && ch === '{') {
          inValue = true;
          braceDepth = 1;
          valueOpenLine = i;
          continue;
        }
      }
    }

    if (inValue && braceDepth === 0) {
      return { declLine, valueOpenLine, endLine: i };
    }
  }
  return null;
}

function formatContent(toolId: string, content: ReturnType<typeof generateForTool>): string {
  const linesArr: string[] = [];
  linesArr.push(`  ${toolId}: {`);

  linesArr.push('    tips: [');
  for (const tip of content.tips) {
    linesArr.push(`      '${escapeTS(tip)}',`);
  }
  linesArr.push('    ],');

  linesArr.push('    cases: [');
  for (const c of content.cases) {
    linesArr.push(`      { title: '${escapeTS(c.title)}', description: '${escapeTS(c.description)}', prompt: '${escapeTS(c.prompt)}' },`);
  }
  linesArr.push('    ],');

  linesArr.push('    guides: [');
  for (const g of content.guides) {
    linesArr.push(`      { title: '${escapeTS(g.title)}', steps: [`);
    for (const step of g.steps) {
      linesArr.push(`        '${escapeTS(step)}',`);
    }
    linesArr.push('      ] },');
  }
  linesArr.push('    ]');
  linesArr.push('  }');

  return linesArr.join('\n');
}

// ─── MAIN ───────────────────────────────────────────────────────────────────

function main() {
  const cmd = process.argv[2];

  if (!cmd) {
    console.log('AI导航站 — Content Management CLI');
    console.log('');
    console.log('Usage:');
    console.log('  npx tsx scripts/manage-content.ts add-tool <name> <category> <icon> <url> [<price>] [<difficulty>]');
    console.log('  npx tsx scripts/manage-content.ts enhance-all');
    console.log('  npx tsx scripts/manage-content.ts validate');
    console.log('  npx tsx scripts/manage-content.ts sync-scenes');
    console.log('');
    console.log('Commands:');
    console.log('  add-tool    Add a new tool with auto-assigned sceneTags');
    console.log('  enhance-all Generate enhanced content for all tools missing it');
    console.log('  validate    Run integrity checks on all content');
    console.log('  sync-scenes Auto-detect missing scenes from tool sceneTags');
    process.exit(0);
  }

  switch (cmd) {
    case 'add-tool':
      cmdAddTool(process.argv.slice(3));
      break;
    case 'enhance-all':
      cmdEnhanceAll();
      break;
    case 'validate':
      cmdValidate();
      break;
    case 'sync-scenes':
      cmdSyncScenes();
      break;
    default:
      console.error(`Unknown command: ${cmd}`);
      console.error('Valid commands: add-tool, enhance-all, validate, sync-scenes');
      process.exit(1);
  }
}

main();
