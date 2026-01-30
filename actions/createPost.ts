'use server'

import { PrismaClient } from '@prisma/client'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/authOptions'

const prisma = new PrismaClient()

export async function createPost(formData: FormData) {
  const session = await getServerSession(authOptions)
  if (!session || !session.user?.email) {
    throw new Error("Unauthorized")
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email }
  })
  
  if (!user || user.role !== 'ADMIN') {
    throw new Error("Unauthorized")
  }

  const title = formData.get('title') as string
  const subtitle = formData.get('subtitle') as string // <--- NEW
  const content = formData.get('content') as string
  const imageUrl = formData.get('imageUrl') as string

  const slug = title
    .toLowerCase()
    .replace(/ /g, '-')
    .replace(/[^\w-]+/g, '') + '-' + Date.now()

  await prisma.post.create({
    data: {
      title,
      subtitle, // <--- NEW
      slug,
      content, // This is now HTML
      imageUrl,
      published: true,
      authorId: user.id
    }
  })

  redirect(`/blog/${slug}`)
}