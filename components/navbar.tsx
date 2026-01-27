import Link from 'next/link';

export default function Navbar() {
    return (
    <nav className="bg-stone-100 border-b border-stone-200 py-4">
      <div className="max-w-4xl mx-auto px-6 flex justify-between items-center">
        {/* Logo / Brand Name */}
        <div className="text-xl font-bold text-amber-800">
          <Link href="/">Sit With Me</Link>
        </div>

        {/* Navigation Links */}
        <div className="space-x-6 text-stone-600 font-medium">
          <Link href="/" className="hover:text-amber-700 transition-colors">
            Home
          </Link>
          <Link href="/about" className="hover:text-amber-700 transition-colors">
            About Us
          </Link>
          <Link href="/join" className="hover:text-amber-700 transition-colors">
            Join
          </Link>
        </div>
      </div>
    </nav>
  );
}