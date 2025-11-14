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

  const studentsData = await db.student.findMany({
    where: { schoolId: school.id },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
        },
      },
      class: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    take: 50,
    orderBy: { createdAt: "desc" },
  })

  // Transform students to match the expected type (convert Date to string)
  const students = studentsData.map((student) => ({
    ...student,
    dateOfBirth: student.dateOfBirth ? student.dateOfBirth.toISOString().split("T")[0] : null,
    user: student.user ? {
      id: student.user.id,
      name: student.user.name,
      email: student.user.email,
      phone: student.user.phone,
    } : null,
    class: student.class ? {
      id: student.class.id,
      name: student.class.name,
    } : null,
  }))

  // Get classes from JSON file
  const classesData = await import("@/data/classes.json")
  const classes = classesData.classes || []

  return <StudentsPage students={students} classes={classes} />
}
