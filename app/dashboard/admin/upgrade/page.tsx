import { redirect } from "next/navigation"
import { requireAuth } from "@/lib/utils/auth"
import { UserRole } from "@prisma/client"
import { db } from "@/lib/db"
import { UpgradePage } from "@/components/dashboard/upgrade-page"

export default async function AdminUpgradePage() {
  const user = await requireAuth(UserRole.SCHOOL_ADMIN)

  const school = await db.school.findUnique({
    where: { id: user.schoolId! },
  })

  if (!school) {
    redirect("/auth/login")
  }

  return <UpgradePage school={school} currentStudentsPaid={school.numberOfStudents} />
}

