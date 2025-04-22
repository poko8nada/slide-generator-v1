'use client'
import MarkdownEditor from '@/components/markdown-editor'
import { useMdData } from '@/providers/md-data-provider'

export default function EditMarkdown() {
  const { mdData, setMdData } = useMdData()

  return (
    <div className='container'>
      <MarkdownEditor mdData={mdData} setMdData={setMdData} />
    </div>
  )
}
