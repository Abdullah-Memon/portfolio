import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';
import slugify from 'slugify';

export async function GET(request, { params }) {
  try {
    const { id } = params;
    
    const project = await prisma.project.findUnique({
      where: { id: parseInt(id) },
    });

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    return NextResponse.json(project);
  } catch (error) {
    console.error('Failed to fetch project:', error);
    return NextResponse.json(
      { error: 'Failed to fetch project' },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    // Check authentication using the helper
    await requireAuth(request);

    const { id } = params;
    const body = await request.json();
    const { title, description, longDescription, imageUrl, demoUrl, githubUrl, technologies, featured, published } = body;

    // Validate required fields
    if (!title || !description) {
      return NextResponse.json(
        { error: 'Title and description are required' },
        { status: 400 }
      );
    }

    // Generate new slug if title changed
    const slug = slugify(title, { lower: true, strict: true });

    const project = await prisma.project.update({
      where: { id: parseInt(id) },
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

    return NextResponse.json(project);
  } catch (error) {
    console.error('Failed to update project:', error);
    
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
    if (error.code === 'P2025') {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }
    return NextResponse.json(
      { error: 'Failed to update project' },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    // Check authentication using the helper
    await requireAuth(request);

    const { id } = params;

    await prisma.project.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Failed to delete project:', error);
    
    if (error.message === 'Unauthorized' || error.message === 'Authentication failed') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    if (error.code === 'P2025') {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }
    return NextResponse.json(
      { error: 'Failed to delete project' },
      { status: 500 }
    );
  }
}
