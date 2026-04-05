#!/usr/bin/env python3
"""
Google Trends 数据采集脚本
使用 pytrends 库获取AI相关关键词的搜索趋势

安装依赖: pip install pytrends
使用方式: python scripts/google-trends-collector.py
"""

import json
import os
from datetime import datetime, timedelta
from pytrends.request import TrendReq

# 追踪的AI关键词
AI_KEYWORDS = [
    'ChatGPT',
    'Midjourney', 
    'Claude',
    'Cursor',
    'Kimi',
    'GPT-4',
    'AI',
    'LLM',
    'AIGC',
    'Stable Diffusion',
    'Runway',
    'Suno',
    'Perplexity',
    'Gamma',
    'HeyGen',
    'Notion AI',
    'Copilot',
    'DALL-E',
    'Llama',
    'LangChain'
]

def fetch_google_trends():
    """获取Google Trends数据"""
    print("[INFO] Connecting to Google Trends...")
    
    # 初始化pytrends
    pytrends = TrendReq(hl='zh-CN', tz=360)
    
    results = []
    
    # 分批获取（Google Trends API限制每次最多5个关键词）
    batch_size = 5
    for i in range(0, len(AI_KEYWORDS), batch_size):
        batch = AI_KEYWORDS[i:i + batch_size]
        print(f"  Fetching: {', '.join(batch)}")
        
        try:
            pytrends.build_payload(
                kw_list=batch,
                cat=0,
                timeframe='today 30-d',  # 近30天
                geo='CN',  # 中国
                gprop=''
            )
            
            interest_over_time_df = pytrends.interest_over_time()
            
            if not interest_over_time_df.empty:
                # 计算每个关键词的平均热度
                for keyword in batch:
                    if keyword in interest_over_time_df.columns:
                        values = interest_over_time_df[keyword].dropna()
                        if len(values) > 0:
                            current_heat = values.iloc[-7:].mean() if len(values) >= 7 else values.mean()
                            older_heat = values.iloc[-14:-7].mean() if len(values) >= 14 else values.mean()
                            growth = current_heat - older_heat if older_heat else 0
                            
                            results.append({
                                'keyword': keyword,
                                'current_heat': round(current_heat, 1),
                                'growth': round(growth, 1),
                                'peak_30d': values.max(),
                                'last_updated': datetime.now().isoformat()
                            })
                            
            # 添加延迟避免被限流
            import time
            time.sleep(1)
            
        except Exception as e:
            print(f"  [WARN] Error fetching {batch}: {e}")
            continue
    
    # 按热度排序
    results.sort(key=lambda x: x['current_heat'], reverse=True)
    
    return {
        'timestamp': datetime.now().isoformat(),
        'source': 'google_trends',
        'keywords': results,
        'total_keywords': len(results)
    }

def main():
    print("=== Starting Google Trends data collection ===\n")
    
    try:
        data = fetch_google_trends()
        
        # 保存到文件
        output_file = os.path.join(os.path.dirname(__file__), '..', 'data', 'google-trends-data.json')
        
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        
        print(f"[OK] Saved {len(data['keywords'])} keywords to {output_file}")
        
        # 打印前10名
        print("\n=== Top 10 Trending Keywords ===")
        for i, kw in enumerate(data['keywords'][:10], 1):
            growth_str = f"+{kw['growth']}" if kw['growth'] > 0 else str(kw['growth'])
            print(f"  {i}. {kw['keyword']}: {kw['current_heat']} ({growth_str})")
            
    except Exception as e:
        print(f"[ERROR] {e}")
        print("\nTip: If you encounter verification code error, consider:")
        print("  1. Use paid SerpAPI service")
        print("  2. Use proxy IP")
        print("  3. Manual data update")

if __name__ == '__main__':
    main()