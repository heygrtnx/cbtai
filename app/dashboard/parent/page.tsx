import { redirect } from "next/navigation"
import { requireAuth } from "@/lib/utils/auth"
import { UserRole } from "@prisma/client"
import { db } from "@/lib/db"

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

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Parent Dashboard</h1>
          <p className="mt-2 text-gray-600">Welcome, {user.name}</p>
        </div>

        {parent.children.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600">No children linked to your account.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {parent.children.map((child) => (
              <div key={child.id} className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">{child.user?.name || "Student"}</h2>
                    {child.class && (
                      <p className="text-sm text-gray-600">Class: {child.class.name}</p>
                    )}
                  </div>
                  <a
                    href={`/dashboard/parent/children/${child.id}`}
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    View Details →
                  </a>
                </div>

                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Recent Results</h3>
                  {child.results.length === 0 ? (
                    <p className="text-gray-600 text-sm">No results available yet.</p>
                  ) : (
                    <div className="space-y-2">
                      {child.results.map((result) => (
                        <div
                          key={result.id}
                          className="flex justify-between items-center p-2 bg-gray-50 rounded"
                        >
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {result.exam.title}
                            </p>
                            <p className="text-xs text-gray-600">{result.exam.subject}</p>
                          </div>
                          <span className={`px-2 py-1 rounded text-sm font-medium ${
                            result.grade === "A" || result.grade === "B"
                              ? "bg-green-100 text-green-800"
                              : result.grade === "C" || result.grade === "D"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          }`}>
                            {result.percentage.toFixed(1)}% - {result.grade}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

