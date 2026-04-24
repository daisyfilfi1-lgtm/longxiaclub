const fetch = require('node-fetch').default;
const fs = require('fs');
const path = require('path');

// 配置
const DISCORD_TOKEN = process.env.DISCORD_TOKEN || '';
const REDDIT_CLIENT_ID = process.env.REDDIT_CLIENT_ID || '';
const REDDIT_CLIENT_SECRET = process.env.REDDIT_CLIENT_SECRET || '';

const COMMUNITIES = {
  discord: [
    { name: 'LangGPT', serverId: '123456789012345678' }, // 示例服务器ID
    { name: 'AI Navigation', serverId: '987654321098765432' } // 示例服务器ID
  ],
  reddit: [
    { name: 'artificial', subreddit: 'artificial' },
    { name: 'ChatGPT', subreddit: 'ChatGPT' },
    { name: 'OpenAI', subreddit: 'OpenAI' }
  ]
};

const OUTPUT_FILE = path.join(__dirname, '../data/community-metrics.json');

// 延迟函数
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// 获取 Discord 服务器数据
async function getDiscordServerData(serverId) {
  try {
    if (!DISCORD_TOKEN) {
      console.warn('Discord token not configured, skipping Discord data collection');
      return null;
    }

    const url = `https://discord.com/api/v10/guilds/${serverId}`;
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bot ${DISCORD_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Discord API error: ${response.statusText}`);
    }

    const data = await response.json();
    return {
      name: data.name,
      member_count: data.approximate_member_count || 0,
      channel_count: data.channels?.length || 0,
      description: data.description || ''
    };
  } catch (error) {
    console.error(`Error fetching Discord server data:`, error.message);
    return null;
  }
}

// 获取 Reddit 子版块数据
async function getRedditSubredditData(subreddit) {
  try {
    if (!REDDIT_CLIENT_ID || !REDDIT_CLIENT_SECRET) {
      console.warn('Reddit credentials not configured, skipping Reddit data collection');
      return null;
    }

    // 获取访问令牌
    const authResponse = await fetch('https://www.reddit.com/api/v1/access_token', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${Buffer.from(`${REDDIT_CLIENT_ID}:${REDDIT_CLIENT_SECRET}`).toString('base64')}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: 'grant_type=client_credentials'
    });

    if (!authResponse.ok) {
      throw new Error(`Reddit auth error: ${authResponse.statusText}`);
    }

    const authData = await authResponse.json();
    const accessToken = authData.access_token;

    // 获取子版块数据
    const subredditUrl = `https://oauth.reddit.com/r/${subreddit}/about`;
    const response = await fetch(subredditUrl, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'User-Agent': 'AI Navigation Bot'
      }
    });

    if (!response.ok) {
      throw new Error(`Reddit API error: ${response.statusText}`);
    }

    const data = await response.json();
    const subredditData = data.data;

    return {
      name: subredditData.display_name_prefixed,
      subscribers: subredditData.subscribers || 0,
      active_users: subredditData.active_user_count || 0,
      description: subredditData.public_description || '',
      created_utc: subredditData.created_utc
    };
  } catch (error) {
    console.error(`Error fetching Reddit subreddit data:`, error.message);
    return null;
  }
}

// 主函数
async function collectCommunityData() {
  console.log('Starting community data collection...');

  const results = {
    discord: [],
    reddit: []
  };

  // 采集 Discord 数据
  console.log('Collecting Discord data...');
  for (const community of COMMUNITIES.discord) {
    const data = await getDiscordServerData(community.serverId);
    if (data) {
      results.discord.push({
        ...data,
        original_name: community.name
      });
    }
    await delay(1000);
  }

  // 采集 Reddit 数据
  console.log('Collecting Reddit data...');
  for (const community of COMMUNITIES.reddit) {
    const data = await getRedditSubredditData(community.subreddit);
    if (data) {
      results.reddit.push({
        ...data,
        original_name: community.name
      });
    }
    await delay(2000); // Reddit API 速率限制更严格
  }

  // 保存数据
  const output = {
    timestamp: new Date().toISOString(),
    communities: results
  };

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(output, null, 2));
  console.log(`Community data collected and saved to ${OUTPUT_FILE}`);

  return results;
}

// 计算社区趋势
async function calculateCommunityTrends() {
  try {
    // 读取历史数据
    if (fs.existsSync(OUTPUT_FILE)) {
      const oldData = JSON.parse(fs.readFileSync(OUTPUT_FILE, 'utf8'));
      const newData = await collectCommunityData();

      // 计算 Discord 趋势
      const discordTrends = newData.discord.map(newCommunity => {
        const oldCommunity = oldData.communities.discord.find(c => c.original_name === newCommunity.original_name);
        if (oldCommunity) {
          return {
            name: newCommunity.original_name,
            member_count: newCommunity.member_count,
            member_growth: newCommunity.member_count - oldCommunity.member_count,
            timestamp: newCommunity.timestamp
          };
        }
        return null;
      }).filter(Boolean);

      // 计算 Reddit 趋势
      const redditTrends = newData.reddit.map(newCommunity => {
        const oldCommunity = oldData.communities.reddit.find(c => c.original_name === newCommunity.original_name);
        if (oldCommunity) {
          return {
            name: newCommunity.original_name,
            subscribers: newCommunity.subscribers,
            subscribers_growth: newCommunity.subscribers - oldCommunity.subscribers,
            active_users: newCommunity.active_users,
            timestamp: newCommunity.timestamp
          };
        }
        return null;
      }).filter(Boolean);

      const trends = {
        discord: discordTrends,
        reddit: redditTrends
      };

      console.log('Community trends calculated:', trends);
      return trends;
    } else {
      console.log('No historical community data found, collecting initial data...');
      return await collectCommunityData();
    }
  } catch (error) {
    console.error('Error calculating community trends:', error);
    return { discord: [], reddit: [] };
  }
}

// 导出函数
if (require.main === module) {
  collectCommunityData().catch(console.error);
}

module.exports = {
  collectCommunityData,
  calculateCommunityTrends
};
