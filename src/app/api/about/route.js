import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Check if database connection is available
    await prisma.$connect()
    
    const [profile, education, experience, skills, achievements, statistics] = await Promise.all([
      prisma.profile.findFirst(),
      prisma.education.findMany({ orderBy: { startDate: 'desc' } }),
      prisma.experience.findMany({ orderBy: { startDate: 'desc' } }),
      prisma.skill.findMany({ orderBy: { category: 'asc' } }),
      prisma.achievement.findMany({ orderBy: { date: 'desc' } }),
      prisma.statistics.findMany({ 
        where: { active: true },
        orderBy: { order: 'asc' } 
      }),
    ])

    return NextResponse.json({ 
      profile, 
      education, 
      experience, 
      skills, 
      achievements,
      statistics 
    })
  } catch (error) {
    console.error('Error fetching about data:', error)
    
    // Return default empty data if database is not available
    return NextResponse.json({ 
      profile: null, 
      education: [], 
      experience: [], 
      skills: [], 
      achievements: [],
      statistics: []
    })
  } finally {
    await prisma.$disconnect()
  }
}
