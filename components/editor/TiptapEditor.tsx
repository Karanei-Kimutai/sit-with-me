'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Placeholder from '@tiptap/extension-placeholder'
import Link from '@tiptap/extension-link'
import Underline from '@tiptap/extension-underline'
import Toolbar from './Toolbar'

type Props = {
  onChange: (content: string) => void
  initialContent?: string
}

export default function TiptapEditor({ onChange, initialContent = '' }: Props) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Image.configure({
        inline: true,
        allowBase64: true,
      }),
      Link.configure({
        openOnClick: false,
      }),
      Placeholder.configure({
        placeholder: 'Tell your story...',
      }),
    ],
    content: initialContent,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        // These classes style the actual writing area (Prose)
        class: 'prose prose-lg prose-stone max-w-none focus:outline-none min-h-[50vh]',
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
  })

  return (
    <div className="w-full border border-stone-200 rounded-lg overflow-hidden bg-white shadow-sm">
      {/*
        Ensure Toolbar supports:
        - Bold
        - Italic
        - Underline
        - Strikethrough
        - Image
        If not, update Toolbar.tsx accordingly.
      */}
      <Toolbar editor={editor} />
      <div className="p-6">
        <EditorContent editor={editor} />
      </div>
    </div>
  )
}