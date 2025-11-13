import { redirect } from "next/navigation"
import { requireAuth } from "@/lib/utils/auth"
import { UserRole } from "@prisma/client"
import { db } from "@/lib/db"
import { StudentDetailPage } from "@/components/dashboard/student-detail-page"

export default async function StudentDetailPageRoute({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const user = await requireAuth(UserRole.SCHOOL_ADMIN)
  const { id } = await params

  const student = await db.student.findUnique({
    where: { id },
    include: {
      user: true,
      class: true,
    },
  })

  if (!student || student.schoolId !== user.schoolId) {
    redirect("/dashboard/admin/students")
  }

  return <StudentDetailPage student={student} />
}

