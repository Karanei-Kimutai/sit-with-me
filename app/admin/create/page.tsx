'use client'

import { createPost } from "@/actions/createPost";
import TiptapEditor from "@/components/editor/TiptapEditor";
import { useState } from "react";
import Link from "next/link";

export default function CreatePostPage() {
  const [content, setContent] = useState('')

  return (
    <main className="min-h-screen bg-gradient-to-br from-stone-50 via-white to-stone-100 pb-20">
      
      {/* FORM START */}
      <form action={createPost}>
        
        {/* A. STICKY PUBLISH BAR */}
        <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-stone-200 px-6 py-4 flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-stone-400 hover:text-stone-600 transition-colors">
              ✕ <span className="sr-only">Cancel</span>
            </Link>
            <span className="text-sm font-medium text-stone-400">Drafting</span>
          </div>
          
          <button 
            type="submit" 
            className="bg-green-700 text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-green-800 transition-all shadow-sm"
          >
            Publish
          </button>
        </nav>

        {/* B. WRITING AREA */}
        <div className="max-w-6xl mx-auto px-1 sm:px-8 py-12">
          <div className="bg-white/90 rounded-2xl shadow-xl border border-stone-200 p-8 md:p-20 backdrop-blur-md">
          
          {/* 1. Title Input */}
          {/* Toolbar above titles */}
          <div className="mb-8">
            <TiptapEditor onChange={(newContent) => setContent(newContent)} toolbarOnly />
          </div>

          <input 
            type="text" 
            name="title" 
            required 
            placeholder="Title"
            className="w-full text-5xl font-extrabold text-stone-900 placeholder:text-stone-400 border-none focus:ring-0 px-0 mb-4 bg-transparent"
            autoFocus
            style={{ lineHeight: 1.1 }}
          />

          {/* 2. Subtitle Input (New Substack Feature) */}
          <input 
            type="text" 
            name="subtitle" 
            placeholder="Subtitle (optional)"
            className="w-full text-2xl text-stone-500 placeholder:text-stone-400 border-none focus:ring-0 px-0 mb-8 bg-transparent font-serif"
            style={{ lineHeight: 1.2 }}
          />

          {/* 3. Cover Image URL (Hidden behind a detail or kept simple) */}
          <div className="mb-8">
            <input 
              type="url" 
              name="imageUrl" 
              placeholder="Paste a cover image link (optional)..."
              className="w-full text-sm font-medium text-stone-500 placeholder:text-stone-400 border-b border-stone-200 focus:border-stone-400 focus:ring-0 bg-transparent px-0 py-2 rounded"
            />
          </div>

          {/* 4. THE TIPTAP EDITOR */}
          {/* We use a hidden input to send the HTML to the server action */}
          <input type="hidden" name="content" value={content} />
          <div className="mt-8">
            <TiptapEditor onChange={(newContent) => setContent(newContent)} contentOnly />
          </div>

          </div>
        </div>
      </form>

    </main>
  );
}