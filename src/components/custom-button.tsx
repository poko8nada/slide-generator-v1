import { LoaderCircle } from 'lucide-react'
import { Button } from './ui/button'

export default function CustomButton({
  onClick,
  children,
  isLoading,
  variant = 'default',
  icon = null,
  disabled = false,
  type = 'button',
}: {
  onClick?: () => Promise<void>
  children: React.ReactNode
  isLoading?: boolean
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
  disabled?: boolean
  type?: 'submit' | 'reset' | 'button'
}) {
  return (
    <Button
      onClick={onClick}
      disabled={isLoading || disabled}
      variant={variant}
      type={type}
    >
      {isLoading ? <LoaderCircle className='animate-spin' /> : icon}
      {children}
    </Button>
  )
}
