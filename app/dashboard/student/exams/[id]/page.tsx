import { redirect } from "next/navigation"
import { requireAuth } from "@/lib/utils/auth"
import { UserRole } from "@prisma/client"
import { StudentExamPage } from "@/components/dashboard/student-exam-page"

export default async function StudentExamPageRoute({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const user = await requireAuth(UserRole.STUDENT)
  const { id } = await params

  return <StudentExamPage examId={id} />
}

