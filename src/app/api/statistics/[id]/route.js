import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function PUT(request, { params }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const id = parseInt(params.id)
    const data = await request.json()
    const { label, value, suffix, icon, order, active } = data

    if (!label || value === undefined) {
      return NextResponse.json(
        { error: 'Label and value are required' },
        { status: 400 }
      )
    }

    const statistic = await prisma.statistics.update({
      where: { id },
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
      message: 'Statistic updated successfully' 
    })
  } catch (error) {
    console.error('Error updating statistic:', error)
    return NextResponse.json(
      { error: 'Failed to update statistic' },
      { status: 500 }
    )
  }
}

export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const id = parseInt(params.id)

    await prisma.statistics.delete({
      where: { id }
    })

    return NextResponse.json({ 
      message: 'Statistic deleted successfully' 
    })
  } catch (error) {
    console.error('Error deleting statistic:', error)
    return NextResponse.json(
      { error: 'Failed to delete statistic' },
      { status: 500 }
    )
  }
}
