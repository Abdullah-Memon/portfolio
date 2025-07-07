import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

export async function GET(request, { params }) {
  try {
    const { testimonialId } = params;

    const testimonial = await prisma.testimonial.findUnique({
      where: { id: parseInt(testimonialId) },
    });

    if (!testimonial) {
      return NextResponse.json(
        { error: 'Testimonial not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(testimonial);
  } catch (error) {
    console.error('Error fetching testimonial:', error);
    return NextResponse.json(
      { error: 'Failed to fetch testimonial' },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    // Check if user is authenticated and is admin
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { testimonialId } = params;
    const body = await request.json();
    const {
      clientName,
      clientTitle,
      company,
      feedback,
      avatarUrl,
      rating,
      featured,
      published
    } = body;

    // Validate required fields
    if (!clientName || !clientTitle || !feedback) {
      return NextResponse.json(
        { error: 'Client name, title, and feedback are required' },
        { status: 400 }
      );
    }

    // Validate rating
    if (rating && (rating < 1 || rating > 5)) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      );
    }

    const testimonial = await prisma.testimonial.update({
      where: { id: parseInt(testimonialId) },
      data: {
        clientName,
        clientTitle,
        company: company || null,
        feedback,
        avatarUrl: avatarUrl || null,
        rating: rating || 5,
        featured: featured || false,
        published: published !== false,
      },
    });

    // Revalidate the page
    await fetch(`${process.env.NEXTAUTH_URL}/api/revalidate?path=/`, {
      method: 'POST',
    });

    return NextResponse.json(testimonial);
  } catch (error) {
    console.error('Error updating testimonial:', error);
    
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'A testimonial from this client and company already exists' },
        { status: 409 }
      );
    }
    
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Testimonial not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to update testimonial' },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    // Check if user is authenticated and is admin
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { testimonialId } = params;

    await prisma.testimonial.delete({
      where: { id: parseInt(testimonialId) },
    });

    // Revalidate the page
    await fetch(`${process.env.NEXTAUTH_URL}/api/revalidate?path=/`, {
      method: 'POST',
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting testimonial:', error);
    
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Testimonial not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to delete testimonial' },
      { status: 500 }
    );
  }
}
