// app/api/image-proxy/route.ts
import { type NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get('url')
  if (!url) {
    return new NextResponse('Missing url', { status: 400 })
  }

  if (url.startsWith('blob:') || url.startsWith('data:')) {
    return new NextResponse('Unsupported URL scheme', { status: 400 })
  }

  try {
    const response = await fetch(url)
    const contentType =
      response.headers.get('content-type') ||
      'image/jpeg' ||
      'image/png' ||
      'image/webp' ||
      'image/svg+xml' ||
      'image/gif' ||
      'image/bmp'
    const buffer = await response.arrayBuffer()

    return new NextResponse(Buffer.from(buffer), {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=86400',
      },
    })
  } catch (_) {
    return new NextResponse('Failed to fetch image', { status: 500 })
  }
}
