'use client'

import { useState, useTransition } from 'react'
import { addComment } from '@/actions/addComment'

type Comment = {
  id: string
  content: string
  createdAt: Date
  user: {
    name: string | null
    email: string
  }
}

type Props = {
  postId: string
  comments: Comment[]
  isGuest: boolean
}

export default function CommentSection({ postId, comments, isGuest }: Props) {
  const [commentText, setCommentText] = useState('')
  const [isPending, startTransition] = useTransition()
  const [localComments, setLocalComments] = useState(comments)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!commentText.trim()) return

    startTransition(async () => {
      try {
        await addComment(postId, commentText)
        setCommentText('')
        // Refresh would happen here in a real app, or use optimistic updates
        window.location.reload()
      } catch (error) {
        alert('Failed to post comment. Please try again.')
      }
    })
  }

  return (
    <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50/50 px-6 md:px-8 py-6 border-b border-amber-200/50">
        <h3 className="text-2xl font-bold text-stone-900 font-sans mb-2">
          Community Reflections
        </h3>
        <p className="text-sm text-stone-600">
          {localComments.length === 0 
            ? 'Be the first to share a thoughtful response' 
            : `${localComments.length} ${localComments.length === 1 ? 'reflection' : 'reflections'} shared`}
        </p>
      </div>

      {/* Comment Form - Members Only */}
      <div className="px-6 md:px-8 py-6 border-b border-stone-200">
        {isGuest ? (
          <div className="text-center py-8 bg-amber-50/30 rounded-xl border border-amber-200/50">
            <svg className="w-12 h-12 text-amber-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <p className="text-stone-700 mb-4 font-medium">Join the community to share your thoughts</p>
            <a 
              href="/register" 
              className="inline-block btn-primary px-6 py-2 rounded-full font-medium transition-all shadow-sm"
            >
              Become a Member
            </a>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="comment" className="block text-sm font-medium text-stone-700 mb-2">
                Share your thoughts
              </label>
              <textarea
                id="comment"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-none text-stone-800 placeholder:text-stone-400"
                placeholder="What stood out to you? Add context, questions, or reflections."
                disabled={isPending}
              />
            </div>
            <div className="flex items-center justify-between">
              <p className="text-xs text-stone-500">
                Your reflection will be visible to all community members
              </p>
              <button
                type="submit"
                disabled={isPending || !commentText.trim()}
                className="btn-primary px-6 py-2 rounded-full font-medium transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isPending ? 'Posting...' : 'Post Reflection'}
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Comments List */}
      <div className="px-6 md:px-8 py-6">
        {localComments.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <p className="text-stone-500 text-sm">No reflections yet. Be the first to share!</p>
          </div>
        ) : (
          <div className="space-y-6">
            {localComments.map((comment) => {
              const commentDate = new Date(comment.createdAt);
              const initial = comment.user.name?.charAt(0) || comment.user.email.charAt(0);
              
              return (
                <div key={comment.id} className="bg-stone-50 rounded-xl p-6 border border-stone-200 hover:border-amber-200 transition-colors">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-amber-100 to-orange-100 rounded-full flex items-center justify-center border-2 border-amber-200 flex-shrink-0">
                      <span className="text-sm font-bold text-amber-900 uppercase">
                        {initial}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                        <p className="font-semibold text-stone-900">
                          {comment.user.name || 'Community Member'}
                        </p>
                        <time className="text-xs text-stone-500">
                          {commentDate.toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </time>
                      </div>
                      <p className="text-stone-700 leading-relaxed whitespace-pre-wrap">
                        {comment.content}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  )
}
