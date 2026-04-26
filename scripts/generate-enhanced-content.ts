/**
 * generate-enhanced-content.ts
 * 
 * Auto-generates tips, cases, and guides for any AI tool based on its
 * category, tags, description, and prompts.
 * 
 * Usage: npx tsx scripts/generate-enhanced-content.ts
 * 
 * Outputs a TypeScript code snippet with the complete AI_ENHANCED_CONTENT
 * object that can be pasted into data/tools.ts.
 */

import { tools } from '../data/tools';

// ─── Category content templates ──────────────────────────────────────────────
// Each category has default-suitable tips/cases/guides that are then
// specialized per tool using its name, description, tags, and existing tips.

type ContentTemplate = {
  tips: ((tool: typeof tools[0]) => string)[];
  cases: ((tool: typeof tools[0]) => { title: string; description: string; prompt: string })[];
  beginnerGuideSteps: ((tool: typeof tools[0]) => string[]);
  advancedGuideSteps: ((tool: typeof tools[0]) => string[]);
};

const categoryTemplates: Record<string, ContentTemplate> = {

  'AI对话': {
    tips: (t) => [
      `使用"角色扮演"技巧：先给${t.name}设定角色（如资深程序员），再提问，可获得更专业的回答`,
      `利用"Few-shot Learning"：在提问时给出几个示例，让${t.name}理解你想要的输出格式`,
      `用"迭代追问"逐步深入：先问宽泛问题，根据回答再追问细节，获得深度分析`,
      `善用系统提示词：设定AI的角色、语气、专业领域，输出更符合预期`,
      `将复杂任务拆解为多个小步骤，分步提问可获得更准确的结果`,
    ],
    cases: (t) => [
      {
        title: '专业文案创作',
        description: `使用${t.name}生成高质量营销或品牌文案`,
        prompt: `请帮我撰写一篇关于[产品或主题]的专业文案，要求：1. 明确目标受众 2. 突出核心卖点 3. 包含Call to Action 4. 语气与品牌调性一致`,
      },
      {
        title: '数据分析与洞察',
        description: `用${t.name}分析数据并生成可读报告`,
        prompt: `请分析以下数据，给出：1. 关键发现和数据趋势 2. 异常点和可能的原因 3. 可执行的业务建议 4. 下一步行动计划\n数据：[粘贴数据]`,
      },
      {
        title: '知识学习助手',
        description: `用${t.name}辅助学习新知识领域`,
        prompt: `请作为[领域]专家，用通俗易懂的方式向我解释以下概念：\n1. 核心定义\n2. 工作原理\n3. 实际应用场景\n4. 与其他相关概念的关系\n概念：[填写概念名称]`,
      },
    ],
    beginnerGuideSteps: (t) => [
      `访问 ${t.name} 的官网并注册账号`,
      `选择适合的版本（免费版通常已足够日常使用）`,
      `在对话框中清晰描述你的需求或问题`,
      `根据回答进行追问，细化需求以获得更精准的结果`,
      `保存有用的对话以便后续参考和复用`,
    ],
    advancedGuideSteps: (t) => [
      '使用结构化提示词模板（角色+背景+任务+输出格式）',
      '利用多轮对话构建上下文，让AI理解复杂场景',
      '结合外部工具或插件实现联网搜索、代码执行等高级功能',
      '使用Few-shot示例引导AI输出你期望的格式和风格',
      '定期整理和优化你的提示词库，建立个人最佳实践',
    ],
  },

  '图像生成': {
    tips: (t) => [
      `使用详细的主体描述：包括颜色、材质、光照、角度等细节，生成更精准的图像`,
      `在提示词中加入风格关键词（摄影风格/插画风格/3D渲染等）来定向输出`,
      `利用负面提示词（negative prompt）排除不想要的元素和风格`,
      `调整参数控制生成效果：分辨率、风格强度、生成步数等`,
      `先用低分辨率快速生成预览，满意后再提升画质`,
    ],
    cases: (t) => [
      {
        title: '品牌视觉素材',
        description: `用${t.name}生成品牌宣传视觉素材`,
        prompt: 'Brand visual for [brand_name], [industry] style, professional color palette, clean composition, high-end feel, suitable for social media and website --ar 16:9',
      },
      {
        title: '概念设计图',
        description: `用${t.name}快速生成设计概念方案`,
        prompt: 'Concept art of [subject], [style], cinematic lighting, detailed texture, atmospheric, professional quality, ultra detailed --ar 16:9',
      },
      {
        title: '产品展示图',
        description: `用${t.name}生成产品场景图`,
        prompt: '[Product] in [scene/environment], professional product photography, soft studio lighting, minimalist background, high detail, 8k --ar 4:3',
      },
    ],
    beginnerGuideSteps: (t) => [
      `访问 ${t.name} 的官方平台`,
      `注册账号并了解免费额度`,
      `学习基本的提示词结构：主体 + 风格 + 环境 + 参数`,
      `从简单的描述开始，逐步增加细节`,
      `使用预设模板或社区分享的提示词快速上手`,
    ],
    advancedGuideSteps: (t) => [
      '使用高级参数控制生成精度（采样器、CFG、步数等）',
      '结合ControlNet/Reference等工具精确控制构图和风格',
      '使用LoRA模型训练特定风格或角色',
      '批量生成并通过参数组合筛选最佳结果',
      '后期结合其他工具进行修图和细节调整',
    ],
  },

  '视频生成': {
    tips: (t) => [
      `描述视频时包含镜头运动（推/拉/摇/移）让动态效果更丰富`,
      `使用具体的光照描述（黄昏/逆光/霓虹）提升画面质感`,
      `先确定视频时长和节奏，再设计分镜脚本`,
      `利用${t.name}的关键帧功能控制画面变化节奏`,
      `结合文字脚本生成与画面匹配的旁白或字幕`,
    ],
    cases: (t) => [
      {
        title: '短视频营销',
        description: `用${t.name}生成产品营销短视频`,
        prompt: 'Create a 15-second product showcase video: [product] in [setting], smooth camera movement, professional lighting, engaging transitions, suitable for social media',
      },
      {
        title: '创意视觉特效',
        description: `用${t.name}生成创意视频片段`,
        prompt: 'Cinematic shot of [subject] in [environment], dramatic lighting, slow motion effect, high detail, atmospheric, cinematic color grading',
      },
    ],
    beginnerGuideSteps: (t) => [
      `访问 ${t.name} 并注册账号`,
      `了解平台的免费额度和功能限制`,
      `从文字生成视频开始，输入简单的场景描述`,
      `选择合适的视频风格和比例`,
      `预览结果，调整提示词获得更好效果`,
    ],
    advancedGuideSteps: (t) => [
      '使用图像+文字的双重输入方式精确控制视频内容',
      '结合镜头运动参数制作丰富的动态效果',
      '利用关键帧功能实现画面内容的平滑过渡',
      '批量生成视频片段并进行后期剪辑拼接',
      '调整色彩、光照和风格参数实现专业视觉效果',
    ],
  },

  '音频生成': {
    tips: (t) => [
      `描述音乐风格时要具体：包含节奏、乐器、情绪等要素`,
      `通过参考歌曲或风格标签精准生成目标风格的音乐`,
      `利用${t.name}的参数调节音色和音质`,
      `先简短片段测试，满意后再生成完整内容`,
      `注意检查生成内容的版权条款和商用限制`,
    ],
    cases: (t) => [
      {
        title: '背景音乐制作',
        description: `用${t.name}为视频或播客生成背景音乐`,
        prompt: 'Create a [length]-second background music track, [genre] style, [mood] mood, instrumental, suitable for [use_case], professional quality',
      },
      {
        title: '语音内容生成',
        description: `用${t.name}生成专业的语音内容`,
        prompt: 'Generate [language] speech with [accent] accent, [emotion] tone, natural pacing, clear pronunciation for the following text: [text content]',
      },
    ],
    beginnerGuideSteps: (t) => [
      `打开 ${t.name} 平台并创建账号`,
      `了解不同版本的功能和定价`,
      `从简单的文本转语音或音乐生成开始尝试`,
      `选择预设的风格和声音模板`,
      `导出生成的内容并应用到项目中`,
    ],
    advancedGuideSteps: (t) => [
      '使用高级参数精确控制音色、音调和节奏',
      '利用声音克隆功能创建专属声音模型',
      '多轨合成：将生成的音轨与其他音频混合制作',
      '批量生成不同版本并通过A/B测试选择最佳效果',
      '结合音频编辑软件进行后期处理和优化',
    ],
  },

  '编程开发': {
    tips: (t) => [
      `描述任务时明确指定编程语言和框架，获得更精确的代码`,
      `提供代码上下文：粘贴相关文件的关键部分让AI理解整体架构`,
      `使用"分步实现"策略：先让AI设计方案，再逐步生成代码`,
      `明确说明代码质量要求：性能、可读性、安全性、错误处理`,
      `善用${t.name}的代码审查功能发现潜在问题和优化空间`,
    ],
    cases: (t) => [
      {
        title: '功能模块开发',
        description: `用${t.name}快速实现一个功能模块`,
        prompt: `请用[编程语言]实现以下功能模块：\n1. 功能描述：[详细说明]\n2. 输入/输出规范\n3. 需要处理边缘情况\n4. 遵循最佳实践，添加错误处理和注释`,
      },
      {
        title: '代码审查与重构',
        description: `用${t.name}审查和改进现有代码`,
        prompt: `请审查以下代码，提供：\n1. 潜在的bug和安全隐患\n2. 性能优化建议\n3. 代码结构改进方案\n4. 最佳实践建议\n代码：[粘贴代码]`,
      },
      {
        title: 'API接口开发',
        description: `用${t.name}设计和实现API接口`,
        prompt: `请设计并实现一个[RESTful/GraphQL] API接口：\n1. 功能：[描述接口功能]\n2. 请求/响应格式\n3. 认证和授权方式\n4. 错误处理和状态码\n5. 数据验证逻辑`,
      },
    ],
    beginnerGuideSteps: (t) => [
      `安装并配置 ${t.name}`,
      `从简单的代码补全和问答开始熟悉`,
      `尝试用自然语言描述功能需求，让AI生成代码`,
      `学会提供足够的上下文信息以获得更好的结果`,
      `逐步尝试更复杂的任务：重构、调试、测试生成`,
    ],
    advancedGuideSteps: (t) => [
      '建立项目的代码规范和提示指令文件',
      '使用多文件上下文理解大型项目架构',
      '结合CI/CD流程自动化代码审查和测试生成',
      '利用AI辅助进行架构设计和技术方案评审',
      '建立可复用的提示词模板库提升团队效率',
    ],
  },

  '办公工具': {
    tips: (t) => [
      `用${t.name}自动化重复性办公任务，大幅提升效率`,
      `提供清晰的结构化输入（如Markdown格式）可获得更规范的输出`,
      `利用模板功能建立常用内容格式，一键生成`,
      `将${t.name}与其他办公软件联动，实现工作流自动化`,
      `用${t.name}进行内容审核、润色和格式标准化`,
    ],
    cases: (t) => [
      {
        title: '自动化报告生成',
        description: `用${t.name}自动生成周报/月报`,
        prompt: `请根据以下工作内容生成一份专业的周报：\n[工作内容]\n要求：1. 分类清晰 2. 数据量化 3. 突出成果 4. 包含下周计划`,
      },
      {
        title: '文档处理与优化',
        description: `用${t.name}提升文档质量和可读性`,
        prompt: `请优化以下文档：\n1. 提升语言表达的专业性和流畅度\n2. 优化结构和逻辑层次\n3. 统一术语和格式规范\n4. 完善关键数据和引用\n文档：[粘贴内容]`,
      },
    ],
    beginnerGuideSteps: (t) => [
      `注册并登录 ${t.name}`,
      `了解平台支持的文件格式和导入方式`,
      `从一个简单的任务开始：生成文档/PPT/表格`,
      `使用预设模板快速创建标准格式内容`,
      `导出结果并根据需要进行微调`,
    ],
    advancedGuideSteps: (t) => [
      '建立自定义模板库，统一团队输出标准',
      '使用批量处理功能同时生成多个文档',
      '结合API实现与现有系统的自动化集成',
      '利用版本管理追踪文档变更历史',
      '设计协同工作流，多人协作编辑AI生成内容',
    ],
  },

  'AI搜索': {
    tips: (t) => [
      `使用具体的搜索词和限定词，${t.name}能返回更精准的结果`,
      `利用高级搜索选项（学术/新闻/视频分类）定向获取信息`,
      `通过追问和细化问题深入挖掘搜索结果`,
      `验证AI搜索结果的来源可靠性，${t.name}通常提供引用链`,
      `保存有价值的搜索会话，便于后续回溯和整理`,
    ],
    cases: (t) => [
      {
        title: '深度研究报告',
        description: `用${t.name}进行课题深度研究`,
        prompt: `请对"[研究主题]"进行深度研究，包含：\n1. 最新进展和突破\n2. 主要争议和不同观点\n3. 关键参与方和研究机构\n4. 未来发展趋势\n5. 每个观点请提供来源引用`,
      },
      {
        title: '事实核查验证',
        description: `用${t.name}验证信息真实性`,
        prompt: `请核查以下陈述的真实性，提供可靠来源支持或反驳：\n[陈述内容]\n要求：1. 区分确认/存疑/错误 2. 提供权威来源链接 3. 说明判断依据`,
      },
      {
        title: '竞品市场调研',
        description: `用${t.name}收集竞品和市场信息`,
        prompt: `请对[行业/领域]进行市场调研：\n1. 主要竞争对手和产品\n2. 市场份额和增长趋势\n3. 技术创新方向\n4. 用户评价和痛点\n5. 最新行业动态`,
      },
    ],
    beginnerGuideSteps: (t) => [
      `访问 ${t.name} 搜索平台`,
      `在搜索框输入问题或关键词`,
      `查看搜索结果及来源引用`,
      `根据结果追问获取更多细节`,
      `收藏有用的搜索结果和会话`,
    ],
    advancedGuideSteps: (t) => [
      '使用高级搜索语法精确控制搜索范围',
      '组合多个搜索角度进行交叉验证',
      '利用API实现自动化信息采集和监控',
      '建立个人知识库，整理和归类搜索成果',
      '设置信息更新提醒，追踪热点话题变化',
    ],
  },

  '3D生成': {
    tips: (t) => [
      `描述3D模型时包含拓扑结构、面数等参数以控制输出质量`,
      `使用参考图作为输入可大幅提升生成模型的准确度`,
      `利用${t.name}的纹理生成功能为模型添加材质和贴图`,
      `先快速生成低精度的草稿，满意后再提升分辨率`,
      `注意输出格式兼容性，选择适合后续编辑的格式`,
    ],
    cases: (t) => [
      {
        title: '产品3D模型',
        description: `用${t.name}为产品生成3D展示模型`,
        prompt: 'Create a 3D model of [product], detailed geometry, PBR textures, suitable for [use_case], export format: [glb/fbx/obj]',
      },
      {
        title: '场景概念设计',
        description: `用${t.name}生成3D场景概念`,
        prompt: 'Generate a 3D scene of [environment], [style] style, realistic lighting, detailed environment, atmospheric effects, game-ready asset',
      },
    ],
    beginnerGuideSteps: (t) => [
      `访问 ${t.name} 并注册账号`,
      `了解基本功能和免费额度`,
      `从简单的文本生成3D开始尝试`,
      `尝试上传参考图进行图生3D`,
      `导出生成的模型并在3D软件中查看`,
    ],
    advancedGuideSteps: (t) => [
      '使用高级参数控制模型拓扑和精度',
      '结合多视角参考图生成更准确的模型',
      '利用纹理烘焙功能创建高质量PBR材质',
      '批量生成多个变体并通过对比选择最佳结果',
      '将生成模型导入游戏引擎或3D软件进一步优化',
    ],
  },
};

