import { Tool, Skill, Scene, DailyPick } from '@/types';

// AI增强内容数据 - 后续可扩展为自动采集
const AI_ENHANCED_CONTENT: Record<string, {
  tips: string[];
  cases: { title: string; description: string; prompt?: string }[];
  guides: { title: string; steps: string[] }[];
}> = {
  chatgpt: {
    tips: [
      '使用"角色扮演"技巧：先给ChatGPT设定角色（如资深程序员），再提问，可获得更专业的回答',
      '利用"Few-shot Learning"：在提问时给出几个示例，让ChatGPT理解你想要的输出格式',
      '用"迭代追问"逐步深入：先问宽泛问题，根据回答再追问细节，获得深度分析',
      '善用系统提示词：设定AI的角色、语气、专业领域，输出更符合预期',
      '结合插件实现实时信息：启用Browsing插件获取最新信息'
    ],
    cases: [
      { title: '小红书爆款文案', description: '生成吸引眼球的电商文案', prompt: '请帮我写一篇关于[产品名称]的小红书文案，要求：1.开头有吸引力 2.使用emoji 3.包含3-5个卖点 4.结尾有call to action' },
      { title: '代码审查与优化', description: '帮助审查和改进代码质量', prompt: '请审查以下代码，指出潜在问题并提供优化建议：[代码片段]' },
      { title: '学术论文润色', description: '提升学术写作质量', prompt: '请帮我润色以下学术论文段落，使其更专业、更流畅：[论文内容]' }
    ],
    guides: [
      { title: '新手入门指南', steps: ['1. 访问 chat.openai.com 注册账号', '2. 选择 GPT-3.5（免费）或 GPT-4（付费）模型', '3. 在输入框中描述你的需求或问题', '4. 根据回答进行追问或调整提示词', '5. 保存有用的对话以便后续参考'] },
      { title: '高级提示词技巧', steps: ['1. 使用系统提示设定AI角色和行为方式', '2. 用清晰的结构化格式说明任务要求', '3. 提供上下文和背景信息', '4. 指定输出格式（JSON、列表、段落等）', '5. 用例子说明期望的输出风格'] }
    ]
  },
  midjourney: {
    tips: [
      '使用--ar参数控制图片比例，如--ar 16:9适合横版，--ar 9:16适合竖版',
      '利用--s参数控制风格强度，数值越高越接近参考风格',
      '在提示词中加入光照参数如"cinematic lighting"、"soft studio lighting"提升质感',
      '使用--v 6版本对文字支持更好，可生成含文字的图片',
      '在Discord关注他人作品的prompt，学习高级技巧'
    ],
    cases: [
      { title: '产品场景图', description: '生成电商产品展示图', prompt: 'Product photography, [product] on a marble table, soft natural lighting, minimalist style, high-end luxury feel, 8k --ar 3:4' },
      { title: '创意头像', description: '生成个人品牌头像', prompt: 'Portrait illustration, [style], [person description], clean background, professional avatar, --ar 1:1' },
      { title: 'Logo设计', description: 'AI生成品牌Logo', prompt: 'Minimalist [industry] logo design, vector style, white background, flat design, geometric shapes --ar 1:1' }
    ],
    guides: [
      { title: '基础入门', steps: ['1. 加入Midjourney Discord服务器', '2. 在#generate频道输入/imagine', '3. 输入英文提示词', '4. 等待生成4张图片', '5. 使用U1-U4放大、V1-V4生成变体'] },
      { title: '提示词高级技巧', steps: ['1. 主体描述要具体详细', '2. 添加风格关键词（摄影/插画/3D等）', '3. 指定光照和材质', '4. 添加--ar控制比例', '5. 使用--s控制风格强度'] }
    ]
  },
  kimi: {
    tips: [
      '支持最长20万字上下文，可以一次性输入整篇论文或长文档',
      '直接拖拽PDF/Word/Excel文件到对话框，自动分析内容',
      '联网搜索功能可以获取实时信息，回答最新问题',
      '支持多语言翻译和润色，英语论文翻译质量很高',
      '会议纪要功能可以自动提取关键信息和大纲'
    ],
    cases: [
      { title: 'PDF论文解析', description: '快速理解论文核心内容', prompt: '请分析以下PDF论文，提取：1.核心观点 2.研究方法 3.主要结论 4.创新点' },
      { title: '会议纪要生成', description: '自动生成结构化会议记录', prompt: '根据以下会议记录，生成包含：议题、讨论要点、行动计划、待办事项的会议纪要' },
      { title: '长文档问答', description: '基于文档回答问题', prompt: '根据上传的[文档]，回答以下问题：[问题]' }
    ],
    guides: [
      { title: '文件处理', steps: ['1. 打开 kimi.moonshot.cn', '2. 拖拽文件到对话框或点击上传按钮', '3. 等待文件解析完成', '4. 输入具体问题或任务', '5. 获取分析结果'] },
      { title: '高效提问', steps: ['1. 明确任务类型（总结/翻译/分析等）', '2. 提供清晰的上下文', '3. 指定输出格式', '4. 追问细化需求', '5. 保存重要结果'] }
    ]
  },
  gamma: {
    tips: [
      '输入主题后AI会自动生成大纲，可以修改后再生成PPT',
      '支持导入PDF文档自动提取内容生成PPT',
      '选择模板后可以在线编辑文字、图片、图表',
      '可以一键切换PPT风格，如商务、创意、学术等',
      '生成的PPT支持导出为PDF或直接在线演示'
    ],
    cases: [
      { title: '学术答辩PPT', description: '自动生成论文答辩演示', prompt: '生成一份关于"[论文主题]"的学术答辩PPT，包含：研究背景、研究方法、实验结果、结论与展望' },
      { title: '商业计划书', description: '创业项目商业计划', prompt: '为"[项目名称]"生成商业计划书PPT，包含：市场痛点、解决方案、商业模式、竞争优势、财务预测' },
      { title: '培训课件', description: '企业内部培训材料', prompt: '创建"[培训主题]"培训课件，包含：课程目标、知识点讲解、案例分析、课后练习' }
    ],
    guides: [
      { title: '快速生成', steps: ['1. 访问 gamma.app', '2. 点击"Generate"按钮', '3. 输入PPT主题或大纲', '4. 选择模板风格', '5. 等待生成完成后编辑'] },
      { title: '优化技巧', steps: ['1. 详细描述PPT内容要求', '2. 指定目标受众和场景', '3. 选择合适的配色方案', '4. 手动调整AI生成的文字', '5. 添加品牌元素'] }
    ]
  },
  claude: {
    tips: [
      'Claude 3.5 Sonnet 性价比最高，适合大多数任务',
      'Artifacts功能可以创建可交互的网页、应用、文档',
      '支持上传文件进行分析，特别擅长代码和文档',
      'Writing功能可以帮你润色文章、写出专业内容',
      '用"Thinking"模式处理复杂推理问题更准确'
    ],
    cases: [
      { title: '代码重构', description: '优化代码结构和性能', prompt: '请分析以下代码，提出重构建议：1.提升可读性 2.优化性能 3.最佳实践 4.潜在bug修复' },
      { title: '文章润色', description: '提升写作质量', prompt: '请润色以下文章：1.提升语言表达 2.优化逻辑结构 3.调整语气风格' },
      { title: '数据解读', description: '分析数据并给出洞察', prompt: '分析以下数据：[数据]，给出：1.关键发现 2.趋势分析 3.业务建议' }
    ],
    guides: [
      { title: '快速上手', steps: ['1. 访问 claude.ai', '2. 注册账号并选择免费/付费版', '3. 在对话框输入任务', '4. 上传文件或链接', '5. 追问优化结果'] },
      { title: '高效使用', steps: ['1. 使用快捷指令(/shortcut)提升效率', '2. 开启Artifacts创建交互内容', '3. 粘贴代码时说明编程语言', '4. 用复制粘贴保存重要回复', '5. 探索Settings中的个性化设置'] }
    ]
  }
};

