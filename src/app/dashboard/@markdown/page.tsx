'use client';
import MDEditor from '@uiw/react-md-editor';
import { useState } from 'react';

export default function MarkdownPage() {
  const [value, setValue] = useState<string>('');
  return  (
    <div className="container">
      <MDEditor
        value={value}
        onChange={(value) => setValue(value || '')}
      />
      {/* <MDEditor.Markdown source={value} style={{ whiteSpace: 'pre-wrap' }} /> */}
    </div>
  )
}