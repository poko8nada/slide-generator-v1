'use client'

import { useMdData } from '@/providers/md-data-provider'
import { useEffect, useState } from 'react'
import rehypeSanitize from 'rehype-sanitize'
import rehypeStringify from 'rehype-stringify'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import { unified } from 'unified'

export default function DisplaySlide() {
  const { mdData } = useMdData()
  const [htmlContent, setHtmlContent] = useState('')

  // Markdown から HTML への変換を行う非同期関数
  useEffect(() => {
    const convertMarkdown = async () => {
      if (!mdData) {
        setHtmlContent('')
        return
      }

      try {
        const result = await unified()
          .use(remarkParse)
          .use(remarkRehype)
          .use(rehypeSanitize)
          .use(rehypeStringify)
          .process(mdData)

        setHtmlContent(String(result))
      } catch (error) {
        console.error('Markdown変換エラー:', error)
        setHtmlContent('<p>エラーが発生しました</p>')
      }
    }

    convertMarkdown()
  }, [mdData]) // mdDataが変わるたびに実行

  return (
    <div className='p-4 border rounded'>
      <h2 className='text-xl font-bold mb-4'>
        Markdown プレビュー (サニタイズ済み)
      </h2>

      <div className='mb-4'>
        <h3 className='font-medium mb-2'>Markdown ソース:</h3>
        <pre className='bg-gray-100 p-3 rounded overflow-auto max-h-60'>
          {mdData || 'Markdown コンテンツがありません'}
        </pre>
      </div>

      {htmlContent && (
        <div className='mt-4'>
          <h3 className='font-medium mb-2'>HTML 出力 (サニタイズ済み):</h3>
          <div className='border p-3 rounded'>
            {/* biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation> */}
            <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
          </div>

          <h3 className='font-medium mb-2 mt-4'>HTML ソース:</h3>
          <pre className='bg-gray-100 p-3 rounded overflow-auto max-h-60'>
            {htmlContent}
          </pre>
        </div>
      )}
    </div>
  )
}
