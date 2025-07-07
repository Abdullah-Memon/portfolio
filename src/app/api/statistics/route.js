import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET() {
  try {
    const statistics = await prisma.statistics.findMany({
      where: { active: true },
      orderBy: { order: 'asc' }
    })

    return NextResponse.json({ statistics })
  } catch (error) {
    console.error('Error fetching statistics:', error)
    return NextResponse.json(
      { error: 'Failed to fetch statistics' },
      { status: 500 }
    )
  }
}

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const data = await request.json()
    const { label, value, suffix, icon, order, active } = data

    if (!label || value === undefined) {
      return NextResponse.json(
        { error: 'Label and value are required' },
        { status: 400 }
      )
    }

    const statistic = await prisma.statistics.create({
      data: {
        label,
        value: parseInt(value),
        suffix: suffix || null,
        icon: icon || null,
        order: order || 0,
        active: active !== undefined ? active : true
      }
    })

    return NextResponse.json({ 
      statistic,
      message: 'Statistic created successfully' 
    })
  } catch (error) {
    console.error('Error creating statistic:', error)
    return NextResponse.json(
      { error: 'Failed to create statistic' },
      { status: 500 }
    )
  }
}
