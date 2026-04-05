const fs = require('fs');
const path = require('path');

// 配置
const GITHUB_DATA_FILE = path.join(__dirname, '../data/github-metrics.json');
const COMMUNITY_DATA_FILE = path.join(__dirname, '../data/community-metrics.json');
const SKILLS_DATA_FILE = path.join(__dirname, '../data/tools.ts');
const OUTPUT_FILE = path.join(__dirname, '../data/skill-heat-scores.json');

// 权重配置
const WEIGHTS = {
  github: {
    stars: 0.4,           // 40%
    stars_growth: 0.2,    // 20%
    forks: 0.15,          // 15%
    issues: 0.1,          // 10%
    commits: 0.15          // 15%
  },
  community: {
    discord_members: 0.3,  // 30%
    reddit_subscribers: 0.2, // 20%
    reddit_active: 0.2,    // 20%
    discussion_volume: 0.3  // 30%
  }
};

// 读取数据文件
function readDataFile(filePath) {
  try {
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(data);
    }
    return null;
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error.message);
    return null;
  }
}

// 读取 SKILLS 数据
function readSkillsData() {
  try {
    const data = fs.readFileSync(SKILLS_DATA_FILE, 'utf8');
    // 提取 skills 数组
    const skillsMatch = data.match(/export const skills: Skill\[\] = \[(.*?)\];/s);
    if (skillsMatch) {
      // 简单解析，实际项目中可能需要更复杂的解析
      return [];
    }
    return [];
  } catch (error) {
    console.error('Error reading skills data:', error.message);
    return [];
  }
}

// 归一化数据（0-1范围）
function normalize(value, min, max) {
  if (max === min) return 0;
  return Math.max(0, Math.min(1, (value - min) / (max - min)));
}

// 计算 GitHub 热度得分
function calculateGitHubHeat(repoData) {
  if (!repoData) return 0;

  // 提取指标
  const stars = repoData.stars || 0;
  const starsGrowth = repoData.stars_growth || 0;
  const forks = repoData.forks || 0;
  const issues = repoData.issues_count || 0;
  const commits = 1; // 简化处理，实际应该计算 commit 频率

  // 计算得分（这里使用简化的方法，实际应该先归一化）
  let score = 0;
  score += stars * WEIGHTS.github.stars;
  score += starsGrowth * WEIGHTS.github.stars_growth;
  score += forks * WEIGHTS.github.forks;
  score += issues * WEIGHTS.github.issues;
  score += commits * WEIGHTS.github.commits;

  return score;
}

// 计算社区热度得分
function calculateCommunityHeat(communityData) {
  if (!communityData) return 0;

  let score = 0;

  // Discord 数据
  if (communityData.discord && communityData.discord.length > 0) {
    const discordMembers = communityData.discord.reduce((sum, server) => sum + (server.member_count || 0), 0);
    score += discordMembers * WEIGHTS.community.discord_members;
  }

  // Reddit 数据
  if (communityData.reddit && communityData.reddit.length > 0) {
    const redditSubscribers = communityData.reddit.reduce((sum, subreddit) => sum + (subreddit.subscribers || 0), 0);
    const redditActive = communityData.reddit.reduce((sum, subreddit) => sum + (subreddit.active_users || 0), 0);
    
    score += redditSubscribers * WEIGHTS.community.reddit_subscribers;
    score += redditActive * WEIGHTS.community.reddit_active;
  }

  return score;
}

// 匹配 SKILL 和 GitHub 仓库
function matchSkillToRepo(skill, githubRepos) {
  const skillName = skill.name.toLowerCase();
  const skillKeywords = skillName.split(/\s+/).filter(word => word.length > 2);
  
  // 计算匹配分数
  const repoScores = githubRepos.map(repo => {
    let score = 0;
    const repoName = repo.name.toLowerCase();
    const repoFullName = repo.full_name.toLowerCase();
    
    // 完全匹配
    if (repoName === skillName || repoFullName === skillName) {
      score += 10;
    }
    
    // 部分匹配
    if (repoName.includes(skillName) || repoFullName.includes(skillName)) {
      score += 8;
    }
    
    // 关键词匹配
    skillKeywords.forEach(keyword => {
      if (repoName.includes(keyword) || repoFullName.includes(keyword)) {
        score += 2;
      }
    });
    
    // 描述匹配
    if (repo.description) {
      const repoDescription = repo.description.toLowerCase();
      if (repoDescription.includes(skillName)) {
        score += 5;
      }
      skillKeywords.forEach(keyword => {
        if (repoDescription.includes(keyword)) {
          score += 1;
        }
      });
    }
    
    return { repo, score };
  });
  
  // 找出得分最高的仓库
  const bestMatch = repoScores.reduce((best, current) => 
    current.score > best.score ? current : best
  , { repo: null, score: 0 });
  
  // 只有得分大于 0 的才认为是匹配
  return bestMatch.score > 0 ? bestMatch.repo : null;
}

// 主计算函数
function calculateSkillHeatScores() {
  console.log('Starting skill heat score calculation...');

  // 读取数据
  const githubData = readDataFile(GITHUB_DATA_FILE);
  const communityData = readDataFile(COMMUNITY_DATA_FILE);
  const skills = readSkillsData();

  if (!githubData || !communityData) {
    console.error('Missing required data files');
    return;
  }

  // 计算热度得分
  const heatScores = [];

  // 这里我们使用 GitHub 数据直接计算，实际项目中应该匹配到具体的 SKILL
  if (githubData.repositories) {
    githubData.repositories.forEach(repo => {
      const githubHeat = calculateGitHubHeat(repo);
      const communityHeat = calculateCommunityHeat(communityData.communities);
      
      // 综合得分
      const totalHeat = (githubHeat * 0.6) + (communityHeat * 0.4); // GitHub 占 60%，社区占 40%

      heatScores.push({
        name: repo.name,
        github_heat: githubHeat,
        community_heat: communityHeat,
        total_heat: totalHeat,
        stars: repo.stars,
        forks: repo.forks,
        timestamp: new Date().toISOString()
      });
    });
  }

  // 排序
  heatScores.sort((a, b) => b.total_heat - a.total_heat);

  // 保存结果
  const output = {
    timestamp: new Date().toISOString(),
    weights: WEIGHTS,
    skills: heatScores
  };

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(output, null, 2));
  console.log(`Heat scores calculated and saved to ${OUTPUT_FILE}`);

  return heatScores;
}

// 生成热度趋势
function generateHeatTrends() {
  try {
    // 读取历史数据
    const currentScores = calculateSkillHeatScores();
    const historyFile = path.join(__dirname, '../data/skill-heat-history.json');

    let history = [];
    if (fs.existsSync(historyFile)) {
      history = JSON.parse(fs.readFileSync(historyFile, 'utf8'));
    }

    // 添加当前数据到历史
    history.push({
      timestamp: new Date().toISOString(),
      scores: currentScores
    });

    // 只保留最近 30 天的数据
    const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
    history = history.filter(entry => new Date(entry.timestamp).getTime() >= thirtyDaysAgo);

    // 保存历史数据
    fs.writeFileSync(historyFile, JSON.stringify(history, null, 2));
    console.log('Heat trends generated and saved');

    return history;
  } catch (error) {
    console.error('Error generating heat trends:', error);
    return [];
  }
}

// 导出函数
if (require.main === module) {
  calculateSkillHeatScores();
}

module.exports = {
  calculateSkillHeatScores,
  generateHeatTrends,
  calculateGitHubHeat,
  calculateCommunityHeat
};
