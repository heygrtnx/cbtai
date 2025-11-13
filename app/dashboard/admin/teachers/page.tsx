import { redirect } from "next/navigation"
import { requireAuth } from "@/lib/utils/auth"
import { UserRole } from "@prisma/client"
import { db } from "@/lib/db"
import { TeachersPage } from "@/components/dashboard/teachers-page"

export default async function AdminTeachersPage() {
  const user = await requireAuth(UserRole.SCHOOL_ADMIN)

  const school = await db.school.findUnique({
    where: { id: user.schoolId! },
  })

  if (!school) {
    redirect("/auth/login")
  }

  const teachers = await db.teacher.findMany({
    where: { schoolId: school.id },
    include: {
      user: {
        select: {
          name: true,
          email: true,
          phone: true,
        },
      },
    },
    take: 50,
    orderBy: { createdAt: "desc" },
  })

  // Get subjects from JSON file
  const classesData = await import("@/data/classes.json")
  const subjects = classesData.subjects || []

  return <TeachersPage teachers={teachers} subjects={subjects} />
}
