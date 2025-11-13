"use client"

import { Card, CardBody, CardHeader, Button, Input } from "@heroui/react"
import Link from "next/link"
import { useState } from "react"

interface UpgradePageProps {
  school: {
    id: string
    name: string
    numberOfStudents: number
  }
  currentStudentsPaid: number
}

export function UpgradePage({ school, currentStudentsPaid }: UpgradePageProps) {
  const [additionalStudents, setAdditionalStudents] = useState(0)
  const [loading, setLoading] = useState(false)

  const costPerStudent = parseInt(process.env.NEXT_PUBLIC_COST_PER_STUDENT || "3000")
  const totalCost = additionalStudents * costPerStudent

  const handleUpgrade = async () => {
    if (additionalStudents <= 0) return

    setLoading(true)
    try {
      const response = await fetch("/api/payments/initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          schoolId: school.id,
          amount: totalCost,
          method: "PAYSTACK",
          type: "UPGRADE",
          additionalStudents: additionalStudents,
        }),
      })

      const data = await response.json()

      if (data.authorizationUrl) {
        // Store upgrade info in sessionStorage for callback
        sessionStorage.setItem("upgrade_pending", "true")
        window.location.href = data.authorizationUrl
      }
    } catch (error) {
      console.error("Upgrade error:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white relative overflow-x-hidden">
      <div className="fixed inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
      <div className="fixed top-20 right-10 w-80 h-80 bg-white/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10">
        <div className="w-full px-4 py-4 md:px-6 md:py-6 border-b border-white/10">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-black text-white">Upgrade Student Capacity</h1>
              <p className="text-sm md:text-base text-gray-400 mt-1">Increase the number of students you can add</p>
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

        <div className="max-w-4xl mx-auto px-4 py-6 md:py-8 lg:py-12">
          <Card className="bg-white/5 backdrop-blur-xl border border-white/10">
            <CardHeader className="p-4 md:p-6 pb-0">
              <h2 className="text-xl md:text-2xl font-bold text-white">Current Plan</h2>
            </CardHeader>
            <CardBody className="p-4 md:p-6">
              <div className="mb-6">
                <p className="text-gray-400 mb-2">Current Students Paid For:</p>
                <p className="text-3xl font-black text-white">{currentStudentsPaid.toLocaleString()}</p>
              </div>

              <div className="space-y-4">
                <Input
                  label="Additional Students"
                  type="number"
                  placeholder="Enter number of additional students"
                  value={additionalStudents.toString()}
                  onChange={(e) => setAdditionalStudents(parseInt(e.target.value) || 0)}
                  min="1"
                  className="text-white"
                  classNames={{
                    input: "text-white",
                    label: "text-gray-400",
                  }}
                />

                {additionalStudents > 0 && (
                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-400">Additional Students:</span>
                      <span className="text-white font-semibold">{additionalStudents.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-400">Cost per Student:</span>
                      <span className="text-white font-semibold">₦{costPerStudent.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t border-white/10">
                      <span className="text-white font-bold">Total Cost:</span>
                      <span className="text-2xl font-black text-white">₦{totalCost.toLocaleString()}</span>
                    </div>
                  </div>
                )}

                <Button
                  onClick={handleUpgrade}
                  disabled={loading || additionalStudents <= 0}
                  className="w-full bg-white text-black hover:bg-gray-200 font-semibold"
                >
                  {loading ? "Processing..." : "Proceed to Payment"}
                </Button>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  )
}