// 辅助函数：为工具添加增强内容
function enhanceTool(baseTool: Tool): Tool {
  const enhanced = AI_ENHANCED_CONTENT[baseTool.id];
  if (!enhanced) return baseTool;
  return {
    ...baseTool,
    tips: [...(baseTool.tips || []), ...enhanced.tips.slice(0, 2)],
    enhancedTips: enhanced.tips,
    cases: enhanced.cases,
    guides: enhanced.guides,
    contentUpdatedAt: new Date().toISOString()
  };
}

export const tools: Tool[] = [
  enhanceTool({ id: 'chatgpt', name: 'ChatGPT', logo: '🤖', description: 'OpenAI开发的对话式AI助手，支持文本生成、代码编写、问答等多种任务', url: 'https://chat.openai.com', price: 'freemium', difficulty: 'beginner', heat: 77.9, heatGrowth: 12.6, tags: ['AI对话', '文本生成', '代码助手'], techTags: ['NLP', 'GenerativeAI'], sceneTags: ['办公提效', '内容创作', '编程开发'], costTags: ['Freemium', '需翻墙'], category: 'AI对话', prompts: [{ id: 'p1', title: '小红书爆款文案生成', content: '请帮我写一篇关于[产品名称]的小红书文案，要求：1.开头有吸引力 2.使用emoji 3.包含3-5个卖点 4.结尾有call to action', scene: '电商运营' }, { id: 'p2', title: '周报生成助手', content: '根据以下本周工作内容，生成一份专业的周报：\n[工作内容列表]\n要求：分点清晰、数据量化、突出成果', scene: '办公提效' }, { id: 'p3', title: '论文摘要改写', content: '请将以下论文摘要改写为适合大众阅读的科普版本，要求通俗易懂，保留核心观点：\n[论文摘要]', scene: '学术研究' }], tips: ['使用GPT-4可获得更好的推理能力', '可以上传图片进行多模态对话', 'Custom GPTs可针对特定任务优化'], relatedSkills: ['skill_xhs_rewrite', 'skill_weekly_report'], xhsSaves: 1250000 }),
  enhanceTool({ id: 'midjourney', name: 'Midjourney', logo: '🎨', description: 'AI图像生成工具，通过文本描述生成高质量艺术图像', url: 'https://www.midjourney.com', price: 'paid', difficulty: 'intermediate', heat: 74, heatGrowth: 10.4, tags: ['AI绘画', '图像生成', '创意设计'], techTags: ['GenerativeMedia', 'Diffusion'], sceneTags: ['设计创作', '电商运营', '内容创作'], costTags: ['Paid', '需翻墙'], category: '图像生成', prompts: [{ id: 'p1', title: '产品场景图', content: 'Product photography, [product] on a marble table, soft natural lighting, minimalist style, high-end luxury feel, 8k --ar 3:4', scene: '电商运营' }, { id: 'p2', title: '头像生成', content: 'Portrait illustration, [style], [person description], clean background, professional avatar, --ar 1:1', scene: '个人品牌' }], tips: ['使用--ar参数控制图片比例', 'v6版本对文字支持更好', '可以在Discord中查看他人Prompt学习'], relatedSkills: ['skill_batch_image'] }),
  enhanceTool({ id: 'gamma', name: 'Gamma', logo: '📊', description: 'AI驱动的演示文稿生成工具，一句话生成完整PPT', url: 'https://gamma.app', price: 'freemium', difficulty: 'beginner', heat: 59.4, heatGrowth: 21.4, tags: ['PPT生成', '演示文稿', '办公工具'], techTags: ['GenerativeAI'], sceneTags: ['办公提效', '商业计划书', '课程大纲'], costTags: ['Freemium', '中文友好'], category: '办公工具', prompts: [{ id: 'p1', title: '学术答辩PPT', content: '生成一份关于"[论文主题]"的学术答辩PPT，包含：研究背景、研究方法、实验结果、结论与展望', scene: '学术研究' }, { id: 'p2', title: '商业计划书', content: '为"[项目名称]"生成商业计划书PPT，包含：市场痛点、解决方案、商业模式、竞争优势、财务预测', scene: '创业' }], tips: ['支持导入PDF文档自动生成PPT', '可以选择不同风格模板', '生成后可以在线编辑'], relatedSkills: ['skill_auto_ppt'] }),
  enhanceTool({ id: 'kimi', name: 'Kimi', logo: '🌙', description: '月之暗面推出的AI助手，支持超长上下文和文件分析', url: 'https://kimi.moonshot.cn', price: 'free', difficulty: 'beginner', heat: 65.2, heatGrowth: 35.8, tags: ['AI对话', '长文本', '文件分析'], techTags: ['NLP', 'RAG'], sceneTags: ['办公提效', '学术研究', '内容创作'], costTags: ['Free', '中文友好'], category: 'AI对话', prompts: [{ id: 'p1', title: 'PDF论文解析', content: '请分析以下PDF论文，提取核心观点、研究方法、结论，并列出可能的应用场景：', scene: '学术研究' }, { id: 'p2', title: '会议纪要生成', content: '根据以下会议记录，生成结构化的会议纪要，包含：议题、讨论要点、行动计划、待办事项', scene: '办公提效' }], tips: ['支持最多20万字上下文', '可以直接读取PDF、Word、Excel等文件', '支持联网搜索'], relatedSkills: [] }),
  enhanceTool({ id: 'claude', name: 'Claude', logo: '🧊', description: 'Anthropic推出的AI助手，擅长分析、写作和代码', url: 'https://claude.ai', price: 'freemium', difficulty: 'intermediate', heat: 72.3, heatGrowth: 8.2, tags: ['AI对话', '代码助手', '分析工具'], techTags: ['NLP', 'GenerativeAI'], sceneTags: ['编程开发', '内容创作', '办公提效'], costTags: ['Freemium', '需翻墙'], category: 'AI对话', prompts: [{ id: 'p1', title: '代码重构建议', content: '请分析以下代码，提出重构建议以提升可读性和性能：\n[代码]', scene: '编程开发' }, { id: 'p2', title: '文章润色', content: '请润色以下文章，提升语言表达和逻辑连贯性：\n[文章内容]', scene: '内容创作' }], tips: ['Claude 3.5 Sonnet 性价比最高', 'Artifacts功能可以创建交互式内容', '支持上传文件进行分析'], relatedSkills: [] }),
  { id: 'runway', name: 'Runway', logo: '🎬', description: 'AI视频生成和编辑平台，支持文生视频、图生视频', url: 'https://runwayml.com', price: 'freemium', difficulty: 'intermediate', heat: 58.6, heatGrowth: 15.3, tags: ['AI视频', '视频编辑', '视频生成'], techTags: ['GenerativeMedia', 'VideoAI'], sceneTags: ['内容创作', '短视频', '影视制作'], costTags: ['Freemium', '需翻墙'], category: '视频生成', prompts: [{ id: 'p1', title: '文字生成视频', content: 'A cinematic shot of a [subject] in [environment], [camera movement], highly detailed, 8k', scene: '创意视频' }, { id: 'p2', title: '图片生成视频', content: 'Animate this image with [specific motion], smooth movement, realistic', scene: '视频制作' }], tips: ['Gen-2支持文字生成视频', '提供多种预设风格', '可以在现有视频上进行AI编辑'], relatedSkills: [] },
  { id: 'suno', name: 'Suno', logo: '🎵', description: 'AI音乐生成工具，可以用文字描述生成完整歌曲', url: 'https://suno.com', price: 'freemium', difficulty: 'beginner', heat: 62.8, heatGrowth: 28.7, tags: ['AI音乐', '音乐生成', '音频工具'], techTags: ['GenerativeMedia', 'AudioAI'], sceneTags: ['内容创作', '短视频', '音乐制作'], costTags: ['Freemium', '需翻墙'], category: '音频生成', prompts: [{ id: 'p1', title: '流行歌曲生成', content: 'Generate a pop song about [topic], upbeat tempo, catchy melody, verse-chorus structure', scene: '音乐创作' }, { id: 'p2', title: '背景音乐生成', content: 'Create an instrumental background music, ambient, calm, suitable for [scenario]', scene: '视频配乐' }], tips: ['支持生成带歌词的完整歌曲', '可以选择音乐风格和乐器', '生成的音乐可用于商业用途'], relatedSkills: [] },
];

