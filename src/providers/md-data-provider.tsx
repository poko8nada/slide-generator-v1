'use client'
import type { Slide } from '@/lib/slide-crud'
import type React from 'react'
import {
  type ReactNode,
  createContext,
  useCallback,
  useContext,
  useState,
} from 'react'
import {
  useUnsavedBeforeUnload,
  useUnsavedRouteChange,
} from '@/lib/unsaved-warning'

const today = new Date()
const initialMdData: Slide = {
  id: 'example_0001',
  userId: '',
  title: '📚マークダウンで簡単スライド作成',
  body: '',
  createdAt: today,
  updatedAt: today,
}

// コンテキスト定義
const MdDataContext = createContext<
  | {
      mdData: Slide
      updateMdData: (data: Slide) => void
      updateMdBody: (body: string) => void
      activeSlideIndex: number
      setActiveSlideIndex: React.Dispatch<React.SetStateAction<number>>
      isDiff: boolean
      setIsDiff: React.Dispatch<React.SetStateAction<boolean>>
      slideIds: string[]
      setSlideIds: React.Dispatch<React.SetStateAction<string[]>>
      slideIndex: number
      setSlideIndex: React.Dispatch<React.SetStateAction<number>>
    }
  | undefined
>(undefined)

// Provider component
export const MdDataProvider = ({
  children,
  isLoggedIn,
}: {
  children: ReactNode
  isLoggedIn: boolean
}) => {
  const [mdData, setMdData] = useState<Slide>(initialMdData)
  const [activeSlideIndex, setActiveSlideIndex] = useState(0)
  const [isDiff, setIsDiff] = useState(false)
  const [slideIds, setSlideIds] = useState<string[]>([])
  const [slideIndex, setSlideIndex] = useState(0)

  useUnsavedBeforeUnload(isDiff, isLoggedIn)
  useUnsavedRouteChange(isDiff, isLoggedIn)

  const updateMdData = (data: Slide) => {
    setMdData(data)
  }
  const updateMdBody = useCallback((body: string) => {
    setMdData((prev: Slide) => ({ ...prev, body }))
  }, [])

  return (
    <MdDataContext.Provider
      value={{
        mdData,
        updateMdData,
        updateMdBody,
        activeSlideIndex,
        setActiveSlideIndex,
        isDiff,
        setIsDiff,
        slideIds,
        setSlideIds,
        slideIndex,
        setSlideIndex,
      }}
    >
      {children}
    </MdDataContext.Provider>
  )
}

// カスタムフック
export const useMdData = () => {
  const context = useContext(MdDataContext)
  if (!context) {
    throw new Error('useMdData must be used within an MdDataProvider')
  }
  return context
}
