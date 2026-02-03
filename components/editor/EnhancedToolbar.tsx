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
      aria-label={title}
      aria-pressed={isActive}
      className={`h-9 min-w-9 px-2.5 rounded-lg text-sm font-medium transition-all border flex items-center justify-center ${isActive ? 'bg-amber-800 text-white border-amber-800 shadow-sm' : 'text-stone-700 border-transparent hover:bg-white hover:border-stone-200 hover:shadow-sm disabled:opacity-30 disabled:cursor-not-allowed'}`}
    >
      {children}
    </button>
  )
}

function Divider() {
  return <div className="w-px h-6 bg-stone-200 mx-2" />
}

function ToolbarGroup({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-1 bg-stone-50/80 border border-stone-200 rounded-xl p-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]">
      {children}
    </div>
  )
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
    <div className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-stone-200">
      <div className="relative">
        <div className="toolbar-scroll flex flex-nowrap items-center gap-2 p-3 overflow-x-auto">
        
        <ToolbarGroup>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBold().run()}
            isActive={editor.isActive('bold')}
            title="Bold (Ctrl+B)"
          >
            <span className="font-bold text-[13px]">B</span>
          </ToolbarButton>
          
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleItalic().run()}
            isActive={editor.isActive('italic')}
            title="Italic (Ctrl+I)"
          >
            <span className="italic text-[13px]">I</span>
          </ToolbarButton>
          
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            isActive={editor.isActive('underline')}
            title="Underline (Ctrl+U)"
          >
            <span className="underline text-[13px]">U</span>
          </ToolbarButton>
          
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleStrike().run()}
            isActive={editor.isActive('strike')}
            title="Strikethrough"
          >
            <span className="line-through text-[13px]">S</span>
          </ToolbarButton>
        </ToolbarGroup>

        <Divider />

        <ToolbarGroup>
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
        </ToolbarGroup>

        <Divider />

        <ToolbarGroup>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            isActive={editor.isActive('bulletList')}
            title="Bullet List"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <line x1="9" y1="6" x2="20" y2="6" />
              <line x1="9" y1="12" x2="20" y2="12" />
              <line x1="9" y1="18" x2="20" y2="18" />
              <circle cx="4.5" cy="6" r="1" />
              <circle cx="4.5" cy="12" r="1" />
              <circle cx="4.5" cy="18" r="1" />
            </svg>
          </ToolbarButton>
          
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            isActive={editor.isActive('orderedList')}
            title="Numbered List"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <line x1="9" y1="6" x2="20" y2="6" />
              <line x1="9" y1="12" x2="20" y2="12" />
              <line x1="9" y1="18" x2="20" y2="18" />
              <path d="M4 6h1v4" />
              <path d="M5 10H3" />
              <path d="M3.5 12.5H5a1 1 0 1 1 0 2H3.5" />
              <path d="M3.5 16.5H5a1 1 0 1 1 0 2H3.5" />
            </svg>
          </ToolbarButton>
          
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            isActive={editor.isActive('blockquote')}
            title="Quote/Callout"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M7 7h6v6H7z" />
              <path d="M15 11h2a2 2 0 0 1 2 2v4h-6" />
            </svg>
          </ToolbarButton>
        </ToolbarGroup>

        <Divider />

        <ToolbarGroup>
          <ToolbarButton
            onClick={() => editor.chain().focus().setTextAlign('left').run()}
            isActive={editor.isActive({ textAlign: 'left' })}
            title="Align Left"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <line x1="4" y1="6" x2="20" y2="6" />
              <line x1="4" y1="12" x2="14" y2="12" />
              <line x1="4" y1="18" x2="18" y2="18" />
            </svg>
          </ToolbarButton>
          
          <ToolbarButton
            onClick={() => editor.chain().focus().setTextAlign('center').run()}
            isActive={editor.isActive({ textAlign: 'center' })}
            title="Align Center"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <line x1="6" y1="6" x2="18" y2="6" />
              <line x1="4" y1="12" x2="20" y2="12" />
              <line x1="6" y1="18" x2="18" y2="18" />
            </svg>
          </ToolbarButton>
          
          <ToolbarButton
            onClick={() => editor.chain().focus().setTextAlign('right').run()}
            isActive={editor.isActive({ textAlign: 'right' })}
            title="Align Right"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <line x1="4" y1="6" x2="20" y2="6" />
              <line x1="10" y1="12" x2="20" y2="12" />
              <line x1="6" y1="18" x2="20" y2="18" />
            </svg>
          </ToolbarButton>
        </ToolbarGroup>

        <Divider />

        <ToolbarGroup>
          <label className="h-9 min-w-9 px-3 rounded-lg text-sm font-medium text-stone-700 hover:bg-white hover:border-stone-200 hover:shadow-sm cursor-pointer transition-all border border-transparent inline-flex items-center justify-center" title="Upload Image">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="3" y="5" width="18" height="14" rx="2" />
              <circle cx="8" cy="10" r="1.5" />
              <path d="M21 16l-5-5-6 6-3-3-4 4" />
            </svg>
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
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M10 14a5 5 0 0 0 7 0l2-2a5 5 0 0 0-7-7l-1 1" />
                <path d="M14 10a5 5 0 0 0-7 0l-2 2a5 5 0 0 0 7 7l1-1" />
              </svg>
            </ToolbarButton>
            
            {showLinkInput && (
              <div className="absolute top-full left-0 mt-2 bg-white border border-stone-200 rounded-xl shadow-xl p-3 w-72 z-50">
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
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm mb-2 focus:ring-2 focus:ring-amber-200 focus:outline-none"
                  autoFocus
                />
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={setLink}
                    className="flex-1 bg-amber-700 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-amber-800"
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
                    className="px-3 py-1.5 text-stone-600 hover:bg-stone-100 rounded-lg text-sm"
                  >
                    Remove
                  </button>
                </div>
              </div>
            )}
          </div>
        </ToolbarGroup>

        <Divider />

        <ToolbarGroup>
          <ToolbarButton
            onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
            title="Insert Table"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="3" y="5" width="18" height="14" rx="1.5" />
              <line x1="3" y1="10" x2="21" y2="10" />
              <line x1="8" y1="5" x2="8" y2="19" />
              <line x1="16" y1="5" x2="16" y2="19" />
            </svg>
          </ToolbarButton>
        </ToolbarGroup>

        <Divider />

        <ToolbarGroup>
          <ToolbarButton
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
            title="Horizontal Line"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <line x1="4" y1="12" x2="20" y2="12" />
            </svg>
          </ToolbarButton>
        </ToolbarGroup>

        <div className="flex-1 min-w-[12px]" />

        <ToolbarGroup>
          <ToolbarButton
            onClick={() => setShowPreview(!showPreview)}
            isActive={showPreview}
            title={showPreview ? "Edit Mode" : "Preview Mode"}
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M2 12s4-6 10-6 10 6 10 6-4 6-10 6S2 12 2 12z" />
              <circle cx="12" cy="12" r="2.5" />
            </svg>
          </ToolbarButton>

          <ToolbarButton
            onClick={() => setIsFocusMode(!isFocusMode)}
            isActive={isFocusMode}
            title={isFocusMode ? "Exit Focus Mode" : "Focus Mode"}
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M8 3H3v5" />
              <path d="M16 3h5v5" />
              <path d="M8 21H3v-5" />
              <path d="M21 16v5h-5" />
            </svg>
          </ToolbarButton>

          {onClearDraft && (
            <ToolbarButton
              onClick={onClearDraft}
              title="Clear Draft"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M3 6h18" />
                <path d="M8 6v-2h8v2" />
                <path d="M6 6l1 14h10l1-14" />
              </svg>
            </ToolbarButton>
          )}
        </ToolbarGroup>
        </div>
        <div className="pointer-events-none absolute inset-y-0 left-0 w-6 bg-gradient-to-r from-white to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-6 bg-gradient-to-l from-white to-transparent" />
      </div>

      <style jsx>{`
        .toolbar-scroll {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        .toolbar-scroll::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  )
}
