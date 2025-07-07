import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    
    return NextResponse.json({
      hasSession: !!session,
      user: session?.user || null,
      role: session?.user?.role || null,
      headers: Object.fromEntries(request.headers.entries()),
    });
  } catch (error) {
    console.error('Test auth error:', error);
    return NextResponse.json(
      { error: 'Auth test failed', details: error.message },
      { status: 500 }
    );
  }
}
