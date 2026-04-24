import { NextRequest, NextResponse } from 'next/server';
import { globalCache } from '@/lib/cache';

export async function POST(request: NextRequest) {
  try {
    // 清除内存缓存
    globalCache.clear();
    
    return NextResponse.json({
      success: true,
      message: '缓存已清除',
      stats: globalCache.getStats()
    });

  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
