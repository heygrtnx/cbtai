"use client"

import { Card, CardBody, CardHeader, Button } from "@heroui/react"
import Link from "next/link"

interface School {
  name: string
  schoolCode: string
  email: string
  phone: string
  address: string
  state: string
  lga: string
  city: string
  isActive: boolean
  licenseExpiry: string | null
}

interface SettingsPageProps {
  school: School
}

export function SettingsPage({ school }: SettingsPageProps) {
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
              <h1 className="text-2xl md:text-3xl font-black text-white">School Settings</h1>
              <p className="text-sm md:text-base text-gray-400 mt-1">Update school information</p>
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
              <h2 className="text-xl md:text-2xl font-bold text-white">School Information</h2>
            </CardHeader>
            <CardBody className="p-4 md:p-6">
              <div className="space-y-4">
                <div>
                  <label className="text-xs md:text-sm text-gray-400 mb-1 block">School Name</label>
                  <p className="text-white font-semibold">{school.name}</p>
                </div>
                <div>
                  <label className="text-xs md:text-sm text-gray-400 mb-1 block">School Code</label>
                  <p className="text-white font-semibold">{school.schoolCode}</p>
                </div>
                <div>
                  <label className="text-xs md:text-sm text-gray-400 mb-1 block">Email</label>
                  <p className="text-white font-semibold">{school.email}</p>
                </div>
                <div>
                  <label className="text-xs md:text-sm text-gray-400 mb-1 block">Phone</label>
                  <p className="text-white font-semibold">{school.phone}</p>
                </div>
                <div>
                  <label className="text-xs md:text-sm text-gray-400 mb-1 block">Address</label>
                  <p className="text-white font-semibold">{school.address}</p>
                </div>
                <div>
                  <label className="text-xs md:text-sm text-gray-400 mb-1 block">State</label>
                  <p className="text-white font-semibold">{school.state}</p>
                </div>
                <div>
                  <label className="text-xs md:text-sm text-gray-400 mb-1 block">LGA</label>
                  <p className="text-white font-semibold">{school.lga}</p>
                </div>
                <div>
                  <label className="text-xs md:text-sm text-gray-400 mb-1 block">City</label>
                  <p className="text-white font-semibold">{school.city}</p>
                </div>
                <div>
                  <label className="text-xs md:text-sm text-gray-400 mb-1 block">Status</label>
                  <span className={`px-3 py-1 rounded-full text-xs md:text-sm font-semibold inline-block ${
                    school.isActive 
                      ? "bg-green-500/20 text-green-400 border border-green-500/30" 
                      : "bg-red-500/20 text-red-400 border border-red-500/30"
                  }`}>
                    {school.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
                {school.licenseExpiry && (
                  <div>
                    <label className="text-xs md:text-sm text-gray-400 mb-1 block">License Expiry</label>
                    <p className="text-white font-semibold">{new Date(school.licenseExpiry).toLocaleDateString()}</p>
                  </div>
                )}
              </div>
              <div className="mt-6">
                <Button
                  as={Link}
                  href="/dashboard/admin/settings/edit"
                  className="bg-white text-black hover:bg-gray-200 font-semibold"
                >
                  Edit Settings
                </Button>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  )
}

