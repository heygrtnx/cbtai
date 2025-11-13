import { redirect } from "next/navigation"
import { requireAuth } from "@/lib/utils/auth"
import { UserRole } from "@prisma/client"
import { db } from "@/lib/db"

export default async function AdminDashboardPage() {
  const user = await requireAuth(UserRole.SCHOOL_ADMIN)

  const school = await db.school.findUnique({
    where: { id: user.schoolId! },
    include: {
      _count: {
        select: {
          students: true,
          teachers: true,
          exams: true,
        },
      },
    },
  })

  if (!school) {
    redirect("/auth/login")
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="mt-2 text-gray-600">Welcome, {user.name}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Students</h3>
            <p className="text-3xl font-bold text-blue-600">{school._count.students}</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Teachers</h3>
            <p className="text-3xl font-bold text-green-600">{school._count.teachers}</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Exams</h3>
            <p className="text-3xl font-bold text-purple-600">{school._count.exams}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <a
              href="/dashboard/admin/students"
              className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <h3 className="font-medium text-gray-900">Manage Students</h3>
              <p className="text-sm text-gray-600 mt-1">Upload and manage student accounts</p>
            </a>

            <a
              href="/dashboard/admin/teachers"
              className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <h3 className="font-medium text-gray-900">Manage Teachers</h3>
              <p className="text-sm text-gray-600 mt-1">Add and manage teachers</p>
            </a>

            <a
              href="/dashboard/admin/classes"
              className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <h3 className="font-medium text-gray-900">Manage Classes</h3>
              <p className="text-sm text-gray-600 mt-1">Create and organize classes</p>
            </a>

            <a
              href="/dashboard/admin/settings"
              className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <h3 className="font-medium text-gray-900">School Settings</h3>
              <p className="text-sm text-gray-600 mt-1">Update school information</p>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

