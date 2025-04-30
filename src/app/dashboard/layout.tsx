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
      <SlideContainerProvider>
        <div>
          <header>
            <h1>Dashboard Layout</h1>
          </header>
          <div>{children}</div>
          <main className='flex lg:flex-row flex-col gap-1'>
            <div className='p-1 w-full'>{markdown}</div>
            <div className='p-1 w-full'>{slide}</div>
          </main>
        </div>
      </SlideContainerProvider>
    </MdDataProvider>
  )
}
