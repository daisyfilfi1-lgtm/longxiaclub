'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { ExternalLink, Heart, Share2, Download, Star, CheckCircle, GitBranch, ArrowLeft, Lightbulb, Target, Copy, Check } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { skills as localSkills, tools } from '@/data/tools';
import { notFound, useParams } from 'next/navigation';
import type { Skill } from '@/types';

// 强制动态渲染，防止预渲染失败
export const dynamic = 'force-dynamic';

interface Props {
  params: Promise<{ id: string }>;
}

// 使用场景和技巧示例数据
const SKILL_SCENARIOS: Record<string, {
  scenarios: { title: string; description: string; example: string }[];
  tips: string[];
  examplePrompt: string;
}> = {
  'skill_xhs_rewrite': {
    scenarios: [
      { title: '美妆产品种草', description: '将普通美妆产品描述改写为小红书爆款文案', example: '添加「谁懂啊！」「真的绝了！」等口语化表达' },
      { title: '数码产品测评', description: '数码产品体验文案优化，增加真实感和可信度', example: '加入「用了一个月来说说」「无广放心看」' },
      { title: '干货知识分享', description: '知识类笔记优化，提升可读性和收藏率', example: '使用「收藏＝学会」「建议码住」等引导语' }
    ],
    tips: [
      '开头一定要有钩子，3秒内抓住眼球',
      '多使用emoji增加活泼感，每段1-2个',
      '加入个人真实体验的描述，增加可信度',
      '结尾要有明确的引导（收藏/关注/评论）'
    ],
    examplePrompt: '请帮我把这段文案改写成小红书风格：[你的原本文案]'
  },
  'skill_weekly_report': {
    scenarios: [
      { title: '研发团队周报', description: '突出技术难点突破和项目进度', example: '强调「解决了XX核心问题」「提前XX天完成」' },
      { title: '产品运营月报', description: '用数据说话，展示业务成果', example: '「DAU增长30%」「转化率提升5个百分点」' },
      { title: '销售团队周报', description: '聚焦业绩完成情况和客户开发', example: '「完成目标120%」「新开发5个大客户」' }
    ],
    tips: [
      '用STAR法则描述工作成果',
      '数据量化，避免模糊描述',
      '先讲成果，再讲过程',
      '遇到的问题要附带解决方案'
    ],
    examplePrompt: '请根据以下工作内容生成一份专业的周报：[你的工作内容列表]'
  },
  'skill_vibe_coding': {
    scenarios: [
      { title: '快速原型开发', description: '用自然语言快速构建应用原型', example: '「帮我做一个Todo List应用，支持增删改查」' },
      { title: '代码重构优化', description: '让AI帮你重构老旧代码', example: '「这段代码太乱了，帮我重构得更优雅」' },
      { title: '学习新技术', description: '通过AI快速学习新框架或语言', example: '「我想学习React，帮我创建一个入门项目」' }
    ],
    tips: [
      '先描述整体需求，再逐步细化',
      '要求AI分步骤输出，方便检查',
      '遇到问题直接粘贴错误信息让AI修复',
      '让AI解释关键代码，加深理解'
    ],
    examplePrompt: '我想做一个[项目描述]，请帮我一步步实现'
  },
  'skill_langgpt_prompt': {
    scenarios: [
      { title: '专业顾问角色', description: '创建专业领域的AI顾问', example: '「你是一名资深律师，请帮我审查合同」' },
      { title: '教学辅导角色', description: '设计个性化的AI老师', example: '「你是一位耐心的数学老师，用通俗易懂的方式讲解」' },
      { title: '创意写作角色', description: '构建特定风格的AI写手', example: '「你是一位悬疑小说作家，擅长制造悬念」' }
    ],
    tips: [
      '角色设定越具体，输出越精准',
      '明确规定输出格式和风格',
      '加入约束条件避免AI偏离',
      '提供示例让AI理解期望'
    ],
    examplePrompt: '请帮我创建一个[角色名称]的结构化提示词，要求：[具体要求]'
  }
};

