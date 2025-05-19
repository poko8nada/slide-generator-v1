'use client'
import CustomButton from '@/components/custom-button'
import { toastError, toastSuccess } from '@/components/custom-toast'
import { SignInBtn } from '@/components/ui/auth-btn'
import { useSlideSnap } from '@/providers/slide-snap-provider'
import { Download } from 'lucide-react'
import type { Session } from 'next-auth'
import Form from 'next/form'
import { useState } from 'react'
import { handleSignIn } from './handleAuthAction'
import { pdfDownload } from './pdfDownload'

export default function ControlUserAction({
  session,
}: {
  session: Session | null
}) {
  const { slideSnap } = useSlideSnap()
  const [isLoading, setIsLoading] = useState(false)

  const handleClick = async () => {
    if (!slideSnap) return
    setIsLoading(true)
    const error = await pdfDownload(slideSnap)
    if (error) {
      toastError(error)
      setIsLoading(false)
      return
    }
    toastSuccess('download success')
    setIsLoading(false)
  }
  return (
    <div className='flex items-start gap-4'>
      <CustomButton
        isLoading={isLoading}
        onClick={handleClick}
        variant={'outline'}
        icon={<Download />}
        disabled={!slideSnap}
      >
        download as PDF
      </CustomButton>
      <div className='flex flex-col items-center sm:gap-1'>
        {session?.user ? (
          <div className='flex items-center gap-2'>
            {session.user.image && (
              <div className='h-8 w-8 overflow-hidden rounded-full'>
                <img
                  src={session.user.image}
                  alt={session.user.name || 'User profile'}
                  className='h-full w-full object-cover'
                />
              </div>
            )}
            <span className='text-sm font-medium'>{session.user.name}</span>
          </div>
        ) : (
          <Form action={handleSignIn}>
            <SignInBtn />
          </Form>
        )}
      </div>
    </div>
  )
}
