import { LoaderCircle } from 'lucide-react'
import { Button } from './ui/button'

export default function CustomButton({
  onClick,
  children,
  isLoading,
}: {
  onClick: () => Promise<void>
  children: React.ReactNode
  isLoading: boolean
}) {
  return (
    <Button onClick={onClick} disabled={isLoading} className='w-[120px]'>
      {isLoading ? <LoaderCircle className='animate-spin' /> : children}
    </Button>
  )
}
