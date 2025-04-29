import { LoaderCircle } from 'lucide-react'

export default function Loader() {
  return (
    <div className='absolute w-full h-full flex items-center justify-center z-auto bg-neutral-200 opacity-30'>
      <LoaderCircle className='animate-spin' size={64} />
    </div>
  )
}
