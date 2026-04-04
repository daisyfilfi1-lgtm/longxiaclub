import { createClient } from '@supabase/supabase-js';
import { Tool, Skill, Scene } from '@/types';

// 创建 Supabase 客户端
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  console.warn('Supabase credentials not configured. Using local data fallback.');
}

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false, // 服务端渲染时不需要持久化会话
  },
});

// 工具函数：从 Supabase 获取工具列表
export async function getToolsFromSupabase(options?: {
  limit?: number;
  category?: string;
  orderBy?: string;
}): Promise<Tool[]> {
  try {
    let query = supabase.from('tools').select('*');
    
    if (options?.category) {
      query = query.eq('category', options.category);
    }
    
    if (options?.orderBy) {
      query = query.order(options.orderBy, { ascending: false });
    } else {
      query = query.order('heat', { ascending: false });
    }
    
    if (options?.limit) {
      query = query.limit(options.limit);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Supabase query error:', error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Failed to fetch tools from Supabase:', error);
    return [];
  }
}

// 工具函数：从 Supabase 获取 Skills
export async function getSkillsFromSupabase(options?: {
  limit?: number;
  category?: string;
}): Promise<Skill[]> {
  try {
    let query = supabase.from('skills').select('*');
    
    if (options?.category) {
      query = query.eq('category', options.category);
    }
    
    query = query.order('heat', { ascending: false });
    
    if (options?.limit) {
      query = query.limit(options.limit);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Supabase query error:', error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Failed to fetch skills from Supabase:', error);
    return [];
  }
}

// 工具函数：搜索
export async function searchSupabase(query: string, type: 'tools' | 'skills' | 'all' = 'all'): Promise<{ tools: Tool[]; skills: Skill[] }> {
  try {
    const results: { tools: Tool[]; skills: Skill[] } = { tools: [], skills: [] };
    
    if (type === 'all' || type === 'tools') {
      const { data: tools } = await supabase
        .from('tools')
        .select('*')
        .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
        .limit(10);
      results.tools = (tools as Tool[]) || [];
    }
    
    if (type === 'all' || type === 'skills') {
      const { data: skills } = await supabase
        .from('skills')
        .select('*')
        .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
        .limit(10);
      results.skills = (skills as Skill[]) || [];
    }
    
    return results;
  } catch (error) {
    console.error('Search error:', error);
    return { tools: [], skills: [] };
  }
}
