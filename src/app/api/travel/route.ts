import { NextResponse } from 'next/server'

const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbx56yotCGX9ArKJ9uP9wih-lfysQ1bRu7HipsLGFYv_V6hR71WD83RsoKhq5M1QrPmzCQ/exec'

export async function GET() {
  try {
    const response = await fetch(APPS_SCRIPT_URL + '?t=' + Date.now(), {
      cache: 'no-store'
    })

    if (!response.ok) {
      throw new Error('Failed to fetch from Apps Script')
    }

    const data = await response.json()

    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600'
      }
    })
  } catch (error) {
    console.error('Error fetching travel data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch travel data' },
      { status: 500 }
    )
  }
}
