import { PrismaClient } from '@prisma/client';
import { notFound } from 'next/navigation';
import Link from 'next/link';

const prisma = new PrismaClient();

async function getPost(slug: string) {
  if (!slug) return null; // Safety check

  const post = await prisma.post.findUnique({
    where: { slug: slug },
    include: { author: true },
  });

  return post;
}

type Props = {
  params: Promise<{ slug: string }>
}


export default async function SinglePostPage({ params }: Props) {
  const { slug } = await params;
  
  // Now pass the resolved slug
  const post = await getPost(slug);

  if (!post) {
    notFound(); 
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
        <div className="flex items-center text-stone-500 text-sm">
            <span>By {post.author.name}</span>
            <span className="mx-2">•</span>
            <span>{new Date(post.createdAt).toLocaleDateString()}</span>
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