// 完整的Skills库 - 由skill-generator.js自动生成和维护
export const skills: Skill[] = [
  // ===== 内容创作类 =====
  { id: 'skill_xhs_rewrite', name: '小红书文案改写', description: '将普通文案改写成小红书风格的爆款文案，支持种草/测评/干货等多场景', category: '内容创作', difficulty: 'beginner', author: 'AI导航站', version: '1.2.0', installCount: 12500, successRate: 94, rating: 4.8, price: 'free', compatibility: ['ChatGPT', 'Claude', 'Kimi', '文心一言'], workflow: [{ step: 1, title: '输入原文案', description: '提供需要改写的原始文案' }, { step: 2, title: '选择风格', description: '选择目标风格（种草/测评/干货/ Plog）' }, { step: 3, title: 'AI改写', description: '生成3个小红书风格的文案版本' }, { step: 4, title: '优化调整', description: '根据需要微调后发布' }], dependencies: [], input: '原始文案 + 目标风格', output: '小红书风格爆款文案', icon: '📕', heatGrowth: 25.3 },
  { id: 'skill_wechat_article', name: '公众号文章生成', description: '自动生成适合微信公众号的高质量文章，支持多种写作风格', category: '内容创作', difficulty: 'beginner', author: 'AI导航站', version: '1.1.0', installCount: 8900, successRate: 92, rating: 4.7, price: 'free', compatibility: ['ChatGPT', 'Claude', 'Kimi'], workflow: [{ step: 1, title: '输入主题', description: '确定文章主题和核心观点' }, { step: 2, title: '选择风格', description: '选择写作风格（专业/亲和/故事化）' }, { step: 3, title: 'AI生成', description: '生成完整文章包含标题、开头、正文、结尾' }, { step: 4, title: '配图建议', description: '获取文章配图建议' }], dependencies: [], input: '文章主题 + 风格偏好', output: '完整公众号文章', icon: '📝', heatGrowth: 22.1 },
  { id: 'skill_short_video_script', name: '短视频脚本创作', description: '为抖音/快手/视频号生成爆款短视频脚本，包含分镜和台词', category: '内容创作', difficulty: 'intermediate', author: 'AI导航站', version: '1.3.0', installCount: 15600, successRate: 89, rating: 4.9, price: 'free', compatibility: ['ChatGPT', 'Kimi', 'Claude'], workflow: [{ step: 1, title: '输入主题', description: '确定视频主题和目标受众' }, { step: 2, title: '选择类型', description: '选择视频类型（种草/剧情/知识/搞笑）' }, { step: 3, title: 'AI生成脚本', description: '生成完整分镜脚本' }, { step: 4, title: '台词优化', description: '优化台词提升完播率' }], dependencies: [], input: '视频主题 + 类型', output: '完整短视频脚本', icon: '🎬', heatGrowth: 35.6 },
  { id: 'skill_weibo_content', name: '微博文案生成', description: '生成适合微博平台的短文案，支持话题标签和热门玩法', category: '内容创作', difficulty: 'beginner', author: 'AI导航站', version: '1.0.0', installCount: 5600, successRate: 91, rating: 4.6, price: 'free', compatibility: ['ChatGPT', 'Kimi', '文心一言'], workflow: [{ step: 1, title: '输入核心信息', description: '提供要传播的核心信息' }, { step: 2, title: '选择玩法', description: '选择微博玩法（话题/抽奖/互动）' }, { step: 3, title: 'AI生成', description: '生成多个文案版本' }], dependencies: [], input: '核心信息 + 玩法', output: '微博文案', icon: '📱', heatGrowth: 15.2 },
  { id: 'skill_ecommerce_copy', name: '电商商品描述', description: '为淘宝/京东/拼多多等平台生成高转化率的商品卖点文案', category: '内容创作', difficulty: 'beginner', author: 'AI导航站', version: '1.2.0', installCount: 11200, successRate: 93, rating: 4.8, price: 'free', compatibility: ['ChatGPT', 'Claude', 'Kimi'], workflow: [{ step: 1, title: '输入商品信息', description: '提供商品名称、特点、卖点' }, { step: 2, title: '选择平台', description: '选择目标电商平台' }, { step: 3, title: 'AI生成', description: '生成主图视频脚本+详情页文案' }], dependencies: [], input: '商品信息 + 平台', output: '商品文案 + 主图脚本', icon: '🛒', heatGrowth: 28.4 },

  // ===== 办公提效类 =====
  { id: 'skill_auto_ppt', name: '自动PPT生成', description: '根据主题自动生成专业PPT大纲和内容，支持多种风格模板', category: '办公提效', difficulty: 'beginner', author: 'AI导航站', version: '1.3.0', installCount: 19800, successRate: 91, rating: 4.7, price: 'free', compatibility: ['Gamma', 'ChatGPT', 'Kimi'], workflow: [{ step: 1, title: '输入主题', description: '提供PPT的主题和大纲' }, { step: 2, title: 'AI生成', description: '生成完整的PPT内容' }, { step: 3, title: '导出', description: '导出为PPT或直接在线编辑' }], dependencies: [], input: 'PPT主题', output: 'PPT大纲和内容', icon: '📊', heatGrowth: 18.6 },
  { id: 'skill_weekly_report', name: '周报月报生成', description: '根据工作内容自动生成结构化的周报/月报，突出工作成果', category: '办公提效', difficulty: 'beginner', author: 'AI导航站', version: '1.1.0', installCount: 22400, successRate: 95, rating: 4.9, price: 'free', compatibility: ['ChatGPT', 'Claude', 'Kimi', '文心一言'], workflow: [{ step: 1, title: '输入工作内容', description: '列出本周/本月完成的工作' }, { step: 2, title: 'AI生成', description: '自动生成结构化周报' }, { step: 3, title: '调整润色', description: '根据需要调整数据和措辞' }], dependencies: [], input: '工作内容列表', output: '结构化周报/月报', icon: '📅', heatGrowth: 32.1 },
  { id: 'skill_email_write', name: '专业邮件撰写', description: '生成商务邮件、求职邮件、感谢信等各类正式邮件', category: '办公提效', difficulty: 'beginner', author: 'AI导航站', version: '1.0.0', installCount: 7800, successRate: 93, rating: 4.6, price: 'free', compatibility: ['ChatGPT', 'Claude'], workflow: [{ step: 1, title: '选择邮件类型', description: '选择邮件用途（商务/求职/感谢）' }, { step: 2, title: '输入关键信息', description: '提供收件人、主题、核心内容' }, { step: 3, title: 'AI生成', description: '生成完整邮件' }], dependencies: [], input: '邮件类型 + 关键信息', output: '专业邮件', icon: '✉️', heatGrowth: 14.8 },
  { id: 'skill_meeting_summary', name: '会议纪要整理', description: '上传会议录音或文字，自动生成结构化的会议纪要', category: '办公提效', difficulty: 'intermediate', author: 'AI导航站', version: '1.1.0', installCount: 6500, successRate: 88, rating: 4.5, price: 'free', compatibility: ['Kimi', 'ChatGPT', '讯飞听见'], workflow: [{ step: 1, title: '输入会议内容', description: '粘贴会议记录或上传录音' }, { step: 2, title: 'AI分析', description: '提取关键讨论点和决议' }, { step: 3, title: '生成纪要', description: '输出结构化会议纪要' }, { step: 4, title: '提取待办', description: '自动提取待办事项' }], dependencies: [], input: '会议记录/录音', output: '结构化会议纪要 + 待办', icon: '📋', heatGrowth: 19.3 },
  { id: 'skill_resume_optimize', name: '简历优化', description: '优化简历内容，提升求职竞争力通过ATS筛选', category: '办公提效', difficulty: 'beginner', author: 'AI导航站', version: '1.2.0', installCount: 14300, successRate: 90, rating: 4.8, price: 'free', compatibility: ['ChatGPT', 'Claude'], workflow: [{ step: 1, title: '输入简历', description: '粘贴当前简历内容' }, { step: 2, title: '选择岗位', description: '输入目标职位' }, { step: 3, title: 'AI优化', description: '生成优化后的简历' }], dependencies: [], input: '原始简历 + 目标岗位', output: '优化后简历', icon: '📄', heatGrowth: 24.5 },

  // ===== 图像生成类 =====
  { id: 'skill_product_image', name: '电商产品图生成', description: '为商品生成高质量的产品场景图，提升商品吸引力', category: '图像生成', difficulty: 'beginner', author: 'AI导航站', version: '1.1.0', installCount: 9800, successRate: 87, rating: 4.7, price: 'free', compatibility: ['Midjourney', 'Stable Diffusion', 'DALL-E'], workflow: [{ step: 1, title: '输入商品信息', description: '描述商品外观和特点' }, { step: 2, title: '选择场景', description: '选择想要的场景风格' }, { step: 3, title: 'AI生成', description: '生成多张产品图' }], dependencies: [], input: '商品描述 + 场景风格', output: '产品场景图', icon: '🛍️', heatGrowth: 21.7 },
  { id: 'skill_avatar_design', name: '头像设计', description: '生成个人品牌头像、社交媒体头像，支持多种风格', category: '图像生成', difficulty: 'beginner', author: 'AI导航站', version: '1.0.0', installCount: 18500, successRate: 92, rating: 4.8, price: 'free', compatibility: ['Midjourney', 'Stable Diffusion', 'Leonardo AI'], workflow: [{ step: 1, title: '输入特征', description: '描述头像主题和个人特征' }, { step: 2, title: '选择风格', description: '选择头像风格（卡通/写实/插画）' }, { step: 3, title: 'AI生成', description: '生成多个头像方案' }], dependencies: [], input: '人物描述 + 风格', output: '头像图片', icon: '👤', heatGrowth: 26.2 },
  { id: 'skill_logo_design', name: 'Logo设计', description: 'AI生成品牌Logo设计方案，支持多种创意风格', category: '图像生成', difficulty: 'intermediate', author: 'AI导航站', version: '1.1.0', installCount: 7200, successRate: 85, rating: 4.6, price: 'free', compatibility: ['Midjourney', 'DALL-E', 'Stable Diffusion'], workflow: [{ step: 1, title: '输入品牌信息', description: '提供品牌名称、行业、定位' }, { step: 2, title: '选择风格', description: '选择Logo风格' }, { step: 3, title: 'AI生成', description: '生成多个Logo方案' }, { step: 4, title: '优化调整', description: '选择方案进行微调' }], dependencies: [], input: '品牌信息 + 风格', output: 'Logo设计方案', icon: '🎨', heatGrowth: 17.8 },

  // ===== 编程开发类 =====
  { id: 'skill_code_review', name: '代码审查优化', description: 'AI自动审查代码，提出优化建议和潜在问题修复', category: '编程开发', difficulty: 'intermediate', author: 'AI导航站', version: '1.2.0', installCount: 8900, successRate: 94, rating: 4.9, price: 'free', compatibility: ['Claude', 'ChatGPT', 'Cursor'], workflow: [{ step: 1, title: '粘贴代码', description: '粘贴需要审查的代码' }, { step: 2, title: '选择语言', description: '指定编程语言' }, { step: 3, title: 'AI审查', description: '全面审查代码' }, { step: 4, title: '应用建议', description: '查看并应用优化建议' }], dependencies: [], input: '源代码 + 语言', output: '审查报告 + 优化建议', icon: '🔍', heatGrowth: 23.4 },
  { id: 'skill_api_doc', name: 'API文档生成', description: '根据代码自动生成专业的API接口文档', category: '编程开发', difficulty: 'intermediate', author: 'AI导航站', version: '1.0.0', installCount: 4500, successRate: 88, rating: 4.5, price: 'free', compatibility: ['ChatGPT', 'Claude', 'Cursor'], workflow: [{ step: 1, title: '粘贴代码', description: '粘贴API接口代码' }, { step: 2, title: 'AI生成', description: '自动生成文档' }, { step: 3, title: '导出', description: '导出为Markdown/Swagger格式' }], dependencies: [], input: 'API代码', output: 'API文档', icon: '📚', heatGrowth: 12.6 },
  { id: 'skill_unit_test', name: '单元测试生成', description: '自动为代码生成单元测试用例，提高代码覆盖率', category: '编程开发', difficulty: 'intermediate', author: 'AI导航站', version: '1.1.0', installCount: 6200, successRate: 91, rating: 4.7, price: 'free', compatibility: ['Claude', 'ChatGPT', 'Cursor'], workflow: [{ step: 1, title: '粘贴代码', description: '粘贴需要测试的代码' }, { step: 2, title: '选择框架', description: '指定测试框架（Jest/Mocha等）' }, { step: 3, title: 'AI生成', description: '生成测试用例' }], dependencies: [], input: '源代码 + 测试框架', output: '单元测试代码', icon: '🧪', heatGrowth: 16.8 },

  // ===== 学术研究类 =====
  { id: 'skill_paper_polish', name: '学术论文润色', description: '提升学术论文的语言表达，确保语法正确和学术规范', category: '学术研究', difficulty: 'intermediate', author: 'AI导航站', version: '1.2.0', installCount: 16800, successRate: 93, rating: 4.9, price: 'free', compatibility: ['ChatGPT', 'Claude', 'Kimi', 'DeepL'], workflow: [{ step: 1, title: '输入论文', description: '粘贴论文段落或全文' }, { step: 2, title: '选择语言', description: '选择目标语言（中文/英文）' }, { step: 3, title: 'AI润色', description: '生成润色版本' }, { step: 4, title: '对比调整', description: '对比原文调整' }], dependencies: [], input: '论文内容 + 目标语言', output: '润色后论文', icon: '📃', heatGrowth: 29.7 },
  { id: 'skill_literature_review', name: '文献综述辅助', description: '辅助生成文献综述，快速整理研究领域的已有工作', category: '学术研究', difficulty: 'advanced', author: 'AI导航站', version: '1.1.0', installCount: 7500, successRate: 86, rating: 4.6, price: 'free', compatibility: ['Kimi', 'ChatGPT', 'Claude'], workflow: [{ step: 1, title: '输入主题', description: '输入研究主题' }, { step: 2, title: '收集文献', description: '上传或粘贴相关文献摘要' }, { step: 3, title: 'AI整理', description: '生成综述框架' }, { step: 4, title: '完善内容', description: '填充内容并调整' }], dependencies: [], input: '研究主题 + 文献', output: '文献综述', icon: '📖', heatGrowth: 18.9 },
  { id: 'skill_thesis_abstract', name: '论文摘要改写', description: '将学术论文摘要改写为适合不同场景的版本', category: '学术研究', difficulty: 'intermediate', author: 'AI导航站', version: '1.0.0', installCount: 5400, successRate: 89, rating: 4.5, price: 'free', compatibility: ['ChatGPT', 'Claude', 'Kimi'], workflow: [{ step: 1, title: '输入摘要', description: '粘贴原始论文摘要' }, { step: 2, title: '选择场景', description: '选择改写场景（投稿/申请/科普）' }, { step: 3, title: 'AI改写', description: '生成改写版本' }], dependencies: [], input: '原始摘要 + 场景', output: '改写后摘要', icon: '✍️', heatGrowth: 13.2 },

  // ===== 数据分析类 =====
  { id: 'skill_data_analysis', name: '数据分析报告', description: '自动分析数据并生成可视化图表和解读报告', category: '数据分析', difficulty: 'intermediate', author: 'AI导航站', version: '1.2.0', installCount: 8200, successRate: 88, rating: 4.7, price: 'free', compatibility: ['ChatGPT', 'Claude', 'Excel', 'Python'], workflow: [{ step: 1, title: '上传数据', description: '上传Excel/CSV数据文件' }, { step: 2, title: '描述需求', description: '说明分析目标和问题' }, { step: 3, title: 'AI分析', description: '生成分析结果和图表' }, { step: 4, title: '生成报告', description: '输出完整分析报告' }], dependencies: [], input: '数据文件 + 分析目标', output: '分析报告 + 图表', icon: '📈', heatGrowth: 22.8 },
  { id: 'skill_chart_generation', name: '图表代码生成', description: '根据数据自动生成可视化图表代码（ECharts/Plotly/D3）', category: '数据分析', difficulty: 'intermediate', author: 'AI导航站', version: '1.0.0', installCount: 4800, successRate: 92, rating: 4.6, price: 'free', compatibility: ['ChatGPT', 'Claude'], workflow: [{ step: 1, title: '输入数据', description: '提供数据或描述数据特征' }, { step: 2, title: '选择图表', description: '选择想要的图表类型' }, { step: 3, title: 'AI生成', description: '生成图表代码' }], dependencies: [], input: '数据 + 图表类型', output: '图表代码', icon: '📊', heatGrowth: 14.5 },

  // ===== 视频音频类 =====
  { id: 'skill_video_subtitle', name: '视频字幕生成', description: '为视频自动生成字幕，支持多种语言和格式', category: '视频音频', difficulty: 'beginner', author: 'AI导航站', version: '1.1.0', installCount: 6800, successRate: 90, rating: 4.6, price: 'free', compatibility: ['剪映', '讯飞听见', 'Whisper'], workflow: [{ step: 1, title: '上传视频', description: '上传视频文件' }, { step: 2, title: '选择语言', description: '选择视频语言' }, { step: 3, title: 'AI生成', description: '生成字幕文件' }], dependencies: [], input: '视频文件', output: '字幕文件(SRT/ASS)', icon: '🎥', heatGrowth: 16.3 },
  { id: 'skill_podcast_script', name: '播客脚本创作', description: '为播客节目生成完整脚本，包含开场、话题、结尾', category: '视频音频', difficulty: 'intermediate', author: 'AI导航站', version: '1.0.0', installCount: 3200, successRate: 87, rating: 4.5, price: 'free', compatibility: ['ChatGPT', 'Claude'], workflow: [{ step: 1, title: '输入主题', description: '确定播客主题' }, { step: 2, title: '设置风格', description: '选择播客风格和时长' }, { step: 3, title: 'AI生成', description: '生成完整脚本' }], dependencies: [], input: '播客主题 + 风格', output: '播客脚本', icon: '🎙️', heatGrowth: 11.7 },

  // ===== 生活娱乐类 =====
  { id: 'skill_travel_plan', name: '旅行攻略生成', description: '自动生成个性化旅行攻略，包含景点、美食、交通', category: '生活娱乐', difficulty: 'beginner', author: 'AI导航站', version: '1.1.0', installCount: 12800, successRate: 91, rating: 4.8, price: 'free', compatibility: ['Kimi', 'ChatGPT', '文心一言'], workflow: [{ step: 1, title: '输入目的地', description: '提供目的地和预算' }, { step: 2, title: '设置偏好', description: '选择旅行风格（穷游/亲子/蜜月）' }, { step: 3, title: 'AI生成', description: '生成完整攻略' }], dependencies: [], input: '目的地 + 预算 + 偏好', output: '旅行攻略', icon: '✈️', heatGrowth: 27.3 },
  { id: 'skill_recipe_recommend', name: '食谱推荐', description: '根据食材和口味偏好推荐菜谱，包含详细步骤', category: '生活娱乐', difficulty: 'beginner', author: 'AI导航站', version: '1.0.0', installCount: 8900, successRate: 94, rating: 4.7, price: 'free', compatibility: ['ChatGPT', 'Kimi'], workflow: [{ step: 1, title: '输入食材', description: '列出可用食材' }, { step: 2, title: '选择口味', description: '选择口味偏好' }, { step: 3, title: 'AI推荐', description: '生成菜谱' }], dependencies: [], input: '食材 + 口味', output: '菜谱', icon: '🍳', heatGrowth: 19.6 },
  { id: 'skill_fitness_plan', name: '健身计划制定', description: '根据身体数据和目标生成个性化健身计划', category: '生活娱乐', difficulty: 'beginner', author: 'AI导航站', version: '1.0.0', installCount: 7600, successRate: 88, rating: 4.6, price: 'free', compatibility: ['ChatGPT', 'Claude'], workflow: [{ step: 1, title: '输入信息', description: '提供身体数据和目标' }, { step: 2, title: '选择类型', description: '选择训练类型' }, { step: 3, title: 'AI生成', description: '生成健身计划' }], dependencies: [], input: '身体数据 + 目标', output: '健身计划', icon: '💪', heatGrowth: 15.8 },

  // ===== AI提示词工程类 (GitHub高分项目) =====
  { id: 'skill_langgpt_prompt', name: 'LangGPT结构化提示词', description: '基于LangGPT框架生成高质量结构化提示词，支持角色、技能、规则、工作流设计，10k+Stars开源项目', category: 'AI提示词', difficulty: 'intermediate', author: 'LangGPT社区', version: '1.0.0', installCount: 28500, successRate: 94, rating: 4.9, price: 'free', compatibility: ['ChatGPT', 'Claude', 'Kimi', '文心一言'], workflow: [{ step: 1, title: '定义角色', description: '设定AI角色名称和身份' }, { step: 2, title: '编写Profile', description: '描述角色背景、技能、目标' }, { step: 3, title: '设计Rules', description: '设定角色行为规则' }, { step: 4, title: '构建Workflow', description: '设计工作流程' }, { step: 5, title: '生成提示词', description: '输出完整结构化提示词' }], dependencies: [], input: '角色描述 + 使用场景', output: 'LangGPT格式提示词', icon: '🏗️', heatGrowth: 42.3 },
  { id: 'skill_prompt_optimizer', name: '提示词优化工程', description: '根据Prompt Engineering Guide最佳实践优化提示词，提升LLM输出质量', category: 'AI提示词', difficulty: 'intermediate', author: 'AI导航站', version: '1.1.0', installCount: 15800, successRate: 92, rating: 4.8, price: 'free', compatibility: ['ChatGPT', 'Claude', 'Kimi', 'GPT-4'], workflow: [{ step: 1, title: '输入原始提示词', description: '提供需要优化的提示词' }, { step: 2, title: 'AI分析', description: '分析提示词的问题' }, { step: 3, title: '优化重构', description: '应用最佳实践优化' }, { step: 4, title: '测试验证', description: '验证优化效果' }], dependencies: [], input: '原始提示词', output: '优化后提示词', icon: '🔧', heatGrowth: 31.5 },
  { id: 'skill_copilot_skills', name: 'GitHub Copilot技能', description: '为GitHub Copilot编写自定义技能和指令，优化代码补全体验，官方10k+Stars项目', category: 'AI提示词', difficulty: 'intermediate', author: 'GitHub官方', version: '1.0.0', installCount: 12300, successRate: 91, rating: 4.7, price: 'free', compatibility: ['GitHub Copilot', 'Cursor', 'Claude Code'], workflow: [{ step: 1, title: '分析需求', description: '确定需要Copilot擅长的任务' }, { step: 2, title: '编写指令', description: '编写自定义指令和示例' }, { step: 3, title: '测试优化', description: '在实际代码中测试效果' }], dependencies: [], input: '任务场景描述', output: 'Copilot自定义指令', icon: '⚡', heatGrowth: 28.7 },

  // ===== AI编程开发类 (Vibe Coding) =====
  { id: 'skill_vibe_coding', name: 'Vibe Coding氛围编程', description: 'AI结对编程工作流，用自然语言驱动LLM生成大部分代码，极大提升开发效率', category: 'AI编程', difficulty: 'beginner', author: 'Vibe Coding社区', version: '1.2.0', installCount: 19800, successRate: 89, rating: 4.8, price: 'free', compatibility: ['Claude', 'ChatGPT', 'Cursor', 'VS Code'], workflow: [{ step: 1, title: '描述需求', description: '用自然语言描述想做的项目' }, { step: 2, title: '技术选型', description: '让AI推荐最简单的技术栈' }, { step: 3, title: '生成代码', description: 'AI逐步生成代码' }, { step: 4, title: '调试优化', description: '迭代优化直到完成' }], dependencies: [], input: '项目需求描述', output: '可运行项目代码', icon: '🚀', heatGrowth: 48.6 },
  { id: 'skill_glue_coding', name: '胶水编程助手', description: '专注于连接成熟的代码模块和API，把注意力放在连接方式而非造轮子上', category: 'AI编程', difficulty: 'intermediate', author: 'AI导航站', version: '1.0.0', installCount: 8200, successRate: 87, rating: 4.6, price: 'free', compatibility: ['Claude', 'ChatGPT', 'Cursor'], workflow: [{ step: 1, title: '描述需求', description: '描述需要连接的模块和API' }, { step: 2, title: 'AI推荐', description: 'AI推荐成熟的轮子' }, { step: 3, title: '生成胶水', description: '生成连接代码' }], dependencies: [], input: '模块/需求描述', output: '连接代码', icon: '🧩', heatGrowth: 22.4 },
  { id: 'skill_database_schema', name: '数据库设计助手', description: '根据需求描述设计数据库表结构，生成SQL建表语句', category: 'AI编程', difficulty: 'intermediate', author: 'AI导航站', version: '1.1.0', installCount: 11200, successRate: 93, rating: 4.8, price: 'free', compatibility: ['ChatGPT', 'Claude', 'Kimi'], workflow: [{ step: 1, title: '描述需求', description: '描述业务需求和数据结构' }, { step: 2, title: 'AI设计', description: '设计表结构和关系' }, { step: 3, title: '生成SQL', description: '输出建表SQL语句' }], dependencies: [], input: '业务需求描述', output: '数据库设计 + SQL', icon: '🗄️', heatGrowth: 19.8 },

  // ===== 营销商业类 =====
  { id: 'skill_xhs_title', name: '小红书爆款标题', description: '生成吸引眼球的小红书标题，提升笔记点击率', category: '营销商业', difficulty: 'beginner', author: 'AI导航站', version: '1.1.0', installCount: 18600, successRate: 92, rating: 4.9, price: 'free', compatibility: ['ChatGPT', 'Kimi', '文心一言'], workflow: [{ step: 1, title: '输入主题', description: '提供笔记主题' }, { step: 2, title: 'AI生成', description: '生成10个爆款标题' }, { step: 3, title: '选择优化', description: '选择最合适的标题' }], dependencies: [], input: '笔记主题', output: '爆款标题列表', icon: '📌', heatGrowth: 38.2 },
  { id: 'skill_bd_proposal', name: '商务合作方案', description: '生成专业的商务合作方案，包含合作模式、双方利益、实施计划', category: '营销商业', difficulty: 'intermediate', author: 'AI导航站', version: '1.0.0', installCount: 6800, successRate: 88, rating: 4.6, price: 'free', compatibility: ['ChatGPT', 'Claude', 'Kimi'], workflow: [{ step: 1, title: '输入双方信息', description: '提供己方和对方信息' }, { step: 2, title: '选择模式', description: '选择合作模式' }, { step: 3, title: 'AI生成', description: '生成完整方案' }], dependencies: [], input: '合作双方信息', output: '商务合作方案', icon: '🤝', heatGrowth: 16.5 },
  { id: 'skill_competitor_analysis', name: '竞品分析报告', description: '自动生成专业的竞品分析报告，包含功能对比、市场定位、优劣势', category: '营销商业', difficulty: 'intermediate', author: 'AI导航站', version: '1.1.0', installCount: 9500, successRate: 86, rating: 4.7, price: 'free', compatibility: ['ChatGPT', 'Claude', 'Kimi'], workflow: [{ step: 1, title: '输入竞品', description: '列出主要竞品名称' }, { step: 2, title: 'AI分析', description: '生成分析框架' }, { step: 3, title: '完善内容', description: '补充具体信息' }], dependencies: [], input: '竞品列表 + 分析维度', output: '竞品分析报告', icon: '🔎', heatGrowth: 21.3 },
  { id: 'skill_pitch_deck', name: '融资商业计划书', description: '为创业项目生成专业的融资BP，包含市场分析、商业模式、财务预测', category: '营销商业', difficulty: 'advanced', author: 'AI导航站', version: '1.0.0', installCount: 7200, successRate: 84, rating: 4.5, price: 'free', compatibility: ['ChatGPT', 'Claude'], workflow: [{ step: 1, title: '输入项目信息', description: '提供项目概述和融资需求' }, { step: 2, title: 'AI生成', description: '生成完整BP框架' }, { step: 3, title: '细化完善', description: '逐步完善各章节' }], dependencies: [], input: '项目信息 + 融资需求', output: '完整商业计划书', icon: '💰', heatGrowth: 18.9 },
  { id: 'skill_customer_service', name: '智能客服话术', description: '为电商/客服场景生成专业的话术库，提升客户满意度', category: '营销商业', difficulty: 'beginner', author: 'AI导航站', version: '1.1.0', installCount: 13400, successRate: 91, rating: 4.7, price: 'free', compatibility: ['ChatGPT', 'Kimi', '文心一言'], workflow: [{ step: 1, title: '选择场景', description: '选择客服场景' }, { step: 2, title: '输入FAQ', description: '提供常见问题' }, { step: 3, title: 'AI生成', description: '生成话术库' }], dependencies: [], input: '场景 + FAQ', output: '客服话术库', icon: '💬', heatGrowth: 25.6 },

  // ===== 法律财务类 =====
  { id: 'skill_contract_review', name: '合同审查修改', description: 'AI辅助审查合同，识别风险条款并提供修改建议', category: '法律财务', difficulty: 'advanced', author: 'AI导航站', version: '1.1.0', installCount: 8600, successRate: 85, rating: 4.6, price: 'free', compatibility: ['ChatGPT', 'Claude', 'Kimi'], workflow: [{ step: 1, title: '上传合同', description: '粘贴或上传合同文本' }, { step: 2, title: 'AI审查', description: '识别风险条款' }, { step: 3, title: '修改建议', description: '提供修改建议' }], dependencies: [], input: '合同文本', output: '审查报告 + 修改建议', icon: '⚖️', heatGrowth: 17.2 },
  { id: 'skill_financial_report', name: '财务报表分析', description: '分析财务报表，生成财务健康报告和改善建议', category: '法律财务', difficulty: 'advanced', author: 'AI导航站', version: '1.0.0', installCount: 5800, successRate: 83, rating: 4.5, price: 'free', compatibility: ['ChatGPT', 'Claude', 'Excel'], workflow: [{ step: 1, title: '上传报表', description: '上传财务数据' }, { step: 2, title: 'AI分析', description: '分析财务指标' }, { step: 3, title: '生成报告', description: '输出分析报告' }], dependencies: [], input: '财务报表数据', output: '财务分析报告', icon: '📉', heatGrowth: 14.3 },
  { id: 'skill_investment_research', name: '投资研究报告', description: '生成行业或公司的投资研究报告，包含估值、风险、机会', category: '法律财务', difficulty: 'advanced', author: 'AI导航站', version: '1.0.0', installCount: 4200, successRate: 81, rating: 4.4, price: 'free', compatibility: ['ChatGPT', 'Claude'], workflow: [{ step: 1, title: '输入标的', description: '输入公司/行业名称' }, { step: 2, title: 'AI研究', description: '生成研究报告' }, { step: 3, title: '估值分析', description: '提供投资建议' }], dependencies: [], input: '投资标的', output: '投资研究报告', icon: '📊', heatGrowth: 12.8 },

  // ===== 教育学习类 =====
  { id: 'skill_translation', name: '多语言精准翻译', description: '支持中英日韩等20+语言的精准翻译，保留专业术语', category: '教育学习', difficulty: 'beginner', author: 'AI导航站', version: '1.2.0', installCount: 24600, successRate: 95, rating: 4.9, price: 'free', compatibility: ['ChatGPT', 'Claude', 'Kimi', 'DeepL'], workflow: [{ step: 1, title: '输入文本', description: '粘贴需要翻译的文本' }, { step: 2, title: '选择语言', description: '选择源语言和目标语言' }, { step: 3, title: 'AI翻译', description: '生成翻译结果' }], dependencies: [], input: '原文 + 目标语言', output: '翻译文本', icon: '🌐', heatGrowth: 33.7 },
  { id: 'skill_knowledge_summary', name: '知识总结提炼', description: '将长篇文章、PDF、网页内容提炼为核心知识点', category: '教育学习', difficulty: 'beginner', author: 'AI导航站', version: '1.1.0', installCount: 16800, successRate: 92, rating: 4.8, price: 'free', compatibility: ['Kimi', 'ChatGPT', 'Claude'], workflow: [{ step: 1, title: '输入内容', description: '粘贴或上传内容' }, { step: 2, title: 'AI提炼', description: '提取核心知识点' }, { step: 3, title: '生成摘要', description: '输出结构化总结' }], dependencies: [], input: '长文本/文档', output: '知识点总结', icon: '🧠', heatGrowth: 29.4 },
  { id: 'skill_exam_prep', name: '考试复习助手', description: '根据教材或知识点生成复习计划、练习题、记忆卡片', category: '教育学习', difficulty: 'beginner', author: 'AI导航站', version: '1.0.0', installCount: 13200, successRate: 90, rating: 4.7, price: 'free', compatibility: ['ChatGPT', 'Kimi', 'Claude'], workflow: [{ step: 1, title: '输入知识点', description: '提供考试科目和知识点' }, { step: 2, title: 'AI规划', description: '生成复习计划' }, { step: 3, title: '生成练习', description: '生成练习题和答案' }], dependencies: [], input: '科目 + 知识点', output: '复习计划 + 练习题', icon: '📚', heatGrowth: 26.1 },
  { id: 'skill_child_education', name: '儿童教育陪伴', description: '为3-12岁儿童生成互动学习内容，包含故事、儿歌、科普', category: '教育学习', difficulty: 'beginner', author: 'AI导航站', version: '1.0.0', installCount: 8900, successRate: 93, rating: 4.8, price: 'free', compatibility: ['ChatGPT', 'Kimi'], workflow: [{ step: 1, title: '输入年龄', description: '提供孩子年龄和兴趣' }, { step: 2, title: '选择类型', description: '选择内容类型' }, { step: 3, title: 'AI生成', description: '生成互动内容' }], dependencies: [], input: '孩子年龄 + 兴趣', output: '学习内容', icon: '👧', heatGrowth: 18.7 },

  // ===== 心理健康类 =====
  { id: 'skill_mental_health', name: '心理疏导对话', description: 'AI辅助心理疏导，提供情绪支持和专业建议（非医疗）', category: '心理健康', difficulty: 'beginner', author: 'AI导航站', version: '1.0.0', installCount: 7600, successRate: 89, rating: 4.6, price: 'free', compatibility: ['ChatGPT', 'Claude', 'Kimi'], workflow: [{ step: 1, title: '倾诉问题', description: '描述当前困扰' }, { step: 2, title: 'AI倾听', description: 'AI提供倾听和反馈' }, { step: 3, title: '建议方案', description: '提供改善建议' }], dependencies: [], input: '心理困扰描述', output: '疏导对话 + 建议', icon: '💚', heatGrowth: 15.4 },

  // ===== 房产家居类 =====
  { id: 'skill_home_decor', name: '家居软装设计', description: '根据房间照片和风格偏好，AI生成软装搭配方案', category: '房产家居', difficulty: 'beginner', author: 'AI导航站', version: '1.0.0', installCount: 6200, successRate: 85, rating: 4.5, price: 'free', compatibility: ['Midjourney', 'DALL-E', 'Stable Diffusion'], workflow: [{ step: 1, title: '上传照片', description: '上传房间照片' }, { step: 2, title: '描述风格', description: '描述想要的风格' }, { step: 3, title: 'AI设计', description: '生成软装方案' }], dependencies: [], input: '房间照片 + 风格', output: '软装设计方案', icon: '🏠', heatGrowth: 13.6 },
  { id: 'skill_house_description', name: '房源文案撰写', description: '为房产中介生成吸引人的房源描述，突出卖点', category: '房产家居', difficulty: 'beginner', author: 'AI导航站', version: '1.0.0', installCount: 4800, successRate: 90, rating: 4.6, price: 'free', compatibility: ['ChatGPT', 'Kimi', '文心一言'], workflow: [{ step: 1, title: '输入房源', description: '提供房源基本信息' }, { step: 2, title: 'AI生成', description: '生成房源描述' }, { step: 3, title: '优化卖点', description: '突出核心卖点' }], dependencies: [], input: '房源信息', output: '房源描述文案', icon: '🏘️', heatGrowth: 11.2 },
];

