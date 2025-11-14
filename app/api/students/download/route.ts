import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { requireAuth } from "@/lib/utils/auth"
import { UserRole } from "@prisma/client"

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth()

    if (user.role !== UserRole.SCHOOL_ADMIN && user.role !== UserRole.TEACHER) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      )
    }

    const school = await db.school.findUnique({
      where: { id: user.schoolId! },
    })

    if (!school) {
      return NextResponse.json(
        { error: "School not found" },
        { status: 404 }
      )
    }

    const students = await db.student.findMany({
      where: { schoolId: school.id },
      include: {
        user: {
          select: {
            name: true,
            email: true,
            phone: true,
          },
        },
        class: {
          select: {
            name: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    })

    // Convert to CSV format
    const headers = [
      "Student Surname",
      "Student First Name",
      "Student Middle Name",
      "Student Email",
      "Student Phone Number",
      "Student ID/Matric Number/Admission Number",
      "Class/Level",
      "Date of Birth",
      "Gender",
    ]

    const rows = students.map((student) => {
      const nameParts = (student.user?.name || "").split(" ")
      const surname = nameParts[0] || ""
      const firstName = nameParts[1] || ""
      const middleName = nameParts.slice(2).join(" ") || ""

      return [
        surname,
        firstName,
        middleName,
        student.user?.email || "",
        student.user?.phone || "",
        student.admissionNumber,
        student.class?.name || "",
        student.dateOfBirth ? new Date(student.dateOfBirth).toISOString().split("T")[0] : "",
        student.gender || "",
      ]
    })

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")),
    ].join("\n")

    return new NextResponse(csvContent, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="students_${new Date().toISOString().split("T")[0]}.csv"`,
      },
    })
  } catch (error) {
    console.error("❌ [STUDENTS DOWNLOAD] Error:", error instanceof Error ? error.message : error)
    return NextResponse.json(
      { error: "Failed to download students" },
      { status: 500 }
    )
  }
}

