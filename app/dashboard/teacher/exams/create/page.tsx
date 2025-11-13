import { redirect } from "next/navigation"
import { requireAuth } from "@/lib/utils/auth"
import { UserRole } from "@prisma/client"
import { ExamCreatePage } from "@/components/dashboard/exam-create-page"

export default async function TeacherExamCreatePage() {
  const user = await requireAuth(UserRole.TEACHER)

  if (!user.schoolId) {
    redirect("/auth/login")
  }

  return <ExamCreatePage />
}

