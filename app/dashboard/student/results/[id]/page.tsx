import { redirect } from "next/navigation"
import { requireAuth } from "@/lib/utils/auth"
import { UserRole } from "@prisma/client"
import { db } from "@/lib/db"
import { StudentResultPage } from "@/components/dashboard/student-result-page"

export default async function StudentResultPageRoute({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const user = await requireAuth(UserRole.STUDENT)
  const { id } = await params

  const result = await db.result.findUnique({
    where: { id },
    include: {
      exam: true,
    },
  })

  if (!result) {
    redirect("/dashboard/student")
  }

  return <StudentResultPage result={result} />
}