// Default template for categories not explicitly defined
const defaultTemplate: ContentTemplate = {
  tips: (t) => [
    `充分利用${t.name}的核心功能来解决实际工作场景中的问题`,
    `了解${t.name}的最新版本和更新特性，持续提升使用效率`,
    `关注官方教程和社区资源，学习${t.name}的最佳实践`,
    `从简单任务开始，逐步探索${t.name}的高级功能和集成能力`,
    `定期评估${t.name}的使用效果，优化工作流程`,
  ],
  cases: (t) => [
    {
      title: '入门实践',
      description: `使用${t.name}完成第一个实际任务`,
      prompt: `请帮我完成以下任务：[任务描述]\n要求：\n1. 清晰的输出格式\n2. 可执行的步骤\n3. 符合最佳实践`,
    },
    {
      title: '工作流优化',
      description: `将${t.name}集成到日常工作流程`,
      prompt: `请分析我的工作流程：\n[描述工作流程]\n并建议：\n1. ${t.name}可以在哪些环节提效\n2. 具体的集成方案\n3. 预期效果和度量方式`,
    },
  ],
  beginnerGuideSteps: (t) => [
    `注册并了解${t.name}的基本功能`,
    `完成平台提供的入门教程或示例`,
    `尝试第一个简单的任务来熟悉操作流程`,
    `探索平台的主要功能和设置选项`,
    `查看帮助文档和FAQ解决常见问题`,
  ],
  advancedGuideSteps: (t) => [
    '掌握平台的高级功能和参数设置',
    '结合其他工具和平台构建完整工作流',
    '利用API或扩展功能实现自动化和集成',
    '深入理解技术原理，优化使用策略',
    '参与社区分享和学习高级使用技巧',
  ],
};

