import { redirect } from "next/navigation"
import { requireAuth } from "@/lib/utils/auth"
import { UserRole } from "@prisma/client"
import { db } from "@/lib/db"
import { ClassesPage } from "@/components/dashboard/classes-page"

export default async function AdminClassesPage() {
  const user = await requireAuth(UserRole.SCHOOL_ADMIN)

  const school = await db.school.findUnique({
    where: { id: user.schoolId! },
  })

  if (!school) {
    redirect("/auth/login")
  }

  const classes = await db.class.findMany({
    where: { schoolId: school.id },
    include: {
      _count: {
        select: {
          students: true,
        },
      },
    },
    take: 50,
    orderBy: { name: "asc" },
  })

  return <ClassesPage classes={classes} />
}
