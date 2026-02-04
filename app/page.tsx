import { PrismaClient } from "@prisma/client";
import Link from "next/link";

const prisma = new PrismaClient();

async function getLatestPosts() {
  return await prisma.post.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
    take: 3,
    include: { 
      author: true,
      likes: true,
    },
  });
}

export default async function Home() {
  const latestPosts = await getLatestPosts();

  return (
    <main className="min-h-screen">
      
      {/* HERO SECTION */}
      <section className="relative bg-gradient-to-br from-amber-100 via-orange-50 to-stone-100 border-b border-amber-200/50">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmYjkyM2MiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE0YzMuMzEgMCA2IDIuNjkgNiA2cy0yLjY5IDYtNiA2LTYtMi42OS02LTYgMi42OS02IDYtNnpNNiAzNGMzLjMxIDAgNiAyLjY5IDYgNnMtMi42OSA2LTYgNi02LTIuNjktNi02IDIuNjktNiA2LTZ6TTM2IDM0YzMuMzEgMCA2IDIuNjkgNiA2cy0yLjY5IDYtNiA2LTYtMi42OS02LTYgMi42OS02IDYtNnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-40"></div>
        
        <div className="relative max-w-6xl mx-auto px-6 py-24 md:py-32 flex flex-col items-center text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-amber-950 tracking-tight mb-6 font-serif">
            Restoring Dignity.
          </h1>
          <p className="text-xl text-amber-900/70 max-w-2xl mb-10 leading-relaxed font-light">
            Sit With Me is a community dedicated to helping homeless people and street children 
            feel seen, valued, and cared for. We don&apos;t just give resources; we give our time.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link 
              href="/register" 
              className="px-8 py-3 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-full font-medium hover:from-amber-700 hover:to-orange-700 transition-all shadow-lg hover:shadow-xl hover:scale-105"
            >
              Join the Community
            </Link>
            <Link 
              href="/about" 
              className="px-8 py-3 bg-white text-amber-900 border-2 border-amber-300 rounded-full font-medium hover:bg-amber-50 transition-all"
            >
              Read Our Mission
            </Link>
          </div>
        </div>
      </section>

      {/* MISSION PILLARS */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-12 text-center">
          <div className="group">
            <div className="w-16 h-16 bg-gradient-to-br from-amber-100 to-orange-100 text-amber-800 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl border-2 border-amber-200 group-hover:scale-110 transition-transform">
              👁️
            </div>
            <h3 className="text-xl font-bold text-stone-800 mb-2 font-serif">Be Seen</h3>
            <p className="text-stone-600 leading-relaxed">
              We acknowledge every individual we meet, proving that they are not invisible to the world.
            </p>
          </div>
          <div className="group">
            <div className="w-16 h-16 bg-gradient-to-br from-amber-100 to-orange-100 text-amber-800 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl border-2 border-amber-200 group-hover:scale-110 transition-transform">
              🤝
            </div>
            <h3 className="text-xl font-bold text-stone-800 mb-2 font-serif">Be Valued</h3>
            <p className="text-stone-600 leading-relaxed">
              We share stories and time, affirming the inherent worth that exists in every human being.
            </p>
          </div>
          <div className="group">
            <div className="w-16 h-16 bg-gradient-to-br from-amber-100 to-orange-100 text-amber-800 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl border-2 border-amber-200 group-hover:scale-110 transition-transform">
              ❤️
            </div>
            <h3 className="text-xl font-bold text-stone-800 mb-2 font-serif">Be Cared For</h3>
            <p className="text-stone-600 leading-relaxed">
              Beyond conversation, we mobilize our community to provide essential support and advocacy.
            </p>
          </div>
        </div>
      </section>

      {/* LATEST STORIES - TIMELINE PREVIEW */}
      <section className="py-20 bg-gradient-to-b from-stone-50 to-amber-50/30 border-t border-amber-200/50">
        <div className="max-w-5xl mx-auto px-6">
          
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-stone-900 mb-3 font-serif">
              Latest from the Streets
            </h2>
            <p className="text-lg text-stone-600 max-w-2xl mx-auto leading-relaxed">
              Read about our recent visits and the friends we&apos;ve made.
            </p>
            <div className="mt-6 flex items-center justify-center gap-2 text-sm text-amber-800/60">
              <div className="w-12 h-px bg-amber-300"></div>
              <span className="font-medium">Recent stories</span>
              <div className="w-12 h-px bg-amber-300"></div>
            </div>
          </div>

          {/* Stories Preview */}
          {latestPosts.length > 0 ? (
            <div className="space-y-8">
              {latestPosts.map((post, index) => {
                const excerpt = post.content.replace(/<[^>]*>/g, '').substring(0, 150);
                const date = new Date(post.createdAt);
                
                return (
                  <Link 
                    key={post.id} 
                    href={`/blog/${post.slug}`} 
                    className="group block"
                    style={{
                      animation: `fadeInUp 0.6s ease-out ${index * 0.15}s both`
                    }}
                  >
                    <article className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1">
                      
                      <div className="flex flex-col md:flex-row">
                        {/* Image */}
                        {post.imageUrl && (
                          <div className="md:w-2/5 h-64 md:h-auto overflow-hidden bg-stone-100">
                            <img 
                              src={post.imageUrl} 
                              alt={post.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                            />
                          </div>
                        )}
                        
                        {/* Content */}
                        <div className={`${post.imageUrl ? 'md:w-3/5' : 'w-full'} p-8 md:p-10 flex flex-col justify-between`}>
                          <div>
                            {/* Date & Author */}
                            <div className="flex items-center gap-3 mb-4">
                              <div className="w-8 h-8 bg-gradient-to-br from-amber-100 to-orange-100 rounded-full flex items-center justify-center border border-amber-200">
                                <span className="text-xs font-bold text-amber-900">
                                  {post.author.name?.charAt(0)}
                                </span>
                              </div>
                              <div>
                                <p className="text-sm font-medium text-stone-700">{post.author.name}</p>
                                <p className="text-xs text-stone-400">
                                  {date.toLocaleDateString('en-US', { 
                                    month: 'long', 
                                    day: 'numeric', 
                                    year: 'numeric' 
                                  })}
                                </p>
                              </div>
                            </div>

                            {/* Title */}
                            <h3 className="text-2xl md:text-3xl font-serif font-bold text-stone-900 mb-3 leading-tight group-hover:text-amber-900 transition-colors">
                              {post.title}
                            </h3>

                            {/* Excerpt */}
                            <p className="text-stone-600 leading-relaxed line-clamp-3">
                              {excerpt}...
                            </p>
                          </div>

                          {/* Footer */}
                          <div className="flex items-center justify-between mt-6 pt-6 border-t border-stone-100">
                            <div className="flex items-center gap-1.5 text-sm text-stone-500">
                              <svg className="w-4 h-4 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                              </svg>
                              <span className="font-medium">{post.likes.length}</span>
                            </div>

                            <span className="text-sm font-medium text-amber-700 group-hover:text-amber-900 flex items-center gap-2 group-hover:gap-3 transition-all">
                              Read story
                              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </span>
                          </div>
                        </div>
                      </div>
                    </article>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-2xl border border-stone-200">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-xl font-serif text-stone-700 mb-2">No stories yet</h3>
              <p className="text-stone-500">The first story is waiting to be written.</p>
            </div>
          )}

          {/* View All Link */}
          {latestPosts.length > 0 && (
            <div className="mt-12 text-center">
              <Link 
                href="/blog" 
                className="inline-flex items-center gap-2 px-6 py-3 bg-white border-2 border-amber-300 text-amber-900 rounded-full font-medium hover:bg-amber-50 transition-all shadow-sm hover:shadow-md"
              >
                View all stories
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          )}
        </div>
      </section>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </main>
  );
}