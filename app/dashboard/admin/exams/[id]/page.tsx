import { redirect } from "next/navigation"
import { requireAuth } from "@/lib/utils/auth"
import { UserRole } from "@prisma/client"
import { db } from "@/lib/db"
import { ExamDetailPage } from "@/components/dashboard/exam-detail-page"

export default async function ExamDetailPageRoute({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const user = await requireAuth(UserRole.SCHOOL_ADMIN)
  const { id } = await params

  const exam = await db.exam.findUnique({
    where: { id },
    include: {
      teacher: {
        include: {
          user: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  })

  if (!exam || exam.schoolId !== user.schoolId) {
    redirect("/dashboard/admin/exams")
  }

  return <ExamDetailPage exam={exam} />
}

