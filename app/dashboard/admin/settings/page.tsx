import { redirect } from "next/navigation"
import { requireAuth } from "@/lib/utils/auth"
import { UserRole } from "@prisma/client"
import { db } from "@/lib/db"
import { SettingsPage } from "@/components/dashboard/settings-page"

export default async function AdminSettingsPage() {
  const user = await requireAuth(UserRole.SCHOOL_ADMIN)

  const school = await db.school.findUnique({
    where: { id: user.schoolId! },
  })

  if (!school) {
    redirect("/auth/login")
  }

  return (
    <SettingsPage
      school={{
        ...school,
        licenseExpiry: school.licenseExpiry ? school.licenseExpiry.toISOString() : null,
      }}
    />
  )
}
