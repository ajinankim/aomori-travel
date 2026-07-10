'use client'

import { useState, useEffect } from 'react'

interface TravelItem {
  date: string
  time: string
  activity: string
  location: string
  transport: string
  note: string
  map?: string
  alternatives?: string[]
}

const dayColors: Record<string, { bg: string; border: string; text: string }> = {
  '7/12 (일)': { bg: 'bg-rose-50', border: 'border-rose-300', text: 'text-rose-700' },
  '7/13 (월)': { bg: 'bg-amber-50', border: 'border-amber-300', text: 'text-amber-700' },
  '7/14 (화)': { bg: 'bg-sky-50', border: 'border-sky-300', text: 'text-sky-700' },
  '7/15 (수)': { bg: 'bg-emerald-50', border: 'border-emerald-300', text: 'text-emerald-700' },
  '7/16 (목)': { bg: 'bg-violet-50', border: 'border-violet-300', text: 'text-violet-700' },
  '7/17 (금)': { bg: 'bg-pink-50', border: 'border-pink-300', text: 'text-pink-700' },
}

const dayIcons: Record<string, string> = {
  '7/12 (일)': '🛬',
  '7/13 (월)': '🏯',
  '7/14 (화)': '⛴️',
  '7/15 (수)': '🏰',
  '7/16 (목)': '🚄',
  '7/17 (금)': '✈️',
}

const dayThemes: Record<string, string> = {
  '7/12 (일)': '아오모리 진입 & 네푸타·해양 문화',
  '7/13 (월)': '히로사키번의 역사적 유산',
  '7/14 (화)': '쓰가루 해협 횡단 & 하코다테 야경',
  '7/15 (수)': '하코다테 탐방 & 미식',
  '7/16 (목)': '삿포로 이동 & 수프 카레',
  '7/17 (금)': '맥주 박물관 & 귀환',
}

