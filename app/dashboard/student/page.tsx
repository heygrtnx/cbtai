import { redirect } from "next/navigation"
import { requireAuth } from "@/lib/utils/auth"
import { UserRole } from "@prisma/client"
import { db } from "@/lib/db"

export default async function StudentDashboardPage() {
  const user = await requireAuth(UserRole.STUDENT)

  const student = await db.student.findUnique({
    where: { userId: user.id },
    include: {
      user: {
        select: {
          name: true,
        },
      },
      class: true,
      examAttempts: {
        take: 5,
        orderBy: { createdAt: "desc" },
        include: {
          exam: {
            select: {
              id: true,
              title: true,
              subject: true,
              type: true,
            },
          },
          result: {
            select: {
              percentage: true,
              grade: true,
              status: true,
            },
          },
        },
      },
    },
  })

  if (!student) {
    redirect("/auth/login")
  }

  // Get available exams
  const availableExams = await db.exam.findMany({
    where: {
      status: "PUBLISHED",
      startDate: { lte: new Date() },
      endDate: { gte: new Date() },
      OR: [
        {
          assignments: {
            some: {
              classId: student.classId,
            },
          },
        },
        {
          assignments: {
            some: {
              studentId: student.id,
            },
          },
        },
      ],
    },
    include: {
      _count: {
        select: {
          questions: true,
        },
      },
    },
    take: 5,
  })

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Student Dashboard</h1>
          <p className="mt-2 text-gray-600">Welcome, {student.user.name}</p>
          {student.class && (
            <p className="text-sm text-gray-500">Class: {student.class.name}</p>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Available Exams</h2>
            {availableExams.length === 0 ? (
              <p className="text-gray-600">No exams available at the moment.</p>
            ) : (
              <div className="space-y-4">
                {availableExams.map((exam) => (
                  <div
                    key={exam.id}
                    className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-gray-900">{exam.title}</h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {exam.subject} • {exam._count.questions} questions • {exam.duration} minutes
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Ends: {new Date(exam.endDate).toLocaleString()}
                        </p>
                      </div>
                      <a
                        href={`/dashboard/student/exams/${exam.id}`}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                      >
                        Start Exam
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Attempts</h2>
            {student.examAttempts.length === 0 ? (
              <p className="text-gray-600">No exam attempts yet.</p>
            ) : (
              <div className="space-y-4">
                {student.examAttempts.map((attempt) => (
                  <div
                    key={attempt.id}
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    <h3 className="font-medium text-gray-900">{attempt.exam.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{attempt.exam.subject}</p>
                    {attempt.result && (
                      <div className="mt-2">
                        <span className={`inline-block px-2 py-1 rounded text-sm font-medium ${
                          attempt.result.grade === "A" || attempt.result.grade === "B"
                            ? "bg-green-100 text-green-800"
                            : attempt.result.grade === "C" || attempt.result.grade === "D"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}>
                          {attempt.result.percentage.toFixed(1)}% - Grade {attempt.result.grade}
                        </span>
                      </div>
                    )}
                    <a
                      href={`/dashboard/student/results/${attempt.id}`}
                      className="text-blue-600 hover:text-blue-800 text-sm mt-2 inline-block"
                    >
                      View Result →
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

