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
      '结合插件实现实时信息：启用Browsing插件获取最新信息',
      '使用Custom GPTs：访问GPTs商店找到针对特定任务的专用AI助手，无需自己调教',
      '利用代码解释器上传CSV数据：让ChatGPT自动分析数据并生成可视化图表',
      '多用"请一步步思考"提示：处理复杂逻辑问题时，引导AI分解任务避免遗漏',
      '用中文描述需求再让AI翻译成MJ Prompt：做设计时先用中文说清想法，让ChatGPT帮你写专业Prompt',
      '启用Memory功能：让ChatGPT记住你的偏好和项目背景，长期对话更连贯'
    ],
    cases: [
      { title: '小红书爆款文案', description: '生成吸引眼球的电商文案', prompt: '请帮我写一篇关于[产品名称]的小红书文案，要求：1.开头有吸引力 2.使用emoji 3.包含3-5个卖点 4.结尾有call to action' },
      { title: '代码审查与优化', description: '帮助审查和改进代码质量', prompt: '请审查以下代码，指出潜在问题并提供优化建议：[代码片段]' },
      { title: '学术论文润色', description: '提升学术写作质量', prompt: '请帮我润色以下学术论文段落，使其更专业、更流畅：[论文内容]' },
      { title: '数据分析可视化', description: '上传CSV文件自动分析', prompt: '请分析上传的CSV数据文件，提取关键趋势和异常点，并用Python生成可视化图表展示核心发现' },
      { title: '多语言翻译本地化', description: '批量翻译并符合当地文化', prompt: '请将以下产品描述翻译成[日语/韩语/英语]，注意：1.保留品牌调性 2.符合当地用户阅读习惯 3.避免文化禁忌：[内容]' }
    ],
    guides: [
      { title: '新手入门指南', steps: ['1. 访问 chat.openai.com 注册账号', '2. 选择 GPT-3.5（免费）或 GPT-4（付费）模型', '3. 在输入框中描述你的需求或问题', '4. 根据回答进行追问或调整提示词', '5. 保存有用的对话以便后续参考'] },
      { title: '高级提示词技巧', steps: ['1. 使用系统提示设定AI角色和行为方式', '2. 用清晰的结构化格式说明任务要求', '3. 提供上下文和背景信息', '4. 指定输出格式（JSON、列表、段落等）', '5. 用例子说明期望的输出风格'] },
      { title: 'GPTs使用指南', steps: ['1. 点击左上角Explore GPTs进入商店', '2. 搜索或浏览特定用途的GPTs（如Logo设计、数据分析）', '3. 选择GPT后直接在对话中使用', '4. 可在对话中@其他GPTs切换工具', '5. 关注评分高的GPTs，定期留意更新'] }
    ]
  },
  midjourney: {
    tips: [
      '使用--ar参数控制图片比例，如--ar 16:9适合横版，--ar 9:16适合竖版',
      '利用--s参数控制风格强度，数值越高越接近参考风格',
      '在提示词中加入光照参数如"cinematic lighting"、"soft studio lighting"提升质感',
      '使用--v 6版本对文字支持更好，可生成含文字的图片',
      '在Discord关注他人作品的prompt，学习高级技巧',
      '使用--style raw参数可以让MJ更忠实于你的文字描述，减少AI自由发挥',
      '利用Blend功能混合多张参考图的构图和色彩风格',
      '在Prompt中使用重复关键词如"highly detailed, intricate details, 8k"可显著提升细节质量',
      '使用图生图的Image Weight参数(--iw)控制参考图对结果的影响程度',
      '用Remix模式替换原Prompt的核心词，在保持构图的同时改变风格'
    ],
    cases: [
      { title: '产品场景图', description: '生成电商产品展示图', prompt: 'Product photography, [product] on a marble table, soft natural lighting, minimalist style, high-end luxury feel, 8k --ar 3:4' },
      { title: '创意头像', description: '生成个人品牌头像', prompt: 'Portrait illustration, [style], [person description], clean background, professional avatar, --ar 1:1' },
      { title: 'Logo设计', description: 'AI生成品牌Logo', prompt: 'Minimalist [industry] logo design, vector style, white background, flat design, geometric shapes --ar 1:1' },
      { title: '室内设计预览', description: 'AI生成装修效果图', prompt: 'Modern [room_type] interior design, [style] style, natural lighting, spacious, elegant, architectural photography, 8k --ar 4:3' },
      { title: '品牌视觉风格', description: '统一品牌视觉调性', prompt: '[Brand] visual identity, brand style guide, color palette of [colors], consistent design language, product mockups --ar 16:9' }
    ],
    guides: [
      { title: '基础入门', steps: ['1. 加入Midjourney Discord服务器', '2. 在#generate频道输入/imagine', '3. 输入英文提示词', '4. 等待生成4张图片', '5. 使用U1-U4放大、V1-V4生成变体'] },
      { title: '提示词高级技巧', steps: ['1. 主体描述要具体详细', '2. 添加风格关键词（摄影/插画/3D等）', '3. 指定光照和材质', '4. 添加--ar控制比例', '5. 使用--s控制风格强度'] },
      { title: '图生图工作流', steps: ['1. 上传参考图获取图片链接', '2. 在/imagine中粘贴链接+提示词', '3. 添加--iw参数控制参考权重（0-2）', '4. 使用Remix模式迭代调整', '5. 放大最佳结果并下载'] }
    ]
  },
  kimi: {
    tips: [
      '支持最长20万字上下文，可以一次性输入整篇论文或长文档',
      '直接拖拽PDF/Word/Excel文件到对话框，自动分析内容',
      '联网搜索功能可以获取实时信息，回答最新问题',
      '支持多语言翻译和润色，英语论文翻译质量很高',
      '会议纪要功能可以自动提取关键信息和大纲',
      'Kimi+智能体市场提供了针对特定场景的AI助手模板',
      '长文生成模式可以一次性输出上万字的结构化内容'
    ],
    cases: [
      { title: 'PDF论文解析', description: '快速理解论文核心内容', prompt: '请分析以下PDF论文，提取：1.核心观点 2.研究方法 3.主要结论 4.创新点' },
      { title: '会议纪要生成', description: '自动生成结构化会议记录', prompt: '根据以下会议记录，生成包含：议题、讨论要点、行动计划、待办事项的会议纪要' },
      { title: '长文档问答', description: '基于文档回答问题', prompt: '根据上传的[文档]，回答以下问题：[问题]' },
      { title: '合同条款审查', description: '快速识别合同风险点', prompt: '审查以下合同条款，识别潜在风险：1.权责不对等问题 2.隐藏费用 3.违约条款 4.争议解决机制' },
      { title: '行业研究报告', description: '自动生成结构化行业分析', prompt: '请对[行业名称]进行深度分析，包含：1.市场规模和增长趋势 2.竞争格局 3.技术路线 4.政策环境 5.未来3年预测' }
    ],
    guides: [
      { title: '文件处理', steps: ['1. 打开 kimi.moonshot.cn', '2. 拖拽文件到对话框或点击上传按钮', '3. 等待文件解析完成', '4. 输入具体问题或任务', '5. 获取分析结果'] },
      { title: '高效提问', steps: ['1. 明确任务类型（总结/翻译/分析等）', '2. 提供清晰的上下文', '3. 指定输出格式', '4. 追问细化需求', '5. 保存重要结果'] },
      { title: 'Kimi+智能体使用', steps: ['1. 在Kimi界面点击Kimi+入口', '2. 浏览场景化智能体市场', '3. 选择适合任务的AI助手模板', '4. 根据模板指引完成特定任务', '5. 可自定义和保存常用模板'] }
    ]
  },
  gamma: {
    tips: [
      '输入主题后AI会自动生成大纲，可以修改后再生成PPT',
      '支持导入PDF文档自动提取内容生成PPT',
      '选择模板后可以在线编辑文字、图片、图表',
      '可以一键切换PPT风格，如商务、创意、学术等',
      '生成的PPT支持导出为PDF或直接在线演示',
      '利用AI生成图片插入PPT，无需额外找图',
      '支持团队协作，多人同时编辑同一份PPT'
    ],
    cases: [
      { title: '学术答辩PPT', description: '自动生成论文答辩演示', prompt: '生成一份关于\"[论文主题]\"的学术答辩PPT，包含：研究背景、研究方法、实验结果、结论与展望' },
      { title: '商业计划书', description: '创业项目商业计划', prompt: '为\"[项目名称]\"生成商业计划书PPT，包含：市场痛点、解决方案、商业模式、竞争优势、财务预测' },
      { title: '培训课件', description: '企业内部培训材料', prompt: '创建\"[培训主题]\"培训课件，包含：课程目标、知识点讲解、案例分析、课后练习' },
      { title: '产品发布会', description: '产品发布演示文稿', prompt: '生成\"[产品名称]\"发布会PPT，包含：用户痛点、产品亮点、技术优势、定价策略、购买方式' },
      { title: '年终总结报告', description: '年度工作成果展示', prompt: '生成一份年终总结PPT，包含：年度KPI完成情况、重点项目回顾、团队建设成果、明年规划' }
    ],
    guides: [
      { title: '快速生成', steps: ['1. 访问 gamma.app', '2. 点击\"Generate\"按钮', '3. 输入PPT主题或大纲', '4. 选择模板风格', '5. 等待生成完成后编辑'] },
      { title: '优化技巧', steps: ['1. 详细描述PPT内容要求', '2. 指定目标受众和场景', '3. 选择合适的配色方案', '4. 手动调整AI生成的文字', '5. 添加品牌元素'] },
      { title: '从文档生成PPT', steps: ['1. 点击导入文档按钮', '2. 上传PDF/Word/Markdown文件', '3. 等待AI自动提取内容', '4. 选择PPT模板风格', '5. 编辑和导出最终PPT'] }
    ]
  },
  claude: {
    tips: [
      'Claude 3.5 Sonnet 性价比最高，适合大多数任务',
      'Artifacts功能可以创建可交互的网页、应用、文档',
      '支持上传文件进行分析，特别擅长代码和文档',
      'Writing功能可以帮你润色文章、写出专业内容',
      '用"Thinking"模式处理复杂推理问题更准确',
      '利用Projects功能创建独立工作区，为每个项目配置专属Context',
      '使用Claude Code CLI在终端中直接编辑和管理代码库',
      '在Prompt中提供XML标签结构化数据，Claude对XML格式的理解特别准确',
      '让Claude逐个文件审查项目：用200K上下文一次性提交多文件',
      '使用Styling功能让AI按照指定的样式和格式输出专业文档'
    ],
    cases: [
      { title: '代码重构', description: '优化代码结构和性能', prompt: '请分析以下代码，提出重构建议：1.提升可读性 2.优化性能 3.最佳实践 4.潜在bug修复' },
      { title: '文章润色', description: '提升写作质量', prompt: '请润色以下文章：1.提升语言表达 2.优化逻辑结构 3.调整语气风格' },
      { title: '数据解读', description: '分析数据并给出洞察', prompt: '分析以下数据：[数据]，给出：1.关键发现 2.趋势分析 3.业务建议' },
      { title: '交互式原型设计', description: '用Artifacts创建UI原型', prompt: 'Create an interactive HTML page for a [type] dashboard with: 1. Responsive layout 2. Real-time data updates 3. Dark/light mode toggle 4. Chart visualizations' },
      { title: '技术方案设计', description: '输出完整架构方案', prompt: '请为[项目需求]设计完整的技术架构方案，包含：1.技术选型及理由 2.系统架构图(Mermaid) 3.数据流设计 4.部署方案 5.风险预案' }
    ],
    guides: [
      { title: '快速上手', steps: ['1. 访问 claude.ai', '2. 注册账号并选择免费/付费版', '3. 在对话框输入任务', '4. 上传文件或链接', '5. 追问优化结果'] },
      { title: '高效使用', steps: ['1. 使用快捷指令(/shortcut)提升效率', '2. 开启Artifacts创建交互内容', '3. 粘贴代码时说明编程语言', '4. 用复制粘贴保存重要回复', '5. 探索Settings中的个性化设置'] },
      { title: 'Claude Code CLI入门', steps: ['1. 安装Claude Code: npm install -g @anthropic/claude-code', '2. 在项目目录运行 claude', '3. 用自然语言描述编码任务', '4. AI自动编辑文件并预览改动', '5. 使用/commit生成合规的Git提交'] }
    ]
  },

  deepseek: {
    tips: [
      '上下文长达1M tokens（约75万汉字），可处理整本小说或大型代码库',
      'DeepSeek R1推理模型展示Chain-of-Thought过程，适合复杂数学和编程',
      '完全免费无限制，注册即可使用所有功能',
      'R1模型推理较慢但结果更精准，V3模型响应更快速',
      '支持上传PDF/Word/Excel文档进行内容分析',
      '在API调用时设置temperature=0.7可平衡创造力和准确性',
      '可以用本地蒸馏模型替代API调用，适合隐私敏感场景',
      'R1的思考过程可以作为"思维模板"学习如何解决类似问题'
    ],
    cases: [
      { title: '超长文档分析', description: '一次性处理整本书籍或论文', prompt: '请分析以下完整的文档内容，提取：1.核心论点 2.论证结构 3.关键证据 4.局限性 5.对我研究的启发：[文档]' },
      { title: '复杂编程挑战', description: '解决算法和编程难题', prompt: '请解决以下编程问题，要求：1.先分析问题 2.设计算法 3.写出完整代码 4.分析时间和空间复杂度 5.提供测试用例：[问题描述]' },
      { title: '多文件代码审查', description: '一次性审查整个项目', prompt: '以下是一个项目的多个文件源码，请进行全面代码审查：1.架构合理性 2.安全漏洞 3.性能问题 4.代码规范 5.改进建议：[项目代码]' },
      { title: '数学推理与证明', description: 'R1模型求解数学问题', prompt: '请使用DeepSeek R1模式解决以下数学问题，展示完整的推理步骤和最终答案：[数学问题]' },
      { title: '学术文献综述', description: '批量分析研究论文', prompt: '请分析以下多篇学术论文的内容，按主题进行综述：1.研究脉络梳理 2.方法论对比 3.核心发现归纳 4.研究空白识别：[论文内容]' }
    ],
    guides: [
      { title: '入门使用', steps: ['1. 访问 chat.deepseek.com 或下载App', '2. 注册账号（无需翻墙）', '3. 在对话框输入问题或上传文件', '4. 在V3和R1模型间切换', '5. 打开联网搜索获取实时信息'] },
      { title: 'R1模型使用技巧', steps: ['1. 在模型选择中切换为DeepSeek R1', '2. 输入需要深度推理的问题（数学/逻辑/编程）', '3. 等待R1展示完整的思考过程', '4. 从思考链中学习推理方法', '5. 如果结果不满意，在你的问题基础上追问'] },
      { title: 'API接入指南', steps: ['1. 在 platform.deepseek.com 获取API Key', '2. 使用OpenAI兼容接口格式调用', '3. 设置base_url为 https://api.deepseek.com', '4. V3适合日常对话，R1适合深度推理', '5. 注意监控用量，API虽然便宜但仍需计费'] }
    ]
  },

  runway: {
    tips: [
      'Gen-2支持文字生成视频',
      '提供多种预设风格',
      '可以在现有视频上进行AI编辑',
      '描述视频时包含镜头运动（推/拉/摇/移）让动态效果更丰富',
      '使用具体的光照描述（黄昏/逆光/霓虹）提升画面质感',
    ],
    cases: [
      { title: '短视频营销', description: '用Runway生成产品营销短视频', prompt: 'Create a 15-second product showcase video: [product] in [setting], smooth camera movement, professional lighting, engaging transitions, suitable for social media' },
      { title: '创意视觉特效', description: '用Runway生成创意视频片段', prompt: 'Cinematic shot of [subject] in [environment], dramatic lighting, slow motion effect, high detail, atmospheric, cinematic color grading' },
    ],
    guides: [
      { title: '新手入门指南', steps: [
        '访问 Runway 并注册账号',
        '了解平台的免费额度和功能限制',
        '从文字生成视频开始，输入简单的场景描述',
        '选择合适的视频风格和比例',
        '预览结果，调整提示词获得更好效果',
      ] },
      { title: '进阶使用技巧', steps: [
        '使用图像+文字的双重输入方式精确控制视频内容',
        '结合镜头运动参数制作丰富的动态效果',
        '利用关键帧功能实现画面内容的平滑过渡',
        '批量生成视频片段并进行后期剪辑拼接',
        '调整色彩、光照和风格参数实现专业视觉效果',
      ] },
    ]
  },

  suno: {
    tips: [
      '支持生成带歌词的完整歌曲',
      '可以选择音乐风格和乐器',
      '生成的音乐可用于商业用途',
      '描述音乐风格时要具体：包含节奏、乐器、情绪等要素',
      '通过参考歌曲或风格标签精准生成目标风格的音乐',
    ],
    cases: [
      { title: '背景音乐制作', description: '用Suno为视频或播客生成背景音乐', prompt: 'Create a [length]-second background music track, [genre] style, [mood] mood, instrumental, suitable for [use_case], professional quality' },
      { title: '语音内容生成', description: '用Suno生成专业的语音内容', prompt: 'Generate [language] speech with [accent] accent, [emotion] tone, natural pacing, clear pronunciation for the following text: [text content]' },
    ],
    guides: [
      { title: '新手入门指南', steps: [
        '打开 Suno 平台并创建账号',
        '了解不同版本的功能和定价',
        '从简单的文本转语音或音乐生成开始尝试',
        '选择预设的风格和声音模板',
        '导出生成的内容并应用到项目中',
      ] },
      { title: '进阶使用技巧', steps: [
        '使用高级参数精确控制音色、音调和节奏',
        '利用声音克隆功能创建专属声音模型',
        '多轨合成：将生成的音轨与其他音频混合制作',
        '批量生成不同版本并通过A/B测试选择最佳效果',
        '结合音频编辑软件进行后期处理和优化',
      ] },
    ]
  },

  cursor: {
    tips: [
      'Ctrl+K 快速编辑选中代码',
      'Ctrl+L 对话式编程助手',
      '支持多文件上下文理解和跨文件重构',
      '描述任务时明确指定编程语言和框架，获得更精确的代码',
      '提供代码上下文：粘贴相关文件的关键部分让AI理解整体架构',
    ],
    cases: [
      { title: '功能模块开发', description: '用Cursor快速实现一个功能模块', prompt: '请用[编程语言]实现以下功能模块：\n1. 功能描述：[详细说明]\n2. 输入/输出规范\n3. 需要处理边缘情况\n4. 遵循最佳实践，添加错误处理和注释' },
      { title: '代码审查与重构', description: '用Cursor审查和改进现有代码', prompt: '请审查以下代码，提供：\n1. 潜在的bug和安全隐患\n2. 性能优化建议\n3. 代码结构改进方案\n4. 最佳实践建议\n代码：[粘贴代码]' },
      { title: 'API接口开发', description: '用Cursor设计和实现API接口', prompt: '请设计并实现一个[RESTful/GraphQL] API接口：\n1. 功能：[描述接口功能]\n2. 请求/响应格式\n3. 认证和授权方式\n4. 错误处理和状态码\n5. 数据验证逻辑' },
    ],
    guides: [
      { title: '新手入门指南', steps: [
        '安装并配置 Cursor',
        '从简单的代码补全和问答开始熟悉',
        '尝试用自然语言描述功能需求，让AI生成代码',
        '学会提供足够的上下文信息以获得更好的结果',
        '逐步尝试更复杂的任务：重构、调试、测试生成',
      ] },
      { title: '进阶使用技巧', steps: [
        '建立项目的代码规范和提示指令文件',
        '使用多文件上下文理解大型项目架构',
        '结合CI/CD流程自动化代码审查和测试生成',
        '利用AI辅助进行架构设计和技术方案评审',
        '建立可复用的提示词模板库提升团队效率',
      ] },
    ]
  },

  devin: {
    tips: [
      '可以独立完成浏览器测试和调试',
      '支持接入 Slack 和 IDE',
      '适合自动化重复性开发任务',
      '描述任务时明确指定编程语言和框架，获得更精确的代码',
      '提供代码上下文：粘贴相关文件的关键部分让AI理解整体架构',
    ],
    cases: [
      { title: '功能模块开发', description: '用Devin快速实现一个功能模块', prompt: '请用[编程语言]实现以下功能模块：\n1. 功能描述：[详细说明]\n2. 输入/输出规范\n3. 需要处理边缘情况\n4. 遵循最佳实践，添加错误处理和注释' },
      { title: '代码审查与重构', description: '用Devin审查和改进现有代码', prompt: '请审查以下代码，提供：\n1. 潜在的bug和安全隐患\n2. 性能优化建议\n3. 代码结构改进方案\n4. 最佳实践建议\n代码：[粘贴代码]' },
      { title: 'API接口开发', description: '用Devin设计和实现API接口', prompt: '请设计并实现一个[RESTful/GraphQL] API接口：\n1. 功能：[描述接口功能]\n2. 请求/响应格式\n3. 认证和授权方式\n4. 错误处理和状态码\n5. 数据验证逻辑' },
    ],
    guides: [
      { title: '新手入门指南', steps: [
        '安装并配置 Devin',
        '从简单的代码补全和问答开始熟悉',
        '尝试用自然语言描述功能需求，让AI生成代码',
        '学会提供足够的上下文信息以获得更好的结果',
        '逐步尝试更复杂的任务：重构、调试、测试生成',
      ] },
      { title: '进阶使用技巧', steps: [
        '建立项目的代码规范和提示指令文件',
        '使用多文件上下文理解大型项目架构',
        '结合CI/CD流程自动化代码审查和测试生成',
        '利用AI辅助进行架构设计和技术方案评审',
        '建立可复用的提示词模板库提升团队效率',
      ] },
    ]
  },

  notion_ai: {
    tips: [
      '在Notion文档中按空格即可呼出AI',
      '支持翻译、润色、续写等多种功能',
      'AI结果可以自动保存为Notion数据库条目',
      '用Notion AI自动化重复性办公任务，大幅提升效率',
      '提供清晰的结构化输入（如Markdown格式）可获得更规范的输出',
    ],
    cases: [
      { title: '自动化报告生成', description: '用Notion AI自动生成周报/月报', prompt: '请根据以下工作内容生成一份专业的周报：\n[工作内容]\n要求：1. 分类清晰 2. 数据量化 3. 突出成果 4. 包含下周计划' },
      { title: '文档处理与优化', description: '用Notion AI提升文档质量和可读性', prompt: '请优化以下文档：\n1. 提升语言表达的专业性和流畅度\n2. 优化结构和逻辑层次\n3. 统一术语和格式规范\n4. 完善关键数据和引用\n文档：[粘贴内容]' },
    ],
    guides: [
      { title: '新手入门指南', steps: [
        '注册并登录 Notion AI',
        '了解平台支持的文件格式和导入方式',
        '从一个简单的任务开始：生成文档/PPT/表格',
        '使用预设模板快速创建标准格式内容',
        '导出结果并根据需要进行微调',
      ] },
      { title: '进阶使用技巧', steps: [
        '建立自定义模板库，统一团队输出标准',
        '使用批量处理功能同时生成多个文档',
        '结合API实现与现有系统的自动化集成',
        '利用版本管理追踪文档变更历史',
        '设计协同工作流，多人协作编辑AI生成内容',
      ] },
    ]
  },

  heygen: {
    tips: [
      '支持120+语言的数字人播报',
      '可以上传照片生成数字人形象',
      '文案一键生成视频，适合跨境电商',
      '描述视频时包含镜头运动（推/拉/摇/移）让动态效果更丰富',
      '使用具体的光照描述（黄昏/逆光/霓虹）提升画面质感',
    ],
    cases: [
      { title: '短视频营销', description: '用HeyGen生成产品营销短视频', prompt: 'Create a 15-second product showcase video: [product] in [setting], smooth camera movement, professional lighting, engaging transitions, suitable for social media' },
      { title: '创意视觉特效', description: '用HeyGen生成创意视频片段', prompt: 'Cinematic shot of [subject] in [environment], dramatic lighting, slow motion effect, high detail, atmospheric, cinematic color grading' },
    ],
    guides: [
      { title: '新手入门指南', steps: [
        '访问 HeyGen 并注册账号',
        '了解平台的免费额度和功能限制',
        '从文字生成视频开始，输入简单的场景描述',
        '选择合适的视频风格和比例',
        '预览结果，调整提示词获得更好效果',
      ] },
      { title: '进阶使用技巧', steps: [
        '使用图像+文字的双重输入方式精确控制视频内容',
        '结合镜头运动参数制作丰富的动态效果',
        '利用关键帧功能实现画面内容的平滑过渡',
        '批量生成视频片段并进行后期剪辑拼接',
        '调整色彩、光照和风格参数实现专业视觉效果',
      ] },
    ]
  },

  stable_diffusion: {
    tips: [
      '推荐使用Automatic1111或ComfyUI作为前端',
      'ControlNet可以精确控制姿态和构图',
      'LoRA模型可以生成特定风格或角色',
      '使用详细的主体描述：包括颜色、材质、光照、角度等细节，生成更精准的图像',
      '在提示词中加入风格关键词（摄影风格/插画风格/3D渲染等）来定向输出',
    ],
    cases: [
      { title: '品牌视觉素材', description: '用Stable Diffusion生成品牌宣传视觉素材', prompt: 'Brand visual for [brand_name], [industry] style, professional color palette, clean composition, high-end feel, suitable for social media and website --ar 16:9' },
      { title: '概念设计图', description: '用Stable Diffusion快速生成设计概念方案', prompt: 'Concept art of [subject], [style], cinematic lighting, detailed texture, atmospheric, professional quality, ultra detailed --ar 16:9' },
      { title: '产品展示图', description: '用Stable Diffusion生成产品场景图', prompt: '[Product] in [scene/environment], professional product photography, soft studio lighting, minimalist background, high detail, 8k --ar 4:3' },
    ],
    guides: [
      { title: '新手入门指南', steps: [
        '访问 Stable Diffusion 的官方平台',
        '注册账号并了解免费额度',
        '学习基本的提示词结构：主体 + 风格 + 环境 + 参数',
        '从简单的描述开始，逐步增加细节',
        '使用预设模板或社区分享的提示词快速上手',
      ] },
      { title: '进阶使用技巧', steps: [
        '使用高级参数控制生成精度（采样器、CFG、步数等）',
        '结合ControlNet/Reference等工具精确控制构图和风格',
        '使用LoRA模型训练特定风格或角色',
        '批量生成并通过参数组合筛选最佳结果',
        '后期结合其他工具进行修图和细节调整',
      ] },
    ]
  },

  copilot: {
    tips: [
      '在VS Code/JetBrains中安装插件即可使用',
      '支持HTML/CSS/JS/Python等主流语言',
      'Copilot Chat可以对话式解决编码问题',
      '描述任务时明确指定编程语言和框架，获得更精确的代码',
      '提供代码上下文：粘贴相关文件的关键部分让AI理解整体架构',
    ],
    cases: [
      { title: '功能模块开发', description: '用GitHub Copilot快速实现一个功能模块', prompt: '请用[编程语言]实现以下功能模块：\n1. 功能描述：[详细说明]\n2. 输入/输出规范\n3. 需要处理边缘情况\n4. 遵循最佳实践，添加错误处理和注释' },
      { title: '代码审查与重构', description: '用GitHub Copilot审查和改进现有代码', prompt: '请审查以下代码，提供：\n1. 潜在的bug和安全隐患\n2. 性能优化建议\n3. 代码结构改进方案\n4. 最佳实践建议\n代码：[粘贴代码]' },
      { title: 'API接口开发', description: '用GitHub Copilot设计和实现API接口', prompt: '请设计并实现一个[RESTful/GraphQL] API接口：\n1. 功能：[描述接口功能]\n2. 请求/响应格式\n3. 认证和授权方式\n4. 错误处理和状态码\n5. 数据验证逻辑' },
    ],
    guides: [
      { title: '新手入门指南', steps: [
        '安装并配置 GitHub Copilot',
        '从简单的代码补全和问答开始熟悉',
        '尝试用自然语言描述功能需求，让AI生成代码',
        '学会提供足够的上下文信息以获得更好的结果',
        '逐步尝试更复杂的任务：重构、调试、测试生成',
      ] },
      { title: '进阶使用技巧', steps: [
        '建立项目的代码规范和提示指令文件',
        '使用多文件上下文理解大型项目架构',
        '结合CI/CD流程自动化代码审查和测试生成',
        '利用AI辅助进行架构设计和技术方案评审',
        '建立可复用的提示词模板库提升团队效率',
      ] },
    ]
  },

  dalle: {
    tips: [
      '通过ChatGPT Plus使用，直接自然语言描述即可',
      '对文字和复杂构图的理解能力很强',
      '生成的图片可以再次编辑修改部分区域',
      '使用详细的主体描述：包括颜色、材质、光照、角度等细节，生成更精准的图像',
      '在提示词中加入风格关键词（摄影风格/插画风格/3D渲染等）来定向输出',
    ],
    cases: [
      { title: '品牌视觉素材', description: '用DALL·E 3生成品牌宣传视觉素材', prompt: 'Brand visual for [brand_name], [industry] style, professional color palette, clean composition, high-end feel, suitable for social media and website --ar 16:9' },
      { title: '概念设计图', description: '用DALL·E 3快速生成设计概念方案', prompt: 'Concept art of [subject], [style], cinematic lighting, detailed texture, atmospheric, professional quality, ultra detailed --ar 16:9' },
      { title: '产品展示图', description: '用DALL·E 3生成产品场景图', prompt: '[Product] in [scene/environment], professional product photography, soft studio lighting, minimalist background, high detail, 8k --ar 4:3' },
    ],
    guides: [
      { title: '新手入门指南', steps: [
        '访问 DALL·E 3 的官方平台',
        '注册账号并了解免费额度',
        '学习基本的提示词结构：主体 + 风格 + 环境 + 参数',
        '从简单的描述开始，逐步增加细节',
        '使用预设模板或社区分享的提示词快速上手',
      ] },
      { title: '进阶使用技巧', steps: [
        '使用高级参数控制生成精度（采样器、CFG、步数等）',
        '结合ControlNet/Reference等工具精确控制构图和风格',
        '使用LoRA模型训练特定风格或角色',
        '批量生成并通过参数组合筛选最佳结果',
        '后期结合其他工具进行修图和细节调整',
      ] },
    ]
  },

  leonardo: {
    tips: [
      '提供丰富的预设风格模型',
      '可以训练自己的专属模型',
      '每日免费额度充足',
      '使用详细的主体描述：包括颜色、材质、光照、角度等细节，生成更精准的图像',
      '在提示词中加入风格关键词（摄影风格/插画风格/3D渲染等）来定向输出',
    ],
    cases: [
      { title: '品牌视觉素材', description: '用Leonardo AI生成品牌宣传视觉素材', prompt: 'Brand visual for [brand_name], [industry] style, professional color palette, clean composition, high-end feel, suitable for social media and website --ar 16:9' },
      { title: '概念设计图', description: '用Leonardo AI快速生成设计概念方案', prompt: 'Concept art of [subject], [style], cinematic lighting, detailed texture, atmospheric, professional quality, ultra detailed --ar 16:9' },
      { title: '产品展示图', description: '用Leonardo AI生成产品场景图', prompt: '[Product] in [scene/environment], professional product photography, soft studio lighting, minimalist background, high detail, 8k --ar 4:3' },
    ],
    guides: [
      { title: '新手入门指南', steps: [
        '访问 Leonardo AI 的官方平台',
        '注册账号并了解免费额度',
        '学习基本的提示词结构：主体 + 风格 + 环境 + 参数',
        '从简单的描述开始，逐步增加细节',
        '使用预设模板或社区分享的提示词快速上手',
      ] },
      { title: '进阶使用技巧', steps: [
        '使用高级参数控制生成精度（采样器、CFG、步数等）',
        '结合ControlNet/Reference等工具精确控制构图和风格',
        '使用LoRA模型训练特定风格或角色',
        '批量生成并通过参数组合筛选最佳结果',
        '后期结合其他工具进行修图和细节调整',
      ] },
    ]
  },

  luma: {
    tips: [
      '快速生成高质量3D模型',
      'Dream Machine支持文生视频',
      '适合概念设计和产品展示',
      '描述3D模型时包含拓扑结构、面数等参数以控制输出质量',
      '使用参考图作为输入可大幅提升生成模型的准确度',
    ],
    cases: [
      { title: '产品3D模型', description: '用Luma AI为产品生成3D展示模型', prompt: 'Create a 3D model of [product], detailed geometry, PBR textures, suitable for [use_case], export format: [glb/fbx/obj]' },
      { title: '场景概念设计', description: '用Luma AI生成3D场景概念', prompt: 'Generate a 3D scene of [environment], [style] style, realistic lighting, detailed environment, atmospheric effects, game-ready asset' },
    ],
    guides: [
      { title: '新手入门指南', steps: [
        '访问 Luma AI 并注册账号',
        '了解基本功能和免费额度',
        '从简单的文本生成3D开始尝试',
        '尝试上传参考图进行图生3D',
        '导出生成的模型并在3D软件中查看',
      ] },
      { title: '进阶使用技巧', steps: [
        '使用高级参数控制模型拓扑和精度',
        '结合多视角参考图生成更准确的模型',
        '利用纹理烘焙功能创建高质量PBR材质',
        '批量生成多个变体并通过对比选择最佳结果',
        '将生成模型导入游戏引擎或3D软件进一步优化',
      ] },
    ]
  },

  wenshen_yiyan: {
    tips: [
      '中文理解能力在国产模型中非常出色',
      '支持图片理解和生成',
      '可以与百度生态产品深度集成',
      '使用"角色扮演"技巧：先给文心一言设定角色（如资深程序员），再提问，可获得更专业的回答',
      '利用"Few-shot Learning"：在提问时给出几个示例，让文心一言理解你想要的输出格式',
    ],
    cases: [
      { title: '专业文案创作', description: '使用文心一言生成高质量营销或品牌文案', prompt: '请帮我撰写一篇关于[产品或主题]的专业文案，要求：1. 明确目标受众 2. 突出核心卖点 3. 包含Call to Action 4. 语气与品牌调性一致' },
      { title: '数据分析与洞察', description: '用文心一言分析数据并生成可读报告', prompt: '请分析以下数据，给出：1. 关键发现和数据趋势 2. 异常点和可能的原因 3. 可执行的业务建议 4. 下一步行动计划\n数据：[粘贴数据]' },
      { title: '知识学习助手', description: '用文心一言辅助学习新知识领域', prompt: '请作为[领域]专家，用通俗易懂的方式向我解释以下概念：\n1. 核心定义\n2. 工作原理\n3. 实际应用场景\n4. 与其他相关概念的关系\n概念：[填写概念名称]' },
    ],
    guides: [
      { title: '新手入门指南', steps: [
        '访问 文心一言 的官网并注册账号',
        '选择适合的版本（免费版通常已足够日常使用）',
        '在对话框中清晰描述你的需求或问题',
        '根据回答进行追问，细化需求以获得更精准的结果',
        '保存有用的对话以便后续参考和复用',
      ] },
      { title: '进阶使用技巧', steps: [
        '使用结构化提示词模板（角色+背景+任务+输出格式）',
        '利用多轮对话构建上下文，让AI理解复杂场景',
        '结合外部工具或插件实现联网搜索、代码执行等高级功能',
        '使用Few-shot示例引导AI输出你期望的格式和风格',
        '定期整理和优化你的提示词库，建立个人最佳实践',
      ] },
    ]
  },

  tongyi: {
    tips: [
      '免费使用，无需翻墙',
      '支持PDF/Word/Excel/图片等多格式输入',
      '通义千问App可在手机上使用',
      '使用"角色扮演"技巧：先给通义千问设定角色（如资深程序员），再提问，可获得更专业的回答',
      '利用"Few-shot Learning"：在提问时给出几个示例，让通义千问理解你想要的输出格式',
    ],
    cases: [
      { title: '专业文案创作', description: '使用通义千问生成高质量营销或品牌文案', prompt: '请帮我撰写一篇关于[产品或主题]的专业文案，要求：1. 明确目标受众 2. 突出核心卖点 3. 包含Call to Action 4. 语气与品牌调性一致' },
      { title: '数据分析与洞察', description: '用通义千问分析数据并生成可读报告', prompt: '请分析以下数据，给出：1. 关键发现和数据趋势 2. 异常点和可能的原因 3. 可执行的业务建议 4. 下一步行动计划\n数据：[粘贴数据]' },
      { title: '知识学习助手', description: '用通义千问辅助学习新知识领域', prompt: '请作为[领域]专家，用通俗易懂的方式向我解释以下概念：\n1. 核心定义\n2. 工作原理\n3. 实际应用场景\n4. 与其他相关概念的关系\n概念：[填写概念名称]' },
    ],
    guides: [
      { title: '新手入门指南', steps: [
        '访问 通义千问 的官网并注册账号',
        '选择适合的版本（免费版通常已足够日常使用）',
        '在对话框中清晰描述你的需求或问题',
        '根据回答进行追问，细化需求以获得更精准的结果',
        '保存有用的对话以便后续参考和复用',
      ] },
      { title: '进阶使用技巧', steps: [
        '使用结构化提示词模板（角色+背景+任务+输出格式）',
        '利用多轮对话构建上下文，让AI理解复杂场景',
        '结合外部工具或插件实现联网搜索、代码执行等高级功能',
        '使用Few-shot示例引导AI输出你期望的格式和风格',
        '定期整理和优化你的提示词库，建立个人最佳实践',
      ] },
    ]
  },

  doubao: {
    tips: [
      '整合抖音热门趋势和爆款内容',
      '支持语音交互',
      '可以生成AI图片和视频',
      '使用"角色扮演"技巧：先给豆包设定角色（如资深程序员），再提问，可获得更专业的回答',
      '利用"Few-shot Learning"：在提问时给出几个示例，让豆包理解你想要的输出格式',
    ],
    cases: [
      { title: '专业文案创作', description: '使用豆包生成高质量营销或品牌文案', prompt: '请帮我撰写一篇关于[产品或主题]的专业文案，要求：1. 明确目标受众 2. 突出核心卖点 3. 包含Call to Action 4. 语气与品牌调性一致' },
      { title: '数据分析与洞察', description: '用豆包分析数据并生成可读报告', prompt: '请分析以下数据，给出：1. 关键发现和数据趋势 2. 异常点和可能的原因 3. 可执行的业务建议 4. 下一步行动计划\n数据：[粘贴数据]' },
      { title: '知识学习助手', description: '用豆包辅助学习新知识领域', prompt: '请作为[领域]专家，用通俗易懂的方式向我解释以下概念：\n1. 核心定义\n2. 工作原理\n3. 实际应用场景\n4. 与其他相关概念的关系\n概念：[填写概念名称]' },
    ],
    guides: [
      { title: '新手入门指南', steps: [
        '访问 豆包 的官网并注册账号',
        '选择适合的版本（免费版通常已足够日常使用）',
        '在对话框中清晰描述你的需求或问题',
        '根据回答进行追问，细化需求以获得更精准的结果',
        '保存有用的对话以便后续参考和复用',
      ] },
      { title: '进阶使用技巧', steps: [
        '使用结构化提示词模板（角色+背景+任务+输出格式）',
        '利用多轮对话构建上下文，让AI理解复杂场景',
        '结合外部工具或插件实现联网搜索、代码执行等高级功能',
        '使用Few-shot示例引导AI输出你期望的格式和风格',
        '定期整理和优化你的提示词库，建立个人最佳实践',
      ] },
    ]
  },

  muse: {
    tips: [
      'AI自动总结搜索结果页面内容',
      '支持AI阅读模式和摘要',
      '个性化内容推荐引擎',
      '使用具体的搜索词和限定词，Muse AI能返回更精准的结果',
      '利用高级搜索选项（学术/新闻/视频分类）定向获取信息',
    ],
    cases: [
      { title: '深度研究报告', description: '用Muse AI进行课题深度研究', prompt: '请对"[研究主题]"进行深度研究，包含：\n1. 最新进展和突破\n2. 主要争议和不同观点\n3. 关键参与方和研究机构\n4. 未来发展趋势\n5. 每个观点请提供来源引用' },
      { title: '事实核查验证', description: '用Muse AI验证信息真实性', prompt: '请核查以下陈述的真实性，提供可靠来源支持或反驳：\n[陈述内容]\n要求：1. 区分确认/存疑/错误 2. 提供权威来源链接 3. 说明判断依据' },
      { title: '竞品市场调研', description: '用Muse AI收集竞品和市场信息', prompt: '请对[行业/领域]进行市场调研：\n1. 主要竞争对手和产品\n2. 市场份额和增长趋势\n3. 技术创新方向\n4. 用户评价和痛点\n5. 最新行业动态' },
    ],
    guides: [
      { title: '新手入门指南', steps: [
        '访问 Muse AI 搜索平台',
        '在搜索框输入问题或关键词',
        '查看搜索结果及来源引用',
        '根据结果追问获取更多细节',
        '收藏有用的搜索结果和会话',
      ] },
      { title: '进阶使用技巧', steps: [
        '使用高级搜索语法精确控制搜索范围',
        '组合多个搜索角度进行交叉验证',
        '利用API实现自动化信息采集和监控',
        '建立个人知识库，整理和归类搜索成果',
        '设置信息更新提醒，追踪热点话题变化',
      ] },
    ]
  },

  gemini: {
    tips: [
      'Gemini 支持2M超长上下文，可一次处理大量信息',
      '支持视频上传和分析，能理解视频内容',
      '与Google生态（Gmail、Docs等）深度集成',
      '支持多模态输入：文本、图片、音频、视频',
      '使用"角色扮演"技巧：先给Gemini设定角色（如资深程序员），再提问，可获得更专业的回答',
    ],
    cases: [
      { title: '专业文案创作', description: '使用Gemini生成高质量营销或品牌文案', prompt: '请帮我撰写一篇关于[产品或主题]的专业文案，要求：1. 明确目标受众 2. 突出核心卖点 3. 包含Call to Action 4. 语气与品牌调性一致' },
      { title: '数据分析与洞察', description: '用Gemini分析数据并生成可读报告', prompt: '请分析以下数据，给出：1. 关键发现和数据趋势 2. 异常点和可能的原因 3. 可执行的业务建议 4. 下一步行动计划\n数据：[粘贴数据]' },
      { title: '知识学习助手', description: '用Gemini辅助学习新知识领域', prompt: '请作为[领域]专家，用通俗易懂的方式向我解释以下概念：\n1. 核心定义\n2. 工作原理\n3. 实际应用场景\n4. 与其他相关概念的关系\n概念：[填写概念名称]' },
    ],
    guides: [
      { title: '新手入门指南', steps: [
        '访问 Gemini 的官网并注册账号',
        '选择适合的版本（免费版通常已足够日常使用）',
        '在对话框中清晰描述你的需求或问题',
        '根据回答进行追问，细化需求以获得更精准的结果',
        '保存有用的对话以便后续参考和复用',
      ] },
      { title: '进阶使用技巧', steps: [
        '使用结构化提示词模板（角色+背景+任务+输出格式）',
        '利用多轮对话构建上下文，让AI理解复杂场景',
        '结合外部工具或插件实现联网搜索、代码执行等高级功能',
        '使用Few-shot示例引导AI输出你期望的格式和风格',
        '定期整理和优化你的提示词库，建立个人最佳实践',
      ] },
    ]
  },

  grok: {
    tips: [
      '深度集成X/Twitter平台，可获取最新实时信息',
      '回答风格相对自由，采用更少约束的对话方式',
      '支持实时数据分析和网络信息检索',
      'Pro订阅用户可获得更多使用额度',
      '使用"角色扮演"技巧：先给Grok设定角色（如资深程序员），再提问，可获得更专业的回答',
    ],
    cases: [
      { title: '专业文案创作', description: '使用Grok生成高质量营销或品牌文案', prompt: '请帮我撰写一篇关于[产品或主题]的专业文案，要求：1. 明确目标受众 2. 突出核心卖点 3. 包含Call to Action 4. 语气与品牌调性一致' },
      { title: '数据分析与洞察', description: '用Grok分析数据并生成可读报告', prompt: '请分析以下数据，给出：1. 关键发现和数据趋势 2. 异常点和可能的原因 3. 可执行的业务建议 4. 下一步行动计划\n数据：[粘贴数据]' },
      { title: '知识学习助手', description: '用Grok辅助学习新知识领域', prompt: '请作为[领域]专家，用通俗易懂的方式向我解释以下概念：\n1. 核心定义\n2. 工作原理\n3. 实际应用场景\n4. 与其他相关概念的关系\n概念：[填写概念名称]' },
    ],
    guides: [
      { title: '新手入门指南', steps: [
        '访问 Grok 的官网并注册账号',
        '选择适合的版本（免费版通常已足够日常使用）',
        '在对话框中清晰描述你的需求或问题',
        '根据回答进行追问，细化需求以获得更精准的结果',
        '保存有用的对话以便后续参考和复用',
      ] },
      { title: '进阶使用技巧', steps: [
        '使用结构化提示词模板（角色+背景+任务+输出格式）',
        '利用多轮对话构建上下文，让AI理解复杂场景',
        '结合外部工具或插件实现联网搜索、代码执行等高级功能',
        '使用Few-shot示例引导AI输出你期望的格式和风格',
        '定期整理和优化你的提示词库，建立个人最佳实践',
      ] },
    ]
  },

  elevenlabs: {
    tips: [
      '声音质量业界领先，支持丰富的情绪表达',
      '支持声音克隆功能，可以创建自己的声音模型',
      '提供丰富的预设声音库，覆盖多种语言和口音',
      '支持长文本生成，适合有声书、播客等场景',
      '描述音乐风格时要具体：包含节奏、乐器、情绪等要素',
    ],
    cases: [
      { title: '背景音乐制作', description: '用ElevenLabs为视频或播客生成背景音乐', prompt: 'Create a [length]-second background music track, [genre] style, [mood] mood, instrumental, suitable for [use_case], professional quality' },
      { title: '语音内容生成', description: '用ElevenLabs生成专业的语音内容', prompt: 'Generate [language] speech with [accent] accent, [emotion] tone, natural pacing, clear pronunciation for the following text: [text content]' },
    ],
    guides: [
      { title: '新手入门指南', steps: [
        '打开 ElevenLabs 平台并创建账号',
        '了解不同版本的功能和定价',
        '从简单的文本转语音或音乐生成开始尝试',
        '选择预设的风格和声音模板',
        '导出生成的内容并应用到项目中',
      ] },
      { title: '进阶使用技巧', steps: [
        '使用高级参数精确控制音色、音调和节奏',
        '利用声音克隆功能创建专属声音模型',
        '多轨合成：将生成的音轨与其他音频混合制作',
        '批量生成不同版本并通过A/B测试选择最佳效果',
        '结合音频编辑软件进行后期处理和优化',
      ] },
    ]
  },

  comfyui: {
    tips: [
      '节点式工作流可实现高度自定义的图像生成流程',
      '支持ControlNet、LoRA、IP-Adapter等主流扩展',
      '社区贡献了大量高质量的现成工作流可复用',
      '本地部署完全免费，适合批量生产和精细控制',
      '使用详细的主体描述：包括颜色、材质、光照、角度等细节，生成更精准的图像',
    ],
    cases: [
      { title: '品牌视觉素材', description: '用ComfyUI生成品牌宣传视觉素材', prompt: 'Brand visual for [brand_name], [industry] style, professional color palette, clean composition, high-end feel, suitable for social media and website --ar 16:9' },
      { title: '概念设计图', description: '用ComfyUI快速生成设计概念方案', prompt: 'Concept art of [subject], [style], cinematic lighting, detailed texture, atmospheric, professional quality, ultra detailed --ar 16:9' },
      { title: '产品展示图', description: '用ComfyUI生成产品场景图', prompt: '[Product] in [scene/environment], professional product photography, soft studio lighting, minimalist background, high detail, 8k --ar 4:3' },
    ],
    guides: [
      { title: '新手入门指南', steps: [
        '访问 ComfyUI 的官方平台',
        '注册账号并了解免费额度',
        '学习基本的提示词结构：主体 + 风格 + 环境 + 参数',
        '从简单的描述开始，逐步增加细节',
        '使用预设模板或社区分享的提示词快速上手',
      ] },
      { title: '进阶使用技巧', steps: [
        '使用高级参数控制生成精度（采样器、CFG、步数等）',
        '结合ControlNet/Reference等工具精确控制构图和风格',
        '使用LoRA模型训练特定风格或角色',
        '批量生成并通过参数组合筛选最佳结果',
        '后期结合其他工具进行修图和细节调整',
      ] },
    ]
  },

  perplexity: {
    tips: [
      '支持多模型切换（GPT-4o/Claude/Gemini/自研模型），一键对比不同模型回答',
      '自动附带引用的信息来源链接，可以直接点击验证',
      '支持聚焦模式（学术/视频/数学/编程等），定向搜索特定类型内容',
      'Pro版可使用Deep Research功能，对复杂问题进行深度多步研究',
      'Collections功能可分类保存搜索结果，构建个人知识库',
      '使用追问（Follow-up）功能逐步深入问题，获得更精准答案',
      'Spaces空间功能可针对特定项目/主题创建独立的搜索和知识环境',
      'API接口可供开发者集成到自己的应用中',
      '使用自然语言搜索，不需要像传统搜索那样纠结关键词',
      'RAG技术确保回答基于实时检索的信息，非模型预训练知识'
    ],
    cases: [
      { title: '深度行业研究', description: '用Perplexity进行全行业深度调研', prompt: '对行业进行深度研究，包含行业规模和增长趋势、主要玩家和市场份额、技术革新方向、监管政策动态、未来预测。每个观点请提供来源链接引用。' },
      { title: '技术调研报告', description: '用Perplexity对比技术方案', prompt: '对比技术方案A和技术方案B，从功能特性、性能基准测试数据、社区活跃度和生态、学习成本、适合场景等维度分析，为每个对比点提供来源。' },
      { title: '实时新闻追踪', description: '用Perplexity追踪热点事件', prompt: '提供关于热点事件的最新进展，包含事件发展时间线、各方立场和回应、权威机构观点、社交媒体反应、后续影响预测。所有信息来源需标注日期。' },
      { title: '学术论文对比', description: '用Perplexity对比同领域多篇论文', prompt: '在研究领域检索最近6个月内最重要论文，对比核心创新点、实验方法和数据集、主要发现和局限、潜在的后续研究方向。' },
      { title: '代码问题排查', description: '用Perplexity解决编程问题', prompt: '以下代码遇到的问题，请定位问题可能的原因、提供多种解决方案、指出最佳实践、给出参考代码示例。优先引用最新的官方文档和Stack Overflow讨论。' }
    ],
    guides: [
      { title: '快速上手', steps: ['1. 访问 perplexity.ai 或下载App', '2. 注册免费账号（Google/Apple/邮箱）', '3. 在搜索框输入问题（支持自然语言）', '4. 查看AI生成的回答和引用来源', '5. 点击追问（Follow-up）继续探索'] },
      { title: '高效使用技巧', steps: ['1. 使用Focus功能切换搜索范围（学术/视频/Reddit等）', '2. 创建Collections分类保存搜索结果', '3. 设置Spaces为不同项目创建独立搜索环境', '4. 使用Pro版的Deep Research进行多步深度研究', '5. 打开Copilot切换不同AI模型对比回答'] },
      { title: '进阶研究工作流', steps: ['1. 先用Deep Research生成研究路线图', '2. 每个子问题使用Focus学术模式深入', '3. 将每个阶段的发现保存到Collection', '4. 用追问功能连接各子问题的发现', '5. 导出整个研究过程为文档分享给团队'] }
    ]
  },

  openclaw: {
    tips: [
      'OpenClaw 是一个开源个人AI助手，支持跨平台（Windows/macOS/Linux/Android/iOS），数据本地存储确保隐私安全',
      '采用终端优先（Terminal-First）设计理念，深度熟悉后效率远超图形界面AI工具',
      '支持MCP（Model Context Protocol）协议，可无缝连接外部工具和数据源扩展AI能力',
      '插件系统极其丰富，从文件管理到代码执行、从知识库到自动化工作流全覆盖',
      '使用自然语言指令替代菜单点击，一次输入可串联多个操作（如\"搜索x项目，把结果整理成表格，发送邮件给团队\"）',
      '通过OpenClaw Agent模式可配置自主AI代理，定时执行任务或监控系统变化',
      '支持多种LLM后端切换（OpenAI/Claude/DeepSeek/本地模型），灵活控制成本和隐私',
      '使用命令别名功能，将常用复杂操作简化为简短命令，大幅提升日常效率'
    ],
    cases: [
      { title: '个人知识库搭建', description: '用OpenClaw构建个人知识管理系统', prompt: '请帮我用OpenClaw搭建一个个人知识库系统：1.创建知识库文件夹结构 2.配置Markdown文件自动索引 3.设置AI自动摘要和标签 4.集成搜索功能实现全文检索 5.配置定期自动整理规则' },
      { title: '自动化工作流', description: '设计并运行自动化AI工作流', prompt: '帮我设计一个自动化工作流：1.每天早上8点抓取[指定网站/博客]的最新内容 2.AI提取关键信息并总结 3.整理为待办事项列表 4.输出到指定的Markdown文件中 5.如有紧急事项通过通知推送到手机' },
      { title: '代码项目助手', description: '用OpenClaw管理代码项目', prompt: '用OpenClaw创建一个代码项目助手Agent，它能：1.理解项目的目录结构和文件关系 2.根据自然语言需求自动生成代码文件 3.运行代码并捕获错误 4.基于错误信息自动修复 5.保持项目代码风格一致' },
      { title: '个人AI助手改造', description: '定制个性化AI助手', prompt: '帮我在OpenClaw中定制一个私人AI助手：1.角色设定为[技术/写作/学习]专家 2.加载我的个人笔记和知识库作为上下文 3.配置专属指令和响应风格 4.设定每日任务清单提醒 5.集成日历和待办事项管理' }
    ],
    guides: [
      { title: '新手入门指南', steps: ['1. 从GitHub仓库（github.com/openclaw/openclaw）下载最新Release或通过包管理器安装', '2. 根据操作系统选择合适的安装方式：Windows用exe安装包，macOS用brew install，Linux用snap/apt', '3. 首次启动后按照引导完成基础配置：选择LLM后端（推荐先选DeepSeek免费使用）', '4. 学习核心命令：/help查看所有命令，/search搜索内容，/file管理文件', '5. 从插件市场安装常用插件：文件管理器、代码执行器、Markdown编辑器', '6. 尝试第一个任务：输入\"帮我创建一个待办事项列表\"体验自然语言交互', '7. 配置数据同步：连接本地文件夹或云存储，确保数据不丢失'] },
      { title: '进阶技巧与自动化', steps: ['1. 编写自定义插件：遵循OpenClaw插件规范（Python/TypeScript），实现专属功能扩展', '2. 配置MCP Server连接外部数据源：如数据库、API、企业内部系统等', '3. 创建命令别名：将\"搜索论文，提取摘要，输出到research.md\"缩写为\"/paper <关键词>\"', '4. 设置定时任务：用Cron语法配置Agent定时执行任务（如每日新闻摘要、周报自动生成）', '5. 多Agent协作：创建多个专业Agent（编程Agent、写作Agent、数据Agent），配置它们之间的通信和协作流程', '6. 提示词模板库：为常用场景创建提示词模板，通过/load template_name快速加载', '7. 性能优化：选择轻量LLM后端减少响应延迟，配置本地Embedding模型加速知识检索'] }
    ]
  },

  claude_code: {
    tips: [
      'Claude Code 直接在你的终端中运行，与现有开发工作流无缝集成，无需离开命令行',
      '支持 ACP（Anthropic Context Protocol）协议，可让Claude Code访问和修改项目中的任何文件',
      '内置Git集成：自动分析git diff、智能生成commit message、辅助处理合并冲突',
      '使用\"Agent模式\"让Claude自主完成复杂任务：分析代码→搜索文件→修改→运行测试→修复问题的完整循环',
      '项目管理能力：Claude Code能理解整个项目的目录结构、依赖关系和架构模式',
      '支持在对话中引用具体文件（@file）、函数（@func）或搜索结果，精确控制上下文范围',
      '与Claude Web端配合使用：在Web端构思复杂方案，在终端中用Code执行具体实现',
      '使用/slash命令：/commit生成Git提交、/review审查代码、/test生成测试等快捷操作'
    ],
    cases: [
      { title: '大型代码库重构', description: '用Claude Code重构整个项目', prompt: '请分析项目的整体架构，识别设计模式和反模式。然后逐步重构[具体模块/文件]，保持向后兼容性，每一步都需运行测试验证。重构过程中如遇到依赖问题，自动修复并继续。' },
      { title: '全栈功能开发', description: '用Claude Code从零开发功能模块', prompt: '在项目中添加一个新的[功能名称]功能模块。步骤：1.设计数据库模型和迁移脚本 2.实现API路由和业务逻辑 3.创建前端组件和页面 4.编写单元测试和集成测试 5.更新项目文档。请确保遵循项目的代码风格和最佳实践。' },
      { title: '迁移与升级', description: '用Claude Code升级技术栈', prompt: '将项目从[旧技术栈]迁移到[新技术栈]。具体任务：1.分析当前代码中所有需要迁移的点 2.制定分批迁移计划 3.逐模块执行迁移 4.迁移完成后修复所有编译错误和运行时错误 5.更新package.json和配置文件 6.确保所有测试通过。' },
      { title: '代码审查与优化', description: '用Claude Code进行深度代码审查', prompt: '请审查项目中的[文件/模块]代码。审查范围包括：1.潜在bug和边缘情况 2.安全漏洞（SQL注入、XSS、CSRF等） 3.性能瓶颈 4.代码风格一致性 5.可维护性和可测试性 6.文档和注释完整性。对每个发现的问题给出修复方案。' }
    ],
    guides: [
      { title: '新手入门指南', steps: ['1. 安装Claude Code: npm install -g @anthropic/claude-code 或通过pip/brew安装', '2. 在项目根目录运行 claude 命令启动交互式对话', '3. 首次运行需完成认证：登录Anthropic账号并授权终端访问', '4. 从简单任务开始：输入\"解释这个项目的架构\"让Claude分析代码结构', '5. 学习核心命令：/help查看所有命令、/commit处理Git提交、/review审查代码', '6. 尝试编辑任务：\"给main.ts添加错误处理中间件\"体验AI自动修改代码', '7. 配置.claude.md项目规则文件，让Claude了解项目的编码规范和偏好'] },
      { title: '进阶使用技巧', steps: ['1. 编写项目规则：在项目根目录创建.claude.md，定义编码风格、技术栈偏好、测试要求等', '2. 利用ACP协议：Claude Code可自动创建、读取、更新、删除项目文件，无需手动复制粘贴', '3. Git工作流集成：用/commit生成符合Conventional Commits规范的提交信息，用/review审查PR', '4. 多步骤Agent任务：一次描述复杂需求（如\"添加用户认证模块，包含注册登录和密码重置\"），Claude自动规划并执行', '5. 上下文管理：使用@file和@func精确控制AI理解范围，避免不必要的token消耗', '6. 错误自愈循环：让Claude运行代码、捕获错误、分析根因、修复Bug、再次验证，形成闭环', '7. 与CI/CD集成：在GitHub Actions或GitLab CI中集成Claude Code进行自动化代码审查和测试生成'] }
    ]
  },

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
  enhanceTool({ id: 'chatgpt', name: 'ChatGPT', logo: '🤖', description: 'OpenAI开发的旗舰级对话式AI助手，基于GPT-4/GPT-4o多模态大模型，支持文本生成、代码编写、图像分析、文件处理等多种任务。作为全球用户最多的AI工具，ChatGPT覆盖从日常问答到专业编程的全场景需求，凭借其强大的自然语言理解和生成能力，已成为个人提效和企业数字化转型的核心工具。2025年推出的GPT-4o进一步降低了使用门槛，免费用户也能体验顶级AI能力。适用于内容创作、编程开发、学术研究、办公自动化、数据分析等各类场景。', caseStudies: [
      { title: 'ChatGPT 从入门到精通：完整教程', source: 'bilibili', creator: 'B站AI教程', description: '涵盖ChatGPT注册、基础使用、高级Prompt工程到实际办公应用的全流程教程', url: 'https://www.bilibili.com/video/BV1Lg4y1c7fk', duration: '45:00', skill: 'ChatGPT入门' },
      { title: '用ChatGPT自动生成周报和会议纪要', source: 'bilibili', creator: 'B站AI教程', description: '手把手用ChatGPT处理日常办公任务，省时省力', url: 'https://www.bilibili.com/video/BV1ZS421R7V7', duration: '30:00', skill: 'AI自动化' }
    ],
    dailyPick: '全球用户最多的AI助手，GPT-4o多模态免费开放，从写文案到写代码、从分析数据到生成图片，一个工具搞定所有AI需求', url: 'https://chat.openai.com', price: 'freemium', difficulty: 'beginner', heat: 77.9, heatGrowth: 12.6, tags: ['AI对话', '文本生成', '代码助手'], techTags: ['NLP', 'GenerativeAI'], sceneTags: ['办公提效', '内容创作', '编程开发', '企业AI自动化'], costTags: ['Freemium', '需翻墙'], category: 'AI对话', prompts: [{ id: 'p1', title: '小红书爆款文案生成', content: '请帮我写一篇关于[产品名称]的小红书文案，要求：1.开头有吸引力 2.使用emoji 3.包含3-5个卖点 4.结尾有call to action', scene: '电商运营' }, { id: 'p2', title: '周报生成助手', content: '根据以下本周工作内容，生成一份专业的周报：\\n[工作内容列表]\\n要求：分点清晰、数据量化、突出成果', scene: '办公提效' }, { id: 'p3', title: '论文摘要改写', content: '请将以下论文摘要改写为适合大众阅读的科普版本，要求通俗易懂，保留核心观点：\\n[论文摘要]', scene: '学术研究' }], tips: ['使用GPT-4可获得更好的推理能力', '可以上传图片进行多模态对话', 'Custom GPTs可针对特定任务优化'], relatedSkills: ['skill_xhs_rewrite', 'skill_weekly_report'], xhsSaves: 1250000, features: ['GPT-4o多模态理解：支持文本、图片、音频、文件混合输入，一次对话解决复合问题', 'Custom GPTs商店：社区创建的数万种专业AI助手，一键适配特定场景', '内存与个性化：AI自动学习用户偏好，长期对话保持上下文一致性', '代码解释器(Advanced Data Analysis)：上传数据文件自动分析、可视化、建模', '联网搜索(Browsing)：获取实时信息并引用可靠来源', 'DALL·E 3集成：对话中直接生成和编辑图片', '语音对话模式：自然的实时语音交互，支持多种语调和方言', '插件生态(Plugins)：扩展第三方服务如Zapier、Wolfram等'], pricing: 'ChatGPT提供免费版（GPT-3.5 + GPT-4o有限额度）和ChatGPT Plus（$20/月，GPT-4o无限+GPT-4高容量+插件+DALL·E 3）。Team版$25/人/月（团队协作），Enterprise版（企业级安全和定制）。免费用户每天可使用GPT-4o约50次消息，足以应对日常需求。', pros: ['生态最完善：插件、GPTs商店、DALL·E集成形成了完整的产品矩阵', '多模态能力领先：GPT-4o支持文本+图片+音频的混合理解，无出其右', '免费额度慷慨：免费用户就能用GPT-4o级模型，入门门槛极低', 'API成熟度高：全球最成熟的LLM API生态，几乎支持所有编程框架'], cons: ['需科学上网才能访问，中国用户使用有网络障碍', '免费版GPT-4o消息次数有限，重度使用需付费', '中文处理能力不如国产模型细腻，对中文文化语境理解有短板', '推理过程不透明，GPT-4并非最强推理模型（已被Claude和DeepSeek追赶）'], targetAudience: ['AI初学者：零基础用户通过自然对话快速上手AI工具', '内容创作者：写文案、做方案、润色文章的内容从业者', '程序员：辅助编码、代码审查、技术方案设计的开发人员', '企业办公人群：需提效的行政、HR、运营等办公人员', '学生和研究人员：论文润色、文献分析、学术写作辅助'], useCases: ['内容营销：从标题到正文到配图建议一站式生成，配合DALL·E实现图文联动', '数据分析：上传CSV/Excel文件用自然语言描述分析需求，自动生成图表和洞察报告', '编程Debug：将报错信息粘贴进去，AI分析原因并给出修复代码和解释', '邮件与文档：快速生成专业商务邮件、方案文档、会议纪要等办公内容', '辅助学习：解释复杂概念、生成练习题、总结知识点，充当1对1私教'], faqs: [{ question: 'ChatGPT免费版和付费版的核心区别是什么？', answer: '免费版使用GPT-3.5模型和有限额度的GPT-4o，付费Plus版（$20/月）提供无限GPT-4o访问、更高的GPT-4消息上限、DALL·E 3图片生成、数据分析、插件和联网搜索功能。对于日常写作和问答，免费版完全够用；编程和数据分析重度用户建议升级Plus。' }, { question: 'ChatGPT和Claude哪个更好？', answer: '两者各有所长。ChatGPT在插件生态、多模态、API开放性上领先；Claude在长文档处理（200K上下文）、代码能力和安全性上更优。建议：日常对话和创意写作用ChatGPT，深度编程和长文档分析用Claude。很多用户将两者结合使用。' }, { question: '国内怎么使用ChatGPT？', answer: 'ChatGPT目前需要科学上网才能访问。国内用户可考虑：1)通过正规VPN访问 2)使用国产替代方案如Kimi、DeepSeek、通义千问 3)通过ChatGPT API结合第三方客户端使用。后两者在中文场景下表现也不逊色。' }, { question: 'ChatGPT能处理多长的文本？', answer: 'GPT-3.5支持约4K tokens（约3000字），GPT-4支持8K/32K/128K tokens，GPT-4o支持128K tokens（约10万汉字）。对于常见文章和论文分析，128K上下文足够覆盖大部头文档，但和其他支持1M tokens的模型（如Kimi、DeepSeek）相比仍有差距。' }] }),
  enhanceTool({ id: 'midjourney', name: 'Midjourney', logo: '🎨', description: 'AI图像生成领域的开创者和标杆产品，通过文本描述即可生成电影级质量和艺术审美的图像。Midjourney基于自研的扩散模型架构，在美学表现、风格多样性和细节丰富度上长期领先同类产品。其v6版本大幅提升了文字渲染和构图能力，支持--style参数精细控制艺术风格。运营模式上采用Discord交互，社区活跃度极高，数百万创作者每天分享作品和Prompt提示词。从电商产品图到品牌视觉设计，从概念艺术到个人头像，Midjourney已成为创意工作者的标配工具。', caseStudies: [
      { title: 'Midjourney 完整教程：从提示词到商业级作品', source: 'bilibili', creator: 'B站课堂', description: '系统讲解Midjourney提示词工程、参数调优和实战案例', url: 'https://www.bilibili.com/cheese/play/ss23652', duration: '60:00', skill: 'Midjourney提示词' },
      { title: 'AI绘画入门：Midjourney VS Stable Diffusion', source: 'bilibili', creator: 'B站AI教程', description: '主流AI绘画工具对比，帮你选出最适合的创作工具', url: 'https://www.bilibili.com/video/BV1ZS421R7V7', duration: '25:00', skill: 'AI绘画对比' }
    ],
    dailyPick: 'AI绘画界的标杆，电影级美学质量独一档，从电商产品图到品牌视觉设计，用文字描述即可生成专业级图像', url: 'https://www.midjourney.com', price: 'paid', difficulty: 'intermediate', heat: 74, heatGrowth: 10.4, tags: ['AI绘画', '图像生成', '创意设计'], techTags: ['GenerativeMedia', 'Diffusion'], sceneTags: ['设计创作', '电商运营', '内容创作'], costTags: ['Paid', '需翻墙'], category: '图像生成', prompts: [{ id: 'p1', title: '产品场景图', content: 'Product photography, [product] on a marble table, soft natural lighting, minimalist style, high-end luxury feel, 8k --ar 3:4', scene: '电商运营' }, { id: 'p2', title: '头像生成', content: 'Portrait illustration, [style], [person description], clean background, professional avatar, --ar 1:1', scene: '个人品牌' }], tips: ['使用--ar参数控制图片比例', 'v6版本对文字支持更好', '可以在Discord中查看他人Prompt学习'], relatedSkills: ['skill_batch_image'], features: ['文生图核心：通过自然语言描述生成4张候选图像，支持迭代优化', '多版本模型：v6（最佳画质和文字渲染）、v5.2（风格化最强）、Niji（动漫风格专精）', '精准参数控制：--ar（比例）、--s（风格强度）、--v（版本）、--stylize（风格化）等20+参数', '图生图/图生文：上传参考图作为构图或颜色风格参考', 'Pan/Zoom重绘：生成后向外扩展画面或放大局部细节', 'Remix模式：在变体生成时替换原Prompt部分内容进行混合创作', 'Blend功能：多图融合，将不同图片的风格和元素合成', 'Discord社区生态：数百万用户的作品库和Prompt灵感库'], pricing: 'Midjourney为纯付费模式，无免费版。基础版$10/月（约200张图/月），标准版$30/月（不限量+Fast模式），Pro版$60/月（Stealth隐私模式+更多并发）。年付可享20%折扣。建议从标准版起步，不限量生成+Fast模式体验最佳。试想用户可通过有限次数的免费试用（约25张）决定是否付费。', pros: ['美学质量业界第一：生成的图像在构图、光影、色彩上具有真正的艺术感', '风格多样性极强：从写实摄影到浮世绘到赛博朋克，几乎覆盖所有视觉风格', '参数控制系统强大：20+参数让高级用户拥有精细创作控制力', '社区生态繁荣：Discord上百万级别的Prompt库和学习资源'], cons: ['完全付费且价格较高：最低$10/月起，不适合偶尔使用的用户', '需在Discord中操作：没有独立App，交互方式特殊学习曲线陡峭', '生成速度较慢：单次生成约需30-60秒，批量生产效率不足', '中文Prompt效果差：必须使用英文提示词，对中国用户有语言门槛'], targetAudience: ['设计师/创意总监：需要快速产出创意方案和视觉参考的专业设计人员', '电商运营者：需要产品场景图、营销素材的电商团队', '个人品牌创作者：需要头像、封面图、品牌视觉的独立创作者', '游戏/影视概念设计师：需要快速生成角色、场景概念图的美术人员', 'AI艺术爱好者：对AI生成艺术有浓厚兴趣的探索型用户'], useCases: ['电商产品图批量生产：利用产品图+场景描述，批量生成多风格产品展示图用于A/B测试', '品牌视觉体系搭建：从Logo到VI应用图到社交媒体封面，统一品牌视觉风格', '概念艺术设计：游戏角色/建筑/场景的概念图快速迭代，大幅降低外包沟通成本', '社交媒体配图：根据文章主题生成配图，风格一致且无版权风险', '室内软装设计预览：上传房间照片+风格描述，生成装修效果预览图'], faqs: [{ question: 'Midjourney和其他AI绘画工具（DALL·E 3/Stable Diffusion）相比如何？', answer: 'Midjourney在美学质量上公认最强，产出更接近"艺术作品"而非"AI生成图"。DALL·E 3在自然语言理解上更好，对复杂指令的遵循更准确，适合精确控制画面的场景。Stable Diffusion胜在开源免费+本地部署+ControlNet精准控制，适合需要批量生产或定制模型的专业用户。简单说：追求艺术美感选MJ，追求精准控制选SD，追求易用性选DALL·E。' }, { question: 'Midjourney必须用英文提示词吗？', answer: '是的，Midjourney的核心模型基于英文训练，中文提示词效果很差。不过你可以在ChatGPT中先用中文描述，让ChatGPT翻译成专业MJ英文Prompt再使用。也可以参考我们页面中的Prompt案例库，从中提取适合你场景的英文模板。' }, { question: 'Midjourney生成的图片有版权吗？可以商用吗？', answer: '付费用户拥有生成的图片的全部所有权和商用权利，包括用于商业产品、印刷品、数字资产等。免费试用用户生成的图片使用CC BY-NC 4.0协议（仅限非商业用途）。Pro版用户还支持Stealth模式，生成的图片不会出现在公共画廊中，保护商业项目隐私。' }, { question: '哪个版本最适合我？新手如何选择？', answer: 'v6是目前最新版本，在文字渲染、真实感和构图方面全面领先，推荐新手直接使用。如果你需要动漫/二次元风格，选择Niji模型效果最佳。v5.2在艺术风格化方面仍有独特优势。在Discord中通过/settings命令可切换默认版本，或者在提示词末尾加--v 6/--v 5.2/--niji 6来指定。' }] }),
  enhanceTool({ id: 'gamma', name: 'Gamma', logo: '📊', description: 'AI驱动的演示文稿生成工具，一句话生成完整PPT', url: 'https://gamma.app', price: 'freemium', difficulty: 'beginner', heat: 59.4, heatGrowth: 21.4, tags: ['PPT生成', '演示文稿', '办公工具'], techTags: ['GenerativeAI'], sceneTags: ['办公提效', '商业计划书', '课程大纲'], costTags: ['Freemium', '中文友好'], category: '办公工具', prompts: [{ id: 'p1', title: '学术答辩PPT', content: '生成一份关于\"[论文主题]\"的学术答辩PPT，包含：研究背景、研究方法、实验结果、结论与展望', scene: '学术研究' }, { id: 'p2', title: '商业计划书', content: '为\"[项目名称]\"生成商业计划书PPT，包含：市场痛点、解决方案、商业模式、竞争优势、财务预测', scene: '创业' }], tips: ['支持导入PDF文档自动生成PPT', '可以选择不同风格模板', '生成后可以在线编辑'], relatedSkills: ['skill_auto_ppt'],
    features: ['一键生成完整PPT：输入主题，AI自动生成包含大纲、正文、图表和配图的完整演示文稿', '100+专业模板：覆盖商务、学术、创意、科技等多场景的AI自适应模板', 'AI内联编辑：选中任意元素直接用自然语言指令修改，无需手动拖拽', '文档导入生成：支持PDF/Word/Markdown文件导入，自动提取内容生成PPT', '实时协作：多人同时在线编辑同一份PPT，支持评论和版本历史', 'AI配图生成：直接在PPT内调用AI生成配图，无需跳转其他工具', '一键风格切换：随时切换配色方案和整体风格，不影响内容结构', '导出格式多样：支持PDF、PPTX、图片格式导出，或直接在线演示'],
    pricing: 'Gamma采用Freemium模式。免费版：可生成无限PPT但带有Gamma水印，每个文档限500个AI生成点数。Pro版$10/月：去水印、无限生成点数、高清导出、自定义品牌。Team版$20/人/月：团队协作、统一品牌模板、管理控制台。教育用户可申请折扣。与同类工具对比，Gamma的免费版无文档数量限制（仅加水印）是最慷慨的。',
    pros: ['生成速度快：输入主题后10-30秒即可生成完整PPT，远超手动制作效率', '模板质量高：AI适配的模板在排版和配色上专业度较高', '协作能力强：支持多人实时编辑，适合团队汇报场景', '中文支持好：对中文内容和中文PPT风格有较好的理解'],
    cons: ['自定义程度有限：AI生成的排版格式难以深度定制', '免费版有水印：商用场景需要付费去水印', '复杂动画不支持：无法制作复杂的PPT动画效果', '离线不可用：全部在线操作，无网络时无法使用'],
    targetAudience: ['职场白领：需要快速制作周报、汇报、方案PPT的上班族', '学生群体：准备学术答辩、毕业论文答辩、课堂展示的学生', '创业者：制作商业计划书、路演PPT、融资材料的创始人', '教育培训者：制作课程课件、培训材料的教师和讲师', '市场营销人员：制作营销方案、活动方案、产品发布PPT的市场人'],
    useCases: ['学术答辩准备：输入论文标题和关键词，AI自动生成答辩PPT的完整结构和讲稿要点', '商业计划书：输入项目名称和核心卖点，生成投资人导向的商业计划演示', '年终汇报总结：提供年度数据和工作成果，AI自动生成数据图表和总结PPT', '产品发布会：输入产品核心亮点和市场定位，生成发布会级别的演示文稿', '课程课件制作：输入课程主题和学习目标，生成结构化的教学PPT'],
    faqs: [
      { question: 'Gamma的免费版和付费版有什么区别？', answer: '免费版可无限生成PPT但带有Gamma水印，每个文档有500个AI点数限额（约可生成10-15页内容）。Pro版$10/月去水印、无限点数、高清导出和自定义品牌。Team版$20/人/月增加团队协作和管理功能。对偶尔使用的用户，免费版完全够用；商用场景建议Pro版去水印。' },
      { question: 'Gamma生成的中文PPT质量如何？', answer: 'Gamma是少数对中文支持极好的海外PPT工具。生成的中文排版本地化程度高，没有出现中英文混排问题。建议生成时使用中文描述主题和内容需求，AI能够理解中文的语义和逻辑结构。如果需要学术风格或中文商务风格PPT，Gamma是目前最好的选择之一。' },
      { question: 'Gamma支持从PDF或Word导入制作PPT吗？', answer: '支持。你可以直接上传PDF、Word或Markdown文档，Gamma的AI会自动提取文档内容、识别章节结构，并生成对应的PPT。这个功能在需要把长篇报告转换成演示文稿时特别实用，省去了逐页复制粘贴的繁琐工作。' },
      { question: '用Gamma制作的PPT可以导出到PowerPoint编辑吗？', answer: '可以导出为PPTX格式，在PowerPoint中打开后可继续编辑。但需要注意，Gamma特有的排版效果（如AI生成的图表、特殊布局）导出后可能会有格式变化。建议在Gamma中完成最终排版后直接在线演示或导出PDF。' }
    ]
  }),
  enhanceTool({ id: 'kimi', name: 'Kimi', logo: '🌙', description: '月之暗面推出的AI助手，支持超长上下文和文件分析', url: 'https://kimi.moonshot.cn', price: 'free', difficulty: 'beginner', heat: 65.2, heatGrowth: 35.8, tags: ['AI对话', '长文本', '文件分析'], techTags: ['NLP', 'RAG'], sceneTags: ['办公提效', '学术研究', '内容创作', '企业AI自动化'], costTags: ['Free', '中文友好'], category: 'AI对话', prompts: [{ id: 'p1', title: 'PDF论文解析', content: '请分析以下PDF论文，提取核心观点、研究方法、结论，并列出可能的应用场景：', scene: '学术研究' }, { id: 'p2', title: '会议纪要生成', content: '根据以下会议记录，生成结构化的会议纪要，包含：议题、讨论要点、行动计划、待办事项', scene: '办公提效' }], tips: ['支持最多20万字上下文', '可以直接读取PDF、Word、Excel等文件', '支持联网搜索'], relatedSkills: [],
    features: ['200K超长上下文窗口：可一次性处理20万字文本，相当于三体三部曲的总字数', '多格式文件解析：直接读取PDF/Word/Excel/PPT/图片中的文字内容，无需转换', '联网搜索增强：自动检索互联网信息补充回答，确保时效性', 'Kimi+智能体市场：提供论文写作、代码助手、翻译等场景化AI模板', '长文生成模式：一次性生成上万字的结构化长文，适合报告和论文', '影视搜索集成：深度整合影视娱乐信息，支持剧集查询和推荐', '多语言翻译：高质量的中英互译，尤其擅长学术论文翻译', '语音输入支持：App端支持语音输入，提升交互效率'],
    pricing: 'Kimi目前完全免费，无需付费订阅，无消息次数限制。支持最长20万字的超长上下文，可免费使用联网搜索、文件上传分析、Kimi+智能体等全部功能。Web端和App端均可免费使用。作为国产AI，无需翻墙，注册即用。API方面，Kimi的Moonshot API提供有竞争力的价格，适合开发者集成。',
    pros: ['超长上下文遥遥领先：200K tokens可一次处理整本长篇小说或数十篇论文', '文件分析能力出色：对PDF/Excel等格式的内容提取准确率极高', '完全免费无限制：不管是上下文长度还是使用次数都无限制，国产良心', '中文理解深度好：对中国文化语境和中文表达习惯的理解很到位'],
    cons: ['高峰期偶有服务器拥堵，响应速度变慢', '影视娱乐之外的专业领域知识深度有限', '代码能力不如DeepSeek和Claude，不适合复杂编程任务', 'Kimi+智能体数量和质量还在增长中，选择不如GPTs丰富'],
    targetAudience: ['学术研究者：需要大量阅读和分析PDF论文的学生和科研人员', '办公白领：需要处理长文档、会议纪要、周报的职场人士', '内容创作者：需要长文写作、翻译润色的写作者', '求职者：需要简历优化、面试准备辅助的求职人群', '普通信息消费者：需要联网搜索获取最新信息的日常用户'],
    useCases: ['论文文献分析：上传10+篇PDF论文，让Kimi自动提取每篇的核心观点和方法论对比', '会议纪要整理：将会议录音转文字后提交Kimi，自动生成结构化会议纪要和待办事项', '合同/报告审阅：上传合同或尽调报告，AI快速识别关键条款和潜在风险点', '长文写作：输入大纲和要点，AI一次性生成5000-10000字的长文章或报告', '跨境学习/工作：上传英文论文或邮件，AI提供高质量的中文翻译和润色建议'],
    faqs: [
      { question: 'Kimi和其他国产AI相比有什么独特优势？', answer: 'Kimi最核心的优势是200K超长上下文，是DeepSeek的1/5、通义千问的2倍，在业界处于第一梯队。其次，Kimi的文件解析能力特别出色，PDF/Excel/PPT中的文字提取准确率很高。第三，Kimi+智能体市场提供了场景化的AI助手模板，降低了使用门槛。如果你是学生或研究者需要大量阅读文献，Kimi是国产AI中的最佳选择。' },
      { question: 'Kimi是免费的吗？有什么限制？', answer: '目前完全免费，无消息次数限制，无上下文长度限制。可以免费使用联网搜索、文件上传分析、Kimi+智能体等全部功能。没有像其他AI那样的每日消息限额或高级功能付费墙。这是Kimi在商业策略上的一大优势：通过完全免费快速积累用户。' },
      { question: 'Kimi支持手机App吗？可以在手机上用吗？', answer: '支持。Kimi有iOS和Android手机App，在应用商店搜索"Kimi智能助手"即可下载。App支持语音输入，体验流畅。手机端和Web端的账号互通，上下文和聊天记录同步。对于经常在通勤路上阅读文件或写东西的用户来说，App体验很不错。' },
      { question: 'Kimi适合用来写代码吗？', answer: 'Kimi可以处理简单的编程任务，如写小函数、理解代码逻辑等。但如果你主要是做编程，建议选择DeepSeek（免费+代码能力强）或Claude（编程最强）。Kimi的真正强项是长文档分析和内容理解，不是代码生成。' }
    ]
  }),
  enhanceTool({ id: 'claude', name: 'Claude', logo: '🧊', description: 'Anthropic推出的新一代AI助手，基于Claude 3.5/4系列大模型，在长文本分析、代码生成和深度推理方面表现卓越。Claude以其超长200K上下文窗口、强安全约束和出色的写作能力著称，尤其擅长处理复杂编程任务、长文档分析和学术写作。Artifacts功能使其成为唯一能创建可交互Web内容的对话AI。相比ChatGPT，Claude在代码生成质量、数学推理和多轮对话一致性方面表现更优，被开发者社区誉为"最强编程AI"。适用于编程开发、学术研究、内容创作和企业办公等专业场景。', caseStudies: [
      { title: 'Claude vs ChatGPT：深度对比评测', source: 'bilibili', creator: 'B站AI教程', description: '两大AI模型的详细对比，帮你选择最适合的工具', url: 'https://www.bilibili.com/video/BV1jk4y1x7rq', duration: '22:00', skill: 'AI工具对比' },
      { title: 'Claude 3.5 长文档处理实战', source: 'bilibili', creator: 'B站AI教程', description: '用Claude处理超长文档、论文分析和代码审查', url: 'https://www.bilibili.com/video/BV1ZS421R7V7', duration: '35:00', skill: '长文档处理' }
    ],
    dailyPick: '开发者社区公认的编程最强AI，200K超长上下文+Artifacts交互内容+Claude Code终端编程，深度编程和长文档分析首选', url: 'https://claude.ai', price: 'freemium', difficulty: 'intermediate', heat: 72.3, heatGrowth: 8.2, tags: ['AI对话', '代码助手', '分析工具'], techTags: ['NLP', 'GenerativeAI'], sceneTags: ['编程开发', '内容创作', '办公提效', '企业AI自动化'], costTags: ['Freemium', '需翻墙'], category: 'AI对话', prompts: [{ id: 'p1', title: '代码重构建议', content: '请分析以下代码，提出重构建议以提升可读性和性能：\\n[代码]', scene: '编程开发' }, { id: 'p2', title: '文章润色', content: '请润色以下文章，提升语言表达和逻辑连贯性：\\n[文章内容]', scene: '内容创作' }], tips: ['Claude 3.5 Sonnet 性价比最高', 'Artifacts功能可以创建交互式内容', '支持上传文件进行分析'], relatedSkills: [], features: ['200K超长上下文窗口：一次处理约15万字，可完整分析整本书或大型代码库', 'Artifacts交互式输出：生成可直接运行的HTML/React/SVG页面，非基础文字回复', 'Claude Code CLI：终端原生AI编程助手，支持项目级别代码编辑和重构', 'Git集成：直接读取GitHub仓库、PR、Issue进行上下文理解', '文件上传分析：支持PDF/Word/Excel/图像/代码文件的内容提取和理解', '安全性设计：Constitutional AI训练，确保输出安全合规', 'Projects项目管理：创建独立项目空间，配置专属知识和指令', '高速响应：Claude 3.5 Haiku实现毫秒级响应，适合高频交互'], pricing: 'Claude提供免费版（Claude 3.5 Sonnet有限额度）和Claude Pro（$20/月，5倍额度+优先访问+更高速率）。Team版$25/人/月（共享额度+管理控制台），Enterprise版（企业级安全+SSO+审计日志）。免费用户每8小时约可使用30-50条消息。Claude Code CLI单独计费。', pros: ['编程能力业界顶尖：代码生成准确率高，尤其擅长TypeScript/React/Python', '超长上下文独一档：200K tokens可完整处理大型项目代码库', 'Artifacts创新体验：直接在对话中创建可交互内容，远超纯文本回复', '安全合规最强：Constitutional AI训练，企业级安全审计'], cons: ['需科学上网才能访问，中国用户使用不便', '免费额度较少，重度使用必须订阅Pro', '无原生图片生成和插件生态系统，功能不如ChatGPT丰富', '不支持多模态输入（不能直接分析图片内容）'], targetAudience: ['专业程序员：深度代码编写、代码审查、大型项目重构的开发者', '学术研究者：论文阅读、文献综述、长文档分析的科研人员', '技术写作专家：技术文档、API文档、教程编写的专业写作者', '创业者：需要快速MVP开发、商业计划撰写、技术方案设计的创始人', '数据分析师：复杂数据集的逻辑分析和洞察提取'], useCases: ['大型代码库重构：将项目完整代码通过上下文提交，AI分析架构并给出重构方案', '论文全篇审校：上传完整论文PDF，Claude逐章审校逻辑结构和语言表达', '交互式原型设计：用Artifacts生成可交互的UI原型或数据可视化页面', '技术方案设计：描述业务需求，Claude输出完整的技术架构方案和选型建议', 'PR代码审查：集成GitHub后自动审查PR，给出逐行修改建议'], faqs: [{ question: 'Claude和ChatGPT在编程上谁更强？', answer: '根据多项基准测试和开发者反馈，Claude 3.5 Sonnet在代码生成准确率上略胜GPT-4o。Claude的优势在于：1)超长上下文可处理大项目 2)代码重构和历史理解更好 3)安全意识强不会生成危险代码。ChatGPT的优势在于插件生态和API开放性。建议：前端/全栈开发首选Claude，需要API集成和工具联动时选ChatGPT。' }, { question: 'Claude的Artifacts是什么？有什么用？', answer: 'Artifacts是Claude独有的功能，允许它在对话中创建可直接运行的交互式内容，如HTML网页、React组件、SVG图片、Mermaid图表等。用户可以在聊天界面中实时预览、编辑和导出这些内容。非常适合快速原型设计、数据可视化、技术文档插图等场景。' }, { question: 'Claude 200K上下文到底能处理多少内容？', answer: '200K tokens约等于15万汉字或500页的书籍内容。这意味着你可以：1)直接把完整的小说或论文丢进去分析 2)把整个React项目源码放进去审查 3)分析长达数小时的会议转录。相比GPT-4o的128K和Kimi的200K，Claude的长上下文处理质量在业界排名第一。' }, { question: 'Claude免费版够用吗？', answer: '轻度使用（每天10-20条消息）免费版够用。免费版使用的也是Claude 3.5 Sonnet模型，性能和付费版一致，只是消息次数受限（约每8小时30-50条）。如果你是程序员每天大量使用AI编程，建议升级Pro（$20/月），性价比非常高。' }] }),
  { id: 'runway', name: 'Runway', logo: '🎬', description: 'AI视频生成和编辑平台，支持文生视频、图生视频', url: 'https://runwayml.com', price: 'freemium', difficulty: 'intermediate', heat: 58.6, heatGrowth: 15.3, tags: ['AI视频', '视频编辑', '视频生成'], techTags: ['GenerativeMedia', 'VideoAI'], sceneTags: ['内容创作', '短视频', '影视制作'], costTags: ['Freemium', '需翻墙'], category: '视频生成', prompts: [{ id: 'p1', title: '文字生成视频', content: 'A cinematic shot of a [subject] in [environment], [camera movement], highly detailed, 8k', scene: '创意视频' }, { id: 'p2', title: '图片生成视频', content: 'Animate this image with [specific motion], smooth movement, realistic', scene: '视频制作' }], tips: ['Gen-2支持文字生成视频', '提供多种预设风格', '可以在现有视频上进行AI编辑'], relatedSkills: [],
    features: ['Gen-3 Alpha文本生成视频：最新模型，生成视频的画质和一致性显著提升', 'Gen-2图生视频：上传图片并添加运动描述，AI让静态画面动起来', '视频到视频转换：对现有视频应用风格迁移，如转为动画、科幻、油画等', '绿幕抠像（Chroma Key）：AI自动识别并替换视频背景，精度高', '运动笔刷（Motion Brush）：指定画面中某区域施加特定的运动效果', '帧插值（Frame Interpolation）：提升视频帧率，让动作更流畅自然', 'Inpainting视频修复：擦除视频中不需要的元素并用AI补全画面', '文本转语音配音：内置多种配音音色，直接配音无需额外工具'],
    pricing: 'Runway采用Freemium模式。免费版：提供125个积分（约可生成几十秒视频），视频有水印，分辨率720p。Pro版$15/月（500积分，去水印，4K导出）。Team版$30/人/月（无限积分+团队协作）。Ultimate版$90/月（优先算力+商业授权+自定义模型）。视频生成消耗积分较高（文生图约5积分/次，视频约20-50积分/次），建议Pro起步。',
    pros: ['视频生成质量领先：Gen-3在运动一致性和画质上属于行业第一梯队', '功能全面：从生成到编辑到后期，覆盖视频制作的完整工作流', '绿幕抠像效果好：AI自动识别边缘，精细度超传统色度抠像', '创作自由度大：文生视频/图生视频/视频编辑/风格迁移多种模式'],
    cons: ['免费额度极少：125积分很快就用完，基本需要付费使用', '生成速度较慢：单条4秒视频需等待1-3分钟', '结果可控性有限：AI生成的运动轨迹和效果有时不可预测', '需翻墙且价格较高：Pro版$15/月起，中国用户使用不便'],
    targetAudience: ['短视频创作者：需要AI辅助生成视频素材的抖音/快手创作者', '影视后期从业者：需要绿幕抠像、视频修复等AI工具的专业人士', '营销策划人员：需要快速制作产品演示和广告视频的营销团队', '独立游戏开发者：需要游戏概念动画或角色动作预览的开发者', '设计师：需要动态设计素材和视觉特效的创意设计人员'],
    useCases: ['产品展示视频：上传产品图片+描述运动方式，自动生成动态产品展示视频', '短片创意测试：用文字描述剧本中的关键场景，快速生成视觉预览测试创意效果', '社交媒体动态内容：将静态海报或封面图转化为短视频，提升社交媒体互动率', '视频后期修复：用Inpainting功能移除视频中不需要的物体或人物', '多风格内容创作：将实拍视频一键转为动画/赛博朋克/胶片等不同视觉风格'],
    faqs: [
      { question: 'Runway的免费版够用吗？', answer: '免费版注册即送125个积分，每次视频生成消耗大约20-50积分，所以免费版大约只能生成3-5个短视频。免费版有720p分辨率限制且视频带水印。如果只是尝鲜测试完全够用，但要用于实际创作建议Pro版起步（$15/月，500积分无限制）。' },
      { question: 'Runway生成的视频质量怎么样？', answer: 'Gen-3 Alpha是当前最好的视频生成模型之一，在画质、运动一致性和真实感方面与Pika、可灵等同属第一梯队。Runway在视频编辑能力（绿幕抠像、风格迁移、视频修复）上比纯视频生成工具有明显优势。不过生成的视频长度目前限制在4-10秒左右。' },
      { question: 'Runway支持中文输入吗？', answer: 'Runway的界面和提示词系统以英文为主，不支持中文提示词。需要用英文描述视频内容和运动方式。建议先用ChatGPT等工具将中文需求翻译成英文描述，再粘贴到Runway中使用。如果有图生视频需求，上传参考图可以降低对文字描述的依赖。' },
      { question: 'Runway和Pika、可灵等视频生成工具有什么区别？', answer: 'Runway是功能最全面的AI视频平台，不只是生成工具，还是一个完整的视频编辑工作台。Pika更注重快速出片和易用性，适合快速创建短视频。可灵（快手）是国内产品，中文友好且免费额度多。Runway的优势在于：1)视频编辑能力（抠像/修复/风格迁移） 2)专业的绿幕功能 3)视频到视频的转换能力。如果你是做专业视频制作，Runway更合适。' }
    ]
  },
  { id: 'suno', name: 'Suno', logo: '🎵', description: 'AI音乐生成工具，可以用文字描述生成完整歌曲', url: 'https://suno.com', price: 'freemium', difficulty: 'beginner', heat: 62.8, heatGrowth: 28.7, tags: ['AI音乐', '音乐生成', '音频工具'], techTags: ['GenerativeMedia', 'AudioAI'], sceneTags: ['内容创作', '短视频', '音乐制作'], costTags: ['Freemium', '需翻墙'], category: '音频生成', prompts: [{ id: 'p1', title: '流行歌曲生成', content: 'Generate a pop song about [topic], upbeat tempo, catchy melody, verse-chorus structure', scene: '音乐创作' }, { id: 'p2', title: '背景音乐生成', content: 'Create an instrumental background music, ambient, calm, suitable for [scenario]', scene: '视频配乐' }], tips: ['支持生成带歌词的完整歌曲', '可以选择音乐风格和乐器', '生成的音乐可用于商业用途'], relatedSkills: [],
    features: ['文生完整歌曲：输入文字描述或歌词，AI自动生成包括旋律、编曲和人声的完整歌曲', '多风格支持：覆盖流行、摇滚、R&B、电子、古典、民谣、说唱等数十种音乐风格', '自定义歌词：支持输入自定义歌词，AI根据歌词内容和情感匹配合适的旋律', 'Instrumental纯音乐模式：生成无歌词的纯音乐，适合背景音乐和配乐', '歌曲扩展（Extend）：在已有片段基础上继续生成，构建完整的歌曲结构', '多语言歌曲：支持中文、英文、日文等多种语言的歌曲生成', 'V4模型升级：最新v4版本大幅提升了音质、旋律优美度和歌词与旋律的匹配度', 'Suno Scenes：生成特定场景的氛围音乐，如冥想、学习、工作等'],
    pricing: 'Suno采用Freemium模式。免费版：每天约10次生成额度（非商用），标准音质，每次最长60秒，基础风格。Pro版$10/月（约¥73/月）：每月500次生成额度，商用授权，高清音质，最长2分钟。Premier版$30/月：每月2000次生成额度，优先队列，最新模型优先使用。免费版适合体验，创作者建议Pro版。相比Udio（$10-30/月），Suno在中文歌词和支持上更好。需翻墙使用。',
    pros: ['文生歌曲效果惊艳：输入文字即可生成带歌词和编曲的完整歌曲，质量远超预期', '中文歌曲生成能力突出：中文歌词发音和旋律匹配在AI音乐工具中表现最好', '免费版每天有额度：每天10次免费生成，适合日常创作和实验', 'V4版本音质大幅提升：最新版在音质、旋律和歌词匹配上达到新高度'],
    cons: ['免费版非商用：免费生成的歌曲不可商用，商业使用需Pro版$10/月', '歌曲长度有限：最长2分钟（Pro版），生成完整歌曲需要分段扩展', '生成结果不可控：指定具体乐器、和弦进行等细节比较困难', '需翻墙使用：对中国用户有网络和支付门槛'],
    targetAudience: ['音乐爱好者：喜欢尝试AI音乐生成，创作个人歌曲和Demo的音乐爱好者', '短视频创作者：需要定制背景音乐和配乐的抖音/TikTok创作者', '播客制作者：需要片头片尾音乐的播客主持人', '独立音乐人：需要创作灵感和快速Demo制作的音乐人', '广告/视频制作人：需要定制背景音乐和广告歌曲的内容制作团队'],
    useCases: ['原创歌曲创作：输入主题和风格描述，生成完整的原创歌曲包括歌词和编曲', '短视频BGM定制：输入视频氛围描述（如\"夏日海边欢快\"），生成专属背景音乐', '广告歌曲制作：输入品牌信息和广告调性，生成品牌专属广告歌曲', '播客配乐生成：输入播客主题和氛围，生成匹配的片头/片尾/间隔音乐', '音乐学习参考：生成不同风格的音乐作为学习和创作参考的素材'],
    faqs: [
      { question: 'Suno和Udio哪个更好？', answer: 'Suno的优势：1)中文歌曲生成更好（中文歌词发音更自然）2)v4版本音质大幅提升 3)Pro版$10/月性价比高 4)社区和教程资源更丰富。Udio的优势：1)音质和混音更专业 2)与环球音乐有版权合作 3)人声演唱更自然。建议：中文歌曲选Suno，英文歌曲两者都可以试试。很多用户同时使用两个工具。' },
      { question: 'Suno生成的歌曲可以商用吗？', answer: 'Pro版（$10/月）及以上套餐生成的歌曲可以商用，包括：商业发布、流媒体平台上传、广告使用、影视配乐等。免费版仅限个人非商业使用。Suno的商用政策相对明确，建议阅读Suno官方的最新服务条款。商用版本会获得完整的版权授权文件。' },
      { question: 'Suno支持中文歌词吗？效果怎么样？', answer: '支持。Suno是目前AI音乐工具中中文歌词生成效果最好的。中文歌词的发音清晰、语调自然，歌词与旋律的匹配度较高。支持输入中文歌词让AI谱曲，也支持AI自动生成中文歌词。但需要注意：AI生成的中文歌词在文学性和意境上不如人写的好，建议先用AI生成初稿再人工润色。' },
      { question: 'Suno免费版每天能生成多少次？', answer: '免费版每天约10次生成额度（具体次数可能随运营策略调整）。每次生成可以选择生成2个版本，每次最长60秒。每天生成次数在UTC时间每天重置。免费版音质为标准品质，生成的歌曲不可商用。建议先体验免费版充分测试效果，满意后升级Pro版。' }
    ]
  },
  // ===== 新增工具 =====
  { id: 'perplexity', name: 'Perplexity', logo: '🔍', description: 'AI搜索引擎，结合实时网络信息提供带引用的准确答案', dailyPick: 'AI搜索领域的标杆，实时联网+来源引用，让每个答案都有据可查，科研和事实核查的必备工具', url: 'https://www.perplexity.ai', price: 'freemium', difficulty: 'beginner', heat: 68.5, heatGrowth: 22.3, tags: ['AI搜索', '信息检索', '研究工具'], techTags: ['NLP', 'RAG', 'Search'], sceneTags: ['学术研究', '办公提效', '编程开发', '企业AI自动化'], costTags: ['Freemium', '需翻墙'], category: 'AI搜索', prompts: [{ id: 'p1', title: '深度研究', content: '请对\"[研究主题]\"进行深度研究，包含：最新进展、关键争议、主要参与方、未来展望，每个观点请提供来源引用', scene: '学术研究' }, { id: 'p2', title: '事实核查', content: '请核查以下陈述的真实性，提供可靠来源支持或反驳：[陈述内容]', scene: '办公提效' }], tips: ['支持选择搜索范围（全网/学术/视频等）', '结果自带引用链接可直接验证', 'Pro版可使用更高级的模型和搜索能力'], relatedSkills: [], features: ['实时联网搜索：自动抓取最新网页信息，确保答案的时效性和准确性', '来源引用标注：每个回答都附带可点击的来源链接，支持一键验证信息真实性', 'Pro Search深度研究：智能分解复杂问题，多步搜索后综合生成结构化研究报告', 'Spaces知识空间：创建主题工作区，集中管理和组织特定领域的研究内容', 'Collections收藏集：将搜索历史和结果分类整理，建立个人知识库', '文件上传分析：支持上传PDF/图片/CSV等文件，AI结合文件内容和网络信息综合分析', 'Copilot引导模式：AI主动追问和引导，帮助你精确定位真正想找的信息', '多模型支持（Pro）：Pro版可切换GPT-4、Claude和自研模型，按需选择最优模型'], pricing: 'Perplexity采用Freemium模式。免费版：基础搜索功能+有限Pro Search次数。Pro版$20/月（或$200/年）：无限Pro Search、GPT-4/Claude等多模型切换、文件上传、图像生成、无限Collections。团队版按需定价。免费版日常信息检索足够使用，Pro版适合重度研究用户。', pros: ['来源可验证：每个回答引用真实链接，杜绝AI幻觉和信息不可靠问题', '实时性超强：直接抓取最新网页信息，特别适合新闻、动态和趋势类搜索', '搜索体验优秀：UI设计美观简洁，结果结构化呈现远超传统搜索引擎', 'Pro版多模型：一个订阅同时使用GPT-4和Claude，性价比高'], cons: ['免费版搜索次数有限，重度使用需开通Pro订阅', '需科学上网才能访问，中国用户网络门槛较高', '深度研究(Pro Search)速度较慢，复杂问题需等待30秒以上', '中文搜索结果质量略逊于英文，对中文长尾查询理解不足'], targetAudience: ['学术研究者：需要快速检索最新论文、文献并验证信息来源的学生和科研人员', '新闻/媒体从业者：需要事实核查、热点追踪和背景调研的记者和编辑', '知识工作者：日常需要信息检索和分析的咨询师、分析师和战略规划人员', '普通信息搜索用户：对搜索结果真实性和时效性要求高的日常用户', '市场营销人员：需要竞品分析、市场趋势和行业报告的营销从业者'], useCases: ['学术文献检索：搜索最新论文和研究进展，AI自动整理关键发现并附带来源链接', '事实核查与辟谣：输入待核实的信息，AI多源交叉验证后给出可靠性评估', '市场竞品分析：搜索行业动态和竞品信息，自动生成带来源的竞争格局报告', '技术方案选型：比较不同技术方案的优缺点和社区评价，附带权威来源', '旅行与生活规划：搜索目的地攻略、航班住宿比价等信息，结构化整理呈现'], faqs: [{ question: 'Perplexity和Google搜索有什么区别？', answer: 'Perplexity不是传统搜索引擎返回链接列表，而是用AI直接回答你的问题，并附上来源引用。区别在于：1)Perplexity给出整合答案而非链接列表 2)每个观点附可验证来源 3)支持追问和深入对话 4)Pro Search可自动分解复杂问题。但Google在覆盖面和实时性上更广，建议日常简单查询用Google，深度研究和事实核查用Perplexity。' }, { question: 'Perplexity免费版够用吗？', answer: '免费版适合中等频率的用户。每天可进行约50次基础搜索和5次Pro Search。如果你只是日常查资料、找信息，免费版完全够用。但如果你是研究人员、记者或高频用户需要无限Pro Search和多模型切换，建议升级到Pro版（$20/月）。' }, { question: 'Perplexity为什么需要翻墙？', answer: 'Perplexity的服务器位于海外，其搜索服务需要访问Google、Bing等国际搜索引擎和全球网页内容。中国大陆的网络环境下无法直接访问。建议通过VPN或代理工具使用。注意选择稳定的VPN服务，否则搜索速度和体验会受影响。' }, { question: 'Perplexity支持中文搜索吗？效果如何？', answer: '支持中文搜索，AI能用中文回答问题并附上中文来源。但中文搜索效果略逊于英文，原因：1)中文网页索引覆盖不如百度等国内引擎 2)AI对英文内容的理解和总结更深入 3)部分中文长尾查询可能返回英文结果。建议：中文日常搜索用秘塔AI搜索，英文/跨语言深度研究用Perplexity。' }] },
  { id: 'cursor', name: 'Cursor', logo: '⌨️', description: 'AI原生的智能代码编辑器，深度集成AI辅助编程体验，被誉为"VS Code最佳替代品"。基于VS Code架构构建，Cursor在保留全部VS Code生态（主题、插件、快捷键）的基础上，将AI无缝嵌入到每个编码环节：从代码补全到对话式编程，从跨文件重构到一键Debug。其Tab补全、Ctrl+K智能编辑和Composer多文件编辑三大核心功能，使开发者效率提升2-5倍。支持GPT-4o、Claude 3.5和自研模型混合调用，是Vibe Coding（氛围编程）时代最具代表性的工具之一。', dailyPick: 'Vibe Coding最佳拍档，Tab补全+Ctrl+K编辑+Composer多文件重构三件套，让开发效率提升2-5倍', url: 'https://cursor.sh', price: 'freemium', difficulty: 'intermediate', heat: 75.6, heatGrowth: 31.2, tags: ['代码编辑器', 'AI编程', '开发工具'], techTags: ['GenerativeAI', 'CodeGen'], sceneTags: ['编程开发'], costTags: ['Freemium', '需翻墙'], category: '编程开发', prompts: [{ id: 'p1', title: '代码生成', content: '请生成一个[功能描述]的[编程语言]函数，要求：遵循最佳实践、包含错误处理、添加详细注释', scene: '编程开发' }, { id: 'p2', title: '代码重构', content: '请重构以下代码，提升可读性和性能，同时保持功能不变：[代码]', scene: '编程开发' }], tips: ['Ctrl+K 快速编辑选中代码', 'Ctrl+L 对话式编程助手', '支持多文件上下文理解和跨文件重构'],
    caseStudies: [
      { title: 'Cursor AI 编程从入门到精通', source: 'bilibili', creator: 'B站AI编程', description: '用Cursor通过自然语言编写代码，零基础也能快速上手', url: 'https://www.bilibili.com/video/BV1gH8zCE1V', duration: '35:00', skill: 'Cursor入门' },
      { title: 'Cursor + Claude Code 全栈开发工作流', source: 'youtube', creator: 'Theo - t3.gg', description: 'AI辅助全栈开发的最佳实践', url: 'https://www.youtube.com/watch?v=3mZqO0q0Vb0', duration: '32:00', skill: 'AI全栈开发' }
    ],
    relatedSkills: ['skill_code_review'],
    features: ['Tab智能补全：预测光标位置的下一步操作，比Copilot更精准的代码建议', 'Ctrl+K内联编辑：选中代码后直接输入修改指令，AI实时替换', 'Composer多文件编辑：一次对话同时修改多个文件，AI自动保持代码一致性', 'Chat侧边栏：全项目级别的对话，AI理解整个代码库结构', 'Agent模式：AI自动执行多步骤任务（搜索→编辑→运行→修复）', 'Rules自定义规则：为项目配置专属AI编码规则和最佳实践', '上下文@引用：精确引用文件/函数/类作为AI理解的上下文锚点', '多模型切换：内置GPT-4o、Claude 3.5 Sonnet和Cursor自研模型'], pricing: 'Cursor提供免费版（每月2000次补全+50次高级模型请求）和Pro版（$20/月，无限补全+500次高级模型请求+无限Chat）。Business版$40/月（团队管理+集中计费）。新用户可免费试用Pro功能14天。相比GitHub Copilot（$10/月），Cursor价格翻倍但功能深度远超Copilot。', pros: ['AI深度融入编辑器：每个环节都有AI参与，不是简单的补全工具而是编程搭档', '多文件编辑能力突出：Composer可理解代码间依赖关系，跨文件修改准确到位', 'Rules+上下文引用：让AI理解项目的最佳实践和技术栈，输出更精准', '模型选择灵活：在GPT-4o和Claude 3.5间切换，按任务选择最优模型'], cons: ['价格较高：Pro版$20/月，比Copilot贵一倍，小团队成本压力大', '重量级编辑器：对大型项目的索引和加载速度慢于VS Code原生', '高级功能限制：免费版高级模型请求仅50次/月，体验受限', '国内网络不稳定：需稳定翻墙才能使用AI功能'], targetAudience: ['前端/全栈开发者：在React/Vue/Next.js项目中高频使用AI辅助的Web开发人员', '独立开发者/创业者：需要快速迭代MVP的小团队和个人开发者', 'AI编程爱好者：热衷于Vibe Coding工作流的探索型程序员', '技术团队Lead：需要为团队配置统一AI编码规范的技术管理者', '从Copilot升级的用户：对代码建议深度和项目理解有更高要求的开发者'], useCases: ['全栈应用开发：通过Composer同时修改API层、数据库模型和前端组件，AI保持一致性', '代码迁移重构：将老项目从JavaScript迁移到TypeScript，AI自动处理类型标注', 'Bug修复工作流：将错误日志通过@粘贴到Chat，AI分析根因并给出修复方案', '测试驱动开发：先写测试用例描述，用Agent模式让AI生成通过测试的实现', '新项目脚手架：描述项目需求，AI生成完整项目结构、配置文件和核心代码'], faqs: [{ question: 'Cursor和VS Code + Copilot相比哪个更好？', answer: 'Cursor是AI优先设计的编辑器，不是VS Code插件。主要优势：1)Tab补全比Copilot更智能，能预测整行而非单字 2)Composer可同时编辑多个文件 3)AI理解项目全局架构。劣势：1)每月$20 vs Copilot的$10 2)生态不如VS Code稳定。建议：深度AI编程用户选Cursor，轻度使用者Copilot足够。' }, { question: 'Cursor免费版够用吗？', answer: '免费版每月2000次补全和50次高级模型请求。对于轻度编码（每天<100次补全）够用2-3周。但如果每天大量使用AI编程，建议Pro版。值得关注的是免费版使用的模型和Pro版相同，只是次数限制。' }, { question: 'Cursor支持哪些编程语言？', answer: '由于基于VS Code，支持VS Code支持的所有编程语言：JavaScript/TypeScript/Python/Java/Go/Rust/C++/PHP等。AI对不同语言的支持质量取决于模型训练数据，Python/JS/TS质量最高，Java/Go其次，小众语言建议使用Claude模型效果更好。' }, { question: 'Cursor的Agent模式和Composer有什么区别？', answer: 'Composer是手动驱动的多文件编辑模式——你在对话框中描述需求，AI理解并修改多个文件。Agent模式是自动执行的——AI自己规划步骤、读取文件、修改代码、运行命令、修复问题，更像一个自主开发者。Agent模式适合明确定义的任务（"给这个页面添加暗黑模式"），Composer适合需要迭代讨论的复杂修改。' }] },
  { id: 'devin', name: 'Devin', logo: '🦾', description: 'AI全栈软件工程师，可独立完成从需求到部署的开发任务', url: 'https://cognition.ai', price: 'paid', difficulty: 'advanced', heat: 55.3, heatGrowth: 45.6, tags: ['AI编程', 'AI代理', '自动开发'], techTags: ['Agent', 'CodeGen', 'Autonomous'], sceneTags: ['编程开发'], costTags: ['Paid', '需翻墙'], category: '编程开发', prompts: [], tips: ['可以独立完成浏览器测试和调试', '支持接入 Slack 和 IDE', '适合自动化重复性开发任务'], relatedSkills: ['skill_code_review', 'skill_unit_test'],
    features: ['自主软件开发：从需求分析到编码测试到部署运维，AI全流程自主完成', '浏览器交互测试：AI可操作浏览器进行前端功能测试和调试', 'IDE/Slack集成：开发者可通过Slack或IDE与Devin协作和监控进度', '技术栈全覆盖：支持React/Node/Python/Go等主流技术栈的全栈开发', 'Git集成：自动创建分支、提交代码、创建PR，遵循Git工作流', '错误自愈能力：发现Bug后自动定位根因并修复，无需人工干预', '上下文记忆：长期项目保持上下文和决策记忆，避免重复工作', '部署集成：支持一键部署到Vercel/AWS/Netlify等云平台'],
    pricing: 'Devin为纯付费模式。个人版$500/月：每月25个Devin任务（每个任务可运行数小时）。团队版按需定价，提供更多任务额度和团队协作功能。相比人工开发成本（美国工程师月薪$10000+），Devin在简单到中等复杂度的开发任务上具有明显的成本优势。目前处于早期阶段，价格较高，适合已经验证AI开发效率的团队。',
    pros: ['真正的自主开发：不是代码补全而是独立完成完整任务，从需求到部署', '全流程覆盖：需求分析、架构设计、编码、测试、部署一条龙', '错误自愈：发现Bug后不需要人介入，AI自己修复', '浏览器测试：能操作真实的浏览器环境进行交互测试'],
    cons: ['价格极高：$500/月起，个人开发者难以承受', '复杂项目能力有限：大型复杂项目中容易迷失方向和产生偏差', '处理速度慢：完成一个完整功能可能需要数小时，比人写还慢', '仍需人工监督：关键的架构决策和安全审计仍需要开发者把关'],
    targetAudience: ['技术创业团队：需要快速验证MVP的小团队，Devin可替代初级开发', '大型企业DevOps团队：将重复性开发任务自动化，让高级工程师专注架构', 'AI研究与评测人员：研究和评测AI软件开发能力的学者', '科技公司CTO：评估AI替代部分开发工作流的决策者', 'SaaS产品团队：需要快速迭代功能和修复Bug的产品开发团队'],
    useCases: ['MVP快速开发：用自然语言描述产品需求，Devin自动完成从数据库设计到前端实现的全流程', 'GitHub Issue自动处理：将Issue指派给Devin，AI自动理解问题并提交修复PR', '前端组件开发：描述UI组件需求，Devin生成完整组件代码并做浏览器测试', 'API端点开发：描述API功能需求，Devin自动实现路由、控制器、模型和测试', '数据迁移脚本：描述数据迁移逻辑，Devin生成并测试完整的迁移脚本'],
    faqs: [
      { question: 'Devin和Cursor/Claude Code有什么区别？', answer: 'Cursor和Claude Code是AI辅助编程工具——人类开发者主导，AI辅助写代码。Devin是AI自主开发工程师——你给出需求，AI独立完成开发，你在过程中审核和把关。简单说：Cursor是给编程加了AI加速器，Devin是给你配了一个AI员工。Devin适合独立完成明确定义的功能模块，Cursor适合人类开发者日常编码提效。' },
      { question: 'Devin $500/月的价格值得吗？', answer: '如果你是一个需要快速验证想法的创业者，Devin可以在几天内完成一个MVP，相比雇佣一个初级开发者（月薪$5000+），性价比极高。但如果你只是个人开发者日常写代码，$500/月远高于Cursor和Copilot，完全不划算。建议先通过试用或案例研究确认Devin在你具体任务中的表现，再决定是否长期订阅。' },
      { question: 'Devin能处理多复杂的项目？', answer: 'Devin适合单个功能模块或中型应用的开发（如一个CRUD应用、一个API服务、一个前端页面等）。对于涉及复杂业务逻辑、多系统集成、微服务架构的大型项目，Devin目前的能力还有限。建议从Clear任务开始尝试，逐步增加复杂度。' },
      { question: '使用Devin需要编程基础吗？', answer: 'Devin的核心理念是让不懂编程的人也能开发软件。但实际情况中，仍然需要一定技术背景来：1)清晰描述需求和架构约束 2)审核Devin生成的代码 3)处理AI无法解决的底层问题。建议至少具备基本的编程概念理解，否则你无法判断Devin产出的质量和安全性。' }
    ]
  },
  { id: 'notion_ai', name: 'Notion AI', logo: '📝', description: '集成在Notion中的AI写作助手，辅助知识管理和内容创作', url: 'https://www.notion.so/product/ai', price: 'paid', difficulty: 'beginner', heat: 60.2, heatGrowth: 18.5, tags: ['AI写作', '知识管理', '办公工具'], techTags: ['NLP', 'GenerativeAI'], sceneTags: ['办公提效', '内容创作', '企业AI自动化'], costTags: ['Paid', '中文友好'], category: '办公工具', prompts: [{ id: 'p1', title: '文档摘要', content: '请总结以下文档的核心要点，用3-5个要点呈现：[文档内容]', scene: '办公提效' }, { id: 'p2', title: '会议记录模板', content: '帮我创建一个标准会议记录模板，包含：会议主题、参会人员、讨论要点、决策记录、待办事项', scene: '办公提效' }], tips: ['在Notion文档中按空格即可呼出AI', '支持翻译、润色、续写等多种功能', 'AI结果可以自动保存为Notion数据库条目'], relatedSkills: ['skill_meeting_summary'],
    features: ['AI写作助手：在Notion文档中按空格键即可呼出，支持续写、润色、翻译、总结', '智能问答：选中文档内容让AI分析、解释或扩展，无需跳转其他工具', '文档自动分类和标签：AI自动识别文档内容并添加标签和分类', '知识库问答：基于整个Notion工作区的知识库内容回答提问', '会议笔记AI处理：自动从会议笔记中提取行动项和决策', '多语言翻译：在文档中直接翻译为20+语言，保留原有格式', 'AI数据库操作：根据描述自动创建和填充Notion数据库', '自定义AI指令：创建自定义AI命令模板，一键适配特定工作流'],
    pricing: 'Notion AI为Notion的附加付费功能。个人版$10/月（加在Notion Plus $12/月上，合计$22/月）。团队版$18/人/月（加在Notion Business $18/人/月上，合计$36/人/月）。企业版按需定价。Notion AI不能单独订阅，必须已有Notion付费方案。试用期为20次AI问答免费体验。相比其他AI写作工具，Notion AI的最大价值在于深度集成到Notion的知识管理生态中。',
    pros: ['深度集成Notion生态：AI不出文档，在已有的知识管理体系中直接使用', '按空格即用的便捷性：无需切换工具或对话框，在写作流中无缝使用', '知识库问答精准：基于Notion工作区的私有知识库，回答准确且隐私安全', '数据库AI化：AI可直接操作数据库，自动化模板和内容填充'],
    cons: ['必须订阅Notion付费版：不能独立使用，整体成本较高（最低$22/月）', 'AI功能相对有限：不如ChatGPT或Claude的通用AI能力强', '中文支持一般：AI对中文的理解和生成质量相比国产AI有差距', '仅限Notion生态：无法脱离Notion使用，不适合非Notion用户'],
    targetAudience: ['Notion重度用户：日常使用Notion管理工作和个人知识体系的用户', '内容创作者：在Notion中写作、整理知识库的自由职业者和博主', '知识管理爱好者：使用Notion搭建个人知识管理（PKM）系统的学习者', '企业知识管理者：使用Notion作为内部知识库的团队协作人员', '产品经理/项目经理：用Notion管理产品文档和项目进度的专业人士'],
    useCases: ['文档快速续写：在Notion中写了一半的文章，按空格让AI续写完整段落', '会议笔记整理：将会议讨论要点粘贴到Notion，AI自动生成结构化的会议纪要', '外语文档翻译：将Notion中的英文文档选中，AI直接翻译为中文保留格式', '知识库智能检索：在Notion知识库中用自然语言提问，AI从私有文档中提取答案', '数据库批量处理：告诉AI创建"项目追踪"数据库，自动设计字段和填充示例数据'],
    faqs: [
      { question: 'Notion AI能单独订阅吗？', answer: '不能。Notion AI是Notion的附加功能，必须已经有Notion付费订阅（Plus $12/月以上）才能添加AI功能。个人完整方案最低$22/月（Notion Plus + AI），团队版最低$36/人/月。如果不是Notion已有用户，使用专门AI写作工具（如ChatGPT、Claude）可能更划算。' },
      { question: 'Notion AI和ChatGPT相比有什么优势？', answer: 'Notion AI的核心优势不是AI能力本身，而是与Notion知识管理生态的深度集成。在Notion中写作时，按空格即可调用AI，不需要切换应用。AI能理解你Notion工作区的所有知识库内容，给出基于私有上下文的回答。如果你已经是Notion的重度用户，Notion AI能显著提升效率。' },
      { question: 'Notion AI的中文支持怎么样？', answer: 'Notion AI的中文支持处于可用但不算优秀的水平。基本的中文续写、翻译、总结都能完成，但在对中文文化语境的理解、成语运用、中文创意写作方面不如国产AI（如DeepSeek、文心一言）和ChatGPT。建议中文重要内容用国产AI或ChatGPT处理后再粘贴到Notion。' },
      { question: 'Notion AI能访问我的私有知识库吗？安全问题如何？', answer: '能。Notion AI可以访问你授权的工作区内容来回答问题。Notion承诺AI不会使用你的私有数据训练模型，也不会将数据泄露给第三方。数据加密传输和存储。但考虑到企业级数据安全，建议不要将高度敏感信息通过Notion AI处理。' }
    ]
  },
  { id: 'heygen', name: 'HeyGen', logo: '🎭', description: 'AI视频生成平台，支持数字人播报和多语言视频制作', url: 'https://www.heygen.com', price: 'paid', difficulty: 'beginner', heat: 57.4, heatGrowth: 33.9, tags: ['AI视频', '数字人', '视频制作'], techTags: ['GenerativeMedia', 'VideoAI', 'Avatar'], sceneTags: ['内容创作', '短视频', '电商运营'], costTags: ['Paid', '需翻墙'], category: '视频生成', prompts: [], tips: ['支持120+语言的数字人播报', '可以上传照片生成数字人形象', '文案一键生成视频，适合跨境电商'], relatedSkills: ['skill_short_video_script'],
    features: ['AI数字人生成：上传照片或视频，AI即时生成逼真的数字人形象', '120+语言播报：支持多语言口型同步，发音和口型自动匹配目标语言', 'AI文案转视频：输入文字脚本，AI自动匹配数字人、背景和字幕生成视频', '声音克隆：上传30秒音频即可克隆说话者的音色和语气', '模板市场：100+预设视频模板覆盖营销、教育、培训等场景', 'AI视频翻译：保留原始人声和口型，一键翻译为其他语言版本', '自定义背景和场景：上传图片或视频作为数字人播报的背景', 'API集成：提供REST API支持企业批量视频生成和自动化流程'],
    pricing: 'HeyGen为纯付费模式。免费版：提供1分钟免费试用视频，带水印。Creator版$29/月：10分钟视频，去水印，720p。Business版$89/月：30分钟，1080p，声音克隆，品牌模板。Enterprise版按需定价：无限时长、团队协作、自定义模型。此外还有按次付费的积分包。注意：生成视频消耗时长（1分钟生成约消耗1分钟额度）。视频翻译按额外时长计费。',
    pros: ['数字人逼真度行业领先：口型同步精准，表情自然，远超同类产品', '多语言能力突出：120+语言口型同步，特别适合国际化内容制作', '操作极简：上传照片+输入文案，3分钟即可生成一个数字人口播视频', '声音克隆效果好：几分钟音频即可训练出高质量的声音模型'],
    cons: ['价格较高：最低$29/月，且免费版仅1分钟，基本属于纯付费工具', '数字人表情和肢体动作有限，长时间播报显得单调', '需翻墙使用且服务器在海外，中国用户生成和加载速度较慢', '高级功能（声音克隆、1080p）需要Business版$89/月，门槛较高'],
    targetAudience: ['跨境电商卖家：需要制作多语言产品介绍视频的跨境运营人员', '教育培训者：需要制作在线课程和培训视频的教师和培训师', '社交媒体运营：需要快速产出口播类视频的内容创作者', '市场营销人员：需要制作产品营销和品牌宣传视频的市场团队', '企业培训部门：需要批量制作标准化培训视频的企业内部团队'],
    useCases: ['多语言产品介绍：输入中文脚本，选择英文数字人形象，自动生成口型同步的英文产品介绍视频', '企业培训视频：上传培训PPT内容，用AI数字人播报生成标准化的培训课程', '社交媒体口播：用真人形象的数字人快速制作口播类短视频，不需要真人出镜拍摄', '视频翻译本地化：将已有的真人视频用AI翻译为多语言版本，口型和声音保持一致', '虚拟客服导购：在电商页面嵌入AI数字人客服，自动解答常见问题'],
    faqs: [
      { question: 'HeyGen免费版能做什么？', answer: '免费版注册后赠送1分钟的视频生成额度（需加水印）。可以用来测试数字人效果和平台功能，真正用于制作内容基本不够用。建议先确认数字人效果符合需求后，直接开通Creator版（$29/月，10分钟去水印）。' },
      { question: 'HeyGen的数字人支持中文播报吗？', answer: '支持。中文播报的口型同步效果很好，发音自然。HeyGen特别适合制作中文+英文的双语或国际化内容。需要注意的是，中文场景建议选择亚洲面孔的数字人模板，口型匹配效果更好。' },
      { question: 'HeyGen和国内的数字人工具（如腾讯智影、商汤等）相比怎么样？', answer: 'HeyGen在国际化（多语言支持）和数字人逼真度上领先。国内工具在中文语音合成、网络速度和价格上更有优势。具体选择看需求：需要多语言国际化内容选HeyGen；主要面向中国市场、对翻墙不便敏感选国内工具。HeyGen的AI视频翻译功能是国内工具目前难以替代的独特优势。' },
      { question: '可以用自己的照片生成数字人吗？需要真人拍摄吗？', answer: '可以。上传一张清晰的正面照片（或短视频），AI即可生成一个逼真的数字人形象。不需要去摄影棚拍摄。但注意：1)照片质量越好，生成的数字人越逼真 2)建议上传3-5张不同角度的照片 3)生成的数字人形象归你所有，可以商用。' }
    ]
  },
  { id: 'stable_diffusion', name: 'Stable Diffusion', logo: '🖼️', description: '开源AI图像生成模型，支持本地部署和精细控制', url: 'https://stability.ai', price: 'free', difficulty: 'advanced', heat: 66.7, heatGrowth: 9.8, tags: ['AI绘画', '图像生成', '开源'], techTags: ['Diffusion', 'GenerativeMedia', 'OpenSource'], sceneTags: ['设计创作', '内容创作'], costTags: ['Free', '中文友好'], category: '图像生成', prompts: [{ id: 'p1', title: '角色设计', content: 'Character design, [style], full body, [expression], detailed clothing, clean background, --ar 2:3', scene: '设计创作' }, { id: 'p2', title: '场景概念图', content: 'Fantasy landscape, [theme], epic scale, volumetric lighting, 4k, --ar 16:9', scene: '设计创作' }],    tips: ['推荐使用Automatic1111或ComfyUI作为前端', 'ControlNet可以精确控制姿态和构图', 'LoRA模型可以生成特定风格或角色', 'SD-XL 1.0已发布permissive license版本，适合商业使用'], relatedSkills: ['skill_product_image'],
    features: ['开源免费自托管：完全免费开源，可在本地或自有服务器上运行，数据不出设备', '多样化的模型生态：SD 1.5、SDXL、SD 3.5、Flux等数十种模型可供选择，各有特色', 'ControlNet精准控制：通过姿态、深度、边缘、法线等条件控制生成图像的结构', 'LoRA微调技术：训练和使用LoRA模型，生成特定角色、风格或物体的图像', '文本反转/Embedding：通过文本嵌入技术实现风格和概念的轻量级控制', 'Inpainting/Outpainting：局部重绘和扩展画布，精确修改图像的指定区域', '图生图（img2img）：基于参考图生成变体或风格迁移', '超分辨率放大：通过ESRGAN等模型放大图像分辨率，最高可达8K'],
    pricing: 'Stable Diffusion完全免费开源。模型本身可从Hugging Face免费下载，无需支付任何授权费用。运行成本仅为硬件成本：需要NVIDIA GPU（最低4GB显存，推荐8GB+）。云GPU服务（AutoDL、vast.ai等）按需租用约¥1-5/小时。相比Midjourney（$10-60/月），SD的零订阅费模式让长期使用成本极低。推荐使用Automatic1111 WebUI或ComfyUI作为前端界面。',
    pros: ['完全开源免费：模型和代码完全开源，无任何订阅费和授权限制', '控制精度极高：ControlNet、LoRA、Embedding等技术提供了精确的生成控制', '模型生态最丰富：社区贡献了数十万种微调模型和LoRA，风格覆盖几乎无限', '本地部署隐私好：数据在本地处理，不上传云端，适合商业敏感内容'],
    cons: ['技术门槛高：需要懂模型选择、参数调优、插件安装等技术知识', '需要高性能GPU：生成速度和质量依赖显卡，4GB显存只能跑基础模型', '默认效果不如Midjourney：开箱即用的效果需要Prompt工程优化才能达到MJ水平', '模型碎片化：不同版本的模型和工具链兼容性需要花时间理解'],
    targetAudience: ['AI绘画进阶用户：不满足于Midjourney等工具的简单控制，追求精细参数调整的创作者', 'AI技术研究者：研究扩散模型原理和技术细节的学术研究人员', '商业内容生产者：需要大批量、低成本生成图像的内容团队和工作室', '隐私敏感用户：不希望上传图片到云端的企业和设计师', '开源社区贡献者：参与SD模型生态建设的开发者和技术爱好者'],
    useCases: ['批量电商产品图：搭建自动出图工作流，批量生成风格统一的产品展示图用于电商页面', '游戏资产批量生产：使用LoRA训练特定角色和场景模型，批量生成风格一致的游戏素材', '室内设计概念生成：使用ControlNet控制房间布局，快速生成多种风格的内装修效果图', 'AI写真/个人形象：训练个人肖像LoRA，生成同一人物不同服装和场景的AI写真', '学术论文插图：生成论文中需要的示意图、结构图和概念图，无版权问题'],
    faqs: [
      { question: 'Stable Diffusion适合新手吗？', answer: 'Stable Diffusion的上手门槛较高，不适合零基础新手。建议学习路径：1)先从WebUI（Automatic1111）开始，界面最友好 2)使用在线版（如Hugging Face Spaces的免费Demo）体验基本功能 3)掌握基础Prompt技巧后学习LoRA和ControlNet 4)进阶学习ComfyUI节点式工作流。新手建议先用Midjourney或Leonardo AI，等熟悉了AI绘画再接触SD。' },
      { question: 'Stable Diffusion需要什么显卡？', answer: '最低：NVIDIA GTX 1060 6GB（可运行SD 1.5基础模型，速度慢）。推荐：RTX 3060 12GB（SDXL流畅运行）、RTX 4090 24GB（Flux等新模型全速运行）。AMD显卡通过ROCm或DirectML也能用但兼容性稍差。Mac M1/M2芯片通过Diffusers库也可运行但速度慢。没有独立显卡可使用云GPU服务（如AutoDL按小时租用）。' },
      { question: 'Stable Diffusion的模型在哪里下载？怎么安装？', answer: '主流模型下载平台：1)Hugging Face（huggingface.co）官方模型库 2)CivitAI（civitai.com）社区模型和LoRA 3)GitHub仓库。安装：将下载的.safetensors文件放到WebUI的models/Stable-diffusion目录，重启WebUI即可。推荐模型：SDXL（通用高质量）、Realistic Vision（写实风）、Anything V5（动漫风）、DreamShaper（综合艺术风）。' },
      { question: 'Stable Diffusion生成的图片可以商用吗？有版权风险吗？', answer: 'Stable Diffusion模型采用开放许可协议（CreativeML Open RAIL-M），生成的图片可自由商用。但需要注意：1)不使用受版权保护的角色/品牌名称作为提示词 2)生成的图片若与其他作品高度相似，仍有侵权风险 3)如果使用其他人训练的LoRA模型，需查看该LoRA的授权条款。总体而言，SD的商用风险在AI绘画工具中是最低的。' }
    ]
  },
  { id: 'copilot', name: 'GitHub Copilot', logo: '🤝', description: 'AI代码补全助手，实时提供代码建议和自动补全', dailyPick: '全球最流行的AI编程助手，VS Code/JetBrains原生集成，从代码补全到PR审查覆盖完整开发工作流', url: 'https://github.com/features/copilot', price: 'paid', difficulty: 'beginner', heat: 73.1, heatGrowth: 14.6, tags: ['AI编程', '代码补全', '开发工具'], techTags: ['CodeGen', 'GenerativeAI'], sceneTags: ['编程开发'], costTags: ['Paid', '需翻墙'], category: '编程开发', prompts: [{ id: 'p1', title: '函数实现', content: '请用[编程语言]实现一个函数，功能：[描述]，包含参数验证、错误处理和单元测试', scene: '编程开发' }, { id: 'p2', title: '代码审查', content: '请审查以下代码，检查：1.潜在bug 2.安全漏洞 3.性能问题 4.代码规范 5.可读性：[代码片段]', scene: '编程开发' }], tips: ['在VS Code/JetBrains中安装插件即可使用', '支持HTML/CSS/JS/Python等主流语言', 'Copilot Chat可以对话式解决编码问题'], relatedSkills: ['skill_code_review', 'skill_unit_test'], features: ['智能代码补全：基于上下文预测光标位置的下一段代码，支持多行建议和完整函数生成', 'Copilot Chat对话编程：在IDE内直接对话式编程，支持代码解释、重构、Debug和优化', 'Agent模式（VS Code）：自动分解复杂任务，自主搜索→编辑→运行→修复的多步骤执行', 'PR描述和代码审查：自动生成Pull Request的描述，审查代码变更并给出改进建议', '多模型支持：内置GPT-4o、Claude 3.5 Sonnet、Gemini等多种AI模型按需切换', '@github文档引用：在Chat中引用GitHub文档和仓库上下文，提升AI回答准确性', '多IDE支持：原生集成VS Code、JetBrains、Visual Studio、Xcode等主流开发环境', '团队级协作（Business/Enterprise）：共享AI配置、组织级策略、自定义知识库'], pricing: 'GitHub Copilot提供多层定价：Free免费版（每月2000次代码补全+50次Chat/月）；Pro个人版$10/月（无限补全+无限Chat+多模型切换+Agent模式）；Business企业版$19/人/月（团队管理+组织级策略+自定义知识库）；Enterprise企业增强版$39/人/月（+自定义模型+合规审计+高级安全）。学生和开源维护者可通过GitHub Student Developer Pack免费使用Copilot Pro。', pros: ['VS Code/JetBrains集成度极高：安装即用，零配置即可获得AI辅助编程体验', '价格亲民性价比高：Free版已够轻度使用，Pro版$10/月远低于Cursor的$20/月', '覆盖全开发流程：从代码补全到Chat对话到PR审查，一条龙辅助', 'GitHub生态协同：与Issues、Actions、Codespaces深度集成，团队协作体验好'], cons: ['代码理解深度有限：不如Cursor的Composer和Claude Code的项目级理解能力', '补全偶尔不准确：复杂逻辑场景下建议的代码可能需要手动调整', '安全风险：可能生成含漏洞或不安全的代码，需要开发者人工审查', '需要稳定网络：离线不可用，国内使用时需科学上网'], targetAudience: ['全栈开发者：日常使用VS Code/JetBrains进行前端+后端开发的工程师', '编程初学者：需要代码建议和学习辅助的编程入门学习者', '企业开发团队：需要统一AI编程工具标准化管理的技术团队', '开源贡献者：通过GitHub Student Pack免费使用Copilot Pro的开发者', '多语言开发者：需要在一台机器上辅助多种编程语言的工作者'], useCases: ['日常编码加速：在写函数、类、组件时自动补全样板代码和重复性代码，专注核心逻辑', '代码解释与学习：选中看不懂的代码片段，通过Chat让AI逐行解释其功能', '单元测试编写：选中函数使用Chat生成完整的单元测试用例，覆盖正常和边界情况', '代码重构优化：对Legacy代码请求AI提出重构方案，一次重构多个相关代码块', 'PR审查自动化：通过Copilot Review自动审查PR中的代码变更，标注潜在问题和改进建议'], faqs: [{ question: 'GitHub Copilot和Cursor哪个更好？', answer: '两者各有千秋。Copilot的优势：1)价格更低（$10 vs $20/月）2)作为VS Code插件安装即用，无需迁移编辑器 3)GitHub生态集成好 4)覆盖团队协作场景。Cursor的优势：1)AI深度融入编辑器 2)Composer多文件编辑更强 3)Tab补全更智能。建议：轻度AI编程和团队协作选Copilot，重度AI编程和Vibe Coding选Cursor。' }, { question: 'GitHub Copilot Free免费版够用吗？', answer: 'Free版每月2000次代码补全+50次Chat消息。适合低频使用：每天约60-70次补全+1-2次Chat对话。对于轻度编程完全够用。高频开发者建议Pro版（$10/月），无限补全+无限Chat+Agent模式价值远超价格。学生可免费获取Pro版。' }, { question: 'Copilot支持哪些编程语言和IDE？', answer: '支持几乎所有主流语言：JavaScript/TypeScript/Python/Java/Go/Rust/C++/PHP/Ruby/C#等，质量取决于语言的流行度。IDE方面原生支持：VS Code、JetBrains全线产品（IntelliJ/PyCharm/WebStorm等）、Visual Studio、Xcode、Vim/Neovim。' }, { question: 'GitHub Copilot生成的代码有版权问题吗？', answer: 'GitHub已推出Copilot Code Referencing功能：当生成代码匹配公开仓库代码时，会提示查看和归属。GitHub也有代码筛选开关（Block Public Suggestions），可过滤掉可能受版权保护的代码。建议用户始终审查AI生成代码，企业用户选择Enterprise版以获得更完整的法律保护。' }] },
  { id: 'dalle', name: 'DALL·E 3', logo: '🎨', description: 'OpenAI的最强图像生成模型，理解自然语言描述精准', url: 'https://openai.com/dall-e-3', price: 'paid', difficulty: 'beginner', heat: 64.9, heatGrowth: 11.3, tags: ['AI绘画', '图像生成'], techTags: ['Diffusion', 'GenerativeMedia'], sceneTags: ['设计创作', '内容创作', '电商运营'], costTags: ['Paid', '需翻墙'], category: '图像生成', prompts: [{ id: 'p1', title: '产品展示图', content: '[Product] on a clean white background, professional product photography, soft lighting, minimal, high quality', scene: '电商运营' }, { id: 'p2', title: '插画设计', content: 'Digital illustration of [subject], [style], vibrant colors, detailed, professional', scene: '设计创作' }], tips: ['通过ChatGPT Plus使用，直接自然语言描述即可', '对文字和复杂构图的理解能力很强', '生成的图片可以再次编辑修改部分区域'], relatedSkills: ['skill_product_image', 'skill_logo_design'],
    features: ['自然语言理解领先：用日常语言描述即可生成精准图像，无需专业提示词技巧', '文字渲染能力突出：可在图像中生成准确的中英文文字和排版', '内嵌编辑（Inpainting）：选中图片中的区域，用文字描述替换或修改内容', '风格多样性：覆盖写实摄影、数字插画、油画、3D渲染等多种风格', 'ChatGPT无缝集成：通过ChatGPT Plus直接在对话中生成图片，无需切换工具', '构图精准度强：理解复杂场景中的物体关系和空间布局', '参考图生成：上传参考图片作为风格或构图的引导', '社交媒体尺寸适配：自动生成适合Instagram、Twitter、Facebook等平台的尺寸版本'],
    pricing: 'DALL·E 3不提供独立订阅，需要通过ChatGPT Plus（$20/月）或OpenAI API（按量计费）使用。ChatGPT Plus用户可无限制生成DALL·E 3图片（有速率限制）。API价格：$0.040/张（标准分辨率）、$0.080/张（HD高清）。每张图片的成本极低，适合大量生成。也可通过Microsoft Bing Image Creator免费使用（基于DALL·E 3，但质量和限制略有不同）。',
    pros: ['自然语言生成最易用：用大白话描述即可出图，不像Midjourney需要专业英文提示词', '文字生成精准：DALL·E在图片内生成文字的准确率远超其他工具', 'ChatGPT联动方便：对话中直接出图，AI自动优化你的描述生成更佳效果', '编辑功能实用：Inpainting功能可以精准修改图片中的局部区域'],
    cons: ['需订阅ChatGPT Plus：没有独立使用渠道，每月最低$20成本', '画风审美不如Midjourney：生成的图片偏\"AI感\"，艺术性和光影质感有差距', '风格多样性有限：不如Midjourney的参数控制和Stable Diffusion的模型生态', '分辨率固定：标准版为1024x1024，HD版可达1792x1024，但不可自定义'],
    targetAudience: ['内容创作者：需要配图、封面图、插图的博主和自媒体运营者', '电商运营者：需要产品白底图和简单场景图的电商卖家', '普通AI绘画入门用户：不想学专业提示词，想用自然语言直接出图的初学者', '产品/UI设计师：需要快速生成概念图和界面设计的创意人员', '市场营销人员：需要广告创意图和社交媒体配图的营销团队'],
    useCases: ['文章配图生成：写完文章后让ChatGPT根据内容自动生成配图，风格一致', '产品白底图：描述产品外观和材质，AI生成干净的专业产品展示图', 'Logo设计初稿：用自然语言描述品牌概念，AI生成多个Logo方向供选择', '社交媒体配图：描述活动主题，生成适合各平台尺寸的宣传配图', '插画与漫画：用文字描述角色和场景，AI生成数字插画或漫画风格的图像'],
    faqs: [
      { question: 'DALL·E 3和Midjourney哪个好？', answer: '各有所长。DALL·E 3的优势：自然语言理解最好，用日常语言描述即可出图，文字渲染精准，与ChatGPT集成方便。Midjourney的优势：美学质量更高，艺术感更强，参数控制系统更精细，社区生态更丰富。建议：追求易用性和文字生成选DALL·E，追求艺术质量和风格多样性选Midjourney。' },
      { question: 'DALL·E 3怎么使用？需要单独收费吗？', answer: 'DALL·E 3没有独立的使用入口，需要通过ChatGPT Plus订阅（$20/月）或OpenAI API调用。ChatGPT Plus用户可以在对话中直接@DALL·E生成图片，无生成数量限制。也可以通过Microsoft Bing Image Creator免费体验（但功能有所限制）。' },
      { question: 'DALL·E 3支持中文提示词吗？', answer: '支持。DALL·E 3的最大优势之一就是用自然语言（包括中文）描述需求即可精准出图。你不需要学复杂的英文Prompt技巧，用中文说"一只穿西装的红熊猫在深圳街头喝咖啡，写实摄影风格"就能出图。中文提示词的效果明显优于Midjourney。' },
      { question: 'DALL·E 3生成的图片能商用吗？有版权吗？', answer: 'OpenAI的政策是，通过ChatGPT Plus或API生成的图片，用户拥有全部所有权和商用权利，可以用于商业产品、印刷、广告等用途。但需要注意：1)生成内容不得侵犯第三方版权 2)不得生成他人肖像或受版权保护的角色 3)OpenAI不提供版权保障，建议商用前自行评估版权风险。' }
    ]
  },
  { id: 'leonardo', name: 'Leonardo AI', logo: '🐉', description: '综合AI创作平台，集成图像生成、训练和编辑功能', url: 'https://leonardo.ai', price: 'freemium', difficulty: 'intermediate', heat: 52.1, heatGrowth: 19.7, tags: ['AI绘画', '图像生成', '创作平台'], techTags: ['Diffusion', 'GenerativeMedia'], sceneTags: ['设计创作', '内容创作', '游戏开发'], costTags: ['Freemium', '需翻墙'], category: '图像生成', prompts: [{ id: 'p1', title: '游戏角色设计', content: 'Fantasy character design, [class], [weapon], detailed armor, dynamic pose, game art style, --ar 9:16', scene: '游戏开发' }, { id: 'p2', title: '建筑概念图', content: 'Architectural concept, [building type], modern style, [environment], photorealistic, cinematic lighting', scene: '设计创作' }], tips: ['提供丰富的预设风格模型', '可以训练自己的专属模型', '每日免费额度充足'], relatedSkills: ['skill_avatar_design'],
    features: ['预设风格模型库：100+高质量预训练模型覆盖游戏、动漫、写实、概念艺术等风格', '专属模型训练：上传自己的数据集，训练定制化的专属图像生成模型', 'AI画布编辑器：集成生成式填充、背景移除、图像融合等编辑工具', '实时生成预览：边输入提示词边实时预览生成效果，所见即所得', '高分辨率输出：最高支持4K分辨率，适合印刷和商业用途', '批量生成模式：一次输入多组提示词，批量生成大量图像', 'API和集成：提供REST API支持将Leonardo集成到第三方工作流', '社区画廊：数百万用户的作品库，可参考Prompt和风格'],
    pricing: 'Leonardo AI采用Freemium模式。免费版：每日150个生成点数，可访问基础模型和编辑工具，720p输出。Apprentice版$10/月：5000点数/月，去水印，高清输出，模型训练。Artisan版$30/月：15000点数/月，优先生成，自定义模型训练，商业授权。Maestro版$60/月：无限生成，专属模型，API访问。免费版每天150点数对轻度使用基本够用。',
    pros: ['免费额度业界最慷慨：每天150点免费点数，正常使用不需付费', '模型训练功能强大：可训练专属模型，生成特定风格或角色的图像', '风格模型库丰富：100+预设模型覆盖几乎所有视觉风格', '功能全面的创作平台：不只是一个生成器，而是完整的AI创作工作室'],
    cons: ['图像质量不如Midjourney：在同提示词下画质和美感有差距', '平台功能繁杂：功能太多但深度不足，部分工具实用性一般', '需要翻墙且页面加载慢：服务器在海外，中国用户使用体验受影响', '免费用户生成速度受限：高峰期需排队等待，速度较慢'],
    targetAudience: ['游戏开发者：需要快速生成角色、场景、道具概念图的游戏美术', '独立游戏创作者：预算有限但需要大量美术资源的小团队', 'AI绘画进阶用户：希望训练专属风格模型的AI绘画爱好者', '概念设计师：需要快速迭代创意方案的设计从业人员', '内容创作者：需要风格一致的批量配图的博主和社交媒体运营者'],
    useCases: ['游戏角色系列生成：训练一个\"战士风格\"的专属模型，批量生成风格统一的游戏角色', '概念艺术探索：用实时预览功能快速探索不同的设计方案，边调Prompt边看效果', '电商产品图批量生成：设置统一的品牌风格模型，批量生成风格一致的产品展示图', '角色换装/表情变化：基于训练的专属角色模型，生成不同服装或表情的变体', '建筑/室内设计概念：使用建筑类预设模型，快速生成多种风格的建筑或室内效果图'],
    faqs: [
      { question: 'Leonardo AI免费版每天150点数能做什么？', answer: '每次标准图像生成消耗1-5点数，150点数约可生成30-150张图。对轻度到中度使用（每天30-50张图）完全够用。训练一个专属模型约消耗1000-2000点数（一次性），建议用免费点数积累几天后再训练。如果不够用，Apprentice版$10/月提供5000点数。' },
      { question: 'Leonardo AI的模型训练怎么用？', answer: '上传10-30张同一风格或角色的图片（建议标注），Leonardo AI会自动训练一个专属模型。训练完成后，在生成时选择你的模型，即可生成符合该风格的图像。这对游戏角色设计、品牌风格统一、特定艺术家风格模仿非常有用。免费用户可训练3个模型，付费用户更多。' },
      { question: 'Leonardo AI和Midjourney哪个更适合游戏开发？', answer: '游戏开发场景下Leonardo更合适。原因：1)可训练专属角色模型，保持角色一致性 2)100+预设风格模型覆盖游戏美术风格 3)批量生成效率高 4)AI画布编辑功能方便后期调整。Midjourney在单张图的美学质量上更好，但游戏开发需要的是批量、一致、可编辑的素材。' },
      { question: 'Leonardo AI的生成结果有版权问题吗？', answer: '免费用户和付费用户生成的图像使用权归属用户，可用于商业用途。但需要注意：1)不得生成受版权保护的角色或商标 2)使用平台预设模型生成的图像，其他用户也可能生成相似风格的图 3)训练专属模型的图像版权由你完全拥有。建议商用场景使用付费方案以获得更完整的权利保障。' }
    ]
  },
  { id: 'luma', name: 'Luma AI', logo: '🎥', description: 'AI 3D和视频生成工具，支持文本到3D、图生3D和视频', url: 'https://lumalabs.ai', price: 'freemium', difficulty: 'intermediate', heat: 48.5, heatGrowth: 27.3, tags: ['AI视频', '3D生成', '创意工具'], techTags: ['GenerativeMedia', '3DAI', 'NeRF'], sceneTags: ['内容创作', '设计创作', '游戏开发'], costTags: ['Freemium', '需翻墙'], category: '3D生成', prompts: [], tips: ['快速生成高质量3D模型', 'Dream Machine支持文生视频', '适合概念设计和产品展示'], relatedSkills: [],
    features: ['Dream Machine文生视频：最新模型支持从文字描述生成高质量视频', '文本到3D生成：用文字描述即可生成可编辑的3D模型，支持OBJ/GLB格式导出', '图生3D：上传参考图片，AI自动生成对应的3D模型', 'NeRF场景重建：从多角度照片自动重建完整的3D场景', '视频生成与编辑：支持视频风格迁移、慢动作、视频扩展等特效', '3D模型材质编辑：自动生成PBR材质，支持导出到Blender/Unity/Unreal', 'API与集成：提供开发者API，支持批量3D模型生成和自定义工作流', '实时预览：生成过程中实时渲染预览，所见即所得'],
    pricing: 'Luma AI采用Freemium模式。免费版：每月30次生成额度，720p视频/基础3D模型产出，带水印。Plus版$30/月：无限生成，1080p视频，高清3D模型导出，去水印。Pro版$100/月：4K视频，商业授权，API访问，优先计算。注意：3D模型生成消耗较多额度（单次约3-5次），视频生成1次/个。免费版适合尝鲜，创作需求建议Plus起步。',
    pros: ['3D生成能力独特：文本/图片生成3D模型，在AI工具中处于行业领先地位', 'Dream Machine视频质量好：生成视频的创意性和视觉表现力强', 'NeRF场景重建效果好：从照片重建3D场景的精度和真实感出色', '生成速度快：无论是3D模型还是视频，生成速度在同类产品中较快'],
    cons: ['免费额度有限：每月30次生成，重度使用需付费$30/月起', '3D模型精度有限：生成的中低复杂度模型效果好，复杂模型仍有限制', '视频长度限制：单个视频最长5-10秒，不能生成长视频', '需翻墙且中文支持差：界面全英文，提示词需用英文输入'],
    targetAudience: ['3D设计师：需要快速生成3D模型初稿或概念的三维设计师', '游戏开发者：需要快速创建游戏内3D资产和场景的游戏开发团队', '产品设计人员：需要产品3D模型展示的产品和工业设计师', '影视视觉特效师：需要创意视频素材和3D场景的影视制作人', 'AR/VR内容创作者：需要3D模型用于AR/VR场景的内容开发者'],
    useCases: ['产品3D展示：上传产品照片，AI自动生成3D模型，用于电商展示或AR预览', '游戏资产快速建模：用文字描述游戏道具或角色，快速生成3D模型导入Unity/Unreal', '室内场景重建：拍摄房间的多角度照片，用NeRF技术重建完整的室内3D场景', '创意视频短片：用Dream Machine将创意脚本描述转化为视觉短片，快速测试视觉效果', '建筑外观预览：上传建筑方案效果图，生成可直接旋转查看的3D建筑模型'],
    faqs: [
      { question: 'Luma AI能生成什么样的3D模型？可以导出到其他软件吗？', answer: 'Luma支持生成单体物体、角色、场景等多种类型的3D模型。生成的模型可导出为OBJ、GLB、FBX等主流格式，兼容Blender、Unity、Unreal Engine、Maya等常用3D软件。目前对中等复杂度的物体（如家具、道具、简单角色）生成质量最好，对精细有机体（如人物面部、复杂机械）还有提升空间。' },
      { question: 'Luma AI的Dream Machine是什么？和Runway/Pika的区别？', answer: 'Dream Machine是Luma推出的视频生成模型，与Runway Gen-3和Pika同属AI视频生成赛道。Dream Machine的优势在于：对镜头运动的理解更好，生成的视频更具电影感；对物理世界的模拟比较准确（如光照、反射、重力）。与Runway相比缺少视频编辑功能，但纯视频生成质量可以和Runway一战。' },
      { question: 'Luma AI免费版够用吗？', answer: '免费版每月30次生成额度，对偶尔测试和尝鲜基本够用。如果需要正式创作或商业使用，建议Plus版（$30/月）无限生成+去水印。注意：3D模型生成消耗更多额度，如果你主要是做3D模型生成，免费版很快就用完。' },
      { question: 'Luma AI支持中文提示词吗？', answer: 'Luma的界面和提示词输入主要支持英文。文字生成3D和视频时，建议使用英文描述以获得最佳效果。可以先在ChatGPT或DeepSeek中将中文需求翻译成英文，再粘贴到Luma中使用。对于图生3D场景，上传图片可以降低对文字描述的依赖。' }
    ]
  },
  enhanceTool({ id: 'deepseek', name: 'DeepSeek', logo: '🧠', description: '深度求索推出的国产AI大模型，以1M tokens超长上下文和卓越的代码能力著称，是开源社区最受欢迎的国产AI之一。DeepSeek V3/R1系列模型在多项基准测试中比肩GPT-4和Claude 3.5，且完全免费使用。其R1推理模型采用Chain-of-Thought技术，在数学、逻辑推理和编程竞赛中表现惊艳，被誉为"开源界的GPT-4"。1M tokens上下文窗口可一次处理三体三部曲级别的文本量，远超同类产品。对中国用户而言，DeepSeek是免费高质量的AI首选。', caseStudies: [
      { title: 'DeepSeek R1深度推理实战：数学和编程竞赛题解', source: 'bilibili', creator: 'B站AI教程', description: 'DeepSeek R1推理模型展示完整思维链，解决高难度问题', url: 'https://www.bilibili.com/video/BV1ZS421R7V7', duration: '30:00', skill: 'DeepSeek R1' }
    ],
    dailyPick: '国产AI之光：1M超长上下文免费无限制，R1推理模型展示完整思维链，代码能力比肩GPT-4且无需翻墙', url: 'https://chat.deepseek.com', price: 'free', difficulty: 'beginner', heat: 71.8, heatGrowth: 52.4, tags: ['AI对话', '代码助手', '长文本'], techTags: ['NLP', 'GenerativeAI'], sceneTags: ['编程开发', '办公提效', '学术研究', '企业AI自动化'], costTags: ['Free', '中文友好'], category: 'AI对话', prompts: [{ id: 'p1', title: '编程问题解决', content: '请帮我解决这个编程问题：[描述问题]\\n相关代码：[代码片段]', scene: '编程开发' }, { id: 'p2', title: '长文档分析', content: '请分析以下文档，提取关键信息：[文档内容]', scene: '办公提效' }], tips: ['上下文长度达1M tokens，可处理超长文档', '代码能力在开源模型中领先', '完全免费无需翻墙'], relatedSkills: ['skill_code_review', 'skill_weekly_report'], features: ['1M超长上下文：可一次处理约75万汉字，相当于三体三部曲的总字数', 'DeepSeek R1推理模型：Chain-of-Thought深度推理，在数学和编程竞赛中表现顶尖', 'DeepSeek V3通用模型：日常对话、内容创作、代码编写的全能模型', '文件上传处理：支持PDF/Word/Excel/TXT等多种格式的内容分析', '联网搜索支持：获取最新信息并给出有来源的答案', '完全免费无限制：无消息次数限制，无需付费订阅', 'R1蒸馏版本：提供多种尺寸的小模型供本地部署和二次开发', '中文优化：对中文语境的深度理解和地道表达'], pricing: 'DeepSeek目前完全免费，无需付费订阅，无消息次数限制。Web端和App端均可免费使用全部功能（包括DeepSeek R1推理模型和联网搜索）。API方面，DeepSeek提供极具竞争力的定价：V3模型约$0.27/1M输入tokens，$1.10/1M输出tokens，远低于OpenAI和Anthropic。作为对比，同等质量下DeepSeek的API成本仅为GPT-4的约1/10。', pros: ['完全免费零门槛：无需付费、无需科学上网，注册即用无限制', '1M超长上下文遥遥领先：是Claude的5倍、GPT-4o的8倍', 'R1推理模型独树一帜：展示完整推理过程，数学和逻辑能力顶级', 'API成本极低：仅为GPT-4的1/10，适合大规模商业调用'], cons: ['高峰期偶有服务器拥堵，响应速度不如海外产品稳定', '中文互联网知识覆盖好但对小众英文领域理解略逊', '多模态能力有限（文字模型），不支持原生图片生成和分析', 'R1模型推理速度较慢（Chain-of-Thought过程耗时较长）'], targetAudience: ['中国程序员：无需翻墙的顶级AI编程助手，代码能力媲美Claude', '学术研究者：需要分析大量PDF论文和长文档的科研人员', '企业降本增效小组：预算有限但需要AI赋能的中小团队', 'AI学习爱好者：研究开源大模型能力和Chain-of-Thought推理过程', '普通办公用户：日常写作、翻译、信息整理等办公需求'], useCases: ['大型代码库分析：将数千行的项目源码一次性提交，AI分析架构漏洞并给出优化', '学术文献综述：上传30+篇论文PDF，AI自动梳理研究脉络和关键发现', '小说/剧本分析：将完整的小说文本提交，AI分析人物关系、情节结构和主题', '技术方案设计：描述复杂的系统需求，AI输出详尽的技术设计文档', '数学和编程竞赛：利用R1的深度推理能力解决高难度算法和数学问题'], faqs: [{ question: 'DeepSeek完全免费是真的吗？不会有隐藏收费吗？', answer: '目前完全免费，官方明确表示没有隐藏收费。免费使用DeepSeek V3和R1模型，支持文件上传、联网搜索等全部功能。唯一的限制是高峰期可能需要排队等待。API调用是收费的，但价格极低（约为GPT-4的1/10）。对于99%的个人用户，直接使用Web端完全足够，无需付费。' }, { question: 'DeepSeek R1和V3有什么区别？怎么选择？', answer: 'V3是通用模型，适合日常对话、写作、代码生成等大多数场景，响应速度快。R1是推理模型，使用Chain-of-Thought逐步推理，适合数学解题、逻辑推理、复杂编程等需要深度思考的任务，但响应速度较慢。建议日常任务用V3，遇到复杂问题切换R1。两个模型在Web端均可免费使用。' }, { question: 'DeepSeek和ChatGPT/GPT-4差距有多大？', answer: '在2025年初的基准测试中，DeepSeek V3在多项指标上达到或超过GPT-4水平，R1在数学推理上甚至超越GPT-4。代码能力与Claude 3.5 Sonnet相当。主要差距在于：1)多模态能力缺失 2)英文语境的世界知识覆盖略少 3)API生态不如OpenAI成熟。但考虑到免费+中文友好+超长上下文，DeepSeek对国内用户来说是性价比最高的选择。' }, { question: '1M tokens上下文能做什么？', answer: '1M tokens约等于75万汉字，相当于三体三部曲的总字数或大英百科全书一卷。实际应用：可一次性分析整个大型项目的源代码、处理300+页的学术专著、分析长达一周的聊天记录或会议转录、或让AI基于整本参考书写报告。目前全球只有DeepSeek和通义千问支持1M级别的上下文。' }] }),
  { id: 'wenshen_yiyan', name: '文心一言', logo: '🐻', description: '百度开发的AI对话助手，支持多模态和中文优化', url: 'https://yiyan.baidu.com', price: 'free', difficulty: 'beginner', heat: 63.4, heatGrowth: 8.5, tags: ['AI对话', '中文AI', '多模态'], techTags: ['NLP', 'GenerativeAI', 'Multimodal'], sceneTags: ['办公提效', '内容创作', '学术研究', '企业AI自动化'], costTags: ['Free', '中文友好'], category: 'AI对话', prompts: [{ id: 'p1', title: '公文写作', content: '请根据以下要求，生成一份标准的公文：[公文类型]\\n核心内容：[内容要点]', scene: '办公提效' }, { id: 'p2', title: '方案策划', content: '请为[项目名称]制定一份详细的实施方案，包含：背景分析、目标设定、执行步骤、风险预案', scene: '办公提效' }], tips: ['中文理解能力在国产模型中非常出色', '支持图片理解和生成', '可以与百度生态产品深度集成'], relatedSkills: ['skill_wechat_article'],
    features: ['多模态理解与生成：支持文本+图片的理解，以及文生图功能', '百度生态深度集成：与百度搜索、文库、地图、网盘等产品无缝联动', '中文优化：对中国文化语境、成语、古诗词的理解远超海外AI', '多轮对话能力：支持复杂的多轮对话，上下文理解能力出色', '文档处理：支持PDF/Word/Excel/TXT等格式的上传和分析', '语音交互：支持语音输入和输出，交互方式灵活', '插件扩展：提供百度搜索、图片生成、数据查询等插件', '企业级版本：提供企业API和安全合规版本，适合内部部署'],
    pricing: '文心一言目前完全免费，无需付费订阅，无消息次数限制。免费可使用全部功能（包括文心4.0大模型、多模态、联网搜索、文件上传）。百度还提供文心一言专业版API，企业用户可按量付费调用。作为百度核心AI产品，短期内不会收费，主要通过百度生态变现。注册即用，无需翻墙，手机号注册即可。',
    pros: ['中文理解国产顶尖：对中文文化语境、成语典故的理解远超ChatGPT', '百度生态集成好：可直接调用百度搜索、文库等内容资源', '完全免费无限制：无需付费，无需翻墙，注册即用', '企业级合规：满足国内数据安全法规，企业使用无合规风险'],
    cons: ['创意写作能力一般：在创意文案和文学创作上不如DeepSeek和ChatGPT', 'AI幻觉较高：部分回答有时不够准确，需要人工核实', '代码能力较弱：不适合编程相关任务，代码质量不如专业AI编程工具', '多余信息较多：回答有时过于冗长，不够简洁'],
    targetAudience: ['公文/方案写作者：需要写政府公文、企业方案、报告的职场人士', '中国传统文化学习者：需要古诗文翻译、成语解释、文化背景分析的学习者', '企业办公人员：在百度生态中办公的行政和文职人员', '中国大陆普通用户：不想翻墙、需要免费AI助手的日常用户', '合规敏感型企业：数据不能出境的国内企业和机构'],
    useCases: ['公文写作：输入公文主题和要求，AI生成符合政府标准的格式和内容的公文', '百度文库内容整合：结合百度文库资源，自动提取和整理相关文档的核心要点', '古诗词翻译与现代文转换：将文言文或古诗词翻译为现代白话文，解析文化背景', '方案策划：输入项目需求，AI输出完整的实施方案、项目计划书或商业方案', '多模态信息查询：上传图片让AI分析图片内容，同时结合文字描述给出综合分析'],
    faqs: [
      { question: '文心一言和ChatGPT哪个更好？', answer: '看场景。文心一言的优势：免费无需翻墙、中文文化语境理解更好（特别是古诗词、成语）、与百度生态集成。ChatGPT的优势：创意写作更强、多模态能力更全面（DALL·E 3集成）、编程能力更强。建议：中文文化相关任务用文心一言，编程和创意写作用ChatGPT或DeepSeek。' },
      { question: '文心一言支持文生图吗？质量怎么样？', answer: '支持。文心一言集成了AI绘画功能，可以直接在对话中用文字描述生成图片。文生图的质量在国产AI中属于中等偏上水平，但整体不如Midjourney和DALL·E 3。不过由于免费且无需翻墙，对国内用户来说是性价比最高的文生图方案之一。' },
      { question: '文心一言是免费的吗？会收费吗？', answer: '目前完全免费，百度官方没有明确的收费计划。文心一言是百度AI战略的核心产品，主要通过免费策略获取用户并带动百度其他产品的使用。建议放心使用，短期内不会收费。但未来可能会推出增值服务（如更高频次的API调用、企业定制版本等）。' },
      { question: '文心一言的文档分析能力怎么样？', answer: '支持上传PDF、Word、Excel、TXT、图片等格式，AI可以提取和分析文档内容。在中文文档的分析质量上表现不错，特别是中文PDF和Word的解析准确率高。但在英文文档和复杂格式文档的处理上不如Kimi和Claude。' }
    ]
  },
  { id: 'tongyi', name: '通义千问', logo: '☁️', description: '阿里巴巴AI助手，支持长文本分析和多模态理解', url: 'https://tongyi.aliyun.com', price: 'free', difficulty: 'beginner', heat: 58.9, heatGrowth: 15.7, tags: ['AI对话', '中文AI', '办公工具'], techTags: ['NLP', 'GenerativeAI'], sceneTags: ['办公提效', '内容创作', '电商运营', '企业AI自动化'], costTags: ['Free', '中文友好'], category: 'AI对话', prompts: [{ id: 'p1', title: '电商文案优化', content: '请优化以下电商商品描述，提升转化率和搜索引擎排名：[原始描述]', scene: '电商运营' }, { id: 'p2', title: '文档翻译', content: '将以下内容翻译成[目标语言]，保持专业术语准确：[内容]', scene: '办公提效' }], tips: ['免费使用，无需翻墙', '支持PDF/Word/Excel/图片等多格式输入', '通义千问App可在手机上使用'], relatedSkills: ['skill_ecommerce_copy'],
    features: ['超长上下文支持：通义千问2.5支持1M tokens超长上下文，可一次处理百万字内容', '多模态理解：支持图片、视频、音频、文档等多格式内容的理解和分析', '阿里生态集成：与钉钉、淘宝、阿里云、千行等阿里系产品深度联动', '通义万相文生图：内置AI绘画功能，支持文字生成图片和图片编辑', '代码能力：通义灵码提供专业的AI编程辅助，支持主流IDE', '文档处理：支持PDF/Word/Excel/PPT等多格式上传分析', '联网搜索：自动检索互联网信息，获取最新数据和事实', '企业级API：提供稳定可靠的企业API服务，支持私有化部署'],
    pricing: '通义千问完全免费，无需付费订阅。免费使用超长上下文、联网搜索、文件上传、通义万相（AI绘画）等全部功能。通义灵码（编程助手）也提供免费的个人版。阿里云还提供通义千问API服务，企业用户可按量或包月付费，价格极具竞争力。作为国产AI，注册即用，无需翻墙。',
    pros: ['1M超长上下文：与DeepSeek并列业界最长上下文，可处理整本书籍', '阿里生态集成好：钉钉/淘宝/阿里云的AI能力统一入口', '完全免费无限制：功能全面且全部免费，无需翻墙', '通义万相绘画功能：文生图质量在国产AI中表现较好'],
    cons: ['对话体验一般：多轮对话中的上下文连贯性不如DeepSeek和ChatGPT', '领域深度的专业性不足：在特定专业领域（法律、医疗等）的回答深度有限', '创意写作能力中等：创意文案和文学创作不如ChatGPT', '高峰期的稳定性有待提升：用户量大时的响应速度会下降'],
    targetAudience: ['电商运营人员：需要在淘宝生态中优化商品描述和分析数据的商家', '阿里云用户：使用阿里云服务的企业技术人员和架构师', '钉钉办公人群：在钉钉生态中需要AI辅助的办公人员', '中国大陆普通用户：不想翻墙、需要免费AI工具的日常用户', '企业合规用户：数据安全敏感的国内企业用户'],
    useCases: ['电商文案优化：输入商品原始描述，AI一键生成高转化率的淘宝/天猫商品详情文案', '长文档分析报告：上传合同、招股书、研报等长文档（百万字级别），AI提取核心内容和风险点', '钉钉会议纪要：接入钉钉后自动生成会议纪要、提取待办事项并分配负责人', '通义万相产品图生成：用文字描述产品外观，生成电商产品展示图或场景图', '技术方案编写：描述项目需求，AI输出完整的技术方案文档和架构设计'],
    faqs: [
      { question: '通义千问有1M上下文吗？能处理多长的内容？', answer: '是的，通义千问2.5版本支持1M tokens的超长上下文，约等于75万汉字。这意味着可以一次性处理整本《三体》三部曲级别的文本量。但在实际使用中，超长上下文的回答质量取决于具体任务，建议在100万字符以内的文档分析效果最佳。' },
      { question: '通义千问和DeepSeek都是1M上下文，哪个更好？', answer: '两者各有千秋。DeepSeek的优势：R1推理模型在数学和逻辑推理上更强、代码能力更出色、开源生态好。通义千问的优势：阿里生态集成（钉钉/淘宝/阿里云）、通义万相AI绘画、企业级服务更成熟。建议：纯文本分析和编程选DeepSeek，电商和阿里生态用户选通义千问。' },
      { question: '通义千问的AI绘画功能叫什么？效果如何？', answer: '通义千问的文生图功能叫"通义万相"，支持文字生成图片、图片风格迁移、图片变体等功能。通义万相在国产AI绘画中属于领先水平，特别适合生成电商产品图、设计概念图等场景。生成速度较快，完全免费。' },
      { question: '通义千问支持API调用吗？怎么收费？', answer: '支持。阿里云提供通义千问的API服务，包括通义千问2.5大模型、通义万相绘画、通义灵码编程等。API价格极具竞争力，提供按量计费和包月两种模式。个人开发者每月有免费额度，企业用户性价比极高。具体价格请参考阿里云官网。' }
    ]
  },
  { id: 'doubao', name: '豆包', logo: '🫘', description: '字节跳动AI对话助手，整合抖音生态内容创作能力', url: 'https://www.doubao.com', price: 'free', difficulty: 'beginner', heat: 56.2, heatGrowth: 38.9, tags: ['AI对话', '中文AI', '内容创作'], techTags: ['NLP', 'GenerativeAI'], sceneTags: ['内容创作', '短视频', '办公提效'], costTags: ['Free', '中文友好'], category: 'AI对话', prompts: [{ id: 'p1', title: '短视频标题生成', content: '请为以下短视频内容生成10个爆款标题，要求：吸引眼球、包含关键词、适合抖音风格：[视频描述]', scene: '短视频' }, { id: 'p2', title: 'AI绘画', content: '请根据以下描述生成图片：[描述]', scene: '内容创作' }], tips: ['整合抖音热门趋势和爆款内容', '支持语音交互', '可以生成AI图片和视频'], relatedSkills: ['skill_short_video_script'],
    features: ['抖音热点整合：深度集成抖音热门趋势、爆款内容和流行话题', 'AI图片和视频生成：内置文生图和文生视频功能，支持抖音风格内容创作', '语音交互：支持语音输入和输出，交互更自然便捷', '数字人播报：支持创建AI数字人进行短视频播报', '多模态理解：支持图片、音频、文档等多格式内容的理解和分析', '长文本处理：支持上传和分析长文档、PDF文件', '联网搜索：获取实时信息，回答最新问题', '跨平台使用：支持Web端、手机App和小程序，使用便捷'],
    pricing: '豆包完全免费，无需付费订阅，无消息次数限制。免费使用AI对话、AI绘画、AI视频、语音交互、数字人、联网搜索等全部功能。作为字节跳动的核心AI产品，豆包当前策略是免费获取用户，与字节系产品（抖音、飞书、西瓜视频等）生态联动变现。注册即用，手机号/抖音账号登录，无需翻墙。',
    pros: ['抖音生态得天独厚：短视频内容创作能力与抖音深度绑定', '功能全面免费：AI对话+AI绘画+AI视频+数字人全部免费', '用户增长最猛：凭借抖音流量入口，用户增长速度和数量领先国产AI', '中文对话自然：对话语气自然接地气，适合中国用户的交流习惯'],
    cons: ['深度任务处理不佳：对于复杂的分析和推理任务，能力不如DeepSeek', '专业领域知识有限：在法律、医疗、编程等专业领域的准确性不够', 'AI绘画和视频质量一般：生成的图片和视频质量不如Midjourney和Runway等专业工具', '数据隐私考量：作为抖音系产品，部分用户对数据隐私有顾虑'],
    targetAudience: ['短视频创作者：需要AI辅助生成短视频标题、脚本和内容的抖音创作者', '年轻群体：习惯使用抖音和字节系产品的年轻用户', '中国大陆普通用户：不想翻墙、希望一站式使用多种AI功能的日常用户', '社交媒体运营者：需要追踪抖音热点和趋势的内容运营人员', 'AI入门用户：想要一个功能多且免费的AI助手的初学者'],
    useCases: ['短视频爆款标题：输入视频内容描述，AI生成10个适合抖音风格的爆款标题，提升点击率', 'AI数字人口播：用文字脚本+数字人形象，自动生成可发布的短视频口播内容', '抖音热点追踪：询问当前抖音热门话题和趋势，AI整合最新爆款内容推荐', 'AI配图制作：输入产品描述，AI生成适合电商或社交媒体的产品配图', '日常写作助手：撰写朋友圈文案、短视频评论回复、社交私信等日常内容'],
    faqs: [
      { question: '豆包和抖音的联动是怎么样的？', answer: '豆包与抖音深度联动：1)可直接分析抖音上的热门视频和话题 2)生成的AI内容可直接用于抖音创作 3)支持抖音账号登录 4)数字人播报功能适合制作抖音口播视频 5)AI推荐的标题和内容风格专为抖音优化。如果你是抖音创作者，豆包是国产AI中最适合你的辅助工具。' },
      { question: '豆包支持AI视频生成吗？质量怎么样？', answer: '支持。豆包内置了AI视频生成功能，可以用文字描述生成短视频。视频质量在国产AI视频工具中属于中等水平，不如可灵（快手出品）和Runway等专业视频生成工具。但豆包的视频生成完全免费且无需翻墙，对短视频创作者的日常使用足够了。' },
      { question: '豆包和ChatGPT比哪个好用？', answer: '看需求。豆包的优势：免费无需翻墙、抖音生态集成、功能全面（文本+图片+视频+数字人）、中文对话自然。ChatGPT的优势：AI能力更强（特别是推理和代码）、生态更完善（GPTs/插件）、国际化更好。建议：日常短视频创作和通用聊天用豆包，专业分析和编程用ChatGPT或DeepSeek。' },
      { question: '豆包支持创建自己的AI智能体吗？', answer: '支持。豆包提供"智能体市场"，用户可以在其中创建和配置个性化的AI助手，设定角色、风格和专业领域。创建的智能体可以分享给他人使用。这个功能类似ChatGPT的GPTs和Coze的Bot构建，但更简单易用，适合没有编程基础的用户。' }
    ]
  },
  { id: 'muse', name: 'Muse AI', logo: '🎯', description: 'AI驱动的极简浏览器，将AI搜索和内容推荐融入浏览体验', url: 'https://muse.ai', price: 'free', difficulty: 'beginner', heat: 44.1, heatGrowth: 25.6, tags: ['AI搜索', '浏览器', '信息管理'], techTags: ['Search', 'RAG', 'Agent'], sceneTags: ['办公提效', '学术研究'], costTags: ['Free', '中文友好'], category: 'AI搜索', prompts: [], tips: ['AI自动总结搜索结果页面内容', '支持AI阅读模式和摘要', '个性化内容推荐引擎'], relatedSkills: [],
    features: [
      'AI搜索集成：在地址栏直接输入自然语言查询，AI自动搜索并总结结果',
      '页面智能摘要：打开任何网页，AI自动生成核心内容摘要和关键要点',
      '阅读模式优化：AI重新排版网页内容，去除广告和干扰元素，提供沉浸式阅读体验',
      '个性化内容推荐：根据浏览历史和兴趣，AI推荐相关文章和资源',
      '智能标签管理：AI自动对书签和浏览历史分类标签，方便检索',
      '跨设备同步：支持多设备间的浏览数据、书签和设置的同步',
      '隐私优先设计：本地处理敏感数据，不上传浏览历史到云端',
      '极简界面设计：无多余工具栏和按钮，专注内容阅读本身'
    ],
    pricing: 'Muse AI完全免费使用，无需付费订阅。所有功能包括AI搜索、页面摘要、阅读模式、个性化推荐均免费开放。目前处于早期用户增长阶段，通过免费策略吸引用户，未来可能推出Pro版增值功能（如无限云端存储空间、高级AI分析等）。注册方式简单，邮箱即可注册，支持中文界面。对中国用户友好，无需翻墙即可访问和使用。',
    pros: ['AI融合浏览体验：将AI搜索和内容推荐深度融入浏览器，体验流畅自然', '页面智能摘要实用：打开任何网页自动生成摘要，大幅提升信息获取效率', '界面极简无广告：浏览器设计简洁纯粹，没有任何广告和多余的UI元素', '完全免费使用：所有功能免费开放，无隐藏收费和使用限制'],
    cons: ['生态兼容性有限：不支持Chrome/Firefox扩展，无法使用现有插件生态', '浏览功能基础：作为浏览器的标签管理、下载管理等基础功能不如成熟浏览器', '品牌知名度低：用户社区和第三方资源较少，问题解决渠道有限', '信息推荐算法待优化：个性化推荐的精准度还有提升空间'],
    targetAudience: ['信息过载的知识工作者：每天需要浏览大量网页并快速提取关键信息的人群', '深度阅读爱好者：喜欢沉浸式阅读体验、讨厌网页广告干扰的用户', '效率追求者：希望通过AI辅助提升信息获取和整理效率的职场人士', '极简主义用户：厌倦了臃肿浏览器，追求简洁浏览体验的人', 'AI工具尝鲜者：对AI+浏览器融合概念感兴趣的技术爱好者'],
    useCases: ['快速了解网页内容：打开长篇文章或报告，AI自动生成摘要，无需全文阅读即可了解核心观点', '研究资料收集：搜索研究主题时，AI自动整理多个搜索结果并生成综合摘要', '每日信息简报：设置兴趣领域，AI自动推荐相关文章并生成每日阅读简报', '无干扰阅读：开启阅读模式，AI去除广告和侧边栏，提供沉浸式阅读体验', '知识管理归档：AI自动对浏览的内容分类打标签，构建个人知识库'],
    faqs: [
      { question: 'Muse AI和普通浏览器有什么区别？', answer: '核心区别：1)Muse AI内置AI搜索功能，在地址栏输入自然语言即可获得AI总结而非链接列表 2)打开任何网页自动生成AI摘要 3)AI阅读模式去除广告和干扰 4)AI个性化推荐内容。普通浏览器（如Chrome）需要安装扩展才能实现类似功能，且体验碎片化。Muse把AI能力深度融入浏览体验本身。' },
      { question: 'Muse AI支持Chrome扩展吗？', answer: '目前不支持安装Chrome/Firefox扩展。Muse AI的设计理念是\"极简内置\"，希望用AI原生功能替代第三方扩展。内置的AI摘要、阅读模式、内容推荐等功能已经覆盖了大多数用户的核心需求。如果必须使用特定扩展，建议暂时继续使用Chrome等传统浏览器。' },
      { question: 'Muse AI在中国能用吗？需要翻墙吗？', answer: 'Muse AI在中国大陆可以正常使用，无需翻墙。它的AI搜索和摘要功能对中文网页支持良好。不过需要注意的是，Muse AI目前主要面向英文互联网优化，中文内容的AI摘要质量略低于英文内容。随着用户增长，中文支持预计会持续改善。' },
      { question: 'Muse AI会收集我的浏览数据吗？', answer: 'Muse AI采用隐私优先设计。浏览历史和AI分析主要在本地设备处理，不会上传到云端。书签和设置等数据在跨设备同步时采用端到端加密。相比Chrome等浏览器（Google会收集大量浏览数据用于广告），Muse AI在隐私保护方面更加注重。具体细节可查看其隐私政策。' }
    ]
  },
  enhanceTool({ id: 'gemini', name: 'Gemini', logo: '♊', description: 'Google开发的多模态AI模型，支持文本、图像、视频、音频理解和生成', dailyPick: 'Google生态深度集成，2M超长上下文+多模态视频理解，与Gmail/Docs无缝联动', url: 'https://gemini.google.com', price: 'free', difficulty: 'beginner', heat: 70, heatGrowth: 25, tags: ['AI对话', '多模态', '谷歌AI'], techTags: ['NLP', 'GenerativeAI', 'Multimodal'], sceneTags: ['办公提效', '内容创作', '学术研究'], costTags: ['Free', '需翻墙'], category: 'AI对话', prompts: [{ id: 'p1', title: '图像分析与解读', content: '请分析这张图片的内容，包括：1.图片中的主要元素 2.色彩和构图特点 3.可能的情感和氛围 4.适用的使用场景', scene: '内容创作' }, { id: 'p2', title: '文档深度研究', content: '请分析以下文档，提取：1.核心论点 2.关键数据支撑 3.论证逻辑链 4.结论可靠性评估 5.补充建议', scene: '学术研究' }], tips: ['Gemini 支持2M超长上下文，可一次处理大量信息', '支持视频上传和分析，能理解视频内容', '与Google生态（Gmail、Docs等）深度集成', '支持多模态输入：文本、图片、音频、视频'], relatedSkills: [], xhsSaves: 980000,
    features: ['2M超长上下文窗口：业界最长的上下文支持，可一次处理约150万汉字，堪比整套大英百科全书', '多模态深度理解：支持文本、图片、音频、视频四合一输入，可以直接分析YouTube视频内容', 'Google生态深度集成：与Gmail、Google Docs、Google Drive、Google Maps无缝联动', 'Google搜索增强：使用Google搜索作为信息源，回答基于全球最强大的搜索引擎索引', 'Gemini Live语音对话：支持实时语音对话，打断和追问体验流畅自然', 'Google Flights/Hotel集成：可直接查询航班和酒店信息，规划行程', 'Deep Research研究模式：多步搜索和推理，生成深度研究报告', '多平台支持：提供Web端、Android/iOS App，以及Google Workspace集成'],
    pricing: 'Gemini完全免费使用（标准版），无需付费订阅即可使用2M超长上下文、多模态理解、联网搜索等核心功能。Google One AI Premium（$19.99/月）：访问Gemini Advanced（更强推理能力）、无限使用Google Workspace AI功能、2TB云存储空间。相比ChatGPT Plus（$20/月），Gemini Advanced价格相近但多了2TB云存储和Google生态集成。免费版对日常使用非常充足，且通过Google账号即可使用，无需额外注册。需翻墙访问。',
    pros: ['2M业界最长上下文：是Claude 200K的10倍，一次处理超大型代码库或完整书籍', '多模态能力最全面：文本+图片+音频+视频四模态，视频理解能力独一档', 'Google生态集成独一无二：与Gmail/Docs/Drive/Maps深度联动，办公场景优势明显', '免费版功能慷慨：基础版完全免费且功能强大，2M上下文无限制使用'],
    cons: ['需科学上网才能访问，中国用户使用门槛高', '中文理解和生成质量不如国产AI（DeepSeek、文心一言）细腻', '推理能力弱于Claude和DeepSeek R1，复杂逻辑问题处理不够深入', '与Google生态绑定过深：非Google用户和使用习惯的迁移成本较高'],
    targetAudience: ['Google生态重度用户：使用Gmail、Google Docs、Google Workspace的办公人员', '视频内容分析师：需要分析长视频和YouTube内容的研究者和媒体人', '超长文档研究者：需要处理数十万字文档的学术研究人员和律师', '多模态数据处理者：需要同时处理图文音视频的创作者和媒体从业者', '海外学习和工作者：习惯使用Google生态的海外留学生和职场人士'],
    useCases: ['YouTube视频深度分析：粘贴YouTube链接，AI分析视频内容、提取关键信息并生成摘要', 'Google Docs智能写作：在Google Docs中直接调用Gemini进行文档撰写、翻译和润色', '超大型代码库审查：将整个项目的代码上传，AI一次性分析架构模式并给出优化建议', '邮件智能处理：集成Gmail后自动分类邮件、生成回复草稿、提取关键信息', '行程规划助手：结合Google Maps和Flights，AI规划完整的旅行路线和行程安排'],
    faqs: [
      { question: 'Gemini的2M上下文在实际使用中体验如何？', answer: '2M上下文可以处理约150万汉字，实际测试：上传完整的长篇英文小说（约1000页）能完整理解和分析。处理如此大量的文本时，Gemini的响应速度会变慢（约30-60秒），但理解和分析质量很好。对于日常使用场景（几十页文档），响应速度很快。2M上下文是目前所有AI工具中最长的，比Claude的200K长10倍。' },
      { question: 'Gemini和ChatGPT相比有什么核心优势？', answer: 'Gemini的核心优势：1)2M超长上下文（GPT-4o仅128K）2)原生多模态视频理解（能看视频而不是截图）3)Google生态集成（Gmail/Docs/Drive/Maps深度联动）4)免费版功能非常强大。ChatGPT的优势：插件生态更丰富、Custom GPTs更多、创意写作能力更强。建议：Google生态用户选Gemini，需要丰富插件生态选ChatGPT。' },
      { question: 'Gemini在中国能用吗？需要翻墙吗？', answer: 'Gemini和Google大部分服务一样，在中国大陆无法直接访问，需要翻墙工具。网页版gemini.google.com和App均被屏蔽。Google One AI Premium的订阅也需要国际支付方式。如果无法翻墙，建议使用国产替代：文心一言、通义千问、DeepSeek等，这些工具在中文场景下表现同样出色。' },
      { question: 'Gemini Advanced付费版值不值得订阅？', answer: 'Gemini Advanced（$19.99/月）的价值在于：1)更强的推理能力（Gemini Ultra模型）2)Google Workspace AI功能（Gmail/Docs/Sheets中的AI）3)2TB Google云存储（单独购买需$9.99/月）。如果你已经使用Google One存储，那么Advanced仅比当前方案多$10/月就能获得顶级AI能力。对于Google生态重度用户来说非常划算。' }
    ]
  }),

  enhanceTool({ id: 'grok', name: 'Grok', logo: 'ℹ️', description: 'xAI推出的AI助手，集成X/Twitter实时数据，回答风格独特', url: 'https://grok.com', price: 'freemium', difficulty: 'beginner', heat: 62, heatGrowth: 35, tags: ['AI对话', '实时信息', 'X/Twitter'], techTags: ['NLP', 'GenerativeAI'], sceneTags: ['办公提效', '编程开发', '内容创作'], costTags: ['Freemium', '需翻墙'], category: 'AI对话', prompts: [{ id: 'p1', title: '实时新闻分析', content: '请分析以下热点新闻事件：1.事件背景和经过 2.各方观点 3.发展趋势预测 4.对相关领域的影响', scene: '内容创作' }, { id: 'p2', title: '数据趋势解读', content: '分析以下数据趋势，给出：1.关键洞察 2.异常点识别 3.可能的原因分析 4.未来走向预判\\n数据：[数据内容]', scene: '办公提效' }], tips: ['深度集成X/Twitter平台，可获取最新实时信息', '回答风格相对自由，采用更少约束的对话方式', '支持实时数据分析和网络信息检索', 'Pro订阅用户可获得更多使用额度'], relatedSkills: [], xhsSaves: 720000,
    features: ['X/Twitter实时数据集成：深度接入Twitter/X平台，实时获取和检索最新推文和趋势话题', '独特回答风格：采取更少约束的对话方式，支持幽默讽刺和直言不讳的回答风格', '实时新闻分析：基于X平台的海量实时讨论，快速分析热点新闻事件的多方观点', '图像理解与生成：支持图片内容分析和理解，辅助文生图功能', '网络信息检索：实时搜索互联网获取最新信息，不限于X平台内容', '多轮上下文对话：保持长期对话上下文，支持深入的追问和讨论', 'Grok-2大模型：xAI自研的Grok-2模型，推理能力接近GPT-4水平', '移动App支持：提供iOS和Android App，随时随地使用'],
    pricing: 'Grok采用Freemium模式，深度绑定X/Twitter平台。免费版：X/Twitter用户可免费使用Grok（每天有限额约10-20次查询），基础Grok模型，标准响应速度。Premium版$8/月（X Premium）：更多使用额度，优先访问，Grok-2模型。Premium+版$16/月：无限使用，最高优先级，最新模型。需翻墙使用。X Premium用户可免费获得Grok功能，无需额外付费。',
    pros: ['X/Twitter实时数据独一档：直接获取社交媒体实时数据，新闻和趋势分析时效性最强', '回答风格独特：打破AI常规的约束式回答，更具个性和趣味性', '与X平台深度绑定：在X生态内无缝使用，可@Grok调用和检索推文', '价格亲民：X Premium $8/月即可使用，低于ChatGPT Plus的$20/月'],
    cons: ['需X/Twitter账号：必须注册X平台才能使用，对非X用户不友好', '需翻墙使用：X和Grok均无法在中国直接访问', '中文支持较差：主要面向英文用户，中文理解和生成质量一般', '生态闭环太强：脱离X平台后功能大幅缩减，独立使用体验一般'],
    targetAudience: ['X/Twitter重度用户：日常在X平台获取信息和互动的活跃用户', '新闻从业者：需要快速追踪和分析社交媒体热点的记者和媒体人', '市场分析师：需要从社交媒体数据中洞察趋势和舆情分析的市场人员', 'AI技术爱好者：希望体验Elon Musk xAI产品的技术探索者', '社交媒体运营者：需要掌握X平台动态的内容运营和品牌管理人员'],
    useCases: ['实时热点追踪：询问当前X平台最热的话题和讨论，Grok实时抓取并分析主流观点', '推文内容分析：粘贴推文链接，AI分析推文的背景、影响力和可能的传播路径', '品牌舆情监控：输入品牌名称，Grok搜索X平台的相关讨论并生成舆情分析报告', '事件时间线重建：询问特定事件的来龙去脉，Grok基于推文数据重建事件发展线', '数据分析与可视化：上传CSV数据，让Grok分析趋势并生成可读的数据洞察报告'],
    faqs: [
      { question: 'Grok需要X/Twitter账号才能使用吗？', answer: '是的，Grok深度集成X/Twitter平台，需要使用X账号登录。免费用户可以在X平台上@Grok或在Grok独立页面使用，但每天有使用限额（约10-20次查询）。X Premium订阅用户（$8/月）可获得更多使用额度。Grok的独特价值在于X平台的实时数据，没有X账号会失去这一核心优势。' },
      { question: 'Grok和ChatGPT相比有什么不同？', answer: 'Grok最大的不同在于：1)接入X/Twitter实时数据，新闻和趋势分析能力最强 2)回答风格更自由，支持幽默和直言不讳的风格 3)与X平台深度集成 4)价格更便宜（$8/月起）。但Grok在通用能力（如编程、创意写作）上不如ChatGPT成熟。两者定位不同：Grok是社交媒体AI助手，ChatGPT是通用AI工具。' },
      { question: 'Grok在中国能用吗？', answer: 'Grok和X/Twitter平台在中国大陆均无法直接访问，需要翻墙工具。另外，X Premium的订阅也需要国际支付方式。对中国用户来说，Grok的使用门槛较高。建议选择国产AI工具（DeepSeek、文心一言等）作为替代，它们在中文场景下的表现更出色。' },
      { question: 'Grok有哪些定价方案？订阅X Premium值得吗？', answer: 'Grok随X Premium方案提供：基本版$8/月（更多Grok额度+蓝色认证+编辑功能）、Premium+版$16/月（无限Grok使用+最大可见度+优先支持）。如果你已经是X平台的重度用户（每天刷X、发推互动），$8/月获得Grok+蓝V认证的综合性价比很高。如果只是偶尔用AI，建议先用免费版。' }
    ]
  }),

  enhanceTool({ id: 'elevenlabs', name: 'ElevenLabs', logo: '🎙️', description: '领先的AI语音生成平台，支持情感语音合成、声音克隆和多语言TTS', url: 'https://elevenlabs.io', price: 'freemium', difficulty: 'beginner', heat: 58, heatGrowth: 30, tags: ['AI语音', '语音合成', '音频工具'], techTags: ['AudioAI', 'GenerativeMedia'], sceneTags: ['内容创作', '短视频'], costTags: ['Freemium', '需翻墙'], category: '音频生成', prompts: [{ id: 'p1', title: '视频旁白配音', content: 'Generate a professional voiceover for this script with [tone] tone:\\n[Script text]\\nRequirements: clear pronunciation, natural pauses, engaging delivery', scene: '内容创作' }, { id: 'p2', title: '多语言有声书', content: 'Convert this text to speech in [language] with [voice_style] style:\\n[Text content]\\n- Natural intonation\\n- Appropriate pacing\\n- Emotional expression matching the content', scene: '内容创作' }], tips: ['声音质量业界领先，支持丰富的情绪表达', '支持声音克隆功能，可以创建自己的声音模型', '提供丰富的预设声音库，覆盖多种语言和口音', '支持长文本生成，适合有声书、播客等场景'], relatedSkills: [], xhsSaves: 650000,
    features: ['情感语音合成：业内最逼真的AI语音，支持愤怒、悲伤、兴奋、惊讶等多种情绪表达', '声音克隆（VoiceLab）：上传30秒音频样本，即可克隆任意人的声音，保留音色和语调特征', '多语言TTS：支持29种语言和50+口音，跨语言语音合成质量业界领先', '预设声音库：提供数百个高质量的预设声音，覆盖不同年龄、性别和风格', '长文本生成：支持超长文本的语音转换，适合有声书、播客和课程配音', 'AI音效生成：Text to Sound Effects功能，从文字描述生成音效和氛围音', '语音转语音（Voice Conversion）：在保留原语音内容的同时改变音色和风格', 'API和SDK：提供REST API和多种编程语言SDK，方便集成到应用中'],
    pricing: 'ElevenLabs采用Freemium模式。免费版：每月10000字符额度，基础语音质量，标准声音库访问。Starter版$5/月：30000字符，高清语音质量，声音克隆基础功能。Creator版$22/月：100000字符，超高音质，专业声音克隆，商业授权。Pro版$99/月：500000字符，无限声音克隆，优先队列。按字符计费，长文本生成消耗较快。需翻墙使用。',
    pros: ['语音合成质量业界第一：情感表达自然度远超Google TTS和Amazon Polly', '声音克隆效果惊艳：只需30秒音频样本，即可克隆出高拟真度的声音', '支持超长文本：可生成数小时的有声书内容，且质量保持稳定', 'API生态成熟：文档完善，集成简单，被大量第三方应用集成使用'],
    cons: ['免费额度极少：每月10000字符（约1500字中文），仅够简单体验', '需翻墙使用：对中国用户存在网络和支付门槛', '中文语音质量不如英文：中文语音合成的自然度低于英文', '套餐按字符计费复杂：不同套餐的字符单价不同，用量规划较麻烦'],
    targetAudience: ['有声书创作者：需要将文字转化为有声书的作者和出版社', '视频内容创作者：需要高质量旁白配音的YouTube/抖音创作者', '播客制作者：需要AI配音或声音克隆的播客主持人', '游戏开发者：需要为游戏角色配音的独立游戏开发团队', '无障碍内容制作者：需要为视觉障碍用户生成语音内容的教育和公益机构'],
    useCases: ['有声书制作：上传整本书的文字内容，选择喜欢的AI声音，一键生成完整有声书', '视频旁白配音：输入视频脚本并指定语调和风格，生成自然流畅的旁白配音', '声音克隆个人化：录制30秒自己的声音，克隆后用于生成自己声音的配音内容', '多语言课程制作：将中文课程内容通过不同语言的声音播报，制作多语言版课程', 'AI语音助手开发：通过API集成ElevenLabs，为自己的应用添加自然语音交互能力'],
    faqs: [
      { question: 'ElevenLabs的免费版够用吗？', answer: '免费版每月10000字符额度（约合1500-2000个中文字符，英文约2000-3000词），仅够测试和简单体验。如果用于正式内容创作（如有声书、视频旁白），建议Starter版（$5/月，30000字符）起步。对于重度创作者，Creator版（$22/月，100000字符）性价比更高。字符消耗：中文约每字1字符，英文约每词2-3字符。' },
      { question: 'ElevenLabs的声音克隆怎么用？效果怎么样？', answer: '在ElevenLabs的VoiceLab功能中上传30秒-5分钟的干净音频（无背景噪音），AI即可学习声音特征并生成克隆声音。克隆效果非常逼真，包括音色、语调和说话习惯。需要注意：1)音频质量越高效果越好 2)建议上传不同语调和情感的样本 3)克隆的声音可以商用（Creator版以上）。ElevenLabs的声音克隆是目前市场上效果最好的。' },
      { question: 'ElevenLabs支持中文吗？中文效果如何？', answer: '支持中文（普通话）语音合成，有多个中文声音预设可选。中文语音质量在AI TTS工具中属于领先水平，发音清晰、自然度好。但中文语音的情感表达和语调变化不如英文版本丰富。如果需要制作中文有声书或配音，ElevenLabs是海外工具中中文支持最好的选择之一。国产替代：讯飞语音合成的中文效果更好。' },
      { question: 'ElevenLabs生成的语音可以商用吗？需要额外授权吗？', answer: 'Creator版及以上套餐（$22/月）生成的语音可以商用，包括YouTube视频、播客、有声书、广告等。免费版和Starter版生成的语音商用受限。声音克隆的版权问题：克隆他人声音需要获得授权，ElevenLabs建议用户自行确保不侵犯他人声音权益。建议商用前阅读最新的使用条款。' }
    ]
  }),

  enhanceTool({ id: 'comfyui', name: 'ComfyUI', logo: '🔌', description: '基于节点的Stable Diffusion工作流界面，实现精确的AI图像生成控制', url: 'https://github.com/comfyanonymous/ComfyUI', price: 'free', difficulty: 'advanced', heat: 55, heatGrowth: 28, tags: ['AI绘画', '工作流', '图像生成'], techTags: ['Diffusion', 'GenerativeMedia', 'OpenSource'], sceneTags: ['设计创作'], costTags: ['Free', '中文友好'], category: '图像生成', prompts: [{ id: 'p1', title: '精确控制图像生成', content: 'Design a ComfyUI workflow for generating [image_description] with:\\n1. Positive prompt: [detailed prompt]\\n2. Negative prompt: [undesired elements]\\n3. ControlNet for pose/structure guidance\\n4. Step-by-step node connections', scene: '设计创作' }, { id: 'p2', title: '批量图像处理', content: 'Create a ComfyUI batch processing workflow for:\\n1. Input: [folder_path] containing source images\\n2. Process: [upscale/inpainting/style_transfer]\\n3. Output settings: [resolution, format]\\n4. Queue management for batch execution', scene: '设计创作' }], tips: ['节点式工作流可实现高度自定义的图像生成流程', '支持ControlNet、LoRA、IP-Adapter等主流扩展', '社区贡献了大量高质量的现成工作流可复用', '本地部署完全免费，适合批量生产和精细控制'], relatedSkills: ['skill_batch_image'], xhsSaves: 580000,
    features: ['节点式工作流引擎：基于节点的可视化工作流系统，每个节点代表一个处理步骤，流程完全可视可编辑', 'Stable Diffusion全模型支持：支持SD 1.5、SDXL、SD 3.5、Flux等所有主流SD模型和变体', 'ControlNet精准控制：通过姿态、深度、边缘、线稿等ControlNet模型精确控制生成内容', 'LoRA加载与融合：支持多LoRA模型同时加载和权重融合，实现个性化风格控制', '批量处理引擎：支持批量图像的自动生成和处理，适合大规模内容生产', '视频帧序列处理：支持视频帧到帧的稳定处理和风格迁移', '自定义节点生态：社区贡献了数千个自定义节点，扩展功能无限', '本地部署完全免费：开源软件，离线可用，数据完全自主可控'],
    pricing: 'ComfyUI完全免费开源，MIT许可证。无需支付任何费用即可使用全部功能：节点式工作流、所有SD模型支持、ControlNet、LoRA、批量处理等。运行成本仅为硬件成本（GPU显存建议8GB以上）。可以使用云端GPU服务（如RunPod、vast.ai）按需租用GPU运行ComfyUI，成本约$0.3-1/小时。相比Midjourney（$10-60/月），ComfyUI无订阅费但需要一定的技术基础和硬件投入。',
    pros: ['开源免费零成本：完全免费使用，无订阅费和隐藏收费', '控制精度极高：节点式工作流可精细控制每个生成环节，专业用户的终极工具', '可扩展性强：自定义节点生态丰富，几乎可以实现任何图像生成和处理流程', '本地部署保障隐私：数据处理在本地完成，无需上传图片到云端'],
    cons: ['学习曲线陡峭：节点式工作流上手难度大，需要理解深度学习和SD基础知识', '需要高性能GPU：至少8GB显存，推荐16GB以上，硬件成本高', '无官方技术支持：开源社区维护，遇到问题主要靠社区和文档解决', 'DIY程度高：安装配置、模型下载、工作流搭建都需要手动完成'],
    targetAudience: ['专业AI绘画师：需要对图像生成进行精细控制的设计师和艺术家', 'Stable Diffusion进阶用户：已经不满足于WebUI，追求更精确控制的高级用户', '批量内容生产者：需要大批量、自动化生成和处理图像的内容团队', 'AI技术研究者：研究和实验不同模型和参数组合的技术研究人员', '开源爱好者：偏好开源软件、注重数据隐私和自主可控的技术用户'],
    useCases: ['高质量批量出图：搭建批量生成工作流，设置多组提示词和参数后自动输出大量作品', '精准角色形象控制：利用ControlNet+LoRA组合，精确控制角色姿态、表情和风格', '视频风格化处理：将实拍视频通过帧序列处理转换为动漫/油画等风格', '产品图自动化生产：搭建产品场景图工作流，批量生成风格一致的产品展示图', 'AI模型效果对比：搭建并行工作流同时用不同模型生成图像，对比效果差异'],
    faqs: [
      { question: 'ComfyUI和Stable Diffusion WebUI（Automatic1111）有什么区别？', answer: 'ComfyUI是基于节点的可视化工作流界面，WebUI是传统按钮式界面。核心区别：1)ComfyUI控制精度更高，每个处理步骤可见可调 2)ComfyUI更适合复杂工作流和批量处理 3)ComfyUI资源消耗更少，生成速度更快 4)WebUI上手更容易，适合新手。建议：新手先学WebUI，追求精细控制后转ComfyUI。两者使用相同的底层模型。' },
      { question: 'ComfyUI需要什么硬件配置？', answer: '最低配置：8GB显存GPU（NVIDIA GTX 1080 Ti以上）、16GB内存、50GB硬盘空间。推荐配置：16GB+显存GPU（RTX 4090）、32GB内存、200GB+ SSD。纯CPU运行速度极慢，不建议。如果没有高端显卡，可以使用云GPU服务（RunPod、AutoDL等）按需租用，价格$0.3-2/小时。Flux等新模型对显存要求更高。' },
      { question: 'ComfyUI在哪里下载？怎么安装？', answer: '从GitHub下载（github.com/comfyanonymous/ComfyUI），支持Windows（一键安装包）、macOS和Linux。安装步骤：1)下载安装包或git clone 2)安装Python依赖 3)下载Stable Diffusion模型放到models目录 4)启动后浏览器访问localhost:8188。Windows用户推荐使用整合包（B站秋叶等作者的整合版本），降低安装门槛。' },
      { question: 'ComfyUI的中文社区资源丰富吗？', answer: 'ComfyUI的中文社区较为活跃。B站上有大量ComfyUI教程（搜索"ComfyUI教程"），秋叶、AI绘画实验室等UP主有完整的从入门到精通的系列教程。中文社区主要活跃在：B站、知乎、小红书、QQ群。建议新手先看B站教程搭建第一个工作流，再根据需要扩展。GitHub和Reddit是主要的英文社区。' }
    ]
  }),



  enhanceTool({ id: 'openclaw', name: 'OpenClaw', logo: '🐱', description: '开源个人AI助手，GitHub 36.5万星，集聊天、搜索、文件管理、代码执行于一体的全能AI平台', url: 'https://github.com/openclaw/openclaw', price: 'free', difficulty: 'intermediate', heat: 85, heatGrowth: 65, tags: ['AI助手', '开源', '个人AI'], techTags: ['Agent', 'GenerativeAI', 'OpenSource'], sceneTags: ['编程开发', '办公提效'], costTags: ['Free', '中文友好'], category: '编程开发', prompts: [{ id: 'p1', title: '个人AI助手搭建', content: '帮我用OpenClaw搭建一个个人AI助手，包含：1.基础聊天功能 2.文件管理 3.代码执行环境 4.搜索能力', scene: '编程开发' }, { id: 'p2', title: 'OpenClaw插件开发', content: '为OpenClaw开发一个[功能描述]插件，要求：1.遵循OpenClaw插件规范 2.提供配置项 3.包含使用示例', scene: '编程开发' }], tips: ['GitHub 36.5万星，社区活跃度极高', '支持插件系统可无限扩展功能', '本地部署完全免费，数据自主可控', '支持集成多种LLM后端', '可作为个人知识库和自动化助手'], relatedSkills: ['skill_agent_builder', 'skill_vibe_coding'], xhsSaves: 350000,
    features: ['多模态AI聊天：支持文本、图片、文件等多种输入方式的AI对话', 'RAG知识库系统：上传文档自动构建个人知识库，基于专属知识回答问题', '文件管理系统：内置文件浏览和编辑功能，支持多种格式文件的读写操作', '代码执行沙箱：安全沙箱环境中运行Python、JavaScript等代码，支持包安装', '联网搜索集成：AI可自动搜索互联网获取最新信息，实时获取数据', '插件系统：通过插件无限扩展功能，社区已贡献数百个高质量插件', '多LLM后端支持：可接入OpenAI、Claude、DeepSeek等多种模型', '本地部署：完全本地运行，数据不出设备，隐私安全有保障'],
    pricing: 'OpenClaw完全免费开源，MIT许可证。无需支付任何费用即可使用全部功能：AI聊天、知识库、文件管理、代码执行等。运行成本仅为API费用（调用外部LLM）或本地推理的硬件成本（需要16GB+显存GPU运行本地模型）。如果使用OpenAI/Claude API，月费约$5-20（取决于使用量）。自托管模式可完全免费（使用开源模型本地推理）。远超ChatGPT Plus（$20/月）的性价比。',
    pros: ['开源免费：MIT许可证，完全免费自托管，无订阅费无限制', '功能全面：集聊天、搜索、文件、代码于一体，是个人AI工作站', '隐私安全：本地部署数据完全自主可控，不上传任何私密数据', '插件生态活跃：GitHub 36.5万星，社区贡献了大量实用插件'],
    cons: ['部署门槛较高：需要一定的技术基础进行安装配置和维护', '本地运行需要GPU：运行本地模型需要16GB+显存，硬件投入大', '云API依赖：使用外部模型API时需要稳定网络连接和API密钥配置', '中文社区资源较少：核心文档和社区以英文为主，中文教程有限'],
    targetAudience: ['AI技术极客：喜欢自部署、自托管AI工具的技术爱好者', '隐私敏感用户：对数据隐私要求高、不希望数据上传云端的企业和个人', '独立开发者：需要个人AI助手辅助编程和项目管理的开发者', 'AI研究爱好者：希望探索和实验不同AI模型能力的发烧友', '中小企业：需要内部部署AI助手但预算有限的创业公司'],
    useCases: ['个人知识库搭建：上传工作文档和笔记，构建个人专属AI知识库，随时提问查询', '本地AI编程助手：接入DeepSeek/Claude API，在本地环境获得安全的AI编程辅助', '自动化工作流：编写插件自动化日常任务（邮件整理、文件分类、数据抓取等', '私密文档分析：将敏感合同或财报上传到本地OpenClaw分析，数据不出本地', '多模型对比平台：同时配置多个LLM后端，在同一对话中对比不同模型的回答'],
    faqs: [
      { question: 'OpenClaw和ChatGPT有什么区别？', answer: 'OpenClaw是开源的自托管AI平台，ChatGPT是云服务。核心区别：1)OpenClaw可以本地部署，数据不出设备；ChatGPT数据在OpenAI服务器 2)OpenClaw完全免费；ChatGPT Plus $20/月 3)OpenClaw需要技术基础部署维护；ChatGPT开箱即用 4)OpenClaw支持多种模型后端；ChatGPT只能用OpenAI模型。如果你重视隐私和技术可控，OpenClaw是更好的选择。' },
      { question: 'OpenClaw部署需要什么配置？', answer: '完整部署需要：服务器（Linux推荐）或Windows/Mac，至少4GB内存，20GB硬盘。如果使用云端API（如OpenAI），无需GPU。如果本地运行模型，推荐16GB+显存GPU。部署步骤：1)安装Docker或Python环境 2)从GitHub克隆仓库 3)配置LLM API密钥 4)启动服务。新手推荐使用Docker一键部署方案，官方文档有详细步骤。' },
      { question: 'OpenClaw支持哪些模型？可以接入国产模型吗？', answer: 'OpenClaw支持几乎所有主流LLM的API接入：OpenAI GPT系列、Anthropic Claude系列、DeepSeek、通义千问、文心一言、智谱GLM等。通过在配置文件中设置API endpoint和密钥即可接入。建议：日常使用GPT-4o或Claude 3.5（效果好），预算有限用DeepSeek（免费）。国产模型可通过其API兼容OpenAI格式接入。' },
      { question: 'OpenClaw的插件系统能做什么？', answer: '插件系统是OpenClaw的核心扩展能力。已有插件：1)网络搜索插件（Google/Bing搜索）2)代码执行插件（Python沙箱）3)文档处理插件（PDF/Word分析）4)数据库查询插件（SQL执行）5)自动化脚本插件（定时任务）。你还可以用Python开发自己的插件，官方SDK让开发过程简单。插件让OpenClaw从一个聊天工具变成一个AI自动化平台。' }
    ]
  }),


  enhanceTool({ id: 'mcp_server', name: 'MCP Server', logo: '🔌', description: 'Model Context Protocol (MCP) — 为AI应用构建专用服务器，连接外部工具和数据源的新标准协议', url: 'https://modelcontextprotocol.io', price: 'free', difficulty: 'intermediate', heat: 82, heatGrowth: 58, tags: ['AI协议', '开发工具', 'API'], techTags: ['Agent', 'API', 'Protocol'], sceneTags: ['编程开发', '企业AI自动化'], costTags: ['Free', '中文友好'], category: '编程开发', prompts: [{ id: 'p1', title: '搭建MCP Server', content: '请帮助我为一个[你的App/服务]搭建MCP Server，包含：1.定义资源和工具 2.实现MCP协议接口 3.连接认证 4.部署文档', scene: '编程开发' }, { id: 'p2', title: 'MCP客户端接入', content: '请编写代码接入MCP Server的[服务名称]，使用TypeScript/Python，包含：1.客户端初始化 2.工具调用 3.错误处理 4.示例代码', scene: '编程开发' }], tips: ['MCP是AI应用连接外部工具和数据的新标准', '为你的App构建MCP Server已成为新潮流', 'Anthropic提出的Managed Agents架构与MCP天然互补', '支持多种编程语言（Python/TypeScript/Go等）', '让你的AI工具和App之间实现标准化通信'], relatedSkills: ['skill_agent_builder', 'skill_api_doc'], xhsSaves: 280000,
    features: ['标准化协议定义：MCP定义了AI应用与外部工具/数据源之间的标准通信协议和接口规范', '资源访问抽象：通过Resource概念统一暴露文件、数据库、API等外部数据源', '工具调用接口：定义标准化的Tool接口，AI可调用任意外部工具并获取结果', 'Prompt模板：支持在Server端定义Prompt模板，复用复杂的提示词策略', '多语言SDK：提供Python、TypeScript、Java、Go等多种语言的SDK支持', '安全认证：内置OAuth、API Key等多种认证方式，保障通信安全', '流式传输：支持SSE（Server-Sent Events）实现实时数据流推送', 'Anthropic原生支持：Claude Desktop原生支持MCP协议，生态集成度最高'],
    pricing: 'MCP完全免费开源，MIT许可证。无需支付任何费用即可实现和使用MCP Server/Client。协议本身是开放的，不涉及任何授权费用。运行成本仅为部署MCP Server的服务费用（如云服务器费用$5-50/月）。如果你使用Claude Desktop配合MCP，需要Claude Pro订阅（$20/月）。MCP协议由Anthropic提出并开源，旨在成为AI应用连接外部工具的事实标准。',
    pros: ['开放标准协议：不锁定任何厂商，任何人都可以基于MCP构建自己的Server和Client', '降低AI集成门槛：标准化的接口定义让AI工具集成变得简单高效', 'Anthropic生态加持：Claude Desktop原生支持，Anthropic全力推动生态建设', '安全性好：标准化的认证和权限机制，保障AI工具调用的安全性'],
    cons: ['仍处于早期阶段：协议规范还在快速迭代中，不够成熟稳定', '生态尚不丰富：MCP Server的数量和质量还在快速增长过程中', '主要适配Claude：目前对Claude外的AI客户端支持有限', '学习成本：理解协议设计和实现Server需要一定的技术基础'],
    targetAudience: ['AI应用开发者：需要将AI能力连接到外部工具和数据的后端开发者', '企业AI架构师：规划企业AI基础设施，需要标准化工具集成方案的技术负责人', 'SaaS产品开发者：希望让自己的产品通过MCP被AI调用的产品团队', '开源社区贡献者：对AI协议标准感兴趣的开源技术爱好者', 'Claude深度用户：希望扩展Claude能力，连接私有数据和服务的高级用户'],
    useCases: ['数据库AI查询：构建MCP Server连接PostgreSQL/MySQL，AI直接通过自然语言查询数据库', '文件系统AI访问：构建文件系统MCP Server，AI可直接读取和编辑本地或云端文件', 'API网关集成：将内部API封装为MCP Server，AI可调用企业级内部服务', '代码仓库AI操作：构建GitHub/GitLab MCP Server，AI可直接操作仓库，创建PR和Issue', '知识库AI检索：将企业内部知识库封装为MCP Resource，AI基于私有知识回答'],
    faqs: [
      { question: 'MCP是什么？和普通的API有什么区别？', answer: 'MCP（Model Context Protocol）是专门为AI应用设计的协议标准。与普通API的核心区别：1)MCP是AI-native的，接口设计考虑AI的理解和调用模式 2)MCP定义了Resources、Tools、Prompts三层抽象 3)MCP支持SSE流式传输，适合AI实时交互 4)普通API需要手动写代码调用，MCP可以让AI自主调用。可以把MCP理解成AI界的USB接口——标准化了设备和主机的连接方式。' },
      { question: 'MCP Server怎么搭建？需要什么技术？', answer: '搭建一个基础的MCP Server技术门槛不高。使用官方Python SDK或TypeScript SDK，100行代码内即可搭建一个简单的MCP Server。步骤：1)安装MCP SDK 2)定义想要暴露的Tools和Resources 3)实现处理逻辑 4)启动Server（支持stdio和SSE两种传输方式）。推荐从Python SDK开始，文档完善且示例多。官方文档modelcontextprotocol.io有完整的入门教程。' },
      { question: 'MCP和Function Calling有什么区别？', answer: '两者解决的问题类似但不同：1)Function Calling是模型层的能力（模型输出JSON调用格式），MCP是应用层协议 2)Function Calling需要每个应用自己实现函数定义和调用机制，MCP提供了标准化的框架 3)MCP的Resources概念是Function Calling没有的 4)MCP在Claude生态中原生支持，Function Calling在OpenAI生态中原生支持。未来两者可能融合，目前各有各的生态。' },
      { question: 'MCP Server可以和哪些AI客户端配合使用？', answer: '当前原生支持MCP的主要是Claude Desktop（Anthropic官方客户端）。其他客户端支持：1)通过MCP Client SDK（Python/TS）自己开发客户端 2)部分开源项目（如OpenClaw）已开始集成MCP 3)社区正在开发VS Code MCP扩展 4)Zed编辑器已内置MCP支持。Claude Desktop是体验MCP最好的客户端，配置方法在官方文档有详细说明。' }
    ]
  }),


  // ===== 新增工具：AI对话类 =====
  { id: 'poe', name: 'Poe', logo: '🦉', description: 'Quora推出的多模型聚合AI聊天平台，一站式使用ChatGPT、Claude、DeepSeek等顶级模型，支持自定义AI Bot创建', url: 'https://poe.com', price: 'freemium', difficulty: 'beginner', heat: 60, heatGrowth: 18, tags: ['AI对话', '多模型', '聊天平台'], techTags: ['NLP', 'GenerativeAI'], sceneTags: ['办公提效', '内容创作', '编程开发'], costTags: ['Freemium', '需翻墙'], category: 'AI对话', prompts: [{ id: 'p1', title: '多模型对比问答', content: '请同时用GPT-4和Claude 3.5回答这个问题，并对比两者的回答差异：[你的问题]', scene: '办公提效' }, { id: 'p2', title: '自定义Bot创建', content: '帮我创建一个专门做[领域]的AI Bot，设定角色、回复风格和专业领域知识', scene: '编程开发' }], tips: ['免费用户每天有一定消息额度', '支持创建和分享自定义Bot', '可在一个对话中同时调用多个模型进行对比', '订阅Poe会员可无限使用所有模型'], relatedSkills: [],
    features: [
      '多模型聚合平台：一站式访问ChatGPT、Claude、DeepSeek、Gemini等十多个顶级AI模型',
      '多模型对比：在同一对话中同时调用多个模型，并列展示不同AI的回答进行对比',
      '自定义Bot创建：零代码创建个性化AI Bot，设定角色、指令和知识库',
      'Bot市场：浏览和使用其他用户创建的数万个优质Bot，覆盖各种场景',
      '文件上传分析：支持上传PDF、Word、Excel等文件，让AI分析和总结',
      '持续对话记忆：AI记住对话上下文，支持长时间深入讨论和追问',
      'Web搜索集成：AI可实时搜索互联网获取最新信息回答问题',
      '订阅制无限使用：付费后无限制使用所有模型，无需担心额度'
    ],
    pricing: 'Poe采用Freemium模式。免费版：每天3000积分（约30-50次基础对话），可访问GPT-3.5、Claude Instant等基础模型。订阅版$19.99/月（约¥145/月）：无限消息，访问GPT-4、Claude 3.5 Sonnet等高级模型，无限Bot创建，优先响应。年付$199.99/年（约¥1450/年）享约17%折扣。相比单独订阅ChatGPT Plus（$20/月）和Claude Pro（$20/月），Poe订阅性价比极高。需翻墙使用。',
    pros: ['多模型一站式访问：一个订阅即可使用ChatGPT、Claude等所有主流模型，无需分别订阅', '多模型对比功能独特：同时看多个模型对同一问题的回答，互相补充', 'Bot市场生态丰富：数万个用户创建的优质Bot可直接使用，覆盖编程/写作/学习等场景', '订阅性价比高：$19.99/月无限使用所有高级模型，比单独订阅省钱'],
    cons: ['免费额度有限：每天3000积分，重度使用必须付费订阅', '需翻墙使用：对中国用户网络不友好，需要代理工具', '模型版本更新偶有滞后：新模型发布后在Poe上更新不如官方快', '国内用户支付困难：美元订阅需要国际支付方式，对国内用户不友好'],
    targetAudience: ['多模型对比用户：需要对比ChatGPT和Claude等模型回答差异的研究者', 'AI技术爱好者：喜欢尝试和对比不同AI模型的发烧友', '轻度AI用户：不想分别订阅多个AI但希望偶尔使用不同模型的用户', 'Bot创建者：想创建和分享自定义AI Bot的内容创作者', '预算有限的AI用户：希望以较低成本同时使用多个高级模型的个人用户'],
    useCases: ['多模型方案对比：输入一个商业问题，同时让GPT-4和Claude 3.5给出方案并对比差异', '跨模型写作辅助：先用Claude构思文章框架，再用GPT-4润色完善内容', '自定义客服Bot：创建一个专用于回答产品问题的客服Bot，设定语气和知识范围', '编程问题多角度解决：让不同模型分别给出编程解决方案，选择最优方案', 'AI能力横向评测：用同一组问题测试不同模型的回答质量和风格差异'],
    faqs: [
      { question: 'Poe免费版每天能用多少次？', answer: '免费版每天3000积分。每次对话消耗的积分取决于使用的模型：GPT-3.5约50-100积分/次，GPT-4约300-500积分/次，Claude 3.5约200-400积分/次。简单估算：如果用基础模型每天约30-60次对话，如果用GPT-4每天约6-10次。建议把高级模型用在重要提问上，日常问答用基础模型节省额度。' },
      { question: 'Poe和ChatGPT Plus哪个更划算？', answer: 'ChatGPT Plus（$20/月）只能使用OpenAI的模型，Poe（$19.99/月）可以使用ChatGPT、Claude、DeepSeek等几乎所有主流模型。如果你只喜欢ChatGPT，选Plus即可；如果你希望灵活使用多个模型（比如用Claude写代码、用GPT-4写作），Poe的性价比远超单独订阅。注意：Poe上的GPT-4版本可能比ChatGPT官方略慢更新。' },
      { question: 'Poe在中国能用吗？需要翻墙吗？', answer: 'Poe在中国大陆无法直接访问，需要翻墙工具。网页版poe.com和App均被屏蔽。推荐使用稳定的VPN或代理工具访问。另外，Poe的订阅支付需要Visa/Mastercard国际信用卡，国内银行卡无法直接支付，可使用虚拟信用卡或通过App Store/Google Play订阅。' },
      { question: 'Poe的自定义Bot怎么创建？有什么用处？', answer: '在Poe左侧点击\\\"创建Bot\\\"，输入Bot名称、描述和系统提示词即可。创建后用分享链接发给其他人使用。用途：1)创建专用于翻译的Bot（设定翻译规则和风格）2)创建编程助手Bot（指定技术栈和编码规范）3)创建写作助手Bot（设定文章风格和格式）。Bot创建零门槛，完全不需要编程。' }
    ]
  },
  { id: 'coze', name: 'Coze', logo: '🧩', description: '字节跳动推出的零代码AI Bot构建平台，支持创建、部署和变现AI智能体，中文友好且功能强大的GPTs替代方案', url: 'https://www.coze.com', price: 'free', difficulty: 'beginner', heat: 58, heatGrowth: 42, tags: ['AI对话', '智能体', 'Bot构建'], techTags: ['Agent', 'GenerativeAI', 'RAG'], sceneTags: ['编程开发', '企业AI自动化', '办公提效'], costTags: ['Free', '中文友好'], category: 'AI对话', prompts: [{ id: 'p1', title: '客服Bot创建', content: '帮我创建一个在线客服Bot，能够解答[产品名称]的常见问题，支持多轮对话和转人工', scene: '企业AI自动化' }, { id: 'p2', title: '知识库问答Bot', content: '基于以下知识库文档创建一个问答Bot，能够准确回答相关知识问题：[知识库内容]', scene: '办公提效' }], tips: ['零代码即可创建AI应用，无需编程基础', '支持发布到飞书、微信、抖音等平台', '内置知识库、插件、工作流等丰富组件', '中国版coze.cn和国际版coze.com功能有所不同'], relatedSkills: ['skill_agent_builder'],
    features: [
      '零代码Bot构建：拖拽式界面创建AI智能体，无需任何编程基础',
      '内置知识库系统：上传文档自动构建RAG知识库，让Bot基于专属知识回答问题',
      '插件生态丰富：内置搜索、绘图、数据处理等插件，一键为Bot扩展能力',
      '工作流自动化：支持可视化工作流设计，串联多个AI和API实现复杂任务',
      '多平台发布：一键发布到飞书、微信、抖音、Web等多渠道',
      'Bot变现模式：创建的Bot可通过付费订阅实现商业化变现',
      '人设回复优化：精细控制Bot的语气、风格和专业领域知识',
      '数据分析和反馈：提供Bot使用数据分析，帮助优化回复质量'
    ],
    pricing: 'Coze完全免费使用（coze.cn中国版和coze.com国际版均免费）。免费创建无限数量的Bot，知识库存储空间约1GB，插件和工作流功能全部开放。国际版某些高级功能（如更大量API调用）有额度限制。中国版coze.cn无需翻墙，直接注册即可使用。字节跳动目前通过免费策略快速占领AI Bot构建市场，未来可能推出企业版付费套餐。对于个人和小团队，免费版功能已经非常充足。',
    pros: ['完全免费：Bot创建、知识库、插件、工作流全部免费使用', '国产中文友好：全中文界面，无需翻墙，中国版coze.cn体验流畅', '发布渠道多：一键发布到微信、飞书、抖音等国内主流平台', '零门槛上手：无需编程，通过拖拽和配置即可创建专业AI Bot'],
    cons: ['高级功能封装过深：复杂工作流和API调用的配置选项不如专业开发平台灵活', 'Bot智能水平依赖底层模型：Coze本身不提供顶级大模型，Bot能力受限于调用的模型', '知识库容量有限：免费版知识库存储空间约1GB，大量文档需升级', '国际版与中国版不互通：两个版本的数据和Bot无法互相迁移'],
    targetAudience: ['企业客服负责人：需要快速搭建AI客服机器人的企业运营人员', '零代码爱好者：希望通过配置而非编程创建AI应用的产品经理和运营', '自媒体运营者：想在微信公众号/抖音上部署AI互动功能的创作者', '中小企业主：需要部署AI助手但缺乏技术团队的创业公司', 'AI产品经理：需要快速原型验证AI Bot产品概念的产品经理'],
    useCases: ['企业智能客服：上传产品FAQ文档，创建自动回答客户问题的客服Bot，减少人工客服压力', '微信社群AI助手：创建自动回答社群常见问题的Bot，部署到微信群提升运营效率', '知识库问答系统：上传内部知识文档，创建企业内部知识问答Bot，员工随时查询', '自动化内容助手：结合工作流，创建能搜索资料+生成文章+图片的写作助手Bot', 'AI面试官/评测：创建模拟面试或产品评测Bot，用于招聘和产品测试场景'],
    faqs: [
      { question: 'Coze和GPTs有什么区别？Coze的优势是什么？', answer: '核心区别：1)Coze免费，GPTs需要ChatGPT Plus订阅（$20/月）2)Coze支持发布到微信、飞书等国内平台，GPTs只能在ChatGPT内使用 3)Coze内置工作流和插件系统比GPTs的Action更强大 4)Coze有中国版（coze.cn）无需翻墙。5)Coze支持Bot变现，GPTs暂无此功能。如果面向国内用户或需要更多灵活性，Coze是更好的GPTs替代方案。' },
      { question: 'Coze中国版和国际版有什么区别？选哪个？', answer: '中国版coze.cn：使用国内服务器，无需翻墙，适合部署到微信/抖音等国内平台。国际版coze.com：需翻墙，支持发布到Telegram/Discord/Slack等海外平台，可访问GPT-4等海外模型。功能上，中国版集成了豆包模型，国际版可调用GPT-4/Claude等。建议：面向国内用户用中国版，面向海外用户用国际版。两个账号不互通。' },
      { question: 'Coze创建的Bot可以商用和变现吗？', answer: '可以。Coze提供Bot变现功能：1)将Bot发布到Bot商店设置付费订阅 2)用户通过订阅付费使用你的Bot 3)Coze会抽取一定比例的平台服务费。变现适合：专业领域的咨询Bot、行业专用的辅助工具Bot、教育培训类Bot。对于企业内部的Bot（不对外发布），完全免费使用，没有任何限制。' },
      { question: 'Coze创建复杂工作流需要编程吗？', answer: '不需要编程。Coze提供可视化工作流编辑器，通过拖拽节点即可串联多个步骤（如：用户输入→搜索知识库→调用API获取实时数据→AI生成回答→格式化输出）。支持条件分支、循环、变量等逻辑控制。但如果你需要自定义插件或调用特定API，需要编写简单的代码（提供JavaScript/Python支持）。纯配置场景完全零代码。' }
    ]
  },
  { id: 'zhipu_qingyan', name: '智谱清言', logo: '🔬', description: '清华系智谱AI推出的GLM-4大模型对话助手，国产大模型顶尖水平，综合能力逼近GPT-4', url: 'https://chatglm.cn', price: 'free', difficulty: 'beginner', heat: 62, heatGrowth: 28, tags: ['AI对话', '国产大模型', '中文AI'], techTags: ['NLP', 'GenerativeAI'], sceneTags: ['办公提效', '学术研究', '内容创作'], costTags: ['Free', '中文友好'], category: 'AI对话', prompts: [{ id: 'p1', title: '学术论文辅助', content: '请帮我梳理[研究领域]的最新研究进展，包含：核心论文、主要方法、关键结论和未来方向', scene: '学术研究' }, { id: 'p2', title: '代码理解与优化', content: '请分析以下代码的功能，并给出优化建议：[代码片段]', scene: '编程开发' }], tips: ['支持128K超长上下文', '具备多模态理解能力（图片+文字）', '免费使用，无需翻墙', 'API调用成本远低于GPT-4'], relatedSkills: [],
    features: [
      'GLM-4大模型：智谱AI自研的GLM-4大模型，综合能力在国产模型中名列前茅',
      '128K超长上下文：一次可处理约20万字的超长文本，支持整本书籍或长篇论文分析',
      '多模态理解：支持图片识别和理解，可分析图表、截图、手写内容等',
      '联网搜索：AI可实时联网获取最新信息，回答时效性问题',
      '文生图功能：支持AI绘画功能，根据文字描述生成图片',
      '智能体市场：提供丰富的AI智能体模板，覆盖办公、学习、编程等场景',
      'API调用服务：为企业提供GLM-4 API，价格远低于GPT-4',
      '全平台支持：提供Web、PC客户端、移动App等多端使用'
    ],
    pricing: '智谱清言完全免费使用。无需付费订阅即可使用GLM-4大模型、128K上下文、多模态理解、联网搜索等全部功能。免费用户对话次数无上限。API调用价格：GLM-4约¥0.01/千tokens（输入）和¥0.01/千tokens（输出），约为GPT-4价格的1/50。作为国产大模型中综合能力最强的免费产品之一，智谱清言的性价比极高。无需翻墙，手机号注册即可使用。',
    pros: ['国产大模型顶尖水平：GLM-4综合能力在国产模型中排名前三，接近GPT-4水平', '完全免费使用：所有功能免费，无需订阅，对话次数无上限', '128K超长上下文：可一次处理20万字内容，远超GPT-4的32K和Claude的100K', '中文能力出色：对中文的理解和生成质量优于GPT-4等海外模型'],
    cons: ['英文能力弱于GPT-4：在处理英文专业内容时，质量和准确性不如GPT-4', '代码能力中等：编程相关的理解和生成能力不如Claude和GPT-4', '多模态能力有限：图像理解和生成能力不如GPT-4V全面', '国际知名度低：英文社区资源和海外案例较少'],
    targetAudience: ['学术研究者：需要处理长篇论文和分析研究资料的学者和学生', '国产AI支持者：偏好国产大模型、希望避免翻墙的用户', '中文内容创作者：需要AI辅助中文写作、翻译和润色的创作者', '企业开发者：希望以低成本接入大模型API的企业技术团队', '学生群体：需要AI辅助学习、论文写作和知识理解的在校学生'],
    useCases: ['论文全文分析：上传整篇学术论文PDF，让GLM-4分析研究方法和核心结论', '超长文档总结：分析数十万字的行业报告或书籍，提炼核心观点和关键数据', '代码审查与优化：将代码片段粘贴给AI，获取功能分析和优化建议', '中文写作润色：输入文章草稿，AI进行语言润色、逻辑优化和格式调整', '学术翻译助手：将英文论文翻译为中文，保留专业术语准确性'],
    faqs: [
      { question: '智谱清言和ChatGPT相比怎么样？哪个更好用？', answer: '对于中文用户，智谱清言在中文理解、中文写作等方面的表现与GPT-4不相上下，在某些场景甚至更好。128K超长上下文是独有优势。差距在于：英文能力、代码生成、多模态能力（GPT-4V更强）和插件生态。如果是日常中文聊天、写作、文档分析，智谱清言完全胜任且免费；如果需要英文写作、复杂编程或多模态任务，GPT-4更优。' },
      { question: '智谱清言的128K上下文在实际使用中体验如何？', answer: '128K上下文支持一次性输入约20万汉字（相当于《三体》三部曲的1/3）。实测：上传50页PDF能完全记住和分析，100页以上的文档也能保留大部分细节。实际使用中，输入超长文档后AI的回复速度会变慢（约10-30秒），但理解准确率很高。对于需要处理长篇文档的研究者和学生，这是非常实用的功能。' },
      { question: '智谱清言支持API调用吗？价格如何？', answer: '支持。智谱开放平台（open.bigmodel.cn）提供GLM-4 API服务。价格约¥0.01/千tokens（输入输出同价），仅为GPT-4 API价格的约1/50。对于中小企业和个人开发者非常友好。提供Python SDK和HTTP API，支持流式输出。有免费调用额度，新手可先体验再付费。智谱API是国产大模型中性价比最高的选择之一。' },
      { question: '智谱清言需要翻墙吗？如何注册？', answer: '完全不需要翻墙。直接访问chatglm.cn，用中国大陆手机号注册即可使用。支持Web网页版、PC客户端（Windows/Mac）、iOS和Android App。对于国内用户来说，智谱清言是体验国产大模型最便捷的选择之一，注册流程简单，无需任何网络门槛。' }
    ]
  },
  { id: 'xunfei_xinghuo', name: '讯飞星火', logo: '🔥', description: '科大讯飞推出的AI助手，中文理解能力出色，深度集成讯飞语音技术，适合办公和教育场景', url: 'https://xinghuo.xfyun.cn', price: 'free', difficulty: 'beginner', heat: 59, heatGrowth: 22, tags: ['AI对话', '中文AI', '语音助手'], techTags: ['NLP', 'GenerativeAI', 'AudioAI'], sceneTags: ['办公提效', '内容创作', '教育学习'], costTags: ['Free', '中文友好'], category: 'AI对话', prompts: [{ id: 'p1', title: '演讲稿撰写', content: '请帮我写一篇关于[主题]的演讲稿，时长约5分钟，语言生动有力，适合公众演讲场合', scene: '内容创作' }, { id: 'p2', title: '语音转文字整理', content: '请将以下语音识别文本整理为结构化的会议纪要：[语音转文本内容]', scene: '办公提效' }], tips: ['语音识别和合成能力业界领先', '支持多模态（文字+图片+语音）交互', '免费使用，无需翻墙', '提供PC客户端和移动App'], relatedSkills: [],
    features: [
      '语音识别领先：科大讯飞深耕语音技术20+年，中文语音识别准确率超过98%',
      '语音合成自然：支持多种音色和风格的语音合成，发音自然流畅',
      '多模态交互：深度融合文字、语音、图像三种交互方式',
      'AI对话助手：基于星火大模型，支持多轮对话和复杂问题解答',
      '文档分析：支持上传PDF、Word、Excel等文档进行智能分析',
      '联网搜索：实时获取网络信息，回答最新提问',
      '教育场景优化：针对K12教育和职业培训场景深度优化',
      '全平台支持：提供Web、PC客户端、移动App和API接口'
    ],
    pricing: '讯飞星火完全免费使用。免费用户可以使用星火大模型对话、语音转文字、语音合成、文档分析等全部核心功能，对话次数无上限。API调用：星火大模型API按tokens计费，约¥0.005/千tokens，远低于GPT-4。讯飞语音API（语音识别/合成）按时长计费，价格从¥0.5/小时起。作为科大讯飞的战略产品，星火目前以免费策略获客，对企业用户提供付费增值服务。无需翻墙，手机号注册即可。',
    pros: ['语音技术全球领先：中文语音识别准确率98%+，语音合成自然度业界第一', '完全免费使用：对话、语音、文档分析等全部功能免费，无隐藏收费', '教育场景专业：针对K12和职业教育深度优化，适合学生和教师使用', '国产中文友好：无需翻墙，全中文界面，注册简单'],
    cons: ['大模型综合能力不如GPT-4：在复杂推理和创意写作上还有差距', '代码能力较弱：编程相关任务不如Claude和GPT-4', '多模态能力有限：图像理解功能不如GPT-4V和通义千问', '界面设计较复杂：功能入口多，新手需要一定学习成本'],
    targetAudience: ['学生和家长：需要AI辅助学习和作业辅导的K12学生及家长', '教师和教育工作者：需要AI辅助备课和教学材料制作的教师', '办公白领：需要语音转文字、会议记录等办公提效的职场人士', '中文内容创作者：需要AI辅助中文写作和语音配音的创作者', '国产AI偏好用户：希望使用国产AI工具、避免翻墙的用户'],
    useCases: ['会议语音转文字：将会议录音上传，AI自动转写为文字并整理会议纪要', '演讲稿撰写与配音：输入演讲主题，AI生成演讲稿并合成自然语音朗读', '英语口语练习：使用星火的语音交互功能，进行英语对话练习和发音纠正', '作文批改润色：上传学生作文，AI进行语法纠错、语言润色和评分建议', '文档摘要提炼：上传长篇文档，AI快速提取核心观点和关键数据'],
    faqs: [
      { question: '讯飞星火的语音识别准确率真的那么高吗？', answer: '是的，讯飞中文语音识别准确率超过98%，是行业公认的领先水平。实测：标准普通话录音几乎无错识别，带口音的普通话识别准确率也超过95%，支持粤语、四川话等方言。相比其他AI产品的语音输入，讯飞在中文语音识别上优势明显。不过英文语音识别准确率（约90%）不如中文，比Google和Azure略低。' },
      { question: '讯飞星火大模型和ChatGPT比差多少？', answer: '讯飞星火大模型在中文理解、中文写作、知识问答等场景表现不错，但与GPT-4相比存在明显差距：1)复杂推理能力较弱 2)编程能力不如GPT-4和Claude 3)创意写作的质量和多样性不足 4)多模态能力有限。但讯飞在语音交互方面是绝对的王者，这是ChatGPT不具备的能力。选星火还是ChatGPT取决于你的核心需求。' },
      { question: '讯飞星火支持API调用吗？价格如何？', answer: '支持。讯飞开放平台提供星火大模型API、语音识别API、语音合成API等。星火API约¥0.005/千tokens，语音识别约¥0.5/小时，语音合成约¥1/万字。对于需要语音相关能力的企业，讯飞API是国内性价比最高的选择。新用户有免费额度。相比海外产品（如OpenAI API需翻墙支付），讯飞API对国内企业更友好。' },
      { question: '讯飞星火有哪些教育相关的特色功能？', answer: '深度集成教育场景：1)作文批改功能：AI自动批改作文并给出评分和改进建议 2)口语评测：AI评估英语发音的准确度和流利度 3)题目讲解：拍照题目AI自动解答和讲解 4)教案生成：教师输入课题AI自动生成教案 5)知识点讲解：用语音交互方式讲解各科知识点。这些功能专门为K12教育优化，是其他AI产品不具备的特色。' }
    ]
  },

  // ===== 新增工具：图像生成类 =====
  { id: 'recraft', name: 'Recraft.ai', logo: '🎯', description: '专为设计师打造的AI图像生成和编辑工具，擅长矢量图、图标和3D图形生成，支持风格一致的设计输出', url: 'https://www.recraft.ai', price: 'freemium', difficulty: 'beginner', heat: 50, heatGrowth: 35, tags: ['AI绘画', '矢量图', '设计工具'], techTags: ['Diffusion', 'GenerativeMedia'], sceneTags: ['设计创作', '内容创作'], costTags: ['Freemium', '需翻墙'], category: '图像生成', prompts: [{ id: 'p1', title: '品牌Logo设计', content: 'Design a minimalist logo for [brand name], [industry], vector style, clean lines, professional', scene: '设计创作' }, { id: 'p2', title: '图标集生成', content: 'Create a set of flat icons for [theme], consistent style, 24x24 grid, vector format', scene: '设计创作' }], tips: ['支持生成SVG矢量格式，可直接用于设计软件', '风格一致性控制远超同类工具', '提供多种预设设计风格（扁平/3D/插画等）', '支持上传参考图进行风格迁移'], relatedSkills: ['skill_logo_design'],
    features: [
      '矢量图生成：生成SVG矢量格式，可直接在Illustrator/Figma中编辑和使用',
      '风格一致性控制：独有技术确保同一项目生成的图片风格高度一致',
      '多风格预设：提供扁平、3D、插画、像素风等多种预设设计风格',
      '品牌色控制：设定品牌色板后，所有生成图片自动使用统一配色',
      '背景移除：一键去除图片背景，支持透明PNG输出',
      'AI编辑功能：支持局部重绘、扩展画布、风格迁移等编辑功能',
      '高清输出：支持2K/4K分辨率输出，适合打印和商业使用',
      '团队协作：支持团队共享品牌风格和设计模板'
    ],
    pricing: 'Recraft采用Freemium模式。免费版：每月约50次生成额度，支持基础风格，标准分辨率，带Recraft水印。Pro版$20/月：无限生成，去水印，SVG/矢量导出，自定义品牌色板，高清输出。Business版$40/月：团队协作，品牌管理，优先支持。企业版自定义价格。免费版适合轻度尝试和体验，设计师建议Pro版起步。相比Midjourney（$10-60/月），Recraft在矢量图生成上有独特优势。需翻墙使用。',
    pros: ['矢量图生成独家功能：唯一能将AI生成的图像输出为SVG矢量格式的工具', '风格一致性控制出色：同一项目内多张图片风格统一，适合品牌设计', '品牌色板功能实用：设定品牌色后所有图片自动配色调调，设计师福音', '3D和插画风格质量高：生成3D渲染风格和插画风格的效果优于Midjourney'],
    cons: ['免费额度少：每月50次生成，重度使用必须付费', '真实感画质不如Midjourney：在照片级写实图像生成上还有差距', '需翻墙使用：对中国用户有网络门槛', '社区生态不如Midjourney成熟：模板和教程资源相对较少'],
    targetAudience: ['UI/UX设计师：需要生成矢量图标、插画和UI组件素材的设计师', '品牌设计师：需要保持品牌视觉一致性的品牌设计团队', '平面设计师：需要生成海报、宣传物料的设计从业人员', '产品经理：需要快速制作产品演示图和界面设计的非设计师', '社交媒体运营：需要制作风格一致的社交图片内容的运营人员'],
    useCases: ['品牌Logo设计：输入品牌名称和行业，生成多个矢量Logo方案供选择', '图标集生成：描述主题（如电商/金融/医疗），生成一套风格统一的图标集', '3D产品渲染：输入产品描述，生成3D风格的产品展示图用于电商详情页', '社媒封面制作：输入主题和品牌色，生成风格一致的公众号/Twitter封面图', 'UI界面插画：生成扁平风格的插画素材，用于App或网站的空状态页/欢迎页'],
    faqs: [
      { question: 'Recraft的矢量图生成是真的矢量图(SVG)吗？', answer: '是的。Recraft是唯一一款直接将AI生成图像输出为SVG矢量格式的主流AI绘画工具。生成的SVG文件可以在Adobe Illustrator、Figma、Inkscape等矢量编辑软件中直接打开和编辑，支持无限缩放不模糊。这对于设计师来说非常实用。不过要注意，生成的SVG路径可能较复杂，编辑时可能需要适当简化。' },
      { question: 'Recraft和Midjourney怎么选？', answer: '如果需要矢量图、品牌设计、风格一致的图标集→选Recraft。如果需要高质量写实图像、艺术照片、创意概念图→选Midjourney。很多设计师的工作流是：用Recraft生成矢量素材和品牌元素，用Midjourney生成背景和效果图。两个工具定位不同，可以互补使用。Recraft在品牌设计场景有明显优势。' },
      { question: 'Recraft免费版够用吗？', answer: '免费版每月约50次生成，适合尝鲜和小项目。如果你是设计师，建议Pro版（$20/月）：无限生成+去水印+SVG导出+品牌色板控制，这些功能对专业设计工作都很重要。如果只是偶尔用一下，免费版也可以，但水印比较影响展示效果。建议先体验免费版，确认适合你的工作流后再升级付费版。' },
      { question: 'Recraft需要翻墙吗？支持中文提示词吗？', answer: '需要翻墙访问recraft.ai。界面为英文，提示词建议用英文输入，对中文提示词的支持不如Midjourney好。推荐工作流：使用ChatGPT将中文需求翻译成英文Prompt，再粘贴到Recraft中生成。Recraft的优势在于矢量图输出和风格控制，Prompt翻译的成本相对较小。' }
    ]
  },
  { id: 'ideogram', name: 'Ideogram', logo: '🖌️', description: '文字渲染能力最强的AI图像生成工具，在图片中生成精准文字的独特优势使其成为海报和封面设计的首选', url: 'https://ideogram.ai', price: 'freemium', difficulty: 'beginner', heat: 52, heatGrowth: 30, tags: ['AI绘画', '文字渲染', '图像生成'], techTags: ['Diffusion', 'GenerativeMedia'], sceneTags: ['设计创作', '内容创作', '电商运营'], costTags: ['Freemium', '需翻墙'], category: '图像生成', prompts: [{ id: 'p1', title: '海报设计', content: 'Poster design for [event name], text: \\\"[main title]\\\", [style], eye-catching composition, professional typography', scene: '设计创作' }, { id: 'p2', title: '社交媒体封面图', content: 'Social media banner for [topic], include text: \\\"[headline]\\\", vibrant colors, modern design', scene: '内容创作' }], tips: ['文字渲染能力业内最强，适合海报和Banner设计', '支持Magic Prompt功能自动优化提示词', '免费用户每天有额度限制', '生成速度快，效果稳定'], relatedSkills: [],
    features: ['精准文字渲染：在图片中生成精准的文字内容，中英文准确率远超其他AI绘画工具', 'Magic Prompt自动优化：输入简单描述，AI自动扩展为高质量提示词', '多模板选择：支持Logo、海报、封面、社交媒体等多种设计模板', 'Remix变体生成：对已有图像进行风格或内容的变体生成', '高清输出：支持4K分辨率输出，适合打印和商业用途', 'Color Palette控制：生成前可指定配色方案，控制整体色调', '风格迁移：上传参考图并生成相似风格的图像', '快速成图：生成速度快，单次生成约5-10秒即可出图'],
    pricing: 'Ideogram采用Freemium模式。免费版：每天约10-20次生成额度，标准分辨率，带水印。Basic版$20/月：无限生成，去水印，高清输出。Pro版$40/月：无限生成+API访问+商业授权+优先队列。Startup版$80/月：团队协作+自定义模型+专属支持。免费版适合轻度尝鲜，创作需求建议Basic起步。相比Midjourney（$10-60/月），Ideogram价格偏高但文字渲染能力独一无二。',
    pros: ['文字渲染业界最强：图片中包含文字内容时，准确率远超Midjourney和DALL·E', 'Magic Prompt功能实用：自动优化提示词，降低使用门槛', '生成速度快：5-10秒出图，远快于Midjourney的30-60秒', '支持中英文文字：中文文字在图片中的渲染效果也相当好'],
    cons: ['整体画质不如Midjourney：在纯图像美学质量上还有差距', '免费额度少：每天10-20次，大量生成需要付费', '风格多样性有限：生成图像的风格变化不如Midjourney丰富', '需翻墙使用：对中国用户有网络门槛'],
    targetAudience: ['平面设计师：需要制作海报、Banner、社交媒体封面等含文字的设计', '电商运营者：需要制作促销海报、商品标题图等含文字宣传物料', '社交媒体运营：需要制作封面图、头图等品牌视觉素材', '市场营销人员：需要制作广告创意、宣传海报的市场团队', '内容创作者：需要制作文章封面图、视频封面的自媒体运营者'],
    useCases: ['活动海报设计：输入活动名称、时间地点和风格，生成带精准文字的海报设计', '社交媒体封面：描述主题和风格，生成带标题文字的Facebook/Twitter/公众号封面图', '电商促销Banner：输入促销信息和产品，生成带价格和活动文案的促销Banner', 'YouTube视频封面：输入视频标题和风格，生成带大标题的YouTube视频缩略图', '品牌字体展示：输入品牌Slogn和视觉风格，生成含品牌文字的视觉展示图'],
    faqs: [
      { question: 'Ideogram的文字渲染真的比其他AI绘画工具好吗？', answer: '是的，文字渲染是Ideogram的核心优势。测试对比显示：1)Ideogram在图片中生成中文文字的准确率约90%，而Midjourney约20%、DALL·E约70% 2)Ideogram能正确渲染较长的文字段落 3)文字的字体风格和排版效果更好。如果你需要做海报、Banner、封面等含文字的设计，Ideogram是最佳选择。' },
      { question: 'Ideogram支持中文提示词吗？', answer: '界面和提示词以英文为主，但Magic Prompt功能能理解简单的英文描述。建议：用英文描述图片风格和内容（如"Poster design, tech conference"），在被渲染的文字内容上可以使用中文。Ideogram对中文字体的渲染效果在AI绘画工具中是最好的。' },
      { question: 'Ideogram和Midjourney怎么选？', answer: '如果需要图片中包含精准文字（海报、Banner、封面），选Ideogram。如果追求纯图像的艺术美感和画质，选Midjourney。很多设计师的工作流是：先用Midjourney生成背景图或高品质图像，再导入Photoshop添加文字；或者用Ideogram生成含文字的海报初稿。建议两个都试，根据具体任务选用。' },
      { question: 'Ideogram免费版每天能用几次？', answer: '免费版每天约10-20次生成额度，具体取决于当日系统负载。每次生成4张候选图消耗1次额度。免费版输出带Ideogram水印，分辨率最高1080p。如果每天需要大量生成海报或做商业项目，建议Basic版（$20/月）无限生成+去水印。' }
    ]
  },

  // ===== 新增工具：视频生成类 =====
  { id: 'kling', name: '可灵AI', logo: '🎬', description: '快手自研的AI视频生成大模型，国产视频生成工具中最火的平台，支持文生视频和图生视频', url: 'https://kling.kuaishou.com', price: 'freemium', difficulty: 'beginner', heat: 65, heatGrowth: 55, tags: ['AI视频', '视频生成', '国产AI'], techTags: ['GenerativeMedia', 'VideoAI'], sceneTags: ['短视频', '内容创作', '电商运营'], costTags: ['Freemium', '中文友好'], category: '视频生成', prompts: [{ id: 'p1', title: '产品展示视频', content: '为[产品名称]生成一段产品展示视频，展示产品外观和使用场景，流畅运镜，高清画质', scene: '电商运营' }, { id: 'p2', title: 'AI创意短片', content: '生成一段[主题]创意短片，[风格描述]，时长约5-10秒，电影级质感', scene: '内容创作' }], tips: ['国产视频生成工具中热度最高', '支持文生视频和图生视频两种模式', '免费用户每天有一定生成额度', '生成的视频画质细腻，运动一致性好'], relatedSkills: ['skill_short_video_script'],
    features: ['文生视频：用中文文字描述即可生成5-10秒的高质量视频', '图生视频：上传参考图片，AI生成符合图片内容的动态视频', '视频风格迁移：对现有视频应用多种视觉风格（动漫/写实/科幻等）', '运动控制：精细控制视频中物体的运动轨迹和方向', '高清画质：生成的视频分辨率高，细节丰富，运动一致性出色', '中文提示词优化：针对中文提示词深度优化，理解准确率高', '免费额度慷慨：免费用户每天有充足生成额度', '快手生态联动：与快手短视频平台深度集成，一键发布'],
    pricing: '可灵AI采用Freemium模式。免费版：每日登录赠送约30-50个生成点数（每次视频生成消耗5-10点），720p输出，带水印。标准版约¥69/月：去水印，1080p输出，优先队列。高级版约¥199/月：4K输出，商业授权，API访问。作为国产AI视频工具，可灵的免费额度是同类产品中最慷慨的，轻度使用可完全免费。人民币定价，无需翻墙。',
    pros: ['免费额度最慷慨：每天30-50点免费点数，可生成5-10个视频', '国产中文友好：全中文界面和提示词，无需翻墙', '画质和运动一致性好：在国产视频生成工具中画质领先', '快手生态联动：生成的视频可一键发布到快手平台'],
    cons: ['视频长度有限：单个视频最长5-10秒，无法生成长视频', '创意性和多样性不足：生成视频的风格变化不如Runway丰富', '复杂动作渲染不稳定：复杂的人物动作或多物体交互有时会出现失真', '海外知名度低：英文社区案例和资源较少'],
    targetAudience: ['短视频创作者：需要AI辅助生成短视频素材的快手/抖音创作者', '电商卖家：需要制作产品展示短视频的国内电商运营人员', '广告营销人员：需要快速制作视频广告素材的营销团队', '内容创作者：缺少视频拍摄条件但需要视频内容的博主', 'AI视频入门用户：想尝试AI视频生成但不想翻墙的国内用户'],
    useCases: ['产品展示视频：上传产品图片+中文描述，AI自动生成产品动态展示视频', '短视频创意素材：输入中文文案描述，生成符合描述的视频片段用于短视频创作', '电商商品视频：输入商品名称和卖点，批量生成多个角度的商品演示视频', '社交娱乐内容：用文字描述创意场景（如"一只会飞的猫在故宫上空飞翔"），生成短视频', '广告素材制作：输入广告创意思路，快速生成多个版本的视频素材进行A/B测试'],
    faqs: [
      { question: '可灵AI和Runway/Pika相比差距大吗？', answer: '可灵AI在视频画质和运动一致性上与Runway Gen-3和Pika 2.0相比差距不大，在某些场景（特别是人物运动）的表现甚至更好。可灵的核心优势：1)中文提示词理解准确 2)免费额度多 3)无需翻墙。差距主要体现在：1)视频风格多样性不如Runway 2)英文社区资源和教程少 3)视频编辑功能不如Runway全面。对于国内用户，可灵是性价比最高的AI视频工具。' },
      { question: '可灵AI免费版每天能生成多少视频？', answer: '每天登录赠送约30-50个生成点数，每个视频生成消耗5-10点，约可免费生成5-10个视频。此外还有每日任务和签到额外送点数。相比Runway免费版（125积分总计用完即止），可灵的免费策略持续性更强。轻度使用（每天3-5个视频）完全可以免费玩。' },
      { question: '可灵AI生成的视频有版权问题吗？可以商用吗？', answer: '付费用户生成的视频可以用于商业用途，包括广告、电商、短视频创作等。免费用户生成的视频使用权限制较多，建议商业使用购买付费版。作为快手官方产品，可灵在版权合规方面比海外工具更加规范，可以放心用于国内商业场景。' },
      { question: '可灵AI支持图生视频和文生视频吗？哪个效果更好？', answer: '两者都支持。文生视频适合创意类内容（描述一个想象中的场景），图生视频适合产品展示和现有内容的动画化。实际体验中，图生视频的效果更稳定，因为AI有参考图作为基础。文生视频的创意性更强但结果的可控性稍差。建议：产品展示用图生视频，创意内容用文生视频。' }
    ]
  },
  { id: 'pika', name: 'Pika', logo: '🎞️', description: 'AI视频生成工具，以快速出片和简洁易用著称，支持文本和图像生成视频，适合短视频创作者', url: 'https://pika.art', price: 'freemium', difficulty: 'beginner', heat: 54, heatGrowth: 25, tags: ['AI视频', '视频生成', '创意工具'], techTags: ['GenerativeMedia', 'VideoAI'], sceneTags: ['短视频', '内容创作', '影视制作'], costTags: ['Freemium', '需翻墙'], category: '视频生成', prompts: [{ id: 'p1', title: '文字生成视频', content: 'A [subject] [action] in [environment], cinematic lighting, smooth motion, [style]', scene: '内容创作' }, { id: 'p2', title: '图片动效制作', content: 'Animate this image: [description of motion], gentle movement, seamless loop', scene: '视频制作' }], tips: ['操作简单，上手快，适合新手', '生成速度快，几分钟内出片', 'Pika 2.0大幅提升了画质和一致性', '支持局部视频编辑和修改'], relatedSkills: [],
    features: [
      '文生视频：输入文字描述，AI自动生成3-5秒的视频片段',
      '图生视频：上传参考图片，AI让静态图片动起来',
      '视频局部编辑：对视频中的特定区域进行修改或替换',
      '视频风格迁移：将现有视频转换为动画、3D、像素风等风格',
      '唇形同步：上传人物视频，AI自动匹配语音生成唇形动画',
      'Seamless Loop：生成无缝循环的视频，适合社交媒体和动图',
      '高清输出：支持1080p和4K视频输出',
      'Pika 2.0升级：大幅提升运动一致性、画质和生成速度'
    ],
    pricing: 'Pika采用Freemium模式。免费版：每月约50次生成额度，基础画质，最长3秒视频，带Pika水印。Standard版$10/月：无限生成，1080p，最长5秒，去水印。Pro版$30/月：4K输出，最长10秒，商业授权，优先队列。免费版适合体验和轻度创作，重度用户建议Standard版。相比Runway（$15-95/月），Pika更便宜且操作更简单。需翻墙使用。',
    pros: ['操作极简上手快：界面简洁直观，无需学习即可上手生成视频', '生成速度快：单次视频生成约30秒-2分钟，远快于Runway的3-10分钟', 'Pika 2.0画质大幅提升：运动一致性和画质已接近Runway Gen-3水平', '价格亲民：$10/月起，比Runway和Sora更便宜'],
    cons: ['视频长度有限：最长10秒，无法生成较长的视频片段', '复杂动作不稳定：人物高速运动或多物体交互时容易出现变形', '中文社区资源少：教程和案例以英文为主，中文资料匮乏', '视频风格多样性有限：不如Runway的风格丰富和画面表现力'],
    targetAudience: ['短视频创作者：需要快速生成短视频素材的抖音/TikTok创作者', 'AI视频入门用户：想尝试AI视频生成但没有复杂需求的初学者', '社交媒体运营：需要制作动图和短视频的社媒运营人员', '广告营销人员：需要快速制作短视频广告素材的营销团队', '设计师：需要为设计项目制作动态展示视频的设计师'],
    useCases: ['社交媒体短视频：输入创意文案，生成3-5秒的短视频用于抖音/Reels/Shorts', '产品动态展示：上传产品图片，让产品旋转/移动/变换角度展示细节', '视频封面动效：为YouTube视频制作动态封面，增加点击率', '创意视觉特效：文字描述一个奇幻场景（如"发光的水晶在太空漂浮"），生成动态视频', '广告素材快速制作：输入广告文案描述，快速生成多个版本的视频素材测试效果'],
    faqs: [
      { question: 'Pika和Runway哪个更好？', answer: 'Pika优势：操作更简单、价格更便宜（$10/月起 vs $15/月起）、生成速度更快。Runway优势：视频质量更高、风格更丰富、支持更长的视频、编辑功能更强大。如果刚接触AI视频生成，建议从Pika开始（成本低、上手快）。如果需要专业级AI视频制作，预算充足，Runway是更好的选择。Pika 2.0上线后差距已经缩小。' },
      { question: 'Pika免费版够用吗？', answer: '免费版每月约50次生成，每次生成最长3秒，带水印，标准画质。适合：尝鲜体验、简单测试、偶尔使用。如果需要：去水印、更长视频、更高画质、商业使用，建议Standard版（$10/月）。Pika的付费版性价比较高，是目前AI视频工具中最便宜的无限制选项之一。' },
      { question: 'Pika支持中文提示词吗？', answer: '支持，但效果不如英文好。Pika对英文提示词的理解更准确，生成结果更符合预期。建议用英文写提示词，格式：主体+动作+环境+风格+光照。例如：\\\"A cute cat walking on a beach, sunset lighting, cinematic, 4k\\\"。可以使用ChatGPT等工具将中文需求翻译成英文提示词。' },
      { question: 'Pika 2.0比1.0有哪些提升？', answer: 'Pika 2.0带来的主要改进：1)画质大幅提升，接近Runway Gen-3水平 2)运动一致性显著改善，物体变形问题减少 3)支持更复杂的场景和动作 4)生成速度更快 5)新增局部视频编辑功能。Pika 2.0是Pika从"玩具"变为"工具"的关键版本，如果你之前觉得Pika不好用，值得重新体验2.0。' }
    ]
  },

  // ===== 新增工具：办公工具类 =====
  { id: 'napkin_ai', name: 'Napkin AI', logo: '📊', description: '前Google员工开发的AI文字可视化工具，一键将文字内容自动转换为图表、流程图和信息图', url: 'https://www.napkin.ai', price: 'freemium', difficulty: 'beginner', heat: 48, heatGrowth: 40, tags: ['图表生成', '数据可视化', '办公工具'], techTags: ['GenerativeAI'], sceneTags: ['办公提效', '内容创作', '商业计划书'], costTags: ['Freemium', '需翻墙'], category: '办公工具', prompts: [{ id: 'p1', title: '流程图生成', content: '根据以下业务流程描述生成一张流程图：[流程描述]', scene: '办公提效' }, { id: 'p2', title: '信息图制作', content: '将以下数据要点生成一张信息图，适合社交媒体分享：[数据和要点]', scene: '内容创作' }], tips: ['支持自动识别文字中的逻辑关系生成图表', '提供多种美观的图表模板', '导出的图表质量高可直接用于PPT', '适合快速将想法可视化'], relatedSkills: ['skill_auto_ppt'],
    features: [
      '文字转图表：粘贴文字内容，AI自动识别逻辑关系并生成对应的图表',
      '多种图表类型：支持流程图、信息图、组织结构图、鱼骨图、维恩图等',
      '智能布局设计：AI自动选择最佳布局和配色方案，图表美观专业',
      '实时编辑：生成图表后支持直接编辑文字、颜色和布局',
      'AI模板推荐：根据文字内容自动推荐最适合的图表类型和模板',
      '高质导出：支持导出为PNG、PDF、SVG等格式，分辨率适合PPT和印刷',
      '团队协作：支持分享和协作编辑图表',
      '品牌定制：支持自定义品牌色和Logo，保持视觉一致性'
    ],
    pricing: 'Napkin AI采用Freemium模式。免费版：每月约10次图表生成，基础图表类型，标准分辨率，带Napkin水印。Pro版$12/月（约¥87/月）：无限生成，全部图表类型，高清导出（PNG/SVG/PDF），去水印。Team版$25/月：团队协作，品牌定制，管理控制台。免费版适合偶尔使用，办公重度用户建议Pro版。相比同类工具，Napkin AI的AI自动识别文字逻辑生成图表的能力是其核心竞争力。需翻墙使用。',
    pros: ['AI自动识别文字逻辑：粘贴文字自动生成图表，无需手动拖拽，效率极高', '生成图表美观专业：预设模板和配色方案质量高，直接可用', '节省大量时间：原本需要30分钟的图表制作，Napkin只需30秒', '适合非设计师：不需要设计和排版技能，任何人都能制作专业图表'],
    cons: ['免费额度少：每月10次，重度使用必须付费', '复杂图表支持有限：对于大型系统架构图等复杂图表能力不足', '需翻墙使用：对中国用户有网络门槛', '不支持中文界面：界面为英文，对不熟悉英文的用户有使用障碍'],
    targetAudience: ['办公白领：需要快速制作流程图和信息图的职场人士', '产品经理：需要绘制业务流程图、用户路径图的产品经理', '咨询顾问：需要制作专业图表用于提案和报告的管理咨询师', '创业者：需要绘制商业计划书中图表的创业公司创始人', '老师和教育者：需要制作教学图表和课程材料的教师'],
    useCases: ['业务流程整理：用文字描述业务流程，Napkin自动生成流程图用于会议展示', '信息图制作：将数据要点粘贴到Napkin，AI生成美观信息图用于社交媒体分享', '方案提案图表：在写方案时快速生成组织架构图、时间线图等辅助说明', '会议演示材料：将会议讨论的逻辑关系转化为清晰的可视化图表', '学术论文图表：将研究方法和结果描述转化为可视化图表用于论文发表'],
    faqs: [
      { question: 'Napkin AI和Visio/Lucidchart有什么区别？', answer: 'Napkin是AI驱动的文字到图表工具，Visio/Lucidchart是手动拖拽的图表编辑器。核心区别：1)Napkin只需粘贴文字即可自动生成图表，Visio需要手动绘制 2)Napkin用AI理解文字逻辑并选择最佳图表类型 3)Napkin学习成本极低，5分钟上手。Visio适合需要精细控制的专业用户，Napkin适合快速将想法可视化的普通用户。两者可以互补使用。' },
      { question: 'Napkin AI免费版够用吗？', answer: '免费版每月10次图表生成，适合轻度使用和体验。如果你是产品经理、咨询顾问、创业者等需要经常制作图表的用户，建议Pro版（$12/月）。Pro版的无限生成+高清导出+去水印对日常工作很实用。Napkin的付费版在同类工具中价格中等，但AI自动生成的效率优势远超手动工具。' },
      { question: 'Napkin AI支持中文内容吗？', answer: '支持粘贴中文文字，AI能识别中文的逻辑关系并生成图表。但界面为英文，操作按钮和提示都是英文。生成图表中的文字使用你输入的中文内容。对中文的理解准确度不如英文，复杂的中文逻辑关系可能需要手动调整。建议先用简单中文描述，再逐步优化。' },
      { question: 'Napkin AI生成的图表能直接用于商业PPT吗？', answer: '可以。Pro版导出的PNG和PDF分辨率足够用于PPT和商业提案。导出的SVG矢量格式可以在PowerPoint中无限缩放编辑，推荐商用场景使用SVG格式。图表的美观度在同类工具中较高，配色和排版设计质量不错，通常不需要额外美化即可直接使用。' }
    ]
  },
  { id: 'feishu_ai', name: '飞书智能伙伴', logo: '📋', description: '字节跳动飞书平台的AI办公助手，深度集成文档、会议、知识库等场景，提升企业协作效率', url: 'https://www.feishu.cn/product/ai', price: 'freemium', difficulty: 'beginner', heat: 55, heatGrowth: 30, tags: ['办公工具', 'AI协作', '企业级AI'], techTags: ['NLP', 'GenerativeAI', 'RAG'], sceneTags: ['办公提效', '企业AI自动化'], costTags: ['Freemium', '中文友好'], category: '办公工具', prompts: [{ id: 'p1', title: '文档总结', content: '请总结以下飞书文档的核心内容，提取关键决策和待办事项：[文档内容]', scene: '办公提效' }, { id: 'p2', title: '会议记录整理', content: '根据以下会议录音文字，生成结构化会议纪要，包含讨论要点、决策和行动项：[会议文字]', scene: '办公提效' }], tips: ['在飞书文档中可直接呼出AI助手', '支持跨文档理解和知识库问答', 'AI可自动生成会议纪要和待办事项', '企业版支持定制AI技能'], relatedSkills: ['skill_meeting_summary'],
    features: [
      'AI文档助手：在飞书文档中通过@或侧边栏呼出AI，辅助写作、翻译和润色',
      'AI会议纪要：自动记录会议内容，生成结构化会议纪要和待办事项',
      '知识库问答：基于企业知识库进行智能问答，员工可快速获取内部知识',
      'AI摘要：对长文档、聊天记录、邮件等自动生成核心摘要',
      '智能写作：辅助撰写周报、方案、邮件等，支持多种写作风格',
      '多语言翻译：实时翻译文档内容，支持中英日韩等多语种互译',
      'AI表格处理：在飞书多维表格中用自然语言进行数据分析和处理',
      '企业级安全：数据不出域，符合企业合规和安全要求'
    ],
    pricing: '飞书智能伙伴采用Freemium模式。免费版：每个账号每月100次AI调用，可用于文档辅助、会议纪要、知识库问答等基础功能。标准版¥10/人/月：每月500次AI调用，支持更多高级功能。企业版定制价格：无限AI调用，支持私有化部署、定制AI技能、专属模型训练。相比Notion AI（$10/月/人），飞书智能伙伴作为飞书生态的内置功能，性价比更高。无需翻墙，直接使用。',
    pros: ['飞书生态深度集成：在文档、会议、知识库中无缝使用AI，无需切换工具', '企业级安全合规：数据不出域，符合国内企业数据安全要求', '中文支持出色：针对中文办公场景深度优化，理解准确', '功能全面覆盖办公场景：文档、会议、表格、知识库等多个场景覆盖'],
    cons: ['需使用飞书生态：非飞书用户无法使用，有生态绑定', '免费额度有限：每月100次AI调用，重度使用需付费', 'AI能力不如ChatGPT/Claude：在复杂推理和创意写作上不如通用AI工具', '定制化需企业版：高级AI技能定制需要企业版，门槛较高'],
    targetAudience: ['飞书企业用户：已经使用飞书作为办公协同工具的企业员工', '企业管理者：希望通过AI提升团队协作效率的管理者', 'HR和行政人员：需要AI辅助处理文档和会议记录的行政岗位', '研发团队：需要在飞书中进行技术文档编写和知识管理的团队', '所有飞书用户：希望在日常办公中提升效率的飞书使用者'],
    useCases: ['周报自动生成：输入本周工作内容要点，AI自动生成结构化周报', '会议纪要自动产出：开启飞书会议AI记录，结束后自动生成会议纪要和待办', '知识库智能问答：在企业知识库中提问（如"新员工入职流程"），AI自动回答', '合同条款审查：将合同粘贴到飞书文档，让AI审查风险条款并给出建议', '翻译外文文档：上传英文文档，AI自动翻译为中文并保持排版格式'],
    faqs: [
      { question: '飞书智能伙伴和ChatGPT/Claude有什么区别？', answer: '飞书智能伙伴是内置于飞书办公套件中的AI助手，ChatGPT/Claude是通用AI对话产品。核心区别：1)飞书AI与文档、会议、知识库深度集成，不用切换工具 2)飞书AI可访问企业知识库，回答基于内部数据 3)数据不出域，符合企业安全要求 4)通用AI能力不如ChatGPT/Claude，但办公场景的体验更流畅。如果主要用于办公提效，飞书AI就够用；如果需要通用AI能力，可以配合ChatGPT使用。' },
      { question: '飞书智能伙伴免费版够用吗？', answer: '免费版每账号每月100次AI调用。估算：如果每天使用AI写文档5次、生成会议纪要2次、知识库问答3次，约每月300次，免费版不够用。标准版¥10/人/月（500次/月）对大多数员工来说足够了。企业版适合AI使用频繁的团队。飞书AI的定价在同类产品中比较合理，尤其是与飞书套件配合使用时。' },
      { question: '飞书智能伙伴支持哪些AI功能？', answer: '主要功能：1)文档写作辅助（写作/润色/翻译/摘要）2)会议纪要自动生成（录音转文字+AI总结）3)知识库问答（基于企业知识库的问答）4)多维表格AI（自然语言数据分析）5)聊天智能回复（即时通讯中的AI辅助）6)邮件撰写辅助。这些功能都需要在飞书企业版或标准版中才能完整使用。' },
      { question: '飞书智能伙伴的数据安全如何保障？', answer: '飞书智能伙伴采用企业级安全保障：1)数据不出域，AI处理在企业私有环境中完成 2)不会使用企业数据训练外部AI模型 3)符合中国数据安全法和个人信息保护法 4)企业版支持私有化部署。相比使用ChatGPT等海外AI工具（数据可能出境），飞书AI在数据安全方面更适合国内企业。' }
    ]
  },

  // ===== 新增工具：编程开发类 =====
  { id: 'windsurf', name: 'Windsurf', logo: '🌊', description: 'Codeium推出的AI原生IDE，Cursor最强竞品，提供智能代码补全、上下文理解和Agent模式', url: 'https://codeium.com/windsurf', price: 'freemium', difficulty: 'intermediate', heat: 57, heatGrowth: 48, tags: ['代码编辑器', 'AI编程', 'IDE'], techTags: ['CodeGen', 'GenerativeAI', 'Agent'], sceneTags: ['编程开发'], costTags: ['Freemium', '需翻墙'], category: '编程开发', prompts: [{ id: 'p1', title: '全栈应用开发', content: '帮我创建一个[技术栈]的全栈应用，包含：用户认证、数据库CRUD、前端UI，分步实现', scene: '编程开发' }, { id: 'p2', title: '代码优化重构', content: '请分析以下代码的性能瓶颈并给出优化方案，保持功能不变：[代码片段]', scene: '编程开发' }], tips: ['支持VS Code扩展生态', 'Cascade功能可以跨文件理解和编辑', '免费版功能强大，性价比高', '内置Agent模式可自动化多步骤任务'], relatedSkills: ['skill_code_review', 'skill_vibe_coding'],
    features: [
      'Cascade智能理解：跨文件、跨项目的代码上下文理解，精准定位和编辑',
      'AI代码补全：基于整个项目上下文的智能代码补全，准确率高',
      'Agent自动化模式：自主执行多步骤开发任务（创建文件→生成代码→运行测试）',
      'VS Code扩展兼容：完全兼容VS Code扩展生态，迁移成本低',
      '自然语言编辑：用自然语言描述修改需求，AI自动执行代码变更',
      'Git集成：自动生成commit message，辅助代码审查和合并',
      '终端智能：在终端中直接使用AI诊断错误和生成命令',
      '多模型支持：内置多种AI模型可选，包括Claude、GPT-4等'
    ],
    pricing: 'Windsurf采用Freemium模式。免费版：每月100次Cascade代理请求，基础代码补全，无限制的编辑请求。Pro版$15/月（约¥109/月）：无限Cascade请求，高级模型（GPT-4/Claude），优先响应。Pro Ultimate版$30/月：无限使用所有模型，最高优先级。年付85折。免费版对轻度开发已经够用，Pro版性价比高于Cursor（$20/月）。需翻墙使用。',
    pros: ['Cascade功能强大：跨文件理解和编辑的能力堪比Cursor，部分场景表现更好', '免费版额度慷慨：每月100次Cascade请求，轻度开发可长期免费', 'VS Code扩展兼容：可从VS Code无缝迁移，保留全部扩展和配置', '价格比Cursor便宜：Pro版$15/月 vs Cursor $20/月，功能相近'],
    cons: ['品牌知名度不如Cursor：用户社区和教程资源相对较少', '部分高级功能不够稳定：Agent模式在处理复杂任务时偶有异常', '需翻墙使用：对中国开发者有网络门槛', '多模型切换体验不佳：不同模型间的切换和响应速度不如Cursor流畅'],
    targetAudience: ['全栈开发者：需要AI辅助进行全栈应用开发的Web开发者', 'VS Code用户：希望从VS Code迁移到AI IDE但不想放弃扩展生态的用户', '预算有限的开发者：希望使用AI编程工具但觉得Cursor太贵的学生和独立开发者', '多语言开发者：在多种编程语言间切换的开发人员', 'AI编程新手：想尝试AI原生IDE但不想直接付$20/月的入门用户'],
    useCases: ['全栈应用开发：用自然语言描述功能需求，Windsurf自动创建完整项目结构和代码', '跨文件代码重构：描述重构目标（如"将API路由从Express迁移到Hono"），AI跨文件修改', 'Bug自动修复：粘贴错误日志，AI定位代码问题并修复，运行测试验证', '代码审查辅助：在PR中让AI审查代码变更，自动发现潜在问题和改进建议', '数据库模型设计：描述业务需求，AI自动设计数据库Schema并生成迁移文件'],
    faqs: [
      { question: 'Windsurf和Cursor哪个更好？', answer: 'Windsurf优势：价格更便宜（$15/月 vs $20/月）、免费版额度更多、VS Code扩展兼容性好。Cursor优势：Cascade模式更成熟、社区更大、模型切换体验更好。实际使用中，两个产品差距不大，核心体验非常接近。建议：先体验Windsurf免费版，如果够用就省钱用Windsurf；如果觉得Windsurf不够好，再考虑升级Cursor。' },
      { question: 'Windsurf免费版够用吗？', answer: '免费版每月100次Cascade代理请求，代码补全功能不限。对于轻度开发（偶尔写代码、小项目）：完全够用。对于日常全职开发者（每天频繁使用Cascade）：建议Pro版（$15/月）。代码补全功能免费版已经是无限使用，只是高级的Cascade agent有限额。Windsurf的免费版在同类产品中是最慷慨的。' },
      { question: 'Windsurf支持中文提示词吗？', answer: '支持。Windsurf的Cascade模式可以理解中文描述并执行对应的代码操作。例如输入"帮我创建一个用户登录功能的API路由"，AI能理解并生成代码。不过代码注释和commit message建议使用英文（团队协作规范）。自然语言描述功能的中文理解准确度与使用的大模型有关，使用GPT-4或Claude时中文理解效果很好。' },
      { question: 'Windsurf需要翻墙吗？怎么安装？', answer: '需要翻墙访问codeium.com下载Windsurf。安装步骤：1)访问windsurf.com下载对应系统版本 2)安装后启动，用GitHub/Google账号登录 3)选择使用的AI模型 4)开始使用。Windsurf基于VS Code，如果你使用过VS Code，界面和快捷键几乎完全一致，上手零成本。下载和登录过程需要稳定的网络连接。' }
    ]
  },
  { id: 'bolt_new', name: 'Bolt.new', logo: '⚡', description: 'StackBlitz推出的AI全栈Web应用生成器，在浏览器中直接通过自然语言创建、运行和部署应用', url: 'https://bolt.new', price: 'freemium', difficulty: 'beginner', heat: 63, heatGrowth: 60, tags: ['AI编程', '全栈开发', 'Web应用'], techTags: ['CodeGen', 'GenerativeAI', 'WebContainers'], sceneTags: ['编程开发'], costTags: ['Freemium', '需翻墙'], category: '编程开发', prompts: [{ id: 'p1', title: '快速搭建网站', content: '帮我创建一个[网站类型]网站，包含：首页、关于页、联系页，使用React+Tailwind CSS', scene: '编程开发' }, { id: 'p2', title: '全栈CRUD应用', content: '创建一个[功能描述]的CRUD应用，使用[技术栈]，包含数据库模型、API路由和前端界面', scene: '编程开发' }], tips: ['浏览器内即可完成开发、预览和部署', '无需本地环境配置，零门槛上手', '支持Next.js、React、Vue等主流框架', '免费版有一定使用额度'], relatedSkills: ['skill_vibe_coding'],
    features: [
      '浏览器内全栈开发：无需安装任何软件，浏览器内完成编码、运行和部署',
      '自然语言生成应用：用中文或英文描述需求，AI自动生成完整的Web应用',
      '实时预览：生成的同时实时预览应用效果，所见即所得',
      'WebContainers技术：在浏览器中运行完整的Node.js环境，支持npm包安装',
      '一键部署：直连Netlify/Cloudflare等平台，一键部署上线',
      '多框架支持：支持Next.js、React、Vue、Nuxt、Svelte等主流前端框架',
      '数据库集成：内置Supabase、Prisma等数据库方案的支持',
      '版本历史：保存每次修改的历史记录，随时回溯到之前的版本'
    ],
    pricing: 'Bolt.new采用Freemium模式。免费版：每月100次Prompt生成，基础技术栈（React/Vue），公开项目。Pro版$20/月（约¥145/月）：无限生成，所有技术栈，私有项目，优先队列。Team版$40/月/人：团队协作，共享模板，管理控制台。免费版适合学习和快速原型验证，Pro版适合个人开发者和创业团队。相比Replit（$20-100/月），Bolt.new在AI生成Web应用方面体验更流畅。需翻墙使用。',
    pros: ['浏览器内全流程：从创建到部署全部在浏览器完成，无需本地环境', '自然语言驱动：用语言描述需求即可生成完整应用，非技术人员也能用', '生成速度快：描述需求后20-60秒即可看到可运行的应用', '内置数据库方案：与Supabase/Prisma深度集成，后端开发很方便'],
    cons: ['免费额度有限：每月100次Prompt，重度使用需付费', '复杂应用支持有限：大型项目或定制化需求的处理能力不足', '需翻墙使用：对中国用户有网络门槛', '生成代码质量偶尔不稳定：复杂逻辑的代码有时需要手动调整'],
    targetAudience: ['独立开发者：快速验证想法和构建MVP的个人开发者', '创业团队：需要快速搭建产品原型的初创公司', '非技术创始人：有想法但不会编程的创业者和产品经理', '全栈学习者：希望通过AI辅助学习全栈开发的编程新手', '黑客马拉松参与者：需要快速搭建演示项目的参赛者'],
    useCases: ['MVP快速搭建：描述一个应用概念（如"P2P借书平台"），10分钟生成可运行的MVP', '企业官网建设：输入公司信息和设计偏好，生成完整的企业官网', '管理后台生成：描述后台功能需求（用户管理/数据统计/权限控制），AI生成完整后台', 'API原型测试：描述API需求，Bolt.new生成完整的API路由和测试页面', '学习项目实战：在学习React/Vue时，用自然语言生成项目作为学习参考'],
    faqs: [
      { question: 'Bolt.new和Cursor/Windsurf有什么区别？', answer: 'Bolt.new是浏览器内的AI全栈应用生成器，适合从零开始快速创建项目。Cursor/Windsurf是本地的AI原生IDE，适合在已有项目上开发和修改。Bolt.new的优势：无需安装、全栈一键生成、内置部署。Cursor的优势：代码更精细控制、大型项目管理、本地开发体验。建议：做原型和MVP用Bolt.new，做正式项目开发用Cursor。' },
      { question: 'Bolt.new免费版够用吗？', answer: '免费版每月100次Prompt生成，适合：学习和尝试、快速原型验证、简单项目。每次Prompt可以生成一个页面或功能模块。做一个简单的3页网站约10-20次Prompt。如果需要：大量生成、商业项目、私有项目，建议Pro版（$20/月）。Bolt.new的付费版对独立开发者来说性价比很高。' },
      { question: 'Bolt.new支持哪些技术栈？', answer: '免费版支持基础栈：React + Tailwind CSS、Next.js、Vue。Pro版额外支持：Nuxt、Svelte、Astro、Qwik，以及数据库方案（Supabase、Prisma、Drizzle）、认证方案（NextAuth、Clerk）、付费版还支持自定义环境变量和域名。建议根据需要选择合适的技术栈，Bolt.new对Next.js的支持最好。' },
      { question: 'Bolt.new在中国能用吗？', answer: '需要翻墙。访问bolt.new和使用AI生成需要稳定的代理网络。另外，Bolt.new支付也需要国际支付方式。如果无法使用，可以考虑国内替代方案：Coze（零代码Bot构建）、或者使用国产大模型+Cursor本地开发。Bolt.new对国内用户虽然在支付和网络上有门槛，但其"一句话生成应用"的能力是独一无二的。' }
    ]
  },
  { id: 'v0_dev', name: 'v0.dev', logo: '🎨', description: 'Vercel推出的AI UI生成工具，基于Shadcn UI和Tailwind CSS生成可直接运行的React组件', url: 'https://v0.dev', price: 'freemium', difficulty: 'beginner', heat: 61, heatGrowth: 38, tags: ['UI生成', '前端开发', 'React组件'], techTags: ['CodeGen', 'GenerativeAI'], sceneTags: ['编程开发', '设计创作'], costTags: ['Freemium', '需翻墙'], category: '编程开发', prompts: [{ id: 'p1', title: 'UI组件生成', content: 'Create a [component name] component with [features], using shadcn/ui and Tailwind CSS, responsive design', scene: '编程开发' }, { id: 'p2', title: '页面布局设计', content: 'Design a [page type] page layout with: header, hero section, feature grid, testimonials, footer. Use Tailwind CSS', scene: '编程开发' }], tips: ['生成的组件直接兼容Next.js和Vercel部署', '基于shadcn/ui组件库，质量高', '支持迭代修改和重新生成', '可以导出为完整的React代码'], relatedSkills: ['skill_vibe_coding'],
    features: [
      'AI UI组件生成：用文字描述UI需求，AI自动生成基于shadcn/ui的React组件',
      '页面布局设计：生成完整页面布局（主页、登录页、仪表盘等），响应式设计',
      'shadcn/ui原生：所有组件基于shadcn/ui库，代码质量高、风格一致',
      'Tailwind CSS集成：生成的组件全部使用Tailwind CSS，样式可定制性强',
      '迭代修改：对生成的组件通过对话进行修改和优化，支持重新生成',
      '代码导出：生成的完整React代码可直接复制到项目中运行',
      'Vercel生态：与Next.js和Vercel部署平台深度集成，一键部署',
      '视觉预览：实时预览生成的UI效果，所见即所得'
    ],
    pricing: 'v0.dev采用Freemium模式。免费版：每月约10次生成额度，基础组件生成，公开分享。Pro版$20/月（约¥145/月）：无限生成，全部功能，私有项目，优先队列。Team版$40/月/人：团队协作，品牌定制，共享组件库。免费版适合简单尝试和学习，前端开发者建议Pro版。相比Figma的AI功能（$12-75/月），v0.dev在生成可直接运行的代码方面有优势。需翻墙使用。',
    pros: ['生成的代码可直接运行：导出后粘贴即可使用，无需额外调整', '基于shadcn/ui质量高：生成的组件代码风格统一，质量可靠', '与Next.js/Vercel生态完美兼容：生成的组件可直接用于Vercel部署的项目', '迭代修改方便：不满意可以通过对话直接要求修改，无需重写'],
    cons: ['免费额度非常少：每月10次生成，只能体验基本功能', '主要用于React/Next.js：不支持Vue/Angular等其他前端框架', '需翻墙使用：对中国前端开发者有网络门槛', '生成组件样式偏通用：缺乏独特的设计创意，需要二次定制美化'],
    targetAudience: ['React前端开发者：需要快速生成UI组件和页面布局的前端工程师', 'Next.js开发者：使用Vercel/Next.js技术栈的全栈开发者', '独立开发者：需要快速搭建前端界面的个人开发者', '产品经理：需要生成UI原型用于产品需求沟通的产品经理', '设计转开发的开发者：有设计背景但需要快速产出可运行代码的开发人员'],
    useCases: ['登录页面生成：输入"生成一个带邮箱密码登录和第三方登录的登录页"，AI生成完整登录页代码', '仪表盘布局：描述"生成一个带侧边栏、顶部导航和内容区域的仪表盘布局"，AI生成完整布局', '表单组件生成：输入"生成一个带验证的用户注册表单"，AI生成含校验逻辑的表单组件', '卡片组件设计：描述"生成一个产品展示卡片网格，每个卡片含图片、标题、价格和购买按钮"', '定价页面生成：输入"生成一个三栏定价表，含免费/Pro/企业版三个方案"'],
    faqs: [
      { question: 'v0.dev和Bolt.new有什么区别？', answer: 'v0.dev专注于生成UI组件和页面布局（前端视觉层），Bolt.new生成完整的全栈Web应用（包含后端、数据库）。v0.dev适合：已有项目需要添加UI组件、需要高质量的前端代码。Bolt.new适合：从零开始创建完整的Web应用。两者可以结合使用：用Bolt.new生成项目骨架，用v0.dev生成精美的UI组件再集成进去。' },
      { question: 'v0.dev免费版够用吗？', answer: '免费版每月约10次生成，只能用于简单尝试和学习。如果前端开发是你的日常工作，建议Pro版（$20/月）。Pro版的无限生成+全部功能对日常开发非常实用。v0.dev生成的是可直接运行的代码，每生成一个组件节约的编码时间约30-60分钟，Pro版的性价比对前端开发者很高。' },
      { question: 'v0.dev支持Vue或其他框架吗？', answer: '目前v0.dev主要支持React/Next.js + Tailwind CSS，不支持Vue、Angular等框架。生成的组件基于shadcn/ui组件库，这是专为React设计的。如果你是Vue开发者，可以考虑其他替代工具。v0.dev是Vercel旗下的产品，Vercel与Next.js/React深度绑定，所以框架支持方向非常明确。' },
      { question: 'v0.dev生成的代码质量怎么样？能用于生产吗？', answer: 'v0.dev生成的代码质量较高，基于成熟的shadcn/ui组件库，代码风格规范、TypeScript类型完整、响应式设计到位。一般情况下可以直接用于生产环境。不过建议：1)审查生成的代码确保符合项目规范 2)调整样式匹配设计稿 3)补充单元测试。v0.dev生成的是基础代码，为你节省从零开始写UI的时间。' }
    ]
  },
  enhanceTool({ id: 'claude_code', name: 'Claude Code', logo: '🖥️', description: 'Anthropic推出的终端AI编程工具，支持项目级代码编辑、Git集成和自动化任务执行', url: 'https://claude.ai/code', price: 'paid', difficulty: 'intermediate', heat: 66, heatGrowth: 52, tags: ['AI编程', '终端工具', '代码助手'], techTags: ['CodeGen', 'GenerativeAI', 'Agent'], sceneTags: ['编程开发'], costTags: ['Paid', '需翻墙'], category: '编程开发', prompts: [{ id: 'p1', title: '项目代码重构', content: '请分析整个项目的代码结构，给出架构优化建议，并逐步执行重构', scene: '编程开发' }, { id: 'p2', title: 'Git工作流辅助', content: '帮我审查当前的Git diff，找出代码问题并生成有意义的commit message', scene: '编程开发' }], tips: ['直接在终端中运行，与开发工作流无缝集成', '支持理解和编辑大型代码库', '可与Claude Web端配合使用', '支持Agent模式自主完成复杂任务'], relatedSkills: ['skill_code_review', 'skill_vibe_coding'],
    features: ['终端原生体验：直接在终端中运行，与开发工作流无缝集成，无需离开命令行', '项目级代码理解：AI加载并理解整个项目的代码结构、依赖关系和架构设计', 'Git深度集成：直接读取Git diff、分支历史和PR上下文，基于版本信息给出精准建议', 'Agent自主模式：AI自主规划任务并多步骤执行（搜索代码→编辑→测试→修复）', '多文件编辑：一次处理多个文件，AI保持代码间的一致性和正确性', '问题诊断修复：自动分析编译错误和运行时异常，定位根因并修复', '代码重构增强：理解项目架构后给出重构方案并执行，支持大型代码库迁移', 'Claude 3.5/4模型：使用Claude系列最强模型，代码质量业界领先'],
    pricing: 'Claude Code需要Claude Pro订阅（$20/月）配合使用。Claude Code本身不单独收费，通过Claude Pro获取使用额度。Pro用户按API调用计费（每月5倍于免费版的额度，约可进行数千次编码操作）。Team版$25/人/月（团队额度共享），Enterprise版按需定价。相比Cursor（$20/月），Claude Code在终端场景的体验更原生，但缺少GUI编辑器支持。需翻墙使用。',
    pros: ['终端原生体验极佳：直接在命令行中工作，不需要切换窗口和IDE', '项目级理解能力突出：加载完整项目代码库，理解架构远超一般的代码补全工具', '代码质量业界顶级：基于Claude模型生成的代码准确度和可读性极高', 'Agent模式实用：自动完成多步骤开发任务，大幅提升开发效率'],
    cons: ['纯终端无GUI：没有代码编辑器的图形界面，不习惯命令行的用户上手困难', '价格较高：需要Claude Pro $20/月，且按API用量计费，重度使用成本高', '需稳定网络连接：实时调用云端模型，离线不可用', '对大型项目加载慢：分析大型代码库时首次加载时间较长'],
    targetAudience: ['终端重度开发者：习惯在命令行中工作的后端和全栈工程师', '开源项目维护者：需要快速理解和重构大型开源代码库的维护者', 'DevOps工程师：在日常运维和脚本开发中需要AI辅助的技术人员', 'AI编程效率追求者：希望使用最新AI技术提升编程效率的开发者', 'Claude生态用户：已经使用Claude并希望将AI能力延伸到终端的用户'],
    useCases: ['代码库批量重构：给Claude Code描述重构目标，AI自动分析项目并逐步执行多文件批量修改', 'Bug根因分析：粘贴错误堆栈信息，Claude Code搜索项目代码定位Bug根因并修复', 'Git PR代码审查：自动分析PR的代码变更，审查潜在Bug、安全漏洞和性能问题', '新功能模块添加：描述新功能需求，AI分析项目结构后自动创建完整的功能模块代码', '代码文档生成：分析项目代码后自动生成API文档、架构说明和README文件'],
    faqs: [
      { question: 'Claude Code和Cursor有什么区别？', answer: 'Claude Code是终端AI编程助手，Cursor是AI原生IDE。核心区别：1)Claude Code在终端中运行，不提供GUI；Cursor是完整的代码编辑器 2)Claude Code更适合后端/DevOps任务，Cursor更适合前端/全栈开发 3)Claude Code的项目理解深度更强（完整的代码库加载），Cursor的实时编码辅助更流畅（Tab补全等）。建议：两者互补使用——用Cursor写代码，用Claude Code做大型重构和代码审查。' },
      { question: 'Claude Code怎么安装和使用？', answer: '安装步骤：1)确保有Claude Pro订阅（$20/月）2)安装npm全局包：npm install -g @anthropic-ai/claude-code 3)在终端中进入项目目录，运行claude命令 4)AI会自动分析项目结构并进入对话模式。支持在项目根目录配置.claude.md文件为AI提供项目上下文信息。首次运行会加载项目索引，大型项目可能需要几分钟。' },
      { question: 'Claude Code能处理多大的代码库？', answer: 'Claude Code能处理中型到大型项目（约10万-50万行代码级别）。它会智能分析项目结构，不需要把全部代码加载到上下文中。通过Git历史和文件依赖关系理解代码。对于超大型项目（百万行以上），AI会优先关注修改过的文件和核心模块。实际使用中，对于常见的Web应用（Next.js、Django等）、后端服务等项目的处理效果非常好。' },
      { question: 'Claude Code支持哪些编程语言？', answer: '支持几乎所有主流编程语言。基于Claude模型的能力，对以下语言支持最好：TypeScript/JavaScript、Python、Rust、Go、Java、C++、Ruby、PHP。对前端框架（React、Vue、Next.js）和后端框架（Express、Django、Spring Boot）有深度理解。语言支持取决于Claude模型的能力，与语言类型无关。实际使用中，TypeScript/Python的支持效果最佳。' }
    ]
  }),

  { id: 'lovable', name: 'Lovable', logo: '💜', description: '前身为GPT Engineer，用自然语言对话快速构建网站和Web应用，全球增长最快的AI开发工具之一', url: 'https://lovable.dev', price: 'freemium', difficulty: 'beginner', heat: 55, heatGrowth: 45, tags: ['AI编程', 'Web开发', '无代码'], techTags: ['CodeGen', 'GenerativeAI'], sceneTags: ['编程开发'], costTags: ['Freemium', '需翻墙'], category: '编程开发', prompts: [{ id: 'p1', title: '网站构建', content: '帮我创建一个[网站类型]网站，包含首页、产品页、关于我们和联系页面，使用[技术栈]', scene: '编程开发' }, { id: 'p2', title: '应用功能添加', content: '为我的网站添加[功能描述]，包含前端UI和后端API', scene: '编程开发' }], tips: ['通过自然语言对话即可构建完整Web应用', '支持视觉编辑和实时预览', '生成的代码可直接导出和部署', '适合非技术用户快速建站'], relatedSkills: ['skill_vibe_coding'],
    features: [
      '对话式Web开发：通过自然语言对话逐步构建完整的网站和应用',
      '视觉编辑器：生成的页面支持拖拽式视觉编辑，所见即所得',
      '组件库集成：内置丰富的UI组件库，拖拽即用',
      'Supabase集成：内置Supabase数据库和认证支持，快速添加后端功能',
      '代码导出：生成的完整项目代码支持一键导出，可继续在其他IDE中开发',
      '一键部署：直接部署到生产环境，内置域名和SSL支持',
      '迭代开发：在已有项目基础上通过对话添加新功能或修改',
      'Supabase AI集成：与Supabase深度集成，自动生成数据库表结构和API'
    ],
    pricing: 'Lovable采用Freemium模式。免费版：每月约5次项目生成，基础组件，公开项目，带Lovable标识。Starter版$22/月（约¥160/月）：无限项目生成，私有项目，去品牌标识，自定义域名。Lovable++版$58/月：高级组件，优先支持，API访问。Team版$125/月：团队协作，品牌定制，管理后台。免费版适合体验和简单尝试，认真做项目建议Starter版起步。需翻墙使用。',
    pros: ['对话式开发体验：像和人聊天一样构建网站，最适合非技术用户', '视觉编辑+AI结合：AI生成后还能手动拖拽调整，灵活度高', 'Supabase深度集成：数据库、认证、存储等后端功能一键添加', '迭代开发方便：在现有项目基础上对话添加功能，比Bolt.new更灵活'],
    cons: ['价格较贵：$22/月起，比Bolt.new的$20/月和Cursor的$20/月贵', '免费版限额极少：每月5次项目生成，几乎只能体验', '生成代码质量中等：代码结构不如专业开发者手写的规范', '需翻墙使用：对中国用户有网络门槛'],
    targetAudience: ['非技术创业者：有产品想法但不会编程的创业者和产品经理', '建站公司：需要快速为客户搭建网站的中小建站服务商', '产品经理：需要快速构建产品原型的产品经理', '自由职业者：需要快速交付Web项目的独立开发者', '学生创业者：快速验证创业想法的学生团队'],
    useCases: ['创业公司官网：对话描述公司信息，AI生成包含首页/产品/团队/联系页面的官网', 'SaaS产品原型：描述SaaS应用的功能，Lovable生成完整的SaaS产品前端', '企业内部工具：创建内部使用的管理工具（如库存管理、任务分配系统）', '个人作品集网站：描述个人背景和作品，生成专业的个人作品集网站', '活动报名页面：生成包含报名表单、日程展示、嘉宾介绍的会议活动页面'],
    faqs: [
      { question: 'Lovable和Bolt.new哪个更好？', answer: 'Lovable优势：更强的视觉编辑能力（拖拽式调整）、Supabase深度集成、对话式体验更友好。Bolt.new优势：价格更便宜（$20 vs $22/月）、生成速度更快、WebContainers技术更成熟。选择建议：非技术用户选Lovable（视觉编辑更友好），有一定技术基础选Bolt.new（生成质量和速度更好）。两个工具都很优秀，建议都体验免费版再决定。' },
      { question: 'Lovable免费版能做什么？', answer: '免费版每月5次项目生成，可以建简单的单页或多页网站。功能限制：公开项目（源代码公开）、带Lovable品牌标识、基础组件库。适合：试试看Lovable是否适合你的工作流、搭建个人简单项目。如果要建商业项目或需要隐私保护，Starter版（$22/月）是起步选择。' },
      { question: 'Lovable需要编程基础吗？', answer: '不需要编程基础。Lovable的核心卖点就是\"零代码Web开发\"。你只需要用自然语言描述需求（如\"帮我创建一个包含产品展示和联系表单的公司官网\"），AI会自动生成代码和页面。生成的页面还可以通过拖拽编辑器手动调整。不过，如果会一些HTML/CSS的基础知识，能更好地定制生成的页面效果。' },
      { question: 'Lovable支持中文吗？', answer: '支持中文对话。你可以用中文描述需求，Lovable能理解并生成对应的网站。但生成的代码和UI中的默认文字为英文，需要手动改成中文。建议先用中文描述功能需求，然后手动将UI中的占位文字改成中文内容。对于面向国内用户的网站，推荐使用Lovable生成框架后手动本地化。' }
    ]
  },

  // ===== 新增工具：音频生成类 =====
  { id: 'udio', name: 'Udio', logo: '🎵', description: '前DeepMind团队打造的AI音乐生成平台，Suno最强竞品，支持生成带歌词的高质量完整歌曲', url: 'https://www.udio.com', price: 'freemium', difficulty: 'beginner', heat: 50, heatGrowth: 32, tags: ['AI音乐', '音乐生成', '音频工具'], techTags: ['GenerativeMedia', 'AudioAI'], sceneTags: ['内容创作', '音乐制作', '短视频'], costTags: ['Freemium', '需翻墙'], category: '音频生成', prompts: [{ id: 'p1', title: '流行歌曲生成', content: 'Create a pop song about [topic], upbeat, catchy melody, with lyrics in [language], verse-chorus structure', scene: '音乐创作' }, { id: 'p2', title: '背景音乐制作', content: 'Generate an instrumental background track, [genre/mood], suitable for [scenario], approximately 2 minutes', scene: '视频配乐' }], tips: ['生成的音乐质量高，可与Suno媲美', '支持自定义歌词和风格', '免费用户每天有生成次数限制', '已与环球音乐达成合作，版权合规'], relatedSkills: [],
    features: [
      '高音质歌曲生成：生成带歌词的完整歌曲，音质和混音水平接近专业制作',
      '自定义歌词：支持输入自定义歌词，AI根据歌词内容和情感生成匹配的旋律',
      '多种音乐风格：支持流行、摇滚、R&B、爵士、电子、古典等数十种风格',
      '乐器编曲丰富：生成的多轨编曲（鼓、吉他、键盘、弦乐等）自然融合',
      '人声演唱自然：生成的AI人声演唱非常自然，呼吸感和情感表达到位',
      '背景音乐生成：支持无歌词的纯音乐生成，适合视频配乐和播客背景',
      '歌曲扩展：在已有片段基础上继续生成或延伸，构建完整歌曲结构',
      '版权合规：已与环球音乐集团达成版权合作，商业使用有保障'
    ],
    pricing: 'Udio采用Freemium模式。免费版：每天约10次生成额度，标准音质，基础风格，每次生成约30秒。Standard版$10/月（约¥73/月）：每月1200次生成额度，高清音质，全部风格，最长2分钟。Pro版$30/月：无限生成，最高音质，商业授权，优先队列。免费版适合体验和简单创作，音乐创作者建议Standard版。相比Suno（$10-30/月），Udio在音质和混音质量上略胜一筹。需翻墙使用。',
    pros: ['音质和混音出色：生成的歌曲混音质量高，旋律悦耳自然', '人声演唱自然逼真：AI人声的呼吸感和情感表达非常自然', '歌词理解能力强：能根据歌词内容的情感风格匹配合适的旋律', '与环球音乐合作版权合规：商业使用风险低，适合商用场景'],
    cons: ['免费额度较少：每天10次，大量创作需付费', '中文歌词支持一般：中文歌词的发音和旋律匹配不如英文自然', '需翻墙使用：对中国用户有网络门槛', '生成结果可控性有限：指定特定的音乐细节（如和弦进行）比较困难'],
    targetAudience: ['音乐创作者：需要快速生成音轨灵感的作曲人和音乐制作人', '短视频创作者：需要背景音乐和配乐的抖音/TikTok创作者', '内容创作者：需要为播客、视频和广告制作专属音乐的创作者', '独立音乐人：预算有限但需要高品质音乐制作的独立音乐人', '音乐爱好者：对AI音乐生成感兴趣的音乐爱好者和发烧友'],
    useCases: ['短视频BGM制作：输入氛围描述（如"欢快的夏日风格"），生成专属背景音乐', '歌曲创作灵感：输入主题歌词片段，AI生成完整歌曲作为创作灵感参考', '广告配乐制作：描述品牌调性和广告场景，生成匹配的广告配乐', '播客片头片尾：生成独特的播客开场音乐和结束音乐，打造品牌辨识度', '个人专辑实验：尝试不同风格（民谣/电子/爵士等），生成完整歌曲体验'],
    faqs: [
      { question: 'Udio和Suno哪个更好？', answer: 'Udio优势：音质更好（混音和编曲更专业）、人声更自然、与环球音乐有版权合作。Suno优势：生成速度更快、中文歌词支持更好、v4版本对歌词旋律匹配大幅改进。总体而言，Udio在音质上略胜一筹，Suno在功能和中文支持上更好。建议：两个都体验一下免费版，看哪个的音乐风格更符合你的品味。很多用户同时使用两个工具。' },
      { question: 'Udio生成的歌曲可以商用吗？', answer: 'Udio已与环球音乐集团达成版权合作，Pro版（$30/月）用户生成的音乐可以用于商业用途。免费版和Standard版生成的音乐使用限制较多，建议商用场景订阅Pro版。Udio在版权合规方面比Suno更加明确，这也是一些音乐制作人选择Udio的原因。商用前请阅读Udio的最新使用条款。' },
      { question: 'Udio支持中文歌词吗？效果如何？', answer: '支持输入中文歌词生成歌曲，但效果不如英文好。中文歌词的发音准确度和英文相比有一定差距，某些音节的咬字不够清晰，旋律与歌词的匹配度也有提升空间。如果主要做英文歌曲，Udio表现很好。如果需要做中文歌曲，Suno对中文歌词的支持目前更好一些。建议先用英文测试Udio的能力。' },
      { question: 'Udio免费版每天能生成多少次？', answer: '免费版每天约10次生成额度。每次生成可选择长度为30秒或更短，提供2个版本供选择。如果想尝试更多的音乐风格或需要更长的歌曲，Standard版（$10/月）每月1200次生成额度，每次最长2分钟，对大多数创作者来说已经足够。建议先体验免费版确认Udio适合你的创作需求后再升级。' }
    ]
  },
  { id: 'otter_ai', name: 'Otter.ai', logo: '📝', description: 'AI会议转录和笔记工具，实时语音转文字，自动生成会议纪要和行动项', url: 'https://otter.ai', price: 'freemium', difficulty: 'beginner', heat: 48, heatGrowth: 20, tags: ['会议转录', '语音转文字', '办公工具'], techTags: ['AudioAI', 'NLP', 'Speech-To-Text'], sceneTags: ['办公提效', '企业AI自动化'], costTags: ['Freemium', '需翻墙'], category: '办公工具', prompts: [{ id: 'p1', title: '会议记录整理', content: '从以下会议转录文本中提取：讨论主题、关键决策、待办事项和负责人：[转录文本]', scene: '办公提效' }, { id: 'p2', title: '采访转录整理', content: '将以下采访录音的转录文本整理为Q&A格式，保留关键引用：[转录文本]', scene: '内容创作' }], tips: ['支持Zoom、Google Meet等会议平台的实时转录', 'AI自动生成会议摘要和行动项', '支持搜索历史会议内容', '免费版每月300分钟转录额度'], relatedSkills: ['skill_meeting_summary'],
    features: [
      '实时会议转录：在Zoom、Google Meet、Teams等会议中实时转写语音为文字',
      'AI会议摘要：自动生成结构化会议摘要，包含讨论主题、关键决策和行动项',
      '行动项提取：AI自动识别会议中的待办事项，分配负责人和截止日期',
      '会议记录搜索：支持搜索历史所有会议记录，快速找到之前的讨论内容',
      '说话人识别：自动区分不同说话人，标注谁说了什么',
      '关键词标注：自动标记会议中的重要名词和术语，生成关键词列表',
      '导出分享：支持导出为文本/PDF/Word格式，方便分享给未参会人员',
      '移动App录制：手机App支持现场会议录音并自动转写'
    ],
    pricing: 'Otter.ai采用Freemium模式。免费版：每月300分钟转录额度，每次会议最长30分钟，基础AI摘要。Pro版$16.99/月（约¥123/月）：每月1200分钟，每次会议最长90分钟，高级AI功能。Business版$30/月/人：无限转录额度，团队管理，集成SSO。免费版适合个人轻度使用，办公用户建议Pro版。相比其他会议转录工具，Otter.ai的AI摘要质量很高。需翻墙使用。',
    pros: ['实时转录准确率高：英文会议转录准确率约95%，在会议转录工具中领先', 'AI摘要质量高：自动生成的会议摘要结构化清晰，关键信息提取准确', '与会议平台深度集成：Zoom/Meet/Teams的集成体验流畅，自动加入会议', '搜索功能强大：支持搜索历史会议内容，快速定位之前讨论过的话题'],
    cons: ['中文转录效果差：主要针对英文优化，中文转录准确率低', '需翻墙使用且不支持国内会议平台：无法用于飞书/腾讯会议/钉钉', '免费额度有限：每月300分钟，频繁开会不够用', '定价偏高：Pro版$16.99/月，对个人用户来说价格不低'],
    targetAudience: ['海外职场人士：在英文环境中频繁开会的跨国企业员工', '远程团队管理者：需要通过会议记录同步信息的管理者', '记者和采访者：需要转录采访录音并整理为文字的内容创作者', '留学生和研究人员：需要转录英文课程和学术会议的师生', '产品经理：需要记录和整理产品需求评审会议的PM'],
    useCases: ['英文会议实时转录：在Zoom会议中自动记录并转写讨论内容，会后生成摘要', '采访录音整理：导入采访录音文件，AI自动转写为文字并提取关键引用', '课堂笔记生成：在英文网课中实时转写教学内容，课后生成课堂笔记', '客户会议记录：记录客户需求讨论会，AI提取需求要点和后续行动项', '头脑风暴整理：将团队头脑风暴会议的录音转写并整理为结构化创意列表'],
    faqs: [
      { question: 'Otter.ai支持中文吗？', answer: 'Otter.ai主要针对英文优化，英文转录准确率约95%，但中文转录准确率很低（约50-60%），不推荐用于中文会议。如果需要中文会议转录，建议使用：讯飞听见（国产、中文转录领先）、飞书妙记（飞书内置会议转录）。Otter.ai当前更适合需要处理英文会议的用户。' },
      { question: 'Otter.ai免费版够用吗？', answer: '免费版每月300分钟转录额度，每次会议最长30分钟。如果每周开3-5次会，每次30分钟，大约够用。超出300分钟后需要等待下月重置。建议：先使用免费版体验，如果确定Otter.ai对你的工作帮助很大，再升级Pro版（$16.99/月、1200分钟/月）。Otter.ai的定价在同类产品中处于中等水平。' },
      { question: 'Otter.ai支持哪些会议平台？', answer: '深度集成Zoom、Google Meet、Microsoft Teams、Cisco Webex。在这些会议中Otter可以自动加入并开始转录。安装Otter Chrome扩展后，点击日历中的会议链接即可自动连接Otter转录。Firefox和Safari支持略差。注意：Otter不支持国内的飞书、腾讯会议、钉钉等平台。' },
      { question: 'Otter.ai和讯飞听见有什么区别？', answer: '1)语言支持：Otter擅长英文，讯飞擅长中文 2)实时转录：Otter支持Zoom/Meet实时转录，讯飞支持现场录音 3)AI摘要：Otter的AI摘要质量更高、结构化更好 4)价格：Otter免费版300分钟/月，讯飞听见免费版较少 5)国内可用：讯飞在国内可以正常使用，Otter需要翻墙。选哪个取决于你的主要工作语言和使用场景。' }
    ]
  },

  // ===== 新增工具：搜索工具类 =====
  { id: 'metaso', name: '秘塔AI搜索', logo: '🔎', description: '中国增长最快的AI搜索引擎，无广告、结构化展示结果，支持深度研究和学术搜索', url: 'https://metaso.cn', price: 'free', difficulty: 'beginner', heat: 56, heatGrowth: 50, tags: ['AI搜索', '中文搜索', '研究工具'], techTags: ['Search', 'RAG', 'NLP'], sceneTags: ['学术研究', '办公提效', '编程开发'], costTags: ['Free', '中文友好'], category: '搜索工具', prompts: [{ id: 'p1', title: '深度研究模式', content: '对\\\"[研究主题]\\\"进行深度研究，生成研究报告：包含背景、现状、关键争议和未来展望，附带来源', scene: '学术研究' }, { id: 'p2', title: '行业分析', content: '请搜索[行业名称]的最新动态，整理出：市场概况、主要玩家、技术趋势、政策变化', scene: '办公提效' }], tips: ['搜索结果无广告，体验纯净', '支持深度研究模式，可生成研究报告', '已集成DeepSeek R1推理模型', '支持学术搜索和结构化结果展示'], relatedSkills: [],
    features: ['无广告纯净搜索：搜索结果完全没有广告，信息呈现简洁高效', '深度研究模式：输入研究主题，AI自动生成包含背景、现状、争议和展望的结构化研究报告', 'AI结构化回答：搜索结果以卡片、列表、时间线等结构化形式呈现，一目了然', '学术搜索专项：针对学术论文和研究文献的优化搜索模式', 'DeepSeek R1集成：内置DeepSeek R1推理模型，支持深度推理和逻辑分析', '思维导图生成：搜索结果自动生成思维导图，帮助梳理信息结构', '来源标注：每个回答都附带来源链接，支持一键验证', '大纲/PPT导出：研究结果可一键导出为大纲或PPT格式'],
    pricing: '秘塔AI搜索完全免费，无需付费订阅，无搜索次数限制。免费使用深度研究模式、学术搜索、DeepSeek R1推理模型、PDF导出等全部功能。秘塔AI搜索当前的商业模式是通过免费策略快速获取用户，未来可能推出企业版增值服务。注册即用，无需翻墙，微信/手机号登录即可。',
    pros: ['完全无广告：搜索结果页面干净，没有任何广告干扰，体验极佳', '深度研究模式强大：自动生成结构化研报，远超传统搜索的链接列表', '中文搜索质量高：针对中文搜索深度优化，结果准确且信息全面', '思维导图功能实用：搜索结果自动生成导图，信息整理效率翻倍'],
    cons: ['搜索范围有限：主要覆盖中文互联网内容，英文和跨语言搜索能力弱于Perplexity', '信息更新速度一般：对于突发新闻和时效性信息，不如传统搜索引擎及时', '深度研究模式慢：生成研究报告需要30秒-2分钟，等待时间较长', '搜索结果来源偏重中文：在搜索国际化话题时，信息来源多样性不够'],
    targetAudience: ['学术研究者：需要快速检索和梳理研究资料的论文写作者', '大学生/研究生：做课程作业、论文文献综述、课题研究的在校学生', '知识工作者：日常需要信息检索和知识整理的咨询师、分析师', '办公白领：需要快速查找资料、整理报告的职场人士', '所有不想看到广告的用户：对搜索引擎广告泛滥感到厌倦的普通用户'],
    useCases: ['文献综述研究：输入研究主题，秘塔自动搜索并整理相关论文、文章和观点，生成研究背景综述', '行业分析报告：输入行业名称，AI自动搜索并生成包含市场规模、竞争格局、趋势预测的完整报告', '课堂作业辅助：输入课程主题，秘塔生成结构化的知识点梳理和参考资料列表', '竞品信息调研：输入竞品名称，AI自动整理竞品的产品、价格、市场策略等信息', '方案前期调研：在写方案前用深度研究模式快速获取相关领域的全面信息'],
    faqs: [
      { question: '秘塔AI搜索和百度搜索有什么区别？', answer: '核心区别：1)秘塔无广告，百度搜索前面几页都是广告 2)秘塔用AI生成结构化答案而非链接列表 3)秘塔支持深度研究模式自动生成报告 4)秘塔搜索结果更智能（思维导图、大纲导出）。百度在覆盖面（特别是本地生活、实时信息）上更广。建议：需要深度研究和无广告体验用秘塔，日常简单查询用百度也可。' },
      { question: '秘塔AI搜索的深度研究模式怎么用？效果怎么样？', answer: '在搜索框中输入研究主题后，点击"深度研究"按钮。AI会：1)自动搜索多个来源的信息 2)分析整合关键内容 3)生成包含背景、现状、关键争议、未来展望的结构化研报。效果非常出色，生成的研究报告可以直接作为初稿使用。注意：深度研究模式耗时约30秒-2分钟。' },
      { question: '秘塔AI搜索完全免费吗？会收费吗？', answer: '目前完全免费，所有功能（包括深度研究模式和DeepSeek R1模型）全部免费使用，无搜索次数限制。秘塔目前的核心策略是通过免费获取用户和口碑，未来可能会推出企业版本或增值服务，但基础搜索功能预计会保持免费。作为国产AI搜索工具，秘塔的免费策略非常良心。' },
      { question: '秘塔AI搜索支持英文搜索吗？', answer: '支持，但搜索效果不如中文好。秘塔的核心优势是中文搜索，对中文内容的索引和理解的准确率很高。如果需要搜索英文内容或跨语言信息，建议使用Perplexity。秘塔适合：中文资料检索、学术论文中文版搜索、行业研究报告。' }
    ]
  },
  { id: 'tiangong_ai', name: '天工AI', logo: '🌌', description: '昆仑万维推出的AI搜索助手，集成DeepSeek R1推理模型，支持超长文本分析和联网搜索', url: 'https://www.tiangong.cn', price: 'free', difficulty: 'beginner', heat: 50, heatGrowth: 28, tags: ['AI搜索', 'AI对话', '中文AI'], techTags: ['Search', 'NLP', 'RAG'], sceneTags: ['办公提效', '学术研究', '编程开发'], costTags: ['Free', '中文友好'], category: '搜索工具', prompts: [{ id: 'p1', title: '长文档分析', content: '请分析以下长文档/报告的要点，提取核心观点、数据支持和结论：[文档内容]', scene: '学术研究' }, { id: 'p2', title: '综合信息检索', content: '搜索并整理关于[主题]的综合信息，包含各方观点、数据支撑和相关链接', scene: '办公提效' }], tips: ['支持500K超长文本分析', '集成DeepSeek R1增强推理能力', '支持PC客户端，体验流畅', '免费使用，无需翻墙'], relatedSkills: [],
    features: [
      'AI搜索：集成大模型的智能搜索引擎，理解自然语言查询意图',
      '500K超长文本分析：一次可处理约75万汉字的超长文本，比Kimi的200K更长',
      'DeepSeek R1推理：内置DeepSeek R1推理模型，支持复杂逻辑推理和深度分析',
      '联网搜索实时信息：AI可实时搜索互联网，回答最新时效性问题',
      '文档上传分析：支持上传PDF、Word、Excel等格式文档进行智能分析',
      'AI对话助手：除搜索外也是通用AI对话助手，支持多轮对话',
      'PC客户端：提供Windows/Mac桌面客户端，体验流畅',
      '创作辅助：支持AI写作、翻译、润色等创作功能'
    ],
    pricing: '天工AI完全免费使用。所有功能包括AI搜索、500K超长文本分析、DeepSeek R1推理模型、联网搜索、文档分析等全部免费开放，无搜索次数限制，无对话次数上限。无需付费订阅，无需翻墙。作为昆仑万维的战略产品，天工AI目前通过免费策略快速获取用户。未来可能推出企业版或增值服务，但基础搜索功能预计保持免费。注册简单，手机号或微信登录即可。',
    pros: ['500K超长上下文：可一次处理75万字内容，是目前上下文最长的AI工具之一', '集成DeepSeek R1：内置顶级推理模型，复杂推理能力强于一般AI搜索工具', '完全免费使用：无任何费用和次数限制，国产工具性价比极高', 'PC客户端体验流畅：桌面端应用比网页版响应更快，适合深度使用'],
    cons: ['搜索结果不如秘塔结构化：搜索结果的组织和展示不如秘塔AI搜索清晰', 'AI回复速度偏慢：处理长文本和深度搜索时响应时间较长', '界面设计一般：UI设计较为传统，用户体验不如同类产品精致', '品牌知名度不如头部产品：相比秘塔、Kimi等产品，用户认知度偏低'],
    targetAudience: ['科研人员：需要处理和分析超长研究论文和文献的学者', '大学生和研究生：需要写论文、做研究、查资料的在校学生', '知识工作者：需要频繁查阅和分析长文档的咨询师、分析师', '深度阅读爱好者：喜欢阅读长篇报告和书籍并做笔记的用户', '国产AI搜索用户：希望使用国产免费AI搜索工具的普通用户'],
    useCases: ['超长论文分析：上传50页以上的学术论文PDF，AI提取核心观点、方法和结论', '行业报告解读：上传数百页的行业研究报告，AI生成精简版摘要和关键发现', 'DeepSeek推理问答：输入需要深度推理的问题（如数学证明、逻辑推理题），利用R1模型解答', '联网实时搜索：查询最新热点事件，AI联网搜索并整理多方观点', '多文档对比分析：上传多个文档让AI对比分析，找出异同点和关联关系'],
    faqs: [
      { question: '天工AI的500K超长上下文实际体验如何？', answer: '500K上下文约等于75万汉字（相当于《三体》三部曲的全部内容）。实测：上传200页的PDF文档能完整理解和分析，500页的文档也能记住大部分关键内容。超长文本分析时AI响应速度较慢（约20-60秒），但分析质量不错。这是天工AI区别于同类产品的最核心优势，适合需要处理大量文档的研究者。' },
      { question: '天工AI搜索和秘塔AI搜索哪个好？', answer: '天工AI优势：500K超长上下文（远超秘塔）、DeepSeek R1推理模型、PC客户端体验好。秘塔优势：搜索结果结构化更清晰（思维导图/卡片布局）、深度研究模式更专业、无广告体验更纯净。建议：需要超长文本分析用天工，需要结构化搜索结果和深度研究用秘塔。两个工具免费，建议都试试。' },
      { question: '天工AI需要翻墙吗？怎么注册？', answer: '完全不需要翻墙。访问tiangong.cn，用中国大陆手机号或微信扫码即可注册。支持Web网页版和PC客户端（Windows/Mac）。天工AI是国内合规产品，所有数据存储在国内服务器，使用体验流畅。对于不方便翻墙的国内用户，天工AI是体验AI搜索和超长文本分析的好选择。' },
      { question: '天工AI的DeepSeek R1推理模型有什么特别之处？', answer: 'DeepSeek R1是深度求索推出的推理增强大模型，在数学推理、逻辑分析、编程等需要深度思考的任务上表现优异。天工AI集成R1后，用户可以选择使用R1模式进行推理任务，如：复杂数学题解答、代码逻辑分析、多步推理问题等。相比普通AI搜索的快速回答，R1模式更深度、更准确，但响应速度稍慢。' }
    ]
  },
  { id: 'felo', name: 'Felo', logo: '🌍', description: '日本初创公司Sparticle推出的多语言AI搜索引擎，擅长跨语言信息检索和知识发现', url: 'https://felo.ai', price: 'free', difficulty: 'beginner', heat: 44, heatGrowth: 35, tags: ['AI搜索', '多语言', '知识发现'], techTags: ['Search', 'RAG', 'NLP'], sceneTags: ['学术研究', '办公提效'], costTags: ['Free', '中文友好'], category: '搜索工具', prompts: [{ id: 'p1', title: '跨语言信息检索', content: '帮我搜索[主题]的英文资料并翻译成中文，整理核心观点和关键数据', scene: '学术研究' }, { id: 'p2', title: '多角度话题分析', content: '从全球视角分析[话题]，搜索不同语言和地区的信息，呈现多角度观点', scene: '办公提效' }], tips: ['支持中、英、日、韩等多语言搜索', 'AI自动翻译搜索结果', '适合进行国际信息和学术文献检索', '免费使用'], relatedSkills: [],
    features: [
      '多语言搜索：支持中文、英文、日文、韩文等多语言混合搜索',
      '跨语言翻译：搜索结果自动翻译为用户设定的语言，无需手动翻译',
      '全球信息整合：从不同语言和地区的来源整合信息，呈现多角度观点',
      'AI智能摘要：搜索结果的AI摘要，快速获取核心信息和关键数据',
      '知识图谱构建：自动构建搜索主题的知识图谱，展示相关概念和关系',
      '学术文献搜索：针对学术论文和科研文献的优化搜索模式',
      '来源追踪：每个答案都标注信息源，支持一键查看原文',
      '话题探索：输入宽泛话题，AI自动探索多个相关维度并呈现结构化结果'
    ],
    pricing: 'Felo完全免费使用。所有功能包括多语言搜索、跨语言翻译、AI摘要、知识图谱等全部免费开放，无搜索次数限制。目前处于用户增长期，通过免费策略获取用户。由日本Sparticle公司开发运营，对中国用户友好，无需翻墙即可访问。注册：邮箱注册即可，无需手机号。未来可能推出付费增值服务（如更深度研究模式、API访问等），但基础搜索功能预计保持免费。',
    pros: ['跨语言搜索独家优势：能搜索不同语言的信息并自动翻译，适合国际研究', '多角度信息呈现：从不同语言和地区的来源整合信息，避免信息偏见', '完全免费使用：无任何费用和限制，对学术研究者非常友好', '无需翻墙：在中国大陆可直接访问，没有网络门槛'],
    cons: ['中文搜索质量一般：中文信息的索引和搜索效果不如秘塔和百度', '搜索速度偏慢：跨语言搜索需要翻译和整合，响应时间较长', 'AI智能水平一般：AI摘要和推理能力不如秘塔和天工', '用户社区较小：教程和使用案例较少，遇到问题不易找到解决方案'],
    targetAudience: ['学术研究者：需要跨语言检索国际学术文献的研究人员', '留学生：需要在不同语言环境中搜索资料的海外留学生', '国际业务从业者：需要了解全球市场信息的跨境电商/外贸从业者', '信息研究者：需要多角度了解国际话题的记者和分析师', '多语言使用者：经常需要在中文/英文/日文等多语言环境中切换的用户'],
    useCases: ['跨语言文献综述：用中文搜索英文和日文的学术资料，AI自动翻译并整理综述', '国际市场调研：搜索不同国家关于同一产品/行业的报道，对比市场认知差异', '国际新闻多角度解读：搜索同一新闻事件的中文/英文/日文报道，对比各国观点', '外语资料快速阅读：粘贴外文文章链接，Felo自动翻译并生成中文摘要', '技术文档国际化：搜索不同语言版本的技术文档，整合为统一的知识参考'],
    faqs: [
      { question: 'Felo和其他AI搜索引擎比有什么独特优势？', answer: 'Felo的核心优势是跨语言搜索。当你搜索一个主题时，它不只搜索中文来源，还会同时搜索英文、日文、韩文等多种语言的信息，并通过AI翻译整合呈现。例如搜索\"AI regulation\"，可以看到中美欧三地对AI监管的不同报道角度。其他AI搜索工具（秘塔、天工）主要覆盖中文网络，Felo的国际视野是其独特卖点。' },
      { question: 'Felo在中国能用吗？需要翻墙吗？', answer: 'Felo在中国大陆可以正常访问和使用，无需翻墙。Sparticle公司为日本初创企业，但Felo的服务在中国可以访问。注册使用邮箱即可，不需要手机号。对于需要搜索国际信息但又不想翻墙的中国用户，Felo是一个很好的工具。但在中文搜索质量上，不如秘塔AI搜索和百度。' },
      { question: 'Felo的搜索准确度怎么样？', answer: '英文和日文搜索准确度较高，中文搜索准确度一般。跨语言搜索时，AI翻译的质量也会影响最终结果的准确性。建议：搜索国际话题时效果最好（如国际新闻、学术研究），搜索纯中文内容时效果不如国内主流搜索工具。Felo更适合作为辅助搜索工具，与秘塔等工具配合使用。' },
      { question: 'Felo适合做学术研究吗？', answer: '适合。Felo的跨语言搜索能力对学术研究很有帮助：1)可以同时搜索中英文论文和资料 2)自动翻译外文摘要 3)整合不同语言的研究成果 4)标注信息来源方便引用。但需要注意：Felo的学术文献索引深度不如Google Scholar和专业学术数据库，建议作为辅助工具，核心文献检索还是在专业学术库中进行。' }
    ]
  },
];

// 完整的Skills库 - 由skill-generator.js自动生成和维护
export const skills: Skill[] = [
  // ===== 内容创作类 =====
  { id: 'skill_xhs_rewrite', name: '小红书文案改写', description: '将普通文案改写成小红书风格的爆款文案，支持种草/测评/干货等多场景', category: '内容创作', difficulty: 'beginner', author: 'AI导航站', version: '1.2.0', installCount: 12500, successRate: 94, rating: 4.8, price: 'free', compatibility: ['ChatGPT', 'Claude', 'Kimi', '文心一言'], workflow: [{ step: 1, title: '输入原文案', description: '提供需要改写的原始文案' }, { step: 2, title: '选择风格', description: '选择目标风格（种草/测评/干货/ Plog）' }, { step: 3, title: 'AI改写', description: '生成3个小红书风格的文案版本' }, { step: 4, title: '优化调整', description: '根据需要微调后发布' }], dependencies: [], input: '原始文案 + 目标风格', output: '小红书风格爆款文案', icon: '📕', heatGrowth: 25.3 },
  { id: 'skill_wechat_article', name: '公众号文章生成', description: '自动生成适合微信公众号的高质量文章，支持多种写作风格', category: '内容创作', difficulty: 'beginner', author: 'AI导航站', version: '1.1.0', installCount: 8900, successRate: 92, rating: 4.7, price: 'free', compatibility: ['ChatGPT', 'Claude', 'Kimi'], workflow: [{ step: 1, title: '输入主题', description: '确定文章主题和核心观点' }, { step: 2, title: '选择风格', description: '选择写作风格（专业/亲和/故事化）' }, { step: 3, title: 'AI生成', description: '生成完整文章包含标题、开头、正文、结尾' }, { step: 4, title: '配图建议', description: '获取文章配图建议' }], dependencies: [], input: '文章主题 + 风格偏好', output: '完整公众号文章', icon: '📝', heatGrowth: 22.1 },
  { id: 'skill_short_video_script', name: '短视频脚本创作', description: '为抖音/快手/视频号生成爆款短视频脚本，包含分镜和台词', category: '内容创作', difficulty: 'intermediate', author: 'AI导航站', version: '1.3.0', installCount: 15600, successRate: 89, rating: 4.9, price: 'free', compatibility: ['ChatGPT', 'Kimi', 'Claude'], workflow: [{ step: 1, title: '输入主题', description: '确定视频主题和目标受众' }, { step: 2, title: '选择类型', description: '选择视频类型（种草/剧情/知识/搞笑）' }, { step: 3, title: 'AI生成脚本', description: '生成完整分镜脚本' }, { step: 4, title: '台词优化', description: '优化台词提升完播率' }], dependencies: [], input: '视频主题 + 类型', output: '完整短视频脚本', icon: '🎬', heatGrowth: 35.6 },
  { id: 'skill_weibo_content', name: '微博文案生成', description: '生成适合微博平台的短文案，支持话题标签和热门玩法', category: '内容创作', difficulty: 'beginner', author: 'AI导航站', version: '1.0.0', installCount: 5600, successRate: 91, rating: 4.6, price: 'free', compatibility: ['ChatGPT', 'Kimi', '文心一言'], workflow: [{ step: 1, title: '输入核心信息', description: '提供要传播的核心信息' }, { step: 2, title: '选择玩法', description: '选择微博玩法（话题/抽奖/互动）' }, { step: 3, title: 'AI生成', description: '生成多个文案版本' }], dependencies: [], input: '核心信息 + 玩法', output: '微博文案', icon: '📱', heatGrowth: 15.2 },
  { id: 'skill_ecommerce_copy', name: '电商商品描述', description: '为淘宝/京东/拼多多等平台生成高转化率的商品卖点文案', category: '内容创作', difficulty: 'beginner', author: 'AI导航站', version: '1.2.0', installCount: 11200, successRate: 93, rating: 4.8, price: 'free', compatibility: ['ChatGPT', 'Claude', 'Kimi'], workflow: [{ step: 1, title: '输入商品信息', description: '提供商品名称、特点、卖点' }, { step: 2, title: '选择平台', description: '选择目标电商平台' }, { step: 3, title: 'AI生成', description: '生成主图视频脚本+详情页文案' }], dependencies: [], input: '商品信息 + 平台', output: '商品文案 + 主图脚本', icon: '🛒', heatGrowth: 28.4 },
  { id: 'skill_zhihu_article', name: '知乎文章/问答生成', description: '生成高质量知乎回答和文章，融合专业深度与可读性，适合各领域知识分享', category: '内容创作', difficulty: 'beginner', author: 'AI导航站', version: '1.0.0', installCount: 7200, successRate: 91, rating: 4.7, price: 'free', compatibility: ['ChatGPT', 'Claude', 'Kimi'], workflow: [{ step: 1, title: '输入问题', description: '提供知乎问题或文章主题' }, { step: 2, title: '选择风格', description: '选择专业/故事/干货风格' }, { step: 3, title: 'AI生成', description: '生成完整回答或文章' }, { step: 4, title: '优化排版', description: '优化标题和分段结构' }], dependencies: [], input: '问题/主题 + 风格', output: '知乎文章/回答', icon: '❓', heatGrowth: 22.6 },
  { id: 'skill_tiktok_script', name: 'TikTok/Reels短脚本', description: '为TikTok、Instagram Reels、YouTube Shorts生成高完播率的短脚本', category: '内容创作', difficulty: 'beginner', author: 'AI导航站', version: '1.0.0', installCount: 9800, successRate: 88, rating: 4.6, price: 'free', compatibility: ['ChatGPT', 'Claude', 'Kimi'], workflow: [{ step: 1, title: '输入主题', description: '确定视频主题和目标受众' }, { step: 2, title: '选择时长', description: '选择15秒/30秒/60秒' }, { step: 3, title: 'AI生成', description: '生成开头钩子+正文+CTA' }, { step: 4, title: '优化完播率', description: '优化节奏和关键帧' }], dependencies: [], input: '主题 + 时长', output: '短脚本', icon: '📱', heatGrowth: 33.4 },
  { id: 'skill_news_release', name: '新闻稿写作', description: '撰写专业新闻稿/公关稿，符合媒体发布标准，含标题、导语、正文和背景', category: '内容创作', difficulty: 'intermediate', author: 'AI导航站', version: '1.0.0', installCount: 4800, successRate: 90, rating: 4.5, price: 'free', compatibility: ['ChatGPT', 'Claude'], workflow: [{ step: 1, title: '输入事件', description: '描述新闻事件核心信息' }, { step: 2, title: '选择角度', description: '选择报道角度和传播目标' }, { step: 3, title: 'AI生成', description: '生成完整新闻稿' }, { step: 4, title: '引用优化', description: '优化引语和数据部分' }], dependencies: [], input: '事件描述 + 角度', output: '专业新闻稿', icon: '📰', heatGrowth: 16.8 },
  { id: 'skill_seo_article', name: 'SEO文章优化', description: '针对搜索引擎优化文章内容，提升关键词排名和搜索流量', category: '内容创作', difficulty: 'intermediate', author: 'AI导航站', version: '1.0.0', installCount: 8600, successRate: 87, rating: 4.6, price: 'free', compatibility: ['ChatGPT', 'Claude', 'Kimi'], workflow: [{ step: 1, title: '输入主题', description: '确定文章主题和目标关键词' }, { step: 2, title: '关键词分析', description: 'AI分析相关长尾关键词' }, { step: 3, title: 'AI生成', description: '生成SEO友好文章' }, { step: 4, title: '优化元数据', description: '优化标题标签和Meta描述' }], dependencies: [], input: '主题 + 关键词', output: 'SEO优化文章', icon: '🔍', heatGrowth: 24.2 },

  // ===== 办公提效类 =====
  { id: 'skill_auto_ppt', name: '自动PPT生成', description: '根据主题自动生成专业PPT大纲和内容，支持多种风格模板', category: '办公提效', difficulty: 'beginner', author: 'AI导航站', version: '1.3.0', installCount: 19800, successRate: 91, rating: 4.7, price: 'free', compatibility: ['Gamma', 'ChatGPT', 'Kimi'], workflow: [{ step: 1, title: '输入主题', description: '提供PPT的主题和大纲' }, { step: 2, title: 'AI生成', description: '生成完整的PPT内容' }, { step: 3, title: '导出', description: '导出为PPT或直接在线编辑' }], dependencies: [], input: 'PPT主题', output: 'PPT大纲和内容', icon: '📊', heatGrowth: 18.6 },
  { id: 'skill_weekly_report', name: '周报月报生成', description: '根据工作内容自动生成结构化的周报/月报，突出工作成果', category: '办公提效', difficulty: 'beginner', author: 'AI导航站', version: '1.1.0', installCount: 22400, successRate: 95, rating: 4.9, price: 'free', compatibility: ['ChatGPT', 'Claude', 'Kimi', '文心一言'], workflow: [{ step: 1, title: '输入工作内容', description: '列出本周/本月完成的工作' }, { step: 2, title: 'AI生成', description: '自动生成结构化周报' }, { step: 3, title: '调整润色', description: '根据需要调整数据和措辞' }], dependencies: [], input: '工作内容列表', output: '结构化周报/月报', icon: '📅', heatGrowth: 32.1 },
  { id: 'skill_email_write', name: '专业邮件撰写', description: '生成商务邮件、求职邮件、感谢信等各类正式邮件', category: '办公提效', difficulty: 'beginner', author: 'AI导航站', version: '1.0.0', installCount: 7800, successRate: 93, rating: 4.6, price: 'free', compatibility: ['ChatGPT', 'Claude'], workflow: [{ step: 1, title: '选择邮件类型', description: '选择邮件用途（商务/求职/感谢）' }, { step: 2, title: '输入关键信息', description: '提供收件人、主题、核心内容' }, { step: 3, title: 'AI生成', description: '生成完整邮件' }], dependencies: [], input: '邮件类型 + 关键信息', output: '专业邮件', icon: '✉️', heatGrowth: 14.8 },
  { id: 'skill_meeting_summary', name: '会议纪要整理', description: '上传会议录音或文字，自动生成结构化的会议纪要', category: '办公提效', difficulty: 'intermediate', author: 'AI导航站', version: '1.1.0', installCount: 6500, successRate: 88, rating: 4.5, price: 'free', compatibility: ['Kimi', 'ChatGPT', '讯飞听见'], workflow: [{ step: 1, title: '输入会议内容', description: '粘贴会议记录或上传录音' }, { step: 2, title: 'AI分析', description: '提取关键讨论点和决议' }, { step: 3, title: '生成纪要', description: '输出结构化会议纪要' }, { step: 4, title: '提取待办', description: '自动提取待办事项' }], dependencies: [], input: '会议记录/录音', output: '结构化会议纪要 + 待办', icon: '📋', heatGrowth: 19.3 },
  { id: 'skill_resume_optimize', name: '简历优化', description: '优化简历内容，提升求职竞争力通过ATS筛选', category: '办公提效', difficulty: 'beginner', author: 'AI导航站', version: '1.2.0', installCount: 14300, successRate: 90, rating: 4.8, price: 'free', compatibility: ['ChatGPT', 'Claude'], workflow: [{ step: 1, title: '输入简历', description: '粘贴当前简历内容' }, { step: 2, title: '选择岗位', description: '输入目标职位' }, { step: 3, title: 'AI优化', description: '生成优化后的简历' }], dependencies: [], input: '原始简历 + 目标岗位', output: '优化后简历', icon: '📄', heatGrowth: 24.5 },
  { id: 'skill_project_plan', name: '项目计划书生成', description: '自动生成项目计划书，包含目标、里程碑、资源分配和风险评估', category: '办公提效', difficulty: 'intermediate', author: 'AI导航站', version: '1.0.0', installCount: 9200, successRate: 89, rating: 4.6, price: 'free', compatibility: ['ChatGPT', 'Claude', 'Kimi'], workflow: [{ step: 1, title: '输入项目信息', description: '提供项目目标和范围' }, { step: 2, title: '设定参数', description: '设定时间线和资源约束' }, { step: 3, title: 'AI生成', description: '生成完整项目计划书' }, { step: 4, title: '优化调整', description: '调整里程碑和关键节点' }], dependencies: [], input: '项目目标 + 约束条件', output: '项目计划书', icon: '📋', heatGrowth: 20.5 },
  { id: 'skill_work_report_ppt', name: '工作汇报PPT', description: '根据工作数据生成专业的工作汇报PPT大纲和内容', category: '办公提效', difficulty: 'beginner', author: 'AI导航站', version: '1.0.0', installCount: 11200, successRate: 90, rating: 4.7, price: 'free', compatibility: ['Gamma', 'ChatGPT', 'Kimi'], workflow: [{ step: 1, title: '输入工作数据', description: '提供汇报周期和关键成果' }, { step: 2, title: '选择模板', description: '选择汇报风格和数据展示' }, { step: 3, title: 'AI生成', description: '生成PPT内容和结构' }, { step: 4, title: '导出优化', description: '导出为PPT并微调' }], dependencies: [], input: '工作数据 + 汇报周期', output: 'PPT大纲和内容', icon: '📽️', heatGrowth: 18.4 },
  { id: 'skill_email_automation', name: '邮件自动化流程', description: '设计邮件自动回复/转发/分类规则，配合AI实现邮件工作的全自动化', category: '办公提效', difficulty: 'intermediate', author: 'AI导航站', version: '1.0.0', installCount: 5800, successRate: 86, rating: 4.5, price: 'free', compatibility: ['ChatGPT', 'Gmail API', 'Outlook'], workflow: [{ step: 1, title: '分析邮件场景', description: '分析常见的邮件处理场景' }, { step: 2, title: '设计规则', description: '设计自动分类和回复规则' }, { step: 3, title: '集成AI', description: '集成AI自动生成回复' }, { step: 4, title: '测试部署', description: '测试流程并正式启用' }], dependencies: [{ name: 'Gmail/Outlook API' }], input: '邮件场景描述', output: '自动化流程配置', icon: '📧', heatGrowth: 15.2 },
  { id: 'skill_schedule_assistant', name: '日程管理助手', description: 'AI辅助日程安排、会议协调、待办事项管理和时间优化', category: '办公提效', difficulty: 'beginner', author: 'AI导航站', version: '1.0.0', installCount: 6800, successRate: 91, rating: 4.6, price: 'free', compatibility: ['ChatGPT', 'Claude', 'Kimi'], workflow: [{ step: 1, title: '导入日程', description: '提供当前日程和待办' }, { step: 2, title: 'AI分析', description: '分析时间利用效率' }, { step: 3, title: '优化建议', description: '给出日程优化建议' }, { step: 4, title: '自动排期', description: 'AI智能排期和提醒' }], dependencies: [], input: '当前日程 + 任务列表', output: '优化日程方案', icon: '🗓️', heatGrowth: 17.8 },

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
  { id: 'skill_sql_generation', name: 'SQL查询生成', description: '用自然语言描述数据需求，自动生成优化的SQL查询语句', category: '数据分析', difficulty: 'intermediate', author: 'AI导航站', version: '1.0.0', installCount: 12400, successRate: 93, rating: 4.8, price: 'free', compatibility: ['ChatGPT', 'Claude', 'Kimi'], workflow: [{ step: 1, title: '描述需求', description: '用自然语言描述查询需求' }, { step: 2, title: '选择数据库', description: '选择数据库类型（MySQL/PostgreSQL等）' }, { step: 3, title: 'AI生成', description: '生成优化后的SQL语句' }, { step: 4, title: '解释说明', description: 'AI解释SQL逻辑' }], dependencies: [], input: '查询需求描述', output: 'SQL查询语句', icon: '💾', heatGrowth: 32.5 },
  { id: 'skill_excel_formula', name: 'Excel公式助手', description: '根据业务需求自动生成Excel公式、VBA宏和数据处理逻辑', category: '数据分析', difficulty: 'beginner', author: 'AI导航站', version: '1.0.0', installCount: 9800, successRate: 91, rating: 4.7, price: 'free', compatibility: ['ChatGPT', 'Claude', 'Kimi'], workflow: [{ step: 1, title: '描述需求', description: '描述Excel处理目标' }, { step: 2, title: '提供数据示例', description: '提供数据格式示例' }, { step: 3, title: 'AI生成', description: '生成公式/VBA代码' }, { step: 4, title: '测试应用', description: '应用到Excel中测试' }], dependencies: [], input: '数据需求 + 数据格式', output: 'Excel公式/VBA代码', icon: '📗', heatGrowth: 24.6 },
  { id: 'skill_data_cleaning', name: '数据清洗助手', description: '自动识别并处理数据中的异常值、缺失值和格式不一致问题', category: '数据分析', difficulty: 'intermediate', author: 'AI导航站', version: '1.0.0', installCount: 6800, successRate: 88, rating: 4.6, price: 'free', compatibility: ['ChatGPT', 'Claude', 'Python'], workflow: [{ step: 1, title: '上传数据', description: '上传CSV/Excel数据' }, { step: 2, title: 'AI扫描', description: '扫描数据质量问题' }, { step: 3, title: '清洗方案', description: '生成清洗建议和代码' }, { step: 4, title: '执行清洗', description: '执行数据清洗并验证' }], dependencies: [], input: '原始数据文件', output: '清洗后数据 + 清洗报告', icon: '🧹', heatGrowth: 18.5 },
  { id: 'skill_ab_test', name: 'A/B测试分析', description: '设计A/B测试方案，分析实验结果并给出统计显著性判断', category: '数据分析', difficulty: 'advanced', author: 'AI导航站', version: '1.0.0', installCount: 4200, successRate: 85, rating: 4.5, price: 'free', compatibility: ['ChatGPT', 'Claude', 'Excel'], workflow: [{ step: 1, title: '描述实验', description: '描述A/B测试目标和变量' }, { step: 2, title: '设计实验', description: 'AI推荐样本量和测试时长' }, { step: 3, title: '分析结果', description: '上传数据并分析' }, { step: 4, title: '生成报告', description: '输出分析报告和建议' }], dependencies: [], input: '实验描述 + 结果数据', output: '测试分析报告', icon: '🧪', heatGrowth: 16.3 },

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
  { id: 'skill_scaffold_generator', name: '项目脚手架生成', description: '根据技术栈自动生成项目初始结构和配置文件，快速启动新项目', category: 'AI编程', difficulty: 'beginner', author: 'AI导航站', version: '1.0.0', installCount: 7800, successRate: 92, rating: 4.7, price: 'free', compatibility: ['Claude', 'ChatGPT', 'Cursor'], workflow: [{ step: 1, title: '选择技术栈', description: '选择框架和工具链' }, { step: 2, title: '描述需求', description: '描述项目功能和模块' }, { step: 3, title: 'AI生成', description: '生成完整项目结构' }, { step: 4, title: '安装运行', description: '运行安装命令并测试' }], dependencies: [], input: '技术栈 + 项目描述', output: '项目脚手架代码', icon: '🏗️', heatGrowth: 26.8 },
  { id: 'skill_docker_config', name: 'Docker配置生成', description: '根据项目需求自动生成Dockerfile和docker-compose配置', category: 'AI编程', difficulty: 'intermediate', author: 'AI导航站', version: '1.0.0', installCount: 5600, successRate: 89, rating: 4.6, price: 'free', compatibility: ['Claude', 'ChatGPT', 'Cursor'], workflow: [{ step: 1, title: '描述项目', description: '提供项目类型和技术栈' }, { step: 2, title: '选择环境', description: '选择部署环境配置' }, { step: 3, title: 'AI生成', description: '生成Dockerfile和Compose' }, { step: 4, title: '测试构建', description: '测试docker build' }], dependencies: [{ name: 'Docker环境' }], input: '项目描述 + 环境需求', output: 'Docker配置文件', icon: '🐳', heatGrowth: 22.3 },
  { id: 'skill_cicd_pipeline', name: 'CI/CD流水线配置', description: '自动生成GitHub Actions/GitLab CI等CI/CD配置文件，实现自动化构建部署', category: 'AI编程', difficulty: 'advanced', author: 'AI导航站', version: '1.0.0', installCount: 4800, successRate: 86, rating: 4.5, price: 'free', compatibility: ['Claude', 'ChatGPT', 'GitHub CLI'], workflow: [{ step: 1, title: '选择平台', description: '选择CI/CD平台' }, { step: 2, title: '描述流程', description: '描述构建测试部署流程' }, { step: 3, title: 'AI生成', description: '生成YAML配置文件' }, { step: 4, title: '测试流水线', description: '运行并调试流水线' }], dependencies: [{ name: 'GitHub/GitLab账户' }], input: '平台 + 流程描述', output: 'CI/CD配置文件', icon: '🔄', heatGrowth: 28.6 },
  { id: 'skill_code_migration', name: '代码迁移助手', description: '自动将代码从一种语言或框架迁移到另一种（如JS→TS、Vue→React）', category: 'AI编程', difficulty: 'advanced', author: 'AI导航站', version: '1.0.0', installCount: 3600, successRate: 84, rating: 4.5, price: 'free', compatibility: ['Claude', 'ChatGPT', 'Cursor'], workflow: [{ step: 1, title: '输入源代码', description: '提供待迁移的源代码' }, { step: 2, title: '选择目标', description: '选择目标语言/框架' }, { step: 3, title: 'AI迁移', description: '逐文件迁移代码' }, { step: 4, title: '测试验证', description: '运行测试确保正确性' }], dependencies: [], input: '源代码 + 目标技术栈', output: '迁移后代码', icon: '🔄', heatGrowth: 19.4 },
  { id: 'skill_git_commit', name: 'Git Commit信息生成', description: '根据代码变更自动生成规范化的Git提交信息，支持Conventional Commits', category: 'AI编程', difficulty: 'beginner', author: 'AI导航站', version: '1.0.0', installCount: 10200, successRate: 94, rating: 4.8, price: 'free', compatibility: ['GitHub CLI', 'Claude', 'ChatGPT'], workflow: [{ step: 1, title: '查看变更', description: '查看当前git diff' }, { step: 2, title: 'AI分析', description: '分析代码变更内容' }, { step: 3, title: '生成信息', description: '生成符合规范的commit message' }, { step: 4, title: '确认提交', description: '确认并执行git commit' }], dependencies: [{ name: 'Git仓库' }], input: '代码变更(diff)', output: '规范化的Commit信息', icon: '📝', heatGrowth: 31.2 },

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
  { id: 'skill_course_outline', name: '课程大纲生成', description: '自动生成完整的课程大纲，包含教学目标、章节安排和评估方式', category: '教育学习', difficulty: 'intermediate', author: 'AI导航站', version: '1.0.0', installCount: 6800, successRate: 91, rating: 4.7, price: 'free', compatibility: ['ChatGPT', 'Claude', 'Kimi'], workflow: [{ step: 1, title: '输入主题', description: '提供课程主题和目标学员' }, { step: 2, title: '设定层级', description: '设定课程难度和时长' }, { step: 3, title: 'AI生成', description: '生成完整课程大纲' }, { step: 4, title: '细化内容', description: '细化每节内容要点' }], dependencies: [], input: '课程主题 + 学员画像', output: '课程大纲', icon: '📖', heatGrowth: 21.4 },
  { id: 'skill_exam_bank', name: '考试题库创建', description: '根据知识点自动生成选择题、填空题、简答题等各类题目及答案解析', category: '教育学习', difficulty: 'intermediate', author: 'AI导航站', version: '1.0.0', installCount: 5600, successRate: 89, rating: 4.6, price: 'free', compatibility: ['ChatGPT', 'Claude', 'Kimi'], workflow: [{ step: 1, title: '输入知识点', description: '提供需要出题的知识范围' }, { step: 2, title: '选择题型', description: '选择题目类型和难度' }, { step: 3, title: 'AI生成', description: '生成题目和答案解析' }, { step: 4, title: '审核优化', description: '审核题目质量并调整' }], dependencies: [], input: '知识点 + 题型配置', output: '题库 + 答案解析', icon: '📝', heatGrowth: 19.2 },
  { id: 'skill_learning_path', name: '学习路径规划', description: '为个人定制化学习路径，从入门到精通的知识图谱和推荐资源', category: '教育学习', difficulty: 'beginner', author: 'AI导航站', version: '1.0.0', installCount: 8200, successRate: 90, rating: 4.7, price: 'free', compatibility: ['ChatGPT', 'Claude', 'Kimi'], workflow: [{ step: 1, title: '输入目标', description: '描述学习目标和当前水平' }, { step: 2, title: 'AI评估', description: '评估知识差距' }, { step: 3, title: '规划路径', description: '生成分阶段学习路径' }, { step: 4, title: '推荐资源', description: '推荐课程/书籍/实践项目' }], dependencies: [], input: '学习目标 + 当前基础', output: '学习路径规划', icon: '🗺️', heatGrowth: 25.8 },
  { id: 'skill_flashcard_gen', name: '知识卡片生成', description: '将学习内容自动转化为记忆卡片，支持Anki/ Quizlet等格式', category: '教育学习', difficulty: 'beginner', author: 'AI导航站', version: '1.0.0', installCount: 7400, successRate: 93, rating: 4.8, price: 'free', compatibility: ['ChatGPT', 'Claude', 'Kimi'], workflow: [{ step: 1, title: '输入内容', description: '提供需要制作卡片的知识点' }, { step: 2, title: '选择格式', description: '选择卡片输出格式' }, { step: 3, title: 'AI生成', description: '生成问答形式的记忆卡片' }, { step: 4, title: '导入使用', description: '导出为Anki/Quizlet格式' }], dependencies: [], input: '学习内容/笔记', output: '记忆卡片集', icon: '🃏', heatGrowth: 22.7 },

  // ===== 心理健康类 =====
  { id: 'skill_mental_health', name: '心理疏导对话', description: 'AI辅助心理疏导，提供情绪支持和专业建议（非医疗）', category: '心理健康', difficulty: 'beginner', author: 'AI导航站', version: '1.0.0', installCount: 7600, successRate: 89, rating: 4.6, price: 'free', compatibility: ['ChatGPT', 'Claude', 'Kimi'], workflow: [{ step: 1, title: '倾诉问题', description: '描述当前困扰' }, { step: 2, title: 'AI倾听', description: 'AI提供倾听和反馈' }, { step: 3, title: '建议方案', description: '提供改善建议' }], dependencies: [], input: '心理困扰描述', output: '疏导对话 + 建议', icon: '💚', heatGrowth: 15.4 },

  // ===== 房产家居类 =====
  { id: 'skill_home_decor', name: '家居软装设计', description: '根据房间照片和风格偏好，AI生成软装搭配方案', category: '房产家居', difficulty: 'beginner', author: 'AI导航站', version: '1.0.0', installCount: 6200, successRate: 85, rating: 4.5, price: 'free', compatibility: ['Midjourney', 'DALL-E', 'Stable Diffusion'], workflow: [{ step: 1, title: '上传照片', description: '上传房间照片' }, { step: 2, title: '描述风格', description: '描述想要的风格' }, { step: 3, title: 'AI设计', description: '生成软装方案' }], dependencies: [], input: '房间照片 + 风格', output: '软装设计方案', icon: '🏠', heatGrowth: 13.6 },
  { id: 'skill_house_description', name: '房源文案撰写', description: '为房产中介生成吸引人的房源描述，突出卖点', category: '房产家居', difficulty: 'beginner', author: 'AI导航站', version: '1.0.0', installCount: 4800, successRate: 90, rating: 4.6, price: 'free', compatibility: ['ChatGPT', 'Kimi', '文心一言'], workflow: [{ step: 1, title: '输入房源', description: '提供房源基本信息' }, { step: 2, title: 'AI生成', description: '生成房源描述' }, { step: 3, title: '优化卖点', description: '突出核心卖点' }], dependencies: [], input: '房源信息', output: '房源描述文案', icon: '🏘️', heatGrowth: 11.2 },

  // ===== AI代理与自动化 =====
  { id: 'skill_agent_builder', name: 'AI Agent构建指南', description: '学习如何用LangChain/AutoGPT构建自主AI Agent，实现任务自动化', category: 'AI代理', difficulty: 'advanced', author: 'AI导航站', version: '1.0.0', installCount: 9200, successRate: 82, rating: 4.5, price: 'free', compatibility: ['GPT-4', 'Claude', 'Cursor'], workflow: [{ step: 1, title: '定义目标', description: '明确Agent需要完成的任务' }, { step: 2, title: '选择框架', description: '选择LangChain/AutoGPT等框架' }, { step: 3, title: '配置工具', description: '配置工具链和API' }, { step: 4, title: '调试优化', description: '测试并优化Agent行为' }], dependencies: [{ name: 'Python/Node.js环境' }], input: '任务目标 + 工具配置', output: '可运行的AI Agent', icon: '🤖', heatGrowth: 42.3 },
  { id: 'skill_github_workflow', name: 'GitHub工作流自动化', description: '用GitHub Actions + AI实现CI/CD自动化，代码审查、测试部署全流程', category: 'AI代理', difficulty: 'intermediate', author: 'AI导航站', version: '1.0.0', installCount: 7500, successRate: 87, rating: 4.6, price: 'free', compatibility: ['GitHub CLI', 'Cursor', 'Copilot'], workflow: [{ step: 1, title: '创建Workflow', description: '编写YAML配置文件' }, { step: 2, title: '配置触发器', description: '设置触发条件' }, { step: 3, title: 'AI代码审查', description: '集成AI进行自动审查' }, { step: 4, title: '自动部署', description: '配置自动部署流水线' }], dependencies: [{ name: 'GitHub仓库' }], input: '项目配置 + 部署环境', output: '自动化CI/CD流水线', icon: '⚙️', heatGrowth: 35.8 },

  // ===== 新增：批量图像处理 =====
  { id: 'skill_batch_image', name: '批量图像生成与处理', description: '配合Midjourney/ComfyUI批量生成和处理图片，提升创作效率', category: '图像生成', difficulty: 'intermediate', author: 'AI导航站', version: '1.0.0', installCount: 5600, successRate: 86, rating: 4.5, price: 'free', compatibility: ['Midjourney', 'ComfyUI', 'Stable Diffusion'], workflow: [{ step: 1, title: '设定参数', description: '配置批量参数模板' }, { step: 2, title: 'AI生成', description: '批量生成图片' }, { step: 3, title: '筛选优化', description: '筛选最佳结果进行优化' }], dependencies: [], input: '批量参数列表', output: '批量生成图片', icon: '🖼️', heatGrowth: 22.4 },

  // ===== AI Agent架构类（今日热点） =====
  { id: 'skill_managed_agents', name: 'Managed Agents架构设计', description: 'Anthropic提出的"大脑与手解耦"范式：大脑负责规划决策，手（MCP/API工具）负责执行，构建规模化Agent系统', category: 'AI代理', difficulty: 'advanced', author: 'Anthropic', version: '1.0.0', installCount: 4500, successRate: 84, rating: 4.7, price: 'free', compatibility: ['Claude', 'GPT-4', 'OpenAI Agents SDK', 'MCP Server'], workflow: [{ step: 1, title: '设计大脑', description: '配置核心Agent作为决策中枢，设定目标和约束' }, { step: 2, title: '设计手', description: '通过MCP Server定义外部工具和数据接口' }, { step: 3, title: '解耦通信', description: '建立大脑与手之间的标准化通信协议' }, { step: 4, title: '监控与迭代', description: '运行时监控Agent行为，持续优化决策逻辑' }], dependencies: [{ name: 'MCP SDK' }, { name: 'LLM API Key' }], input: '业务需求 + 工具集描述', output: '可扩展的Agent系统架构', icon: '🧠', heatGrowth: 52.3 },
  { id: 'skill_three_file_framework', name: '三文件Agent框架', description: 'Garry Tan提出的SOUL.md+RULES.md+MEMORY.md三文件框架，用极简文件结构定义AI Agent的个性、规则和记忆', category: 'AI代理', difficulty: 'beginner', author: 'Garry Tan', version: '1.0.0', installCount: 6800, successRate: 91, rating: 4.8, price: 'free', compatibility: ['Claude Code', 'Cursor', 'GitHub Copilot', '任何AI编程工具'], workflow: [{ step: 1, title: '创建SOUL.md', description: '定义Agent的身份、性格、目标和价值观' }, { step: 2, title: '创建RULES.md', description: '设定Agent的行为规则和约束条件' }, { step: 3, title: '创建MEMORY.md', description: '记录Agent的上下文记忆和学习经验' }, { step: 4, title: '组合使用', description: '三个文件共同作用于同一工作目录' }], dependencies: [], input: '项目需求描述', output: '三文件Agent配置', icon: '📋', heatGrowth: 48.6 },
  { id: 'skill_evanflow_tdd', name: 'TDD驱动Claude Code工作流（evanflow）', description: '275★开源项目，用测试驱动开发(TDD)方法驱动Claude Code生成高质量代码，先写测试再写实现', category: 'AI编程', difficulty: 'intermediate', author: 'evanflow社区', version: '1.0.0', installCount: 3200, successRate: 89, rating: 4.6, price: 'free', compatibility: ['Claude Code', 'VS Code'], workflow: [{ step: 1, title: '编写测试', description: '先用自然语言描述测试用例' }, { step: 2, title: 'AI生成实现', description: 'Claude Code根据测试生成实现代码' }, { step: 3, title: '运行测试', description: '自动运行测试验证实现正确性' }, { step: 4, title: '迭代优化', description: '根据测试结果循环迭代直到通过' }], dependencies: [{ name: 'Claude Code CLI' }, { name: '测试框架(Jest/Mocha等)' }], input: '功能需求 + 测试用例', output: '通过TDD验证的代码', icon: '🔄', heatGrowth: 42.1 },
  { id: 'skill_illustrated_explainer', name: '无限递进图解生成', description: '223★开源项目Illustrated Explainer Spec，通过AI生成无限递进深度的图解说明，适合复杂概念教学', category: '内容创作', difficulty: 'intermediate', author: 'AI导航站', version: '1.0.0', installCount: 2800, successRate: 87, rating: 4.5, price: 'free', compatibility: ['ChatGPT', 'Claude', 'DALL-E', 'Midjourney'], workflow: [{ step: 1, title: '输入概念', description: '输入要图解的核心概念' }, { step: 2, title: '设定层级', description: '设定图解递进深度和复杂度' }, { step: 3, title: 'AI生成图解', description: '生成层级递进的图解说明' }, { step: 4, title: '递进深入', description: '逐层深入，从概览到细节' }], dependencies: [], input: '概念 + 图解层级', output: '递进图解序列', icon: '🔍', heatGrowth: 38.7 },
  { id: 'skill_mcp_server_build', name: '为你的App构建MCP Server', description: '学习如何为任何App或服务构建MCP Server，连接AI生态，成为"为你的App做MCP Server"潮流的先行者', category: 'AI编程', difficulty: 'intermediate', author: 'AI导航站', version: '1.0.0', installCount: 5100, successRate: 86, rating: 4.7, price: 'free', compatibility: ['Python', 'TypeScript', 'Go', 'MCP SDK'], workflow: [{ step: 1, title: '分析你的App', description: '确定App中可暴露为MCP资源的API和数据' }, { step: 2, title: '定义Tools', description: '设计MCP工具，映射App功能' }, { step: 3, title: '实现Server', description: '用MCP SDK实现Server端' }, { step: 4, title: '测试接入', description: '用MCP Client或AI工具测试接入' }], dependencies: [{ name: 'MCP SDK' }, { name: 'Node.js/Python 3.8+' }], input: 'App功能描述 + API文档', output: '可运行的MCP Server', icon: '🔌', heatGrowth: 55.2 },

  // ===== 设计创意类 =====
  { id: 'skill_ui_ux_prompt', name: 'UI/UX设计Prompt', description: '为AI图像工具生成精确的UI/UX设计Prompt，涵盖网页、App、仪表盘等界面', category: '设计创意', difficulty: 'intermediate', author: 'AI导航站', version: '1.0.0', installCount: 8600, successRate: 90, rating: 4.7, price: 'free', compatibility: ['Midjourney', 'DALL-E', 'Recraft', 'Stable Diffusion'], workflow: [{ step: 1, title: '描述界面', description: '描述需要设计的界面类型和功能' }, { step: 2, title: '选择风格', description: '选择设计风格（极简/玻璃态/新拟态等）' }, { step: 3, title: 'AI生成Prompt', description: '生成精准的设计Prompt' }, { step: 4, title: '迭代优化', description: '根据生成结果优化Prompt' }], dependencies: [], input: '界面描述 + 设计风格', output: 'UI/UX设计Prompt', icon: '🎨', heatGrowth: 28.3 },
  { id: 'skill_brand_guidelines', name: '品牌风格指南生成', description: '生成品牌VI规范文档，包含Logo使用规范、色彩系统、字体排版和视觉元素', category: '设计创意', difficulty: 'intermediate', author: 'AI导航站', version: '1.0.0', installCount: 5200, successRate: 87, rating: 4.6, price: 'free', compatibility: ['ChatGPT', 'Claude', 'Midjourney'], workflow: [{ step: 1, title: '输入品牌信息', description: '提供品牌名称、行业和定位' }, { step: 2, title: 'AI分析', description: '分析品牌调性和视觉方向' }, { step: 3, title: '生成指南', description: '生成完整品牌风格指南' }, { step: 4, title: '视觉示例', description: '生成配套视觉示例' }], dependencies: [], input: '品牌信息 + 行业', output: '品牌风格指南文档', icon: '🎯', heatGrowth: 17.6 },
  { id: 'skill_color_palette', name: '配色方案推荐', description: '基于品牌调性和设计需求生成和谐的配色方案，含HEX/RGB色值', category: '设计创意', difficulty: 'beginner', author: 'AI导航站', version: '1.0.0', installCount: 7200, successRate: 93, rating: 4.8, price: 'free', compatibility: ['ChatGPT', 'Claude', 'Midjourney'], workflow: [{ step: 1, title: '输入需求', description: '描述设计场景和风格偏好' }, { step: 2, title: '选择氛围', description: '选择色彩氛围(温暖/冷峻/活泼等)' }, { step: 3, title: 'AI生成', description: '生成多套配色方案' }, { step: 4, title: '预览应用', description: '展示方案在实际界面中的效果' }], dependencies: [], input: '设计需求 + 风格', output: '配色方案 + 色值', icon: '🌈', heatGrowth: 20.4 },
  { id: 'skill_font_pairing', name: '字体搭配推荐', description: '为品牌和设计项目推荐中英文字体搭配方案，含字体组合和排版示例', category: '设计创意', difficulty: 'beginner', author: 'AI导航站', version: '1.0.0', installCount: 4800, successRate: 91, rating: 4.6, price: 'free', compatibility: ['ChatGPT', 'Claude', 'Kimi'], workflow: [{ step: 1, title: '输入场景', description: '描述使用场景和品牌调性' }, { step: 2, title: '选择分类', description: '选择字体搭配类型(标题+正文/展示+阅读等)' }, { step: 3, title: 'AI推荐', description: '推荐字体搭配方案' }, { step: 4, title: '排版示例', description: '生成排版效果示例' }], dependencies: [], input: '使用场景 + 品牌调性', output: '字体搭配方案', icon: '🔤', heatGrowth: 14.8 },

  // ===== SEO/营销类 =====
  { id: 'skill_keyword_research', name: '关键词研究', description: 'AI辅助进行SEO关键词研究，分析搜索量、竞争度，挖掘长尾关键词', category: 'SEO营销', difficulty: 'intermediate', author: 'AI导航站', version: '1.0.0', installCount: 6800, successRate: 87, rating: 4.6, price: 'free', compatibility: ['ChatGPT', 'Claude', 'Kimi'], workflow: [{ step: 1, title: '输入核心词', description: '提供核心业务关键词' }, { step: 2, title: 'AI扩展', description: 'AI扩展相关关键词和长尾词' }, { step: 3, title: '分析竞争', description: '分析关键词竞争度和搜索意图' }, { step: 4, title: '推荐策略', description: '给出关键词优先级策略' }], dependencies: [], input: '核心关键词', output: '关键词研究报表', icon: '🔎', heatGrowth: 23.5 },
  { id: 'skill_website_seo', name: '网站SEO优化', description: '针对网站进行全面的SEO诊断和优化，提升搜索引擎排名', category: 'SEO营销', difficulty: 'intermediate', author: 'AI导航站', version: '1.0.0', installCount: 5600, successRate: 85, rating: 4.5, price: 'free', compatibility: ['ChatGPT', 'Claude', 'Kimi'], workflow: [{ step: 1, title: '输入网站信息', description: '提供网站URL和目标关键词' }, { step: 2, title: 'AI诊断', description: '分析网站SEO问题和机会' }, { step: 3, title: '优化方案', description: '生成技术SEO和内容优化方案' }, { step: 4, title: '执行建议', description: '给出分优先级的执行计划' }], dependencies: [], input: '网站URL + 目标关键词', output: 'SEO优化方案', icon: '🌐', heatGrowth: 21.8 },
  { id: 'skill_email_marketing_seq', name: '营销邮件序列', description: '设计自动化的营销邮件序列，包含开场、跟进、转化和留存邮件', category: 'SEO营销', difficulty: 'intermediate', author: 'AI导航站', version: '1.0.0', installCount: 4200, successRate: 88, rating: 4.5, price: 'free', compatibility: ['ChatGPT', 'Claude'], workflow: [{ step: 1, title: '输入目标', description: '描述营销目标和目标受众' }, { step: 2, title: '设计序列', description: 'AI设计邮件发送节奏' }, { step: 3, title: '生成内容', description: '生成各阶段邮件文案' }, { step: 4, title: '优化转化', description: '优化CTA和转化路径' }], dependencies: [], input: '营销目标 + 受众画像', output: '邮件序列文案', icon: '📧', heatGrowth: 16.2 },
  { id: 'skill_ab_copywriting', name: 'A/B测试文案', description: '为营销活动生成多个版本的文案用于A/B测试，优化转化率', category: 'SEO营销', difficulty: 'beginner', author: 'AI导航站', version: '1.0.0', installCount: 5800, successRate: 91, rating: 4.7, price: 'free', compatibility: ['ChatGPT', 'Claude', 'Kimi'], workflow: [{ step: 1, title: '输入文案目标', description: '描述营销目标和核心信息' }, { step: 2, title: '选择变量', description: '选择测试变量(标题/CTA/情绪等)' }, { step: 3, title: 'AI生成', description: '生成多个版本文案' }, { step: 4, title: '分析建议', description: '给出测试假设和分析建议' }], dependencies: [], input: '文案目标 + 测试变量', output: '多版本测试文案', icon: '📊', heatGrowth: 18.9 },

  // ===== 新锐热门 =====
  { id: 'skill_gpt_image2', name: 'GPT Image 2 提示词优化', description: '为OpenAI GPT-Image-2模型优化图像生成提示词，精准控制布局、文字渲染和视觉风格', category: '新锐热门', difficulty: 'intermediate', author: 'UzenUPozitiv4ik社区', version: '1.0.0', installCount: 5800, successRate: 89, rating: 4.7, price: 'free', compatibility: ['ChatGPT', 'GPT-4 Image'], workflow: [{ step: 1, title: '输入图像描述', description: '描述要生成的图像内容和场景' }, { step: 2, title: '优化提示词', description: 'AI优化为GPT-Image-2适配的提示词' }, { step: 3, title: '生成图像', description: '用优化后的提示词生成图像' }, { step: 4, title: '迭代优化', description: '根据结果进一步调整' }], dependencies: [], input: '图像描述 + 风格要求', output: 'GPT-Image-2优化提示词', icon: '🖼️', heatGrowth: 48.5 },
  { id: 'skill_claude_artifacts', name: 'Claude Artifacts生成', description: '利用Claude Artifacts功能生成可交互的HTML/CSS/JS应用、图表和文档', category: '新锐热门', difficulty: 'beginner', author: 'AI导航站', version: '1.0.0', installCount: 12600, successRate: 93, rating: 4.9, price: 'free', compatibility: ['Claude', 'Claude Code'], workflow: [{ step: 1, title: '描述应用', description: '描述要创建的Artifact功能和界面' }, { step: 2, title: '选择类型', description: '选择应用/图表/文档类型' }, { step: 3, title: 'AI生成', description: '生成可交互的Artifact' }, { step: 4, title: '迭代完善', description: '通过对话继续完善' }], dependencies: [], input: '应用需求描述', output: '可运行的Artifact', icon: '📦', heatGrowth: 55.8 },
  { id: 'skill_deepseek_r1', name: 'DeepSeek R1推理提示词', description: '为DeepSeek R1推理模型设计精准的提示词，充分发挥其深度推理和逻辑分析能力', category: '新锐热门', difficulty: 'intermediate', author: 'AI导航站', version: '1.0.0', installCount: 9600, successRate: 91, rating: 4.8, price: 'free', compatibility: ['DeepSeek', 'ChatGPT', 'Claude'], workflow: [{ step: 1, title: '定义问题', description: '明确需要推理的问题类型' }, { step: 2, title: '设计提示结构', description: '设计分层的推理提示结构' }, { step: 3, title: 'AI推理', description: 'DeepSeek R1执行深度推理' }, { step: 4, title: '结果优化', description: '根据推理链优化提示词' }], dependencies: [], input: '问题描述 + 推理深度', output: 'R1推理结果', icon: '🧠', heatGrowth: 38.6 },
  { id: 'skill_codex_native', name: 'Codex-native应用设计', description: '使用OpenAI Codex CLI的native模式设计和构建从0到1的完整应用', category: '新锐热门', difficulty: 'advanced', author: 'AI导航站', version: '1.0.0', installCount: 3800, successRate: 84, rating: 4.5, price: 'free', compatibility: ['Codex CLI', 'Claude Code', 'Cursor'], workflow: [{ step: 1, title: '定义应用目标', description: '描述应用功能和技术需求' }, { step: 2, title: '架构设计', description: 'AI设计应用架构' }, { step: 3, title: '代码生成', description: 'AI逐步生成完整应用代码' }, { step: 4, title: '测试部署', description: '测试并部署应用' }], dependencies: [{ name: 'Codex CLI' }, { name: 'Node.js/Python环境' }], input: '应用需求描述', output: '完整应用代码', icon: '⚡', heatGrowth: 42.3 },
];

export const scenes: Scene[] = [
  // Primary scenes — names match tool.sceneTags for direct lookup
  { id: 'scene_office', name: '办公提效', icon: '📊', description: '办公提效的AI应用场景，涵盖文档处理、会议纪要、周报月报、邮件撰写、简历优化等日常办公环节', coverImage: '📊', category: 'personal', aiLevel: 'L1', toolCount: 26, skillCount: 10, xhsSaves: 128000, tags: ['办公提效', '自动化', '生产力'], solutions: [
    { id: 's1', type: 'auto', title: 'AI智能办公助手', description: '用AI自动生成周报月报、会议纪要、商务邮件，大幅提升办公效率', tools: ['ChatGPT', 'Kimi', 'Notion AI', '通义千问', 'DeepSeek'], skills: ['skill_weekly_report', 'skill_meeting_summary', 'skill_email_write', 'skill_resume_optimize'], effect: '办公效率提升200%，每日节省2小时', difficulty: 'beginner' },
    { id: 's2', type: 'semi', title: 'PPT/AI幻灯片制作', description: '一句话生成专业PPT，支持学术答辩、商业计划等场景', tools: ['Gamma', 'ChatGPT', 'Kimi'], skills: ['skill_auto_ppt', 'skill_pitch_deck'], effect: 'PPT制作时间从4小时缩短至10分钟', difficulty: 'beginner' },
      { id: 's3', type: 'auto', title: '企业内部知识库AI化', description: '将企业内部文档、流程、规范转化为AI可检索的知识库', tools: ['Kimi', 'Notion AI', '通义千问'], skills: ['skill_meeting_summary'], effect: '员工知识检索效率提升200%', difficulty: 'intermediate' }
    ],
    caseStudies: [
      { title: 'ChatGPT 办公提效完整教程：从入门到精通', source: 'bilibili', creator: 'B站AI教程', description: '手把手教你用ChatGPT处理邮件、周报、会议纪要等日常办公任务，含即用Prompt模板', url: 'https://www.bilibili.com/video/BV1Lg4y1c7fk', duration: '45:00', skill: 'ChatGPT Prompt工程' },
      { title: '用AI自动生成周报和会议纪要，每天省2小时', source: 'bilibili', creator: 'B站AI教程', description: '展示如何使用AI自动化办公流程生成周报和会议纪要', url: 'https://www.bilibili.com/video/BV1ZS421R7V7', duration: '30:00', skill: 'AI自动化' },
      { title: 'Notion AI 完整指南：用AI管理你的工作流', source: 'bilibili', creator: 'B站AI教程', description: '从零开始用Notion AI搭建个人知识管理系统和项目追踪', url: 'https://www.bilibili.com/video/BV1ZS421R7V7', duration: '35:00', skill: 'Notion AI + 知识管理' }
    ] },
  { id: 'scene_content', name: '内容创作', icon: '✍️', description: '内容创作的AI应用场景，包括文章写作、社交媒体文案、公众号文章、小红书笔记等', coverImage: '✍️', category: 'personal', aiLevel: 'L1', toolCount: 28, skillCount: 12, xhsSaves: 176000, tags: ['内容创作', '写作', '文案'], solutions: [
    { id: 's1', type: 'auto', title: 'AI文章与文案生成', description: '根据主题自动生成高质量文章、公众号推文、小红书笔记', tools: ['ChatGPT', 'Claude', 'Kimi', '文心一言'], skills: ['skill_xhs_rewrite', 'skill_wechat_article', 'skill_weibo_content'], effect: '写作效率提升300%，每日可产出20+篇内容', difficulty: 'beginner' },
    { id: 's2', type: 'semi', title: '多平台内容矩阵', description: '一篇文章自动适配公众号/小红书/微博/抖音等不同平台', tools: ['ChatGPT', 'Claude', '豆包'], skills: ['skill_xhs_rewrite', 'skill_wechat_article', 'skill_weibo_content'], effect: '内容分发效率提升500%', difficulty: 'intermediate' }
    ],
    caseStudies: [
      { title: '用ChatGPT写出高质量公众号文章的完整流程', source: 'bilibili', creator: 'B站AI教程', description: '从选题、大纲、撰写到润色，全套AI内容创作工作流演示', url: 'https://www.bilibili.com/video/BV1ZS421R7V7', duration: '28:00', skill: 'AI写作工作流' },
      { title: 'Claude vs ChatGPT：内容创作横评实测', source: 'bilibili', creator: 'B站AI教程', description: '对比两大模型在文章写作、文案生成、创意激发上的表现', url: 'https://www.bilibili.com/video/BV1jk4y1x7rq', duration: '22:00', skill: 'AI工具对比' },
      { title: '小红书爆款笔记的AI速成法', source: 'bilibili', creator: 'B站AI教程', description: '用AI批量生成小红书笔记，从选题到排版全流程实操', url: 'https://www.bilibili.com/video/BV1ZS421R7V7', duration: '18:00', skill: '小红书AI运营' }
    ] },
  { id: 'scene_programming', name: '编程开发', icon: '💻', description: '编程开发的AI应用场景，包括代码生成、代码审查、单元测试、API文档、数据库设计等', coverImage: '💻', category: 'personal', aiLevel: 'L1', toolCount: 24, skillCount: 10, xhsSaves: 128000, tags: ['编程开发', '代码', '开发工具'], solutions: [
    { id: 's1', type: 'auto', title: 'AI编程辅助', description: '用AI进行代码生成、补全、重构和审查，提升开发效率', tools: ['Cursor', 'GitHub Copilot', 'Claude', 'ChatGPT', 'Devin'], skills: ['skill_code_review', 'skill_vibe_coding', 'skill_unit_test', 'skill_api_doc'], effect: '开发效率提升300%，Bug率降低60%', difficulty: 'beginner' },
    { id: 's2', type: 'auto', title: 'AI全栈开发工作流', description: '从需求描述到部署的全流程AI辅助开发', tools: ['Cursor', 'Devin', 'Claude', 'ChatGPT', 'DeepSeek'], skills: ['skill_vibe_coding', 'skill_glue_coding', 'skill_database_schema'], effect: 'MVP开发周期从3周缩短至3天', difficulty: 'advanced' }
    ],
    caseStudies: [
      { title: 'Cursor AI 从入门到精通：自然语言编程实战', source: 'bilibili', creator: 'B站AI编程', description: '用Cursor AI通过自然语言描述需求，自动生成完整应用代码', url: 'https://www.bilibili.com/video/BV1gH8zCE1V', duration: '35:00', skill: 'Cursor / AI编程' },
      { title: 'GitHub Copilot 实战技巧：10倍提升编码效率', source: 'bilibili', creator: 'B站AI编程', description: '从基础补全到高级Prompt，全面掌握Copilot的各种使用场景', url: 'https://www.bilibili.com/video/BV1gH8zCE1V', duration: '28:00', skill: 'GitHub Copilot' },
      { title: 'AI全栈开发工作流：从需求到部署', source: 'youtube', creator: 'Theo - t3․gg', description: '展示AI辅助全栈开发的最佳实践，Cursor+Claude Code组合', url: 'https://www.youtube.com/watch?v=3mZqO0q0Vb0', duration: '32:00', skill: 'AI全栈开发' }
    ] },
  { id: 'scene_design', name: '设计创作', icon: '🎨', description: '设计创作的AI应用场景，涵盖AI绘画、图像生成、Logo设计、产品图、插画等创意领域', coverImage: '🎨', category: 'personal', aiLevel: 'L2', toolCount: 22, skillCount: 8, xhsSaves: 94000, tags: ['设计创作', 'AI绘画', '创意设计'], solutions: [
    { id: 's1', type: 'auto', title: 'AI图像生成工作流', description: '用AI生成高质量图片，涵盖人物、场景、产品、插画等', tools: ['Midjourney', 'DALL·E 3', 'Stable Diffusion', 'Leonardo AI'], skills: ['skill_product_image', 'skill_avatar_design', 'skill_logo_design'], effect: '设计效率提升500%，单张成本降低90%', difficulty: 'beginner' },
    { id: 's2', type: 'semi', title: '品牌视觉设计', description: '用AI完成Logo、VI、包装等品牌视觉设计', tools: ['Midjourney', 'DALL·E 3', 'Stable Diffusion'], skills: ['skill_logo_design', 'skill_avatar_design'], effect: '品牌设计周期从2周缩短至2天', difficulty: 'intermediate' }
    ],
    caseStudies: [
      { title: 'Midjourney 完整教程：从提示词到商业级作品', source: 'bilibili', creator: 'B站课堂', description: '系统讲解Midjourney的提示词工程、参数调优和实战案例', url: 'https://www.bilibili.com/cheese/play/ss23652', duration: '60:00', skill: 'Midjourney提示词' },
      { title: 'DALL·E 3 vs Midjourney vs Stable Diffusion 实战对比', source: 'bilibili', creator: 'B站AI教程', description: '同一需求用三大AI绘画工具出图对比，帮你选最适合的工具', url: 'https://www.bilibili.com/video/BV1ZS421R7V7', duration: '25:00', skill: 'AI绘画工具选择' },
      { title: '用AI生成产品图和品牌视觉：电商设计全流程', source: 'bilibili', creator: 'B站AI教程', description: '从商品场景图到品牌VI设计，完整AI设计工作流演示', url: 'https://www.bilibili.com/video/BV1ZS421R7V7', duration: '30:00', skill: 'AI电商设计' }
    ] },
  { id: 'scene_research', name: '学术研究', icon: '📚', description: '学术研究的AI应用场景，包括论文润色、文献综述、论文摘要改写、知识总结等', coverImage: '📚', category: 'personal', aiLevel: 'L3', toolCount: 18, skillCount: 7, xhsSaves: 62000, tags: ['学术研究', '论文', '教育'], solutions: [
    { id: 's1', type: 'auto', title: 'AI学术研究助手', description: '用AI进行论文润色、文献综述、摘要改写、长文档分析', tools: ['ChatGPT', 'Claude', 'Kimi', 'Perplexity', 'DeepSeek'], skills: ['skill_paper_polish', 'skill_literature_review', 'skill_thesis_abstract'], effect: '论文写作效率提升200%，质量显著提升', difficulty: 'intermediate' },
    { id: 's2', type: 'auto', title: 'AI深度研究分析', description: '用AI进行文献调研、数据分析和论文核心提炼', tools: ['Perplexity', 'Kimi', 'ChatGPT'], skills: ['skill_knowledge_summary', 'skill_data_analysis'], effect: '文献调研时间缩短80%', difficulty: 'intermediate' }
    ],
    caseStudies: [
      { title: '用AI做文献综述：从检索到写作完整流程', source: 'bilibili', creator: 'B站课堂', description: '用AI工具批量检索文献、生成综述框架、润色论文', url: 'https://www.bilibili.com/cheese/play/ss127528650', duration: '40:00', skill: 'AI学术写作' },
      { title: 'Perplexity + ChatGPT 学术研究全攻略', source: 'bilibili', creator: 'B站课堂', description: '结合Perplexity的深度搜索和ChatGPT的分析能力完成学术研究', url: 'https://www.bilibili.com/cheese/play/ss127528650', duration: '30:00', skill: 'AI学术搜索' },
      { title: '论文润色和改写：用AI提升学术写作质量', source: 'bilibili', creator: 'B站课堂', description: '演示用ChatGPT和Claude进行论文润色、改写和降重', url: 'https://www.bilibili.com/cheese/play/ss127528650', duration: '25:00', skill: 'AI论文润色' }
    ] },
  { id: 'scene_shortvideo', name: '短视频', icon: '🎬', description: '短视频创作的AI应用场景，包括脚本创作、视频生成、数字人播报、背景音乐等', coverImage: '🎬', category: 'personal', aiLevel: 'L1', toolCount: 14, skillCount: 7, xhsSaves: 203000, tags: ['短视频', '视频创作', '社交媒体'], solutions: [
    { id: 's1', type: 'auto', title: 'AI短视频批量生产', description: '用AI生成脚本、数字人播报、添加音乐，批量制作短视频', tools: ['Runway', 'HeyGen', 'Suno', '豆包'], skills: ['skill_short_video_script', 'skill_video_subtitle'], effect: '短视频制作效率提升10倍', difficulty: 'beginner' },
    { id: 's2', type: 'semi', title: '爆款短视频流水线', description: '从选题策划到后期制作的全流程AI辅助', tools: ['Runway', 'HeyGen', 'Suno', '豆包', 'ChatGPT'], skills: ['skill_short_video_script', 'skill_podcast_script'], effect: '完播率提升40%，涨粉速度翻倍', difficulty: 'intermediate' }
    ],
    caseStudies: [
      { title: '用AI批量生成短视频：从脚本到成品全流程', source: 'bilibili', creator: 'B站AI教程', description: '用ChatGPT写脚本 + AI生成视频 + AI配乐，一条龙制作', url: 'https://www.bilibili.com/video/BV1ZS421R7V7', duration: '35:00', skill: 'AI短视频全流程' },
      { title: 'HeyGen数字人播报实战：5分钟制作专业口播视频', source: 'bilibili', creator: 'B站AI教程', description: '用HeyGen生成数字人形象+语音克隆，快速制作高质量口播内容', url: 'https://www.bilibili.com/video/BV1ZS421R7V7', duration: '20:00', skill: '数字人播报' },
      { title: 'AI视频生成工具横评：主流工具对比', source: 'bilibili', creator: 'B站AI教程', description: '主流AI视频工具对比测试，同一Prompt看哪家效果最好', url: 'https://www.bilibili.com/video/BV1ZS421R7V7', duration: '25:00', skill: 'AI视频工具对比' }
    ] },
  { id: 'scene_ecommerce', name: '电商运营', icon: '🛒', description: '电商运营的AI应用场景，包括商品描述、产品场景图、客服话术、活动策划等', coverImage: '🛒', category: 'personal', aiLevel: 'L1', toolCount: 18, skillCount: 8, xhsSaves: 156000, tags: ['电商运营', '营销', '运营'], solutions: [
    { id: 's1', type: 'auto', title: '商品卖点提炼', description: '自动分析商品特点，提炼核心卖点', tools: ['ChatGPT', 'Claude'], skills: ['skill_ecommerce_copy'], effect: '快速生成吸引人的商品描述', difficulty: 'beginner' },
    { id: 's2', type: 'auto', title: 'AI电商全链路', description: '从商品图生成到文案撰写到客服话术的完整AI流程', tools: ['Midjourney', 'DALL·E 3', '通义千问', 'ChatGPT', 'HeyGen'], skills: ['skill_product_image', 'skill_ecommerce_copy', 'skill_customer_service'], effect: '转化率提升35%，运营成本降低50%', difficulty: 'intermediate' }
    ],
    caseStudies: [
      { title: 'AI电商运营全链路：商品图+文案+客服一条龙', source: 'bilibili', creator: 'B站AI教程', description: '从AI生成商品场景图到自动撰写详情页文案，再到智能客服配置', url: 'https://www.bilibili.com/video/BV1ZS421R7V7', duration: '45:00', skill: 'AI电商全链路' },
      { title: '用Midjourney生成专业产品场景图', source: 'bilibili', creator: 'B站AI教程', description: '教你用AI为电商产品生成高质量的展示图和场景图', url: 'https://www.bilibili.com/video/BV1ZS421R7V7', duration: '20:00', skill: 'AI产品摄影' },
      { title: 'AI智能客服搭建：7x24小时自动化回复', source: 'bilibili', creator: 'B站AI教程', description: '用ChatGPT API搭建电商客服机器人，自动处理常见问题', url: 'https://www.bilibili.com/video/BV1ZS421R7V7', duration: '30:00', skill: 'AI客服搭建' }
    ] },
  // Niche scenes— tool sceneTags that didn't fit primary categories
  { id: 'scene_game', name: '游戏开发', icon: '🎮', description: '游戏开发的AI应用场景，包括角色设计、概念图、3D模型、游戏资产创建等', coverImage: '🎮', category: 'personal', aiLevel: 'L3', toolCount: 3, skillCount: 2, xhsSaves: 42000, tags: ['游戏开发', '设计创作', '3D'], solutions: [
    { id: 's1', type: 'auto', title: 'AI游戏资产生成', description: '用AI快速生成游戏角色、场景、道具等视觉资产', tools: ['Leonardo AI', 'Midjourney', 'Stable Diffusion', 'Luma AI'], skills: ['skill_avatar_design', 'skill_product_image'], effect: '游戏开发周期缩短40%，美术成本降低60%', difficulty: 'intermediate' },
    ],
    caseStudies: [
      { title: '用AI生成游戏资产：角色、场景、道具全流程', source: 'bilibili', creator: 'B站AI教程', description: '使用AI工具批量生成游戏美术资源', url: 'https://www.bilibili.com/video/BV1ZS421R7V7', duration: '35:00', skill: 'AI游戏美术' },
      { title: 'AI辅助Unity游戏开发：从概念到可玩原型', source: 'bilibili', creator: 'B站AI教程', description: '用ChatGPT生成Unity脚本+AI生成美术资源，快速搭建游戏原型', url: 'https://www.bilibili.com/video/BV1ZS421R7V7', duration: '50:00', skill: 'AI + Unity开发' }
    ] },
  { id: 'scene_video_production', name: '影视制作', icon: '🎥', description: '影视制作的AI应用场景，包括视频生成、特效制作、后期编辑、动态设计等', coverImage: '🎥', category: 'personal', aiLevel: 'L3', toolCount: 2, skillCount: 2, xhsSaves: 56000, tags: ['影视制作', '视频制作', '特效'], solutions: [
    { id: 's1', type: 'auto', title: 'AI影视内容创作', description: '用AI生成影视级视频内容和特效', tools: ['Runway', 'HeyGen', 'Luma AI'], skills: ['skill_short_video_script', 'skill_video_subtitle'], effect: '视频制作效率提升5倍，专业品质无需专业团队', difficulty: 'advanced' },
    ],
    caseStudies: [
      { title: 'AI影视级视频制作全流程', source: 'bilibili', creator: 'B站AI教程', description: '从脚本到分镜到生成，用AI工具制作专业级影视内容', url: 'https://www.bilibili.com/video/BV1ZS421R7V7', duration: '40:00', skill: 'AI影视制作' },
      { title: 'Runway Gen-3 实战：文字生成电影级视频', source: 'bilibili', creator: 'B站AI教程', description: 'Runway最新视频生成模型实操，教你写出高质量视频Prompt', url: 'https://www.bilibili.com/video/BV1ZS421R7V7', duration: '25:00', skill: 'Runway视频生成' }
    ] },
  { id: 'scene_music', name: '音乐制作', icon: '🎵', description: 'AI音乐制作的创作场景，包括AI作曲、歌曲生成、背景音乐、AI翻唱等', coverImage: '🎵', category: 'personal', aiLevel: 'L1', toolCount: 1, skillCount: 1, xhsSaves: 34000, tags: ['音乐制作', '音频', '创作'], solutions: [
    { id: 's1', type: 'auto', title: 'AI音乐创作工坊', description: '用AI生成完整歌曲、背景音乐、配乐', tools: ['Suno', 'ElevenLabs'], skills: ['skill_podcast_script'], effect: '音乐创作门槛降至零，3分钟内生成专业级作品', difficulty: 'beginner' },
    ],
    caseStudies: [
      { title: 'Suno AI音乐创作：从歌词到完整歌曲', source: 'bilibili', creator: 'B站音乐', description: '用Suno生成完整歌曲，涵盖作词、作曲、编曲全流程', url: 'https://www.bilibili.com/v/music/ai_music', duration: '30:00', skill: 'Suno音乐生成' },
      { title: 'ElevenLabs语音合成：从文本到专业配音', source: 'bilibili', creator: 'B站AI教程', description: '用ElevenLabs生成高拟真语音，适用于视频配音、有声书等场景', url: 'https://www.bilibili.com/video/BV1ZS421R7V7', duration: '20:00', skill: 'AI语音合成' }
    ] },
  { id: 'scene_business_plan', name: '商业计划书', icon: '📋', description: 'AI辅助商业计划书和PPT制作场景，包括融资BP、商业方案、路演材料等', coverImage: '📋', category: 'personal', aiLevel: 'L2', toolCount: 1, skillCount: 3, xhsSaves: 38000, tags: ['商业计划书', '创业', '融资'], solutions: [
    { id: 's1', type: 'auto', title: 'AI商业方案生成', description: '用AI快速生成商业计划书、融资BP和路演PPT', tools: ['Gamma', 'ChatGPT', 'Claude'], skills: ['skill_pitch_deck', 'skill_bd_proposal', 'skill_auto_ppt'], effect: '商业计划书制作时间从1周缩短至1天', difficulty: 'intermediate' },
    ],
    caseStudies: [
      { title: '用AI写商业计划书：从BP到路演PPT', source: 'bilibili', creator: 'B站AI教程', description: '用ChatGPT生成商业计划书框架，用AI自动制作路演PPT', url: 'https://www.bilibili.com/video/BV1ZS421R7V7', duration: '35:00', skill: 'AI商业方案' },
      { title: 'Gamma AI：一句话生成专业PPT', source: 'bilibili', creator: 'B站AI教程', description: 'Gamma从基础到进阶，教你用AI快速制作各类演示文稿', url: 'https://www.bilibili.com/video/BV1ZS421R7V7', duration: '25:00', skill: 'Gamma PPT制作' }
    ] },
  { id: 'scene_course_outline', name: '课程大纲', icon: '📖', description: 'AI辅助教育课程设计场景，包括课程大纲生成、课件制作、培训材料编写等', coverImage: '📖', category: 'personal', aiLevel: 'L2', toolCount: 1, skillCount: 3, xhsSaves: 29000, tags: ['课程大纲', '教育', '培训'], solutions: [
    { id: 's1', type: 'auto', title: 'AI课程设计助手', description: '用AI生成课程大纲、培训课件和教学材料', tools: ['Gamma', 'ChatGPT', 'Kimi'], skills: ['skill_exam_prep', 'skill_knowledge_summary', 'skill_child_education'], effect: '课程设计效率提升300%，内容质量专业级', difficulty: 'intermediate' },
    ],
    caseStudies: [
      { title: '用AI设计课程大纲：从框架到课件全流程', source: 'bilibili', creator: 'B站AI教程', description: '用AI生成课程大纲、设计教学活动和编写培训材料', url: 'https://www.bilibili.com/video/BV1ZS421R7V7', duration: '30:00', skill: 'AI课程设计' },
      { title: 'AI辅助K12教育：个性化学习方案设计', source: 'bilibili', creator: 'B站AI教程', description: '用AI为学生生成个性化学习计划和练习题', url: 'https://www.bilibili.com/video/BV1ZS421R7V7', duration: '25:00', skill: 'AI教育应用' }
    ] },
  // Legacy scenes kept for backwards compatibility
  { id: 'scene_enterprise_ai', name: '企业AI自动化', icon: '🏢', description: '企业级AI应用场景，涵盖智能客服、流程自动化、数据分析、知识管理等核心业务环节', coverImage: '🏢', category: 'enterprise', aiLevel: 'L4', toolCount: 10, skillCount: 6, xhsSaves: 45000, tags: ['企业AI', '自动化', '办公提效', '数据分析'], solutions: [
    { id: 's1', type: 'auto', title: '智能客服系统搭建', description: '用AI搭建7x24小时智能客服，处理常见问题、工单分配、客户意向识别', tools: ['ChatGPT', 'OpenAI Agents SDK'], skills: ['skill_weekly_report', 'skill_meeting_summary'], effect: '客服响应速度提升300%，人工成本降低60%', difficulty: 'advanced' },
    { id: 's2', type: 'semi', title: '企业内部知识库AI化', description: '将企业内部文档、流程、规范转化为AI可检索的知识库', tools: ['Kimi', 'Notion AI', '通义千问'], skills: ['skill_meeting_summary'], effect: '员工知识检索效率提升200%，新员工培训周期缩短50%', difficulty: 'intermediate' },
    { id: 's3', type: 'auto', title: '财务与人事报表自动化', description: '用AI自动生成财务分析、人事报表、销售预测等企业管理报表', tools: ['ChatGPT', 'Claude', 'DeepSeek'], skills: ['skill_weekly_report', 'skill_email_write'], effect: '报表制作时间从2小时缩短至10分钟', difficulty: 'intermediate' }
    ],
    caseStudies: [
      { title: '企业AI转型实战：从试点到规模化落地', source: 'bilibili', creator: 'B站AI教程', description: '分享企业从单个AI试点到全组织AI化的完整路径和避坑指南', url: 'https://www.bilibili.com/video/BV1ZS421R7V7', duration: '50:00', skill: '企业AI战略' },
      { title: '搭建企业内部AI知识库：从文档到智能问答', source: 'bilibili', creator: 'B站AI教程', description: '用RAG架构搭建企业知识库AI，让员工用自然语言查询内部信息', url: 'https://www.bilibili.com/video/BV1ZS421R7V7', duration: '40:00', skill: 'RAG知识库' },
      { title: 'AI客服系统从0到1：降低60%人工成本', source: 'bilibili', creator: 'B站AI教程', description: '用OpenAI API或开源模型搭建企业级智能客服系统', url: 'https://www.bilibili.com/video/BV1ZS421R7V7', duration: '45:00', skill: 'AI客服系统' }
    ] },
  // ===== 新增：AI Agent场景（今日热点） =====
  { id: 'scene_ai_agent', name: 'AI Agent', icon: '🤖', description: 'AI Agent架构与开发场景，涵盖Managed Agents范式、MCP生态、三文件框架、TDD驱动工作流等最新趋势', coverImage: '🤖', category: 'enterprise', aiLevel: 'L4', toolCount: 6, skillCount: 6, xhsSaves: 52000, tags: ['AI Agent', 'MCP', 'Agent架构', '自动化'], solutions: [
    { id: 's1', type: 'auto', title: 'Managed Agents架构', description: '按照Anthropic提出的大脑与手解耦范式，构建可扩展的Agent系统', tools: ['Claude', 'GPT-4', 'MCP Server'], skills: ['skill_managed_agents', 'skill_mcp_server_build'], effect: 'Agent系统架构清晰可扩展，大脑与手解耦独立演进', difficulty: 'advanced' },
    { id: 's2', type: 'auto', title: '三文件Agent搭建', description: '使用SOUL.md+RULES.md+MEMORY.md三文件极简框架配置Coding Agent', tools: ['Claude Code', 'Cursor'], skills: ['skill_three_file_framework', 'skill_vibe_coding'], effect: '5分钟完成Agent个性配置，开发效率翻倍', difficulty: 'beginner' },
    { id: 's3', type: 'auto', title: 'MCP生态接入', description: '为你的应用构建MCP Server，接入AI Agent生态', tools: ['MCP Server', 'Claude', 'Python'], skills: ['skill_mcp_server_build', 'skill_api_doc'], effect: '让你的App被AI Agent直接调用', difficulty: 'intermediate' }
    ],
    caseStudies: [
      { title: 'Building AI Agents with Managed Agents Architecture', source: 'youtube', creator: 'Anthropic', description: 'Anthropic官方讲解Managed Agents范式和Agent最佳实践', url: 'https://www.youtube.com/watch?v=3mZqO0q0Vb0', duration: '30:00', skill: 'Agent架构设计' },
      { title: 'MCP Protocol 完全指南：让你的应用被AI Agent调用', source: 'youtube', creator: 'AI Developer Hub', description: '从零开始构建MCP Server，接入AI Agent生态', url: 'https://www.youtube.com/watch?v=8T5qHEf7Kis', duration: '35:00', skill: 'MCP Server开发' },
      { title: 'OpenAI Agents SDK 实战：构建多Agent协作系统', source: 'youtube', creator: 'OpenAI', description: '用OpenAI Agents SDK搭建可协同工作的智能体集群', url: 'https://www.youtube.com/watch?v=VJqOQ2r0xD0', duration: '40:00', skill: 'Agents SDK' }
    ] },
  // ===== 新增：企业AI转型（2026-04-28） =====
  { id: 'scene_enterprise_transform', name: '企业AI转型', icon: '🏭', description: '企业级AI转型的系统方法论与实践指南，涵盖AI ROI评估、组织级Prompt工程体系、TOKEN成本归因、AI文化建设等核心环节', coverImage: '🏭', category: 'enterprise', aiLevel: 'L2', toolCount: 12, skillCount: 8, xhsSaves: 65000, tags: ['企业AI', 'AI转型', '组织能力', '数字化转型'], solutions: [
    { id: 's1', type: 'auto', title: 'AI ROI评估与成本控制', description: '建立TOKEN级归因体系，精确统计每个部门、每个任务的AI消耗与产出，避免糊涂账', tools: ['ChatGPT', 'Claude', 'DeepSeek'], skills: ['skill_weekly_report', 'skill_meeting_summary'], effect: 'AI投入产出比可量化，TOKEN成本降低40%', difficulty: 'intermediate' },
    { id: 's2', type: 'auto', title: '企业级Prompt工程体系', description: '构建统一的Prompt模板库、质量标准和版本管理机制，让全公司共享高质量的AI提示词', tools: ['ChatGPT', 'Claude', 'Kimi'], skills: ['skill_email_write', 'skill_meeting_summary'], effect: 'Prompt复用率提升300%，AI输出质量标准化', difficulty: 'intermediate' },
    { id: 's3', type: 'auto', title: 'AI组织能力建设', description: '从CEO认知跃迁到全员AI素养，构建AI-First的组织文化、人才梯队和协作机制', tools: ['ChatGPT', 'Claude', 'Notion AI'], skills: ['skill_weekly_report', 'skill_knowledge_summary'], effect: '组织AI采用率提升200%，跨部门协作效率翻倍', difficulty: 'advanced' }
    ],
    caseStudies: [
      { title: '企业AI ROI评估：如何衡量AI投入产出比', source: 'bilibili', creator: 'B站AI教程', description: '建立AI项目的ROI评估框架，从TOKEN成本到业务价值量化', url: 'https://www.bilibili.com/video/BV1ZS421R7V7', duration: '40:00', skill: 'AI ROI评估' },
      { title: '企业级Prompt工程体系：让全公司用AI说同一种语言', source: 'bilibili', creator: 'B站AI教程', description: '构建企业级Prompt模板库、版本管理和质量标准的完整方案', url: 'https://www.bilibili.com/video/BV1ZS421R7V7', duration: '30:00', skill: 'Prompt工程' },
      { title: '从CEO到全员：构建AI-First组织文化', source: 'bilibili', creator: 'B站AI教程', description: '企业AI转型的组织变革方法，包括AI人才培养和文化建设', url: 'https://www.bilibili.com/video/BV1ZS421R7V7', duration: '35:00', skill: '组织AI转型' }
    ] },
  // ===== 新增：GEO优化（2026-04-28） =====
  { id: 'scene_geo_optimization', name: 'GEO优化', icon: '🔍', description: 'GEO（生成式引擎优化）时代的AI品牌策略，让企业在AI搜索结果中被优先推荐和展示', coverImage: '🔍', category: 'enterprise', aiLevel: 'L2', toolCount: 8, skillCount: 5, xhsSaves: 48000, tags: ['GEO优化', 'SEO', 'AI搜索', '品牌策略', '流量获取'], solutions: [
    { id: 's1', type: 'auto', title: 'GEO内容策略', description: '从AI搜索的视角重构品牌表达，通过事实性描述、权威度背书和结构化呈现，让AI将企业识别为优质信息源', tools: ['ChatGPT', 'Claude', 'Perplexity'], skills: ['skill_wechat_article', 'skill_xhs_rewrite'], effect: 'AI搜索结果中的品牌曝光率提升500%', difficulty: 'intermediate' },
    { id: 's2', type: 'auto', title: '结构化数据优化', description: '通过Schema.org结构化数据标记、FAQPage/HowTo/ItemList等JSON-LD，让AI搜索引擎准确理解和推荐网站内容', tools: ['ChatGPT', 'Claude'], skills: ['skill_knowledge_summary'], effect: 'AI搜索结果摘要点击率提升200%', difficulty: 'advanced' },
    { id: 's3', type: 'semi', title: '多平台GEO矩阵', description: '在微信公众号、知乎、小红书、独立博客等平台构建GEO内容矩阵，全网覆盖AI搜索的流量入口', tools: ['ChatGPT', 'Claude', 'Kimi', '豆包'], skills: ['skill_wechat_article', 'skill_xhs_rewrite', 'skill_weibo_content'], effect: '全平台AI搜索可见度提升300%', difficulty: 'intermediate' }
    ],
    caseStudies: [
      { title: 'GEO优化完整指南：让AI搜索推荐你的品牌', source: 'bilibili', creator: 'B站AI教程', description: '生成式引擎优化（GEO）的核心理念和实操方法，面向2026年AI搜索', url: 'https://www.bilibili.com/video/BV1ZS421R7V7', duration: '45:00', skill: 'GEO策略' },
      { title: '结构化数据+AI搜索：Schema.org实战配置', source: 'bilibili', creator: 'B站AI教程', description: '手把手配置FAQPage、HowTo、ItemList等JSON-LD结构化数据', url: 'https://www.bilibili.com/video/BV1ZS421R7V7', duration: '30:00', skill: '结构化数据' },
      { title: '让AI Agent找到你：GEO内容策略实操', source: 'bilibili', creator: 'B站AI教程', description: '从AI Agent的视角重新组织内容，提升在AI搜索结果中的可见度', url: 'https://www.bilibili.com/video/BV1ZS421R7V7', duration: '25:00', skill: 'GEO内容策略' }
    ] },
];

export const dailyPicks: DailyPick[] = [
  { id: 'dp1', sceneId: 'scene_ai_agent', sceneName: 'AI Agent', coverImage: '🤖', description: 'Managed Agents架构爆发，MCP生态井喷，用三文件框架5分钟打造你的专属Coding Agent', toolCount: 6, skillCount: 6, xhsSaves: 52000, date: '2026-04-27' },
  { id: 'dp2', sceneId: 'scene_office', sceneName: '办公提效', coverImage: '📊', description: 'AI周报/会议纪要/简历优化一条龙，让重复性办公工作自动化，每天省出2小时', toolCount: 26, skillCount: 10, xhsSaves: 128000, date: '2026-04-26' },
  { id: 'dp3', sceneId: 'scene_ecommerce', sceneName: '电商运营', coverImage: '🛒', description: '从AI商品图生成到爆款文案撰写再到智能客服，全链路AI驱动电商提效300%', toolCount: 18, skillCount: 8, xhsSaves: 156000, date: '2026-04-25' },
  { id: 'dp4', sceneId: 'scene_research', sceneName: '学术研究', coverImage: '📚', description: '1M tokens超长上下文秒读30+篇论文，AI助你文献综述效率翻10倍', toolCount: 18, skillCount: 7, xhsSaves: 62000, date: '2026-04-24' },
  { id: 'dp5', sceneId: 'scene_programming', sceneName: '编程开发', coverImage: '💻', description: 'Vibe Coding新时代：用自然语言驱动AI生成80%以上代码，MVP开发周期从3周缩至3天', toolCount: 24, skillCount: 10, xhsSaves: 128000, date: '2026-04-23' },
  { id: 'dp6', sceneId: 'scene_shortvideo', sceneName: '短视频', coverImage: '🎬', description: 'AI数字人+脚本生成+背景音乐一键出片，短视频生产效率飙升10倍', toolCount: 14, skillCount: 7, xhsSaves: 203000, date: '2026-04-22' },
  { id: 'dp7', sceneId: 'scene_design', sceneName: '设计创作', coverImage: '🎨', description: 'MJ+DALL·E+SD三剑客PK：从概念图到产品场景图，单张设计成本降低90%', toolCount: 22, skillCount: 8, xhsSaves: 94000, date: '2026-04-21' },
  { id: 'dp8', sceneId: 'scene_content', sceneName: '内容创作', coverImage: '✍️', description: '小红书/公众号/微博三平台内容矩阵，一份素材AI自动适配多平台，日更20篇无压力', toolCount: 28, skillCount: 12, xhsSaves: 176000, date: '2026-04-20' },
  { id: 'dp9', sceneId: 'scene_enterprise_ai', sceneName: '企业AI自动化', coverImage: '🏢', description: '7x24小时智能客服+财务报表自动化+AI知识库，企业运营成本直降60%', toolCount: 10, skillCount: 6, xhsSaves: 45000, date: '2026-04-19' },
];