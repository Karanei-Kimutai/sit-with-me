'use server'

import { PrismaClient } from '@prisma/client'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/authOptions'
import { revalidatePath } from 'next/cache'

const prisma = new PrismaClient()

export async function addComment(postId: string, content: string) {
  // 1. Check authentication
  const session = await getServerSession(authOptions)
  
  if (!session || !session.user?.email) {
    throw new Error('You must be logged in to comment')
  }

  // 2. Find the user
  const user = await prisma.user.findUnique({
    where: { email: session.user.email }
  })

  if (!user) {
    throw new Error('User not found')
  }

  // 3. Validate content
  if (!content.trim()) {
    throw new Error('Comment cannot be empty')
  }

  if (content.length > 2000) {
    throw new Error('Comment is too long (max 2000 characters)')
  }

  // 4. Create the comment
  try {
    await prisma.comment.create({
      data: {
        content: content.trim(),
        userId: user.id,
        postId: postId,
      }
    })

    // 5. Revalidate the post page to show new comment
    revalidatePath(`/blog/[slug]`)
    
    return { success: true }
  } catch (error) {
    console.error('Error creating comment:', error)
    throw new Error('Failed to post comment')
  }
}