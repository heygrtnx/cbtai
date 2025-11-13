import { redirect } from "next/navigation"
import { requireAuth } from "@/lib/utils/auth"
import { UserRole } from "@prisma/client"
import { db } from "@/lib/db"
import { TeacherDashboard } from "@/components/dashboard/teacher-dashboard"

export default async function TeacherDashboardPage() {
  const user = await requireAuth(UserRole.TEACHER)

  const teacher = await db.teacher.findUnique({
    where: { userId: user.id },
    include: {
      _count: {
        select: {
          exams: true,
        },
      },
      exams: {
        take: 5,
        orderBy: { createdAt: "desc" },
        include: {
          _count: {
            select: {
              questions: true,
              attempts: true,
            },
          },
        },
      },
    },
  })

  if (!teacher) {
    redirect("/auth/login")
  }

  return <TeacherDashboard user={user} teacher={teacher} />
}
