"use client"

import { Card, CardBody, CardHeader, Button, Input } from "@heroui/react"
import Link from "next/link"
import { useState } from "react"

interface SettingsEditPageProps {
  school: {
    id: string
    name: string
    email: string
    phone: string
    address: string
  }
}

export function SettingsEditPage({ school }: SettingsEditPageProps) {
  const [formData, setFormData] = useState({
    name: school.name,
    email: school.email,
    phone: school.phone,
    address: school.address,
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    // TODO: Implement update API
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-black text-white relative overflow-x-hidden">
      <div className="fixed inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

      <div className="relative z-10">
        <div className="w-full px-4 py-4 md:px-6 md:py-6 border-b border-white/10">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-black text-white">Edit School Settings</h1>
            </div>
            <Button
              as={Link}
              href="/dashboard/admin/settings"
              variant="light"
              className="text-white bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20"
            >
              ← Back
            </Button>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 py-6 md:py-8 lg:py-12">
          <Card className="bg-white/5 backdrop-blur-xl border border-white/10">
            <CardHeader className="p-4 md:p-6 pb-0">
              <h2 className="text-xl md:text-2xl font-bold text-white">School Information</h2>
            </CardHeader>
            <CardBody className="p-4 md:p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  label="School Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="text-white"
                  classNames={{
                    input: "text-white",
                    label: "text-gray-400",
                  }}
                />
                <Input
                  label="Email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="text-white"
                  classNames={{
                    input: "text-white",
                    label: "text-gray-400",
                  }}
                />
                <Input
                  label="Phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="text-white"
                  classNames={{
                    input: "text-white",
                    label: "text-gray-400",
                  }}
                />
                <Input
                  label="Address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="text-white"
                  classNames={{
                    input: "text-white",
                    label: "text-gray-400",
                  }}
                />
                <Button
                  type="submit"
                  disabled={loading}
                  className="bg-white text-black hover:bg-gray-200 font-semibold"
                >
                  {loading ? "Saving..." : "Save Changes"}
                </Button>
              </form>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  )
}

