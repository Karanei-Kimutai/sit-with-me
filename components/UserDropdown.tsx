'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'

type Props = {
  userName: string
  userEmail: string
  isAdmin: boolean
}

export default function UserDropdown({ userName, userEmail, isAdmin }: Props) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Avatar Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 hover:opacity-80 transition-opacity focus:outline-none group"
      >
        <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center border-2 border-white shadow-md group-hover:shadow-lg transition-shadow">
          <span className="text-sm font-bold text-white">
            {getInitials(userName)}
          </span>
        </div>
        <div className="hidden lg:block text-left">
          <p className="text-sm font-semibold text-stone-800 leading-tight">{userName}</p>
          <p className="text-xs text-stone-500 leading-tight">
            {isAdmin ? 'Admin' : 'Member'}
          </p>
        </div>
        <svg 
          className={`w-4 h-4 text-stone-600 transition-transform hidden lg:block ${isOpen ? 'rotate-180' : ''}`}
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden z-50 animate-fadeIn">
          {/* User Info Section */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50/50 p-4 border-b border-amber-200/50">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center border-2 border-white shadow-md">
                <span className="text-base font-bold text-white">
                  {getInitials(userName)}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-stone-900 truncate">{userName}</p>
                <p className="text-xs text-stone-600 truncate">{userEmail}</p>
                <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-medium uppercase tracking-wide ${
                  isAdmin 
                    ? 'bg-amber-200 text-amber-900' 
                    : 'bg-stone-200 text-stone-700'
                }`}>
                  {isAdmin ? 'Admin' : 'Member'}
                </span>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-2">
            {isAdmin && (
              <>
                <Link
                  href="/admin/create"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 text-stone-700 hover:bg-amber-50 transition-colors group"
                >
                  <svg className="w-5 h-5 text-amber-600 group-hover:text-amber-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <div>
                    <p className="text-sm font-medium">Write Story</p>
                    <p className="text-xs text-stone-500">Create a new post</p>
                  </div>
                </Link>
                
                <div className="border-t border-stone-100 my-2"></div>
              </>
            )}

            <Link
              href="/blog"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-3 text-stone-700 hover:bg-amber-50 transition-colors group"
            >
              <svg className="w-5 h-5 text-stone-500 group-hover:text-amber-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <div>
                <p className="text-sm font-medium">All Stories</p>
                <p className="text-xs text-stone-500">Browse posts</p>
              </div>
            </Link>

            <Link
              href="/about"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-3 text-stone-700 hover:bg-amber-50 transition-colors group"
            >
              <svg className="w-5 h-5 text-stone-500 group-hover:text-amber-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="text-sm font-medium">About Us</p>
                <p className="text-xs text-stone-500">Our mission</p>
              </div>
            </Link>

            <div className="border-t border-stone-100 my-2"></div>

            <Link
              href="/signout"
              className="flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 transition-colors group"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <div>
                <p className="text-sm font-medium">Sign Out</p>
                <p className="text-xs text-red-500">Log out of account</p>
              </div>
            </Link>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>
    </div>
  )
}
