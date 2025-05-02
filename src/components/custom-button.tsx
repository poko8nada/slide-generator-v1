import { LoaderCircle } from 'lucide-react'
import { Button } from './ui/button'

export default function CustomButton({
  onClick,
  children,
  isLoading,
  variant,
  icon,
}: {
  onClick: () => Promise<void>
  children: React.ReactNode
  isLoading: boolean
  variant?:
    | 'default'
    | 'link'
    | 'destructive'
    | 'outline'
    | 'secondary'
    | 'ghost'
    | null
    | undefined
  icon?: React.ReactNode
}) {
  return (
    <Button onClick={onClick} disabled={isLoading} variant={variant}>
      {isLoading ? <LoaderCircle className='animate-spin' /> : icon}
      {children}
    </Button>
  )
}
