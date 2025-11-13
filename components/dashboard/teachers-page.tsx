"use client"

import { Card, CardBody, CardHeader, Button } from "@heroui/react"
import Link from "next/link"

interface Teacher {
  id: string
  subjects: string[]
  user: {
    name: string | null
    email: string | null
    phone: string | null
  } | null
}

interface TeachersPageProps {
  teachers: Teacher[]
}

export function TeachersPage({ teachers }: TeachersPageProps) {
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
              <h1 className="text-2xl md:text-3xl font-black text-white">Manage Teachers</h1>
              <p className="text-sm md:text-base text-gray-400 mt-1">Add and manage teachers</p>
            </div>
            <Button
              as={Link}
              href="/dashboard/admin"
              variant="light"
              className="text-white bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20"
            >
              ← Back
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 py-6 md:py-8 lg:py-12">
          <Card className="bg-white/5 backdrop-blur-xl border border-white/10 mb-6">
            <CardHeader className="p-4 md:p-6 pb-0">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full gap-4">
                <h2 className="text-xl md:text-2xl font-bold text-white">Teachers</h2>
                <Button
                  as={Link}
                  href="/dashboard/admin/teachers/create"
                  className="bg-white text-black hover:bg-gray-200 font-semibold"
                >
                  Add Teacher
                </Button>
              </div>
            </CardHeader>
            <CardBody className="p-4 md:p-6">
              {teachers.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-400 mb-4">No teachers found.</p>
                  <Button
                    as={Link}
                    href="/dashboard/admin/teachers/create"
                    className="bg-white text-black hover:bg-gray-200 font-semibold"
                  >
                    Add Teacher
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {teachers.map((teacher) => (
                    <Card key={teacher.id} className="bg-white/5 backdrop-blur-xl border border-white/10 hover:border-white/20 transition-all">
                      <CardBody className="p-4 md:p-6">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                          <div className="flex-1">
                            <h3 className="font-bold text-white text-base md:text-lg mb-1">{teacher.user?.name || "Unknown"}</h3>
                            <p className="text-xs md:text-sm text-gray-400 mb-1">Email: {teacher.user?.email || "N/A"}</p>
                            <p className="text-xs md:text-sm text-gray-400 mb-1">Phone: {teacher.user?.phone || "N/A"}</p>
                            <p className="text-xs md:text-sm text-gray-400">Subjects: {teacher.subjects.join(", ") || "None"}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              as={Link}
                              href={`/dashboard/admin/teachers/${teacher.id}`}
                              variant="bordered"
                              size="sm"
                              className="border-white/20 bg-white/5 hover:bg-white/10 text-white"
                            >
                              View Details
                            </Button>
                          </div>
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

