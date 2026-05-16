// Report metadata index — auto-generated, append new entries when adding reports
// Each entry: { date: string, title: string, summary: string, highlights: string[] }

import type { DailyReportMeta } from '@/types';

const reports: DailyReportMeta[] = [
  {
    date: "2026-05-16",
    title: "AI 日报 | 2026-05-16 周六",
    summary: "周六数据偏少但质量高。Anthropic三连发持续发酵：Auto Mode让Agent安全跳过权限、Managed Agents脑手解耦架构、Claude Code质量复盘。Mitchell Hashimoto「AI精神病」帖引爆HN(805分)。arXiv两篇：条件视频解码增强视觉生成、张量相似度推进机制可解释性从定性到定量。Google AI Finance扩展欧洲、AI创意广告项目The Small Brief。",
    highlights: [
      "Mitchell Hashimoto：I believe there are entire companies right now under AI psychosis — HN 805分现象级讨论",
      "Anthropic三连发：Claude Code Auto Mode安全跳权限 + Managed Agents脑手解耦 + 质量复盘",
      "arXiv: Tensor Similarity for Mechanistic Interpretability — 用张量相似度判定两个网络组件是否等价",
      "The MAD Podcast：为什么每个AI Agent需要自己的隔离执行环境",
    ]
  },
  {
    date: "2026-05-15",
    title: "AI 日报 | 2026-05-15 周五",
    summary: "arXiv上新6篇论文：WARDEN以6小时数据实现濒危语言翻译、EVA-Bench端到端语音Agent评估、Hodge分解保拓扑学习、Good Agentic Friends提出权重更新式多Agent协作。Anthropic连续发布三篇工程博客持续发酵。Claude Managed Agents发布Dreaming记忆回顾功能。HN热议AI使人变笨+大学AI僵尸化现象。Google AI Finance扩展欧洲。",
    highlights: [
      "WARDEN：仅6小时训练数据实现濒危语言Wardaman的转录与英文翻译",
      "EVA-Bench：首个端到端语音Agent评估框架，联合评测企业级语音对话能力",
      "Good Agentic Friends：多Agent协作不应只交换文本，更应直接更新对方权重",
      "Anthropic三连发：Managed Agents脑手解耦 + Claude Code质量复盘 + Auto Mode安全机制",
      "Claude Managed Agents Dreaming：Agent跨会话记忆回顾与模式发现功能",
      "HN热议：AI正在让我变笨(319pts) + 大学AI僵尸化现象(146pts)",
    ]
  },
  {
    date: "2026-05-14",
    title: "AI 日报 | 2026-05-14 周四",
    summary: "Agent记忆评测成为研究热点，LongMemEval-V2和MEME两篇论文为Agent记忆能力设定了新标准——超出简单事实存储，要求经验记忆和工作流记忆。Anthropic三连持续发酵，Brain-Hand解耦从实践走向行业共识。arXiv论文聚焦GRPO多模态扩展和模型后训练优化。Google AI Finance扩展欧洲，AI+金融数据本地化复制加速。",
    highlights: [
      "Agent记忆评测新标准：LongMemEval-V2 + MEME定义经验记忆新范式",
      "AlphaGRPO将GRPO引入多模态生成，分解式可验证奖励机制",
      "Learning Fast and Slow: LLM持续适应框架，受Kahneman双系统理论启发",
      "Anthropic三连持续发酵：Brain-Hand解耦成为行业共识",
      "Google AI Finance扩展欧洲，AI+金融数据区域复制加速",
      "Waymo 2000万次自动驾驶行程的规模化验证故事",
    ]
  },
  {
    date: "2026-05-13",
    title: "AI 日报 | 2026-05-13 周三",
    summary: "Anthropic连发三篇工程博客，正式提出Managed Agents的Brain-Hand双层解耦架构。同时发布Claude Code质量复盘和auto mode。Google AI Finance扩展欧洲。安静的工作日，适合精读架构文章。",
    highlights: [
      "Anthropic提出Managed Agents Brain-Hand双层解耦架构",
      "Claude Code April 23 质量问题全面复盘",
      "Claude Code auto mode 更安全的免权限模式",
      "Google AI Finance 扩展欧洲",
    ]
  },
  {
    date: "2026-05-11",
    title: "AI 日报 | 2026-05-11 周一",
    summary: "Sam Altman描述GPT 5.5为「自闭症天才，命名品味极其怪异」(6188❤️)，GPT 5.5代号暗示下一代模型方向。Claude两大新能力发布：日常应用Connectors扩展+Managed Agents内置记忆公测，Agent从工具进化到同事。Garry Tan GBrain v0.31.1发布MCP瘦客户端模式，一个家庭GBrain服务器服务所有Agent。Peter Yang警告AI生成文件必有10% slop问题引爆社区讨论(229❤️)。HN热议：本地AI应为常态(253pts)+任务瘫痪与AI的关系(162pts)。GitHub新项目everything-claude-code达17.8万星领跑。",
    highlights: [
      "Sam Altman：GPT 5.5是「自闭症天才」，命名品味极其怪异(6188❤️)",
      "Claude发布日常Connectors扩展+Managed Agents内置记忆公测",
      "Garry Tan：GBrain v0.31.1 MCP瘦客户端，一个服务器服务所有Agent(256❤️)",
      "Peter Yang：Agent生成文件永远有10% slop(229❤️)，所有人懒得手动改",
      "Peter Steinberger：教Codex在PR审查时检测社交信号(76❤️)+Crabbox Windows终端支持(102❤️)",
      "Aaron Levie：Agent让复杂领域入口大幅降低，更多人会涌入尝试(321❤️)",
      "Zara Zhang引用Duolingo创始人: People don't read, HTML至上(104❤️)",
      "Swyx：新加坡外交部长是NanoClaw超级粉丝(47❤️)",
      "HN热议：Local AI应成为常态(253pts)，任务瘫痪与AI的思辨(162pts)",
      "GitHub: everything-claude-code达178,040星，3DCellForge获615星"
    ]
  },
  {
    date: "2026-05-09",
    title: "AI 日报 | 2026-05-09 周六",
    summary: "Claude for Office正式GA发布，覆盖Excel/PowerPoint/Word+Outlook公测，获30256互动引爆企业AI办公赛道。Alex Albert披露Firefox团队在Claude Mythos Preview辅助下单月修复安全漏洞超过去15个月总和(11614❤️)。Sam Altman两连发：帮助开发者进化成超级英雄(3046❤️)+OpenAI将帮助企业安全建设(1439❤️)。arXiv新论文聚焦MoE架构创新(UniPool/EMO)和训练自由推理(BAMI/GUI Grounding)。Stability AI发布SD-XL 1.0宽松许可版本。",
    highlights: [
      "Claude for Office GA发布：Excel/PowerPoint/Word全面可用+Outlook公测(30256❤️)",
      "Alex Albert：Firefox在Claude辅助下单月修复漏洞超过去15个月总和(11614❤️)",
      "Sam Altman：帮助开发者进化成超级英雄比替代他们更酷(3046❤️)",
      "Sam Altman：OpenAI将帮助企业快速进行安全建设(1439❤️)",
      "steipete：/goal+GPT 5.5可完成带e2e测试的深度重构(1957❤️)",
      "Madhu Guru离任Google：从零构建Gemini业务的三年历程(1104❤️)",
      "UniPool：跨层共享专家池打破MoE逐层分配惯例",
      "EMO：MoE预训练实现涌现模块化，按需激活子能力",
      "BAMI：无需训练的GUI Grounding偏见缓解方法",
      "Stability AI发布SD-XL 1.0宽松许可版本"
    ]
  },
  {
    date: "2026-04-29",
    title: "AI 日报 | 2026-04-29 周三",
    summary: "Anthropic发布Claude Code质量复盘报告与Managed Agents架构升级，连接Adobe Creative Cloud等创意工具生态。递归多Agent系统论文定义Agent第三条scaling axis。Claude Design开源复刻open-design获2852星。",
    highlights: [
      "Anthropic发布Claude Code 4月23日质量报告复盘，透明度获认可",
      "Anthropic Managed Agents：Agent大脑与手解耦架构深度解析",
      "Claude Connector扩展：Adobe Creative Cloud/Ableton/Blender等创意工具全链条",
      "Recursive Multi-Agent Systems论文：递归推理成为Agent第三条scaling axis",
      "open-design（Claude Design开源复刻）一夜获2852星"
    ]
  },
  {
    date: "2026-04-28",
    title: "AI 日报 | 2026-04-28 周二",
    summary: "微软与OpenAI终止独家分成协议，AI格局进入后独家时代。Anthropic提出Managed Agents架构，Agent大脑与手解耦成为最佳实践。OpenClaw以36.5万星成为GitHub现象级项目。",
    highlights: [
      "微软 × OpenAI 分手：AI格局进入'后独家时代'",
      "Managed Agents：大脑与手解耦 — Anthropic提出Agent架构新范式",
      "OpenClaw现象：个人AI助手的爆发拐点，36.5万星",
      "Sam Altman：Codex $20计划性价比极高，获7712爱心"
    ]
  },
  {
    date: "2026-04-30",
    title: "AI 日报 | 2026-04-30 周四",
    summary: "Claude Connectors拓展至Autodesk Fusion等创意工具生态，2026被定义为Agent之年。TIDE论文提出跨架构蒸馏方法用于Diffusion LLM。ClawGym框架为Claw Agent构建提供可扩展基准。",
    highlights: [
      "Claude发布Autodesk Fusion等新Connector，连接器生态全面覆盖3D/设计/音频领域",
      "TIDE: 跨架构蒸馏方法使Diffusion LLM无需相同架构即可知识迁移",
      "ClawGym: 可扩展Claw Agent构建框架发布",
      "Garry Tan定义2026年为Agent永恒九月——Agent生态系统加速涌现",
      "Vercel Labs转型构建Agent用开发者工具"
    ]
  },
  {
    date: "2026-05-01",
    title: "AI 日报 | 2026-05-01 周五",
    summary: "Sam Altman发布Codex重大升级——支持非编码计算机操作；Anthropic发布Claude Security公开测试版、Claude Code桌面端多Agent并行处理重新设计；Exploration Hacking论文揭示LLM可学会对抗RL训练；Aaron Levie预言Agent将成为软件最大的用户群，所有软件需要提供Headless API。",
    highlights: [
      "Sam Altman发布Codex重大升级：支持非编码计算机操作，推文获7768爱心",
      "Anthropic连发三篇博客：Claude Code质量报告、Managed Agents架构拆解、Auto Mode安全机制",
      "Exploration Hacking论文：LLM可以学会对抗RL训练——表面表现良好但实际通过操控探索过程避免真正学习",
      "Claude Security公开测试版发布，内置集成Claude Code网页版",
      "Aaron Levie：Agent将成为软件最大的用户群，所有软件需以Headless方式提供API",
      "OpenClaw突破366,962星，持续领跑GitHub Trending",
      "Garby Tan推荐OpenClaw/Hermes用户安装GBrain知识库工具",
      "Google与Kaggle联合推出AI Agents Vibe Coding课程，6月开课"
    ]
  },
  {
    date: "2026-05-02",
    title: "AI 日报 | 2026-05-02 周六",
    summary: "Anthropic连发三篇技术博客——Claude Code质量报告、Managed Agents拆解与Auto Mode；Equilibrium论文超越传统纳什均衡框架；Aaron Levie预言Agent倍增下软件架构的演化方向；OpenClaw突破367,360星继续领跑GitHub Trending。",
    highlights: [
      "Anthropic连发三篇技术博客：Claude Code质量报告、Scaled Managed Agents架构拆解、Auto Mode安全机制",
      "Computing Equilibrium论文提出超越单方面偏离的均衡计算框架",
      "Synthetic Computers论文提出大规模合成计算机环境模拟长周期生产力任务",
      "Exploration Hacking揭示LLM可以学会对抗RL训练",
      "Replit庆祝10周年，24小时完全免费",
      "Aaron Levie谈Atlassian财报超预期，预言Agent数量超过人类时软件架构的演化",
      "OpenClaw突破367,360星，持续领跑GitHub Trending"
    ]
  },
  {
    date: "2026-05-03",
    title: "AI 日报 | 2026-05-03 周日",
    summary: "Claude开发者大会下周回归；Anthropic连发三篇工程博客——Claude Code质量报告、Managed Agents架构拆解与Auto Mode安全机制；Open Design项目在Hacker News获151分——用编码Agent做设计引擎；OpenClaw达367,554星继续领跑GitHub Trending；mattpocock/dictionary-of-ai-coding单日增长130星。",
    highlights: [
      "Claude Code开发者大会下周回归，Claude官方推文获7562互动的超高关注",
      "Anthropic连发三篇工程博客：Claude Code质量报告复盘、Managed Agents大脑-手解耦架构、Auto Mode安全机制",
      "Open Design (nexu-io/open-design) 在HN获151分——用编码Agent作为设计引擎",
      "Refusal in Language Models论文（arXiv:2406.11717）揭示拒绝机制由单一方向介导，再登HN热门",
      "OpenClaw突破367,554星，日均+194星持续领跑GitHub Trending",
      "mattpocock/dictionary-of-ai-coding单日+130星，AI开发者教育需求旺盛",
      "Replit十周年：24小时完全免费庆祝",
      "Sam Altman暗示未来发布将举办更大派对，/hatch clippy获1115爱心",
      "Google与Kaggle联合推出AI Agents Vibe Coding课程（6月）"
    ]
  },
  {
    date: "2026-05-04",
    title: "AI 日报 | 2026-05-04 周一",
    summary: "Sam Altman一句'更智能仍是首要目标'引爆社区（9505❤️），掀起了'更廉价vs更智能'的模型发展方向辩论。Anthropic三篇工程博客持续发酵三天。OpenAI o1在哈佛急诊分诊试验中以67%正确率超越医生（55%），获175 HN高分。OpenClaw增速加速至+343星/日，达367,897星；n8n同样加速至+102星/日。Aaron Levie用实验室自动化类比论述AI不会取代工程师。Garry Tan实测OpenClaw+GBrain打造无限个人Blinkist。",
    highlights: [
      "Sam Altman：更智能比更廉价更重要，推文获9505爱心引爆行业讨论",
      "OpenAI o1哈佛急诊试验：67%正确率超越医生50-55%，AI+医疗里程碑",
      "OpenClaw达367,897星，日增速加速至+343星/日",
      "n8n增长加速至+102星/日，企业AI自动化需求持续旺盛",
      "Aaron Levie：AI不会取代工程师，而是放大工程师能力",
      "Greg Brockman播客：人类注意力成为AI时代的核心瓶颈",
      "Garry Tan实测OpenClaw+GBrain做无限个人Blinkist",
      "Anthropic三篇工程博客持续发酵——Managed Agents/Auto Mode/质量报告",
      "Claude开发者大会下周回归（连续三天传言，预期有重大发布）",
      "Google与Kaggle联合推出AI Agents Vibe Coding课程（6月）"
    ]
  },
  {
    date: "2026-05-06",
    title: "AI 日报 | 2026-05-06 周三",
    summary: "Google Chrome静默安装4GB AI模型引爆隐私争议（1159 HN分）。arXiv全新2605系列上线：SpecKV推测解码加速、RL多Agent编排轨迹训练。Sam Altman对语音模型表示兴奋（4451❤️）。Vercel CEO推出deepsec开源安全审查Agent。OpenClaw达368,630星，单日+733星加速。",
    highlights: [
      "Google Chrome被曝静默安装4GB AI模型，获1159 HN分引发隐私担忧",
      "arXiv全新2605系列论文上线：SpecKV/AI Agent编排轨迹/FlexSQL",
      "Sam Altman：对语音模型改善感到兴奋，人机交互方式正在改变（4451❤️）",
      "Vercel CEO推出deepsec开源Agent编排器用于深度安全审计（1229❤️）",
      "Aaron Levie：Anthropic和OpenAI推动企业Agent部署（836❤️）",
      "Garry Tan：gbrain是记忆+代码+搜索三位一体（308❤️）",
      "Peter Steinberger：Crabbox 0.5.0支持VNC/WebVNC远程环境",
      "OpenClaw达368,630星，单日+733星加速（较昨日翻倍）",
      "Gemini API新增Webhooks支持事件驱动异步任务通知",
      "AI三反定律HN获328分：看起来简单的对AI却最难"
    ]
  },
  {
    date: "2026-05-07",
    title: "AI 日报 | 2026-05-07 周四",
    summary: "临床LLM安全性与准确性遵循不同扩展定律，打破'更强=更安全'直觉。Anthropic与SpaceX达成算力交易获292 HN分。OpenSeeker-v2用高难度轨迹训练搜索Agent。AI红队自动化从数周缩短到数小时。Simon Willison警告Vibe Coding与Agent Engineering趋同（252 HN分）。Tilde.run事务性文件系统Agent沙箱发布。cheat-on-content以754星领跑GitHub新项目。",
    highlights: [
      "临床LLM安全性与准确性遵循不同扩展定律，打破'更强=更安全'假设",
      "OpenSeeker-v2用高信息量高难度轨迹推动开源搜索Agent能力边界",
      "AI红队自动化：从数周缩短到数小时，Agent安全评估进入快车道",
      "Anthropic+SpaceX算力合作获292 HN分，跨界算力共享新时代",
      "Simon Willison：Vibe Coding与Agent Engineering正在趋同（252 HN分）",
      "Tilde.run事务性版本化文件系统Agent沙箱发布（102 HN分）",
      "cheat-on-content以754星领跑：AI驱动内容策略自动化工具",
      "beautiful-html-templates 267星：专为编码Agent设计的HTML模板库",
      "yao-open-prompts 255星：中文AI提示词开源知识库",
      "HeadsUp高效编解码实现大规模多视图3D高斯头部重建"
    ]
  },
  {
    date: "2026-05-08",
    title: "AI 日报 | 2026-05-08 周五",
    summary: "Dario Amodei披露80x营收增长并全力抢算力(1319❤️)，Claude发布Outcomes质量门控+Dreaming记忆学习两大Agent新能力。Boris Cherny自曝夜间跑数千Agent、几乎只用Claude Code。Grok数学发现登上arXiv——AI辅助数学研究成新范式。Mirage统一AI Agent虚拟文件系统获945星。「The First Token Knows」论文发现单Token置信度即可检测幻觉，大幅降低计算成本。",
    highlights: [
      "Dario Amodei披露80x营收增长，全力抢算力「能抢多少抢多少」(1319❤️)",
      "Claude发布Outcomes+Dreaming：Agent质量门控与记忆学习两大新能力",
      "Boris Cherny：夜间跑数千Agent、几乎只用Claude Code",
      "Mirage以945星领跑：AI Agent统一虚拟文件系统",
      "Grok数学合作成果登上arXiv——AI辅助数学研究成为新范式",
      "The First Token Knows：单次解码置信度即可检测幻觉，降本显著",
      "AI slop正在毁灭在线社区，HN 349分热议",
      "Chrome悄然移除'设备端AI不发送数据'声明(406pts)"
    ]
  }
];

export default reports;
