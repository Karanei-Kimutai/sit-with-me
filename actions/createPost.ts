'use server'

import { PrismaClient } from '@prisma/client'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'

const prisma = new PrismaClient()

export async function createPost(formData: FormData) {
  //1. Verify the user is authenticated
  const session = await getServerSession()
  if (!session || !session.user?.email) {
    throw new Error("Unauthorized")
  }

  // 2. Get the User ID
  const user = await prisma.user.findUnique({
    where: { email: session.user.email }
  })
  
  if (!user || user.role !== 'ADMIN') {
    throw new Error("Unauthorized")
  }

  // 3. Extract Data
  const title = formData.get('title') as string
  const content = formData.get('content') as string
  const imageUrl = formData.get('imageUrl') as string

  // 4. Create a Slug (e.g., "Hello World" -> "hello-world")
  // We add a random number to ensure uniqueness
  const slug = title
    .toLowerCase()
    .replace(/ /g, '-')
    .replace(/[^\w-]+/g, '') + '-' + Date.now()

  // 5. Save to DB
  await prisma.post.create({
    data: {
      title,
      slug,
      content,
      imageUrl,
      published: true,
      authorId: user.id
    }
  })

  // 6. Redirect to the new post
  redirect(`/blog/${slug}`)
}