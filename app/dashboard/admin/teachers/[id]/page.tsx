import { redirect } from "next/navigation"
import { requireAuth } from "@/lib/utils/auth"
import { UserRole } from "@prisma/client"
import { db } from "@/lib/db"
import { TeacherDetailPage } from "@/components/dashboard/teacher-detail-page"

export default async function TeacherDetailPageRoute({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const user = await requireAuth(UserRole.SCHOOL_ADMIN)
  const { id } = await params

  const teacher = await db.teacher.findUnique({
    where: { id },
    include: {
      user: true,
    },
  })

  if (!teacher || teacher.schoolId !== user.schoolId) {
    redirect("/dashboard/admin/teachers")
  }

  return <TeacherDetailPage teacher={teacher} />
}

