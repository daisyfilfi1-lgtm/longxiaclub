import { NextResponse } from 'next/server';
import type { Tool, Skill } from '@/types';
import { getToolsFromSupabase } from '@/lib/supabase';
import { tools as localTools } from '@/data/tools';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category') || undefined;
  const limit = parseInt(searchParams.get('limit') || '100');
  const source = searchParams.get('source') || 'auto'; // auto | local | supabase
  
  try {
    // 如果指定了 supabase，尝试从 Supabase 获取
    if (source === 'supabase') {
      const tools = await getToolsFromSupabase({ category, limit });
      if (tools.length > 0) {
        return NextResponse.json({ data: tools, success: true, source: 'supabase' });
      }
    }
    
    // 如果指定了 local 或 supabase 获取失败，使用本地数据
    if (source === 'local' || source === 'auto') {
      let filteredTools: Tool[] = [...localTools];
      
      if (category) {
        filteredTools = filteredTools.filter(t => t.category === category);
      }
      
      return NextResponse.json({ 
        data: filteredTools.slice(0, limit), 
        success: true, 
        source: 'local' 
      });
    }
    
    return NextResponse.json({ data: [], success: true });
  } catch (error) {
    console.error('Tools API error:', error);
    // 出错时回退到本地数据
    return NextResponse.json({ 
      data: localTools.slice(0, limit), 
      success: true, 
      source: 'local-fallback' 
    });
  }
}
