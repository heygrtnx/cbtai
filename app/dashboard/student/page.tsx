import { redirect } from "next/navigation"
import { requireAuth } from "@/lib/utils/auth"
import { UserRole } from "@prisma/client"
import { db } from "@/lib/db"
import { StudentDashboard } from "@/components/dashboard/student-dashboard"

export default async function StudentDashboardPage() {
  const user = await requireAuth(UserRole.STUDENT)

  const student = await db.student.findUnique({
    where: { userId: user.id },
    include: {
      user: {
        select: {
          name: true,
        },
      },
      class: true,
      examAttempts: {
        take: 5,
        orderBy: { createdAt: "desc" },
        include: {
          exam: {
            select: {
              id: true,
              title: true,
              subject: true,
              type: true,
            },
          },
          result: {
            select: {
              percentage: true,
              grade: true,
              status: true,
            },
          },
        },
      },
    },
  })

  if (!student) {
    redirect("/auth/login")
  }

  // Get available exams
  const availableExams = await db.exam.findMany({
    where: {
      status: "PUBLISHED",
      startDate: { lte: new Date() },
      endDate: { gte: new Date() },
      OR: [
        {
          assignments: {
            some: {
              classId: student.classId,
            },
          },
        },
        {
          assignments: {
            some: {
              studentId: student.id,
            },
          },
        },
      ],
    },
    include: {
      _count: {
        select: {
          questions: true,
        },
      },
    },
    take: 5,
  })

  return <StudentDashboard user={user} student={student} availableExams={availableExams} />
}
