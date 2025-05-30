import { auth } from '@/auth'
import GeneralHeader from '@/components/general-header'
import HeaderLogo from '@/components/header-logo'
import ControlUserAction from '@/feature/control-user-action'
import DisplaySheet from '@/feature/display-sheet'

export default async function Page() {
  const session = await auth()

  return (
    <>
      <GeneralHeader>
        <div className='flex items-center gap-2'>
          {session && <DisplaySheet session={session} />}
          <HeaderLogo />
        </div>
        <ControlUserAction session={session} />
      </GeneralHeader>
    </>
  )
}
