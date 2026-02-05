import { PrismaClient } from '@prisma/client';
import Link from 'next/link';

const prisma = new PrismaClient();

async function getPosts() {
  const posts = await prisma.post.findMany({
    where: { published: true },
    orderBy: { createdAt: 'desc' },
    include: { 
      author: true,
      likes: true,
    },
  });
  return posts;
}

export default async function BlogPage() {
  const posts = await getPosts();

  const groupedPosts = posts.reduce((acc: any, post) => {
    const date = new Date(post.createdAt);
    const monthYear = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    
    if (!acc[monthYear]) {
      acc[monthYear] = [];
    }
    acc[monthYear].push(post);
    return acc;
  }, {});

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
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
      `}} />
      
      <main className="min-h-screen bg-gradient-to-b from-amber-50/30 via-stone-50 to-stone-100">
        
        <section className="relative bg-gradient-to-br from-amber-100 via-orange-50 to-stone-100 border-b border-amber-200/50">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmYjkyM2MiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE0YzMuMzEgMCA2IDIuNjkgNiA2cy0yLjY5IDYtNiA2LTYtMi42OS02LTYgMi42OS02IDYtNnpNNiAzNGMzLjMxIDAgNiAyLjY5IDYgNnMtMi42OSA2LTYgNi02LTIuNjktNi02IDIuNjktNiA2LTZ6TTM2IDM0YzMuMzEgMCA2IDIuNjkgNiA2cy0yLjY5IDYtNiA2LTYtMi42OS02LTYgMi42OS02IDYtNnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-40"></div>
          
          <div className="relative max-w-4xl mx-auto px-6 py-16 md:py-24 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-amber-950 mb-4 tracking-tight font-sans">
              Stories from the Streets
            </h1>
            <p className="text-lg md:text-xl text-amber-900/70 max-w-2xl mx-auto leading-relaxed font-light">
              Every encounter is a story. Every story is a step toward restoring dignity.
            </p>
            
            <div className="mt-8 flex items-center justify-center gap-2 text-sm text-amber-800/60">
              <div className="w-12 h-px bg-amber-300"></div>
              <span className="font-medium">{posts.length} stories shared</span>
              <div className="w-12 h-px bg-amber-300"></div>
            </div>
          </div>
        </section>

        <section className="max-w-4xl mx-auto px-6 py-16 md:py-24">
          
          {Object.entries(groupedPosts).length === 0 ? (
            <div className="text-center py-20">
              <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-2xl font-sans text-stone-700 mb-2">No stories yet</h3>
              <p className="text-stone-500">The first story is waiting to be written.</p>
            </div>
          ) : (
            Object.entries(groupedPosts).map(([monthYear, monthPosts]: [string, any], groupIndex) => (
              <div key={monthYear} className="relative">
                
                <div className="flex items-center gap-4 mb-12 sticky top-4 z-10 bg-stone-50/80 backdrop-blur-sm py-3 rounded-full px-6 border border-amber-200/30 shadow-sm w-fit">
                  <div className="w-3 h-3 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 shadow-lg shadow-amber-500/50"></div>
                  <span className="text-sm font-semibold text-amber-900 uppercase tracking-wider">
                    {monthYear}
                  </span>
                </div>

                <div className="absolute left-[1.6rem] top-16 bottom-0 w-px bg-gradient-to-b from-amber-300 via-amber-200 to-transparent" 
                     style={{ height: groupIndex === Object.entries(groupedPosts).length - 1 ? '0' : 'calc(100% - 4rem)' }}>
                </div>

                <div className="space-y-16 ml-16">
                  {monthPosts.map((post: any, postIndex: number) => {
                    const excerpt = post.content.replace(/<[^>]*>/g, '').substring(0, 180);
                    const date = new Date(post.createdAt);
                    
                    return (
                      <article 
                        key={post.id} 
                        className="group relative"
                        style={{
                          animation: `fadeInUp 0.6s ease-out ${postIndex * 0.1}s both`
                        }}
                      >
                        <div className="absolute -left-16 top-6 w-12 h-12 rounded-full bg-white border-2 border-amber-300 shadow-md flex items-center justify-center">
                          <div className="text-center">
                            <div className="text-xs font-bold text-amber-900 leading-none">
                              {date.getDate()}
                            </div>
                            <div className="text-[10px] text-amber-700 uppercase leading-none mt-0.5">
                              {date.toLocaleDateString('en-US', { month: 'short' })}
                            </div>
                          </div>
                        </div>

                        <Link href={`/blog/${post.slug}`} className="block">
                          <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1">
                            
                            {post.imageUrl && (
                              <div className="relative h-64 md:h-80 overflow-hidden bg-stone-100">
                                <img 
                                  src={post.imageUrl} 
                                  alt={post.title}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                              </div>
                            )}

                            <div className="p-8 md:p-10">
                              
                              <div className="flex items-center gap-3 mb-5">
                                <div className="w-10 h-10 bg-gradient-to-br from-amber-100 to-orange-100 rounded-full flex items-center justify-center border border-amber-200">
                                  <span className="text-sm font-bold text-amber-900">
                                    {post.author.name?.charAt(0)}
                                  </span>
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-stone-700">{post.author.name}</p>
                                  <p className="text-xs text-stone-400">
                                    {date.toLocaleDateString('en-US', { 
                                      weekday: 'long',
                                      month: 'long', 
                                      day: 'numeric', 
                                      year: 'numeric' 
                                    })}
                                  </p>
                                </div>
                              </div>

                              <h2 className="text-2xl md:text-3xl font-sans font-bold text-stone-900 mb-3 leading-tight group-hover:text-amber-900 transition-colors">
                                {post.title}
                              </h2>

                              {post.subtitle && (
                                <p className="text-lg text-amber-800/80 font-sans italic mb-4 leading-relaxed">
                                  {post.subtitle}
                                </p>
                              )}

                              <p className="text-stone-600 leading-relaxed mb-6">
                                {excerpt}
                                {post.content.length > 180 && '...'}
                              </p>

                              <div className="flex items-center justify-between pt-6 border-t border-stone-100">
                                <div className="flex items-center gap-4 text-sm text-stone-500">
                                  <div className="flex items-center gap-1.5">
                                    <svg className="w-4 h-4 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
                                      <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                                    </svg>
                                    <span className="font-medium">{post.likes.length}</span>
                                  </div>
                                </div>

                                <span className="text-sm font-medium text-amber-700 group-hover:text-amber-900 group-hover:gap-3 flex items-center gap-2 transition-all">
                                  Read story
                                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                  </svg>
                                </span>
                              </div>
                            </div>
                          </div>
                        </Link>
                      </article>
                    );
                  })}
                </div>
              </div>
            ))
          )}

        </section>

        <section className="border-t border-amber-200/50 bg-gradient-to-br from-amber-50 via-orange-50/30 to-stone-50 py-20">
          <div className="max-w-2xl mx-auto px-6 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-amber-500/30">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <h2 className="text-3xl font-sans font-bold text-stone-900 mb-4">
              Join our journey
            </h2>
            <p className="text-lg text-stone-600 mb-8 leading-relaxed">
              Every story you read represents a life touched, a conversation shared, and dignity restored. 
              Be part of this community.
            </p>
            <Link 
              href="/register" 
              className="inline-block btn-primary px-8 py-4 rounded-full font-medium transition-all shadow-lg hover:shadow-xl hover:scale-105"
            >
              Become a member
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}