// ─── Content generation ──────────────────────────────────────────────────────

function generateForTool(tool: typeof tools[0]) {
  const template = categoryTemplates[tool.category] || defaultTemplate;

  // Generate 5 tips, incorporate any existing tips the tool already has
  const existingTips = tool.tips || [];
  const generatedTips = template.tips(tool);
  
  // If tool already has some tips, merge and deduplicate, ensuring 5 total
  const allTips = [...existingTips, ...generatedTips];
  const tipSet = new Set<string>();
  const uniqueTips: string[] = [];
  for (const tip of allTips) {
    if (!tipSet.has(tip) && uniqueTips.length < 5) {
      tipSet.add(tip);
      uniqueTips.push(tip);
    }
  }
  // Pad with generic tips if still < 5
  while (uniqueTips.length < 5) {
    uniqueTips.push(`探索${tool.name}的更多高级功能以提升工作效率`);
  }

  // Generate cases (up to 3)
  const generatedCases = template.cases(tool);
  // Try to use existing prompts for inspiration in cases if available
  const existingPrompts = tool.prompts || [];
  const cases = generatedCases.slice(0, Math.min(3, generatedCases.length));

  // Generate guides
  const beginnerSteps = template.beginnerGuideSteps(tool);
  const advancedSteps = template.advancedGuideSteps(tool);

  return {
    tips: uniqueTips,
    cases,
    guides: [
      { title: '新手入门指南', steps: beginnerSteps },
      { title: '进阶使用技巧', steps: advancedSteps },
    ],
  };
}