export const scenes: Scene[] = [
  { id: 'scene_catering', name: '餐饮行业', icon: '🍜', description: '餐饮行业的AI应用场景，包括菜单设计、客户服务、运营管理等', coverImage: '🍜', toolCount: 12, skillCount: 5, xhsSaves: 85000, tags: ['餐饮', '运营', '营销'], solutions: [{ id: 's1', type: 'auto', title: '菜单文案生成', description: '自动生成吸引人的菜单描述', tools: ['ChatGPT', 'Midjourney'], skills: ['skill_xhs_rewrite'], effect: '提升菜品吸引力，转化率提升30%', difficulty: 'beginner' }] },
  { id: 'scene_ecommerce', name: '电商运营', icon: '🛒', description: '电商运营的AI应用场景，包括商品描述、客服话术、活动策划等', coverImage: '🛒', toolCount: 18, skillCount: 8, xhsSaves: 156000, tags: ['电商', '营销', '运营'], solutions: [{ id: 's1', type: 'auto', title: '商品卖点提炼', description: '自动分析商品特点，提炼核心卖点', tools: ['ChatGPT', 'Claude'], skills: [], effect: '快速生成吸引人的商品描述', difficulty: 'beginner' }] },
  { id: 'scene_video', name: '短视频创作', icon: '🎥', description: '短视频创作的AI应用场景，包括脚本创作、视频剪辑、特效添加等', coverImage: '🎥', toolCount: 15, skillCount: 6, xhsSaves: 230000, tags: ['短视频', '内容创作', '视频剪辑'], solutions: [{ id: 's1', type: 'auto', title: '爆款脚本生成', description: '根据主题生成爆款短视频脚本', tools: ['ChatGPT', 'Kimi'], skills: [], effect: '快速生成多种风格的脚本', difficulty: 'beginner' }] },
];

export const dailyPicks: DailyPick[] = [
  { id: 'dp1', sceneId: 'scene_catering', sceneName: '餐饮行业', coverImage: '🍜', description: 'AI帮你打造爆款菜单', toolCount: 12, skillCount: 5, xhsSaves: 85000, date: '2026-04-04' },
  { id: 'dp2', sceneId: 'scene_ecommerce', sceneName: '电商运营', coverImage: '🛒', description: '一键生成商品详情', toolCount: 18, skillCount: 8, xhsSaves: 156000, date: '2026-04-03' },
];