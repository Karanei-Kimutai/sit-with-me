'use client'

import { toggleLike } from '@/actions/interact'
import { useState, useTransition } from 'react'

type Props = {
  postId: string
  initialLikeCount: number
  isLikedByMe: boolean
  isGuest: boolean
}

export default function LikeButton({ postId, initialLikeCount, isLikedByMe, isGuest }: Props) {
  // We use local state to update the UI instantly (Optimistic UI)
  const [likeCount, setLikeCount] = useState(initialLikeCount)
  const [isLiked, setIsLiked] = useState(isLikedByMe)
  const [isPending, startTransition] = useTransition()

  const handleLike = () => {
    if (isGuest) {
      alert("Please join our community to like posts!")
      return
    }

    // 1. Update UI instantly (Optimistic update)
    const newIsLiked = !isLiked
    setIsLiked(newIsLiked)
    setLikeCount(newIsLiked ? likeCount + 1 : likeCount - 1)

    // 2. Call the server action in the background
    startTransition(async () => {
      try {
        await toggleLike(postId)
      } catch (error) {
        // If server fails, revert the UI changes (optional error handling)
        setIsLiked(!newIsLiked)
        setLikeCount(initialLikeCount)
        alert("Something went wrong")
      }
    })
  }

  return (
    <button 
      onClick={handleLike}
      disabled={isPending}
      className={`
        flex items-center gap-2 px-4 py-2 rounded-full transition-all border
        ${isLiked 
          ? 'bg-amber-100 border-amber-300 text-amber-800' 
          : 'bg-white border-stone-200 text-stone-500 hover:bg-stone-50'}
      `}
    >
      {/* Heart Icon SVG */}
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        fill={isLiked ? "currentColor" : "none"} 
        viewBox="0 0 24 24" 
        strokeWidth={1.5} 
        stroke="currentColor" 
        className="w-5 h-5"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
      </svg>
      
      <span className="font-medium">{likeCount}</span>
    </button>
  )
}