export default function TravelPage() {
  const [selectedDay, setSelectedDay] = useState<string | null>(null)
  const [travelData, setTravelData] = useState<TravelItem[]>([])
  const [loading, setLoading] = useState(true)
  const [dataSource, setDataSource] = useState<string>('서버')

  useEffect(() => {
    async function fetchData() {
      try {
        // 서버 사이드 API에서 데이터 가져오기
        const response = await fetch('/api/travel')
        if (!response.ok) throw new Error('API fetch failed')
        const data = await response.json()
        setTravelData(data)
        setDataSource('구글 시트 (서버 연동)')
      } catch (err) {
        // API 실패 시 로컬 데이터 사용
        console.warn('API fetch failed, using local data')
        const localData = await import('@/data/travel.json')
        setTravelData(localData.default as TravelItem[])
        setDataSource('로컬 데이터')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const days = [...new Set(travelData.map((item: TravelItem) => item.date))]
  const filteredData = selectedDay
    ? travelData.filter((item: TravelItem) => item.date === selectedDay)
    : travelData

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-800 mx-auto mb-4"></div>
          <p className="text-slate-600">여행 일정 로딩 중...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🗾</span>
            <div>
              <h1 className="text-2xl font-bold text-slate-800">
                아오모리 → 하코다테 → 삿포로
              </h1>
              <p className="text-sm text-slate-500">5박 6일 북일본 종단 여행 (2026.07.12 ~ 07.17)</p>
            </div>
          </div>
        </div>
      </header>

      {/* Data Source Badge */}
      <div className="max-w-6xl mx-auto px-4 pt-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-50 text-green-700 text-xs font-medium rounded-full border border-green-200">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
          📊 {dataSource}
        </div>
      </div>

      {/* Day Filter */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedDay(null)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              selectedDay === null
                ? 'bg-slate-800 text-white shadow-lg'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            전체 일정
          </button>
          {days.map((day) => (
            <button
              key={day}
              onClick={() => setSelectedDay(day === selectedDay ? null : day)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                selectedDay === day
                  ? 'bg-slate-800 text-white shadow-lg'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {dayIcons[day]} {day}
            </button>
          ))}
        </div>
      </div>

      {/* Timeline */}
      <div className="max-w-6xl mx-auto px-4 pb-12">
        <div className="space-y-6">
          {days.map((day) => {
            const dayItems = filteredData.filter((item: TravelItem) => item.date === day)
            if (selectedDay && selectedDay !== day) return null
            if (dayItems.length === 0) return null

            const colors = dayColors[day] || { bg: 'bg-slate-50', border: 'border-slate-300', text: 'text-slate-700' }

            return (
              <div key={day} className={`${colors.bg} rounded-2xl border ${colors.border} overflow-hidden shadow-sm`}>
                {/* Day Header */}
                <div className="px-6 py-4 border-b border-inherit">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{dayIcons[day]}</span>
                    <div>
                      <h2 className={`text-xl font-bold ${colors.text}`}>{day}</h2>
                      <p className="text-sm text-slate-500">{dayThemes[day]}</p>
                    </div>
                  </div>
                </div>

                {/* Items */}
                <div className="divide-y divide-slate-100">
                  {dayItems.map((item: TravelItem, idx: number) => (
                    <div key={idx} className="px-6 py-4 hover:bg-white/50 transition-colors">
                      <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                        {/* Time */}
                        <div className="w-28 flex-shrink-0">
                          <span className="text-sm font-mono font-semibold text-slate-600 bg-slate-100 px-2 py-1 rounded">
                            {item.time}
                          </span>
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-slate-800 text-lg">{item.activity}</h3>
                          <p className="text-sm text-slate-500 mt-0.5">📍 {item.location}</p>
                        </div>

                        {/* Transport & Note */}
                        <div className="flex flex-col md:items-end gap-1 md:text-right">
                          {item.transport && (
                            <span className="text-sm text-blue-600 font-medium">🚃 {item.transport}</span>
                          )}
                          {item.note && (
                            <span className="text-xs text-slate-400 max-w-xs">{item.note}</span>
                          )}
                          {item.alternatives && item.alternatives.length > 0 && (
                            <div className="mt-1">
                              {item.alternatives.map((alt, i) => (
                                <span key={i} className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-50 text-amber-700 text-xs rounded-full border border-amber-200">
                                  🔄 대안: {alt}
                                </span>
                              ))}
                            </div>
                          )}
                          {item.map && (
                            <a
                              href={item.map}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 text-sm font-medium rounded-lg border border-emerald-200 hover:bg-emerald-100 hover:border-emerald-300 transition-all"
                            >
                              🗺️ 지도
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>

        {/* Summary Card */}
        <div className="mt-8 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-4">💰 주요 교통비 요약</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div className="flex justify-between p-3 bg-slate-50 rounded-lg">
              <span className="text-slate-600">아오모리 공항 → 아오모리역</span>
              <span className="font-semibold">750엔</span>
            </div>
            <div className="flex justify-between p-3 bg-slate-50 rounded-lg">
              <span className="text-slate-600">아오모리 → 히로사키 (왕복)</span>
              <span className="font-semibold">1,200~1,700엔</span>
            </div>
            <div className="flex justify-between p-3 bg-slate-50 rounded-lg">
              <span className="text-slate-600">신아오모리 → 신하코다테호쿠토</span>
              <span className="font-semibold">7,260엔</span>
            </div>
            <div className="flex justify-between p-3 bg-slate-50 rounded-lg">
              <span className="text-slate-600">하코다테 → 삿포로</span>
              <span className="font-semibold">9,770엔</span>
            </div>
            <div className="flex justify-between p-3 bg-slate-50 rounded-lg">
              <span className="text-slate-600">삿포로 → 신치토세 공항</span>
              <span className="font-semibold">1,150엔</span>
            </div>
            <div className="flex justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
              <span className="text-blue-700 font-semibold">총 합계 (약)</span>
              <span className="font-bold text-blue-700">약 20,000~21,000엔</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center text-xs text-slate-400">
          <p>📍 구글 시트 기반 | 2026년 7월 여행 계획</p>
          <p className="mt-1">
            <a
              href="https://docs.google.com/spreadsheets/d/10D6BHT4KAOUYCm9uZm9iRPWNbRhiIdEIdQ4C9QrFC4Y/edit"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              📊 원본 구글 시트 보기 →
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
