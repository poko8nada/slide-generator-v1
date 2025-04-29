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
          <main className='flex lg:flex-row flex-col'>
            <div className='w-full max-w-[600px]'>{markdown}</div>
            <div className='max-w-[600px] w-full'>{slide}</div>
          </main>
        </div>
      </SlideContainerProvider>
    </MdDataProvider>
  )
}
