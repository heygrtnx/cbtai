"use client"

import { Card, CardBody, CardHeader, Button } from "@heroui/react"
import Link from "next/link"
import { signOut } from "next-auth/react"

interface TeacherDashboardProps {
  user: {
    name: string | null
  }
  teacher: {
    subjects: string[]
    _count: {
      exams: number
    }
    exams: Array<{
      id: string
      title: string
      subject: string
      _count: {
        questions: number
        attempts: number
      }
    }>
  }
}

export function TeacherDashboard({ user, teacher }: TeacherDashboardProps) {
  const handleSignOut = async () => {
    await signOut({ redirect: true, callbackUrl: "/auth/login" })
  }

  return (
    <div className="min-h-screen bg-black text-white relative overflow-x-hidden">
      {/* Background effects */}
      <div className="fixed inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
      <div className="fixed top-20 right-10 w-80 h-80 bg-white/5 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-20 left-10 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10">
        {/* Header */}
        <div className="w-full px-4 py-4 md:px-6 md:py-6 border-b border-white/10">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-black text-white">Teacher Dashboard</h1>
              <p className="text-sm md:text-base text-gray-400 mt-1">Welcome back, {user.name}</p>
            </div>
            <Button
              onClick={handleSignOut}
              variant="light"
              className="text-white bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20"
            >
              Sign Out
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 py-6 md:py-8 lg:py-12">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
            <Card className="bg-white/5 backdrop-blur-xl border border-white/10 hover:border-white/20 transition-all">
              <CardBody className="p-4 md:p-6 text-center">
                <div className="text-3xl md:text-4xl font-black text-white mb-2">{teacher._count.exams}</div>
                <div className="text-xs md:text-sm text-gray-400">Total Exams</div>
              </CardBody>
            </Card>

            <Card className="bg-white/5 backdrop-blur-xl border border-white/10 hover:border-white/20 transition-all">
              <CardBody className="p-4 md:p-6">
                <div className="text-xs md:text-sm text-gray-400 mb-2">Subjects</div>
                <div className="text-sm md:text-base text-white font-semibold">
                  {teacher.subjects.length > 0 ? teacher.subjects.join(", ") : "No subjects assigned"}
                </div>
              </CardBody>
            </Card>

            <Card className="bg-white/5 backdrop-blur-xl border border-white/10 hover:border-white/20 transition-all">
              <CardBody className="p-4 md:p-6 flex items-center justify-center">
                <Button
                  as={Link}
                  href="/dashboard/teacher/exams/create"
                  className="bg-white text-black hover:bg-gray-200 font-semibold w-full"
                >
                  Create Exam
                </Button>
              </CardBody>
            </Card>
          </div>

          {/* Recent Exams */}
          <Card className="bg-white/5 backdrop-blur-xl border border-white/10">
            <CardHeader className="p-4 md:p-6 pb-0">
              <h2 className="text-xl md:text-2xl font-bold text-white">Recent Exams</h2>
            </CardHeader>
            <CardBody className="p-4 md:p-6">
              {teacher.exams.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-400 mb-4">No exams created yet.</p>
                  <Button
                    as={Link}
                    href="/dashboard/teacher/exams/create"
                    className="bg-white text-black hover:bg-gray-200 font-semibold"
                  >
                    Create Your First Exam
                  </Button>
                </div>
              ) : (
                <div className="space-y-3 md:space-y-4">
                  {teacher.exams.map((exam) => (
                    <Card key={exam.id} className="bg-white/5 backdrop-blur-xl border border-white/10 hover:border-white/20 transition-all">
                      <CardBody className="p-4 md:p-6">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                          <div className="flex-1">
                            <h3 className="font-bold text-white text-base md:text-lg mb-2">{exam.title}</h3>
                            <p className="text-xs md:text-sm text-gray-400">
                              {exam.subject} • {exam._count.questions} questions • {exam._count.attempts} attempts
                            </p>
                          </div>
                          <Button
                            as={Link}
                            href={`/dashboard/teacher/exams/${exam.id}`}
                            variant="bordered"
                            size="sm"
                            className="border-white/20 bg-white/5 hover:bg-white/10 text-white"
                          >
                            View →
                          </Button>
                        </div>
                      </CardBody>
                    </Card>
                  ))}
                </div>
              )}
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  )
}

