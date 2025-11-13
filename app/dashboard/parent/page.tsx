import { redirect } from "next/navigation"
import { requireAuth } from "@/lib/utils/auth"
import { UserRole } from "@prisma/client"
import { db } from "@/lib/db"
import { ParentDashboard } from "@/components/dashboard/parent-dashboard"

export default async function ParentDashboardPage() {
  const user = await requireAuth(UserRole.PARENT)

  const parent = await db.parent.findUnique({
    where: { userId: user.id },
    include: {
      children: {
        include: {
          user: {
            select: {
              name: true,
            },
          },
          class: true,
          results: {
            take: 5,
            orderBy: { createdAt: "desc" },
            include: {
              exam: {
                select: {
                  title: true,
                  subject: true,
                },
              },
            },
          },
        },
      },
    },
  })

  if (!parent) {
    redirect("/auth/login")
  }

  return <ParentDashboard user={user} children={parent.children} />
}
