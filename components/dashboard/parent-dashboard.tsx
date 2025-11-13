"use client"

import { Card, CardBody, CardHeader, Button } from "@heroui/react"
import Link from "next/link"
import { signOut } from "next-auth/react"

interface ParentDashboardProps {
  user: {
    name: string | null
  }
  children: Array<{
    id: string
    user: {
      name: string | null
    } | null
    class: {
      name: string
    } | null
    results: Array<{
      id: string
      exam: {
        title: string
        subject: string
      }
      percentage: number
      grade: string
    }>
  }>
}

export function ParentDashboard({ user, children }: ParentDashboardProps) {
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
              <h1 className="text-2xl md:text-3xl font-black text-white">Parent Dashboard</h1>
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
          {children.length === 0 ? (
            <Card className="bg-white/5 backdrop-blur-xl border border-white/10">
              <CardBody className="p-8 md:p-12 text-center">
                <p className="text-gray-400 text-base md:text-lg">No children linked to your account.</p>
              </CardBody>
            </Card>
          ) : (
            <div className="space-y-6 md:space-y-8">
              {children.map((child) => (
                <Card key={child.id} className="bg-white/5 backdrop-blur-xl border border-white/10 hover:border-white/20 transition-all">
                  <CardHeader className="p-4 md:p-6 pb-0">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full gap-4">
                      <div>
                        <h2 className="text-xl md:text-2xl font-bold text-white mb-1">{child.user?.name || "Student"}</h2>
                        {child.class && (
                          <p className="text-sm text-gray-400">Class: {child.class.name}</p>
                        )}
                      </div>
                      <Button
                        as={Link}
                        href={`/dashboard/parent/children/${child.id}`}
                        variant="bordered"
                        size="sm"
                        className="border-white/20 bg-white/5 hover:bg-white/10 text-white"
                      >
                        View Details →
                      </Button>
                    </div>
                  </CardHeader>
                  <CardBody className="p-4 md:p-6">
                    <h3 className="font-semibold text-white text-base md:text-lg mb-4">Recent Results</h3>
                    {child.results.length === 0 ? (
                      <p className="text-gray-400 text-sm">No results available yet.</p>
                    ) : (
                      <div className="space-y-3">
                        {child.results.map((result) => (
                          <Card key={result.id} className="bg-white/5 backdrop-blur-xl border border-white/10">
                            <CardBody className="p-4">
                              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                                <div className="flex-1">
                                  <p className="font-medium text-white text-sm md:text-base mb-1">
                                    {result.exam.title}
                                  </p>
                                  <p className="text-xs md:text-sm text-gray-400">{result.exam.subject}</p>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-xs md:text-sm font-semibold ${
                                  result.grade === "A" || result.grade === "B"
                                    ? "bg-green-500/20 text-green-400 border border-green-500/30"
                                    : result.grade === "C" || result.grade === "D"
                                    ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                                    : "bg-red-500/20 text-red-400 border border-red-500/30"
                                }`}>
                                  {result.percentage.toFixed(1)}% - {result.grade}
                                </span>
                              </div>
                            </CardBody>
                          </Card>
                        ))}
                      </div>
                    )}
                  </CardBody>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

