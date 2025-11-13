import { UserRole } from "@prisma/client"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"

export async function getCurrentUser() {
  const session = await auth()
  return session?.user
}

export async function requireAuth(requiredRole?: UserRole) {
  const user = await getCurrentUser()
  
  if (!user) {
    redirect("/auth/login")
  }

  if (requiredRole && user.role !== requiredRole) {
    redirect("/unauthorized")
  }

  return user
}

export async function requireSchoolAccess(schoolId?: string) {
  const user = await requireAuth()
  
  if (user.schoolId !== schoolId && user.role !== UserRole.SCHOOL_ADMIN) {
    redirect("/unauthorized")
  }

  return user
}

