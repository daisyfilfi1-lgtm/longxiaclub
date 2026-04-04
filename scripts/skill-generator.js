/**
 * Skill自动生成器
 * 功能：根据工具数据自动生成Skill配置
 * 
 * 使用: node scripts/skill-generator.js
 * 
 * 自动化集成:
 * - 可通过 package.json scripts 调用
 * - 可配合 CI/CD 自动执行
 */

import { tools } from '../data/tools.js';
import { writeFileSync } from 'fs';

// Skill生成配置
const SKILL_GENERATOR_CONFIG = {
  // 基于工具的category自动映射Skill category
  categoryMapping: {
    'AI对话': ['内容创作', '办公提效', '编程开发', '学术研究'],
    '图像生成': ['图像生成'],
    '视频生成': ['视频音频'],
    '音频生成': ['视频音频'],
    '办公工具': ['办公提效', '数据分析'],
    '效率工具': ['办公提效'],
  },
  
  // 每个工具生成的Skill模板
  skillTemplates: {
    prompt: {
      name: '{toolName}提示词优化',
      description: '提供专业的{toolName}提示词模板和使用技巧',
      category: '内容创作',
      workflow: [
        { step: 1, title: '选择场景', description: '选择你的使用场景' },
        { step: 2, title: '获取模板', description: '获取最佳提示词模板' },
        { step: 3, title: '个性化调整', description: '根据需求调整' },
      ]
    },
    tutorial: {
      name: '{toolName}入门教程',
      description: '从零开始学习{toolName}，快速上手',
      category: '办公提效',
      workflow: [
        { step: 1, title: '基础介绍', description: '了解{toolName}核心功能' },
        { step: 2, title: '实操演练', description: '跟着教程练习' },
        { step: 3, title: '进阶技巧', description: '学习高级用法' },
      ]
    }
  },
  
  // AI处理配置
  ai: {
    provider: 'deepseek',
    model: 'deepseek-chat',
    maxTokens: 3000
  }
};

/**
 * 从工具生成对应的Skills
 */
function generateSkillsFromTool(tool) {
  const generatedSkills = [];
  
  // 1. 生成提示词优化Skill
  if (tool.prompts && tool.prompts.length > 0) {
    generatedSkills.push({
      id: `skill_${tool.id}_prompt`,
      name: `${tool.name}提示词优化`,
      description: `提供专业的${tool.name}提示词模板，覆盖${tool.prompts.map(p => p.scene).join('、')}等场景`,
      category: '内容创作',
      difficulty: tool.difficulty || 'beginner',
      author: 'AI导航站-Auto',
      version: '1.0.0',
      installCount: Math.floor(Math.random() * 5000) + 1000,
      successRate: Math.floor(Math.random() * 10) + 85,
      rating: (Math.random() * 0.5 + 4.3).toFixed(1),
      price: 'free',
      compatibility: [tool.name],
      workflow: [
        { step: 1, title: '选择场景', description: '选择你的使用场景' },
        { step: 2, title: '获取模板', description: '获取最佳提示词模板' },
        { step: 3, title: '个性化调整', description: '根据需求调整' },
      ],
      dependencies: [{ name: tool.name }],
      input: '使用场景描述',
      output: '优化后的提示词',
      icon: '💡',
      heatGrowth: Math.floor(Math.random() * 20) + 5
    });
  }
  
  // 2. 生成教程Skill
  if (tool.tips && tool.tips.length > 0) {
    generatedSkills.push({
      id: `skill_${tool.id}_tutorial`,
      name: `${tool.name}入门到精通`,
      description: `系统学习${tool.name}，从入门到精通的完整教程`,
      category: '办公提效',
      difficulty: 'beginner',
      author: 'AI导航站-Auto',
      version: '1.0.0',
      installCount: Math.floor(Math.random() * 8000) + 2000,
      successRate: Math.floor(Math.random() * 10) + 85,
      rating: (Math.random() * 0.5 + 4.3).toFixed(1),
      price: 'free',
      compatibility: [tool.name],
      workflow: [
        { step: 1, title: '基础入门', description: `了解${tool.name}核心功能` },
        { step: 2, title: '实操演练', description: '跟着教程练习' },
        { step: 3, title: '进阶技巧', description: '学习高级用法' },
      ],
      dependencies: [{ name: tool.name, optional: true }],
      input: '学习目标',
      output: '学习路径 + 实践任务',
      icon: '📚',
      heatGrowth: Math.floor(Math.random() * 15) + 3
    });
  }
  
  return generatedSkills;
}

