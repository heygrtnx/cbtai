import { redirect } from "next/navigation"
import { requireAuth } from "@/lib/utils/auth"
import { UserRole } from "@prisma/client"
import { db } from "@/lib/db"
import { ExamsPage } from "@/components/dashboard/exams-page"

export default async function AdminExamsPage() {
  const user = await requireAuth(UserRole.SCHOOL_ADMIN)

  const school = await db.school.findUnique({
    where: { id: user.schoolId! },
  })

  if (!school) {
    redirect("/auth/login")
  }

  const exams = await db.exam.findMany({
    where: { schoolId: school.id },
    select: {
      id: true,
      title: true,
      subject: true,
      type: true,
      status: true,
      createdAt: true,
    },
    take: 50,
    orderBy: { createdAt: "desc" },
  })

  // Get classes and subjects from JSON file
  const classesData = await import("@/data/classes.json")
  const classes = classesData.classes || []
  const subjects = classesData.subjects || []

  return <ExamsPage exams={exams} subjects={subjects} classes={classes} />
}
