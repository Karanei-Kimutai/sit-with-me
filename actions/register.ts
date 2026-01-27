'use server'

import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { redirect } from 'next/navigation'

const prisma = new PrismaClient()

export async function registerUser(formData: FormData) {
  // 1. Get data from the form
  const name = formData.get('name') as string
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  // 2. Validate (Basic check)
  if (!email || !password || !name) {
    throw new Error('Please fill in all fields')
  }

  // 3. Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email }
  })

  if (existingUser) {
    // In a real app, we'd return an error to the form. 
    // For now, let's just log it and stop.
    console.log("User already exists")
    return
  }

  // 4. Hash the password
  const hashedPassword = await bcrypt.hash(password, 10)

  // 5. Create the User in DB
  await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role: 'MEMBER', // Default role
    }
  })

  // 6. Redirect to login page (upcoming)
  redirect('/api/auth/signin') 
}