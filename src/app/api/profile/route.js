import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const profile = await prisma.profile.findFirst()
    
    if (!profile) {
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(profile)
  } catch (error) {
    console.error('Error fetching profile:', error)
    return NextResponse.json(
      { error: 'Failed to fetch profile' },
      { status: 500 }
    )
  }
}

export async function PUT(request) {
  try {
    const data = await request.json()
    console.log('Received profile update data:', data)
    
    // Clean up empty strings and convert them to null
    const cleanData = {}
    Object.keys(data).forEach(key => {
      if (data[key] === '') {
        cleanData[key] = null
      } else {
        cleanData[key] = data[key]
      }
    })
    
    console.log('Cleaned profile data:', cleanData)
    
    const profile = await prisma.profile.upsert({
      where: { id: 1 },
      update: cleanData,
      create: { id: 1, ...cleanData },
    })

    console.log('Profile saved successfully:', profile)
    return NextResponse.json(profile)
  } catch (error) {
    console.error('Error updating profile:', error)
    return NextResponse.json(
      { error: 'Failed to update profile', details: error.message },
      { status: 500 }
    )
  }
}
