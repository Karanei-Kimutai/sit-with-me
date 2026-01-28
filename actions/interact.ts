'use server'

import { PrismaClient } from '@prisma/client'
import { getServerSession } from 'next-auth'
import { revalidatePath } from 'next/cache'

const prisma = new PrismaClient()

export async function toggleLike(postId: string) {
  // 1. Check if user is logged in
  const session = await getServerSession()
  if (!session || !session.user?.email) {
    throw new Error("You must be logged in to like.")
  }

  // 2. Get the user's ID from the DB
  const user = await prisma.user.findUnique({
    where: { email: session.user.email }
  })

  if (!user) throw new Error("User not found")

  // 3. Check if they already liked this post
  const existingLike = await prisma.like.findUnique({
    where: {
      userId_postId: {
        userId: user.id,
        postId: postId
      }
    }
  })

  if (existingLike) {
    // Unlike
    await prisma.like.delete({
      where: { id: existingLike.id }
    })
  } else {
    // Like
    await prisma.like.create({
      data: {
        userId: user.id,
        postId: postId
      }
    })
  }

  // 4. Refresh the page data so the number updates immediately
  revalidatePath(`/blog`) 
}