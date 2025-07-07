import { NextResponse } from 'next/server'
import { revalidatePath, revalidateTag } from 'next/cache'

export async function POST(request) {
  try {
    const { searchParams } = new URL(request.url)
    const path = searchParams.get('path')
    const tag = searchParams.get('tag')

    if (!path && !tag) {
      return NextResponse.json(
        { error: 'Path or tag parameter is required' },
        { status: 400 }
      )
    }

    if (path) {
      // Revalidate the specified path
      revalidatePath(path)
      console.log(`Revalidated path: ${path}`)
    }

    if (tag) {
      // Revalidate by tag
      revalidateTag(tag)
      console.log(`Revalidated tag: ${tag}`)
    }
    
    return NextResponse.json({ 
      message: `Revalidation successful`,
      revalidated: true,
      path: path || null,
      tag: tag || null
    })
  } catch (error) {
    console.error('Error revalidating:', error)
    return NextResponse.json(
      { error: 'Failed to revalidate' },
      { status: 500 }
    )
  }
}
