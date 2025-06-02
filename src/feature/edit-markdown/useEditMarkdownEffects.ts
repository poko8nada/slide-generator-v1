import type { Slide } from '@/lib/slide-crud'
import { useEffect, useState } from 'react'

// 初期化・スライド切替時の状態同期
export function useInitMarkdownEffect(
  initialSlide: Slide | null,
  initialMarketingBody: string,
  updateMdBody: (body: string) => void,
  updateMdData: (data: Slide) => void,
) {
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (!initialSlide) {
      updateMdBody(initialMarketingBody)
    }
    if (initialSlide) {
      updateMdData(initialSlide)
    }
  }, [initialSlide, initialMarketingBody])
}

// 差分検知・isDiff管理
export function useDiffMarkdownEffect(
  mdData: { id: string; body: string },
  initialMarketingBody: string,
) {
  const [prevData, setPrevData] = useState({
    id: '',
    body: '',
  })
  const [isDiff, setIsDiff] = useState(false)

  useEffect(() => {
    // 初期化時
    if (prevData.id === '') {
      setPrevData({
        id: mdData.id,
        body: initialMarketingBody,
      })
      return
    }
    // スライドが切り替わった場合、diffをfalseにする
    if (mdData.id !== prevData.id) {
      setIsDiff(false)
      // 切り替わったスライドのbodyを保存
      setPrevData({
        id: mdData.id,
        body: mdData.body,
      })
      return
    }
    const timer = setTimeout(() => {
      if (mdData.body !== prevData.body && prevData.body !== '') {
        setIsDiff(true)
        return
      }
      setIsDiff(false)
    }, 700)

    return () => {
      clearTimeout(timer)
    }
  }, [mdData, prevData, initialMarketingBody])

  return { isDiff }
}
