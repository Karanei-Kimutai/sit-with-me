'use client'

import { Suspense, useState } from 'react'
import Link from 'next/link'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'

function SignInForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') ?? '/'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')

    const result = await signIn('credentials', {
      redirect: false,
      email,
      password,
      callbackUrl
    })

    if (result?.error) {
      setError('Invalid email or password.')
      setIsSubmitting(false)
      return
    }

    router.push(result?.url ?? callbackUrl)
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-stone-50 via-white to-stone-100 flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md bg-white/90 backdrop-blur-sm border border-stone-200 rounded-2xl shadow-xl p-8 md:p-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-extrabold text-stone-900 font-sans">
            Welcome Back
          </h1>
          <p className="text-stone-600 mt-2">
            Sign in to continue.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-stone-700">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full mt-2 px-4 py-3 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-amber-400 bg-white text-stone-900 placeholder:text-stone-400"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full mt-2 px-4 py-3 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-amber-400 bg-white text-stone-900 placeholder:text-stone-400"
              placeholder="Your password"
            />
          </div>

          {error && (
            <p className="text-sm text-red-600">{error}</p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-3 rounded-full text-sm font-semibold btn-primary transition-all shadow-sm ${
              isSubmitting ? 'opacity-60 cursor-not-allowed' : 'hover:shadow-md'
            }`}
          >
            {isSubmitting ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-stone-600">
          <span>New here?</span>{' '}
          <Link href="/register" className="text-amber-700 font-medium hover:text-amber-800">
            Create an account
          </Link>
        </div>
      </div>
    </main>
  )
}

export default function SignInPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-gradient-to-br from-stone-50 via-white to-stone-100 flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-md bg-white/90 backdrop-blur-sm border border-stone-200 rounded-2xl shadow-xl p-8 md:p-10">
            <div className="text-center mb-8">
              <h1 className="text-3xl md:text-4xl font-extrabold text-stone-900 font-sans">
                Welcome Back
              </h1>
              <p className="text-stone-600 mt-2">Loading...</p>
            </div>
          </div>
        </main>
      }
    >
      <SignInForm />
    </Suspense>
  )
}
