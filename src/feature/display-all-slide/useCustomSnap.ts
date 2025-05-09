import { useEffect, useState } from 'react'

const setSlideWrapper = (slides: HTMLElement[]) => {
  const newSlides = slides.map((slide, index) => {
    const div = document.createElement('div')
    div.classList.add('pdf-page')
    div.style.background = 'var(--r-background-color)'
    const section = document.createElement('section')
    section.classList.add(`section_${index}`)

    section.innerHTML = slide.innerHTML
    div.appendChild(section)
    return div
  })
  return newSlides
}

export function useCustomSnap(
  mdData: string,
  revealRef: React.RefObject<Reveal.Api | null>,
  setSlideSnap: React.Dispatch<HTMLElement[] | null>,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
) {
  const [snapMdData, setSnapMdData] = useState('')

  // refはuseEffectの依存配列に含めなくてよい
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (!revealRef.current && mdData === snapMdData) return

    const timer = setTimeout(() => {
      const slides = revealRef.current?.getSlides()
      if (!slides) return

      const newSlides = setSlideWrapper(slides)

      setSlideSnap(newSlides)
      setSnapMdData(mdData)
      setIsLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [mdData, setSlideSnap, snapMdData])
}
