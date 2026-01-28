import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "hello@example.com" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // 1. Check if user typed in stuff
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        // 2. Find user in DB
        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        })

        if (!user) {
          return null
        }

        // 3. Check password using bcrypt
        // We compare the typed password with the hashed password in DB
        const passwordsMatch = await bcrypt.compare(
          credentials.password, 
          user.password
        )

        if (!passwordsMatch) {
          return null
        }

        // 4. Return the user object (This creates the session)
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role, // We will use this later for Admin checks
        }
      }
    })
  ],
  // Optional: Custom pages (we can add our own later)
  // pages: {
  //   signIn: '/login',
  // },
  callbacks: {
    // This allows us to access the user's role in the session
    async session({ session, token }) {
      if (session?.user) {
        // @ts-ignore
        session.user.role = token.role; 
        // @ts-ignore
        session.user.id = token.id;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        // @ts-ignore
        token.role = user.role;
        // @ts-ignore
        token.id = user.id;
      }
      return token;
    }
  }
})

export { handler as GET, handler as POST }