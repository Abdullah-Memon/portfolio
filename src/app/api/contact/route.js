import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { contactSchema } from '@/utils/validators'
import { requireAuth } from '@/lib/auth'

export async function POST(request) {
  try {
    const body = await request.json()
    
    // Validate the request body
    const validatedData = contactSchema.parse(body)
    
    // Save to database
    const message = await prisma.contactMessage.create({
      data: validatedData,
    })

    return NextResponse.json(
      { message: 'Message sent successfully!', id: message.id },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error saving contact message:', error)
    
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Invalid form data', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    )
  }
}

export async function GET(request) {
  try {
    // Check authentication for admin operations
    await requireAuth(request);
    
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const fromDate = searchParams.get('fromDate');
    const toDate = searchParams.get('toDate');
    const skip = (page - 1) * limit;

    // Build where clause for filtering
    const where = {};
    
    if (fromDate || toDate) {
      where.createdAt = {};
      if (fromDate) {
        where.createdAt.gte = new Date(fromDate);
      }
      if (toDate) {
        // Add 1 day to include the entire end date
        const endDate = new Date(toDate);
        endDate.setDate(endDate.getDate() + 1);
        where.createdAt.lt = endDate;
      }
    }

    // Get total count for pagination
    const totalCount = await prisma.contactMessage.count({ where });
    
    // Get paginated messages
    const messages = await prisma.contactMessage.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    });

    return NextResponse.json({
      messages,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
        hasNextPage: page < Math.ceil(totalCount / limit),
        hasPrevPage: page > 1,
      }
    });
  } catch (error) {
    console.error('Error fetching contact messages:', error);
    
    if (error.message === 'Unauthorized' || error.message === 'Authentication failed') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch messages' },
      { status: 500 }
    );
  }
}
