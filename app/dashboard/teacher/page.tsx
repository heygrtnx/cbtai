import { redirect } from "next/navigation"
import { requireAuth } from "@/lib/utils/auth"
import { UserRole } from "@prisma/client"
import { db } from "@/lib/db"

export default async function TeacherDashboardPage() {
  const user = await requireAuth(UserRole.TEACHER)

  const teacher = await db.teacher.findUnique({
    where: { userId: user.id },
    include: {
      _count: {
        select: {
          exams: true,
        },
      },
      exams: {
        take: 5,
        orderBy: { createdAt: "desc" },
        include: {
          _count: {
            select: {
              questions: true,
              attempts: true,
            },
          },
        },
      },
    },
  })

  if (!teacher) {
    redirect("/auth/login")
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Teacher Dashboard</h1>
          <p className="mt-2 text-gray-600">Welcome, {user.name}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Exams</h3>
            <p className="text-3xl font-bold text-blue-600">{teacher._count.exams}</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Subjects</h3>
            <p className="text-sm text-gray-600 mt-2">
              {teacher.subjects.join(", ")}
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Quick Actions</h3>
            <a
              href="/dashboard/teacher/exams/create"
              className="inline-block mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Create Exam
            </a>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Exams</h2>
          {teacher.exams.length === 0 ? (
            <p className="text-gray-600">No exams created yet. Create your first exam!</p>
          ) : (
            <div className="space-y-4">
              {teacher.exams.map((exam) => (
                <div
                  key={exam.id}
                  className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-gray-900">{exam.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {exam.subject} • {exam._count.questions} questions • {exam._count.attempts} attempts
                      </p>
                    </div>
                    <a
                      href={`/dashboard/teacher/exams/${exam.id}`}
                      className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                      View →
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

