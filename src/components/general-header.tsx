import { Button } from './ui/button'

export default function GeneralHeader() {
  return (
    <header className='bg-white'>
      <div className='mx-auto flex h-18 max-w-screen-xl items-center justify-between gap-8 px-4 sm:px-6 lg:px-8'>
        <a className='flex items-center' href='/'>
          <span className='sr-only'>Home</span>
          <img src='/logo.svg' className='h-11 w-auto' alt='' />
          <span className='text-xs tracking-tighter'>ver 0.5.0</span>
        </a>

        {/* <div className='flex flex-1 items-center justify-end md:justify-between'> */}
        {/* <nav aria-label='Global' className='hidden md:block'>
            <ul className='flex items-center gap-6 text-sm'>
              <li>
                <a
                  className='text-gray-500 transition hover:text-gray-500/75'
                  href='/'
                >
                  About
                </a>
              </li>

              <li>
                <a
                  className='text-gray-500 transition hover:text-gray-500/75'
                  href='/'
                >
                  Careers
                </a>
              </li>

              <li>
                <a
                  className='text-gray-500 transition hover:text-gray-500/75'
                  href='/'
                >
                  History
                </a>
              </li>

              <li>
                <a
                  className='text-gray-500 transition hover:text-gray-500/75'
                  href='/'
                >
                  Services
                </a>
              </li>

              <li>
                <a
                  className='text-gray-500 transition hover:text-gray-500/75'
                  href='/'
                >
                  Projects
                </a>
              </li>

              <li>
                <a
                  className='text-gray-500 transition hover:text-gray-500/75'
                  href='/'
                >
                  Blog
                </a>
              </li>
            </ul>
          </nav> */}

        <div className='flex items-center gap-4'>
          <div className='flex flex-col items-center sm:gap-1'>
            <Button disabled className='line-through'>
              log in
            </Button>
            <span className='text-xs tracking-tight text-muted-foreground'>
              unlock in 1.0.0
            </span>
          </div>
          {/* </div> */}
        </div>
      </div>
    </header>
  )
}
