import { auth } from '@/auth'
import EditMarkdown from '@/feature/edit-markdown'
import { type Slide, getSlides } from '@/lib/slide-crud'

export default async function MarkdownPage() {
  const session = await auth()

  let initialSlide: Slide | null = null
  let slideIds: string[] = []

  if (session) {
    const slides: Slide[] = await getSlides(session)
    initialSlide = slides[0]
    slideIds = slides.map(s => s.id)
  } else {
    initialSlide = null
  }

  return (
    <EditMarkdown
      initialSlide={initialSlide}
      slideIds={slideIds}
      session={session}
    />
  )
}
