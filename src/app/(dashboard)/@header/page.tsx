import { auth } from '@/auth'
import GeneralHeader from '@/components/general-header'
import HeaderLogo from '@/components/header-logo'
import ControlUserAction from '@/feature/control-user-action'
import DisplaySheet from '@/feature/display-sheet'
import DisplaySlideItemOnSheet from '@/feature/display-slideItem-onSheet'
import { type Slide, getSlides } from '@/lib/slide-crud'
import { SheetHeader, SheetTitle } from '@/components/ui/sheet'

export default async function Page() {
  const session = await auth()
  const slides: Slide[] = await getSlides(session)

  return (
    <>
      <GeneralHeader>
        <div className='flex items-center gap-2'>
          {session && (
            <DisplaySheet>
              <SheetHeader>
                <SheetTitle className='sr-only'>スライド一覧</SheetTitle>
              </SheetHeader>
              <DisplaySlideItemOnSheet slides={slides} />
            </DisplaySheet>
          )}
          <HeaderLogo />
        </div>
        <ControlUserAction session={session} />
      </GeneralHeader>
    </>
  )
}
