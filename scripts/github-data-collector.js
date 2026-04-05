const fetch = require('node-fetch').default;
const fs = require('fs');
const path = require('path');

// 配置
const GITHUB_TOKEN = process.env.GITHUB_TOKEN || '';
const REPOSITORIES = [
  // Tools
  { name: 'ChatGPT', owner: 'openai', repo: 'openai-python' },
  { name: 'Midjourney', owner: 'midjourney', repo: 'midjourney' },
  { name: 'Claude', owner: 'anthropics', repo: 'anthropic-sdk-python' },
  { name: 'Cursor', owner: 'getcursor', repo: 'cursor' },
  { name: 'Gamma', owner: 'gamma-app', repo: 'gamma' },
  { name: 'Perplexity', owner: 'perplexityai', repo: 'perplexity' },
  { name: 'HeyGen', owner: 'heygenai', repo: 'heygen' },
  { name: 'Runway', owner: 'runwayml', repo: 'stable-diffusion' },
  { name: 'Suno', owner: 'suno-ai', repo: 'suno' },
  { name: 'Notion AI', owner: 'notionhq', repo: 'notion-sdk-js' },
  { name: 'ElevenLabs', owner: 'elevenlabs', repo: 'elevenlabs-python' },
  { name: 'Figma AI', owner: 'figma', repo: 'figma-api' },
  { name: 'Remove.bg', owner: 'remove-bg', repo: 'remove.bg' },
  { name: 'Firefly', owner: 'adobe', repo: 'firefly' },
  // Skills
  { name: 'LangGPT', owner: 'LangGPT-Org', repo: 'LangGPT' },
  { name: 'GitHub Copilot', owner: 'github', repo: 'copilot-docs' },
  { name: 'AutoGPT', owner: 'Significant-Gravitas', repo: 'AutoGPT' },
  { name: 'BabyAGI', owner: 'yoheinakajima', repo: 'babyagi' },
  { name: 'LangChain', owner: 'langchain-ai', repo: 'langchain' },
  { name: 'LlamaIndex', owner: 'run-llama', repo: 'llama_index' },
  { name: 'Hugging Face Transformers', owner: 'huggingface', repo: 'transformers' },
  { name: 'Stable Diffusion', owner: 'Stability-AI', repo: 'stable-diffusion' }
];

const OUTPUT_FILE = path.join(__dirname, '../data/github-metrics.json');

// GitHub API 端点
const GITHUB_API = 'https://api.github.com';

// 延迟函数
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// 获取单个仓库数据
async function getRepositoryData(owner, repo) {
  try {
    const headers = {
      'Accept': 'application/vnd.github.v3+json'
    };
    
    if (GITHUB_TOKEN) {
      headers['Authorization'] = `token ${GITHUB_TOKEN}`;
    }

    const repoUrl = `${GITHUB_API}/repos/${owner}/${repo}`;
    const issuesUrl = `${GITHUB_API}/repos/${owner}/${repo}/issues?state=all&per_page=1`;
    const pullsUrl = `${GITHUB_API}/repos/${owner}/${repo}/pulls?state=all&per_page=1`;
    const commitsUrl = `${GITHUB_API}/repos/${owner}/${repo}/commits?per_page=1`;

    const [repoResponse, issuesResponse, pullsResponse, commitsResponse] = await Promise.all([
      fetch(repoUrl, { headers }),
      fetch(issuesUrl, { headers }),
      fetch(pullsUrl, { headers }),
      fetch(commitsUrl, { headers })
    ]);

    if (!repoResponse.ok) {
      throw new Error(`GitHub API error: ${repoResponse.statusText}`);
    }

    const repoData = await repoResponse.json();
    const issuesData = await issuesResponse.json();
    const pullsData = await pullsResponse.json();
    const commitsData = await commitsResponse.json();

    return {
      name: repoData.name,
      full_name: repoData.full_name,
      description: repoData.description,
      stars: repoData.stargazers_count,
      forks: repoData.forks_count,
      watchers: repoData.watchers_count,
      open_issues: repoData.open_issues_count,
      issues_count: issuesData.length > 0 ? issuesData[0].number : 0,
      pulls_count: pullsData.length > 0 ? pullsData[0].number : 0,
      last_commit: commitsData.length > 0 ? commitsData[0].commit.author.date : null,
      created_at: repoData.created_at,
      updated_at: repoData.updated_at
    };
  } catch (error) {
    console.error(`Error fetching data for ${owner}/${repo}:`, error.message);
    return null;
  }
}

// 主函数
async function collectGitHubData() {
  console.log('Starting GitHub data collection...');

  const results = [];
  
  for (const repo of REPOSITORIES) {
    console.log(`Collecting data for ${repo.owner}/${repo.repo}...`);
    const data = await getRepositoryData(repo.owner, repo.repo);
    if (data) {
      results.push(data);
    }
    // 避免 API 速率限制
    await delay(1000);
  }

  // 保存数据
  const output = {
    timestamp: new Date().toISOString(),
    repositories: results
  };

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(output, null, 2));
  console.log(`GitHub data collected and saved to ${OUTPUT_FILE}`);

  return results;
}

// 计算趋势（需要历史数据）
async function calculateTrends() {
  try {
    // 读取历史数据
    if (fs.existsSync(OUTPUT_FILE)) {
      const oldData = JSON.parse(fs.readFileSync(OUTPUT_FILE, 'utf8'));
      const newData = await collectGitHubData();

      // 计算趋势
      const trends = newData.map(newRepo => {
        const oldRepo = oldData.repositories.find(r => r.full_name === newRepo.full_name);
        if (oldRepo) {
          return {
            name: newRepo.name,
            stars: newRepo.stars,
            stars_growth: newRepo.stars - oldRepo.stars,
            forks: newRepo.forks,
            forks_growth: newRepo.forks - oldRepo.forks,
            timestamp: newRepo.timestamp
          };
        }
        return null;
      }).filter(Boolean);

      console.log('Trends calculated:', trends);
      return trends;
    } else {
      console.log('No historical data found, collecting initial data...');
      return await collectGitHubData();
    }
  } catch (error) {
    console.error('Error calculating trends:', error);
    return [];
  }
}

// 导出函数
if (require.main === module) {
  collectGitHubData().catch(console.error);
}

module.exports = {
  collectGitHubData,
  calculateTrends
};
