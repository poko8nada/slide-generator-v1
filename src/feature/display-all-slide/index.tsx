'use client'
import Loader from '@/components/loader'
import { useMdData } from '@/providers/md-data-provider'
import { useSlide } from '@/providers/slide-container-provider'
import parse from 'html-react-parser'
import { useState } from 'react'
import { useCustomSnap } from './useCustomSnap'

export default function DisplayAllSlide() {
  const { containerRef } = useSlide()
  const { mdData } = useMdData()
  const [snap, setSnap] = useState<HTMLDivElement | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useCustomSnap(mdData, containerRef, setSnap, setIsLoading)

  return (
    <>
      <div className='relative reveal-print min-h-[200px] max-w-[640px] lg:max-w-[1300px] w-full mx-auto'>
        {isLoading && <Loader />}
        {snap && parse(snap.outerHTML)}
      </div>
    </>
  )
}
