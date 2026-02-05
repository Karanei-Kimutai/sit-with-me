import { registerUser } from '@/actions/register'
import Link from 'next/link'

export default function RegisterPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-stone-50 via-white to-stone-100 flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md bg-white/90 backdrop-blur-sm border border-stone-200 rounded-2xl shadow-xl p-8 md:p-10">
        <h1 className="text-3xl md:text-4xl font-extrabold text-stone-900 mb-2 text-center font-sans">
          Join the Community
        </h1>
        <p className="text-center text-stone-600 mb-8">
          Create your account and start sharing stories.
        </p>

        {/* The form action points directly to our server function */}
        <form action={registerUser} className="space-y-5">
        
          <div>
            <label className="block text-sm font-medium text-stone-700">Full Name</label>
            <input 
              name="name" 
              type="text" 
              required
              className="w-full mt-2 px-4 py-3 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-amber-400 bg-white text-stone-900 placeholder:text-stone-400"
              placeholder="Your name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700">Email Address</label>
            <input 
              name="email" 
              type="email" 
              required
              className="w-full mt-2 px-4 py-3 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-amber-400 bg-white text-stone-900 placeholder:text-stone-400"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700">Password</label>
            <input 
              name="password" 
              type="password" 
              required
              className="w-full mt-2 px-4 py-3 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-amber-400 bg-white text-stone-900 placeholder:text-stone-400"
              placeholder="Create a password"
            />
          </div>

          <button 
            type="submit" 
            className="w-full py-3 rounded-full text-sm font-semibold btn-primary transition-all shadow-sm hover:shadow-md"
          >
            Create Account
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-stone-600">
          Already have an account?{' '}
          <Link href="/signin" className="text-amber-700 font-medium hover:text-amber-800">
            Sign In
          </Link>
        </p>
      </div>
    </main>
  )
}
