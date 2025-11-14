import { redirect } from "next/navigation"
import { requireAuth } from "@/lib/utils/auth"
import { UserRole } from "@prisma/client"
import { StudentUploadPage } from "@/components/dashboard/student-upload-page"

export default async function StudentUploadPageRoute() {
  const user = await requireAuth(UserRole.SCHOOL_ADMIN)

  if (!user.schoolId) {
    redirect("/auth/login")
  }

  return <StudentUploadPage />
}

