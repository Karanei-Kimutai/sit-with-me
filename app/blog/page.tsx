import { PrismaClient } from '@prisma/client';
import Link from 'next/link';

const prisma = new PrismaClient();

async function getPosts() {
  const posts = await prisma.post.findMany({
    where: { published: true },
    orderBy: { createdAt: 'desc' },
    include: { author: true },
  });
  return posts;
}

export default async function BlogPage() {
  const posts = await getPosts();

  return (
    <main className="min-h-screen bg-stone-50">
      
      {/* 1. PAGE HEADER (Matches Home Hero) */}
      <section className="bg-stone-100 border-b border-stone-200 py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-amber-900 mb-4 tracking-tight">
            Our Stories
          </h1>
          <p className="text-xl text-stone-600 max-w-2xl mx-auto leading-relaxed">
            Chronicles of our visits, the friends we meet, and the moments that restore dignity.
          </p>
        </div>
      </section>

      {/* 2. THE FEED GRID */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          
          {posts.map((post) => (
            <Link key={post.id} href={`/blog/${post.slug}`} className="group block h-full">
              <article className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-stone-100 h-full flex flex-col">
                
                {/* Image Section with Zoom Effect */}
                <div className="h-56 bg-stone-200 overflow-hidden relative">
                  {post.imageUrl ? (
                    <img 
                      src={post.imageUrl} 
                      alt={post.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-stone-400 bg-stone-100">
                      <span className="text-4xl opacity-20">📷</span>
                    </div>
                  )}
                  
                  {/* Category/Date Badge (Optional flourish) */}
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-amber-900 shadow-sm">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </div>
                </div>
                
                {/* Content Section */}
                <div className="p-6 flex flex-col flex-grow">
                  <h2 className="text-xl font-bold text-stone-800 mb-3 group-hover:text-amber-800 transition-colors">
                    {post.title}
                  </h2>
                  <p className="text-stone-600 text-sm line-clamp-3 mb-6 flex-grow leading-relaxed">
                    {post.content}
                  </p>
                  
                  {/* Footer: Author */}
                  <div className="flex items-center justify-between pt-4 border-t border-stone-100 mt-auto">
                    <span className="text-xs font-medium text-stone-500">
                      Written by {post.author.name}
                    </span>
                    <span className="text-amber-700 text-sm font-medium group-hover:underline">
                      Read Story →
                    </span>
                  </div>
                </div>

              </article>
            </Link>
          ))}

        </div>

        {/* Empty State (Just in case) */}
        {posts.length === 0 && (
          <div className="text-center py-20">
            <h3 className="text-xl text-stone-500">No stories published yet.</h3>
          </div>
        )}
      </section>
    </main>
  );
}