"use client"

import { Card, CardBody, CardHeader, Button } from "@heroui/react"
import Link from "next/link"
import { signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { toast } from "sonner"
import { LicenseInfo } from "./license-info"
import { StaggerContainer, itemVariants, cardHoverVariants, fadeInVariants } from "@/lib/utils/animations"

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
    toast.info("Signing out...", { duration: 1000 })
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
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full px-4 py-4 md:px-6 md:py-6 border-b border-white/10"
        >
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h1 className="text-2xl md:text-3xl font-black text-white">School Dashboard</h1>
              <p className="text-sm md:text-base text-gray-400 mt-1">Welcome back, {user.name}</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                onClick={handleSignOut}
                variant="light"
                className="text-white bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all"
              >
                Sign Out
              </Button>
            </motion.div>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 py-6 md:py-8 lg:py-12">
          {/* School Name and Code */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-6 md:mb-8"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">{school.name}</h2>
            <p className="text-sm md:text-base text-gray-400">School Code: <span className="text-white font-semibold">{school.schoolCode}</span></p>
          </motion.div>

          {/* License Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <LicenseInfo
              isActive={school.isActive}
              licenseExpiry={licenseExpiry ? new Date(licenseExpiry) : null}
              numberOfStudentsPaid={numberOfStudentsPaid}
            />
          </motion.div>

          {/* Stats Grid */}
          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
            <motion.div variants={itemVariants}>
              <motion.div
                whileHover={{ scale: 1.02, y: -4 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <Card className="bg-white/5 backdrop-blur-xl border border-white/10 hover:border-white/20 transition-all cursor-pointer">
                  <CardBody className="p-4 md:p-6 text-center">
                    <motion.div
                      className="text-3xl md:text-4xl font-black text-white mb-2"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.6, type: "spring", stiffness: 200 }}
                    >
                      {school._count.students}/{numberOfStudentsPaid.toLocaleString()}
                    </motion.div>
                    <div className="text-xs md:text-sm text-gray-400">Students</div>
                  </CardBody>
                </Card>
              </motion.div>
            </motion.div>

            <motion.div variants={itemVariants}>
              <motion.div
                whileHover={{ scale: 1.02, y: -4 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <Card className="bg-white/5 backdrop-blur-xl border border-white/10 hover:border-white/20 transition-all cursor-pointer">
                  <CardBody className="p-4 md:p-6 text-center">
                    <motion.div
                      className="text-3xl md:text-4xl font-black text-white mb-2 flex items-center justify-center gap-2"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.7, type: "spring", stiffness: 200 }}
                    >
                      {school._count.teachers}
                      <span className="text-2xl md:text-3xl text-gray-400">∞</span>
                    </motion.div>
                    <div className="text-xs md:text-sm text-gray-400">Teachers</div>
                  </CardBody>
                </Card>
              </motion.div>
            </motion.div>

            <motion.div variants={itemVariants}>
              <motion.div
                whileHover={{ scale: 1.02, y: -4 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <Card className="bg-white/5 backdrop-blur-xl border border-white/10 hover:border-white/20 transition-all cursor-pointer">
                  <CardBody className="p-4 md:p-6 text-center">
                    <motion.div
                      className="text-3xl md:text-4xl font-black text-white mb-2 flex items-center justify-center gap-2"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.8, type: "spring", stiffness: 200 }}
                    >
                      {school._count.exams}
                      <span className="text-2xl md:text-3xl text-gray-400">∞</span>
                    </motion.div>
                    <div className="text-xs md:text-sm text-gray-400">Exams</div>
                  </CardBody>
                </Card>
              </motion.div>
            </motion.div>
          </StaggerContainer>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
          >
            <Card className="bg-white/5 backdrop-blur-xl border border-white/10">
              <CardHeader className="p-4 md:p-6 pb-0">
                <h2 className="text-xl md:text-2xl font-bold text-white">Quick Actions</h2>
              </CardHeader>
              <CardBody className="p-4 md:p-6">
                <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { href: "/dashboard/admin/students", title: "Manage Students", desc: "Upload and manage student accounts", icon: "👥" },
                    { href: "/dashboard/admin/teachers", title: "Manage Teachers", desc: "Add and manage teachers", icon: "👨‍🏫" },
                    { href: "/dashboard/admin/exams", title: "Manage Exams", desc: "Create and manage exams", icon: "📝" },
                    { href: "/dashboard/admin/settings", title: "School Settings", desc: "Update school information", icon: "⚙️" },
                  ].map((action, index) => (
                    <motion.div key={action.href} variants={itemVariants}>
                      <motion.div
                        whileHover={{ scale: 1.05, y: -4 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button
                          as={Link}
                          href={action.href}
                          variant="bordered"
                          className="h-auto py-4 border-white/20 bg-white/5 backdrop-blur-md hover:bg-white/10 text-white w-full relative overflow-hidden group"
                        >
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0"
                            initial={{ x: "-100%" }}
                            whileHover={{ x: "100%" }}
                            transition={{ duration: 0.6 }}
                          />
                          <div className="text-left w-full relative z-10">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xl">{action.icon}</span>
                              <div className="font-semibold text-sm md:text-base">{action.title}</div>
                            </div>
                            <div className="text-xs text-gray-400">{action.desc}</div>
                          </div>
                        </Button>
                      </motion.div>
                    </motion.div>
                  ))}
                </StaggerContainer>
              </CardBody>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
