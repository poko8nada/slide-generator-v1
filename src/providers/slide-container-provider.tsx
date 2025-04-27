import type React from 'react'
import { type ReactNode, createContext, useContext, useRef } from 'react'

interface SlideContainerContextProps {
  containerRef: React.RefObject<HTMLDivElement | null>
}

const SlideContainerContext = createContext<
  SlideContainerContextProps | undefined
>(undefined)

export const SlideContainerProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const containerRef = useRef<HTMLDivElement>(null)

  return (
    <SlideContainerContext.Provider value={{ containerRef }}>
      {children}
    </SlideContainerContext.Provider>
  )
}

export const useSlideContainer = (): SlideContainerContextProps => {
  const context = useContext(SlideContainerContext)
  if (!context) {
    throw new Error(
      'useSlideContainer must be used within a SlideContainerProvider',
    )
  }
  return context
}
