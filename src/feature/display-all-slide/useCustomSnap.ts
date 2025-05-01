import { useEffect, useState } from 'react'

function formatSnapContent(prev: HTMLDivElement | null): HTMLDivElement | null {
  if (!prev) return null

  if (prev) {
    const slides = prev.querySelector('.slides')
    if (!slides) return prev
    slides.removeAttribute('style')
    slides.removeAttribute('class')
    slides.classList.add('slides')

    const sections = prev.querySelectorAll('section')
    if (!sections) return prev

    const background = (child: string) => {
      return `
      <div class="pdf-page">
      ${child}
      <div class="slide-background present" data-loaded="true" style="display: block;"><div class="slide-background-content"></div></div>
      </div>
      `
    }

    let formattedSections = ''
    for (const section of sections) {
      section.removeAttribute('style')
      section.removeAttribute('hidden')
      formattedSections += background(section.outerHTML)
    }
    slides.innerHTML = formattedSections

    const backgrounds = prev.querySelector('.backgrounds')
    if (!backgrounds) return prev
    backgrounds.innerHTML = ''
  }
  return prev
}

export function useCustomSnap(
  isOpen: boolean,
  containerRef: React.RefObject<HTMLDivElement>,
) {
  const [snap, setSnap] = useState<HTMLDivElement | null>(null)

  // refはuseEffectの依存配列に含めなくてよい
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (!containerRef.current) {
      setSnap(null)
      return
    }
    if (isOpen) {
      setSnap(containerRef.current.cloneNode(true) as HTMLDivElement)
    }
    setSnap(prev => formatSnapContent(prev))
  }, [isOpen])

  return snap
}
