/**
 * 安全地更新 tools.ts 文件
 * 简化版: 逐行处理，避免复杂的正则匹配
 */
function updateFile(content, updates) {
  const lines = content.split(/\r?\n/);
  const result = [];
  
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    result.push(line);
    
    // 检查是否是工具/Skill的 ID 行
    const idMatch = line.match(/^\s+id:\s*'([^']+)',?\s*$/);
    if (!idMatch) { i++; continue; }
    
    const id = idMatch[1];
    if (id.length <= 3) { i++; continue; } // 跳过短ID
    
    // 判断是工具还是 Skill
    const toolUpdate = updates.tools?.[id];
    const skillUpdate = updates.skills?.[id];
    const update = toolUpdate || skillUpdate;
    if (!update) { i++; continue; }
    
    // 收集接下来的行，找到 heatGrowth 所在行
    let j = i + 1;
    while (j < lines.length && !lines[j].includes('heatGrowth:') && 
           !lines[j].includes('heat:') && !lines[j].includes('installCount:') &&
           !lines[j].includes('successRate:')) {
      j++;
    }
    
    // 替换目标字段
    while (j < lines.length && j < i + 20) { // 只看接下来20行
      const nextLine = lines[j];
      
      if (toolUpdate) {
        // 替换 heat
        if (nextLine.includes('heat:') && !nextLine.includes('heatGrowth:')) {
          result.push(nextLine.replace(/(\bheat:\s*)\d+(\.\d+)?/, `$1${update.heat}`));
          lines[j] = ''; // 标记已处理
          j++;
          continue;
        }
        // 替换 heatGrowth
        if (nextLine.includes('heatGrowth:')) {
          result.push(nextLine.replace(/(\bheatGrowth:\s*)\d+(\.\d+)?/, `$1${update.heatGrowth}`));
          lines[j] = '';
          j++;
          continue;
        }
      } else if (skillUpdate) {
        // 替换 installCount
        if (nextLine.includes('installCount:')) {
          result.push(nextLine.replace(/(\binstallCount:\s*)\d+/, `$1${update.installCount}`));
          lines[j] = '';
          j++;
          continue;
        }
        // 替换 successRate
        if (nextLine.includes('successRate:')) {
          result.push(nextLine.replace(/(\bsuccessRate:\s*)\d+(\.\d+)?/, `$1${update.successRate}`));
          lines[j] = '';
          j++;
          continue;
        }
        // 替换 heatGrowth
        if (nextLine.includes('heatGrowth:')) {
          result.push(nextLine.replace(/(\bheatGrowth:\s*)\d+(\.\d+)?/, `$1${update.heatGrowth}`));
          lines[j] = '';
          j++;
          continue;
        }
      }
      
      // 如果遇到下一个 ID 行，停止
      if (nextLine.match(/^\s+id:\s*'/)) break;
      j++;
    }
    
    i = j;
  }
  
  return result.join('\r\n');
}