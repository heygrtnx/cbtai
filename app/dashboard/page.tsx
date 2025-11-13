import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/utils/auth"

export default async function DashboardPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Redirect based on role
  if (user.role === "SCHOOL_ADMIN") {
    redirect("/dashboard/admin")
  } else if (user.role === "TEACHER") {
    redirect("/dashboard/teacher")
  } else if (user.role === "STUDENT") {
    redirect("/dashboard/student")
  } else if (user.role === "PARENT") {
    redirect("/dashboard/parent")
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Loading...</h1>
      </div>
    </div>
  )
}

