'use client'
import { MdDataProvider } from '@/providers/md-data-provider'

export default function DashboardLayout({
  children,
  markdown,
  slide,
}: {
  children: React.ReactNode
  markdown: React.ReactNode
  slide: React.ReactNode
}) {
  return (
    <MdDataProvider>
      <div>
        <header>
          <h1>Dashboard Layout</h1>
        </header>
        <main>
          {children}
          {markdown}
          {slide}
        </main>
      </div>
    </MdDataProvider>
  )
}
