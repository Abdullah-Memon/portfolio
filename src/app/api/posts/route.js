import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'
import { slugify } from '@/utils/helpers'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const published = searchParams.get('published')
    const featured = searchParams.get('featured')
    const search = searchParams.get('search')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const skip = (page - 1) * limit
    
    const where = {}
    if (published !== null) where.published = published === 'true'
    if (featured !== null) where.featured = featured === 'true'
    
    // Add search functionality
    if (search && search.trim()) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } },
        { excerpt: { contains: search, mode: 'insensitive' } },
        { tags: { contains: search, mode: 'insensitive' } }
      ]
    }

    // Get total count for pagination
    const totalPosts = await prisma.post.count({ where })
    
    // Get posts with pagination
    const posts = await prisma.post.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    })

    return NextResponse.json({
      posts,
      pagination: {
        page,
        limit,
        total: totalPosts,
        pages: Math.ceil(totalPosts / limit),
        hasNext: page * limit < totalPosts,
        hasPrev: page > 1
      }
    })
  } catch (error) {
    console.error('Error fetching posts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    )
  }
}

export async function POST(request) {
  console.log('📝 POST /api/posts called'); // Debug log
  
  try {
    // Check authentication for admin operations
    console.log('🔐 Checking authentication...'); // Debug log
    const session = await requireAuth(request);
    console.log('✅ Authentication successful for:', session.user?.email); // Debug log
    
    const data = await request.json()
    console.log('📄 Received post data:', { 
      title: data.title, 
      contentLength: data.content?.length, 
      published: data.published,
      tags: data.tags 
    }); // Debug log
    
    // Validate required fields
    if (!data.title || !data.content) {
      console.log('❌ Validation failed: missing required fields'); // Debug log
      return NextResponse.json(
        { error: 'Title and content are required' },
        { status: 400 }
      )
    }

    // Generate slug from title
    const slug = data.slug || slugify(data.title)
    console.log('🔗 Generated slug:', slug); // Debug log
    
    // Prepare post data
    const postData = {
      title: data.title,
      slug: slug,
      content: data.content,
      excerpt: data.excerpt || '',
      published: Boolean(data.published),
      featured: Boolean(data.featured),
      tags: Array.isArray(data.tags) ? JSON.stringify(data.tags) : JSON.stringify([]),
      imageUrl: data.imageUrl || null,
    }
    
    console.log('💾 Creating post with data:', postData); // Debug log
    
    const post = await prisma.post.create({
      data: postData,
    })

    console.log('✅ Post created successfully with ID:', post.id); // Debug log
    return NextResponse.json(post, { status: 201 })
  } catch (error) {
    console.error('Error creating post:', error)
    
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
    
    return NextResponse.json(
      { error: 'Failed to create post' },
      { status: 500 }
    )
  }
}
