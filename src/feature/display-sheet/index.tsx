import { SignOutBtn } from '@/components/ui/auth-btn'
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetTrigger,
} from '@/components/ui/sheet'
import { handleSignOut } from '@/lib/handle-auth'
import { Menu } from 'lucide-react'
import Form from 'next/form'

export default function DisplaySheet({
  children,
}: { children?: React.ReactNode }) {
  return (
    <Sheet>
      <SheetTrigger
        asChild
        className='rounded cursor-pointer hover:ring-2 transition-shadow duration-300 ring-gray-800'
      >
        <Menu />
      </SheetTrigger>
      <SheetContent side='left'>
        {children}
        <SheetFooter>
          <Form action={handleSignOut} className='w-full text-right'>
            <SignOutBtn />
          </Form>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
