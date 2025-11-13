"use client"

import { Card, CardBody, CardHeader, Button } from "@heroui/react"
import Link from "next/link"
import { signOut } from "next-auth/react"

interface StudentDashboardProps {
  user: {
    name: string | null
  }
  student: {
    class: {
      name: string
    } | null
    examAttempts: Array<{
      id: string
      exam: {
        id: string
        title: string
        subject: string
        type: string
      }
      result: {
        percentage: number
        grade: string
        status: string
      } | null
    }>
  }
  availableExams: Array<{
    id: string
    title: string
    subject: string
    duration: number
    endDate: Date
    _count: {
      questions: number
    }
  }>
}

export function StudentDashboard({ user, student, availableExams }: StudentDashboardProps) {
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
              <h1 className="text-2xl md:text-3xl font-black text-white">Student Dashboard</h1>
              <p className="text-sm md:text-base text-gray-400 mt-1">Welcome, {user.name}</p>
              {student.class && (
                <p className="text-xs text-gray-500 mt-1">Class: {student.class.name}</p>
              )}
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
            {/* Available Exams */}
            <Card className="bg-white/5 backdrop-blur-xl border border-white/10">
              <CardHeader className="p-4 md:p-6 pb-0">
                <h2 className="text-xl md:text-2xl font-bold text-white">Available Exams</h2>
              </CardHeader>
              <CardBody className="p-4 md:p-6">
                {availableExams.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-400">No exams available at the moment.</p>
                  </div>
                ) : (
                  <div className="space-y-3 md:space-y-4">
                    {availableExams.map((exam) => (
                      <Card key={exam.id} className="bg-white/5 backdrop-blur-xl border border-white/10 hover:border-white/20 transition-all">
                        <CardBody className="p-4 md:p-6">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div className="flex-1">
                              <h3 className="font-bold text-white text-base md:text-lg mb-2">{exam.title}</h3>
                              <p className="text-xs md:text-sm text-gray-400 mb-1">
                                {exam.subject} • {exam._count.questions} questions • {exam.duration} minutes
                              </p>
                              <p className="text-xs text-gray-500">
                                Ends: {new Date(exam.endDate).toLocaleString()}
                              </p>
                            </div>
                            <Button
                              as={Link}
                              href={`/dashboard/student/exams/${exam.id}`}
                              className="bg-white text-black hover:bg-gray-200 font-semibold w-full sm:w-auto"
                            >
                              Start Exam
                            </Button>
                          </div>
                        </CardBody>
                      </Card>
                    ))}
                  </div>
                )}
              </CardBody>
            </Card>

            {/* Recent Attempts */}
            <Card className="bg-white/5 backdrop-blur-xl border border-white/10">
              <CardHeader className="p-4 md:p-6 pb-0">
                <h2 className="text-xl md:text-2xl font-bold text-white">Recent Attempts</h2>
              </CardHeader>
              <CardBody className="p-4 md:p-6">
                {student.examAttempts.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-400">No exam attempts yet.</p>
                  </div>
                ) : (
                  <div className="space-y-3 md:space-y-4">
                    {student.examAttempts.map((attempt) => (
                      <Card key={attempt.id} className="bg-white/5 backdrop-blur-xl border border-white/10 hover:border-white/20 transition-all">
                        <CardBody className="p-4 md:p-6">
                          <h3 className="font-bold text-white text-base md:text-lg mb-2">{attempt.exam.title}</h3>
                          <p className="text-xs md:text-sm text-gray-400 mb-3">{attempt.exam.subject}</p>
                          {attempt.result && (
                            <div className="flex items-center justify-between mb-3">
                              <span className={`px-3 py-1 rounded-full text-xs md:text-sm font-semibold ${
                                attempt.result.grade === "A" || attempt.result.grade === "B"
                                  ? "bg-green-500/20 text-green-400 border border-green-500/30"
                                  : attempt.result.grade === "C" || attempt.result.grade === "D"
                                  ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                                  : "bg-red-500/20 text-red-400 border border-red-500/30"
                              }`}>
                                {attempt.result.percentage.toFixed(1)}% - Grade {attempt.result.grade}
                              </span>
                            </div>
                          )}
                          <Button
                            as={Link}
                            href={`/dashboard/student/results/${attempt.id}`}
                            variant="bordered"
                            size="sm"
                            className="border-white/20 bg-white/5 hover:bg-white/10 text-white w-full"
                          >
                            View Result →
                          </Button>
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
    </div>
  )
}

