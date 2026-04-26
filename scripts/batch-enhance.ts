/**
 * batch-enhance.ts
 * 
 * Runs the content generator and patches the AI_ENHANCED_CONTENT object
 * in data/tools.ts with the generated content.
 * 
 * Usage: npx tsx scripts/batch-enhance.ts
 * 
 * This script:
 * 1. Reads the current data/tools.ts
 * 2. Generates enhanced content for all tools not yet in AI_ENHANCED_CONTENT
 * 3. Patches the AI_ENHANCED_CONTENT object in tools.ts
 * 4. Writes the updated tools.ts back
 */

import { tools } from '../data/tools';
import { generateForTool } from './generate-enhanced-content';
import * as fs from 'fs';
import * as path from 'path';

// ─── Helpers ─────────────────────────────────────────────────────────────────

function escapeTS(str: string): string {
  return str
    .replace(/\\/g, '\\\\')
    .replace(/'/g, "\\'")
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '');
}

function formatContent(toolId: string, content: ReturnType<typeof generateForTool>): string {
  const lines: string[] = [];
  lines.push(`  ${toolId}: {`);
  
  lines.push('    tips: [');
  for (const tip of content.tips) {
    lines.push(`      '${escapeTS(tip)}',`);
  }
  lines.push('    ],');
  
  lines.push('    cases: [');
  for (const c of content.cases) {
    lines.push(`      { title: '${escapeTS(c.title)}', description: '${escapeTS(c.description)}', prompt: '${escapeTS(c.prompt)}' },`);
  }
  lines.push('    ],');
  
  lines.push('    guides: [');
  for (const g of content.guides) {
    lines.push(`      { title: '${escapeTS(g.title)}', steps: [`);
    for (const step of g.steps) {
      lines.push(`        '${escapeTS(step)}',`);
    }
    lines.push('      ] },');
  }
  lines.push('    ]');
  lines.push('  }');
  
  return lines.join('\n');
}

function findAIContentBounds(text: string): { declLine: number; endLine: number; } | null {
  const lines = text.split('\n');
  
  let declLine = -1;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('AI_ENHANCED_CONTENT')) {
      declLine = i;
      break;
    }
  }
  if (declLine === -1) return null;

  // Now find the closing }; at the root level
  // First, find the opening { of the VALUE (the = {)
  // We need to skip the type annotation, which spans lines 4-7 in the original
  let braceDepth = 0;
  let inValue = false;
  let foundEquals = false;
  
  for (let i = declLine; i < lines.length; i++) {
    const line = lines[i];
    
    for (const ch of line) {
      if (inValue) {
        if (ch === '{') braceDepth++;
        if (ch === '}') braceDepth--;
      } else {
        // Looking for the = sign that separates type annotation from value
        // Once we see =, the next { starts the value
        if (ch === '=') foundEquals = true;
        if (foundEquals && ch === '{') {
          inValue = true;
          braceDepth = 1;
          continue;
        }
        // Skip characters in type annotation
      }
    }
    
    // Check if we found the closing
    if (inValue && braceDepth === 0) {
      // This line should be `};` or `};` with whitespace
      return { declLine, endLine: i };
    }
  }
  
  return null;
}

// ─── Main ────────────────────────────────────────────────────────────────────

function main() {
  const toolsFilePath = path.resolve(__dirname, '..', 'data', 'tools.ts');

  if (!fs.existsSync(toolsFilePath)) {
    console.error(`ERROR: Could not find tools.ts at ${toolsFilePath}`);
    process.exit(1);
  }

  const source = fs.readFileSync(toolsFilePath, 'utf-8');
  const lines = source.split('\n');

  const bounds = findAIContentBounds(source);
  if (!bounds) {
    console.error('ERROR: Could not find AI_ENHANCED_CONTENT block in tools.ts');
    process.exit(1);
  }

  // Extract the content block lines: from first opening { after = to the closing };
  // Find the actual opening { of the value (the first { after =)
  let valueOpenLine = bounds.declLine;
  for (let i = bounds.declLine; i <= bounds.endLine; i++) {
    if (lines[i].includes('= {')) {
      valueOpenLine = i;
      break;
    }
  }
  
  const contentLines = lines.slice(valueOpenLine, bounds.endLine + 1);
  
  // Find existing tool IDs from lines like "  toolId: {"
  const existingIds = new Set<string>();
  for (const line of contentLines) {
    const match = line.match(/^\s{2}(\w+):\s*\{/);
    if (match) existingIds.add(match[1]);
  }

  console.log(`Found ${existingIds.size} existing tools in AI_ENHANCED_CONTENT:`, [...existingIds].join(', '));

  const toolsToGenerate = tools.filter(t => !existingIds.has(t.id));

  if (toolsToGenerate.length === 0) {
    console.log('All tools already have enhanced content. Nothing to do.');
    process.exit(0);
  }

  console.log(`Generating enhanced content for ${toolsToGenerate.length} tools...`);

  const generatedEntries: string[] = [];
  for (const tool of toolsToGenerate) {
    const content = generateForTool(tool);
    generatedEntries.push(formatContent(tool.id, content));
    console.log(`  ✓ ${tool.id} (${tool.name})`);
  }

  // Build the new content block by replacing the closing '};' with new entries + '};'
  // Take all lines before the closing '};', add new entries, then '};'
  
  // First, ensure the last existing entry has a trailing comma
  // Look backwards from bounds.endLine for the last line that ends with '}'
  // (the closing brace of the last tool entry)
  let lastEntryLine = bounds.endLine - 1;
  while (lastEntryLine > valueOpenLine) {
    const trimmed = lines[lastEntryLine].trim();
    if (trimmed === '}' || trimmed === '},') {
      break;
    }
    lastEntryLine--;
  }
  
  // If the last entry doesn't have a comma, add one
  if (lines[lastEntryLine].trim() === '}') {
    lines[lastEntryLine] = lines[lastEntryLine] + ',';
  }

  // Now insert new entries before the closing };
  const beforeClosing = lines.slice(0, bounds.endLine);
  const afterClosing = lines.slice(bounds.endLine);

  const newLines: string[] = [];
  for (let i = 0; i < generatedEntries.length; i++) {
    if (i > 0) newLines.push('');
    const entryLines = generatedEntries[i].split('\n');
    for (const el of entryLines) {
      newLines.push(el);
    }
    // Add comma after the closing } of each generated entry
    newLines[newLines.length - 1] = newLines[newLines.length - 1] + ',';
  }

  const newFileLines = [...beforeClosing, '', ...newLines, ...afterClosing];
  const newSource = newFileLines.join('\n');

  fs.writeFileSync(toolsFilePath, newSource, 'utf-8');

  console.log();
  console.log(`✅ Successfully patched ${toolsFilePath}`);
  console.log(`   Added enhanced content for ${toolsToGenerate.length} tools:`);
  for (const t of toolsToGenerate) {
    console.log(`   - ${t.id} (${t.name})`);
  }
  console.log();
  console.log(`Run 'npx tsx scripts/generate-enhanced-content.ts' to preview raw output.`);
  console.log(`Run 'npx tsx scripts/batch-enhance.ts' again to regenerate for new tools.`);
}

main();
