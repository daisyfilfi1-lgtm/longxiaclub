// CommonJS script to extract data - run with node --loader ts-node/esm
const path = require('path');

// Use ts-node to require the TypeScript file
require('ts-node').register({ project: path.join(__dirname, '..', 'tsconfig.json') });

// Now we can require it, but we need to handle the @/ alias
// Let's just read the file and evaluate it manually
const fs = require('fs');
const ts = require('typescript');

const filePath = path.join(__dirname, '..', 'data', 'tools.ts');
const source = fs.readFileSync(filePath, 'utf-8');

// Try to compile and run it
const result = ts.transpileModule(source, {
  compilerOptions: {
    module: ts.ModuleKind.CommonJS,
    target: ts.ScriptTarget.ES2020,
    esModuleInterop: true,
    strict: false,
    paths: { '@/*': ['../*'] },
    baseUrl: path.join(__dirname, '..')
  }
});

// Write the transpiled code
const outPath = '/tmp/ai-nav-data/tools-transpiled.js';
fs.mkdirSync('/tmp/ai-nav-data', { recursive: true });
fs.writeFileSync(outPath, result.outputText);
// Also write a wrapper that extracts the data
const wrapper = `
const { tools, skills, scenes } = require('./tools-transpiled');
const fs = require('fs');

const output = {
  tools: tools.map(t => ({
    id: t.id, name: t.name, logo: t.logo, description: t.description,
    url: t.url, price: t.price, difficulty: t.difficulty,
    heat: t.heat, heatGrowth: t.heatGrowth,
    tags: t.tags, techTags: t.techTags, sceneTags: t.sceneTags,
    costTags: t.costTags, category: t.category,
    prompts: t.prompts || [], tips: t.tips || [],
    relatedSkills: t.relatedSkills || [],
    xhsSaves: t.xhsSaves || 0,
    enhancedTips: t.enhancedTips || [],
    cases: t.cases || [], guides: t.guides || [],
    contentUpdatedAt: t.contentUpdatedAt || ''
  })),
  skills: skills.map(s => ({
    id: s.id, name: s.name, description: s.description,
    category: s.category, difficulty: s.difficulty,
    author: s.author, version: s.version,
    installCount: s.installCount, successRate: s.successRate,
    rating: s.rating, price: s.price,
    compatibility: s.compatibility || [],
    workflow: s.workflow || [], dependencies: s.dependencies || [],
    input: s.input, output: s.output, icon: s.icon,
    heatGrowth: s.heatGrowth, heat: s.heat || 0,
    githubStars: s.githubStars || 0, githubForks: s.githubForks || 0
  })),
  scenes: scenes.map(s => ({
    id: s.id, name: s.name, icon: s.icon,
    description: s.description, coverImage: s.coverImage,
    toolCount: s.toolCount, skillCount: s.skillCount,
    xhsSaves: s.xhsSaves, tags: s.tags || [],
    solutions: s.solutions || []
  }))
};

fs.writeFileSync('/tmp/ai-nav-data/tools.json', JSON.stringify(output.tools, null, 2));
fs.writeFileSync('/tmp/ai-nav-data/skills.json', JSON.stringify(output.skills, null, 2));
fs.writeFileSync('/tmp/ai-nav-data/scenes.json', JSON.stringify(output.scenes, null, 2));
console.log('OK');
console.log('tools:', output.tools.length);
console.log('skills:', output.skills.length);
console.log('scenes:', output.scenes.length);
`;

fs.writeFileSync('/tmp/ai-nav-data/run-extract.js', wrapper);

console.log('Setup complete. Run: node /tmp/ai-nav-data/run-extract.js');
