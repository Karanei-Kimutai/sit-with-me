'use client'

import { createPost } from "@/actions/createPost";
import TiptapEditor from "@/components/editor/TiptapEditor";
import { useState } from "react";
import Link from "next/link";

export default function CreatePostPage() {
  const [content, setContent] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [isUploadingCover, setIsUploadingCover] = useState(false)
  const [coverError, setCoverError] = useState('')

  const uploadCoverImage = async (file: File) => {
    setCoverError('')
    setIsUploadingCover(true)

    const formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!)

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        { method: 'POST', body: formData }
      )
      const data = await res.json()
      if (!data?.secure_url) {
        throw new Error('No secure_url returned')
      }
      setImageUrl(data.secure_url as string)
    } catch (err) {
      console.error('Cover upload failed', err)
      setCoverError('Cover upload failed. Please try again.')
      setImageUrl('')
    } finally {
      setIsUploadingCover(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-stone-50 via-white to-stone-100">
      
      <form action={createPost}>
        
        <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-stone-200 px-6 py-4 flex justify-between items-center shadow-sm">
          <div className="flex items-center gap-4">
            <Link 
              href="/" 
              className="text-stone-400 hover:text-stone-600 transition-colors flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              <span className="text-sm font-medium">Cancel</span>
            </Link>
            <span className="text-sm font-medium text-stone-400">New Story</span>
          </div>
          
          <div className="flex items-center gap-3">
            <span className="text-xs text-stone-500 hidden sm:block">
              Auto-saving to drafts
            </span>
            <button 
              type="submit" 
              disabled={isUploadingCover}
              className={`btn-primary px-6 py-2 rounded-full text-sm font-medium transition-all shadow-sm flex items-center gap-2 ${
                isUploadingCover ? 'opacity-60 cursor-not-allowed' : 'hover:shadow-md'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              {isUploadingCover ? 'Uploading...' : 'Publish Story'}
            </button>
          </div>
        </nav>

        <div className="max-w-6xl mx-auto px-2 sm:px-8 py-8">
          <div className="bg-white rounded-2xl shadow-xl border border-stone-200 overflow-hidden">
          
            <input type="hidden" name="content" value={content} />
            <input type="hidden" name="imageUrl" value={imageUrl} />
            <TiptapEditor 
              onChange={(newContent) => setContent(newContent)} 
              postId="new-draft"
              header={
                <div className="p-8 md:p-12">
                  <input 
                    type="text" 
                    name="title" 
                    required 
                    placeholder="Your Story Title"
                    className="w-full text-4xl md:text-5xl font-extrabold text-stone-900 placeholder:text-stone-300 border-none focus:ring-0 px-0 mb-4 bg-transparent focus:outline-none"
                    autoFocus
                    style={{ lineHeight: 1.1 }}
                  />

                  <input 
                    type="text" 
                    name="subtitle" 
                    placeholder="Add a subtitle to give context (optional)"
                    className="w-full text-xl md:text-2xl text-stone-600 placeholder:text-stone-300 border-none focus:ring-0 px-0 mb-6 bg-transparent font-sans focus:outline-none"
                    style={{ lineHeight: 1.3 }}
                  />

                  <div className="bg-white rounded-lg border border-stone-200 p-3">
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>

                      <label className="flex-1 text-sm text-stone-600">
                        <input
                          type="file"
                          accept="image/*"
                          className="sr-only"
                          onChange={(e) => {
                            const file = e.target.files?.[0]
                            if (file) uploadCoverImage(file)
                          }}
                        />
                        <span className="cursor-pointer">
                          {isUploadingCover ? 'Uploading cover image...' : 'Upload cover image (optional)'}
                        </span>
                      </label>
                    </div>

                    {coverError && (
                      <p className="mt-2 text-xs text-red-600">{coverError}</p>
                    )}

                    {imageUrl && !isUploadingCover && (
                      <div className="mt-3">
                        <img
                          src={imageUrl}
                          alt="Cover preview"
                          className="w-full max-h-72 object-cover rounded-md border border-stone-200"
                        />
                      </div>
                    )}
                  </div>
                </div>
              }
            />

          </div>

        </div>
      </form>

    </main>
  );
}
