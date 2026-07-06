import { NextResponse } from 'next/server'

const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwrqIzGkMA50ArXfsKrz-EJqwWTO8MmzZ2v5oXNGla2SacdczT8aEDzWiew5k1-lkP3Og/exec'

export async function GET() {
  try {
    const response = await fetch(APPS_SCRIPT_URL, {
      next: { revalidate: 300 }
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
