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
import { Menu } from 'lucide-react'

const files = [
  { name: 'todos.md', updated: '2025/05/27' },
  { name: 'requirements.md', updated: '2025/05/20' },
]

export default function DisplaySheet() {
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
          <SheetTitle>Edit profile</SheetTitle>
          <SheetDescription>
            Make changes to your profile here. Click save when you're done.
          </SheetDescription>
        </SheetHeader>
        <div className='mt-4'>
          <div className='grid grid-cols-2 gap-x-4 px-4 py-2 font-semibold text-sm text-gray-500 border-b'>
            <span>ファイル名</span>
            <span className='text-right'>最終更新日</span>
          </div>
          <ul>
            {files.map(f => (
              <li
                key={f.name}
                className='grid grid-cols-2 gap-x-4 px-4 py-2 border-b last:border-b-0 items-center'
              >
                <span className='truncate'>{f.name}</span>
                <span className='text-right text-sm text-gray-400'>
                  {f.updated}
                </span>
              </li>
            ))}
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
