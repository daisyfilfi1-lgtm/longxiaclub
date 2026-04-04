import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';

// 重新验证 API - 用于 ISR
export async function POST(request: NextRequest) {
  try {
    // 验证密钥
    const authHeader = request.headers.get('authorization');
    const expectedKey = process.env.REVALIDATE_TOKEN;
    
    if (expectedKey && authHeader !== `Bearer ${expectedKey}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { path, tag } = await request.json();

    if (tag) {
      revalidateTag(tag);
      return NextResponse.json({ 
        revalidated: true, 
        tag,
        message: `Tag ${tag} revalidated`
      });
    }

    if (path) {
      revalidatePath(path);
      return NextResponse.json({ 
        revalidated: true, 
        path,
        message: `Path ${path} revalidated`
      });
    }

    return NextResponse.json(
      { error: 'Missing path or tag' },
      { status: 400 }
    );

  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  });
}
