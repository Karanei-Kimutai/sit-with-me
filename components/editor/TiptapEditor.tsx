'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Placeholder from '@tiptap/extension-placeholder'
import Link from '@tiptap/extension-link'
import Underline from '@tiptap/extension-underline'
import Toolbar from './Toolbar'

type Props = {
  onChange?: (content: string) => void
  initialContent?: string
  toolbarOnly?: boolean
  contentOnly?: boolean
}


export default function TiptapEditor({ onChange, initialContent = '', toolbarOnly = false, contentOnly = false }: Props) {
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
        class: 'prose prose-lg prose-stone max-w-none focus:outline-none min-h-[50vh] text-stone-900',
      },
    },
    onUpdate: ({ editor }) => {
      if (onChange) onChange(editor.getHTML())
    },
  })

  if (toolbarOnly) {
    return (
      <div className="w-full border border-stone-200 rounded-lg overflow-hidden bg-white shadow-sm">
        <Toolbar editor={editor} />
      </div>
    )
  }
  if (contentOnly) {
    return (
      <div className="w-full border border-stone-200 rounded-lg overflow-hidden bg-white shadow-sm">
        <div className="p-6">
          <EditorContent editor={editor} />
        </div>
      </div>
    )
  }
  return (
    <div className="w-full border border-stone-200 rounded-lg overflow-hidden bg-white shadow-sm">
      <Toolbar editor={editor} />
      <div className="p-6">
        <EditorContent editor={editor} />
      </div>
    </div>
  )
}