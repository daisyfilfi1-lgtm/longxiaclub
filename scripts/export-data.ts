import { tools, skills, dailyPicks, scenes } from '../data/tools';

const result = {
  tools: tools.map(t => ({
    id: t.id, name: t.name, logo: t.logo, description: t.description,
    url: t.url, price: t.price, difficulty: t.difficulty,
    heat: t.heat, heat_growth: t.heatGrowth,
    tags: t.tags, tech_tags: t.techTags, scene_tags: t.sceneTags,
    cost_tags: t.costTags, category: t.category,
    prompts: t.prompts, tips: t.tips,
    related_skills: t.relatedSkills,
    xhs_saves: t.xhsSaves,
    data: {
      cases: t.cases || [],
      guides: t.guides || [],
      enhancedTips: t.enhancedTips || []
    }
  })),
  skills: skills.map(s => ({
    id: s.id, name: s.name, description: s.description,
    category: s.category, difficulty: s.difficulty,
    author: s.author, version: s.version,
    install_count: s.installCount, success_rate: s.successRate,
    rating: s.rating, price: String(s.price),
    compatibility: s.compatibility, workflow: s.workflow,
    dependencies: s.dependencies, input: s.input, output: s.output,
    icon: s.icon, heat_growth: s.heatGrowth, heat: s.heat || 0
  })),
  dailyPicks: dailyPicks,
  scenes: scenes
};

process.stdout.write(JSON.stringify(result));
