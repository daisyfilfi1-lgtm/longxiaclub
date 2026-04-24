import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

export async function GET() {
  const results: Record<string, any> = {};

  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || '';
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || '';
    
    results.config = {
      hasUrl: !!supabaseUrl,
      hasKey: !!supabaseKey,
      url: supabaseUrl ? supabaseUrl.substring(0, 30) + '...' : 'missing',
    };

    const supabase = createClient(supabaseUrl, supabaseKey, {
      auth: { persistSession: false },
    });

    // Test tools table
    const { data: tools, error: toolsError } = await supabase
      .from('tools')
      .select('id, name')
      .limit(3);
    
    results.tools = {
      success: !toolsError,
      count: tools?.length || 0,
      error: toolsError ? { message: toolsError.message, code: toolsError.code } : null,
      sample: tools || [],
    };

    // Test skills table
    const { data: skills, error: skillsError } = await supabase
      .from('skills')
      .select('id, name')
      .limit(3);
    
    results.skills = {
      success: !skillsError,
      count: skills?.length || 0,
      error: skillsError ? { message: skillsError.message, code: skillsError.code } : null,
      sample: skills || [],
    };

  } catch (err: any) {
    results.exception = err?.message || String(err);
  }

  return NextResponse.json(results);
}
