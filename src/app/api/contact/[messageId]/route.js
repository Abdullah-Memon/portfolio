import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';

export async function PUT(request, { params }) {
  try {
    // Check authentication for admin operations
    await requireAuth(request);
    
    const { messageId } = params;
    const body = await request.json();

    console.log('Updating message:', messageId, 'with data:', body); // Debug log

    const updatedMessage = await prisma.contactMessage.update({
      where: { id: parseInt(messageId) },
      data: {
        read: body.read,
      },
    });

    console.log('Message updated successfully:', updatedMessage); // Debug log
    return NextResponse.json(updatedMessage);
  } catch (error) {
    console.error('Failed to update message:', error);
    
    if (error.message === 'Unauthorized' || error.message === 'Authentication failed') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Message not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to update message' },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    // Check authentication for admin operations
    await requireAuth(request);
    
    const { messageId } = params;

    console.log('Deleting message:', messageId); // Debug log

    await prisma.contactMessage.delete({
      where: { id: parseInt(messageId) },
    });

    console.log('Message deleted successfully'); // Debug log
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete message:', error);
    
    if (error.message === 'Unauthorized' || error.message === 'Authentication failed') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Message not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to delete message' },
      { status: 500 }
    );
  }
}
