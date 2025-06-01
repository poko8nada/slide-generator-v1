import { SignOutBtn } from '@/components/ui/auth-btn'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { handleSignOut } from '@/lib/handle-auth'
import type { Slide } from '@/lib/slide-crud'
import { Menu } from 'lucide-react'
import Form from 'next/form'

export default function DisplaySheet({ slides }: { slides: Slide[] }) {
  return (
    <Sheet>
      <SheetTrigger
        asChild
        className='rounded cursor-pointer hover:ring-2 transition-shadow duration-300 ring-gray-800'
      >
        <Menu />
      </SheetTrigger>
      <SheetContent side='left'>
        <SheetHeader>
          <SheetTitle>スライド一覧</SheetTitle>
          <SheetDescription>Markdownスライドを一覧表示します</SheetDescription>
        </SheetHeader>
        <div className='mt-4'>
          <div className='grid grid-cols-2 gap-x-4 px-4 py-2 font-semibold text-sm text-gray-500 border-b'>
            <span>ファイル名</span>
            <span className='text-right'>最終更新日</span>
          </div>
          <ul>
            {slides.map(slide => (
              <li
                key={slide.id}
                className='flex justify-between px-4 py-2 border-b'
              >
                <span>{slide.title ?? '無題'}</span>
                <span className='text-right'>
                  {slide.updatedAt
                    ? new Date(slide.updatedAt).toLocaleString()
                    : '-'}
                </span>
              </li>
            ))}
          </ul>
        </div>
        <SheetFooter>
          <Form action={handleSignOut} className='w-full text-right'>
            <SignOutBtn />
          </Form>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
