'use client'

import { type Editor } from '@tiptap/react'
import { useCallback, useState } from 'react'

type Props = {
  editor: Editor | null
  isFocusMode: boolean
  setIsFocusMode: (value: boolean) => void
  showPreview: boolean
  setShowPreview: (value: boolean) => void
  onClearDraft?: () => void
}

function ToolbarButton({ onClick, isActive, disabled, title, children }: { onClick: () => void; isActive?: boolean; disabled?: boolean; title: string; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${isActive ? 'bg-amber-800 text-white shadow-sm' : 'text-stone-700 hover:bg-stone-100 disabled:opacity-30 disabled:cursor-not-allowed'}`}
    >
      {children}
    </button>
  )
}

function Divider() {
  return <div className="w-px h-6 bg-stone-200 mx-1" />
}

export default function EnhancedToolbar({ 
  editor, 
  isFocusMode, 
  setIsFocusMode, 
  showPreview, 
  setShowPreview,
  onClearDraft 
}: Props) {
  // All hooks at the top
  const [showLinkInput, setShowLinkInput] = useState(false)
  const [linkUrl, setLinkUrl] = useState('')
  const setLink = useCallback(() => {
    if (!editor) return
    if (linkUrl === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
      return
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: linkUrl }).run()
    setShowLinkInput(false)
    setLinkUrl('')
  }, [editor, linkUrl])

  const uploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editor) return
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
      editor.chain().focus().setImage({ src: data.secure_url }).run()
    } catch (err) {
      console.error("Upload failed", err)
      alert("Image upload failed")
    }
  }

  if (!editor) {
    return null
  }

  return (
    <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-stone-200">
      <div className="flex flex-wrap items-center gap-1 p-3">
        
        <div className="flex items-center gap-1">
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBold().run()}
            isActive={editor.isActive('bold')}
            title="Bold (Ctrl+B)"
          >
            <span className="font-bold">B</span>
          </ToolbarButton>
          
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleItalic().run()}
            isActive={editor.isActive('italic')}
            title="Italic (Ctrl+I)"
          >
            <span className="italic">I</span>
          </ToolbarButton>
          
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            isActive={editor.isActive('underline')}
            title="Underline (Ctrl+U)"
          >
            <span className="underline">U</span>
          </ToolbarButton>
          
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleStrike().run()}
            isActive={editor.isActive('strike')}
            title="Strikethrough"
          >
            <span className="line-through">S</span>
          </ToolbarButton>
        </div>

        <Divider />

        <div className="flex items-center gap-1">
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            isActive={editor.isActive('heading', { level: 2 })}
            title="Heading 2"
          >
            H2
          </ToolbarButton>
          
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            isActive={editor.isActive('heading', { level: 3 })}
            title="Heading 3"
          >
            H3
          </ToolbarButton>
        </div>

        <Divider />

        <div className="flex items-center gap-1">
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            isActive={editor.isActive('bulletList')}
            title="Bullet List"
          >
            List
          </ToolbarButton>
          
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            isActive={editor.isActive('orderedList')}
            title="Numbered List"
          >
            1. List
          </ToolbarButton>
          
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            isActive={editor.isActive('blockquote')}
            title="Quote/Callout"
          >
            Quote
          </ToolbarButton>
        </div>

        <Divider />

        <div className="flex items-center gap-1">
          <ToolbarButton
            onClick={() => editor.chain().focus().setTextAlign('left').run()}
            isActive={editor.isActive({ textAlign: 'left' })}
            title="Align Left"
          >
            Left
          </ToolbarButton>
          
          <ToolbarButton
            onClick={() => editor.chain().focus().setTextAlign('center').run()}
            isActive={editor.isActive({ textAlign: 'center' })}
            title="Align Center"
          >
            Center
          </ToolbarButton>
          
          <ToolbarButton
            onClick={() => editor.chain().focus().setTextAlign('right').run()}
            isActive={editor.isActive({ textAlign: 'right' })}
            title="Align Right"
          >
            Right
          </ToolbarButton>
        </div>

        <Divider />

        <div className="flex items-center gap-1">
          <label className="px-3 py-1.5 rounded-md text-sm font-medium text-stone-700 hover:bg-stone-100 cursor-pointer transition-all">
            Photo
            <input 
              type="file" 
              className="hidden" 
              accept="image/*" 
              onChange={uploadImage} 
            />
          </label>

          <div className="relative">
            <ToolbarButton
              onClick={() => setShowLinkInput(!showLinkInput)}
              isActive={editor.isActive('link')}
              title="Add Link"
            >
              Link
            </ToolbarButton>
            
            {showLinkInput && (
              <div className="absolute top-full left-0 mt-2 bg-white border border-stone-200 rounded-lg shadow-lg p-3 w-72 z-50">
                <input
                  type="url"
                  placeholder="https://example.com"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      setLink()
                    }
                  }}
                  className="w-full px-3 py-2 border border-stone-300 rounded-md text-sm mb-2"
                  autoFocus
                />
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={setLink}
                    className="flex-1 bg-amber-700 text-white px-3 py-1.5 rounded-md text-sm hover:bg-amber-800"
                  >
                    Add Link
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      editor.chain().focus().unsetLink().run()
                      setShowLinkInput(false)
                      setLinkUrl('')
                    }}
                    className="px-3 py-1.5 text-stone-600 hover:bg-stone-100 rounded-md text-sm"
                  >
                    Remove
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <Divider />

        <div className="flex items-center gap-1">
          <ToolbarButton
            onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
            title="Insert Table"
          >
            Table
          </ToolbarButton>
        </div>

        <Divider />

        <div className="flex items-center gap-1">
          <ToolbarButton
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
            title="Horizontal Line"
          >
            Divider
          </ToolbarButton>
        </div>

        <div className="flex-1" />

        <div className="flex items-center gap-1">
          <ToolbarButton
            onClick={() => setShowPreview(!showPreview)}
            isActive={showPreview}
            title={showPreview ? "Edit Mode" : "Preview Mode"}
          >
            {showPreview ? 'Edit' : 'Preview'}
          </ToolbarButton>

          <ToolbarButton
            onClick={() => setIsFocusMode(!isFocusMode)}
            isActive={isFocusMode}
            title={isFocusMode ? "Exit Focus Mode" : "Focus Mode"}
          >
            {isFocusMode ? 'Exit' : 'Focus'}
          </ToolbarButton>

          {onClearDraft && (
            <ToolbarButton
              onClick={onClearDraft}
              title="Clear Draft"
            >
              Clear
            </ToolbarButton>
          )}
        </div>
      </div>

      <div className="bg-amber-50 border-t border-amber-100 px-4 py-2 text-xs text-amber-900 flex items-center gap-4">
        <span className="font-medium">Tips:</span>
        <span>Drag & drop images</span>
        <span>•</span>
        <span>Paste images from clipboard</span>
        <span>•</span>
        <span>Auto-saves as you write</span>
      </div>
    </div>
  )
}