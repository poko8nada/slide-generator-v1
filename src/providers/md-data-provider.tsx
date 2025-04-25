import type React from 'react'
import { type ReactNode, createContext, useContext, useState } from 'react'

const initialMdData = `
# Slide 1
\`\`\`js [1-2|3|4]
    let a = 1;
    let b = 2;
    let c = x => 1 + 2 + x;
    c(3);
\`\`\`
---
# Slide 2
`

// Create the context
const MdDataContext = createContext<
  | {
      mdData: string
      setMdData: React.Dispatch<React.SetStateAction<string>>
      activeSlideIndex: number
      setActiveSlideIndex: React.Dispatch<React.SetStateAction<number>>
    }
  | undefined
>(undefined)

// Provider component
export const MdDataProvider = ({ children }: { children: ReactNode }) => {
  const [mdData, setMdData] = useState<string>(initialMdData)
  const [activeSlideIndex, setActiveSlideIndex] = useState(0) // 編集中のスライド

  return (
    <MdDataContext.Provider
      value={{ mdData, setMdData, activeSlideIndex, setActiveSlideIndex }}
    >
      {children}
    </MdDataContext.Provider>
  )
}

// Custom hook to use the context
export const useMdData = () => {
  const context = useContext(MdDataContext)
  if (!context) {
    throw new Error('useMdData must be used within an MdDataProvider')
  }
  return context
}