export default function SkillDetailPage() {
  const params = useParams<{ id: string }>();
  const { id } = params;
  const [skill, setSkill] = useState<Skill | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  // 获取Skill数据
  useEffect(() => {
    const fetchSkill = async () => {
      setIsLoading(true);
      try {
        const res = await fetch('/api/skills');
        if (res.ok) {
          const data = await res.json();
          if (data.success) {
            const foundSkill = data.data.find((s: Skill) => s.id === id);
            if (foundSkill) {
              setSkill(foundSkill);
              setIsLoading(false);
              return;
            }
          }
        }
      } catch (error) {
        console.error('Failed to fetch skill:', error);
      }
      // 回退到本地数据
      const localSkill = localSkills.find((s) => s.id === id);
      if (localSkill) {
        setSkill(localSkill);
      }
      setIsLoading(false);
    };
    fetchSkill();
  }, [id]);

  if (isLoading) {
    return (
      <main className="min-h-screen bg-slate-50 dot-pattern flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-slate-500">加载中...</p>
        </div>
      </main>
    );
  }

  if (!skill) {
    notFound();
  }

  const requiredTools = skill.dependencies
    .map((dep) => tools.find((t) => t.name === dep.name))
    .filter(Boolean);

  const skillData = SKILL_SCENARIOS[skill.id] || {
    scenarios: [
      { title: '日常工作', description: '适用于日常办公场景，提升工作效率', example: '快速处理重复性任务' },
      { title: '学习提升', description: '帮助学习新知识，加速技能成长', example: '系统化学习路径' }
    ],
    tips: ['根据实际需求调整使用方式', '多尝试不同的输入方式', '结合其他工具使用效果更佳'],
    examplePrompt: '请使用这个Skill帮助我：[你的具体需求]'
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <main className="min-h-screen bg-slate-50 dot-pattern">
      <div className="fixed inset-0 bg-gradient-mint pointer-events-none" />
      
      <Navbar />
      
      <div className="relative pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <Link
            href="/skills"
            className="inline-flex items-center space-x-2 text-slate-500 hover:text-purple-600 transition-colors mb-8"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>返回Skill市场</span>
          </Link>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Hero Card */}
              <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-lg shadow-slate-100">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center space-x-6">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center text-5xl border border-purple-200">
                      {skill.icon}
                    </div>
                    <div>
                      <div className="flex items-center space-x-3 mb-2">
                        <h1 className="text-3xl font-bold text-slate-800">{skill.name}</h1>
                        <span className="text-xs px-3 py-1 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                          v{skill.version}
                        </span>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-100">
                          <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                          <span className="font-semibold text-amber-600">{skill.rating}</span>
                        </div>
                        <span className="text-emerald-600 font-medium">📈 +{skill.heatGrowth}%</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-3">
                    <button className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-400 hover:text-rose-500 hover:border-rose-200 hover:bg-rose-50 transition-all">
                      <Heart className="w-5 h-5" />
                    </button>
                    <button className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-400 hover:text-slate-600 transition-all">
                      <Share2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Description */}
                <p className="text-slate-600 mb-6 leading-relaxed text-lg">{skill.description}</p>

                {/* Meta */}
                <div className="flex flex-wrap items-center gap-3 mb-6">
                  <span className="px-4 py-2 rounded-xl bg-purple-50 text-purple-700 text-sm font-medium border border-purple-100">
                    {skill.category}
                  </span>
                  <span className={`px-4 py-2 rounded-xl text-sm font-medium border ${
                    skill.difficulty === 'beginner' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                    skill.difficulty === 'intermediate' ? 'bg-yellow-50 text-yellow-600 border-yellow-100' :
                    'bg-red-50 text-red-600 border-red-100'
                  }`}>
                    {skill.difficulty === 'beginner' ? '入门' : skill.difficulty === 'intermediate' ? '进阶' : '高级'}
                  </span>
                  <span className={`px-4 py-2 rounded-xl text-sm font-medium border ${
                    skill.price === 'free' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                    skill.price === 'member' ? 'bg-purple-50 text-purple-600 border-purple-100' :
                    'bg-orange-50 text-orange-600 border-orange-100'
                  }`}>
                    {skill.price === 'free' ? '免费' : skill.price === 'member' ? '会员专享' : `¥${skill.price}`}
                  </span>
                </div>

                {/* Install Button */}
                <button 
                  onClick={() => {
                    const skillData = JSON.stringify(skill, null, 2);
                    const blob = new Blob([skillData], { type: 'application/json' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `${skill.id}.json`;
                    a.click();
                    URL.revokeObjectURL(url);
                  }}
                  className="inline-flex items-center space-x-2 px-8 py-4 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium hover:shadow-lg hover:shadow-purple-200 transition-all"
                >
                  <Download className="w-5 h-5" />
                  <span>一键安装</span>
                </button>
              </div>

              {/* 使用场景 */}
              <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-lg shadow-slate-100">
                <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center space-x-2">
                  <Target className="w-5 h-5 text-purple-500" />
                  <span>🎯 使用场景</span>
                </h2>
                <div className="space-y-4">
                  {skillData.scenarios.map((scenario, idx) => (
                    <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                      <h3 className="font-semibold text-slate-800 mb-2">{scenario.title}</h3>
                      <p className="text-sm text-slate-600 mb-2">{scenario.description}</p>
                      <p className="text-xs text-purple-600 bg-purple-50 px-3 py-1.5 rounded-lg inline-block">
                        💡 {scenario.example}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Workflow */}
              <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-lg shadow-slate-100">
                <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center space-x-2">
                  <GitBranch className="w-5 h-5 text-purple-500" />
                  <span>⚡ 工作流程</span>
                </h2>
                <div className="space-y-4">
                  {skill.workflow.map((step, idx) => (
                    <div key={step.step} className="flex items-start space-x-4">
                      <div className="flex flex-col items-center">
                        <div className="w-10 h-10 rounded-xl bg-purple-100 border border-purple-200 flex items-center justify-center text-lg font-bold text-purple-600">
                          {step.step}
                        </div>
                        {idx < skill.workflow.length - 1 && (
                          <div className="w-px h-10 bg-slate-200 my-1" />
                        )}
                      </div>
                      <div className="flex-1 pt-2">
                        <h3 className="font-semibold text-slate-800 mb-1">{step.title}</h3>
                        <p className="text-sm text-slate-500">{step.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Input/Output */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-lg shadow-slate-100">
                  <h3 className="font-bold text-slate-800 mb-3 flex items-center space-x-2">
                    <span className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 text-sm">IN</span>
                    <span>输入</span>
                  </h3>
                  <p className="text-slate-600 text-sm">{skill.input}</p>
                </div>
                <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-lg shadow-slate-100">
                  <h3 className="font-bold text-slate-800 mb-3 flex items-center space-x-2">
                    <span className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600 text-sm">OUT</span>
                    <span>输出</span>
                  </h3>
                  <p className="text-slate-600 text-sm">{skill.output}</p>
                </div>
              </div>

              {/* 使用技巧 */}
              <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-lg shadow-slate-100">
                <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center space-x-2">
                  <Lightbulb className="w-5 h-5 text-purple-500" />
                  <span>💡 使用技巧</span>
                </h2>
                <div className="space-y-3">
                  {skillData.tips.map((tip, idx) => (
                    <div key={idx} className="flex items-start space-x-3">
                      <div className="mt-1 w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 text-sm font-bold shrink-0">
                        {idx + 1}
                      </div>
                      <p className="text-slate-700">{tip}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* 示例提示词 */}
              <div className="p-8 rounded-3xl bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 shadow-lg shadow-purple-100">
                <h2 className="text-xl font-bold text-slate-800 mb-4">📝 示例提示词</h2>
                <div className="relative">
                  <div className="bg-white rounded-xl p-4 border border-slate-200">
                    <p className="text-slate-700 font-mono text-sm">{skillData.examplePrompt}</p>
                  </div>
                  <button
                    onClick={() => handleCopy(skillData.examplePrompt)}
                    className="absolute top-3 right-3 p-2 rounded-lg bg-slate-100 hover:bg-slate-200 transition-colors"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4 text-slate-500" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Stats */}
              <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-lg shadow-slate-100">
                <h3 className="font-bold text-slate-800 mb-4">📊 数据统计</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50">
                    <span className="text-slate-500">安装次数</span>
                    <span className="font-bold text-slate-800">{(skill.installCount / 1000).toFixed(1)}k</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50">
                    <span className="text-slate-500">成功率</span>
                    <div className="flex items-center space-x-1">
                      <CheckCircle className="w-4 h-4 text-emerald-500" />
                      <span className="font-bold text-slate-800">{skill.successRate}%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50">
                    <span className="text-slate-500">用户评分</span>
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                      <span className="font-bold text-slate-800">{skill.rating}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Dependencies */}
              <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-lg shadow-slate-100">
                <h3 className="font-bold text-slate-800 mb-4">🔗 依赖工具</h3>
                <div className="space-y-3">
                  {skill.dependencies.length > 0 ? skill.dependencies.map((dep) => {
                    const tool = tools.find((t) => t.name === dep.name);
                    return (
                      <div key={dep.name} className="flex items-center space-x-3 p-3 rounded-xl bg-slate-50">
                        <span className="text-2xl">{tool?.logo || '🔧'}</span>
                        <div className="flex-1">
                          <h4 className="font-medium text-slate-800 text-sm">{dep.name}</h4>
                          {dep.minVersion && (
                            <p className="text-xs text-slate-500">最低版本: {dep.minVersion}</p>
                          )}
                        </div>
                        {dep.optional && (
                          <span className="text-xs px-2 py-1 rounded-full bg-slate-200 text-slate-600">
                            可选
                          </span>
                        )}
                      </div>
                    );
                  }) : (
                    <p className="text-sm text-slate-500">无依赖工具，开箱即用</p>
                  )}
                </div>
              </div>

              {/* Compatibility */}
              <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-lg shadow-slate-100">
                <h3 className="font-bold text-slate-800 mb-4">✅ 兼容平台</h3>
                <div className="flex flex-wrap gap-2">
                  {skill.compatibility.map((agent) => (
                    <span
                      key={agent}
                      className="px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-600 text-sm font-medium border border-emerald-100"
                    >
                      {agent}
                    </span>
                  ))}
                </div>
              </div>

              {/* Author */}
              <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-lg shadow-slate-100">
                <h3 className="font-bold text-slate-800 mb-4">👤 开发者</h3>
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-lg font-bold text-white">
                    {skill.author[0]}
                  </div>
                  <div>
                    <p className="font-medium text-slate-800">{skill.author}</p>
                    <p className="text-xs text-slate-500">认证开发者</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
