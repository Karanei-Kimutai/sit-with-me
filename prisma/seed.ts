import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()


async function main() {
  // 1. Create a User
  const hashedPassword = await bcrypt.hash('password123', 10)
  const user = await prisma.user.upsert({
    where: { email: 'admin@sitwithme.org' },
    update: {},
    create: {
      email: 'admin@sitwithme.org',
      name: 'SitWithMe Admin',
      password: hashedPassword,
      role: 'ADMIN',
    },
  })

  console.log({ user })

  // 2. Create the First Post
  const post1 = await prisma.post.upsert({
    where: { slug: 'our-first-outreach' },
    update: {},
    create: {
      title: 'Our First Outreach Visit',
      slug: 'our-first-outreach',
      content: 'We visited the streets of Eldoret today. The spirit of the children was inspiring...',
      published: true,
      imageUrl: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=1000&auto=format&fit=crop',
      authorId: user.id,
    },
  })

  // 3. Create the Second Post
  const post2 = await prisma.post.upsert({
    where: { slug: 'community-dinner' },
    update: {},
    create: {
      title: 'Community Dinner Night',
      slug: 'community-dinner',
      content: 'Sharing a meal is the oldest form of bonding. Last night we shared food and stories...',
      published: true,
      imageUrl: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?q=80&w=1000&auto=format&fit=crop',
      authorId: user.id,
    },
  })

  console.log({ post1, post2 })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })