import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const published = searchParams.get('published');
    const featured = searchParams.get('featured');
    const limit = searchParams.get('limit');
    const page = searchParams.get('page') ? parseInt(searchParams.get('page')) : null;
    const itemsPerPage = parseInt(limit) || (limit ? parseInt(limit) : null);
    
    const where = {};
    
    // Filter by published status (default to true for public API, unless explicitly requesting all)
    if (published === 'all') {
      // Admin view - show all testimonials
    } else if (published !== null) {
      where.published = published === 'true';
    } else {
      where.published = true; // Default to published only
    }
    
    // Filter by featured status
    if (featured === 'true') {
      where.featured = true;
    }

    const queryOptions = {
      where,
      orderBy: [
        { featured: 'desc' }, // Featured testimonials first
        { createdAt: 'desc' }
      ],
    };

    // Add pagination if page parameter is explicitly provided
    if (page !== null && itemsPerPage) {
      const actualPage = page || 1;
      const skip = (actualPage - 1) * itemsPerPage;
      queryOptions.skip = skip;
      queryOptions.take = itemsPerPage;
      
      // Get total count for pagination
      const totalTestimonials = await prisma.testimonial.count({ where });
      const testimonials = await prisma.testimonial.findMany(queryOptions);

      return NextResponse.json({
        testimonials,
        pagination: {
          page: actualPage,
          limit: itemsPerPage,
          total: totalTestimonials,
          pages: Math.ceil(totalTestimonials / itemsPerPage),
          hasNext: actualPage * itemsPerPage < totalTestimonials,
          hasPrev: actualPage > 1
        }
      });
    } else {
      // Add limit if specified (for non-paginated requests)
      if (itemsPerPage) {
        queryOptions.take = itemsPerPage;
      }

      const testimonials = await prisma.testimonial.findMany(queryOptions);
      return NextResponse.json(testimonials);
    }
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    return NextResponse.json(
      { error: 'Failed to fetch testimonials' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    // Check if user is authenticated and is admin
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

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

    const testimonial = await prisma.testimonial.create({
      data: {
        clientName,
        clientTitle,
        company: company || null,
        feedback,
        avatarUrl: avatarUrl || null,
        rating: rating || 5,
        featured: featured || false,
        published: published !== false, // Default to true
      },
    });

    // Revalidate the page
    await fetch(`${process.env.NEXTAUTH_URL}/api/revalidate?path=/`, {
      method: 'POST',
    });

    return NextResponse.json(testimonial, { status: 201 });
  } catch (error) {
    console.error('Error creating testimonial:', error);
    
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'A testimonial from this client and company already exists' },
        { status: 409 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to create testimonial' },
      { status: 500 }
    );
  }
}
