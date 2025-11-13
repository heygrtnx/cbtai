import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { db } from "./db"
import bcrypt from "bcryptjs"
import { UserRole } from "@prisma/client"

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        phone: { label: "Phone", type: "text" },
        password: { label: "Password", type: "password" },
        accessCode: { label: "Access Code", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials) return null

        // Handle access code login (for students)
        if (credentials.accessCode && typeof credentials.accessCode === 'string') {
          const accessCode = await db.accessCode.findUnique({
            where: { code: credentials.accessCode.toUpperCase() },
            include: {
              student: {
                include: {
                  user: true,
                },
              },
            },
          })

          if (!accessCode || !accessCode.isActive) return null

          const user = accessCode.student.user
          if (!user.isActive) return null

          return {
            id: user.id,
            email: user.email,
            phone: user.phone,
            name: user.name,
            role: user.role,
            schoolId: accessCode.student.schoolId,
          }
        }

        // Handle email/phone + password login
        if (!credentials.password) return null
        
        const user = await db.user.findFirst({
          where: {
            OR: [
              ...(credentials.email ? [{ email: credentials.email }] : []),
              ...(credentials.phone ? [{ phone: credentials.phone }] : []),
            ],
          },
          include: {
            teacher: true,
            student: true,
            parent: true,
          },
        })

        if (!user || !user.isActive) return null

        const isValidPassword = await bcrypt.compare(
          credentials.password as string,
          user.password
        )

        if (!isValidPassword) return null

        // Update last login
        await db.user.update({
          where: { id: user.id },
          data: { lastLogin: new Date() },
        })

        return {
          id: user.id,
          email: user.email,
          phone: user.phone,
          name: user.name,
          role: user.role,
          schoolId: user.schoolId,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role
        token.schoolId = user.schoolId
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as UserRole
        session.user.schoolId = token.schoolId as string | null
      }
      return session
    },
  },
  pages: {
    signIn: "/auth/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
})

