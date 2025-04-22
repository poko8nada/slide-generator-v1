export function imageUploadFunction(file: File) {
  console.log('Uploading image:', file)

  // Validate file type
  if (!file.type.startsWith('image/')) {
    throw new Error('The provided file is not an image.')
  }

  // Validate file size (optional, e.g., max 5MB)
  const maxSizeInMB = 5
  if (file.size > maxSizeInMB * 1024 * 1024) {
    throw new Error(`File size exceeds ${maxSizeInMB}MB.`)
  }

  const objectURL = URL.createObjectURL(file)

  console.log('Generated object URL:', objectURL)

  const imageMd = `![${file.name}](${objectURL})`
  return imageMd
}

export function clearAction(editor: EasyMDE) {
  editor.value('') // Clear the editor content
}
