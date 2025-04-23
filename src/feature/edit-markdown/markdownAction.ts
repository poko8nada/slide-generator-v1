export function getImageUrl(file: File) {
  // Validate file type
  if (!file.type.startsWith('image/')) {
    throw new Error('The provided file is not an image.')
  }

  // Validate file size (optional, e.g., max 5MB)
  const maxSizeInMB = 5
  if (file.size > maxSizeInMB * 1024 * 1024) {
    throw new Error(`File size exceeds ${maxSizeInMB}MB.`)
  }

  // Determine file extension based on MIME type
  const mimeToExtension: Record<string, string> = {
    'image/png': 'png',
    'image/jpeg': 'jpg',
    'image/gif': 'gif',
    'image/svg+xml': 'svg',
    'image/webp': 'webp',
  }

  const extension = mimeToExtension[file.type]
  if (!extension) {
    throw new Error('Unsupported file type')
  }

  // Generate object URL and append extension
  const objectURL = URL.createObjectURL(file)
  return `${objectURL}#.${extension}`
}

export function imageUploadFunction(
  file: File,
  onSuccess: (url: string) => void,
  onError: (error: string) => void,
) {
  try {
    const imageUrl = getImageUrl(file)
    onSuccess(imageUrl)
  } catch (error) {
    if (error instanceof Error) {
      onError('An error occurred during image upload.')
      throw error
    }
    onError('Image upload failed. Please try again.')
  }
}

export function clearAction(editor: EasyMDE) {
  editor.value('') // Clear the editor content
}

export function imageUploadAction(editor: EasyMDE) {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = 'image/*'
  input.onchange = async event => {
    const file = (event.target as HTMLInputElement).files?.[0]
    if (file) {
      try {
        const imageUrl = getImageUrl(file)
        editor.codemirror.replaceSelection(`![Image](${imageUrl})`)

        // Move the cursor to the end of the inserted text
        const cursor = editor.codemirror.getCursor()
        editor.codemirror.setCursor({
          line: cursor.line,
          ch: cursor.ch + `![Image](${imageUrl})`.length,
        })

        // Refocus the editor
        editor.codemirror.focus()
      } catch (error) {
        if (error instanceof Error) {
          throw error
        }
      }
    }
  }
  input.click()
}
