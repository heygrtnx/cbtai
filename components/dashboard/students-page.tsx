"use client"

import { Card, CardBody, CardHeader, Button, Input, Select, SelectItem } from "@heroui/react"
import Link from "next/link"
import { useState } from "react"

interface Student {
  id: string
  user: {
    name: string | null
    email: string | null
    phone: string | null
  } | null
  class: {
    name: string
  } | null
}

interface StudentsPageProps {
  students: Student[]
  classes: string[]
}

export function StudentsPage({ students, classes }: StudentsPageProps) {
  const [showAddForm, setShowAddForm] = useState(false)
  const [showCSVSample, setShowCSVSample] = useState(false)

  const csvSample = `name,email,phone,admissionNumber,class,dateOfBirth,gender
John Doe,john.doe@example.com,+2348012345678,STU001,JSS1A,2010-05-15,Male
Jane Smith,jane.smith@example.com,+2348023456789,STU002,JSS1B,2010-08-20,Female
Michael Johnson,michael.j@example.com,+2348034567890,STU003,SSS1A,2009-03-10,Male`

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
              <h1 className="text-2xl md:text-3xl font-black text-white">Manage Students</h1>
              <p className="text-sm md:text-base text-gray-400 mt-1">Upload and manage student accounts</p>
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
          {/* Add Student Form */}
          {showAddForm && (
            <Card className="bg-white/5 backdrop-blur-xl border border-white/10 mb-6">
              <CardHeader className="p-4 md:p-6 pb-0">
                <div className="flex items-center justify-between w-full">
                  <h2 className="text-xl md:text-2xl font-bold text-white">Add Student Manually</h2>
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
                      label="Full Name"
                      placeholder="Enter student name"
                      className="text-white"
                      classNames={{
                        input: "text-white",
                        label: "text-gray-400",
                      }}
                    />
                    <Input
                      label="Email"
                      type="email"
                      placeholder="student@example.com"
                      className="text-white"
                      classNames={{
                        input: "text-white",
                        label: "text-gray-400",
                      }}
                    />
                    <Input
                      label="Phone"
                      placeholder="+2348012345678"
                      className="text-white"
                      classNames={{
                        input: "text-white",
                        label: "text-gray-400",
                      }}
                    />
                    <Input
                      label="Admission Number"
                      placeholder="STU001"
                      className="text-white"
                      classNames={{
                        input: "text-white",
                        label: "text-gray-400",
                      }}
                    />
                    <Select
                      label="Class"
                      placeholder="Select class"
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
                      label="Date of Birth"
                      type="date"
                      className="text-white"
                      classNames={{
                        input: "text-white",
                        label: "text-gray-400",
                      }}
                    />
                    <Select
                      label="Gender"
                      placeholder="Select gender"
                      className="text-white"
                      classNames={{
                        trigger: "text-white",
                        label: "text-gray-400",
                      }}
                    >
                      <SelectItem value="Male" className="text-white">Male</SelectItem>
                      <SelectItem value="Female" className="text-white">Female</SelectItem>
                      <SelectItem value="Other" className="text-white">Other</SelectItem>
                    </Select>
                  </div>
                  <div className="flex gap-3">
                    <Button
                      type="submit"
                      className="bg-white text-black hover:bg-gray-200 font-semibold"
                    >
                      Add Student
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
                <h2 className="text-xl md:text-2xl font-bold text-white">Bulk Upload Students</h2>
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
                    href="/dashboard/admin/students/upload"
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
                    Required columns: name, email, phone, admissionNumber, class, dateOfBirth, gender
                  </p>
                </div>
              </CardBody>
            )}
          </Card>

          {/* Students List */}
          <Card className="bg-white/5 backdrop-blur-xl border border-white/10 mb-6">
            <CardHeader className="p-4 md:p-6 pb-0">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full gap-4">
                <h2 className="text-xl md:text-2xl font-bold text-white">Students</h2>
                {!showAddForm && (
                  <Button
                    onClick={() => setShowAddForm(true)}
                    className="bg-white text-black hover:bg-gray-200 font-semibold"
                  >
                    Add Student Manually
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardBody className="p-4 md:p-6">
              {students.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-400 mb-4">No students found.</p>
                  <div className="flex gap-3 justify-center">
                    <Button
                      onClick={() => setShowAddForm(true)}
                      className="bg-white text-black hover:bg-gray-200 font-semibold"
                    >
                      Add Student Manually
                    </Button>
                    <Button
                      as={Link}
                      href="/dashboard/admin/students/upload"
                      variant="bordered"
                      className="border-white/20 bg-white/5 hover:bg-white/10 text-white"
                    >
                      Upload CSV
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {students.map((student) => (
                    <Card key={student.id} className="bg-white/5 backdrop-blur-xl border border-white/10 hover:border-white/20 transition-all">
                      <CardBody className="p-4 md:p-6">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                          <div className="flex-1">
                            <h3 className="font-bold text-white text-base md:text-lg mb-1">{student.user?.name || "Unknown"}</h3>
                            <p className="text-xs md:text-sm text-gray-400 mb-1">Email: {student.user?.email || "N/A"}</p>
                            <p className="text-xs md:text-sm text-gray-400 mb-1">Phone: {student.user?.phone || "N/A"}</p>
                            {student.class && (
                              <p className="text-xs md:text-sm text-gray-400">Class: {student.class.name}</p>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              as={Link}
                              href={`/dashboard/admin/students/${student.id}`}
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
