'use client'
import { MdDataProvider } from '@/providers/md-data-provider'
import { SlideContainerProvider } from '@/providers/slide-container-provider'

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
          {markdown}
          <SlideContainerProvider>
            {slide}
            {children}
          </SlideContainerProvider>
        </main>
      </div>
    </MdDataProvider>
  )
}
