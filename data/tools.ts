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

  perplexity: {
    tips: [
      '支持选择搜索范围（全网/学术/视频等）',
      '结果自带引用链接可直接验证',
      'Pro版可使用更高级的模型和搜索能力',
      '使用具体的搜索词和限定词，Perplexity能返回更精准的结果',
      '利用高级搜索选项（学术/新闻/视频分类）定向获取信息',
    ],
    cases: [
      { title: '深度研究报告', description: '用Perplexity进行课题深度研究', prompt: '请对"[研究主题]"进行深度研究，包含：\n1. 最新进展和突破\n2. 主要争议和不同观点\n3. 关键参与方和研究机构\n4. 未来发展趋势\n5. 每个观点请提供来源引用' },
      { title: '事实核查验证', description: '用Perplexity验证信息真实性', prompt: '请核查以下陈述的真实性，提供可靠来源支持或反驳：\n[陈述内容]\n要求：1. 区分确认/存疑/错误 2. 提供权威来源链接 3. 说明判断依据' },
      { title: '竞品市场调研', description: '用Perplexity收集竞品和市场信息', prompt: '请对[行业/领域]进行市场调研：\n1. 主要竞争对手和产品\n2. 市场份额和增长趋势\n3. 技术创新方向\n4. 用户评价和痛点\n5. 最新行业动态' },
    ],
    guides: [
      { title: '新手入门指南', steps: [
        '访问 Perplexity 搜索平台',
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
  enhanceTool({ id: 'chatgpt', name: 'ChatGPT', logo: '🤖', description: 'OpenAI开发的旗舰级对话式AI助手，基于GPT-4/GPT-4o多模态大模型，支持文本生成、代码编写、图像分析、文件处理等多种任务。作为全球用户最多的AI工具，ChatGPT覆盖从日常问答到专业编程的全场景需求，凭借其强大的自然语言理解和生成能力，已成为个人提效和企业数字化转型的核心工具。2025年推出的GPT-4o进一步降低了使用门槛，免费用户也能体验顶级AI能力。适用于内容创作、编程开发、学术研究、办公自动化、数据分析等各类场景。', url: 'https://chat.openai.com', price: 'freemium', difficulty: 'beginner', heat: 77.9, heatGrowth: 12.6, tags: ['AI对话', '文本生成', '代码助手'], techTags: ['NLP', 'GenerativeAI'], sceneTags: ['办公提效', '内容创作', '编程开发', '企业AI自动化'], costTags: ['Freemium', '需翻墙'], category: 'AI对话', prompts: [{ id: 'p1', title: '小红书爆款文案生成', content: '请帮我写一篇关于[产品名称]的小红书文案，要求：1.开头有吸引力 2.使用emoji 3.包含3-5个卖点 4.结尾有call to action', scene: '电商运营' }, { id: 'p2', title: '周报生成助手', content: '根据以下本周工作内容，生成一份专业的周报：\\n[工作内容列表]\\n要求：分点清晰、数据量化、突出成果', scene: '办公提效' }, { id: 'p3', title: '论文摘要改写', content: '请将以下论文摘要改写为适合大众阅读的科普版本，要求通俗易懂，保留核心观点：\\n[论文摘要]', scene: '学术研究' }], tips: ['使用GPT-4可获得更好的推理能力', '可以上传图片进行多模态对话', 'Custom GPTs可针对特定任务优化'], relatedSkills: ['skill_xhs_rewrite', 'skill_weekly_report'], xhsSaves: 1250000, features: ['GPT-4o多模态理解：支持文本、图片、音频、文件混合输入，一次对话解决复合问题', 'Custom GPTs商店：社区创建的数万种专业AI助手，一键适配特定场景', '内存与个性化：AI自动学习用户偏好，长期对话保持上下文一致性', '代码解释器(Advanced Data Analysis)：上传数据文件自动分析、可视化、建模', '联网搜索(Browsing)：获取实时信息并引用可靠来源', 'DALL·E 3集成：对话中直接生成和编辑图片', '语音对话模式：自然的实时语音交互，支持多种语调和方言', '插件生态(Plugins)：扩展第三方服务如Zapier、Wolfram等'], pricing: 'ChatGPT提供免费版（GPT-3.5 + GPT-4o有限额度）和ChatGPT Plus（$20/月，GPT-4o无限+GPT-4高容量+插件+DALL·E 3）。Team版$25/人/月（团队协作），Enterprise版（企业级安全和定制）。免费用户每天可使用GPT-4o约50次消息，足以应对日常需求。', pros: ['生态最完善：插件、GPTs商店、DALL·E集成形成了完整的产品矩阵', '多模态能力领先：GPT-4o支持文本+图片+音频的混合理解，无出其右', '免费额度慷慨：免费用户就能用GPT-4o级模型，入门门槛极低', 'API成熟度高：全球最成熟的LLM API生态，几乎支持所有编程框架'], cons: ['需科学上网才能访问，中国用户使用有网络障碍', '免费版GPT-4o消息次数有限，重度使用需付费', '中文处理能力不如国产模型细腻，对中文文化语境理解有短板', '推理过程不透明，GPT-4并非最强推理模型（已被Claude和DeepSeek追赶）'], targetAudience: ['AI初学者：零基础用户通过自然对话快速上手AI工具', '内容创作者：写文案、做方案、润色文章的内容从业者', '程序员：辅助编码、代码审查、技术方案设计的开发人员', '企业办公人群：需提效的行政、HR、运营等办公人员', '学生和研究人员：论文润色、文献分析、学术写作辅助'], useCases: ['内容营销：从标题到正文到配图建议一站式生成，配合DALL·E实现图文联动', '数据分析：上传CSV/Excel文件用自然语言描述分析需求，自动生成图表和洞察报告', '编程Debug：将报错信息粘贴进去，AI分析原因并给出修复代码和解释', '邮件与文档：快速生成专业商务邮件、方案文档、会议纪要等办公内容', '辅助学习：解释复杂概念、生成练习题、总结知识点，充当1对1私教'], faqs: [{ question: 'ChatGPT免费版和付费版的核心区别是什么？', answer: '免费版使用GPT-3.5模型和有限额度的GPT-4o，付费Plus版（$20/月）提供无限GPT-4o访问、更高的GPT-4消息上限、DALL·E 3图片生成、数据分析、插件和联网搜索功能。对于日常写作和问答，免费版完全够用；编程和数据分析重度用户建议升级Plus。' }, { question: 'ChatGPT和Claude哪个更好？', answer: '两者各有所长。ChatGPT在插件生态、多模态、API开放性上领先；Claude在长文档处理（200K上下文）、代码能力和安全性上更优。建议：日常对话和创意写作用ChatGPT，深度编程和长文档分析用Claude。很多用户将两者结合使用。' }, { question: '国内怎么使用ChatGPT？', answer: 'ChatGPT目前需要科学上网才能访问。国内用户可考虑：1)通过正规VPN访问 2)使用国产替代方案如Kimi、DeepSeek、通义千问 3)通过ChatGPT API结合第三方客户端使用。后两者在中文场景下表现也不逊色。' }, { question: 'ChatGPT能处理多长的文本？', answer: 'GPT-3.5支持约4K tokens（约3000字），GPT-4支持8K/32K/128K tokens，GPT-4o支持128K tokens（约10万汉字）。对于常见文章和论文分析，128K上下文足够覆盖大部头文档，但和其他支持1M tokens的模型（如Kimi、DeepSeek）相比仍有差距。' }] }),
  enhanceTool({ id: 'midjourney', name: 'Midjourney', logo: '🎨', description: 'AI图像生成领域的开创者和标杆产品，通过文本描述即可生成电影级质量和艺术审美的图像。Midjourney基于自研的扩散模型架构，在美学表现、风格多样性和细节丰富度上长期领先同类产品。其v6版本大幅提升了文字渲染和构图能力，支持--style参数精细控制艺术风格。运营模式上采用Discord交互，社区活跃度极高，数百万创作者每天分享作品和Prompt提示词。从电商产品图到品牌视觉设计，从概念艺术到个人头像，Midjourney已成为创意工作者的标配工具。', url: 'https://www.midjourney.com', price: 'paid', difficulty: 'intermediate', heat: 74, heatGrowth: 10.4, tags: ['AI绘画', '图像生成', '创意设计'], techTags: ['GenerativeMedia', 'Diffusion'], sceneTags: ['设计创作', '电商运营', '内容创作'], costTags: ['Paid', '需翻墙'], category: '图像生成', prompts: [{ id: 'p1', title: '产品场景图', content: 'Product photography, [product] on a marble table, soft natural lighting, minimalist style, high-end luxury feel, 8k --ar 3:4', scene: '电商运营' }, { id: 'p2', title: '头像生成', content: 'Portrait illustration, [style], [person description], clean background, professional avatar, --ar 1:1', scene: '个人品牌' }], tips: ['使用--ar参数控制图片比例', 'v6版本对文字支持更好', '可以在Discord中查看他人Prompt学习'], relatedSkills: ['skill_batch_image'], features: ['文生图核心：通过自然语言描述生成4张候选图像，支持迭代优化', '多版本模型：v6（最佳画质和文字渲染）、v5.2（风格化最强）、Niji（动漫风格专精）', '精准参数控制：--ar（比例）、--s（风格强度）、--v（版本）、--stylize（风格化）等20+参数', '图生图/图生文：上传参考图作为构图或颜色风格参考', 'Pan/Zoom重绘：生成后向外扩展画面或放大局部细节', 'Remix模式：在变体生成时替换原Prompt部分内容进行混合创作', 'Blend功能：多图融合，将不同图片的风格和元素合成', 'Discord社区生态：数百万用户的作品库和Prompt灵感库'], pricing: 'Midjourney为纯付费模式，无免费版。基础版$10/月（约200张图/月），标准版$30/月（不限量+Fast模式），Pro版$60/月（Stealth隐私模式+更多并发）。年付可享20%折扣。建议从标准版起步，不限量生成+Fast模式体验最佳。试想用户可通过有限次数的免费试用（约25张）决定是否付费。', pros: ['美学质量业界第一：生成的图像在构图、光影、色彩上具有真正的艺术感', '风格多样性极强：从写实摄影到浮世绘到赛博朋克，几乎覆盖所有视觉风格', '参数控制系统强大：20+参数让高级用户拥有精细创作控制力', '社区生态繁荣：Discord上百万级别的Prompt库和学习资源'], cons: ['完全付费且价格较高：最低$10/月起，不适合偶尔使用的用户', '需在Discord中操作：没有独立App，交互方式特殊学习曲线陡峭', '生成速度较慢：单次生成约需30-60秒，批量生产效率不足', '中文Prompt效果差：必须使用英文提示词，对中国用户有语言门槛'], targetAudience: ['设计师/创意总监：需要快速产出创意方案和视觉参考的专业设计人员', '电商运营者：需要产品场景图、营销素材的电商团队', '个人品牌创作者：需要头像、封面图、品牌视觉的独立创作者', '游戏/影视概念设计师：需要快速生成角色、场景概念图的美术人员', 'AI艺术爱好者：对AI生成艺术有浓厚兴趣的探索型用户'], useCases: ['电商产品图批量生产：利用产品图+场景描述，批量生成多风格产品展示图用于A/B测试', '品牌视觉体系搭建：从Logo到VI应用图到社交媒体封面，统一品牌视觉风格', '概念艺术设计：游戏角色/建筑/场景的概念图快速迭代，大幅降低外包沟通成本', '社交媒体配图：根据文章主题生成配图，风格一致且无版权风险', '室内软装设计预览：上传房间照片+风格描述，生成装修效果预览图'], faqs: [{ question: 'Midjourney和其他AI绘画工具（DALL·E 3/Stable Diffusion）相比如何？', answer: 'Midjourney在美学质量上公认最强，产出更接近"艺术作品"而非"AI生成图"。DALL·E 3在自然语言理解上更好，对复杂指令的遵循更准确，适合精确控制画面的场景。Stable Diffusion胜在开源免费+本地部署+ControlNet精准控制，适合需要批量生产或定制模型的专业用户。简单说：追求艺术美感选MJ，追求精准控制选SD，追求易用性选DALL·E。' }, { question: 'Midjourney必须用英文提示词吗？', answer: '是的，Midjourney的核心模型基于英文训练，中文提示词效果很差。不过你可以在ChatGPT中先用中文描述，让ChatGPT翻译成专业MJ英文Prompt再使用。也可以参考我们页面中的Prompt案例库，从中提取适合你场景的英文模板。' }, { question: 'Midjourney生成的图片有版权吗？可以商用吗？', answer: '付费用户拥有生成的图片的全部所有权和商用权利，包括用于商业产品、印刷品、数字资产等。免费试用用户生成的图片使用CC BY-NC 4.0协议（仅限非商业用途）。Pro版用户还支持Stealth模式，生成的图片不会出现在公共画廊中，保护商业项目隐私。' }, { question: '哪个版本最适合我？新手如何选择？', answer: 'v6是目前最新版本，在文字渲染、真实感和构图方面全面领先，推荐新手直接使用。如果你需要动漫/二次元风格，选择Niji模型效果最佳。v5.2在艺术风格化方面仍有独特优势。在Discord中通过/settings命令可切换默认版本，或者在提示词末尾加--v 6/--v 5.2/--niji 6来指定。' }] }),
  enhanceTool({ id: 'gamma', name: 'Gamma', logo: '📊', description: 'AI驱动的演示文稿生成工具，一句话生成完整PPT', url: 'https://gamma.app', price: 'freemium', difficulty: 'beginner', heat: 59.4, heatGrowth: 21.4, tags: ['PPT生成', '演示文稿', '办公工具'], techTags: ['GenerativeAI'], sceneTags: ['办公提效', '商业计划书', '课程大纲'], costTags: ['Freemium', '中文友好'], category: '办公工具', prompts: [{ id: 'p1', title: '学术答辩PPT', content: '生成一份关于"[论文主题]"的学术答辩PPT，包含：研究背景、研究方法、实验结果、结论与展望', scene: '学术研究' }, { id: 'p2', title: '商业计划书', content: '为"[项目名称]"生成商业计划书PPT，包含：市场痛点、解决方案、商业模式、竞争优势、财务预测', scene: '创业' }], tips: ['支持导入PDF文档自动生成PPT', '可以选择不同风格模板', '生成后可以在线编辑'], relatedSkills: ['skill_auto_ppt'] }),
  enhanceTool({ id: 'kimi', name: 'Kimi', logo: '🌙', description: '月之暗面推出的AI助手，支持超长上下文和文件分析', url: 'https://kimi.moonshot.cn', price: 'free', difficulty: 'beginner', heat: 65.2, heatGrowth: 35.8, tags: ['AI对话', '长文本', '文件分析'], techTags: ['NLP', 'RAG'], sceneTags: ['办公提效', '学术研究', '内容创作', '企业AI自动化'], costTags: ['Free', '中文友好'], category: 'AI对话', prompts: [{ id: 'p1', title: 'PDF论文解析', content: '请分析以下PDF论文，提取核心观点、研究方法、结论，并列出可能的应用场景：', scene: '学术研究' }, { id: 'p2', title: '会议纪要生成', content: '根据以下会议记录，生成结构化的会议纪要，包含：议题、讨论要点、行动计划、待办事项', scene: '办公提效' }], tips: ['支持最多20万字上下文', '可以直接读取PDF、Word、Excel等文件', '支持联网搜索'], relatedSkills: [] }),
  enhanceTool({ id: 'claude', name: 'Claude', logo: '🧊', description: 'Anthropic推出的新一代AI助手，基于Claude 3.5/4系列大模型，在长文本分析、代码生成和深度推理方面表现卓越。Claude以其超长200K上下文窗口、强安全约束和出色的写作能力著称，尤其擅长处理复杂编程任务、长文档分析和学术写作。Artifacts功能使其成为唯一能创建可交互Web内容的对话AI。相比ChatGPT，Claude在代码生成质量、数学推理和多轮对话一致性方面表现更优，被开发者社区誉为"最强编程AI"。适用于编程开发、学术研究、内容创作和企业办公等专业场景。', url: 'https://claude.ai', price: 'freemium', difficulty: 'intermediate', heat: 72.3, heatGrowth: 8.2, tags: ['AI对话', '代码助手', '分析工具'], techTags: ['NLP', 'GenerativeAI'], sceneTags: ['编程开发', '内容创作', '办公提效', '企业AI自动化'], costTags: ['Freemium', '需翻墙'], category: 'AI对话', prompts: [{ id: 'p1', title: '代码重构建议', content: '请分析以下代码，提出重构建议以提升可读性和性能：\\n[代码]', scene: '编程开发' }, { id: 'p2', title: '文章润色', content: '请润色以下文章，提升语言表达和逻辑连贯性：\\n[文章内容]', scene: '内容创作' }], tips: ['Claude 3.5 Sonnet 性价比最高', 'Artifacts功能可以创建交互式内容', '支持上传文件进行分析'], relatedSkills: [], features: ['200K超长上下文窗口：一次处理约15万字，可完整分析整本书或大型代码库', 'Artifacts交互式输出：生成可直接运行的HTML/React/SVG页面，非基础文字回复', 'Claude Code CLI：终端原生AI编程助手，支持项目级别代码编辑和重构', 'Git集成：直接读取GitHub仓库、PR、Issue进行上下文理解', '文件上传分析：支持PDF/Word/Excel/图像/代码文件的内容提取和理解', '安全性设计：Constitutional AI训练，确保输出安全合规', 'Projects项目管理：创建独立项目空间，配置专属知识和指令', '高速响应：Claude 3.5 Haiku实现毫秒级响应，适合高频交互'], pricing: 'Claude提供免费版（Claude 3.5 Sonnet有限额度）和Claude Pro（$20/月，5倍额度+优先访问+更高速率）。Team版$25/人/月（共享额度+管理控制台），Enterprise版（企业级安全+SSO+审计日志）。免费用户每8小时约可使用30-50条消息。Claude Code CLI单独计费。', pros: ['编程能力业界顶尖：代码生成准确率高，尤其擅长TypeScript/React/Python', '超长上下文独一档：200K tokens可完整处理大型项目代码库', 'Artifacts创新体验：直接在对话中创建可交互内容，远超纯文本回复', '安全合规最强：Constitutional AI训练，企业级安全审计'], cons: ['需科学上网才能访问，中国用户使用不便', '免费额度较少，重度使用必须订阅Pro', '无原生图片生成和插件生态系统，功能不如ChatGPT丰富', '不支持多模态输入（不能直接分析图片内容）'], targetAudience: ['专业程序员：深度代码编写、代码审查、大型项目重构的开发者', '学术研究者：论文阅读、文献综述、长文档分析的科研人员', '技术写作专家：技术文档、API文档、教程编写的专业写作者', '创业者：需要快速MVP开发、商业计划撰写、技术方案设计的创始人', '数据分析师：复杂数据集的逻辑分析和洞察提取'], useCases: ['大型代码库重构：将项目完整代码通过上下文提交，AI分析架构并给出重构方案', '论文全篇审校：上传完整论文PDF，Claude逐章审校逻辑结构和语言表达', '交互式原型设计：用Artifacts生成可交互的UI原型或数据可视化页面', '技术方案设计：描述业务需求，Claude输出完整的技术架构方案和选型建议', 'PR代码审查：集成GitHub后自动审查PR，给出逐行修改建议'], faqs: [{ question: 'Claude和ChatGPT在编程上谁更强？', answer: '根据多项基准测试和开发者反馈，Claude 3.5 Sonnet在代码生成准确率上略胜GPT-4o。Claude的优势在于：1)超长上下文可处理大项目 2)代码重构和历史理解更好 3)安全意识强不会生成危险代码。ChatGPT的优势在于插件生态和API开放性。建议：前端/全栈开发首选Claude，需要API集成和工具联动时选ChatGPT。' }, { question: 'Claude的Artifacts是什么？有什么用？', answer: 'Artifacts是Claude独有的功能，允许它在对话中创建可直接运行的交互式内容，如HTML网页、React组件、SVG图片、Mermaid图表等。用户可以在聊天界面中实时预览、编辑和导出这些内容。非常适合快速原型设计、数据可视化、技术文档插图等场景。' }, { question: 'Claude 200K上下文到底能处理多少内容？', answer: '200K tokens约等于15万汉字或500页的书籍内容。这意味着你可以：1)直接把完整的小说或论文丢进去分析 2)把整个React项目源码放进去审查 3)分析长达数小时的会议转录。相比GPT-4o的128K和Kimi的200K，Claude的长上下文处理质量在业界排名第一。' }, { question: 'Claude免费版够用吗？', answer: '轻度使用（每天10-20条消息）免费版够用。免费版使用的也是Claude 3.5 Sonnet模型，性能和付费版一致，只是消息次数受限（约每8小时30-50条）。如果你是程序员每天大量使用AI编程，建议升级Pro（$20/月），性价比非常高。' }] }),
  { id: 'runway', name: 'Runway', logo: '🎬', description: 'AI视频生成和编辑平台，支持文生视频、图生视频', url: 'https://runwayml.com', price: 'freemium', difficulty: 'intermediate', heat: 58.6, heatGrowth: 15.3, tags: ['AI视频', '视频编辑', '视频生成'], techTags: ['GenerativeMedia', 'VideoAI'], sceneTags: ['内容创作', '短视频', '影视制作'], costTags: ['Freemium', '需翻墙'], category: '视频生成', prompts: [{ id: 'p1', title: '文字生成视频', content: 'A cinematic shot of a [subject] in [environment], [camera movement], highly detailed, 8k', scene: '创意视频' }, { id: 'p2', title: '图片生成视频', content: 'Animate this image with [specific motion], smooth movement, realistic', scene: '视频制作' }], tips: ['Gen-2支持文字生成视频', '提供多种预设风格', '可以在现有视频上进行AI编辑'], relatedSkills: [] },
  { id: 'suno', name: 'Suno', logo: '🎵', description: 'AI音乐生成工具，可以用文字描述生成完整歌曲', url: 'https://suno.com', price: 'freemium', difficulty: 'beginner', heat: 62.8, heatGrowth: 28.7, tags: ['AI音乐', '音乐生成', '音频工具'], techTags: ['GenerativeMedia', 'AudioAI'], sceneTags: ['内容创作', '短视频', '音乐制作'], costTags: ['Freemium', '需翻墙'], category: '音频生成', prompts: [{ id: 'p1', title: '流行歌曲生成', content: 'Generate a pop song about [topic], upbeat tempo, catchy melody, verse-chorus structure', scene: '音乐创作' }, { id: 'p2', title: '背景音乐生成', content: 'Create an instrumental background music, ambient, calm, suitable for [scenario]', scene: '视频配乐' }], tips: ['支持生成带歌词的完整歌曲', '可以选择音乐风格和乐器', '生成的音乐可用于商业用途'], relatedSkills: [] },
  // ===== 新增工具 =====
  { id: 'perplexity', name: 'Perplexity', logo: '🔍', description: 'AI搜索引擎，结合实时网络信息提供带引用的准确答案', url: 'https://www.perplexity.ai', price: 'freemium', difficulty: 'beginner', heat: 68.5, heatGrowth: 22.3, tags: ['AI搜索', '信息检索', '研究工具'], techTags: ['NLP', 'RAG', 'Search'], sceneTags: ['学术研究', '办公提效', '编程开发', '企业AI自动化'], costTags: ['Freemium', '需翻墙'], category: 'AI搜索', prompts: [{ id: 'p1', title: '深度研究', content: '请对"[研究主题]"进行深度研究，包含：最新进展、关键争议、主要参与方、未来展望，每个观点请提供来源引用', scene: '学术研究' }, { id: 'p2', title: '事实核查', content: '请核查以下陈述的真实性，提供可靠来源支持或反驳：[陈述内容]', scene: '办公提效' }], tips: ['支持选择搜索范围（全网/学术/视频等）', '结果自带引用链接可直接验证', 'Pro版可使用更高级的模型和搜索能力'], relatedSkills: [] },
  { id: 'cursor', name: 'Cursor', logo: '⌨️', description: 'AI原生的智能代码编辑器，深度集成AI辅助编程体验，被誉为"VS Code最佳替代品"。基于VS Code架构构建，Cursor在保留全部VS Code生态（主题、插件、快捷键）的基础上，将AI无缝嵌入到每个编码环节：从代码补全到对话式编程，从跨文件重构到一键Debug。其Tab补全、Ctrl+K智能编辑和Composer多文件编辑三大核心功能，使开发者效率提升2-5倍。支持GPT-4o、Claude 3.5和自研模型混合调用，是Vibe Coding（氛围编程）时代最具代表性的工具之一。', url: 'https://cursor.sh', price: 'freemium', difficulty: 'intermediate', heat: 75.6, heatGrowth: 31.2, tags: ['代码编辑器', 'AI编程', '开发工具'], techTags: ['GenerativeAI', 'CodeGen'], sceneTags: ['编程开发'], costTags: ['Freemium', '需翻墙'], category: '编程开发', prompts: [{ id: 'p1', title: '代码生成', content: '请生成一个[功能描述]的[编程语言]函数，要求：遵循最佳实践、包含错误处理、添加详细注释', scene: '编程开发' }, { id: 'p2', title: '代码重构', content: '请重构以下代码，提升可读性和性能，同时保持功能不变：[代码]', scene: '编程开发' }], tips: ['Ctrl+K 快速编辑选中代码', 'Ctrl+L 对话式编程助手', '支持多文件上下文理解和跨文件重构'], relatedSkills: ['skill_code_review'], features: ['Tab智能补全：预测光标位置的下一步操作，比Copilot更精准的代码建议', 'Ctrl+K内联编辑：选中代码后直接输入修改指令，AI实时替换', 'Composer多文件编辑：一次对话同时修改多个文件，AI自动保持代码一致性', 'Chat侧边栏：全项目级别的对话，AI理解整个代码库结构', 'Agent模式：AI自动执行多步骤任务（搜索→编辑→运行→修复）', 'Rules自定义规则：为项目配置专属AI编码规则和最佳实践', '上下文@引用：精确引用文件/函数/类作为AI理解的上下文锚点', '多模型切换：内置GPT-4o、Claude 3.5 Sonnet和Cursor自研模型'], pricing: 'Cursor提供免费版（每月2000次补全+50次高级模型请求）和Pro版（$20/月，无限补全+500次高级模型请求+无限Chat）。Business版$40/月（团队管理+集中计费）。新用户可免费试用Pro功能14天。相比GitHub Copilot（$10/月），Cursor价格翻倍但功能深度远超Copilot。', pros: ['AI深度融入编辑器：每个环节都有AI参与，不是简单的补全工具而是编程搭档', '多文件编辑能力突出：Composer可理解代码间依赖关系，跨文件修改准确到位', 'Rules+上下文引用：让AI理解项目的最佳实践和技术栈，输出更精准', '模型选择灵活：在GPT-4o和Claude 3.5间切换，按任务选择最优模型'], cons: ['价格较高：Pro版$20/月，比Copilot贵一倍，小团队成本压力大', '重量级编辑器：对大型项目的索引和加载速度慢于VS Code原生', '高级功能限制：免费版高级模型请求仅50次/月，体验受限', '国内网络不稳定：需稳定翻墙才能使用AI功能'], targetAudience: ['前端/全栈开发者：在React/Vue/Next.js项目中高频使用AI辅助的Web开发人员', '独立开发者/创业者：需要快速迭代MVP的小团队和个人开发者', 'AI编程爱好者：热衷于Vibe Coding工作流的探索型程序员', '技术团队Lead：需要为团队配置统一AI编码规范的技术管理者', '从Copilot升级的用户：对代码建议深度和项目理解有更高要求的开发者'], useCases: ['全栈应用开发：通过Composer同时修改API层、数据库模型和前端组件，AI保持一致性', '代码迁移重构：将老项目从JavaScript迁移到TypeScript，AI自动处理类型标注', 'Bug修复工作流：将错误日志通过@粘贴到Chat，AI分析根因并给出修复方案', '测试驱动开发：先写测试用例描述，用Agent模式让AI生成通过测试的实现', '新项目脚手架：描述项目需求，AI生成完整项目结构、配置文件和核心代码'], faqs: [{ question: 'Cursor和VS Code + Copilot相比哪个更好？', answer: 'Cursor是AI优先设计的编辑器，不是VS Code插件。主要优势：1)Tab补全比Copilot更智能，能预测整行而非单字 2)Composer可同时编辑多个文件 3)AI理解项目全局架构。劣势：1)每月$20 vs Copilot的$10 2)生态不如VS Code稳定。建议：深度AI编程用户选Cursor，轻度使用者Copilot足够。' }, { question: 'Cursor免费版够用吗？', answer: '免费版每月2000次补全和50次高级模型请求。对于轻度编码（每天<100次补全）够用2-3周。但如果每天大量使用AI编程，建议Pro版。值得关注的是免费版使用的模型和Pro版相同，只是次数限制。' }, { question: 'Cursor支持哪些编程语言？', answer: '由于基于VS Code，支持VS Code支持的所有编程语言：JavaScript/TypeScript/Python/Java/Go/Rust/C++/PHP等。AI对不同语言的支持质量取决于模型训练数据，Python/JS/TS质量最高，Java/Go其次，小众语言建议使用Claude模型效果更好。' }, { question: 'Cursor的Agent模式和Composer有什么区别？', answer: 'Composer是手动驱动的多文件编辑模式——你在对话框中描述需求，AI理解并修改多个文件。Agent模式是自动执行的——AI自己规划步骤、读取文件、修改代码、运行命令、修复问题，更像一个自主开发者。Agent模式适合明确定义的任务（"给这个页面添加暗黑模式"），Composer适合需要迭代讨论的复杂修改。' }] },
  { id: 'devin', name: 'Devin', logo: '🦾', description: 'AI全栈软件工程师，可独立完成从需求到部署的开发任务', url: 'https://cognition.ai', price: 'paid', difficulty: 'advanced', heat: 55.3, heatGrowth: 45.6, tags: ['AI编程', 'AI代理', '自动开发'], techTags: ['Agent', 'CodeGen', 'Autonomous'], sceneTags: ['编程开发'], costTags: ['Paid', '需翻墙'], category: '编程开发', prompts: [], tips: ['可以独立完成浏览器测试和调试', '支持接入 Slack 和 IDE', '适合自动化重复性开发任务'], relatedSkills: ['skill_code_review', 'skill_unit_test'] },
  { id: 'notion_ai', name: 'Notion AI', logo: '📝', description: '集成在Notion中的AI写作助手，辅助知识管理和内容创作', url: 'https://www.notion.so/product/ai', price: 'paid', difficulty: 'beginner', heat: 60.2, heatGrowth: 18.5, tags: ['AI写作', '知识管理', '办公工具'], techTags: ['NLP', 'GenerativeAI'], sceneTags: ['办公提效', '内容创作', '企业AI自动化'], costTags: ['Paid', '中文友好'], category: '办公工具', prompts: [{ id: 'p1', title: '文档摘要', content: '请总结以下文档的核心要点，用3-5个要点呈现：[文档内容]', scene: '办公提效' }, { id: 'p2', title: '会议记录模板', content: '帮我创建一个标准会议记录模板，包含：会议主题、参会人员、讨论要点、决策记录、待办事项', scene: '办公提效' }], tips: ['在Notion文档中按空格即可呼出AI', '支持翻译、润色、续写等多种功能', 'AI结果可以自动保存为Notion数据库条目'], relatedSkills: ['skill_meeting_summary'] },
  { id: 'heygen', name: 'HeyGen', logo: '🎭', description: 'AI视频生成平台，支持数字人播报和多语言视频制作', url: 'https://www.heygen.com', price: 'paid', difficulty: 'beginner', heat: 57.4, heatGrowth: 33.9, tags: ['AI视频', '数字人', '视频制作'], techTags: ['GenerativeMedia', 'VideoAI', 'Avatar'], sceneTags: ['内容创作', '短视频', '电商运营'], costTags: ['Paid', '需翻墙'], category: '视频生成', prompts: [], tips: ['支持120+语言的数字人播报', '可以上传照片生成数字人形象', '文案一键生成视频，适合跨境电商'], relatedSkills: ['skill_short_video_script'] },
  { id: 'stable_diffusion', name: 'Stable Diffusion', logo: '🖼️', description: '开源AI图像生成模型，支持本地部署和精细控制', url: 'https://stability.ai', price: 'free', difficulty: 'advanced', heat: 66.7, heatGrowth: 9.8, tags: ['AI绘画', '图像生成', '开源'], techTags: ['Diffusion', 'GenerativeMedia', 'OpenSource'], sceneTags: ['设计创作', '内容创作'], costTags: ['Free', '中文友好'], category: '图像生成', prompts: [{ id: 'p1', title: '角色设计', content: 'Character design, [style], full body, [expression], detailed clothing, clean background, --ar 2:3', scene: '设计创作' }, { id: 'p2', title: '场景概念图', content: 'Fantasy landscape, [theme], epic scale, volumetric lighting, 4k, --ar 16:9', scene: '设计创作' }],    tips: ['推荐使用Automatic1111或ComfyUI作为前端', 'ControlNet可以精确控制姿态和构图', 'LoRA模型可以生成特定风格或角色', 'SD-XL 1.0已发布permissive license版本，适合商业使用'], relatedSkills: ['skill_product_image'] },
  { id: 'copilot', name: 'GitHub Copilot', logo: '🤝', description: 'AI代码补全助手，实时提供代码建议和自动补全', url: 'https://github.com/features/copilot', price: 'paid', difficulty: 'beginner', heat: 73.1, heatGrowth: 14.6, tags: ['AI编程', '代码补全', '开发工具'], techTags: ['CodeGen', 'GenerativeAI'], sceneTags: ['编程开发'], costTags: ['Paid', '需翻墙'], category: '编程开发', prompts: [], tips: ['在VS Code/JetBrains中安装插件即可使用', '支持HTML/CSS/JS/Python等主流语言', 'Copilot Chat可以对话式解决编码问题'], relatedSkills: ['skill_code_review', 'skill_unit_test'] },
  { id: 'dalle', name: 'DALL·E 3', logo: '🎨', description: 'OpenAI的最强图像生成模型，理解自然语言描述精准', url: 'https://openai.com/dall-e-3', price: 'paid', difficulty: 'beginner', heat: 64.9, heatGrowth: 11.3, tags: ['AI绘画', '图像生成'], techTags: ['Diffusion', 'GenerativeMedia'], sceneTags: ['设计创作', '内容创作', '电商运营'], costTags: ['Paid', '需翻墙'], category: '图像生成', prompts: [{ id: 'p1', title: '产品展示图', content: '[Product] on a clean white background, professional product photography, soft lighting, minimal, high quality', scene: '电商运营' }, { id: 'p2', title: '插画设计', content: 'Digital illustration of [subject], [style], vibrant colors, detailed, professional', scene: '设计创作' }], tips: ['通过ChatGPT Plus使用，直接自然语言描述即可', '对文字和复杂构图的理解能力很强', '生成的图片可以再次编辑修改部分区域'], relatedSkills: ['skill_product_image', 'skill_logo_design'] },
  { id: 'leonardo', name: 'Leonardo AI', logo: '🐉', description: '综合AI创作平台，集成图像生成、训练和编辑功能', url: 'https://leonardo.ai', price: 'freemium', difficulty: 'intermediate', heat: 52.1, heatGrowth: 19.7, tags: ['AI绘画', '图像生成', '创作平台'], techTags: ['Diffusion', 'GenerativeMedia'], sceneTags: ['设计创作', '内容创作', '游戏开发'], costTags: ['Freemium', '需翻墙'], category: '图像生成', prompts: [{ id: 'p1', title: '游戏角色设计', content: 'Fantasy character design, [class], [weapon], detailed armor, dynamic pose, game art style, --ar 9:16', scene: '游戏开发' }, { id: 'p2', title: '建筑概念图', content: 'Architectural concept, [building type], modern style, [environment], photorealistic, cinematic lighting', scene: '设计创作' }], tips: ['提供丰富的预设风格模型', '可以训练自己的专属模型', '每日免费额度充足'], relatedSkills: ['skill_avatar_design'] },
  { id: 'luma', name: 'Luma AI', logo: '🎥', description: 'AI 3D和视频生成工具，支持文本到3D、图生3D和视频', url: 'https://lumalabs.ai', price: 'freemium', difficulty: 'intermediate', heat: 48.5, heatGrowth: 27.3, tags: ['AI视频', '3D生成', '创意工具'], techTags: ['GenerativeMedia', '3DAI', 'NeRF'], sceneTags: ['内容创作', '设计创作', '游戏开发'], costTags: ['Freemium', '需翻墙'], category: '3D生成', prompts: [], tips: ['快速生成高质量3D模型', 'Dream Machine支持文生视频', '适合概念设计和产品展示'], relatedSkills: [] },
  enhanceTool({ id: 'deepseek', name: 'DeepSeek', logo: '🧠', description: '深度求索推出的国产AI大模型，以1M tokens超长上下文和卓越的代码能力著称，是开源社区最受欢迎的国产AI之一。DeepSeek V3/R1系列模型在多项基准测试中比肩GPT-4和Claude 3.5，且完全免费使用。其R1推理模型采用Chain-of-Thought技术，在数学、逻辑推理和编程竞赛中表现惊艳，被誉为"开源界的GPT-4"。1M tokens上下文窗口可一次处理三体三部曲级别的文本量，远超同类产品。对中国用户而言，DeepSeek是免费高质量的AI首选。', url: 'https://chat.deepseek.com', price: 'free', difficulty: 'beginner', heat: 71.8, heatGrowth: 52.4, tags: ['AI对话', '代码助手', '长文本'], techTags: ['NLP', 'GenerativeAI'], sceneTags: ['编程开发', '办公提效', '学术研究', '企业AI自动化'], costTags: ['Free', '中文友好'], category: 'AI对话', prompts: [{ id: 'p1', title: '编程问题解决', content: '请帮我解决这个编程问题：[描述问题]\\n相关代码：[代码片段]', scene: '编程开发' }, { id: 'p2', title: '长文档分析', content: '请分析以下文档，提取关键信息：[文档内容]', scene: '办公提效' }], tips: ['上下文长度达1M tokens，可处理超长文档', '代码能力在开源模型中领先', '完全免费无需翻墙'], relatedSkills: ['skill_code_review', 'skill_weekly_report'], features: ['1M超长上下文：可一次处理约75万汉字，相当于三体三部曲的总字数', 'DeepSeek R1推理模型：Chain-of-Thought深度推理，在数学和编程竞赛中表现顶尖', 'DeepSeek V3通用模型：日常对话、内容创作、代码编写的全能模型', '文件上传处理：支持PDF/Word/Excel/TXT等多种格式的内容分析', '联网搜索支持：获取最新信息并给出有来源的答案', '完全免费无限制：无消息次数限制，无需付费订阅', 'R1蒸馏版本：提供多种尺寸的小模型供本地部署和二次开发', '中文优化：对中文语境的深度理解和地道表达'], pricing: 'DeepSeek目前完全免费，无需付费订阅，无消息次数限制。Web端和App端均可免费使用全部功能（包括DeepSeek R1推理模型和联网搜索）。API方面，DeepSeek提供极具竞争力的定价：V3模型约$0.27/1M输入tokens，$1.10/1M输出tokens，远低于OpenAI和Anthropic。作为对比，同等质量下DeepSeek的API成本仅为GPT-4的约1/10。', pros: ['完全免费零门槛：无需付费、无需科学上网，注册即用无限制', '1M超长上下文遥遥领先：是Claude的5倍、GPT-4o的8倍', 'R1推理模型独树一帜：展示完整推理过程，数学和逻辑能力顶级', 'API成本极低：仅为GPT-4的1/10，适合大规模商业调用'], cons: ['高峰期偶有服务器拥堵，响应速度不如海外产品稳定', '中文互联网知识覆盖好但对小众英文领域理解略逊', '多模态能力有限（文字模型），不支持原生图片生成和分析', 'R1模型推理速度较慢（Chain-of-Thought过程耗时较长）'], targetAudience: ['中国程序员：无需翻墙的顶级AI编程助手，代码能力媲美Claude', '学术研究者：需要分析大量PDF论文和长文档的科研人员', '企业降本增效小组：预算有限但需要AI赋能的中小团队', 'AI学习爱好者：研究开源大模型能力和Chain-of-Thought推理过程', '普通办公用户：日常写作、翻译、信息整理等办公需求'], useCases: ['大型代码库分析：将数千行的项目源码一次性提交，AI分析架构漏洞并给出优化', '学术文献综述：上传30+篇论文PDF，AI自动梳理研究脉络和关键发现', '小说/剧本分析：将完整的小说文本提交，AI分析人物关系、情节结构和主题', '技术方案设计：描述复杂的系统需求，AI输出详尽的技术设计文档', '数学和编程竞赛：利用R1的深度推理能力解决高难度算法和数学问题'], faqs: [{ question: 'DeepSeek完全免费是真的吗？不会有隐藏收费吗？', answer: '目前完全免费，官方明确表示没有隐藏收费。免费使用DeepSeek V3和R1模型，支持文件上传、联网搜索等全部功能。唯一的限制是高峰期可能需要排队等待。API调用是收费的，但价格极低（约为GPT-4的1/10）。对于99%的个人用户，直接使用Web端完全足够，无需付费。' }, { question: 'DeepSeek R1和V3有什么区别？怎么选择？', answer: 'V3是通用模型，适合日常对话、写作、代码生成等大多数场景，响应速度快。R1是推理模型，使用Chain-of-Thought逐步推理，适合数学解题、逻辑推理、复杂编程等需要深度思考的任务，但响应速度较慢。建议日常任务用V3，遇到复杂问题切换R1。两个模型在Web端均可免费使用。' }, { question: 'DeepSeek和ChatGPT/GPT-4差距有多大？', answer: '在2025年初的基准测试中，DeepSeek V3在多项指标上达到或超过GPT-4水平，R1在数学推理上甚至超越GPT-4。代码能力与Claude 3.5 Sonnet相当。主要差距在于：1)多模态能力缺失 2)英文语境的世界知识覆盖略少 3)API生态不如OpenAI成熟。但考虑到免费+中文友好+超长上下文，DeepSeek对国内用户来说是性价比最高的选择。' }, { question: '1M tokens上下文能做什么？', answer: '1M tokens约等于75万汉字，相当于三体三部曲的总字数或大英百科全书一卷。实际应用：可一次性分析整个大型项目的源代码、处理300+页的学术专著、分析长达一周的聊天记录或会议转录、或让AI基于整本参考书写报告。目前全球只有DeepSeek和通义千问支持1M级别的上下文。' }] }),
  { id: 'wenshen_yiyan', name: '文心一言', logo: '🐻', description: '百度开发的AI对话助手，支持多模态和中文优化', url: 'https://yiyan.baidu.com', price: 'free', difficulty: 'beginner', heat: 63.4, heatGrowth: 8.5, tags: ['AI对话', '中文AI', '多模态'], techTags: ['NLP', 'GenerativeAI', 'Multimodal'], sceneTags: ['办公提效', '内容创作', '学术研究', '企业AI自动化'], costTags: ['Free', '中文友好'], category: 'AI对话', prompts: [{ id: 'p1', title: '公文写作', content: '请根据以下要求，生成一份标准的公文：[公文类型]\n核心内容：[内容要点]', scene: '办公提效' }, { id: 'p2', title: '方案策划', content: '请为[项目名称]制定一份详细的实施方案，包含：背景分析、目标设定、执行步骤、风险预案', scene: '办公提效' }], tips: ['中文理解能力在国产模型中非常出色', '支持图片理解和生成', '可以与百度生态产品深度集成'], relatedSkills: ['skill_wechat_article'] },
  { id: 'tongyi', name: '通义千问', logo: '☁️', description: '阿里巴巴AI助手，支持长文本分析和多模态理解', url: 'https://tongyi.aliyun.com', price: 'free', difficulty: 'beginner', heat: 58.9, heatGrowth: 15.7, tags: ['AI对话', '中文AI', '办公工具'], techTags: ['NLP', 'GenerativeAI'], sceneTags: ['办公提效', '内容创作', '电商运营', '企业AI自动化'], costTags: ['Free', '中文友好'], category: 'AI对话', prompts: [{ id: 'p1', title: '电商文案优化', content: '请优化以下电商商品描述，提升转化率和搜索引擎排名：[原始描述]', scene: '电商运营' }, { id: 'p2', title: '文档翻译', content: '将以下内容翻译成[目标语言]，保持专业术语准确：[内容]', scene: '办公提效' }], tips: ['免费使用，无需翻墙', '支持PDF/Word/Excel/图片等多格式输入', '通义千问App可在手机上使用'], relatedSkills: ['skill_ecommerce_copy'] },
  { id: 'doubao', name: '豆包', logo: '🫘', description: '字节跳动AI对话助手，整合抖音生态内容创作能力', url: 'https://www.doubao.com', price: 'free', difficulty: 'beginner', heat: 56.2, heatGrowth: 38.9, tags: ['AI对话', '中文AI', '内容创作'], techTags: ['NLP', 'GenerativeAI'], sceneTags: ['内容创作', '短视频', '办公提效'], costTags: ['Free', '中文友好'], category: 'AI对话', prompts: [{ id: 'p1', title: '短视频标题生成', content: '请为以下短视频内容生成10个爆款标题，要求：吸引眼球、包含关键词、适合抖音风格：[视频描述]', scene: '短视频' }, { id: 'p2', title: 'AI绘画', content: '请根据以下描述生成图片：[描述]', scene: '内容创作' }], tips: ['整合抖音热门趋势和爆款内容', '支持语音交互', '可以生成AI图片和视频'], relatedSkills: ['skill_short_video_script'] },
  { id: 'muse', name: 'Muse AI', logo: '🎯', description: 'AI驱动的极简浏览器，将AI搜索和内容推荐融入浏览体验', url: 'https://muse.ai', price: 'free', difficulty: 'beginner', heat: 44.1, heatGrowth: 25.6, tags: ['AI搜索', '浏览器', '信息管理'], techTags: ['Search', 'RAG', 'Agent'], sceneTags: ['办公提效', '学术研究'], costTags: ['Free', '中文友好'], category: 'AI搜索', prompts: [], tips: ['AI自动总结搜索结果页面内容', '支持AI阅读模式和摘要', '个性化内容推荐引擎'], relatedSkills: [] },
  enhanceTool({ id: 'gemini', name: 'Gemini', logo: '♊', description: 'Google开发的多模态AI模型，支持文本、图像、视频、音频理解和生成', url: 'https://gemini.google.com', price: 'free', difficulty: 'beginner', heat: 70, heatGrowth: 25, tags: ['AI对话', '多模态', '谷歌AI'], techTags: ['NLP', 'GenerativeAI', 'Multimodal'], sceneTags: ['办公提效', '内容创作', '学术研究'], costTags: ['Free', '需翻墙'], category: 'AI对话', prompts: [{ id: 'p1', title: '图像分析与解读', content: '请分析这张图片的内容，包括：1.图片中的主要元素 2.色彩和构图特点 3.可能的情感和氛围 4.适用的使用场景', scene: '内容创作' }, { id: 'p2', title: '文档深度研究', content: '请分析以下文档，提取：1.核心论点 2.关键数据支撑 3.论证逻辑链 4.结论可靠性评估 5.补充建议', scene: '学术研究' }], tips: ['Gemini 支持2M超长上下文，可一次处理大量信息', '支持视频上传和分析，能理解视频内容', '与Google生态（Gmail、Docs等）深度集成', '支持多模态输入：文本、图片、音频、视频'], relatedSkills: [], xhsSaves: 980000 }),
  enhanceTool({ id: 'grok', name: 'Grok', logo: 'ℹ️', description: 'xAI推出的AI助手，集成X/Twitter实时数据，回答风格独特', url: 'https://grok.com', price: 'freemium', difficulty: 'beginner', heat: 62, heatGrowth: 35, tags: ['AI对话', '实时信息', 'X/Twitter'], techTags: ['NLP', 'GenerativeAI'], sceneTags: ['办公提效', '编程开发', '内容创作'], costTags: ['Freemium', '需翻墙'], category: 'AI对话', prompts: [{ id: 'p1', title: '实时新闻分析', content: '请分析以下热点新闻事件：1.事件背景和经过 2.各方观点 3.发展趋势预测 4.对相关领域的影响', scene: '内容创作' }, { id: 'p2', title: '数据趋势解读', content: '分析以下数据趋势，给出：1.关键洞察 2.异常点识别 3.可能的原因分析 4.未来走向预判\n数据：[数据内容]', scene: '办公提效' }], tips: ['深度集成X/Twitter平台，可获取最新实时信息', '回答风格相对自由，采用更少约束的对话方式', '支持实时数据分析和网络信息检索', 'Pro订阅用户可获得更多使用额度'], relatedSkills: [], xhsSaves: 720000 }),
  enhanceTool({ id: 'elevenlabs', name: 'ElevenLabs', logo: '🎙️', description: '领先的AI语音生成平台，支持情感语音合成、声音克隆和多语言TTS', url: 'https://elevenlabs.io', price: 'freemium', difficulty: 'beginner', heat: 58, heatGrowth: 30, tags: ['AI语音', '语音合成', '音频工具'], techTags: ['AudioAI', 'GenerativeMedia'], sceneTags: ['内容创作', '短视频'], costTags: ['Freemium', '需翻墙'], category: '音频生成', prompts: [{ id: 'p1', title: '视频旁白配音', content: 'Generate a professional voiceover for this script with [tone] tone:\n[Script text]\nRequirements: clear pronunciation, natural pauses, engaging delivery', scene: '内容创作' }, { id: 'p2', title: '多语言有声书', content: 'Convert this text to speech in [language] with [voice_style] style:\n[Text content]\n- Natural intonation\n- Appropriate pacing\n- Emotional expression matching the content', scene: '内容创作' }], tips: ['声音质量业界领先，支持丰富的情绪表达', '支持声音克隆功能，可以创建自己的声音模型', '提供丰富的预设声音库，覆盖多种语言和口音', '支持长文本生成，适合有声书、播客等场景'], relatedSkills: [], xhsSaves: 650000 }),
  enhanceTool({ id: 'comfyui', name: 'ComfyUI', logo: '🔌', description: '基于节点的Stable Diffusion工作流界面，实现精确的AI图像生成控制', url: 'https://github.com/comfyanonymous/ComfyUI', price: 'free', difficulty: 'advanced', heat: 55, heatGrowth: 28, tags: ['AI绘画', '工作流', '图像生成'], techTags: ['Diffusion', 'GenerativeMedia', 'OpenSource'], sceneTags: ['设计创作'], costTags: ['Free', '中文友好'], category: '图像生成', prompts: [{ id: 'p1', title: '精确控制图像生成', content: 'Design a ComfyUI workflow for generating [image_description] with:\n1. Positive prompt: [detailed prompt]\n2. Negative prompt: [undesired elements]\n3. ControlNet for pose/structure guidance\n4. Step-by-step node connections', scene: '设计创作' }, { id: 'p2', title: '批量图像处理', content: 'Create a ComfyUI batch processing workflow for:\n1. Input: [folder_path] containing source images\n2. Process: [upscale/inpainting/style_transfer]\n3. Output settings: [resolution, format]\n4. Queue management for batch execution', scene: '设计创作' }], tips: ['节点式工作流可实现高度自定义的图像生成流程', '支持ControlNet、LoRA、IP-Adapter等主流扩展', '社区贡献了大量高质量的现成工作流可复用', '本地部署完全免费，适合批量生产和精细控制'], relatedSkills: ['skill_batch_image'], xhsSaves: 580000 }),


  enhanceTool({ id: 'openclaw', name: 'OpenClaw', logo: '🐱', description: '开源个人AI助手，GitHub 36.5万星，集聊天、搜索、文件管理、代码执行于一体的全能AI平台', url: 'https://github.com/openclaw/openclaw', price: 'free', difficulty: 'intermediate', heat: 85, heatGrowth: 65, tags: ['AI助手', '开源', '个人AI'], techTags: ['Agent', 'GenerativeAI', 'OpenSource'], sceneTags: ['编程开发', '办公提效'], costTags: ['Free', '中文友好'], category: '编程开发', prompts: [{ id: 'p1', title: '个人AI助手搭建', content: '帮我用OpenClaw搭建一个个人AI助手，包含：1.基础聊天功能 2.文件管理 3.代码执行环境 4.搜索能力', scene: '编程开发' }, { id: 'p2', title: 'OpenClaw插件开发', content: '为OpenClaw开发一个[功能描述]插件，要求：1.遵循OpenClaw插件规范 2.提供配置项 3.包含使用示例', scene: '编程开发' }], tips: ['GitHub 36.5万星，社区活跃度极高', '支持插件系统可无限扩展功能', '本地部署完全免费，数据自主可控', '支持集成多种LLM后端', '可作为个人知识库和自动化助手'], relatedSkills: ['skill_agent_builder', 'skill_vibe_coding'], xhsSaves: 350000 }),

  enhanceTool({ id: 'mcp_server', name: 'MCP Server', logo: '🔌', description: 'Model Context Protocol (MCP) — 为AI应用构建专用服务器，连接外部工具和数据源的新标准协议', url: 'https://modelcontextprotocol.io', price: 'free', difficulty: 'intermediate', heat: 82, heatGrowth: 58, tags: ['AI协议', '开发工具', 'API'], techTags: ['Agent', 'API', 'Protocol'], sceneTags: ['编程开发', '企业AI自动化'], costTags: ['Free', '中文友好'], category: '编程开发', prompts: [{ id: 'p1', title: '搭建MCP Server', content: '请帮助我为一个[你的App/服务]搭建MCP Server，包含：1.定义资源和工具 2.实现MCP协议接口 3.连接认证 4.部署文档', scene: '编程开发' }, { id: 'p2', title: 'MCP客户端接入', content: '请编写代码接入MCP Server的[服务名称]，使用TypeScript/Python，包含：1.客户端初始化 2.工具调用 3.错误处理 4.示例代码', scene: '编程开发' }], tips: ['MCP是AI应用连接外部工具和数据的新标准', '为你的App构建MCP Server已成为新潮流', 'Anthropic提出的Managed Agents架构与MCP天然互补', '支持多种编程语言（Python/TypeScript/Go等）', '让你的AI工具和App之间实现标准化通信'], relatedSkills: ['skill_agent_builder', 'skill_api_doc'], xhsSaves: 280000 }),
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
];

export const scenes: Scene[] = [
  // Primary scenes — names match tool.sceneTags for direct lookup
  { id: 'scene_office', name: '办公提效', icon: '📊', description: '办公提效的AI应用场景，涵盖文档处理、会议纪要、周报月报、邮件撰写、简历优化等日常办公环节', coverImage: '📊', toolCount: 26, skillCount: 10, xhsSaves: 128000, tags: ['办公提效', '自动化', '生产力'], solutions: [
    { id: 's1', type: 'auto', title: 'AI智能办公助手', description: '用AI自动生成周报月报、会议纪要、商务邮件，大幅提升办公效率', tools: ['ChatGPT', 'Kimi', 'Notion AI', '通义千问', 'DeepSeek'], skills: ['skill_weekly_report', 'skill_meeting_summary', 'skill_email_write', 'skill_resume_optimize'], effect: '办公效率提升200%，每日节省2小时', difficulty: 'beginner' },
    { id: 's2', type: 'semi', title: 'PPT/AI幻灯片制作', description: '一句话生成专业PPT，支持学术答辩、商业计划等场景', tools: ['Gamma', 'ChatGPT', 'Kimi'], skills: ['skill_auto_ppt', 'skill_pitch_deck'], effect: 'PPT制作时间从4小时缩短至10分钟', difficulty: 'beginner' },
    { id: 's3', type: 'auto', title: '企业内部知识库AI化', description: '将企业内部文档、流程、规范转化为AI可检索的知识库', tools: ['Kimi', 'Notion AI', '通义千问'], skills: ['skill_meeting_summary'], effect: '员工知识检索效率提升200%', difficulty: 'intermediate' }
  ] },
  { id: 'scene_content', name: '内容创作', icon: '✍️', description: '内容创作的AI应用场景，包括文章写作、社交媒体文案、公众号文章、小红书笔记等', coverImage: '✍️', toolCount: 28, skillCount: 12, xhsSaves: 176000, tags: ['内容创作', '写作', '文案'], solutions: [
    { id: 's1', type: 'auto', title: 'AI文章与文案生成', description: '根据主题自动生成高质量文章、公众号推文、小红书笔记', tools: ['ChatGPT', 'Claude', 'Kimi', '文心一言'], skills: ['skill_xhs_rewrite', 'skill_wechat_article', 'skill_weibo_content'], effect: '写作效率提升300%，每日可产出20+篇内容', difficulty: 'beginner' },
    { id: 's2', type: 'semi', title: '多平台内容矩阵', description: '一篇文章自动适配公众号/小红书/微博/抖音等不同平台', tools: ['ChatGPT', 'Claude', '豆包'], skills: ['skill_xhs_rewrite', 'skill_wechat_article', 'skill_weibo_content'], effect: '内容分发效率提升500%', difficulty: 'intermediate' }
  ] },
  { id: 'scene_programming', name: '编程开发', icon: '💻', description: '编程开发的AI应用场景，包括代码生成、代码审查、单元测试、API文档、数据库设计等', coverImage: '💻', toolCount: 24, skillCount: 10, xhsSaves: 128000, tags: ['编程开发', '代码', '开发工具'], solutions: [
    { id: 's1', type: 'auto', title: 'AI编程辅助', description: '用AI进行代码生成、补全、重构和审查，提升开发效率', tools: ['Cursor', 'GitHub Copilot', 'Claude', 'ChatGPT', 'Devin'], skills: ['skill_code_review', 'skill_vibe_coding', 'skill_unit_test', 'skill_api_doc'], effect: '开发效率提升300%，Bug率降低60%', difficulty: 'beginner' },
    { id: 's2', type: 'auto', title: 'AI全栈开发工作流', description: '从需求描述到部署的全流程AI辅助开发', tools: ['Cursor', 'Devin', 'Claude', 'ChatGPT', 'DeepSeek'], skills: ['skill_vibe_coding', 'skill_glue_coding', 'skill_database_schema'], effect: 'MVP开发周期从3周缩短至3天', difficulty: 'advanced' }
  ] },
  { id: 'scene_design', name: '设计创作', icon: '🎨', description: '设计创作的AI应用场景，涵盖AI绘画、图像生成、Logo设计、产品图、插画等创意领域', coverImage: '🎨', toolCount: 22, skillCount: 8, xhsSaves: 94000, tags: ['设计创作', 'AI绘画', '创意设计'], solutions: [
    { id: 's1', type: 'auto', title: 'AI图像生成工作流', description: '用AI生成高质量图片，涵盖人物、场景、产品、插画等', tools: ['Midjourney', 'DALL·E 3', 'Stable Diffusion', 'Leonardo AI'], skills: ['skill_product_image', 'skill_avatar_design', 'skill_logo_design'], effect: '设计效率提升500%，单张成本降低90%', difficulty: 'beginner' },
    { id: 's2', type: 'semi', title: '品牌视觉设计', description: '用AI完成Logo、VI、包装等品牌视觉设计', tools: ['Midjourney', 'DALL·E 3', 'Stable Diffusion'], skills: ['skill_logo_design', 'skill_avatar_design'], effect: '品牌设计周期从2周缩短至2天', difficulty: 'intermediate' }
  ] },
  { id: 'scene_research', name: '学术研究', icon: '📚', description: '学术研究的AI应用场景，包括论文润色、文献综述、论文摘要改写、知识总结等', coverImage: '📚', toolCount: 18, skillCount: 7, xhsSaves: 62000, tags: ['学术研究', '论文', '教育'], solutions: [
    { id: 's1', type: 'auto', title: 'AI学术研究助手', description: '用AI进行论文润色、文献综述、摘要改写、长文档分析', tools: ['ChatGPT', 'Claude', 'Kimi', 'Perplexity', 'DeepSeek'], skills: ['skill_paper_polish', 'skill_literature_review', 'skill_thesis_abstract'], effect: '论文写作效率提升200%，质量显著提升', difficulty: 'intermediate' },
    { id: 's2', type: 'auto', title: 'AI深度研究分析', description: '用AI进行文献调研、数据分析和论文核心提炼', tools: ['Perplexity', 'Kimi', 'ChatGPT'], skills: ['skill_knowledge_summary', 'skill_data_analysis'], effect: '文献调研时间缩短80%', difficulty: 'intermediate' }
  ] },
  { id: 'scene_shortvideo', name: '短视频', icon: '🎬', description: '短视频创作的AI应用场景，包括脚本创作、视频生成、数字人播报、背景音乐等', coverImage: '🎬', toolCount: 14, skillCount: 7, xhsSaves: 203000, tags: ['短视频', '视频创作', '社交媒体'], solutions: [
    { id: 's1', type: 'auto', title: 'AI短视频批量生产', description: '用AI生成脚本、数字人播报、添加音乐，批量制作短视频', tools: ['Runway', 'HeyGen', 'Suno', '豆包'], skills: ['skill_short_video_script', 'skill_video_subtitle'], effect: '短视频制作效率提升10倍', difficulty: 'beginner' },
    { id: 's2', type: 'semi', title: '爆款短视频流水线', description: '从选题策划到后期制作的全流程AI辅助', tools: ['Runway', 'HeyGen', 'Suno', '豆包', 'ChatGPT'], skills: ['skill_short_video_script', 'skill_podcast_script'], effect: '完播率提升40%，涨粉速度翻倍', difficulty: 'intermediate' }
  ] },
  { id: 'scene_ecommerce', name: '电商运营', icon: '🛒', description: '电商运营的AI应用场景，包括商品描述、产品场景图、客服话术、活动策划等', coverImage: '🛒', toolCount: 18, skillCount: 8, xhsSaves: 156000, tags: ['电商运营', '营销', '运营'], solutions: [
    { id: 's1', type: 'auto', title: '商品卖点提炼', description: '自动分析商品特点，提炼核心卖点', tools: ['ChatGPT', 'Claude'], skills: ['skill_ecommerce_copy'], effect: '快速生成吸引人的商品描述', difficulty: 'beginner' },
    { id: 's2', type: 'auto', title: 'AI电商全链路', description: '从商品图生成到文案撰写到客服话术的完整AI流程', tools: ['Midjourney', 'DALL·E 3', '通义千问', 'ChatGPT', 'HeyGen'], skills: ['skill_product_image', 'skill_ecommerce_copy', 'skill_customer_service'], effect: '转化率提升35%，运营成本降低50%', difficulty: 'intermediate' }
  ] },
  // Niche scenes — tool sceneTags that didn't fit primary categories
  { id: 'scene_game', name: '游戏开发', icon: '🎮', description: '游戏开发的AI应用场景，包括角色设计、概念图、3D模型、游戏资产创建等', coverImage: '🎮', toolCount: 3, skillCount: 2, xhsSaves: 42000, tags: ['游戏开发', '设计创作', '3D'], solutions: [
    { id: 's1', type: 'auto', title: 'AI游戏资产生成', description: '用AI快速生成游戏角色、场景、道具等视觉资产', tools: ['Leonardo AI', 'Midjourney', 'Stable Diffusion', 'Luma AI'], skills: ['skill_avatar_design', 'skill_product_image'], effect: '游戏开发周期缩短40%，美术成本降低60%', difficulty: 'intermediate' },
  ] },
  { id: 'scene_video_production', name: '影视制作', icon: '🎥', description: '影视制作的AI应用场景，包括视频生成、特效制作、后期编辑、动态设计等', coverImage: '🎥', toolCount: 2, skillCount: 2, xhsSaves: 56000, tags: ['影视制作', '视频制作', '特效'], solutions: [
    { id: 's1', type: 'auto', title: 'AI影视内容创作', description: '用AI生成影视级视频内容和特效', tools: ['Runway', 'HeyGen', 'Luma AI'], skills: ['skill_short_video_script', 'skill_video_subtitle'], effect: '视频制作效率提升5倍，专业品质无需专业团队', difficulty: 'advanced' },
  ] },
  { id: 'scene_music', name: '音乐制作', icon: '🎵', description: 'AI音乐制作的创作场景，包括AI作曲、歌曲生成、背景音乐、AI翻唱等', coverImage: '🎵', toolCount: 1, skillCount: 1, xhsSaves: 34000, tags: ['音乐制作', '音频', '创作'], solutions: [
    { id: 's1', type: 'auto', title: 'AI音乐创作工坊', description: '用AI生成完整歌曲、背景音乐、配乐', tools: ['Suno', 'ElevenLabs'], skills: ['skill_podcast_script'], effect: '音乐创作门槛降至零，3分钟内生成专业级作品', difficulty: 'beginner' },
  ] },
  { id: 'scene_business_plan', name: '商业计划书', icon: '📋', description: 'AI辅助商业计划书和PPT制作场景，包括融资BP、商业方案、路演材料等', coverImage: '📋', toolCount: 1, skillCount: 3, xhsSaves: 38000, tags: ['商业计划书', '创业', '融资'], solutions: [
    { id: 's1', type: 'auto', title: 'AI商业方案生成', description: '用AI快速生成商业计划书、融资BP和路演PPT', tools: ['Gamma', 'ChatGPT', 'Claude'], skills: ['skill_pitch_deck', 'skill_bd_proposal', 'skill_auto_ppt'], effect: '商业计划书制作时间从1周缩短至1天', difficulty: 'intermediate' },
  ] },
  { id: 'scene_course_outline', name: '课程大纲', icon: '📖', description: 'AI辅助教育课程设计场景，包括课程大纲生成、课件制作、培训材料编写等', coverImage: '📖', toolCount: 1, skillCount: 3, xhsSaves: 29000, tags: ['课程大纲', '教育', '培训'], solutions: [
    { id: 's1', type: 'auto', title: 'AI课程设计助手', description: '用AI生成课程大纲、培训课件和教学材料', tools: ['Gamma', 'ChatGPT', 'Kimi'], skills: ['skill_exam_prep', 'skill_knowledge_summary', 'skill_child_education'], effect: '课程设计效率提升300%，内容质量专业级', difficulty: 'intermediate' },
  ] },
  // Legacy scenes kept for backwards compatibility
  { id: 'scene_enterprise_ai', name: '企业AI自动化', icon: '🏢', description: '企业级AI应用场景，涵盖智能客服、流程自动化、数据分析、知识管理等核心业务环节', coverImage: '🏢', toolCount: 10, skillCount: 6, xhsSaves: 45000, tags: ['企业AI', '自动化', '办公提效', '数据分析'], solutions: [
    { id: 's1', type: 'auto', title: '智能客服系统搭建', description: '用AI搭建7x24小时智能客服，处理常见问题、工单分配、客户意向识别', tools: ['ChatGPT', 'OpenAI Agents SDK'], skills: ['skill_weekly_report', 'skill_meeting_summary'], effect: '客服响应速度提升300%，人工成本降低60%', difficulty: 'advanced' },
    { id: 's2', type: 'semi', title: '企业内部知识库AI化', description: '将企业内部文档、流程、规范转化为AI可检索的知识库', tools: ['Kimi', 'Notion AI', '通义千问'], skills: ['skill_meeting_summary'], effect: '员工知识检索效率提升200%，新员工培训周期缩短50%', difficulty: 'intermediate' },
    { id: 's3', type: 'auto', title: '财务与人事报表自动化', description: '用AI自动生成财务分析、人事报表、销售预测等企业管理报表', tools: ['ChatGPT', 'Claude', 'DeepSeek'], skills: ['skill_weekly_report', 'skill_email_write'], effect: '报表制作时间从2小时缩短至10分钟', difficulty: 'intermediate' }
  ] },
  // ===== 新增：AI Agent场景（今日热点） =====
  { id: 'scene_ai_agent', name: 'AI Agent', icon: '🤖', description: 'AI Agent架构与开发场景，涵盖Managed Agents范式、MCP生态、三文件框架、TDD驱动工作流等最新趋势', coverImage: '🤖', toolCount: 6, skillCount: 6, xhsSaves: 52000, tags: ['AI Agent', 'MCP', 'Agent架构', '自动化'], solutions: [
    { id: 's1', type: 'auto', title: 'Managed Agents架构', description: '按照Anthropic提出的大脑与手解耦范式，构建可扩展的Agent系统', tools: ['Claude', 'GPT-4', 'MCP Server'], skills: ['skill_managed_agents', 'skill_mcp_server_build'], effect: 'Agent系统架构清晰可扩展，大脑与手解耦独立演进', difficulty: 'advanced' },
    { id: 's2', type: 'auto', title: '三文件Agent搭建', description: '使用SOUL.md+RULES.md+MEMORY.md三文件极简框架配置Coding Agent', tools: ['Claude Code', 'Cursor'], skills: ['skill_three_file_framework', 'skill_vibe_coding'], effect: '5分钟完成Agent个性配置，开发效率翻倍', difficulty: 'beginner' },
    { id: 's3', type: 'auto', title: 'MCP生态接入', description: '为你的应用构建MCP Server，接入AI Agent生态', tools: ['MCP Server', 'Claude', 'Python'], skills: ['skill_mcp_server_build', 'skill_api_doc'], effect: '让你的App被AI Agent直接调用', difficulty: 'intermediate' }
  ] },
];

export const dailyPicks: DailyPick[] = [
  { id: 'dp1', sceneId: 'scene_ai_agent', sceneName: 'AI Agent', coverImage: '🤖', description: 'Agent架构爆发，大脑与手解耦新时代', toolCount: 6, skillCount: 6, xhsSaves: 52000, date: '2026-04-27' },
  { id: 'dp2', sceneId: 'scene_office', sceneName: '办公提效', coverImage: '📊', description: 'AI驱动办公效率革命', toolCount: 26, skillCount: 10, xhsSaves: 128000, date: '2026-04-04' },
  { id: 'dp3', sceneId: 'scene_ecommerce', sceneName: '电商运营', coverImage: '🛒', description: '一键生成商品详情', toolCount: 18, skillCount: 8, xhsSaves: 156000, date: '2026-04-03' },
  { id: 'dp4', sceneId: 'scene_research', sceneName: '学术研究', coverImage: '📚', description: 'AI助你高效学术研究', toolCount: 18, skillCount: 7, xhsSaves: 62000, date: '2026-04-23' },
  { id: 'dp5', sceneId: 'scene_programming', sceneName: '编程开发', coverImage: '💻', description: 'AI赋能高效编程', toolCount: 24, skillCount: 10, xhsSaves: 128000, date: '2026-04-22' },
  { id: 'dp6', sceneId: 'scene_shortvideo', sceneName: '短视频', coverImage: '🎬', description: 'AI一键生成爆款短视频', toolCount: 14, skillCount: 7, xhsSaves: 203000, date: '2026-04-21' },
  { id: 'dp7', sceneId: 'scene_design', sceneName: '设计创作', coverImage: '🎨', description: 'AI创意设计助手', toolCount: 22, skillCount: 8, xhsSaves: 94000, date: '2026-04-20' },
  { id: 'dp8', sceneId: 'scene_content', sceneName: '内容创作', coverImage: '✍️', description: 'AI写作效率翻倍', toolCount: 28, skillCount: 12, xhsSaves: 176000, date: '2026-04-19' },
  { id: 'dp9', sceneId: 'scene_enterprise_ai', sceneName: '企业AI自动化', coverImage: '🏢', description: 'AI驱动企业智能化转型', toolCount: 10, skillCount: 6, xhsSaves: 45000, date: '2026-04-24' },
];