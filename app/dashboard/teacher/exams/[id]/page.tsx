import { redirect } from "next/navigation"
import { requireAuth } from "@/lib/utils/auth"
import { UserRole } from "@prisma/client"
import { db } from "@/lib/db"
import { TeacherExamDetailPage } from "@/components/dashboard/teacher-exam-detail-page"

export default async function TeacherExamDetailPageRoute({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const user = await requireAuth(UserRole.TEACHER)
  const { id } = await params

  const teacher = await db.teacher.findUnique({
    where: { userId: user.id },
  })

  if (!teacher) {
    redirect("/dashboard/teacher")
  }

  const exam = await db.exam.findUnique({
    where: { id },
  })

  if (!exam || exam.teacherId !== teacher.id) {
    redirect("/dashboard/teacher")
  }

  return <TeacherExamDetailPage exam={exam} />
}

