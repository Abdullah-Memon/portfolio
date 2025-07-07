import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { slugify } from '@/utils/helpers';

export async function PUT(request, { params }) {
  console.log('📝 PUT /api/posts/[postId] called with ID:', params.postId); // Debug log
  
  try {
    // Check authentication for admin operations
    console.log('🔐 Checking authentication...'); // Debug log
    await requireAuth(request);
    console.log('✅ Authentication successful'); // Debug log
    
    const { postId } = params;
    const body = await request.json();
    console.log('📄 Received update data:', { 
      title: body.title, 
      contentLength: body.content?.length, 
      published: body.published 
    }); // Debug log

    // Convert postId to integer
    const postIdInt = parseInt(postId, 10);
    if (isNaN(postIdInt)) {
      console.log('❌ Invalid post ID:', postId); // Debug log
      return NextResponse.json(
        { error: 'Invalid post ID' },
        { status: 400 }
      )
    }

    // Validate required fields
    if (!body.title || !body.content) {
      console.log('❌ Validation failed: missing required fields'); // Debug log
      return NextResponse.json(
        { error: 'Title and content are required' },
        { status: 400 }
      )
    }

    // Generate slug if title changed
    const slug = body.slug || slugify(body.title)
    console.log('🔗 Generated slug:', slug); // Debug log

    const updatedPost = await prisma.post.update({
      where: { id: postIdInt },
      data: {
        title: body.title,
        slug: slug,
        content: body.content,
        excerpt: body.excerpt || '',
        published: Boolean(body.published),
        featured: Boolean(body.featured),
        tags: Array.isArray(body.tags) ? JSON.stringify(body.tags) : JSON.stringify([]),
        imageUrl: body.imageUrl || null,
        updatedAt: new Date(),
      },
    });

    console.log('✅ Post updated successfully:', updatedPost.id); // Debug log
    return NextResponse.json(updatedPost);
  } catch (error) {
    console.error('Failed to update post:', error);
    
    if (error.message === 'Unauthorized' || error.message === 'Authentication failed') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'A post with this title already exists' },
        { status: 400 }
      )
    }

    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to update post' },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  console.log('🗑️ DELETE /api/posts/[postId] called with ID:', params.postId); // Debug log
  
  try {
    // Check authentication for admin operations
    console.log('🔐 Checking authentication...'); // Debug log
    await requireAuth(request);
    console.log('✅ Authentication successful'); // Debug log
    
    const { postId } = params;

    // Convert postId to integer
    const postIdInt = parseInt(postId, 10);
    if (isNaN(postIdInt)) {
      console.log('❌ Invalid post ID:', postId); // Debug log
      return NextResponse.json(
        { error: 'Invalid post ID' },
        { status: 400 }
      )
    }

    await prisma.post.delete({
      where: { id: postIdInt },
    });

    console.log('✅ Post deleted successfully:', postId); // Debug log
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete post:', error);
    
    if (error.message === 'Unauthorized' || error.message === 'Authentication failed') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to delete post' },
      { status: 500 }
    );
  }
}
