"use client"

import { Card, CardBody, Button } from "@heroui/react"
import Link from "next/link"
import { useState } from "react"

export function TeacherUploadPage() {
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const handleUpload = async () => {
    if (!file) return

    setLoading(true)
    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/teachers/upload", {
        method: "POST",
        body: formData,
      })

      if (response.ok) {
        window.location.href = "/dashboard/admin/teachers"
      }
    } catch (error) {
      console.error("Upload error:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white relative overflow-x-hidden">
      <div className="fixed inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

      <div className="relative z-10">
        <div className="w-full px-4 py-4 md:px-6 md:py-6 border-b border-white/10">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-black text-white">Upload Teachers (CSV)</h1>
            </div>
            <Button
              as={Link}
              href="/dashboard/admin/teachers"
              variant="light"
              className="text-white bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20"
            >
              ← Back
            </Button>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 py-6 md:py-8 lg:py-12">
          <Card className="bg-white/5 backdrop-blur-xl border border-white/10">
            <CardBody className="p-4 md:p-6">
              <input
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="mb-4 text-white"
              />
              <Button
                onClick={handleUpload}
                disabled={!file || loading}
                className="bg-white text-black hover:bg-gray-200 font-semibold"
              >
                {loading ? "Uploading..." : "Upload CSV"}
              </Button>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  )
}

