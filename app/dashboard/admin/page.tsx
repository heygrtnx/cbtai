import { redirect } from "next/navigation"
import { requireAuth } from "@/lib/utils/auth"
import { UserRole } from "@prisma/client"
import { db } from "@/lib/db"
import { AdminDashboard } from "@/components/dashboard/admin-dashboard"

export default async function AdminDashboardPage() {
  const user = await requireAuth(UserRole.SCHOOL_ADMIN)

  const school = await db.school.findUnique({
    where: { id: user.schoolId! },
    include: {
      _count: {
        select: {
          students: true,
          teachers: true,
          exams: true,
        },
      },
    },
  })

  if (!school) {
    redirect("/auth/login")
  }

  return (
    <AdminDashboard
      user={user}
      school={school}
      numberOfStudentsPaid={school.numberOfStudents}
      licenseExpiry={school.licenseExpiry ? school.licenseExpiry.toISOString() : null}
    />
  )
}
