import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { requireAuth } from "@/lib/utils/auth"
import { parseStudentCSV, formatPhoneNumber, StudentCSVRow } from "@/lib/utils/csv"
import { createAccessCode } from "@/lib/utils/access-code"
import { sendAccessCodeNotification } from "@/lib/utils/notifications"
import bcrypt from "bcryptjs"
import { UserRole } from "@prisma/client"

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth()

    if (user.role !== UserRole.SCHOOL_ADMIN && user.role !== UserRole.TEACHER) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      )
    }

    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json(
        { error: "No file uploaded" },
        { status: 400 }
      )
    }

    // Parse CSV
    const parseResult = await parseStudentCSV(file)

    if (parseResult.errors.length > 0) {
      return NextResponse.json(
        {
          error: "CSV validation errors",
          errors: parseResult.errors,
        },
        { status: 400 }
      )
    }

    // Get school
    const school = await db.school.findUnique({
      where: { id: user.schoolId! },
    })

    if (!school) {
      return NextResponse.json(
        { error: "School not found" },
        { status: 404 }
      )
    }

    // Process students
    const results = {
      created: 0,
      errors: [] as Array<{ row: number; message: string }>,
    }

    for (let i = 0; i < parseResult.data.length; i++) {
      const row = parseResult.data[i]

      try {
        // Check if student already exists
        const existingStudent = await db.student.findUnique({
          where: { admissionNumber: row["Student ID/Matric Number/Admission Number"] },
        })

        if (existingStudent) {
          results.errors.push({
            row: i + 2,
            message: "Student with this admission number already exists",
          })
          continue
        }

        // Find or create class
        let classRecord = await db.class.findFirst({
          where: {
            name: row["Class/Level"],
            schoolId: school.id,
          },
        })

        if (!classRecord) {
          classRecord = await db.class.create({
            data: {
              name: row["Class/Level"],
              level: row["Class/Level"], // You might want to parse this better
              schoolId: school.id,
            },
          })
        }

        // Create user
        const hashedPassword = await bcrypt.hash(
          row["Student ID/Matric Number/Admission Number"],
          10
        )

        const userRecord = await db.user.create({
          data: {
            email: row["Student Email"] || null,
            phone: row["Student Phone Number"] ? formatPhoneNumber(row["Student Phone Number"]) : null,
            password: hashedPassword,
            name: `${row["Student First Name"]} ${row["Student Surname"]}`,
            role: UserRole.STUDENT,
            schoolId: school.id,
            isActive: true,
          },
        })

        // Create student
        const student = await db.student.create({
          data: {
            userId: userRecord.id,
            admissionNumber: row["Student ID/Matric Number/Admission Number"],
            schoolId: school.id,
            classId: classRecord.id,
            dateOfBirth: row["Date of Birth"] ? new Date(row["Date of Birth"]) : null,
            gender: row["Gender"] || null,
          },
        })

        // Create access code
        const accessCode = await createAccessCode(student.id, school.schoolCode)

        // Send notification
        await sendAccessCodeNotification(
          userRecord.phone,
          userRecord.email,
          accessCode.code,
          userRecord.name
        )

        results.created++
      } catch (error: any) {
        results.errors.push({
          row: i + 2,
          message: error.message || "Failed to create student",
        })
      }
    }

    return NextResponse.json({
      success: true,
      created: results.created,
      errors: results.errors,
      message: `Successfully created ${results.created} student(s)`,
    })
  } catch (error) {
    console.error("❌ [STUDENT UPLOAD] Student upload error:", error instanceof Error ? error.message : error)
    if (error instanceof Error) {
      console.error("❌ [STUDENT UPLOAD] Error stack:", error.stack)
    }
    return NextResponse.json(
      { error: "Failed to upload students" },
      { status: 500 }
    )
  }
}

