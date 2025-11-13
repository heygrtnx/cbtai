import { redirect } from "next/navigation"
import { requireAuth } from "@/lib/utils/auth"
import { UserRole } from "@prisma/client"
import { db } from "@/lib/db"
import { ParentChildDetailPage } from "@/components/dashboard/parent-child-detail-page"

export default async function ParentChildDetailPageRoute({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const user = await requireAuth(UserRole.PARENT)
  const { id } = await params

  const parent = await db.parent.findUnique({
    where: { userId: user.id },
    include: {
      children: {
        where: { id },
        include: {
          user: true,
          class: true,
          results: {
            take: 10,
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

  const child = parent?.children[0]

  if (!child) {
    redirect("/dashboard/parent")
  }

  return <ParentChildDetailPage child={child} />
}

