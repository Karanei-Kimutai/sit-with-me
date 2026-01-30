import { PrismaClient } from "@prisma/client";
import Link from "next/link";

const prisma = new PrismaClient();

// Fetch the latest 3 posts for the homepage preview
async function getLatestPosts() {
  return await prisma.post.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
    take: 3, // Only get the top 3
    include: { author: true },
  });
}

export default async function Home() {
  const latestPosts = await getLatestPosts();

  return (
    <main className="min-h-screen">
      
      {/* 1. HERO SECTION */}
      <section className="bg-stone-100 border-b border-stone-200">
        <div className="max-w-6xl mx-auto px-6 py-24 md:py-32 flex flex-col items-center text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold text-amber-900 tracking-tight mb-6">
            Restoring Dignity.
          </h1>
          <p className="text-xl text-stone-600 max-w-2xl mb-10 leading-relaxed">
            Sit With Me is a community dedicated to helping homeless people and street children 
            feel seen, valued, and cared for. We don't just give resources; we give our time.
          </p>
          <div className="flex gap-4">
            <Link 
              href="/register" 
              className="px-8 py-3 bg-amber-800 text-white rounded-full font-medium hover:bg-amber-900 transition-all shadow-sm hover:shadow-md"
            >
              Join the Community
            </Link>
            <Link 
              href="/about" 
              className="px-8 py-3 bg-white text-stone-700 border border-stone-300 rounded-full font-medium hover:bg-stone-50 transition-all"
            >
              Read Our Mission
            </Link>
          </div>
        </div>
      </section>

      {/* 2. MISSION PILLARS */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-12 text-center">
          <div>
            <div className="w-12 h-12 bg-amber-100 text-amber-800 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
              👁️
            </div>
            <h3 className="text-xl font-bold text-stone-800 mb-2">Be Seen</h3>
            <p className="text-stone-600">
              We acknowledge every individual we meet, proving that they are not invisible to the world.
            </p>
          </div>
          <div>
            <div className="w-12 h-12 bg-amber-100 text-amber-800 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
              🤝
            </div>
            <h3 className="text-xl font-bold text-stone-800 mb-2">Be Valued</h3>
            <p className="text-stone-600">
              We share stories and time, affirming the inherent worth that exists in every human being.
            </p>
          </div>
          <div>
            <div className="w-12 h-12 bg-amber-100 text-amber-800 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
              ❤️
            </div>
            <h3 className="text-xl font-bold text-stone-800 mb-2">Be Cared For</h3>
            <p className="text-stone-600">
              Beyond conversation, we mobilize our community to provide essential support and advocacy.
            </p>
          </div>
        </div>
      </section>

      {/* 3. LATEST STORIES */}
      <section className="py-20 bg-stone-50 border-t border-stone-200">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-bold text-stone-900 mb-2">Latest from the Streets</h2>
              <p className="text-stone-600">Read about our recent visits and the friends we've made.</p>
            </div>
            <Link href="/blog" className="text-amber-700 font-medium hover:underline hidden md:block">
              View all stories →
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {latestPosts.map((post) => (
              <Link key={post.id} href={`/blog/${post.slug}`} className="group">
                <article className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-stone-100 h-full flex flex-col">
                  {/* Image */}
                  <div className="h-48 bg-stone-200 overflow-hidden">
                    {post.imageUrl ? (
                      <img 
                        src={post.imageUrl} 
                        alt={post.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-stone-400">
                        No Image
                      </div>
                    )}
                  </div>
                  
                  {/* Content */}
                  <div className="p-6 flex flex-col flex-grow">
                    <h3 className="text-xl font-bold text-stone-800 mb-2 group-hover:text-amber-800 transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-stone-600 text-sm line-clamp-3 mb-4 flex-grow">
                      {post.content}
                    </p>
                    <div className="text-xs text-stone-400 mt-auto">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
          
          <div className="mt-8 text-center md:hidden">
            <Link href="/blog" className="text-amber-700 font-medium hover:underline">
              View all stories →
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}