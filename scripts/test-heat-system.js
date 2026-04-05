const { collectGitHubData } = require('./github-data-collector');
const { collectCommunityData } = require('./community-data-collector');
const { calculateSkillHeatScores } = require('./heat-calculator');
const fetch = require('node-fetch').default;

// 测试完整流程
async function testCompleteFlow() {
  console.log('=== 测试热度系统完整流程 ===\n');

  try {
    // 1. 采集 GitHub 数据
    console.log('1. 采集 GitHub 数据...');
    await collectGitHubData();
    console.log('✓ GitHub 数据采集完成\n');

    // 2. 采集社区数据
    console.log('2. 采集社区数据...');
    await collectCommunityData();
    console.log('✓ 社区数据采集完成\n');

    // 3. 计算热度得分
    console.log('3. 计算热度得分...');
    const heatScores = await calculateSkillHeatScores();
    console.log('✓ 热度得分计算完成');
    if (heatScores && heatScores.length > 0) {
      console.log('  排名前三的 SKILL:');
      heatScores.slice(0, 3).forEach((skill, index) => {
        console.log(`  ${index + 1}. ${skill.name} - 热度: ${skill.total_heat.toFixed(2)}`);
      });
    }
    console.log('');

    // 4. 测试 API 响应
    console.log('4. 测试 Skills API...');
    const skillsResponse = await fetch('http://localhost:3001/api/skills?sortBy=hot');
    const skillsData = await skillsResponse.json();
    console.log('✓ Skills API 测试完成');
    console.log(`  返回 ${skillsData.data.length} 个 SKILL`);
    if (skillsData.data.length > 0) {
      console.log('  第一个 SKILL:', skillsData.data[0].name);
      if (skillsData.data[0].heat) {
        console.log('  热度值:', skillsData.data[0].heat.toFixed(2));
      }
    }
    console.log('');

    // 5. 测试 Leaderboard API
    console.log('5. 测试 Leaderboard API...');
    const leaderboardResponse = await fetch('http://localhost:3001/api/leaderboard?type=skills');
    const leaderboardData = await leaderboardResponse.json();
    console.log('✓ Leaderboard API 测试完成');
    console.log(`  返回 ${leaderboardData.data.length} 个 SKILL`);
    if (leaderboardData.data.length > 0) {
      console.log('  排名第一的 SKILL:', leaderboardData.data[0].name);
      if (leaderboardData.data[0].heat) {
        console.log('  热度值:', leaderboardData.data[0].heat.toFixed(2));
      }
    }
    console.log('');

    console.log('=== 测试完成 ===');
    console.log('所有流程运行正常！');

  } catch (error) {
    console.error('测试过程中出现错误:', error);
    console.log('=== 测试失败 ===');
  }
}

// 测试单个模块
async function testSingleModule(moduleName) {
  console.log(`=== 测试 ${moduleName} 模块 ===\n`);

  try {
    switch (moduleName) {
      case 'github':
        await collectGitHubData();
        break;
      case 'community':
        await collectCommunityData();
        break;
      case 'heat':
        await calculateSkillHeatScores();
        break;
      default:
        console.log('未知模块');
        return;
    }

    console.log(`✓ ${moduleName} 模块测试完成`);
  } catch (error) {
    console.error(`${moduleName} 模块测试失败:`, error);
  }
}

// 主函数
if (require.main === module) {
  const args = process.argv.slice(2);
  if (args.length > 0) {
    testSingleModule(args[0]);
  } else {
    testCompleteFlow();
  }
}

module.exports = {
  testCompleteFlow,
  testSingleModule
};
