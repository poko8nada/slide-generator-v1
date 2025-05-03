import { isAllowedHost } from '@/lib/white-list'
import { type NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get('url')
  if (!url) {
    return new NextResponse('Missing url', { status: 400 })
  }

  // Check if the URL starts with 'blob:' or 'data:'
  if (url.startsWith('blob:') || url.startsWith('data:')) {
    return new NextResponse('Unsupported URL scheme', { status: 400 })
  }

  // Check if the hostname is allowed
  let hostname: string
  try {
    console.log(new URL(url))

    const parsedUrl = new URL(url)
    console.log('Parsed URL:', parsedUrl)

    hostname = parsedUrl.hostname
  } catch {
    return new NextResponse('Invalid URL', { status: 400 })
  }

  if (!isAllowedHost(hostname)) {
    return new NextResponse('Blocked by whitelist', { status: 403 })
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

    console.log('Content-Type:', contentType)

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
