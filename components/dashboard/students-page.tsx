"use client"

import { Card, CardBody, CardHeader, Button, Input, Select, SelectItem, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure, Checkbox, Chip } from "@heroui/react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

interface Student {
  id: string
  admissionNumber: string
  dateOfBirth: string | null
  gender: string | null
  user: {
    id: string
    name: string | null
    email: string | null
    phone: string | null
  } | null
  class: {
    id: string
    name: string
  } | null
}

interface StudentsPageProps {
  students: Student[]
  classes: string[]
}

export function StudentsPage({ students: initialStudents, classes }: StudentsPageProps) {
  const router = useRouter()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure()
  const { isOpen: isBulkUploadOpen, onOpen: onBulkUploadOpen, onClose: onBulkUploadClose } = useDisclosure()
  const [students, setStudents] = useState<Student[]>(initialStudents)
  const [selectedStudents, setSelectedStudents] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [editingStudent, setEditingStudent] = useState<Student | null>(null)
  const [csvFile, setCsvFile] = useState<File | null>(null)
  const [csvUploading, setCsvUploading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [isMobile, setIsMobile] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    admissionNumber: "",
    className: "",
    dateOfBirth: "",
    gender: "",
  })

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  // Fetch students on mount and when needed
  const fetchStudents = async () => {
    try {
      const response = await fetch("/api/students")
      if (response.ok) {
        const data = await response.json()
        setStudents(data.students || [])
      }
    } catch (err) {
      console.error("Failed to fetch students:", err)
    }
  }

  useEffect(() => {
    fetchStudents()
  }, [])

  // Filter students based on search
  const filteredStudents = students.filter((student) => {
    if (!searchQuery) return true
    const query = searchQuery.toLowerCase()
    return (
      student.user?.name?.toLowerCase().includes(query) ||
      student.admissionNumber.toLowerCase().includes(query) ||
      student.user?.email?.toLowerCase().includes(query) ||
      student.user?.phone?.toLowerCase().includes(query) ||
      student.class?.name?.toLowerCase().includes(query)
    )
  })

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault()
    }
    
    if (!formData.name) {
      toast.error("Name is required")
      return
    }

    setError("")
    setLoading(true)

    try {
      const url = editingStudent ? `/api/students/${editingStudent.id}` : "/api/students/create"
      const method = editingStudent ? "PUT" : "POST"

      // Clean up email - if empty string, send undefined
      const email = formData.email && formData.email.trim() ? formData.email.trim() : undefined
      // Validate email format if provided
      if (email && !email.includes("@")) {
        toast.error("Please enter a valid email address")
        setLoading(false)
        return
      }

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: email,
          phone: formData.phone && formData.phone.trim() ? formData.phone.trim() : undefined,
          admissionNumber: formData.admissionNumber && formData.admissionNumber.trim() ? formData.admissionNumber.trim() : undefined,
          className: formData.className || undefined,
          dateOfBirth: formData.dateOfBirth || undefined,
          gender: formData.gender || undefined,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        const errorMessage = data.error || data.details?.[0]?.message || `Failed to ${editingStudent ? "update" : "create"} student`
        toast.error(errorMessage)
        setError(errorMessage)
        return
      }

      toast.success(`Student ${editingStudent ? "updated" : "created"} successfully!`)
      resetForm()
      onClose()
      onEditClose()
      
      await fetchStudents()
    } catch (err: any) {
      const errorMessage = err.message || `Failed to ${editingStudent ? "update" : "create"} student`
      toast.error(errorMessage)
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (student: Student) => {
    setEditingStudent(student)
    setFormData({
      name: student.user?.name || "",
      email: student.user?.email || "",
      phone: student.user?.phone || "",
      admissionNumber: student.admissionNumber,
      className: student.class?.name || "",
      dateOfBirth: student.dateOfBirth ? new Date(student.dateOfBirth).toISOString().split("T")[0] : "",
      gender: student.gender || "",
    })
    onEditOpen()
  }

  const handleDelete = async (studentId: string) => {
    if (!confirm("Are you sure you want to delete this student?")) {
      return
    }

    try {
      const response = await fetch(`/api/students/${studentId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to delete student")
      }

      toast.success("Student deleted successfully!")
      await fetchStudents()
    } catch (err: any) {
      toast.error(err.message || "Failed to delete student")
    }
  }

  const handleBulkDelete = async () => {
    if (selectedStudents.size === 0) {
      toast.error("Please select at least one student to delete")
      return
    }

    if (!confirm(`Are you sure you want to delete ${selectedStudents.size} student(s)?`)) {
      return
    }

    try {
      const response = await fetch("/api/students/bulk", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentIds: Array.from(selectedStudents),
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to delete students")
      }

      toast.success(`Successfully deleted ${selectedStudents.size} student(s)!`)
      setSelectedStudents(new Set())
      await fetchStudents()
    } catch (err: any) {
      toast.error(err.message || "Failed to delete students")
    }
  }

  const handleDownloadAll = () => {
    window.location.href = "/api/students/download"
  }

  const handleDownloadTemplate = () => {
    window.location.href = "/api/students/template"
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

      toast.success("CSV uploaded successfully!")
      setCsvFile(null)
      await fetchStudents()
    } catch (err: any) {
      const errorMessage = err.message || "Failed to upload CSV"
      toast.error(errorMessage)
      setError(errorMessage)
    } finally {
      setCsvUploading(false)
    }
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedStudents(new Set(filteredStudents.map(s => s.id)))
    } else {
      setSelectedStudents(new Set())
    }
  }

  const handleSelectStudent = (studentId: string, checked: boolean) => {
    const newSelected = new Set(selectedStudents)
    if (checked) {
      newSelected.add(studentId)
    } else {
      newSelected.delete(studentId)
    }
    setSelectedStudents(newSelected)
  }

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      admissionNumber: "",
      className: "",
      dateOfBirth: "",
      gender: "",
    })
    setEditingStudent(null)
    setError("")
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
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-black text-white">Manage Students</h1>
                <p className="text-sm md:text-base text-gray-400 mt-1">View, add, edit, and manage student accounts</p>
              </div>
              <Button
                as={Link}
                href="/dashboard/admin"
                variant="light"
                size={isMobile ? "sm" : "md"}
                className="text-white bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 w-full sm:w-auto"
              >
                ← Back
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 py-6 md:py-8 lg:py-12">
          {/* Search and Students Table */}
          <Card className="bg-white/5 backdrop-blur-xl border border-white/10">
            <CardHeader className="p-4 md:p-6 pb-0">
              <div className="flex flex-col gap-4 w-full">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <h2 className="text-lg md:text-xl font-bold text-white">
                    Students ({filteredStudents.length})
                  </h2>
                  <Input
                    placeholder="Search students..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    classNames={{
                      input: "text-white",
                      inputWrapper: "bg-white/5 border-white/10 w-full sm:w-64",
                    }}
                    startContent={<span className="text-gray-400">🔍</span>}
                  />
                </div>
                <div className="flex flex-col sm:flex-row flex-wrap gap-3 pt-2 border-t border-white/10">
                  <Button
                    onPress={() => {
                      resetForm()
                      onOpen()
                    }}
                    className="bg-white text-black hover:bg-gray-200 font-semibold"
                    startContent={<span className="text-lg">+</span>}
                    size="sm"
                  >
                    Add New Student
                  </Button>
                  <Button
                    onClick={handleDownloadAll}
                    variant="bordered"
                    className="border-white/20 bg-white/5 hover:bg-white/10 text-white"
                    startContent={<span>📥</span>}
                    size="sm"
                  >
                    <span className="hidden sm:inline">Download All Students</span>
                    <span className="sm:hidden">Download All</span>
                  </Button>
                  <Button
                    onClick={handleDownloadTemplate}
                    variant="bordered"
                    className="border-white/20 bg-white/5 hover:bg-white/10 text-white"
                    startContent={<span>📄</span>}
                    size="sm"
                  >
                    <span className="hidden sm:inline">Download CSV Template</span>
                    <span className="sm:hidden">CSV Template</span>
                  </Button>
                  <Button
                    onPress={onBulkUploadOpen}
                    variant="bordered"
                    className="border-white/20 bg-white/5 hover:bg-white/10 text-white"
                    startContent={<span>📤</span>}
                    size="sm"
                  >
                    <span className="hidden sm:inline">Bulk Upload</span>
                    <span className="sm:hidden">Upload</span>
                  </Button>
                  {selectedStudents.size > 0 && (
                    <Button
                      onClick={handleBulkDelete}
                      className="bg-red-500 text-white hover:bg-red-600 font-semibold"
                      startContent={<span>🗑️</span>}
                      size="sm"
                    >
                      Delete Selected ({selectedStudents.size})
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardBody className="p-4 md:p-6">
              {filteredStudents.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📚</div>
                  <p className="text-gray-400 mb-2 text-lg">
                    {searchQuery ? "No students found matching your search" : "No students found"}
                  </p>
                  {!searchQuery && (
                    <Button
                      onPress={() => {
                        resetForm()
                        onOpen()
                      }}
                      className="bg-white text-black hover:bg-gray-200 font-semibold mt-4"
                    >
                      Add Your First Student
                    </Button>
                  )}
                </div>
              ) : isMobile ? (
                // Mobile Card View
                <div className="space-y-3">
                  {filteredStudents.map((student) => (
                    <Card key={student.id} className="bg-white/5 backdrop-blur-xl border border-white/10 hover:border-white/20 transition-all">
                      <CardBody className="p-4">
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Checkbox
                                isSelected={selectedStudents.has(student.id)}
                                onValueChange={(checked) => handleSelectStudent(student.id, checked)}
                                classNames={{
                                  base: "text-white",
                                  wrapper: "after:bg-white after:text-black",
                                }}
                              />
                              <h3 className="font-bold text-white text-base">{student.user?.name || "N/A"}</h3>
                            </div>
                            <div className="space-y-1 text-xs text-gray-400">
                              <p><span className="text-gray-500">Admission:</span> {student.admissionNumber}</p>
                              <p><span className="text-gray-500">Email:</span> {student.user?.email || "N/A"}</p>
                              <p><span className="text-gray-500">Phone:</span> {student.user?.phone || "N/A"}</p>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2 mb-3">
                          {student.class?.name && (
                            <Chip size="sm" variant="flat" className="bg-white/10 text-white">
                              {student.class.name}
                            </Chip>
                          )}
                          {student.gender && (
                            <Chip size="sm" variant="flat" className="bg-white/10 text-white">
                              {student.gender}
                            </Chip>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="light"
                            onPress={() => handleEdit(student)}
                            className="text-blue-400 hover:text-blue-300 flex-1"
                          >
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="light"
                            onPress={() => handleDelete(student.id)}
                            className="text-red-400 hover:text-red-300 flex-1"
                          >
                            Delete
                          </Button>
                        </div>
                      </CardBody>
                    </Card>
                  ))}
                </div>
              ) : (
                // Desktop Table View
                <div className="overflow-x-auto">
                  <Table 
                    aria-label="Students table"
                    classNames={{
                      wrapper: "bg-transparent",
                      th: "bg-white/5 text-gray-400 border-b border-white/10 text-xs md:text-sm font-semibold",
                      td: "bg-white/5 text-white border-b border-white/10 text-xs md:text-sm",
                      tr: "hover:bg-white/5 transition-colors",
                    }}
                  >
                    <TableHeader>
                      <TableColumn width={50}>
                        <Checkbox
                          isSelected={selectedStudents.size === filteredStudents.length && filteredStudents.length > 0}
                          isIndeterminate={selectedStudents.size > 0 && selectedStudents.size < filteredStudents.length}
                          onValueChange={handleSelectAll}
                          classNames={{
                            base: "text-white",
                            wrapper: "after:bg-white after:text-black",
                          }}
                        />
                      </TableColumn>
                      <TableColumn>NAME</TableColumn>
                      <TableColumn>ADMISSION NUMBER</TableColumn>
                      <TableColumn>EMAIL</TableColumn>
                      <TableColumn>PHONE</TableColumn>
                      <TableColumn>CLASS</TableColumn>
                      <TableColumn>GENDER</TableColumn>
                      <TableColumn width={150}>ACTIONS</TableColumn>
                    </TableHeader>
                    <TableBody>
                      {filteredStudents.map((student) => (
                        <TableRow key={student.id}>
                          <TableCell>
                            <Checkbox
                              isSelected={selectedStudents.has(student.id)}
                              onValueChange={(checked) => handleSelectStudent(student.id, checked)}
                              classNames={{
                                base: "text-white",
                                wrapper: "after:bg-white after:text-black",
                              }}
                            />
                          </TableCell>
                          <TableCell className="font-medium">{student.user?.name || "N/A"}</TableCell>
                          <TableCell>{student.admissionNumber}</TableCell>
                          <TableCell className="text-gray-300">{student.user?.email || "N/A"}</TableCell>
                          <TableCell className="text-gray-300">{student.user?.phone || "N/A"}</TableCell>
                          <TableCell>
                            {student.class?.name ? (
                              <Chip size="sm" variant="flat" className="bg-white/10 text-white">
                                {student.class.name}
                              </Chip>
                            ) : (
                              "N/A"
                            )}
                          </TableCell>
                          <TableCell>
                            {student.gender ? (
                              <Chip size="sm" variant="flat" className="bg-white/10 text-white">
                                {student.gender}
                              </Chip>
                            ) : (
                              "N/A"
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button
                                size="sm"
                                variant="light"
                                onPress={() => handleEdit(student)}
                                className="text-blue-400 hover:text-blue-300 min-w-0"
                              >
                                Edit
                              </Button>
                              <Button
                                size="sm"
                                variant="light"
                                onPress={() => handleDelete(student.id)}
                                className="text-red-400 hover:text-red-300 min-w-0"
                              >
                                Delete
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardBody>
          </Card>
        </div>
      </div>

      {/* Add Student Modal */}
      <Modal 
        isOpen={isOpen} 
        onClose={() => {
          onClose()
          resetForm()
        }}
        size={isMobile ? "full" : "2xl"}
        scrollBehavior="inside"
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
                <h2 className="text-xl md:text-2xl font-bold">Add New Student</h2>
              </ModalHeader>
              <ModalBody>
                {error && (
                  <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 text-red-400 rounded-lg text-sm">
                    {error}
                  </div>
                )}
                <form id="add-student-form" onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Full Name <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Enter student name"
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-white/50 focus:border-white/30 outline-none transition-all text-white placeholder-gray-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="student@example.com"
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-white/50 focus:border-white/30 outline-none transition-all text-white placeholder-gray-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Phone
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+2348012345678"
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-white/50 focus:border-white/30 outline-none transition-all text-white placeholder-gray-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Admission Number
                      </label>
                      <input
                        type="text"
                        value={formData.admissionNumber}
                        onChange={(e) => setFormData({ ...formData, admissionNumber: e.target.value })}
                        placeholder="STU001"
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-white/50 focus:border-white/30 outline-none transition-all text-white placeholder-gray-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Class
                      </label>
                      <select
                        value={formData.className}
                        onChange={(e) => setFormData({ ...formData, className: e.target.value })}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-white/50 focus:border-white/30 outline-none transition-all text-white"
                      >
                        <option value="">Select class</option>
                        {classes.map((className) => (
                          <option key={className} value={className}>
                            {className}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Date of Birth
                      </label>
                      <input
                        type="date"
                        value={formData.dateOfBirth}
                        onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-white/50 focus:border-white/30 outline-none transition-all text-white placeholder-gray-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Gender
                      </label>
                      <select
                        value={formData.gender}
                        onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-white/50 focus:border-white/30 outline-none transition-all text-white"
                      >
                        <option value="">Select gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>
                </form>
              </ModalBody>
              <ModalFooter className="flex-col sm:flex-row gap-2">
                <Button
                  variant="bordered"
                  onPress={() => {
                    onClose()
                    resetForm()
                  }}
                  className="border-white/20 bg-white/5 hover:bg-white/10 text-white w-full sm:w-auto"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  form="add-student-form"
                  disabled={loading}
                  isLoading={loading}
                  className="bg-white text-black hover:bg-gray-200 font-semibold disabled:opacity-50 w-full sm:w-auto"
                >
                  {loading ? "Adding..." : "Add Student"}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* Edit Student Modal */}
      <Modal 
        isOpen={isEditOpen} 
        onClose={() => {
          onEditClose()
          resetForm()
        }}
        size={isMobile ? "full" : "2xl"}
        scrollBehavior="inside"
        classNames={{
          base: "bg-black border border-white/10",
          header: "border-b border-white/10",
          body: "py-6",
          footer: "border-t border-white/10",
        }}
      >
        <ModalContent>
          {(onEditClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 text-white">
                <h2 className="text-xl md:text-2xl font-bold">Edit Student</h2>
              </ModalHeader>
              <ModalBody>
                {error && (
                  <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 text-red-400 rounded-lg text-sm">
                    {error}
                  </div>
                )}
                <form id="edit-student-form" onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Full Name <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Enter student name"
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-white/50 focus:border-white/30 outline-none transition-all text-white placeholder-gray-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="student@example.com"
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-white/50 focus:border-white/30 outline-none transition-all text-white placeholder-gray-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Phone
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+2348012345678"
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-white/50 focus:border-white/30 outline-none transition-all text-white placeholder-gray-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Admission Number
                      </label>
                      <input
                        type="text"
                        value={formData.admissionNumber}
                        onChange={(e) => setFormData({ ...formData, admissionNumber: e.target.value })}
                        placeholder="STU001"
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-white/50 focus:border-white/30 outline-none transition-all text-white placeholder-gray-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Class
                      </label>
                      <select
                        value={formData.className}
                        onChange={(e) => setFormData({ ...formData, className: e.target.value })}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-white/50 focus:border-white/30 outline-none transition-all text-white"
                      >
                        <option value="">Select class</option>
                        {classes.map((className) => (
                          <option key={className} value={className}>
                            {className}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Date of Birth
                      </label>
                      <input
                        type="date"
                        value={formData.dateOfBirth}
                        onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-white/50 focus:border-white/30 outline-none transition-all text-white placeholder-gray-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Gender
                      </label>
                      <select
                        value={formData.gender}
                        onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-white/50 focus:border-white/30 outline-none transition-all text-white"
                      >
                        <option value="">Select gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>
                </form>
              </ModalBody>
              <ModalFooter className="flex-col sm:flex-row gap-2">
                <Button
                  variant="bordered"
                  onPress={() => {
                    onEditClose()
                    resetForm()
                  }}
                  className="border-white/20 bg-white/5 hover:bg-white/10 text-white w-full sm:w-auto"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  form="edit-student-form"
                  disabled={loading}
                  isLoading={loading}
                  className="bg-white text-black hover:bg-gray-200 font-semibold disabled:opacity-50 w-full sm:w-auto"
                >
                  {loading ? "Updating..." : "Update Student"}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* Bulk Upload Modal */}
      <Modal 
        isOpen={isBulkUploadOpen} 
        onClose={() => {
          onBulkUploadClose()
          setCsvFile(null)
          setError("")
        }}
        size={isMobile ? "full" : "2xl"}
        scrollBehavior="inside"
        classNames={{
          base: "bg-black border border-white/10",
          header: "border-b border-white/10",
          body: "py-6",
          footer: "border-t border-white/10",
        }}
      >
        <ModalContent>
          {(onBulkUploadClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 text-white">
                <h2 className="text-xl md:text-2xl font-bold">Bulk Upload Students</h2>
                <p className="text-sm text-gray-400 font-normal">Upload a CSV file to add multiple students at once</p>
              </ModalHeader>
              <ModalBody>
                {error && (
                  <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 text-red-400 rounded-lg text-sm">
                    {error}
                  </div>
                )}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Select CSV File
                    </label>
                    <input
                      type="file"
                      accept=".csv"
                      onChange={(e) => setCsvFile(e.target.files?.[0] || null)}
                      className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-white file:text-black hover:file:bg-gray-200 cursor-pointer"
                    />
                    {csvFile && (
                      <p className="text-xs text-gray-400 mt-2">Selected: {csvFile.name}</p>
                    )}
                  </div>
                  <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                    <p className="text-sm text-gray-300 mb-2">
                      <strong className="text-white">Need a template?</strong> Download the CSV template first to see the required format.
                    </p>
                    <Button
                      onClick={handleDownloadTemplate}
                      variant="light"
                      size="sm"
                      className="text-white"
                    >
                      📄 Download CSV Template
                    </Button>
                  </div>
                </div>
              </ModalBody>
              <ModalFooter className="flex-col sm:flex-row gap-2">
                <Button
                  variant="bordered"
                  onPress={() => {
                    onBulkUploadClose()
                    setCsvFile(null)
                    setError("")
                  }}
                  className="border-white/20 bg-white/5 hover:bg-white/10 text-white w-full sm:w-auto"
                >
                  Cancel
                </Button>
                <Button
                  onClick={async () => {
                    await handleCsvUpload()
                    if (!error) {
                      onBulkUploadClose()
                      setCsvFile(null)
                    }
                  }}
                  disabled={!csvFile || csvUploading}
                  isLoading={csvUploading}
                  className="bg-white text-black hover:bg-gray-200 font-semibold disabled:opacity-50 w-full sm:w-auto"
                >
                  {csvUploading ? "Uploading..." : "Upload CSV File"}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  )
}
