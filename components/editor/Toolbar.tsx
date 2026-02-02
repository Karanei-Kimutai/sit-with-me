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
    <div className="flex gap-1 flex-wrap items-center rounded-lg bg-stone-50/90 border border-stone-200 shadow-sm px-3 py-2 mb-4 sticky top-0 z-10">
      {/* Basics */}
      <button
        onClick={(e) => { e.preventDefault(); editor.chain().focus().toggleBold().run() }}
        className={`px-2.5 py-1 rounded-md border border-transparent text-base font-semibold transition-all flex items-center gap-1 ${editor.isActive('bold') ? 'bg-stone-800 text-white shadow' : 'text-stone-700 hover:bg-stone-200'}`}
        title="Bold (Ctrl+B)"
      >
        <span style={{fontWeight: 'bold'}}>B</span>
      </button>
      <button
        onClick={(e) => { e.preventDefault(); editor.chain().focus().toggleItalic().run() }}
        className={`px-2.5 py-1 rounded-md border border-transparent text-base font-semibold transition-all flex items-center gap-1 ${editor.isActive('italic') ? 'bg-stone-800 text-white shadow' : 'text-stone-700 hover:bg-stone-200'}`}
        title="Italic (Ctrl+I)"
      >
        <span style={{fontStyle: 'italic'}}>I</span>
      </button>
      
      {/* Headings */}
      <button
        onClick={(e) => { e.preventDefault(); editor.chain().focus().toggleUnderline().run() }}
        className={`px-2.5 py-1 rounded-md border border-transparent text-base font-semibold transition-all flex items-center gap-1 ${editor.isActive('underline') ? 'bg-stone-800 text-white shadow' : 'text-stone-700 hover:bg-stone-200'}`}
        title="Underline (Ctrl+U)"
      >
        <span style={{textDecoration: 'underline'}}>U</span>
      </button>
      <button
        onClick={(e) => { e.preventDefault(); editor.chain().focus().toggleStrike().run() }}
        className={`px-2.5 py-1 rounded-md border border-transparent text-base font-semibold transition-all flex items-center gap-1 ${editor.isActive('strike') ? 'bg-stone-800 text-white shadow' : 'text-stone-700 hover:bg-stone-200'}`}
        title="Strikethrough (Ctrl+Shift+S)"
      >
        <span style={{textDecoration: 'line-through'}}>S</span>
      </button>
      <span className="mx-2 text-stone-300 select-none">|</span>
      <button
        onClick={(e) => { e.preventDefault(); editor.chain().focus().toggleHeading({ level: 2 }).run() }}
        className={`px-2.5 py-1 rounded-md border border-transparent text-base font-semibold transition-all flex items-center gap-1 ${editor.isActive('heading', { level: 2 }) ? 'bg-stone-800 text-white shadow' : 'text-stone-700 hover:bg-stone-200'}`}
        title="Heading"
      >
        H2
      </button>
      <button
        onClick={(e) => { e.preventDefault(); editor.chain().focus().toggleBulletList().run() }}
        className={`px-2.5 py-1 rounded-md border border-transparent text-base font-semibold transition-all flex items-center gap-1 ${editor.isActive('bulletList') ? 'bg-stone-800 text-white shadow' : 'text-stone-700 hover:bg-stone-200'}`}
        title="Bullet List"
      >
        • List
      </button>
      <button
        onClick={(e) => { e.preventDefault(); editor.chain().focus().toggleBlockquote().run() }}
        className={`px-2.5 py-1 rounded-md border border-transparent text-base font-semibold transition-all flex items-center gap-1 ${editor.isActive('blockquote') ? 'bg-stone-800 text-white shadow' : 'text-stone-700 hover:bg-stone-200'}`}
        title="Quote"
      >
        “ ”
      </button>
      <span className="mx-2 text-stone-300 select-none">|</span>
      <label className="px-2.5 py-1 rounded-md border border-transparent text-base font-semibold text-stone-700 hover:bg-stone-200 cursor-pointer flex items-center gap-1 transition-all">
        <span role="img" aria-label="Add Photo">📷</span> Photo
        <input type="file" className="hidden" accept="image/*" onChange={uploadImage} />
      </label>
    </div>
  )
}