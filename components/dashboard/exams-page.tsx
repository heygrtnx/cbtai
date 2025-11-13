"use client"

import { Card, CardBody, CardHeader, Button, Input, Select, SelectItem } from "@heroui/react"
import Link from "next/link"
import { useState } from "react"

interface Exam {
  id: string
  title: string
  subject: string
  type: string
  status: string
  createdAt: Date
}

interface ExamsPageProps {
  exams: Exam[]
  subjects: string[]
  classes: string[]
}

export function ExamsPage({ exams, subjects, classes }: ExamsPageProps) {
  const [showAddForm, setShowAddForm] = useState(false)
  const [showCSVSample, setShowCSVSample] = useState(false)

  const csvSample = `title,subject,type,startDate,endDate,duration,description
Mathematics Test 1,Mathematics,TEST,2024-12-01 09:00:00,2024-12-01 10:30:00,90,First term mathematics test
English Language Exam,English Language,EXAMINATION,2024-12-15 08:00:00,2024-12-15 11:00:00,180,End of term examination
Physics Quiz,Physics,QUIZ,2024-11-20 14:00:00,2024-11-20 14:30:00,30,Weekly physics quiz`

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
              <h1 className="text-2xl md:text-3xl font-black text-white">Manage Exams</h1>
              <p className="text-sm md:text-base text-gray-400 mt-1">Create and manage exams</p>
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
          {/* Add Exam Form */}
          {showAddForm && (
            <Card className="bg-white/5 backdrop-blur-xl border border-white/10 mb-6">
              <CardHeader className="p-4 md:p-6 pb-0">
                <div className="flex items-center justify-between w-full">
                  <h2 className="text-xl md:text-2xl font-bold text-white">Create Exam Manually</h2>
                  <Button
                    variant="light"
                    onClick={() => setShowAddForm(false)}
                    className="text-white"
                  >
                    ✕
                  </Button>
                </div>
              </CardHeader>
              <CardBody className="p-4 md:p-6">
                <form className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Exam Title"
                      placeholder="e.g., Mathematics Test 1"
                      className="text-white"
                      classNames={{
                        input: "text-white",
                        label: "text-gray-400",
                      }}
                    />
                    <Select
                      label="Subject"
                      placeholder="Select subject"
                      className="text-white"
                      classNames={{
                        trigger: "text-white",
                        label: "text-gray-400",
                      }}
                    >
                      {subjects.map((subject) => (
                        <SelectItem key={subject} value={subject} className="text-white">
                          {subject}
                        </SelectItem>
                      ))}
                    </Select>
                    <Select
                      label="Exam Type"
                      placeholder="Select type"
                      className="text-white"
                      classNames={{
                        trigger: "text-white",
                        label: "text-gray-400",
                      }}
                    >
                      <SelectItem value="CONTINUOUS_ASSESSMENT" className="text-white">Continuous Assessment</SelectItem>
                      <SelectItem value="TEST" className="text-white">Test</SelectItem>
                      <SelectItem value="EXAMINATION" className="text-white">Examination</SelectItem>
                      <SelectItem value="MOCK_EXAM" className="text-white">Mock Exam</SelectItem>
                      <SelectItem value="QUIZ" className="text-white">Quiz</SelectItem>
                    </Select>
                    <Input
                      label="Duration (minutes)"
                      type="number"
                      placeholder="90"
                      className="text-white"
                      classNames={{
                        input: "text-white",
                        label: "text-gray-400",
                      }}
                    />
                    <Input
                      label="Start Date & Time"
                      type="datetime-local"
                      className="text-white"
                      classNames={{
                        input: "text-white",
                        label: "text-gray-400",
                      }}
                    />
                    <Input
                      label="End Date & Time"
                      type="datetime-local"
                      className="text-white"
                      classNames={{
                        input: "text-white",
                        label: "text-gray-400",
                      }}
                    />
                    <Select
                      label="Assign to Class"
                      placeholder="Select class"
                      selectionMode="multiple"
                      className="text-white"
                      classNames={{
                        trigger: "text-white",
                        label: "text-gray-400",
                      }}
                    >
                      {classes.map((className) => (
                        <SelectItem key={className} value={className} className="text-white">
                          {className}
                        </SelectItem>
                      ))}
                    </Select>
                    <Input
                      label="Description (Optional)"
                      placeholder="Exam description"
                      className="text-white"
                      classNames={{
                        input: "text-white",
                        label: "text-gray-400",
                      }}
                    />
                  </div>
                  <div className="flex gap-3">
                    <Button
                      type="submit"
                      className="bg-white text-black hover:bg-gray-200 font-semibold"
                    >
                      Create Exam
                    </Button>
                    <Button
                      type="button"
                      variant="bordered"
                      onClick={() => setShowAddForm(false)}
                      className="border-white/20 bg-white/5 hover:bg-white/10 text-white"
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardBody>
            </Card>
          )}

          {/* CSV Upload Section */}
          <Card className="bg-white/5 backdrop-blur-xl border border-white/10 mb-6">
            <CardHeader className="p-4 md:p-6 pb-0">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full gap-4">
                <h2 className="text-xl md:text-2xl font-bold text-white">Bulk Upload Exams</h2>
                <div className="flex gap-3">
                  <Button
                    onClick={() => setShowCSVSample(!showCSVSample)}
                    variant="bordered"
                    className="border-white/20 bg-white/5 hover:bg-white/10 text-white"
                  >
                    {showCSVSample ? "Hide" : "Show"} CSV Sample
                  </Button>
                  <Button
                    as={Link}
                    href="/dashboard/admin/exams/upload"
                    className="bg-white text-black hover:bg-gray-200 font-semibold"
                  >
                    Upload CSV File
                  </Button>
                </div>
              </div>
            </CardHeader>
            {showCSVSample && (
              <CardBody className="p-4 md:p-6 pt-0">
                <div className="bg-black/50 rounded-lg p-4 border border-white/10">
                  <p className="text-sm text-gray-400 mb-3">CSV Format Sample:</p>
                  <pre className="text-xs text-gray-300 overflow-x-auto font-mono">
                    {csvSample}
                  </pre>
                  <p className="text-xs text-gray-500 mt-3">
                    Required columns: title, subject, type, startDate, endDate, duration, description
                  </p>
                </div>
              </CardBody>
            )}
          </Card>

          {/* Exams List */}
          <Card className="bg-white/5 backdrop-blur-xl border border-white/10 mb-6">
            <CardHeader className="p-4 md:p-6 pb-0">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full gap-4">
                <h2 className="text-xl md:text-2xl font-bold text-white">Exams</h2>
                {!showAddForm && (
                  <Button
                    onClick={() => setShowAddForm(true)}
                    className="bg-white text-black hover:bg-gray-200 font-semibold"
                  >
                    Create Exam Manually
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardBody className="p-4 md:p-6">
              {exams.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-400 mb-4">No exams found.</p>
                  <div className="flex gap-3 justify-center">
                    <Button
                      onClick={() => setShowAddForm(true)}
                      className="bg-white text-black hover:bg-gray-200 font-semibold"
                    >
                      Create Exam Manually
                    </Button>
                    <Button
                      as={Link}
                      href="/dashboard/admin/exams/upload"
                      variant="bordered"
                      className="border-white/20 bg-white/5 hover:bg-white/10 text-white"
                    >
                      Upload CSV
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {exams.map((exam) => (
                    <Card key={exam.id} className="bg-white/5 backdrop-blur-xl border border-white/10 hover:border-white/20 transition-all">
                      <CardBody className="p-4 md:p-6">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                          <div className="flex-1">
                            <h3 className="font-bold text-white text-base md:text-lg mb-1">{exam.title}</h3>
                            <p className="text-xs md:text-sm text-gray-400 mb-1">Subject: {exam.subject}</p>
                            <p className="text-xs md:text-sm text-gray-400 mb-1">Type: {exam.type.replace("_", " ")}</p>
                            <p className="text-xs md:text-sm text-gray-400">Status: {exam.status}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              as={Link}
                              href={`/dashboard/admin/exams/${exam.id}`}
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

