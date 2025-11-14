"use client"

import { Card, CardBody, CardHeader, Button, Input, Select, SelectItem, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@heroui/react"
import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"

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
  const router = useRouter()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [showCSVSample, setShowCSVSample] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    admissionNumber: "",
    className: "",
    dateOfBirth: "",
    gender: "",
  })
  const [csvFile, setCsvFile] = useState<File | null>(null)
  const [csvUploading, setCsvUploading] = useState(false)

  const csvSampleData = [
    {
      "Student Surname": "Doe",
      "Student First Name": "John",
      "Student Middle Name": "Michael",
      "Student Email": "john.doe@example.com",
      "Student Phone Number": "+2348012345678",
      "Student ID/Matric Number/Admission Number": "STU001",
      "Class/Level": "JSS1A",
      "Date of Birth": "2010-05-15",
      "Gender": "Male",
      "Parent/Guardian Name": "Jane Doe",
      "Parent/Guardian Phone": "+2348012345679",
      "Parent/Guardian Email": "jane.doe@example.com",
    },
    {
      "Student Surname": "Smith",
      "Student First Name": "Jane",
      "Student Middle Name": "",
      "Student Email": "jane.smith@example.com",
      "Student Phone Number": "+2348023456789",
      "Student ID/Matric Number/Admission Number": "STU002",
      "Class/Level": "JSS1B",
      "Date of Birth": "2010-08-20",
      "Gender": "Female",
      "Parent/Guardian Name": "John Smith",
      "Parent/Guardian Phone": "+2348023456790",
      "Parent/Guardian Email": "john.smith@example.com",
    },
    {
      "Student Surname": "Johnson",
      "Student First Name": "Michael",
      "Student Middle Name": "David",
      "Student Email": "michael.j@example.com",
      "Student Phone Number": "+2348034567890",
      "Student ID/Matric Number/Admission Number": "STU003",
      "Class/Level": "SSS1A",
      "Date of Birth": "2009-03-10",
      "Gender": "Male",
      "Parent/Guardian Name": "Sarah Johnson",
      "Parent/Guardian Phone": "+2348034567891",
      "Parent/Guardian Email": "sarah.j@example.com",
    },
  ]

  const csvColumns = [
    "Student Surname",
    "Student First Name",
    "Student Middle Name",
    "Student Email",
    "Student Phone Number",
    "Student ID/Matric Number/Admission Number",
    "Class/Level",
    "Date of Birth",
    "Gender",
    "Parent/Guardian Name",
    "Parent/Guardian Phone",
    "Parent/Guardian Email",
  ]

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault()
    }
    
    // Validate required fields
    if (!formData.name || !formData.admissionNumber) {
      setError("Name and Admission Number are required")
      return
    }

    setError("")
    setLoading(true)

    try {
      const response = await fetch("/api/students/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email || undefined,
          phone: formData.phone || undefined,
          admissionNumber: formData.admissionNumber,
          className: formData.className || undefined,
          dateOfBirth: formData.dateOfBirth || undefined,
          gender: formData.gender || undefined,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to create student")
      }

      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        admissionNumber: "",
        className: "",
        dateOfBirth: "",
        gender: "",
      })
      onClose()
      router.refresh()
    } catch (err: any) {
      setError(err.message || "Failed to create student")
    } finally {
      setLoading(false)
    }
  }

  const handleCsvUpload = async () => {
    if (!csvFile) return

    setError("")
    setCsvUploading(true)

    try {
      const formData = new FormData()
      formData.append("file", csvFile)

      const response = await fetch("/api/students/upload", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to upload CSV")
      }

      setCsvFile(null)
      router.refresh()
    } catch (err: any) {
      setError(err.message || "Failed to upload CSV")
    } finally {
      setCsvUploading(false)
    }
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
          {/* Add Student Modal */}
          <Modal 
            isOpen={isOpen} 
            onClose={onClose}
            size="2xl"
            classNames={{
              base: "bg-black border border-white/10",
              header: "border-b border-white/10",
              body: "py-6",
              footer: "border-t border-white/10",
            }}
          >
            <ModalContent>
              {(onClose) => (
                <>
                  <ModalHeader className="flex flex-col gap-1 text-white">
                    <h2 className="text-xl md:text-2xl font-bold">Add Student Manually</h2>
                  </ModalHeader>
                  <ModalBody>
                    {error && (
                      <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 text-red-400 rounded-lg text-sm">
                        {error}
                      </div>
                    )}
                    <form id="add-student-form" onSubmit={handleSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Input
                          label="Full Name"
                          placeholder="Enter student name"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          required
                          classNames={{
                            input: "text-white",
                            label: "text-gray-400",
                            inputWrapper: "bg-white/5 border-white/10",
                          }}
                        />
                        <Input
                          label="Email"
                          type="email"
                          placeholder="student@example.com"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          classNames={{
                            input: "text-white",
                            label: "text-gray-400",
                            inputWrapper: "bg-white/5 border-white/10",
                          }}
                        />
                        <Input
                          label="Phone"
                          placeholder="+2348012345678"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          classNames={{
                            input: "text-white",
                            label: "text-gray-400",
                            inputWrapper: "bg-white/5 border-white/10",
                          }}
                        />
                        <Input
                          label="Admission Number"
                          placeholder="STU001"
                          value={formData.admissionNumber}
                          onChange={(e) => setFormData({ ...formData, admissionNumber: e.target.value })}
                          required
                          classNames={{
                            input: "text-white",
                            label: "text-gray-400",
                            inputWrapper: "bg-white/5 border-white/10",
                          }}
                        />
                        <Select
                          label="Class"
                          placeholder="Select class"
                          selectedKeys={formData.className ? [formData.className] : []}
                          onSelectionChange={(keys) => {
                            const selected = Array.from(keys)[0] as string
                            setFormData({ ...formData, className: selected || "" })
                          }}
                          classNames={{
                            trigger: "bg-white/5 border-white/10 text-white hover:bg-white/10",
                            label: "text-gray-400",
                            value: "text-white",
                            popoverContent: "bg-white",
                            listbox: "bg-white",
                            listboxItem: "text-black hover:bg-gray-100 data-[hover=true]:bg-gray-100 data-[selected=true]:bg-gray-200 data-[selected=true]:text-black",
                          }}
                        >
                          {classes.map((className) => (
                            <SelectItem 
                              key={className} 
                              value={className}
                              textValue={className}
                              classNames={{
                                base: "text-black",
                              }}
                            >
                              {className}
                            </SelectItem>
                          ))}
                        </Select>
                        <Input
                          label="Date of Birth"
                          type="date"
                          value={formData.dateOfBirth}
                          onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                          classNames={{
                            input: "text-white",
                            label: "text-gray-400",
                            inputWrapper: "bg-white/5 border-white/10",
                          }}
                        />
                        <Select
                          label="Gender"
                          placeholder="Select gender"
                          selectedKeys={formData.gender ? [formData.gender] : []}
                          onSelectionChange={(keys) => {
                            const selected = Array.from(keys)[0] as string
                            setFormData({ ...formData, gender: selected || "" })
                          }}
                          classNames={{
                            trigger: "bg-white/5 border-white/10 text-white hover:bg-white/10",
                            label: "text-gray-400",
                            value: "text-white",
                            popoverContent: "bg-white",
                            listbox: "bg-white",
                            listboxItem: "text-black hover:bg-gray-100 data-[hover=true]:bg-gray-100 data-[selected=true]:bg-gray-200 data-[selected=true]:text-black",
                          }}
                        >
                          <SelectItem 
                            key="Male" 
                            value="Male"
                            textValue="Male"
                            classNames={{
                              base: "text-black",
                            }}
                          >
                            Male
                          </SelectItem>
                          <SelectItem 
                            key="Female" 
                            value="Female"
                            textValue="Female"
                            classNames={{
                              base: "text-black",
                            }}
                          >
                            Female
                          </SelectItem>
                          <SelectItem 
                            key="Other" 
                            value="Other"
                            textValue="Other"
                            classNames={{
                              base: "text-black",
                            }}
                          >
                            Other
                          </SelectItem>
                        </Select>
                      </div>
                    </form>
                  </ModalBody>
                  <ModalFooter>
                    <Button
                      variant="bordered"
                      onPress={() => {
                        onClose()
                        setError("")
                        setFormData({
                          name: "",
                          email: "",
                          phone: "",
                          admissionNumber: "",
                          className: "",
                          dateOfBirth: "",
                          gender: "",
                        })
                      }}
                      className="border-white/20 bg-white/5 hover:bg-white/10 text-white"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      form="add-student-form"
                      disabled={loading}
                      className="bg-white text-black hover:bg-gray-200 font-semibold disabled:opacity-50"
                    >
                      {loading ? "Adding..." : "Add Student"}
                    </Button>
                  </ModalFooter>
                </>
              )}
            </ModalContent>
          </Modal>

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
                </div>
              </div>
            </CardHeader>
            <CardBody className="p-4 md:p-6">
              {error && (
                <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 text-red-400 rounded-lg text-sm">
                  {error}
                </div>
              )}
              <div className="space-y-4">
                <div>
                  <input
                    type="file"
                    accept=".csv"
                    onChange={(e) => setCsvFile(e.target.files?.[0] || null)}
                    className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-white file:text-black hover:file:bg-gray-200 cursor-pointer"
                  />
                </div>
                <Button
                  onClick={handleCsvUpload}
                  disabled={!csvFile || csvUploading}
                  className="bg-white text-black hover:bg-gray-200 font-semibold disabled:opacity-50"
                >
                  {csvUploading ? "Uploading..." : "Upload CSV File"}
                </Button>
              </div>
              {showCSVSample && (
                <div className="mt-6 bg-black/50 rounded-lg p-4 border border-white/10">
                  <p className="text-sm text-gray-400 mb-4">CSV Format Sample:</p>
                  <div className="overflow-x-auto">
                    <Table 
                      aria-label="CSV Sample Table" 
                      className="text-white"
                      classNames={{
                        wrapper: "bg-transparent",
                        th: "bg-white/5 text-gray-400 border-b border-white/10",
                        td: "bg-white/5 text-white border-b border-white/10",
                      }}
                    >
                      <TableHeader>
                        {csvColumns.map((column) => (
                          <TableColumn key={column} className="text-gray-400 text-xs font-semibold">
                            {column}
                          </TableColumn>
                        ))}
                      </TableHeader>
                      <TableBody>
                        {csvSampleData.map((row, index) => (
                          <TableRow key={index}>
                            {csvColumns.map((column) => (
                              <TableCell key={column} className="text-white text-xs">
                                {row[column as keyof typeof row] || "-"}
                              </TableCell>
                            ))}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                  <div className="mt-4 p-3 bg-white/5 rounded-lg border border-white/10">
                    <p className="text-xs text-gray-400 mb-2">
                      <strong className="text-white">Required columns:</strong> Student Surname, Student First Name, Student ID/Matric Number/Admission Number, Class/Level
                    </p>
                    <p className="text-xs text-gray-400">
                      <strong className="text-white">Optional columns:</strong> Student Middle Name, Student Email, Student Phone Number, Date of Birth, Gender, Parent/Guardian Name, Parent/Guardian Phone, Parent/Guardian Email
                    </p>
                  </div>
                </div>
              )}
            </CardBody>
          </Card>

          {/* Students List */}
          <Card className="bg-white/5 backdrop-blur-xl border border-white/10 mb-6">
            <CardHeader className="p-4 md:p-6 pb-0">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full gap-4">
                <h2 className="text-xl md:text-2xl font-bold text-white">Students</h2>
                <Button
                  onPress={onOpen}
                  className="bg-white text-black hover:bg-gray-200 font-semibold"
                >
                  Add Student Manually
                </Button>
              </div>
            </CardHeader>
            <CardBody className="p-4 md:p-6">
              {students.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-400 mb-4">No students found.</p>
                  <div className="flex gap-3 justify-center">
                    <Button
                      onPress={onOpen}
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
