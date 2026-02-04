'use client'

import Link from 'next/link'
import { signOut } from 'next-auth/react'
import { useState } from 'react'

export default function SignOutPage() {
  const [isSigningOut, setIsSigningOut] = useState(false)

  const handleSignOut = async () => {
    setIsSigningOut(true)
    await signOut({ callbackUrl: '/' })
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-stone-50 via-white to-stone-100 flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md bg-white/90 backdrop-blur-sm border border-stone-200 rounded-2xl shadow-xl p-8 md:p-10 text-center">
        <h1 className="text-3xl md:text-4xl font-extrabold text-stone-900 font-serif mb-3">
          Leaving Already?
        </h1>
        <p className="text-stone-600 mb-8">
          You can come back anytime. We will keep your place warm.
        </p>

        <button
          onClick={handleSignOut}
          disabled={isSigningOut}
          className={`w-full py-3 rounded-full text-sm font-semibold text-white transition-all shadow-sm ${
            isSigningOut
              ? 'bg-stone-400 cursor-not-allowed'
              : 'bg-stone-800 hover:bg-stone-900 hover:shadow-md'
          }`}
        >
          {isSigningOut ? 'Signing Out...' : 'Sign Out'}
        </button>

        <div className="mt-6 text-sm text-stone-600">
          <Link href="/" className="text-amber-700 font-medium hover:text-amber-800">
            Return to home
          </Link>
        </div>
      </div>
    </main>
  )
}
