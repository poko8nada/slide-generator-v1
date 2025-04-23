'use client'
import MarkdownEditor from '@/components/markdown-editor'
import { useMdData } from '@/providers/md-data-provider'
import { useMemo } from 'react'
import type { SimpleMDEReactProps } from 'react-simplemde-editor'
import {
  clearAction,
  imageUploadAction,
  imageUploadFunction,
} from './markdownAction'

export default function EditMarkdown() {
  const { mdData, setMdData } = useMdData()

  const options: SimpleMDEReactProps['options'] = useMemo(
    () => ({
      spellChecker: false,
      uploadImage: true,
      imageUploadFunction,
      placeholder: 'Type here...',
      toolbar: [
        'bold',
        'italic',
        'heading',
        '|',
        'unordered-list',
        'ordered-list',
        'link',
        'table',
        'horizontal-rule',
        '|',
        'image',
        {
          name: 'image-upload',
          action: (editor: EasyMDE) => {
            imageUploadAction(editor)
          },
          className: 'fa fa-upload',
          title: 'Upload Image',
        },
        '|',
        {
          name: 'clear',
          action: (editor: EasyMDE) => {
            if (window.confirm('Are you sure you want to clear the content?')) {
              clearAction(editor)
            }
          },
          className: 'fa fa-trash',
          title: 'Clear',
        },
      ],
    }),
    [],
  )

  return (
    <div className='container'>
      <MarkdownEditor mdData={mdData} setMdData={setMdData} options={options} />
    </div>
  )
}
