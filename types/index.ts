export interface Tool {
  id: string;
  name: string;
  logo: string;
  description: string;
  url: string;
  price: 'free' | 'freemium' | 'paid' | 'enterprise';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  heat: number;
  heatGrowth: number;
  tags: string[];
  techTags: string[];
  sceneTags: string[];
  costTags: string[];
  prompts: Prompt[];
  tips: string[];
  relatedSkills: string[];
  xhsSaves?: number;
  b站弹幕?: number;
  category: string;
  // 增强内容 (AI生成)
  enhancedTips?: string[];
  cases?: ToolCase[];
  guides?: ToolGuide[];
  contentUpdatedAt?: string;
}

export interface ToolCase {
  title: string;
  description: string;
  prompt?: string;
  result?: string;
}

export interface ToolGuide {
  title: string;
  steps: string[];
}

export interface Prompt {
  id: string;
  title: string;
  content: string;
  scene: string;
  screenshot?: string;
}

export interface Skill {
  id: string;
  name: string;
  description: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  author: string;
  version: string;
  installCount: number;
  successRate: number;
  rating: number;
  price: 'free' | 'member' | number;
  compatibility: string[];
  workflow: WorkflowStep[];
  dependencies: Dependency[];
  input: string;
  output: string;
  icon: string;
  heatGrowth: number;
}

export interface WorkflowStep {
  step: number;
  title: string;
  description: string;
}

export interface Dependency {
  name: string;
  minVersion?: string;
  alternatives?: string[];
  optional?: boolean;
}

export interface Scene {
  id: string;
  name: string;
  icon: string;
  description: string;
  coverImage: string;
  toolCount: number;
  skillCount: number;
  xhsSaves: number;
  tags: string[];
  solutions: Solution[];
}

export interface Solution {
  id: string;
  type: 'auto' | 'semi';
  title: string;
  description: string;
  tools: string[];
  skills: string[];
  effect: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

export interface DailyPick {
  id: string;
  sceneId: string;
  sceneName: string;
  coverImage: string;
  description: string;
  toolCount: number;
  skillCount: number;
  xhsSaves: number;
  date: string;
}

// 场景标签常量
export const SCENE_TAGS = [
  '办公提效',
  '内容创作', 
  '编程开发',
  '设计创作',
  '电商运营',
  '餐饮',
  '短视频',
  '学术研究'
] as const;

export type SceneTag = typeof SCENE_TAGS[number];
