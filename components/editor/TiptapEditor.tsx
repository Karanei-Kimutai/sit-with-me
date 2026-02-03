'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Placeholder from '@tiptap/extension-placeholder'
import Link from '@tiptap/extension-link'
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'
import {Table} from '@tiptap/extension-table'
import TableRow from '@tiptap/extension-table-row'
import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header'
import { useEffect, useState, useCallback } from 'react'
import EnhancedToolbar from './EnhancedToolbar'
import EditorStats from './EditorStats'

type Props = {
  onChange?: (content: string) => void
  initialContent?: string
  toolbarOnly?: boolean
  contentOnly?: boolean
  postId?: string // For auto-save identification
}

export default function TiptapEditor({ 
  onChange, 
  initialContent = '', 
  toolbarOnly = false, 
  contentOnly = false,
  postId = 'draft'
}: Props) {
  const [isFocusMode, setIsFocusMode] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Image.configure({
        inline: false,
        allowBase64: true,
        HTMLAttributes: {
          class: 'editor-image',
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'editor-link',
        },
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
      Placeholder.configure({
        placeholder: 'Begin your story here. Share the moments, the conversations, the humanity you witnessed...',
      }),
    ],
    content: initialContent,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: 'prose prose-lg prose-stone max-w-none focus:outline-none min-h-[60vh] text-stone-900 px-8 py-6',
      },
      // Handle paste from clipboard (including images)
      handlePaste: (view, event) => {
        const items = event.clipboardData?.items
        if (!items) return false

        for (let i = 0; i < items.length; i++) {
          if (items[i].type.indexOf('image') !== -1) {
            event.preventDefault()
            const file = items[i].getAsFile()
            if (file) {
              uploadImageFile(file)
            }
            return true
          }
        }
        return false
      },
      // Handle drag and drop images
      handleDrop: (view, event, _slice, moved) => {
        if (!moved && event.dataTransfer?.files?.length) {
          event.preventDefault()
          const file = event.dataTransfer.files[0]
          if (file.type.startsWith('image/')) {
            uploadImageFile(file)
            return true
          }
        }
        return false
      },
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML()
      if (onChange) onChange(html)
      
      // Auto-save to localStorage
      saveToLocalStorage(html)
    },
  })

  // Auto-save to localStorage
  const saveToLocalStorage = useCallback((content: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(`draft-${postId}`, content)
      setLastSaved(new Date())
    }
  }, [postId])

  // Load from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined' && !initialContent) {
      const saved = localStorage.getItem(`draft-${postId}`)
      if (saved && editor) {
        editor.commands.setContent(saved)
      }
    }
  }, [editor, initialContent, postId])

  // Upload image to Cloudinary
  const uploadImageFile = async (file: File) => {
    if (!editor) return

    const formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!)

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        { method: 'POST', body: formData }
      )
      const data = await res.json()
      editor.chain().focus().setImage({ src: data.secure_url }).run()
    } catch (err) {
      console.error("Upload failed", err)
      alert("Image upload failed. Please try again.")
    }
  }

  const clearDraft = () => {
    if (typeof window !== 'undefined') {
      if (confirm('Clear saved draft? This cannot be undone.')) {
        localStorage.removeItem(`draft-${postId}`)
        editor?.commands.clearContent()
        setLastSaved(null)
      }
    }
  }

  if (toolbarOnly) {
    return (
      <div className="w-full border border-stone-200 rounded-lg overflow-hidden bg-white shadow-sm">
        <EnhancedToolbar 
          editor={editor} 
          isFocusMode={isFocusMode}
          setIsFocusMode={setIsFocusMode}
          showPreview={showPreview}
          setShowPreview={setShowPreview}
        />
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
    <div className={`w-full transition-all duration-300 ${isFocusMode ? 'fixed inset-0 z-50 bg-stone-50' : ''}`}>
      {/* Auto-save indicator */}
      {lastSaved && (
        <div className="fixed bottom-4 right-4 bg-green-100 border border-green-300 text-green-800 px-4 py-2 rounded-full text-sm flex items-center gap-2 shadow-lg z-50">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Draft saved {lastSaved.toLocaleTimeString()}
        </div>
      )}

      {/* Editor Container */}
      <div className={`${isFocusMode ? 'h-screen flex flex-col' : 'border border-stone-200 rounded-lg overflow-hidden bg-white shadow-sm'}`}>
        
        {/* Toolbar */}
        <EnhancedToolbar 
          editor={editor} 
          isFocusMode={isFocusMode}
          setIsFocusMode={setIsFocusMode}
          showPreview={showPreview}
          setShowPreview={setShowPreview}
          onClearDraft={clearDraft}
        />

        {/* Editor Stats */}
        {!showPreview && <EditorStats editor={editor} />}

        {/* Content Area */}
        <div className={`${isFocusMode ? 'flex-1 overflow-auto' : ''}`}>
          {showPreview ? (
            <div className="p-8 md:p-12 max-w-4xl mx-auto">
              <div className="bg-white rounded-xl border border-stone-200 p-8 md:p-12">
                  <div
                    className={`prose prose-stone prose-lg md:prose-xl max-w-none font-serif text-stone-700 leading-relaxed prose-headings:font-sans prose-headings:font-bold prose-headings:text-stone-900 prose-a:text-amber-700 prose-a:no-underline hover:prose-a:underline prose-img:rounded-xl prose-img:shadow-md prose-img:my-8 prose-blockquote:border-l-4 prose-blockquote:border-amber-500 prose-blockquote:bg-amber-50 prose-blockquote:py-4 prose-blockquote:px-6`}
                    dangerouslySetInnerHTML={{ __html: editor?.getHTML() || '' }}
                  />
                </div>
              </div>
          ) : (
            <div className={`${isFocusMode ? 'max-w-4xl mx-auto py-8' : 'p-6'}`}>
              <EditorContent editor={editor} />
            </div>
          )}
        </div>
      </div>

      <style jsx global>{`
        .editor-image {
          max-width: 100%;
          height: auto;
          border-radius: 0.75rem;
          margin: 2rem 0;
          box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
        }

        .editor-link {
          color: #b45309;
          text-decoration: none;
          border-bottom: 1px solid #fbbf24;
          transition: all 0.2s;
        }

        .editor-link:hover {
          border-bottom-color: #b45309;
        }

        .ProseMirror p.is-editor-empty:first-child::before {
          color: #adb5bd;
          content: attr(data-placeholder);
          float: left;
          height: 0;
          pointer-events: none;
        }

        .ProseMirror:focus {
          outline: none;
        }

        /* Table styles */
        .ProseMirror table {
          border-collapse: collapse;
          margin: 2rem 0;
          width: 100%;
        }

        .ProseMirror th,
        .ProseMirror td {
          border: 1px solid #e7e5e4;
          padding: 0.75rem;
          position: relative;
        }

        .ProseMirror th {
          background-color: #fafaf9;
          font-weight: 600;
        }

        /* Custom blockquote styles for callouts */
        .ProseMirror blockquote {
          border-left: 4px solid #f59e0b;
          background: #fffbeb;
          padding: 1rem 1.5rem;
          margin: 2rem 0;
          border-radius: 0.5rem;
          font-style: normal;
        }

        /* Hide scrollbar in focus mode for cleaner look */
        ${isFocusMode ? `
          .ProseMirror::-webkit-scrollbar {
            width: 8px;
          }
          .ProseMirror::-webkit-scrollbar-track {
            background: transparent;
          }
          .ProseMirror::-webkit-scrollbar-thumb {
            background: #d6d3d1;
            border-radius: 4px;
          }
        ` : ''}
      `}</style>
    </div>
  )
}