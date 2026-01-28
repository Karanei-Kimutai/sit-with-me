import Link from 'next/link';
import { getServerSession } from "next-auth";

export default async function Navbar() {
  // Check the session
  const session = await getServerSession();

  return (
    <nav className="bg-stone-100 border-b border-stone-200 py-4">
      <div className="max-w-4xl mx-auto px-6 flex justify-between items-center">
        {/* Logo */}
        <div className="text-xl font-bold text-amber-800">
          <Link href="/">Sit With Me</Link>
        </div>

        {/* Links */}
        <div className="flex items-center space-x-6 text-stone-600 font-medium">
          <Link href="/" className="hover:text-amber-700 transition-colors">Home</Link>
          <Link href="/blog" className="hover:text-amber-700 transition-colors">Stories</Link>
          
          {/* Dynamic Section */}
          {session ? (
            <div className="flex items-center gap-4">
              <span className="text-sm text-stone-500">
                Hi, {session.user?.name}
              </span>
              <Link 
                href="/api/auth/signout" 
                className="text-sm bg-stone-200 px-3 py-1 rounded hover:bg-stone-300 transition"
              >
                Logout
              </Link>
            </div>
          ) : (
            <>
              <Link href="/api/auth/signin" className="hover:text-amber-700 transition-colors">
                Login
              </Link>
              <Link 
                href="/register" 
                className="bg-amber-700 text-white px-4 py-2 rounded hover:bg-amber-800 transition"
              >
                Join Us
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}