// ─── Main ────────────────────────────────────────────────────────────────────

function main() {
  const existingEnhancedIds = new Set([
    'chatgpt', 'midjourney', 'kimi', 'gamma', 'claude',
  ]);

  // Collect all tools that are NOT yet in AI_ENHANCED_CONTENT
  const toolsToGenerate = tools.filter(t => !existingEnhancedIds.has(t.id));

  console.log(`// ═══════════════════════════════════════════════════════════════`);
  console.log(`// AUTO-GENERATED by scripts/generate-enhanced-content.ts`);
  console.log(`// Generated at: ${new Date().toISOString()}`);
  console.log(`// Tools processed: ${toolsToGenerate.length}`);
  console.log(`// ═══════════════════════════════════════════════════════════════`);
  console.log();
  console.log(`// Add this to data/tools.ts, merging with the existing AI_ENHANCED_CONTENT:`);
  console.log();

  // Output each tool's content as a code snippet
  for (const tool of toolsToGenerate) {
    const content = generateForTool(tool);
    console.log(`// ── ${tool.name} (${tool.id}) ──`);
    console.log(`${tool.id}: {`);
    console.log(`  tips: [`);
    for (const tip of content.tips) {
      console.log(`    '${escapeString(tip)}',`);
    }
    console.log(`  ],`);
    console.log(`  cases: [`);
    for (const c of content.cases) {
      console.log(`    { title: '${escapeString(c.title)}', description: '${escapeString(c.description)}', prompt: '${escapeString(c.prompt)}' },`);
    }
    console.log(`  ],`);
    console.log(`  guides: [`);
    for (const g of content.guides) {
      console.log(`    { title: '${escapeString(g.title)}', steps: [`);
      for (const step of g.steps) {
        console.log(`      '${escapeString(step)}',`);
      }
      console.log(`    ] },`);
    }
    console.log(`  ]`);
    console.log(`},`);
    console.log();
  }
  
  // Summary
  console.log(`// ═══════════════════════════════════════════════════════════════`);
  console.log(`// Generated enhanced content for ${toolsToGenerate.length} tools:`);
  for (const t of toolsToGenerate) {
    console.log(`//   - ${t.id} (${t.name}) [${t.category}]`);
  }
  console.log(`// ═══════════════════════════════════════════════════════════════`);
}

function escapeString(str: string): string {
  return str
    .replace(/\\/g, '\\\\')
    .replace(/'/g, "\\'")
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '');
}

// Only run if executed directly (not imported)
const isDirectRun = process.argv[1]?.endsWith('generate-enhanced-content.ts');
if (isDirectRun) {
  main();
}

export { generateForTool, categoryTemplates, main };
