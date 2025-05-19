import { auth } from '@/auth'
import GeneralHeader from '@/components/general-header'
import ControlUserAction from '@/feature/control-user-action'

export default async function Page() {
  const session = await auth()

  return (
    <>
      <GeneralHeader>
        <ControlUserAction session={session} />
      </GeneralHeader>
    </>
  )
}
