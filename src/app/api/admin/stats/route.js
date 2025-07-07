import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const [totalPosts, totalMessages, unreadMessages, publishedPosts] = await Promise.all([
      prisma.post.count(),
      prisma.contactMessage.count(),
      prisma.contactMessage.count({ where: { read: false } }),
      prisma.post.count({ where: { published: true } }),
    ]);

    return NextResponse.json({
      totalPosts,
      totalMessages,
      unreadMessages,
      publishedPosts,
    });
  } catch (error) {
    console.error('Failed to fetch admin stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}
