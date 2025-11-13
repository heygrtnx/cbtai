"use client"

import { Card, CardBody, Button } from "@heroui/react"
import Link from "next/link"

interface TeacherExamDetailPageProps {
  exam: {
    id: string
    title: string
    subject: string
    type: string
    status: string
  }
}

export function TeacherExamDetailPage({ exam }: TeacherExamDetailPageProps) {
  return (
    <div className="min-h-screen bg-black text-white relative overflow-x-hidden">
      <div className="fixed inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

      <div className="relative z-10">
        <div className="w-full px-4 py-4 md:px-6 md:py-6 border-b border-white/10">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-black text-white">Exam Details</h1>
            </div>
            <Button
              as={Link}
              href="/dashboard/teacher"
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
              <div className="space-y-4">
                <div>
                  <p className="text-gray-400 text-sm mb-1">Title</p>
                  <p className="text-white font-semibold">{exam.title}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm mb-1">Subject</p>
                  <p className="text-white font-semibold">{exam.subject}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm mb-1">Type</p>
                  <p className="text-white font-semibold">{exam.type.replace("_", " ")}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm mb-1">Status</p>
                  <p className="text-white font-semibold">{exam.status}</p>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  )
}

