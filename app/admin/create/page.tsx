import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { PrismaClient } from "@prisma/client";
import { createPost } from "@/actions/createPost"; 
import { authOptions } from "@/authOptions"; // Import shared config

const prisma = new PrismaClient();

export default async function CreatePostPage() {
  // 1. GATEKEEPER: Check session using our specific options
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user?.email) {
    redirect("/api/auth/signin");
  }

  // 2. DOUBLE CHECK: Verify role from DB (safest method)
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

  // 3. Render the Form
  return (
    <main className="max-w-2xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold text-amber-900 mb-8">Write a New Story</h1>
      
      <form action={createPost} className="space-y-6">
        
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">Title</label>
          <input 
            type="text" 
            name="title" 
            required 
            placeholder="e.g. A Day in the Life..."
            className="w-full p-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
          />
        </div>

        {/* Image URL */}
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">Cover Image URL</label>
          <input 
            type="url" 
            name="imageUrl" 
            placeholder="https://..."
            className="w-full p-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
          />
          <p className="text-xs text-stone-500 mt-1">Paste a link to an image (e.g. from Unsplash)</p>
        </div>

        {/* Content */}
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">Story Content</label>
          <textarea 
            name="content" 
            required 
            rows={10}
            placeholder="Write your story here..."
            className="w-full p-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
          ></textarea>
        </div>

        <button 
          type="submit" 
          className="w-full bg-amber-700 text-white py-3 rounded-lg font-medium hover:bg-amber-800 transition-colors"
        >
          Publish Story
        </button>

      </form>
    </main>
  );
}