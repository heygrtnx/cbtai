import { redirect } from "next/navigation"
import { requireAuth } from "@/lib/utils/auth"
import { UserRole } from "@prisma/client"
import { db } from "@/lib/db"
import { StudentsPage } from "@/components/dashboard/students-page"

export default async function AdminStudentsPage() {
  const user = await requireAuth(UserRole.SCHOOL_ADMIN)

  const school = await db.school.findUnique({
    where: { id: user.schoolId! },
  })

  if (!school) {
    redirect("/auth/login")
  }

  const students = await db.student.findMany({
    where: { schoolId: school.id },
    include: {
      user: {
        select: {
          name: true,
          email: true,
          phone: true,
        },
      },
      class: {
        select: {
          name: true,
        },
      },
    },
    take: 50,
    orderBy: { createdAt: "desc" },
  })

  // Get classes from JSON file
  const classesData = await import("@/data/classes.json")
  const classes = classesData.classes || []

  return <StudentsPage students={students} classes={classes} />
}
