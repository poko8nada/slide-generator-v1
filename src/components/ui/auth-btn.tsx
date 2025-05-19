import { LogIn } from 'lucide-react'
import { useFormStatus } from 'react-dom'
import CustomButton from '../custom-button'

export function SignInBtn() {
  const { pending } = useFormStatus()
  return (
    <CustomButton type='submit' isLoading={pending} icon={<LogIn />}>
      Sign in
    </CustomButton>
  )
}
