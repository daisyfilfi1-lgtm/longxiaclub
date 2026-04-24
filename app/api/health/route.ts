import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET() {
  const checks = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '1.0.0',
    environment: process.env.NODE_ENV,
    checks: {
      api: true,
      database: false,
    }
  };

  try {
    // 检查数据库连接
    const { data, error } = await supabase.from('tools').select('id').limit(1);
    
    if (!error) {
      checks.checks.database = true;
    }
  } catch (error) {
    // 数据库连接失败，但 API 仍然可用
    console.error('Health check: Database connection failed');
  }

  const isHealthy = checks.checks.api && checks.checks.database;
  
  return NextResponse.json(checks, {
    status: isHealthy ? 200 : 503
  });
}
