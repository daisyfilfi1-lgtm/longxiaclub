// This script extracts tools, skills, and scenes data and writes them as JSON files
import { tools } from '../data/tools';
import { skills } from '../data/tools';
import { scenes } from '../data/tools';
import * as fs from 'fs';

const output = {
  tools: tools.map(t => ({
    id: t.id,
    name: t.name,
    logo: t.logo,
    description: t.description,
    url: t.url,
    price: t.price,
    difficulty: t.difficulty,
    heat: t.heat,
    heatGrowth: t.heatGrowth,
    tags: t.tags,
    techTags: t.techTags,
    sceneTags: t.sceneTags,
    costTags: t.costTags,
    category: t.category,
    prompts: t.prompts,
    tips: t.tips,
    relatedSkills: t.relatedSkills,
    xhsSaves: t.xhsSaves || 0,
    enhancedTips: t.enhancedTips || [],
    cases: t.cases || [],
    guides: t.guides || [],
    contentUpdatedAt: t.contentUpdatedAt || ''
  })),
  skills: skills.map(s => ({
    id: s.id,
    name: s.name,
    description: s.description,
    category: s.category,
    difficulty: s.difficulty,
    author: s.author,
    version: s.version,
    installCount: s.installCount,
    successRate: s.successRate,
    rating: s.rating,
    price: s.price,
    compatibility: s.compatibility,
    workflow: s.workflow,
    dependencies: s.dependencies,
    input: s.input,
    output: s.output,
    icon: s.icon,
    heatGrowth: s.heatGrowth,
    heat: s.heat || 0,
    githubStars: s.githubStars || 0,
    githubForks: s.githubForks || 0
  })),
  scenes: scenes.map(s => ({
    id: s.id,
    name: s.name,
    icon: s.icon,
    description: s.description,
    coverImage: s.coverImage,
    toolCount: s.toolCount,
    skillCount: s.skillCount,
    xhsSaves: s.xhsSaves,
    tags: s.tags,
    solutions: s.solutions
  }))
};

fs.mkdirSync('/tmp/ai-nav-data', { recursive: true });
fs.writeFileSync('/tmp/ai-nav-data/tools.json', JSON.stringify(output.tools, null, 2));
fs.writeFileSync('/tmp/ai-nav-data/skills.json', JSON.stringify(output.skills, null, 2));
fs.writeFileSync('/tmp/ai-nav-data/scenes.json', JSON.stringify(output.scenes, null, 2));

console.log('Data extracted successfully!');
console.log(`Tools count: ${output.tools.length}`);
console.log(`Skills count: ${output.skills.length}`);
console.log(`Scenes count: ${output.scenes.length}`);
