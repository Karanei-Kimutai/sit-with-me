import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { PrismaClient } from "@prisma/client";
import { createPost } from "@/actions/createPost";
import { authOptions } from "@/authOptions";
import Link from "next/link";

const prisma = new PrismaClient();

export default async function CreatePostPage() {
  // 1. GATEKEEPER
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user?.email) {
    redirect("/api/auth/signin");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email }
  });

  if (user?.role !== "ADMIN") {
    return (
      <main className="max-w-4xl mx-auto px-6 py-20 text-center">
        <h1 className="text-3xl font-bold text-stone-800">Access Denied</h1>
        <p className="text-stone-600 mt-2">You do not have permission to view this page.</p>
      </main>
    );
  }

  // 2. RENDER THE STUDIO
  return (
    <main className="min-h-screen bg-white">
      
      {/* THE FORM WRAPPER */}
      <form action={createPost}>
        
        {/* A. STICKY PUBLISH BAR */}
        <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-stone-100 px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-stone-400 hover:text-stone-600 transition-colors">
              ✕ <span className="sr-only">Cancel</span>
            </Link>
            <span className="text-sm font-medium text-stone-400">Drafting</span>
          </div>
          
          <button 
            type="submit" 
            className="bg-green-700 text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-green-800 transition-all"
          >
            Publish
          </button>
        </nav>

        {/* B. WRITING AREA */}
        <div className="max-w-3xl mx-auto px-6 py-12">
          
          {/* 1. Title Input */}
          <input 
            type="text" 
            name="title" 
            required 
            placeholder="Title"
            className="w-full text-5xl font-extrabold text-stone-900 placeholder:text-stone-300 border-none focus:ring-0 px-0 mb-6 bg-transparent"
            autoFocus
          />

          {/* 2. Image URL Input (Subtle) */}
          <div className="flex items-center gap-2 mb-8 text-stone-400 focus-within:text-amber-700 transition-colors">
            <span className="text-xl">📷</span>
            <input 
              type="url" 
              name="imageUrl" 
              placeholder="Paste a cover image link..."
              className="w-full text-sm font-medium text-stone-600 placeholder:text-stone-400 border-none focus:ring-0 bg-transparent p-0"
            />
          </div>

          {/* 3. The Story Editor */}
          {/* We use h-[calc] to make sure it fills the screen nicely */}
          <textarea 
            name="content" 
            required 
            placeholder="Tell your story..."
            className="w-full min-h-[60vh] text-xl text-stone-800 placeholder:text-stone-300 border-none focus:ring-0 px-0 bg-transparent font-serif leading-relaxed resize-y"
          ></textarea>

        </div>
      </form>

    </main>
  );
}