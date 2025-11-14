"use client"

import { Card, CardBody, CardHeader, Button, Input, Select, SelectItem, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure, Checkbox, Chip, Pagination } from "@heroui/react"
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
  const [uploadProgress, setUploadProgress] = useState(0)
  const [processingProgress, setProcessingProgress] = useState({ current: 0, total: 0 })
  const [searchQuery, setSearchQuery] = useState("")
  const [isMobile, setIsMobile] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
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

  // Pagination calculations
  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedStudents = filteredStudents.slice(startIndex, endIndex)

  // Reset to page 1 when search query changes
  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery])

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
        if (data.error === "License limit reached") {
          toast.error(data.message || "License limit reached. Please upgrade your plan to add more students.", {
            duration: 5000,
          })
        } else {
          const errorMessage = data.error || data.details?.[0]?.message || `Failed to ${editingStudent ? "update" : "create"} student`
          toast.error(errorMessage)
          setError(errorMessage)
        }
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
    setUploadProgress(0)
    setProcessingProgress({ current: 0, total: 0 })

    try {
      // First, parse CSV to get total record count
      const text = await csvFile.text()
      const lines = text.split('\n').filter(line => line.trim())
      const estimatedTotalRecords = Math.max(0, lines.length - 1) // Subtract header
      setProcessingProgress({ current: 0, total: estimatedTotalRecords })

      const formData = new FormData()
      formData.append("file", csvFile)

      // Use XMLHttpRequest for progress tracking
      const xhr = new XMLHttpRequest()

      const response = await new Promise<{ ok: boolean; data: any }>((resolve, reject) => {
        xhr.upload.addEventListener("progress", (e) => {
          if (e.lengthComputable) {
            const percentComplete = Math.round((e.loaded / e.total) * 100)
            setUploadProgress(percentComplete)
          }
        })

        xhr.addEventListener("load", () => {
          // File upload complete, now processing
          setUploadProgress(100)
          
          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              const data = JSON.parse(xhr.responseText)
              // Update processing progress based on response
              if (data.created !== undefined) {
                setProcessingProgress({ current: data.created, total: estimatedTotalRecords })
              }
              resolve({ ok: true, data })
            } catch (e) {
              reject(new Error("Failed to parse response"))
            }
          } else {
            try {
              const data = JSON.parse(xhr.responseText)
              resolve({ ok: false, data })
            } catch (e) {
              reject(new Error(`Upload failed with status ${xhr.status}`))
            }
          }
        })

        xhr.addEventListener("error", () => {
          reject(new Error("Upload failed"))
        })

        xhr.addEventListener("abort", () => {
          reject(new Error("Upload aborted"))
        })

        xhr.open("POST", "/api/students/upload")
        xhr.send(formData)
      })

      const data = response.data

      if (!response.ok) {
        if (data.limitReached || data.error === "License limit reached") {
          toast.error(data.message || "License limit reached. Please upgrade your plan to add more students.", {
            duration: 5000,
          })
        } else if (data.errors && Array.isArray(data.errors) && data.errors.length > 0) {
          // Show validation errors
          const errorMessages = data.errors.map((e: any) => `Row ${e.row}: ${e.message}`).join("\n")
          toast.error(data.message || `CSV validation errors:\n${errorMessages}`, {
            duration: 8000,
          })
        } else {
          toast.error(data.message || data.error || "Failed to upload CSV", {
            duration: 5000,
          })
        }
        setError(data.message || data.error || "Failed to upload CSV")
        return
      }

      if (data.limitReached) {
        toast.warning(data.message || `Uploaded ${data.created} students. ${data.skipped} were skipped due to license limit.`, {
          duration: 6000,
        })
      } else if (data.duplicates && data.duplicates > 0) {
        toast.warning(data.message || `Uploaded ${data.created} student(s). ${data.duplicates} duplicate record(s) were skipped.`, {
          duration: 6000,
        })
      } else {
        toast.success(data.message || `Successfully uploaded ${data.created} student(s)!`)
      }
      
      // Show errors if any (including duplicates)
      if (data.errors && Array.isArray(data.errors) && data.errors.length > 0) {
        const errorMessages = data.errors.map((e: any) => `Row ${e.row}: ${e.message}`).join("\n")
        if (data.errors.length <= 10) {
          toast.info(`Details:\n${errorMessages}`, {
            duration: 8000,
          })
        } else {
          toast.info(`${data.errors.length} records had issues. Check the console for details.`, {
            duration: 6000,
          })
          console.log("Upload errors:", data.errors)
        }
      }
      setCsvFile(null)
      setUploadProgress(0)
      setProcessingProgress({ current: 0, total: 0 })
      await fetchStudents()
    } catch (err: any) {
      const errorMessage = err.message || "Failed to upload CSV"
      toast.error(errorMessage)
      setError(errorMessage)
      setUploadProgress(0)
      setProcessingProgress({ current: 0, total: 0 })
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
              ) : (
                <>
                {/* Mobile Card View */}
                {isMobile && (
                  <div className="space-y-4">
                    {paginatedStudents.map((student) => (
                      <Card key={student.id} className="bg-white/5 border border-white/10">
                        <CardBody className="p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3 flex-1">
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
                          </div>
                          <div className="space-y-1 text-xs text-gray-400">
                            <p><span className="text-gray-500">Admission:</span> {student.admissionNumber}</p>
                            <p><span className="text-gray-500">Email:</span> {student.user?.email || "N/A"}</p>
                            <p><span className="text-gray-500">Phone:</span> {student.user?.phone || "N/A"}</p>
                          </div>
                          <div className="flex flex-wrap gap-2 mb-3 mt-3">
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
                    {totalPages > 1 && (
                      <div className="flex flex-col items-center gap-4 mt-4">
                        <Pagination
                          total={totalPages}
                          page={currentPage}
                          onChange={setCurrentPage}
                          size="sm"
                          classNames={{
                            wrapper: "gap-0",
                            item: "bg-white/5 text-white border-white/10",
                            cursor: "bg-white text-black",
                            prev: "bg-white/5 text-white",
                            next: "bg-white/5 text-white",
                          }}
                        />
                        <span className="text-sm text-gray-400">
                          Showing {startIndex + 1} to {Math.min(endIndex, filteredStudents.length)} of {filteredStudents.length} students
                        </span>
                      </div>
                    )}
                  </div>
                )}
                {/* Desktop Table View */}
                {!isMobile && (
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
                      {paginatedStudents.map((student) => (
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
                  {totalPages > 1 && (
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4 px-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-400">Rows per page:</span>
                        <Select
                          selectedKeys={[itemsPerPage.toString()]}
                          onSelectionChange={(keys) => {
                            const value = Array.from(keys)[0] as string
                            setItemsPerPage(Number(value))
                            setCurrentPage(1)
                          }}
                          size="sm"
                          className="w-20"
                          classNames={{
                            trigger: "bg-white/5 border-white/10 text-white",
                            popoverContent: "bg-black border-white/10",
                          }}
                        >
                          <SelectItem key="10" value="10">10</SelectItem>
                          <SelectItem key="25" value="25">25</SelectItem>
                          <SelectItem key="50" value="50">50</SelectItem>
                          <SelectItem key="100" value="100">100</SelectItem>
                        </Select>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-400">
                          Showing {startIndex + 1} to {Math.min(endIndex, filteredStudents.length)} of {filteredStudents.length} students
                        </span>
                      </div>
                      <Pagination
                        total={totalPages}
                        page={currentPage}
                        onChange={setCurrentPage}
                        size="sm"
                        classNames={{
                          wrapper: "gap-0",
                          item: "bg-white/5 text-white border-white/10",
                          cursor: "bg-white text-black",
                          prev: "bg-white/5 text-white",
                          next: "bg-white/5 text-white",
                        }}
                      />
                    </div>
                  )}
                </div>
                )}
                </>
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
                      onChange={(e) => {
                        setCsvFile(e.target.files?.[0] || null)
                        setUploadProgress(0)
                      }}
                      disabled={csvUploading}
                      className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-white file:text-black hover:file:bg-gray-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                    {csvFile && (
                      <p className="text-xs text-gray-400 mt-2">
                        Selected: {csvFile.name} ({(csvFile.size / 1024).toFixed(2)} KB)
                      </p>
                    )}
                  </div>
                  {csvUploading && (
                    <div className="space-y-4">
                      {/* File Upload Progress */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-400">Uploading file...</span>
                          <span className="text-white font-semibold">{uploadProgress}%</span>
                        </div>
                        <div className="w-full bg-white/5 rounded-full h-2.5 overflow-hidden border border-white/10">
                          <div
                            className="bg-gradient-to-r from-white to-gray-300 h-full rounded-full transition-all duration-300 ease-out shadow-lg"
                            style={{ width: `${uploadProgress}%` }}
                          />
                        </div>
                      </div>
                      {/* Processing Progress */}
                      {uploadProgress === 100 && processingProgress.total > 0 && (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-400">Processing records...</span>
                            <span className="text-white font-semibold">
                              {processingProgress.current} / {processingProgress.total}
                            </span>
                          </div>
                          <div className="w-full bg-white/5 rounded-full h-2.5 overflow-hidden border border-white/10">
                            <div
                              className="bg-gradient-to-r from-blue-400 to-blue-600 h-full rounded-full transition-all duration-300 ease-out shadow-lg"
                              style={{ 
                                width: `${processingProgress.total > 0 ? Math.round((processingProgress.current / processingProgress.total) * 100) : 0}%` 
                              }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  )}
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
