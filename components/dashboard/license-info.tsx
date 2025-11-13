"use client"

import { useEffect, useState } from "react"
import { Card, CardBody, Button } from "@heroui/react"
import Link from "next/link"

interface LicenseInfoProps {
  isActive: boolean
  licenseExpiry: Date | null
  numberOfStudentsPaid: number
}

export function LicenseInfo({ isActive, licenseExpiry, numberOfStudentsPaid }: LicenseInfoProps) {
  const [timeRemaining, setTimeRemaining] = useState<string>("")

  useEffect(() => {
    if (!licenseExpiry) {
      setTimeRemaining("No expiry date set")
      return
    }

    const updateCountdown = () => {
      const now = new Date()
      const expiry = new Date(licenseExpiry)
      const diff = expiry.getTime() - now.getTime()

      if (diff <= 0) {
        setTimeRemaining("Expired")
        return
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24))

      if (days > 0) {
        setTimeRemaining(`${days} day${days !== 1 ? 's' : ''}`)
      } else {
        setTimeRemaining("Expired")
      }
    }

    updateCountdown()
    // Update once per day since we only show days
    const interval = setInterval(updateCountdown, 24 * 60 * 60 * 1000)

    return () => clearInterval(interval)
  }, [licenseExpiry])

  const isExpiringSoon = licenseExpiry && new Date(licenseExpiry).getTime() - Date.now() < 30 * 24 * 60 * 60 * 1000 // 30 days

  return (
    <Card className="bg-white/5 backdrop-blur-xl border border-white/10 mb-6 md:mb-8">
      <CardBody className="p-4 md:p-6">
        <h2 className="text-xl md:text-2xl font-bold text-white mb-4">License Information</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* License Status */}
          <div>
            <div className="text-xs md:text-sm text-gray-400 mb-2">License Status</div>
            <div className="flex items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-xs md:text-sm font-semibold ${
                isActive 
                  ? "bg-green-500/20 text-green-400 border border-green-500/30" 
                  : "bg-red-500/20 text-red-400 border border-red-500/30"
              }`}>
                {isActive ? "Active" : "Inactive"}
              </span>
            </div>
          </div>

          {/* Students Paid For */}
          <div>
            <div className="text-xs md:text-sm text-gray-400 mb-2">Students Paid For</div>
            <div className="text-xl md:text-2xl font-black text-white">{numberOfStudentsPaid.toLocaleString()}</div>
          </div>

          {/* Upgrade */}
          <div>
            <div className="text-xs md:text-sm text-gray-400 mb-2">Upgrade</div>
            <Button
              as={Link}
              href="/dashboard/admin/upgrade"
              size="sm"
              className="bg-white text-black hover:bg-gray-200 font-semibold text-xs"
            >
              Upgrade
            </Button>
          </div>

          {/* Renewal Countdown */}
          <div>
            <div className="text-xs md:text-sm text-gray-400 mb-2">Renewal In</div>
            <div className={`text-xl md:text-2xl font-black ${
              isExpiringSoon ? "text-yellow-400" : "text-white"
            }`}>
              {timeRemaining || "N/A"}
            </div>
            {licenseExpiry && (
              <div className="text-xs text-gray-500 mt-1">
                {new Date(licenseExpiry).toLocaleDateString()}
              </div>
            )}
          </div>
        </div>

        {/* Warnings */}
        {isExpiringSoon && (
          <div className="mt-4 pt-4 border-t border-white/10">
            <div className="flex items-center gap-2 text-yellow-400 text-sm">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              License expires soon. Please renew to continue service.
            </div>
          </div>
        )}
      </CardBody>
    </Card>
  )
}

