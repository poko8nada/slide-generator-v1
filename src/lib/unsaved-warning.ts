import { useRouter } from 'next/navigation'
// 保存警告アラート共通ロジック
import { useEffect } from 'react'

// beforeunloadイベント登録
export function useUnsavedBeforeUnload(isDiff: boolean) {
  useEffect(() => {
    if (!isDiff) return

    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault()
      e.returnValue = ''
    }
    window.addEventListener('beforeunload', handler)
    return () => {
      window.removeEventListener('beforeunload', handler)
    }
  }, [isDiff])
}

// Next.js内部遷移時の警告
export function useUnsavedRouteChange(isDiff: boolean) {
  const router = useRouter()

  useEffect(() => {
    if (!isDiff) return

    const handleRouteChange = (url: string) => {
      if (window.confirm('保存されていない変更があります。移動しますか？')) {
        // OKなら何もしない
      } else {
        // キャンセル時は遷移を止める
        throw 'Route change aborted by user'
      }
    }

    // next/navigationのrouter.eventsは使えないため、history APIを監視
    const pushState = history.pushState
    history.pushState = function (...args) {
      if (
        isDiff &&
        !window.confirm('保存されていない変更があります。移動しますか？')
      ) {
        return
      }
      // @ts-ignore
      return pushState.apply(this, args)
    }

    return () => {
      history.pushState = pushState
    }
  }, [isDiff])
}

// confirm用関数
export function confirmUnsaved(isDiff: boolean): boolean {
  if (!isDiff) return true
  return window.confirm('保存されていない変更があります。続行しますか？')
}
