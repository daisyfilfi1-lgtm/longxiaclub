/**
 * Quick verification script for scene architecture fix
 */
import { getSceneRelations } from './lib/knowledge-graph.ts';
import { scenes, dailyPicks } from './data/tools.ts';

console.log('=== SCENE VERIFICATION ===');

// 1. Check all dailyPicks point to valid scenes
const sceneIds = new Set(scenes.map(s => s.id));
console.log('\n1. DailyPicks validation:');
let allValid = true;
for (const dp of dailyPicks) {
  const isValid = sceneIds.has(dp.sceneId);
  if (!isValid) {
    console.log(`   ❌ dp ${dp.id}: sceneId='${dp.sceneId}' NOT FOUND`);
    allValid = false;
  } else {
    console.log(`   ✅ dp ${dp.id}: sceneId='${dp.sceneId}' -> '${scenes.find(s => s.id === dp.sceneId)?.name}'`);
  }
}
console.log(`   Result: ${allValid ? 'ALL VALID ✅' : 'SOME INVALID ❌'}`);

// 2. Check scene.name matches tool.sceneTags
console.log('\n2. Scene name → tool.sceneTags matching:');
const { tools } = await import('./data/tools.ts');
for (const scene of scenes) {
  const matchingTools = tools.filter(t => t.sceneTags.includes(scene.name));
  console.log(`   ${scene.name}: ${matchingTools.length} tools match via scene.name`);
  if (matchingTools.length > 0) {
    const toolNames = matchingTools.slice(0, 5).map(t => t.name).join(', ');
    console.log(`     tools: ${toolNames}${matchingTools.length > 5 ? '...' : ''}`);
  }
}

// 3. Test getSceneRelations
console.log('\n3. getSceneRelations test:');
const testScenes = ['办公提效', '编程开发', '设计创作', '学术研究', '短视频', '电商运营', '内容创作'];
for (const name of testScenes) {
  const result = getSceneRelations(name);
  const status = result.tools.length > 0 ? '✅' : '❌';
  console.log(`   ${status} ${name}: ${result.tools.length} tools, ${result.skills.length} skills`);
}
