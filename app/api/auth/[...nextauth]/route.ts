import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"
import { authOptions } from "@/authOptions";

const prisma = new PrismaClient()

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // 1. Check if inputs exist
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        // 2. Find user in DB
        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        })

        if (!user) return null

        // 3. Verify Password
        const passwordsMatch = await bcrypt.compare(
          credentials.password, 
          user.password
        )

        if (!passwordsMatch) return null

        // 4. Return user object (This starts the chain)
        // We explicitly include the role here so it gets passed to the JWT
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role, 
        }
      }
    })
  ],
  
  callbacks: {
    // 1. JWT Callback: Runs whenever a JSON Web Token is created or updated
    // This moves the 'role' from the User object (returned above) to the Token
    async jwt({ token, user }) {
      if (user) {
        // @ts-ignore
        token.role = user.role;
        // @ts-ignore
        token.id = user.id;
      }
      return token;
    },
    
    // 2. Session Callback: Runs whenever the frontend checks 'useSession()'
    // This moves the 'role' from the Token to the Session object the browser sees
    async session({ session, token }) {
      console.log("SESSION CALLBACK - Token Role:", token.role); // Check your terminal for this!

      return {
        ...session,
        user: {
          ...session.user,
          role: token.role,
          id: token.id
        }
      }
    }
  }
})

export { handler as GET, handler as POST }