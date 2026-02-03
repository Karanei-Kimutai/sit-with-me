'use client'

import { type Editor } from '@tiptap/react'
import { useEffect, useState } from 'react'

type Props = {
  editor: Editor | null
}

export default function EditorStats({ editor }: Props) {
  const [stats, setStats] = useState({
    words: 0,
    characters: 0,
    readingTime: 0
  })

  useEffect(() => {
    if (!editor) return

    const updateStats = () => {
      const text = editor.getText()
      const words = text.trim().split(/\s+/).filter(Boolean).length
      const characters = text.length
      const readingTime = Math.ceil(words / 200)

      setStats({ words, characters, readingTime })
    }

    editor.on('update', updateStats)
    
    updateStats()

    return () => {
      editor.off('update', updateStats)
    }
  }, [editor])

  if (!editor) return null

  const getMotivationalMessage = () => {
    if (stats.words === 0) return "Start writing your story..."
    if (stats.words < 100) return "Keep going!"
    if (stats.words < 500) return "Great progress!"
    if (stats.words < 1000) return "You're on a roll!"
    return "Incredible storytelling!"
  }

  return (
    <div className="bg-stone-50 border-b border-stone-200 px-4 py-2 flex items-center gap-6 text-xs text-stone-600">
      <div className="flex items-center gap-2">
        <span className="font-medium">Words:</span>
        <span className="font-mono text-stone-900">{stats.words}</span>
      </div>
      
      <div className="flex items-center gap-2">
        <span className="font-medium">Characters:</span>
        <span className="font-mono text-stone-900">{stats.characters}</span>
      </div>
      
      <div className="flex items-center gap-2">
        <span className="font-medium">Reading time:</span>
        <span className="font-mono text-stone-900">
          {stats.readingTime} min{stats.readingTime !== 1 ? 's' : ''}
        </span>
      </div>

      <div className="flex-1" />

      <div className="text-stone-400 italic">
        {getMotivationalMessage()}
      </div>
    </div>
  )
}