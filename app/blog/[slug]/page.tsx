import { PrismaClient } from '@prisma/client';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getServerSession } from 'next-auth'; // Import Session
import LikeButton from '@/components/LikeButton'; // Import new button

const prisma = new PrismaClient();

async function getPost(slug: string) {
  if (!slug) return null;

  const post = await prisma.post.findUnique({
    where: { slug: slug },
    include: { 
      author: true,
      likes: true, // Fetch likes
    },
  });

  return post;
}

type Props = {
  params: Promise<{ slug: string }>
}

export default async function SinglePostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    notFound(); 
  }

  // 1. Get current user session
  const session = await getServerSession();
  const userEmail = session?.user?.email;

  // 2. Check if current user has liked this post
  // We check if the 'likes' array contains a like with this user's email
  // (We need to fetch the user ID first normally, but let's do a quick filter here)
  
  // Note: For perfect accuracy, we should check ID, but for now let's pass the 
  // 'isGuest' flag and handle the rest.
  
  const isGuest = !session;
  
  // To check "isLikedByMe", we need to know the User ID. 
  // Let's do a quick DB lookup for the current user if they are logged in.
  let isLikedByMe = false;
  if (userEmail) {
    const user = await prisma.user.findUnique({ where: { email: userEmail }});
    if (user) {
      isLikedByMe = post.likes.some(like => like.userId === user.id);
    }
  }

  return (
    <article className="max-w-3xl mx-auto px-6 py-12">
      <div className="mb-8">
        <Link href="/blog" className="text-amber-700 hover:underline">
          ← Back to Feed
        </Link>
      </div>

      <header className="mb-8">
        <h1 className="text-4xl font-bold text-stone-900 mb-4 leading-tight">
          {post.title}
        </h1>
        <div className="flex items-center justify-between border-b border-stone-200 pb-6">
            <div className="flex items-center text-stone-500 text-sm">
                <span>By {post.author.name}</span>
                <span className="mx-2">•</span>
                <span>{new Date(post.createdAt).toLocaleDateString()}</span>
            </div>

            {/* HERE IS OUR NEW BUTTON */}
            <LikeButton 
                postId={post.id} 
                initialLikeCount={post.likes.length} 
                isLikedByMe={isLikedByMe}
                isGuest={isGuest}
            />
        </div>
      </header>

      {post.imageUrl && (
        <div className="mb-10 rounded-xl overflow-hidden shadow-sm">
          <img 
            src={post.imageUrl} 
            alt={post.title} 
            className="w-full h-auto object-cover"
          />
        </div>
      )}

      <div className="prose prose-stone prose-lg max-w-none text-stone-700">
        <p>{post.content}</p>
      </div>
    </article>
  );
}