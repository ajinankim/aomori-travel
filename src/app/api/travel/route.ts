import { NextResponse } from 'next/server'

const SPREADSHEET_ID = '10D6BHT4KAOUYCm9uZm9iRPWNbRhiIdEIdQ4C9QrFC4Y'
const SHEET_NAME = '시트1'

// Google Sheets API를 사용한 서버 사이드 데이터 fetching
// 시트가 비공개이므로 서비스 계정이나 API 키가 필요하지만,
// 일단 시트를 anyoneWithLink으로 잠시 열어서 테스트

export async function GET() {
  try {
    // CSV export URL 사용 (시트가 비공개이므로 실패할 수 있음)
    const csvUrl = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/export?format=csv&gid=0`
    
    const response = await fetch(csvUrl, {
      next: { revalidate: 300 } // 5분마다 재검증
    })
    
    if (!response.ok) {
      throw new Error('Failed to fetch from Google Sheets')
    }
    
    const csv = await response.text()
    
    // CSV를 JSON으로 변환
    const lines = csv.split('\n')
    const items = []
    
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim()
      if (!line) continue
      
      const parts: string[] = []
      let current = ''
      let inQuotes = false
      
      for (let j = 0; j < line.length; j++) {
        const char = line[j]
        if (char === '"') {
          inQuotes = !inQuotes
        } else if (char === ',' && !inQuotes) {
          parts.push(current.trim())
          current = ''
        } else {
          current += char
        }
      }
      parts.push(current.trim())
      
      if (!parts[0]) continue
      
      items.push({
        date: parts[0] || '',
        time: parts[1] || '',
        activity: parts[2] || '',
        location: parts[3] || '',
        transport: parts[4] || '',
        note: parts[5] || '',
      })
    }
    
    return NextResponse.json(items, {
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
