import { PrismaClient } from '@prisma/client';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { authOptions } from "@/authOptions";
import LikeButton from '@/components/LikeButton';

const prisma = new PrismaClient();

async function getPost(slug: string) {
  if (!slug) return null;
  return await prisma.post.findUnique({
    where: { slug: slug },
    include: { 
      author: true,
      likes: true,
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

  return (
    <main className="min-h-screen bg-stone-50 pb-20">
      
      {/* 1. CINEMATIC HEADER SECTION */}
      <header className="bg-white border-b border-stone-200">
        <div className="max-w-4xl mx-auto px-6 pt-12 pb-8">
          <Link href="/blog" className="text-amber-700 hover:text-amber-800 text-sm font-medium transition-colors mb-8 inline-block">
            ← All Stories
          </Link>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-stone-900 leading-tight mb-6">
            {post.title}
          </h1>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center text-amber-800 font-bold">
                {post.author.name?.charAt(0)}
              </div>
              <div>
                <p className="text-sm font-bold text-stone-800">{post.author.name}</p>
                <p className="text-xs text-stone-500">{new Date(post.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
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

      {/* 2. HERO IMAGE */}
      <div className="max-w-5xl mx-auto px-0 md:px-6 -mt-4 md:mt-8">
        <div className="aspect-video w-full bg-stone-200 md:rounded-2xl overflow-hidden shadow-xl shadow-stone-200/50">
          {post.imageUrl ? (
            <img 
              src={post.imageUrl} 
              alt={post.title} 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-stone-400">
              No Image Provided
            </div>
          )}
        </div>
      </div>

      {/* 3. THE STORY CONTENT */}
      <article className="max-w-3xl mx-auto px-6 mt-12">
        <div className="bg-white p-8 md:p-12 rounded-2xl border border-stone-200 shadow-sm">
          
          {/* A. Subtitle (New Feature) */}
          {post.subtitle && (
            <h2 className="text-xl md:text-2xl text-stone-500 font-serif italic mb-8 leading-relaxed border-l-4 border-amber-500 pl-4">
              {post.subtitle}
            </h2>
          )}

          {/* B. Rich Text Content (Tiptap HTML) */}
          {/* We use 'prose' classes to automatically style the HTML (headings, bold, images) */}
          <div 
            className="prose prose-stone prose-lg md:prose-xl max-w-none 
            font-serif text-stone-700 leading-relaxed
            prose-headings:font-sans prose-headings:font-bold prose-headings:text-stone-900
            prose-a:text-amber-700 prose-a:no-underline hover:prose-a:underline
            prose-img:rounded-xl prose-img:shadow-md prose-img:my-8"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          <hr className="my-12 border-stone-100" />

          {/* FOOTER CALL TO ACTION */}
          <div className="bg-amber-50 rounded-xl p-8 text-center border border-amber-100">
            <h4 className="text-xl font-bold text-amber-900 mb-2">Did this story move you?</h4>
            <p className="text-amber-800/80 mb-6">Join "Sit With Me" to help us restore dignity to street children through more outreach like this.</p>
            {!session && (
              <Link 
                href="/register" 
                className="bg-amber-800 text-white px-8 py-3 rounded-full font-medium hover:bg-amber-900 transition-all inline-block"
              >
                Join our Community
              </Link>
            )}
          </div>
        </div>
      </article>

    </main>
  );
}