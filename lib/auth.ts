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
        try {
          if (!credentials) {
            console.error("❌ [AUTH] No credentials provided")
            return null
          }

          // Handle access code login (for students)
          // Only process access code if it's provided and not empty/undefined
          const accessCodeValue = credentials.accessCode
          if (accessCodeValue && typeof accessCodeValue === 'string' && accessCodeValue.trim() && accessCodeValue.toLowerCase() !== 'undefined') {
            try {
              const accessCode = await db.accessCode.findUnique({
                where: { code: accessCodeValue.trim().toUpperCase() },
                include: {
                  student: {
                    include: {
                      user: true,
                    },
                  },
                },
              })

              if (!accessCode) {
                console.error("❌ [AUTH] Access code not found:", accessCodeValue.trim().toUpperCase())
                return null
              }

              if (!accessCode.isActive) {
                console.error("❌ [AUTH] Access code is inactive:", accessCodeValue.trim().toUpperCase())
                return null
              }

              const user = accessCode.student.user
              if (!user) {
                console.error("❌ [AUTH] User not found for access code")
                return null
              }

              if (!user.isActive) {
                console.error("❌ [AUTH] User account is inactive:", user.id)
                return null
              }

              return {
                id: user.id,
                email: user.email,
                phone: user.phone,
                name: user.name,
                role: user.role,
                schoolId: accessCode.student.schoolId,
              }
            } catch (error) {
              console.error("❌ [AUTH] Access code login error:", error)
              return null
            }
          }

          // Handle email/phone + password login
          if (!credentials.password) {
            console.error("❌ [AUTH] Password not provided")
            return null
          }

          // Build OR condition - ensure at least one identifier is provided
          const orConditions = []
          if (credentials.email && typeof credentials.email === 'string' && credentials.email.trim()) {
            orConditions.push({ email: credentials.email.trim().toLowerCase() })
          }
          if (credentials.phone && typeof credentials.phone === 'string' && credentials.phone.trim()) {
            orConditions.push({ phone: credentials.phone.trim() })
          }

          if (orConditions.length === 0) {
            console.error("❌ [AUTH] Neither email nor phone provided")
            return null
          }

          const user = await db.user.findFirst({
            where: {
              OR: orConditions,
            },
            include: {
              teacher: true,
              student: true,
              parent: true,
            },
          })

          if (!user) {
            console.error("❌ [AUTH] User not found with provided credentials")
            return null
          }

          if (!user.isActive) {
            console.error("❌ [AUTH] User account is inactive:", user.id)
            return null
          }

          if (!user.password) {
            console.error("❌ [AUTH] User has no password set:", user.id)
            return null
          }

          const isValidPassword = await bcrypt.compare(
            credentials.password as string,
            user.password
          )

          if (!isValidPassword) {
            console.error("❌ [AUTH] Invalid password for user:", user.id)
            return null
          }

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
        } catch (error) {
          console.error("❌ [AUTH] Authorization error:", error)
          return null
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

