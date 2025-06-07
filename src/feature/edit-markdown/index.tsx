'use client'
import MarkdownEditor from '@/components/markdown-editor'
import type { Slide } from '@/lib/slide-crud'
import { cn } from '@/lib/utils'
import { useMdData } from '@/providers/md-data-provider'
import { useMemo, useRef } from 'react'
import type { SimpleMDEReactProps } from 'react-simplemde-editor'
import {
  clearAction,
  imageUploadAction,
  imageUploadFunction,
} from './markdownAction'
import { useUnsavedChanges, useInitialDataSync } from './useEditMarkdownEffects'
import useMde from './useMde'
import { Save } from 'lucide-react'
import { updateSlide } from '@/lib/slide-crud'
import type { Session } from 'next-auth'
import { toastError, toastSuccess } from '@/components/custom-toast'
import CustomSubmitButton from '@/components/custom-submit-button'
import Form from 'next/form'

export default function EditMarkdown({
  initialSlide,
  session,
}: {
  initialSlide: Slide | null
  session: Session | null
}) {
  const { mdData, updateMdBody, setActiveSlideIndex, isDiff } = useMdData()
  const mdeRef = useRef<{ getMdeInstance: () => EasyMDE } | null>(null)

  useMde(mdData.body, mdeRef, setActiveSlideIndex)
  useInitialDataSync(initialSlide)
  const { markAsSaved } = useUnsavedChanges()

  const options: SimpleMDEReactProps['options'] = useMemo(
    () => ({
      scrollbarStyle: 'native',
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
    <div
      className={cn(
        'relative w-full',
        'max-w-[640px]',
        'min-h-[371px]',
        'lg:h-[425px]',
        'xl:h-[450px]',
      )}
    >
      <MarkdownEditor
        mdDataBody={mdData.body}
        updateMdBody={updateMdBody}
        options={options}
        mdeRef={mdeRef}
      />
      {initialSlide && (
        <Form
          action={async () => {
            try {
              await updateSlide(mdData.id, mdData.body, session)
              markAsSaved()
              toastSuccess('保存しました')
            } catch (e) {
              toastError(
                e instanceof Error ? e : new Error('保存に失敗しました'),
              )
            }
          }}
        >
          <CustomSubmitButton
            className='absolute top-2 right-2'
            disabled={!isDiff}
            icon={<Save />}
          >
            save
          </CustomSubmitButton>
        </Form>
      )}
    </div>
  )
}
