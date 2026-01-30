'use client'

import { type Editor } from '@tiptap/react'
import { useCallback } from 'react'

type Props = {
  editor: Editor | null
}

export default function Toolbar({ editor }: Props) {
  if (!editor) {
    return null
  }

  const addImage = useCallback(() => {
    const url = window.prompt('URL')

    if (url) {
      editor.chain().focus().setImage({ src: url }).run()
    }
  }, [editor])

  // Custom Image Upload Function
  const uploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!)

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        { method: 'POST', body: formData }
      )
      const data = await res.json()
      
      // Insert image into Tiptap
      editor.chain().focus().setImage({ src: data.secure_url }).run()
    } catch (err) {
      console.error("Upload failed", err)
      alert("Image upload failed")
    }
  }

  return (
    <div className="border-b border-stone-200 p-2 flex gap-2 sticky top-0 bg-white z-10 flex-wrap">
      {/* Basics */}
      <button
        onClick={(e) => { e.preventDefault(); editor.chain().focus().toggleBold().run() }}
        className={`px-3 py-1 rounded text-sm font-medium transition-colors ${editor.isActive('bold') ? 'bg-stone-800 text-white' : 'text-stone-600 hover:bg-stone-100'}`}
      >
        Bold
      </button>
      <button
        onClick={(e) => { e.preventDefault(); editor.chain().focus().toggleItalic().run() }}
        className={`px-3 py-1 rounded text-sm font-medium transition-colors ${editor.isActive('italic') ? 'bg-stone-800 text-white' : 'text-stone-600 hover:bg-stone-100'}`}
      >
        Italic
      </button>
      
      {/* Headings */}
      <button
        onClick={(e) => { e.preventDefault(); editor.chain().focus().toggleHeading({ level: 2 }).run() }}
        className={`px-3 py-1 rounded text-sm font-medium transition-colors ${editor.isActive('heading', { level: 2 }) ? 'bg-stone-800 text-white' : 'text-stone-600 hover:bg-stone-100'}`}
      >
        H2
      </button>
      
      {/* Lists */}
      <button
        onClick={(e) => { e.preventDefault(); editor.chain().focus().toggleBulletList().run() }}
        className={`px-3 py-1 rounded text-sm font-medium transition-colors ${editor.isActive('bulletList') ? 'bg-stone-800 text-white' : 'text-stone-600 hover:bg-stone-100'}`}
      >
        List
      </button>

      {/* Quote */}
      <button
        onClick={(e) => { e.preventDefault(); editor.chain().focus().toggleBlockquote().run() }}
        className={`px-3 py-1 rounded text-sm font-medium transition-colors ${editor.isActive('blockquote') ? 'bg-stone-800 text-white' : 'text-stone-600 hover:bg-stone-100'}`}
      >
        Quote
      </button>

      {/* IMAGE UPLOAD BUTTON */}
      <label className="px-3 py-1 rounded text-sm font-medium text-stone-600 hover:bg-stone-100 cursor-pointer flex items-center gap-1">
        <span>📷 Add Photo</span>
        <input type="file" className="hidden" accept="image/*" onChange={uploadImage} />
      </label>
    </div>
  )
}