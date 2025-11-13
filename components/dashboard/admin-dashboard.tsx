"use client"

import { Card, CardBody, CardHeader, Button } from "@heroui/react"
import Link from "next/link"
import { signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import { LicenseInfo } from "./license-info"

interface AdminDashboardProps {
  user: {
    name: string | null
  }
  school: {
    name: string
    schoolCode: string
    isActive: boolean
    _count: {
      students: number
      teachers: number
      exams: number
    }
  }
  numberOfStudentsPaid: number
  licenseExpiry: string | null
}

export function AdminDashboard({ user, school, numberOfStudentsPaid, licenseExpiry }: AdminDashboardProps) {
  const router = useRouter()

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
              <h1 className="text-2xl md:text-3xl font-black text-white">School Dashboard</h1>
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
          {/* School Name and Code */}
          <div className="mb-6 md:mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">{school.name}</h2>
            <p className="text-sm md:text-base text-gray-400">School Code: <span className="text-white font-semibold">{school.schoolCode}</span></p>
          </div>

          {/* License Information */}
          <LicenseInfo
            isActive={school.isActive}
            licenseExpiry={licenseExpiry ? new Date(licenseExpiry) : null}
            numberOfStudentsPaid={numberOfStudentsPaid}
          />

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
            <Card className="bg-white/5 backdrop-blur-xl border border-white/10 hover:border-white/20 transition-all">
              <CardBody className="p-4 md:p-6 text-center">
                <div className="text-3xl md:text-4xl font-black text-white mb-2">
                  {school._count.students}/{numberOfStudentsPaid.toLocaleString()}
                </div>
                <div className="text-xs md:text-sm text-gray-400">Students</div>
              </CardBody>
            </Card>

            <Card className="bg-white/5 backdrop-blur-xl border border-white/10 hover:border-white/20 transition-all">
              <CardBody className="p-4 md:p-6 text-center">
                <div className="text-3xl md:text-4xl font-black text-white mb-2 flex items-center justify-center gap-2">
                  {school._count.teachers}
                  <span className="text-2xl md:text-3xl text-gray-400">∞</span>
                </div>
                <div className="text-xs md:text-sm text-gray-400">Teachers</div>
              </CardBody>
            </Card>

            <Card className="bg-white/5 backdrop-blur-xl border border-white/10 hover:border-white/20 transition-all">
              <CardBody className="p-4 md:p-6 text-center">
                <div className="text-3xl md:text-4xl font-black text-white mb-2 flex items-center justify-center gap-2">
                  {school._count.exams}
                  <span className="text-2xl md:text-3xl text-gray-400">∞</span>
                </div>
                <div className="text-xs md:text-sm text-gray-400">Exams</div>
              </CardBody>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card className="bg-white/5 backdrop-blur-xl border border-white/10">
            <CardHeader className="p-4 md:p-6 pb-0">
              <h2 className="text-xl md:text-2xl font-bold text-white">Quick Actions</h2>
            </CardHeader>
            <CardBody className="p-4 md:p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Button
                  as={Link}
                  href="/dashboard/admin/students"
                  variant="bordered"
                  className="h-auto py-4 border-white/20 bg-white/5 backdrop-blur-md hover:bg-white/10 text-white"
                >
                  <div className="text-left w-full">
                    <div className="font-semibold text-sm md:text-base mb-1">Manage Students</div>
                    <div className="text-xs text-gray-400">Upload and manage student accounts</div>
                  </div>
                </Button>

                <Button
                  as={Link}
                  href="/dashboard/admin/teachers"
                  variant="bordered"
                  className="h-auto py-4 border-white/20 bg-white/5 backdrop-blur-md hover:bg-white/10 text-white"
                >
                  <div className="text-left w-full">
                    <div className="font-semibold text-sm md:text-base mb-1">Manage Teachers</div>
                    <div className="text-xs text-gray-400">Add and manage teachers</div>
                  </div>
                </Button>

                <Button
                  as={Link}
                  href="/dashboard/admin/exams"
                  variant="bordered"
                  className="h-auto py-4 border-white/20 bg-white/5 backdrop-blur-md hover:bg-white/10 text-white"
                >
                  <div className="text-left w-full">
                    <div className="font-semibold text-sm md:text-base mb-1">Manage Exams</div>
                    <div className="text-xs text-gray-400">Create and manage exams</div>
                  </div>
                </Button>

                <Button
                  as={Link}
                  href="/dashboard/admin/settings"
                  variant="bordered"
                  className="h-auto py-4 border-white/20 bg-white/5 backdrop-blur-md hover:bg-white/10 text-white"
                >
                  <div className="text-left w-full">
                    <div className="font-semibold text-sm md:text-base mb-1">School Settings</div>
                    <div className="text-xs text-gray-400">Update school information</div>
                  </div>
                </Button>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  )
}
