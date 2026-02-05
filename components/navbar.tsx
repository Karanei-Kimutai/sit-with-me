"use client";

import Link from 'next/link';
import { useSession } from "next-auth/react";
import UserDropdown from './UserDropdown';

export default function Navbar() {
  const { data: session, status } = useSession();
  const isAuthed = status === 'authenticated';

  return (
    <nav className="bg-gradient-to-r from-amber-50 via-orange-50/50 to-amber-50 border-b border-amber-200/50 sticky top-0 z-40 backdrop-blur-sm bg-opacity-95 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo Section */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-amber-950 tracking-tight font-sans group-hover:text-amber-900 transition-colors">
                Sit With Me
              </span>
              <span className="text-[10px] text-amber-700 uppercase tracking-wider font-medium -mt-1">
                Community & Care
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link 
              href="/" 
              className="text-stone-700 hover:text-amber-900 font-medium transition-colors relative group py-2"
            >
              Home
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-amber-500 group-hover:w-full transition-all duration-300"></span>
            </Link>
            
            <Link 
              href="/blog" 
              className="text-stone-700 hover:text-amber-900 font-medium transition-colors relative group py-2"
            >
              Stories
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-amber-500 group-hover:w-full transition-all duration-300"></span>
            </Link>

            <Link 
              href="/about" 
              className="text-stone-700 hover:text-amber-900 font-medium transition-colors relative group py-2"
            >
              About
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-amber-500 group-hover:w-full transition-all duration-300"></span>
            </Link>
          </div>

          {/* Right Section - Auth */}
          <div className="flex items-center gap-4">
            {isAuthed ? (
              <>
                {/* Admin Write Button */}
                {(session?.user as any)?.role === 'ADMIN' && (
                  <Link 
                    href="/admin/create" 
                    className="hidden sm:flex items-center gap-2 btn-primary px-4 py-2 rounded-full text-sm font-medium transition-all shadow-sm hover:shadow-md"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Write Story
                  </Link>
                )}

                {/* User Dropdown */}
                <UserDropdown 
                  userName={session?.user?.name || 'Member'} 
                  userEmail={session?.user?.email || ''}
                  isAdmin={(session?.user as any)?.role === 'ADMIN'}
                />
              </>
            ) : (
              <>
                <Link 
                  href="/signin" 
                  className="hidden sm:block text-stone-700 hover:text-amber-900 font-medium transition-colors"
                >
                  Sign In
                </Link>
                <Link 
                  href="/register" 
                  className="btn-primary px-5 py-2 rounded-full text-sm font-medium transition-all shadow-sm hover:shadow-md"
                >
                  Join Us
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden pb-4 flex gap-4 border-t border-amber-200/50 pt-4 mt-2">
          <Link 
            href="/" 
            className="flex-1 text-center text-sm text-stone-700 hover:text-amber-900 font-medium transition-colors py-2"
          >
            Home
          </Link>
          <Link 
            href="/blog" 
            className="flex-1 text-center text-sm text-stone-700 hover:text-amber-900 font-medium transition-colors py-2"
          >
            Stories
          </Link>
          <Link 
            href="/about" 
            className="flex-1 text-center text-sm text-stone-700 hover:text-amber-900 font-medium transition-colors py-2"
          >
            About
          </Link>
        </div>
      </div>
    </nav>
  );
}
