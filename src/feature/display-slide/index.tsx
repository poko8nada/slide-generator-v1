'use client'

import { useMdData } from '@/providers/md-data-provider'
import { useCallback, useEffect, useRef, useState } from 'react'
import 'reveal.js/dist/reveal.css'
import 'reveal.js/dist/theme/black.css'
import DOMPurify from 'dompurify'
import { marked } from 'marked'
import Reveal, { type RevealState } from 'reveal.js'
import { layoutStyleString } from './custom-layout-style'

export default function MarkdownSlides() {
  const { mdData } = useMdData()
  const revealRef = useRef<Reveal.Api | null>(null) // Reveal.jsインスタンスを保持
  const containerRef = useRef<HTMLDivElement | null>(null) // スライドコンテナの参照
  const [currentState, setCurrentState] = useState<RevealState | null>(null) // 現在のスライド状態
  const slidesRef = useRef<HTMLDivElement | null>(null) // .slides要素
  const stateRef = useRef(null) // 現在のスライド状態

  console.log(revealRef.current)

  const getSlides = useCallback((md: string) => {
    // Markdownをスライドに分割
    const slides = md.split('---').map(content => content.trim())

    // 各スライドをHTMLに変換
    return slides.map(content => {
      const html = marked(content, {
        gfm: true, // GitHub Flavored Markdown
        breaks: true, // 改行を<br>に
      })
      // サニタイズ
      return DOMPurify.sanitize(html, {
        ALLOWED_TAGS: [
          'h1',
          'h2',
          'h3',
          'p',
          'img',
          'br',
          'ul',
          'ol',
          'li',
          'a',
          'code',
          'pre',
        ],
        ALLOWED_ATTR: ['src', 'alt', 'href', 'class'],
        ALLOWED_URI_REGEXP: /^(?:(?:https?|blob):|[/#])/i,
      })
    })
  }, [])

  const updateSlides = useCallback(
    (slides: string[]) => {
      if (!slidesRef.current || !revealRef.current) return

      const slidesContainer = slidesRef.current
      const currentSlides = Array.from(slidesContainer.children)

      // 新しいスライドを作成
      const newSlides = slides.map((html, index) => {
        const section = document.createElement('section')
        section.innerHTML = html // 安全なHTMLをセット
        // アクティブスライド以外にhidden属性をセット
        if (index !== currentState?.indexh) {
          section.setAttribute('hidden', '')
        }
        return section
      })

      // 古いスライドを削除
      // biome-ignore lint/complexity/noForEach: <explanation>
      currentSlides.forEach(slide => {
        if (slide.parentNode) {
          slide.parentNode.removeChild(slide)
        }
      })

      // 新しいスライドを追加
      // biome-ignore lint/complexity/noForEach: <explanation>
      newSlides.forEach(slide => slidesContainer.appendChild(slide))

      // Reveal.jsに同期
      requestAnimationFrame(() => {
        if (!revealRef.current) return
        try {
          revealRef.current.sync() // スライド構造を更新
          revealRef.current.layout() // スライド表示を再計算
          if (stateRef.current) {
            revealRef.current.setState(stateRef.current) // スライド位置を復元
          }
        } catch (error) {
          console.error('Reveal.js update error:', error)
        }
      })
    },
    [currentState],
  )

  useEffect(() => {
    if (revealRef.current) return
    if (!containerRef.current) return

    revealRef.current = new Reveal(containerRef.current, {
      embedded: true, // 埋め込みモード
      autoSlide: false, // 自動スライド無効
      transition: 'slide', // トランジション
      autoAnimate: false, // アニメーションによるズレを防止
      disableLayout: false, // レイアウト計算を有効
    })
    // Reveal.jsの初期化
    revealRef.current.initialize()

    // スライド変更時に状態を保存
    revealRef.current.on('slidechanged', () => {
      if (!revealRef.current) return
      setCurrentState(revealRef.current.getState())
    })

    return () => {
      // クリーンアップ
      if (revealRef.current) {
        revealRef.current.destroy()
        revealRef.current = null
      }
    }
  }, [])

  useEffect(() => {
    // Markdown更新時にスライドを更新
    updateSlides(getSlides(mdData))
  }, [mdData, getSlides, updateSlides])

  return (
    <div className='flex flex-col min-h-[500px]'>
      <style>{layoutStyleString}</style>
      <div className='p-4 border-b'>
        <h2 className='font-bold text-xl'>リアルタイム Markdown スライド</h2>
        <p className='text-sm text-gray-600'>
          Markdownが変更されると自動的にスライドが更新されます
        </p>
      </div>

      <div className='flex-1 reveal !cursor-auto' ref={containerRef}>
        <div className='slides' ref={slidesRef} />
      </div>
    </div>
  )
}
