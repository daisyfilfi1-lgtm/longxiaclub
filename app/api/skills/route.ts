import { NextResponse } from 'next/server';
import { getSkillsFromSupabase } from '@/lib/supabase';
import { skills as localSkills } from '@/data/tools';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category') || undefined;
  const limit = parseInt(searchParams.get('limit') || '100');
  const source = searchParams.get('source') || 'auto'; // auto | local | supabase
  
  try {
    // 如果指定了 supabase，尝试从 Supabase 获取
    if (source === 'supabase') {
      const skills = await getSkillsFromSupabase({ category, limit });
      if (skills.length > 0) {
        return NextResponse.json({ data: skills, success: true, source: 'supabase' });
      }
    }
    
    // 如果指定了 local 或 supabase 获取失败，使用本地数据
    if (source === 'local' || source === 'auto') {
      let filteredSkills = localSkills;
      
      if (category) {
        filteredSkills = filteredSkills.filter(s => s.category === category);
      }
      
      return NextResponse.json({ 
        data: filteredSkills.slice(0, limit), 
        success: true, 
        source: 'local' 
      });
    }
    
    return NextResponse.json({ data: [], success: true });
  } catch (error) {
    console.error('Skills API error:', error);
    // 出错时回退到本地数据
    return NextResponse.json({ 
      data: localSkills.slice(0, limit), 
      success: true, 
      source: 'local-fallback' 
    });
  }
}
