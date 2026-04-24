import { NextResponse } from 'next/server';
import type { Tool, Skill } from '@/types';
import { searchSupabase } from '@/lib/supabase';
import { tools as localTools, skills as localSkills } from '@/data/tools';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q') || '';
  const type = searchParams.get('type') || 'all'; // all | tools | skills
  const source = searchParams.get('source') || 'auto'; // auto | local | supabase
  
  if (!q || q.length < 1) {
    return NextResponse.json({ data: { tools: [], skills: [] }, success: true });
  }
  
  try {
    // 尝试从 Supabase 搜索
    if (source === 'supabase' || source === 'auto') {
      const supabaseUrl = process.env.SUPABASE_URL;
      const supabaseKey = process.env.SUPABASE_ANON_KEY;
      
      if (supabaseUrl && supabaseKey) {
        const results = await searchSupabase(q, type as 'tools' | 'skills' | 'all');
        if (results.tools.length > 0 || results.skills.length > 0) {
          return NextResponse.json({ 
            data: results, 
            success: true, 
            source: 'supabase' 
          });
        }
      }
    }
    
    // 本地数据搜索
    const results: { tools: Tool[]; skills: Skill[] } = { tools: [], skills: [] };
    const lowerQuery = q.toLowerCase();
    
    if (type === 'all' || type === 'tools') {
      results.tools = localTools.filter(tool => 
        tool.name.toLowerCase().includes(lowerQuery) ||
        tool.description.toLowerCase().includes(lowerQuery) ||
        tool.tags.some(tag => tag.toLowerCase().includes(lowerQuery)) ||
        tool.category.toLowerCase().includes(lowerQuery)
      ).slice(0, 10);
    }
    
    if (type === 'all' || type === 'skills') {
      results.skills = localSkills.filter(skill => 
        skill.name.toLowerCase().includes(lowerQuery) ||
        skill.description.toLowerCase().includes(lowerQuery) ||
        skill.category.toLowerCase().includes(lowerQuery)
      ).slice(0, 10);
    }
    
    return NextResponse.json({ 
      data: results, 
      success: true, 
      source: 'local' 
    });
  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json({ 
      error: 'Search failed', 
      data: { tools: [], skills: [] },
      success: false 
    }, { status: 500 });
  }
}
