import { registerUser } from '@/actions/register'
import Link from 'next/link'

export default function RegisterPage() {
  return (
    <main className="max-w-md mx-auto mt-20 p-6 bg-white border border-stone-200 rounded-lg">
      <h1 className="text-2xl font-bold text-amber-900 mb-6 text-center">
        Join the Community
      </h1>

      {/* The form action points directly to our server function */}
      <form action={registerUser} className="space-y-4">
        
        <div>
          <label className="block text-sm font-medium text-stone-700">Full Name</label>
          <input 
            name="name" 
            type="text" 
            required
            className="w-full mt-1 p-2 border border-stone-300 rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-stone-700">Email Address</label>
          <input 
            name="email" 
            type="email" 
            required
            className="w-full mt-1 p-2 border border-stone-300 rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-stone-700">Password</label>
          <input 
            name="password" 
            type="password" 
            required
            className="w-full mt-1 p-2 border border-stone-300 rounded-md"
          />
        </div>

        <button 
          type="submit" 
          className="w-full bg-amber-700 text-white py-2 rounded-md hover:bg-amber-800 transition-colors"
        >
          Create Account
        </button>
      </form>

      <p className="mt-4 text-center text-sm text-stone-600">
        Already have an account?{' '}
        <Link href="/api/auth/signin" className="text-amber-700 underline">
          Sign In
        </Link>
      </p>
    </main>
  )
}