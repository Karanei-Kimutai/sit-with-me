import { PrismaClient } from '@prisma/client';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { authOptions } from "@/authOptions";
import LikeButton from '@/components/LikeButton';
import CommentSection from '@/components/CommentSection';

const prisma = new PrismaClient();

async function getPost(slug: string) {
  if (!slug) return null;
  return await prisma.post.findUnique({
    where: { slug: slug },
    include: { 
      author: true,
      likes: true,
      comments: {
        include: {
          user: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      },
    },
  });
}

async function getNextPost(currentPostDate: Date) {
  return await prisma.post.findFirst({
    where: {
      published: true,
      createdAt: { lt: currentPostDate },
    },
    orderBy: {
      createdAt: 'desc',
    },
    select: {
      slug: true,
      title: true,
      imageUrl: true,
    },
  });
}

type Props = {
  params: Promise<{ slug: string }>
}

export default async function SinglePostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) notFound();

  const session = await getServerSession(authOptions);
  const userEmail = session?.user?.email;
  const isGuest = !session;

  let isLikedByMe = false;
  if (userEmail) {
    const user = await prisma.user.findUnique({ where: { email: userEmail }});
    if (user) {
      isLikedByMe = post.likes.some(like => like.userId === user.id);
    }
  }

  const nextPost = await getNextPost(post.createdAt);
  const date = new Date(post.createdAt);

  return (
    <main className="min-h-screen bg-gradient-to-b from-amber-50/30 via-white to-stone-50">
      
      {/* BACK NAVIGATION */}
      <div className="bg-white border-b border-stone-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <Link 
            href="/blog" 
            className="inline-flex items-center gap-2 text-amber-700 hover:text-amber-900 text-sm font-medium transition-colors group"
          >
            <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            All Stories
          </Link>
        </div>
      </div>

      {/* ARTICLE HEADER */}
      <header className="bg-white">
        <div className="max-w-4xl mx-auto px-6 pt-12 pb-8">
          
          {/* Date Badge */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-100 to-orange-100 border-2 border-amber-300 flex items-center justify-center shadow-sm">
              <div className="text-center">
                <div className="text-sm font-bold text-amber-900 leading-none">
                  {date.getDate()}
                </div>
                <div className="text-[10px] text-amber-700 uppercase leading-none mt-0.5">
                  {date.toLocaleDateString('en-US', { month: 'short' })}
                </div>
              </div>
            </div>
            <div>
              <p className="text-xs text-stone-400 uppercase tracking-wide font-medium">Published</p>
              <p className="text-sm text-stone-600">
                {date.toLocaleDateString('en-US', { 
                  weekday: 'long',
                  month: 'long', 
                  day: 'numeric', 
                  year: 'numeric' 
                })}
              </p>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-stone-900 leading-tight mb-6 font-sans">
            {post.title}
          </h1>

          {/* Subtitle */}
          {post.subtitle && (
            <p className="text-xl md:text-2xl text-amber-800/80 font-sans italic mb-8 leading-relaxed">
              {post.subtitle}
            </p>
          )}

          {/* Author & Meta */}
          <div className="flex items-center justify-between flex-wrap gap-4 pt-6 border-t border-stone-200">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-100 to-orange-100 rounded-full flex items-center justify-center border-2 border-amber-200">
                <span className="text-lg font-bold text-amber-900">
                  {post.author.name?.charAt(0)}
                </span>
              </div>
              <div>
                <p className="text-sm font-bold text-stone-800">{post.author.name}</p>
                <p className="text-xs text-stone-500">Story author</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <LikeButton 
                postId={post.id} 
                initialLikeCount={post.likes.length} 
                isLikedByMe={isLikedByMe}
                isGuest={isGuest}
              />
            </div>
          </div>
        </div>
      </header>

      {/* HERO IMAGE */}
      {post.imageUrl && (
        <div className="max-w-4xl mx-auto px-6 py-6">
          <div className="aspect-[16/9] w-full bg-stone-200 rounded-2xl overflow-hidden shadow-xl shadow-stone-300/40 border border-stone-200">
            <img 
              src={post.imageUrl} 
              alt={post.title} 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      )}

      {/* STORY CONTENT */}
      <article className="max-w-4xl mx-auto px-6 py-12">
        <div className="bg-white/80 backdrop-blur-sm p-8 md:p-14 rounded-2xl border border-stone-200 shadow-sm">
          
          {/* Rich Text Content */}
          <div 
            className="prose prose-stone prose-lg md:prose-xl max-w-none 
            text-stone-700 leading-relaxed
            prose-headings:font-sans prose-headings:font-bold prose-headings:text-stone-900 prose-headings:mt-12 prose-headings:mb-6
            prose-p:mb-6 prose-p:leading-relaxed
            prose-a:text-amber-700 prose-a:no-underline prose-a:border-b prose-a:border-amber-300 hover:prose-a:border-amber-700 prose-a:transition-colors
            prose-img:rounded-xl prose-img:shadow-lg prose-img:my-10 prose-img:border prose-img:border-stone-200
            prose-blockquote:border-l-4 prose-blockquote:border-amber-500 prose-blockquote:bg-amber-50/50 prose-blockquote:py-4 prose-blockquote:px-6 prose-blockquote:rounded-r-lg prose-blockquote:not-italic prose-blockquote:my-8
            prose-strong:text-stone-900 prose-strong:font-bold
            prose-ul:my-6 prose-ol:my-6
            prose-li:my-2"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Story Footer */}
          <div className="mt-12 pt-8 border-t border-stone-200">
            <div className="flex items-center justify-between text-sm text-stone-500">
              <span>Written with care by {post.author.name}</span>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                </svg>
                <span className="font-medium">{post.likes.length} {post.likes.length === 1 ? 'person' : 'people'} appreciated this</span>
              </div>
            </div>
          </div>
        </div>
      </article>

      {/* CALL TO ACTION */}
      <section className="max-w-3xl mx-auto px-6 pb-12">
        <div className="bg-gradient-to-br from-amber-50 via-orange-50/50 to-amber-50 rounded-2xl p-8 md:p-10 text-center border-2 border-amber-200/50 shadow-lg">
          <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-amber-500/30">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
          <h4 className="text-2xl font-bold text-amber-950 mb-3 font-sans">Did this story move you?</h4>
          <p className="text-amber-900/80 mb-6 leading-relaxed max-w-lg mx-auto">
            Join &quot;Sit With Me&quot; to help us restore dignity to street children through more outreach like this.
          </p>
          {!session ? (
            <Link 
              href="/register" 
              className="inline-block bg-gradient-to-r from-amber-600 to-orange-600 text-white px-8 py-3 rounded-full font-medium hover:from-amber-700 hover:to-orange-700 transition-all shadow-lg hover:shadow-xl hover:scale-105"
            >
              Join our Community
            </Link>
          ) : (
            <p className="text-sm text-amber-800 font-medium">
              Thank you for being part of our community! 🤝
            </p>
          )}
        </div>
      </section>

      {/* COMMENTS SECTION */}
      <section className="max-w-3xl mx-auto px-6 pb-12">
        <CommentSection 
          postId={post.id} 
          comments={post.comments}
          isGuest={isGuest}
        />
      </section>

      {/* READ NEXT */}
      {nextPost && (
        <section className="max-w-3xl mx-auto px-6 pb-20">
          <div className="border-t border-stone-200 pt-12">
            <p className="text-sm font-medium text-stone-500 uppercase tracking-wide mb-6">Read Next</p>
            <Link 
              href={`/blog/${nextPost.slug}`}
              className="group block bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1"
            >
              <div className="flex flex-col sm:flex-row">
                {nextPost.imageUrl && (
                  <div className="sm:w-2/5 h-48 sm:h-auto overflow-hidden bg-stone-100">
                    <img 
                      src={nextPost.imageUrl} 
                      alt={nextPost.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                )}
                <div className={`${nextPost.imageUrl ? 'sm:w-3/5' : 'w-full'} p-6 md:p-8 flex flex-col justify-center`}>
                  <h3 className="text-2xl font-sans font-bold text-stone-900 mb-2 group-hover:text-amber-900 transition-colors">
                    {nextPost.title}
                  </h3>
                  <span className="text-sm font-medium text-amber-700 group-hover:text-amber-900 flex items-center gap-2 group-hover:gap-3 transition-all">
                    Continue reading
                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </div>
              </div>
            </Link>
          </div>
        </section>
      )}
    </main>
  );
}
