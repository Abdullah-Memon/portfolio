import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

export async function GET() {
  try {
    // Get settings (create default if not exists)
    let settings = await prisma.settings.findFirst();
    
    if (!settings) {
      settings = await prisma.settings.create({
        data: {
          primaryColor: 'teal',
          sessionDuration: 3600, // 1 hour default
        }
      });
    }

    // Convert seconds to hours for the frontend
    const settingsForUI = {
      ...settings,
      sessionDuration: Math.floor(settings.sessionDuration / 3600)
    };

    return NextResponse.json(settingsForUI);
  } catch (error) {
    console.error('Failed to fetch settings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch settings' },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    // Check authentication using the helper
    await requireAuth(request);

    const body = await request.json();
    const { primaryColor, sessionDuration } = body;

    // Validate primaryColor
    const validColors = ['teal', 'blue', 'green', 'purple', 'pink', 'orange', 'red', 'indigo'];
    if (primaryColor && !validColors.includes(primaryColor)) {
      return NextResponse.json(
        { error: 'Invalid primary color' },
        { status: 400 }
      );
    }

    // Validate sessionDuration (1-12 hours)
    if (sessionDuration && (sessionDuration < 1 || sessionDuration > 12)) {
      return NextResponse.json(
        { error: 'Session duration must be between 1 and 12 hours' },
        { status: 400 }
      );
    }

    // Convert hours to seconds for database storage
    const sessionDurationInSeconds = sessionDuration ? sessionDuration * 3600 : undefined;

    // Get existing settings or create new
    let settings = await prisma.settings.findFirst();
    
    if (settings) {
      // Update existing settings
      settings = await prisma.settings.update({
        where: { id: settings.id },
        data: {
          primaryColor: primaryColor || settings.primaryColor,
          sessionDuration: sessionDurationInSeconds !== undefined ? sessionDurationInSeconds : settings.sessionDuration,
        }
      });
    } else {
      // Create new settings
      settings = await prisma.settings.create({
        data: {
          primaryColor: primaryColor || 'teal',
          sessionDuration: sessionDurationInSeconds || 3600,
        }
      });
    }

    // Convert back to hours for response
    const settingsForUI = {
      ...settings,
      sessionDuration: Math.floor(settings.sessionDuration / 3600)
    };

    return NextResponse.json(settingsForUI);
  } catch (error) {
    console.error('Failed to update settings:', error);
    
    if (error.message === 'Unauthorized' || error.message === 'Authentication failed') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to update settings' },
      { status: 500 }
    );
  }
}
