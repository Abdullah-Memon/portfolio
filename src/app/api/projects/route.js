import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';
import slugify from 'slugify';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 9;
    const category = searchParams.get('category');
    const featured = searchParams.get('featured');
    const search = searchParams.get('search');
    const published = searchParams.get('published');
    
    const skip = (page - 1) * limit;
    
    // Build where clause
    const where = {};
    
    // Filter by published status (default to true for public, allow 'all' for admin)
    if (published === 'all') {
      // Show all projects (for admin)
    } else {
      where.published = true;
    }
    
    // Category filter
    if (category && category !== 'All') {
      where.category = { contains: category, mode: 'insensitive' };
    }
    
    // Featured filter
    if (featured === 'true') {
      where.featured = true;
    }
    
    // Search filter
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { longDescription: { contains: search, mode: 'insensitive' } },
        { category: { contains: search, mode: 'insensitive' } }
      ];
    }

    // Get total count for pagination
    const totalProjects = await prisma.project.count({ where });
    
    // Get projects with pagination
    const projects = await prisma.project.findMany({
      where,
      orderBy: [
        { featured: 'desc' },
        { createdAt: 'desc' }
      ],
      skip,
      take: limit,
    });

    return NextResponse.json({
      projects,
      pagination: {
        page,
        limit,
        total: totalProjects,
        pages: Math.ceil(totalProjects / limit),
        hasNext: page * limit < totalProjects,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Failed to fetch projects:', error);
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    // Check authentication using the helper
    await requireAuth(request);

    const body = await request.json();
    const { title, description, longDescription, imageUrl, demoUrl, githubUrl, technologies, featured, published } = body;

    // Validate required fields
    if (!title || !description) {
      return NextResponse.json(
        { error: 'Title and description are required' },
        { status: 400 }
      );
    }

    // Generate slug from title
    const slug = slugify(title, { lower: true, strict: true });

    // Create the project
    const project = await prisma.project.create({
      data: {
        title,
        slug,
        description,
        longDescription: longDescription || '',
        imageUrl: imageUrl || '',
        demoUrl: demoUrl || '',
        githubUrl: githubUrl || '',
        technologies: JSON.stringify(technologies || []),
        featured: featured || false,
        published: published !== undefined ? published : true,
      },
    });

    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    console.error('Failed to create project:', error);
    
    if (error.message === 'Unauthorized' || error.message === 'Authentication failed') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'A project with this title already exists' },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to create project' },
      { status: 500 }
    );
  }
}
