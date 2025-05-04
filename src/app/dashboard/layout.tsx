'use client'
import Divider from '@/components/divider'
import GeneralHeader from '@/components/general-header'
import ControlUserAction from '@/feature/control-user-action'
import { MdDataProvider } from '@/providers/md-data-provider'
import { SlideContainerProvider } from '@/providers/slide-container-provider'
import { SlideSnapProvider } from '@/providers/slide-snap-provider'

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
    <SlideSnapProvider>
      <MdDataProvider>
        <SlideContainerProvider>
          <GeneralHeader>
            <ControlUserAction />
          </GeneralHeader>
          <main>
            <div className='flex lg:flex-row flex-col justify-center items-center gap-1 p-2'>
              {markdown}
              {slide}
            </div>
            <div>
              <Divider title='Preview' className='mt-10 mb-2' />
              <div className='p-2 lg:p-4'>{children}</div>
            </div>
          </main>
        </SlideContainerProvider>
      </MdDataProvider>
    </SlideSnapProvider>
  )
}
