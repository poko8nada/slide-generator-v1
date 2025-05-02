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
        <main>
          <div className='flex lg:flex-row flex-col justify-center items-center gap-1 p-2'>
            {markdown}
            {slide}
          </div>
          <div className='p-2 lg:p-4'>{children}</div>
        </main>
      </SlideContainerProvider>
    </MdDataProvider>
  )
}