/**
 * 使用AI增强Skill描述
 */
async function enhanceSkillWithAI(skill, tool) {
  const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;
  const DEEPSEEK_BASE_URL = process.env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com';
  
  if (!DEEPSEEK_API_KEY) {
    console.log(`  ⚠️ 未配置DeepSeek API，跳过AI增强`);
    return skill;
  }
  
  const prompt = `
你是AI工具专家。请为以下Skill生成更精准的描述和更丰富的工作流程。

## 工具信息
- 名称: ${tool.name}
- 描述: ${tool.description}
- 官方链接: ${tool.url}

## Skill信息
- 名称: ${skill.name}
- 当前描述: ${skill.description}

请生成增强版的：
1. 更精准的description（50字以内）
2. 4个更具体的工作流程步骤

输出JSON格式：
{
  "description": "增强描述",
  "workflow": [
    {"step": 1, "title": "步骤标题", "description": "步骤描述"},
    ...
  ]
}
`;

  try {
    const response = await fetch(`${DEEPSEEK_BASE_URL}/v1/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: '你是一个AI工具内容专家，擅长生成精准的Skill描述。' },
          { role: 'user', content: prompt }
        ],
        max_tokens: 1000,
        temperature: 0.7
      })
    });
    
    if (!response.ok) return skill;
    
    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    
    if (content) {
      try {
        const enhanced = JSON.parse(content);
        return {
          ...skill,
          description: enhanced.description || skill.description,
          workflow: enhanced.workflow || skill.workflow
        };
      } catch {
        return skill;
      }
    }
  } catch (error) {
    console.log(`  ⚠️ AI增强失败: ${error.message}`);
  }
  
  return skill;
}

/**
 * 主函数
 */
async function main() {
  console.log('🚀 Skill自动生成器启动\n');
  console.log(`📋 待处理工具: ${tools.length} 个\n`);
  
  const allGeneratedSkills = [];
  
  for (const tool of tools) {
    console.log(`\n📌 处理工具: ${tool.name}`);
    
    // 生成Skills
    const generated = generateSkillsFromTool(tool);
    console.log(`  ✅ 生成 ${generated.length} 个Skills`);
    
    // AI增强
    for (const skill of generated) {
      const enhanced = await enhanceSkillWithAI(skill, tool);
      allGeneratedSkills.push(enhanced);
    }
    
    // 避免请求过快
    await new Promise(r => setTimeout(r, 1000));
  }
  
  // 输出结果
  console.log(`\n\n📊 生成结果汇总:`);
  console.log(`   总计生成Skills: ${allGeneratedSkills.length} 个`);
  
  // 按category统计
  const byCategory = {};
  for (const skill of allGeneratedSkills) {
    byCategory[skill.category] = (byCategory[skill.category] || 0) + 1;
  }
  console.log('\n📈 分类统计:');
  for (const [cat, count] of Object.entries(byCategory)) {
    console.log(`   ${cat}: ${count} 个`);
  }
  
  // 保存到文件
  const outputPath = './data/generated-skills.json';
  writeFileSync(outputPath, JSON.stringify({
    skills: allGeneratedSkills,
    generatedAt: new Date().toISOString(),
    toolCount: tools.length
  }, null, 2));
  console.log(`\n💾 结果已保存到 ${outputPath}`);
  
  // 输出可导入的代码片段
  console.log('\n📋 可添加到 data/tools.ts 的代码:');
  console.log('// 以下代码可替换 export const skills 中的内容');
  console.log(`// 共 ${allGeneratedSkills.length} 个Skills`);
  
  return allGeneratedSkills;
}

// 运行
main().catch(console.error);

// 导出供其他模块使用
export { generateSkillsFromTool, enhanceSkillWithAI };
