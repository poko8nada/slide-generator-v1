'use client'
import MarkdownEditor from '@/components/markdown-editor'
import { useMdData } from '@/providers/md-data-provider'
import { useMemo } from 'react'
import type { SimpleMDEReactProps } from 'react-simplemde-editor'
import { clearAction, imageUploadFunction } from './markdownAction'

export default function EditMarkdown() {
  const { mdData, setMdData } = useMdData()

  const options: SimpleMDEReactProps['options'] = useMemo(
    () => ({
      spellChecker: false,
      placeholder: 'Type here...',
      toolbar: [
        'bold',
        'italic',
        'heading',
        '|',
        'unordered-list',
        'ordered-list',
        'link',
        'image',
        'table',
        'horizontal-rule',
        '|',
        {
          name: 'clear',
          action: (editor: EasyMDE) => {
            clearAction(editor)
            setMdData('') // Clear the state
          },
          className: 'fa fa-trash',
          title: 'Clear',
        },
        {
          name: 'image-upload',
          action: (editor: EasyMDE) => {
            const input = document.createElement('input')
            input.type = 'file'
            input.accept = 'image/*'
            input.onchange = async event => {
              const file = (event.target as HTMLInputElement).files?.[0]
              if (file) {
                try {
                  const imageMd = imageUploadFunction(file)
                  const currentValue = editor.value()
                  editor.value(`${currentValue}\n${imageMd}`)
                  setMdData(`${currentValue}\n${imageMd}`)
                } catch (error) {
                  console.error('Image upload failed:', error)
                }
              }
            }
            input.click()
          },
          className: 'fa fa-upload',
          title: 'Upload Image',
        },
      ],
    }),
    [setMdData],
  )

  return (
    <div className='container'>
      <MarkdownEditor mdData={mdData} setMdData={setMdData} options={options} />
    </div>
  )
}
