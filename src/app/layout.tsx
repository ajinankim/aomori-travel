import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '아오모리-하코다테-삿포로 여행 일정표',
  description: '5박 6일 북일본 종단 여행 (2026.07.12 ~ 07.17)',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  )
}
