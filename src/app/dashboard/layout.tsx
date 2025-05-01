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
          <div className='mx-auto flex max-w-screen-xl items-center justify-end px-4 sm:px-6 lg:px-8'>
            {children}
          </div>
        </main>
      </SlideContainerProvider>
    </MdDataProvider>
  )
}
