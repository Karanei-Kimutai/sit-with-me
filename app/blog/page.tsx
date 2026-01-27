import { PrismaClient } from '@prisma/client';
import Link from 'next/link';

// Initialize the database client
const prisma = new PrismaClient();

// This function fetches data from the DB
async function getPosts() {
  const posts = await prisma.post.findMany({
    where: { published: true },
    orderBy: { createdAt: 'desc' },
    include: { author: true }, // Join the author table
  });
  return posts;
}

export default async function BlogPage() {
  // Fetch the data
  const posts = await getPosts();

  return (
    <main className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold text-amber-900 mb-8">
        Latest Stories
      </h1>

      <div className="grid gap-8 md:grid-cols-2">
        {/* Loop through posts (like foreach in Blade) */}
        {posts.map((post) => (
          <article 
            key={post.id} 
            className="bg-white border border-stone-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
          >
            {/* Image Section */}
            {post.imageUrl && (
              <img 
                src={post.imageUrl} 
                alt={post.title} 
                className="w-full h-48 object-cover"
              />
            )}
            
            {/* Content Section */}
            <div className="p-6">
              <h2 className="text-xl font-bold text-stone-800 mb-2">
                {post.title}
              </h2>
              <p className="text-stone-600 text-sm mb-4 line-clamp-3">
                {post.content}
              </p>
              
              <div className="flex justify-between items-center mt-4">
                <span className="text-xs text-stone-500">
                  By {post.author.name}
                </span>
                <Link 
                  href={`/blog/${post.slug}`} 
                  className="text-amber-700 font-medium hover:underline"
                >
                  Read More →
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}