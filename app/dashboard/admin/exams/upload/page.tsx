import { redirect } from "next/navigation"
import { requireAuth } from "@/lib/utils/auth"
import { UserRole } from "@prisma/client"
import { ExamUploadPage } from "@/components/dashboard/exam-upload-page"

export default async function ExamUploadPageRoute() {
  const user = await requireAuth(UserRole.SCHOOL_ADMIN)

  if (!user.schoolId) {
    redirect("/auth/login")
  }

  return <ExamUploadPage />
}

