'use client'
import { SignOutBtn } from '@/components/ui/auth-btn'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { type Slide, getSlides } from '@/lib/slide-crud'
import { Menu } from 'lucide-react'
import type { Session } from 'next-auth'
import { useEffect, useState } from 'react'

export default function DisplaySheet({ session }: { session: Session }) {
  const [slides, setSlides] = useState<Slide[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    console.log('[DisplaySheet] session:', session)
    let ignore = false
    getSlides(session)
      .then(data => {
        console.log('[DisplaySheet] getSlides result:', data)
        if (!ignore) setSlides(data)
      })
      .finally(() => {
        if (!ignore) setLoading(false)
      })
    return () => {
      ignore = true
    }
  }, [session])

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
            {loading ? (
              <li>読み込み中...</li>
            ) : slides.length === 0 ? (
              <li>スライドがありません</li>
            ) : (
              slides.map(slide => (
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
              ))
            )}
          </ul>
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <SignOutBtn />
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
