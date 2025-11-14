import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { requireAuth } from "@/lib/utils/auth"
import { UserRole } from "@prisma/client"
import { createAccessCode } from "@/lib/utils/access-code"
import { sendAccessCodeNotification } from "@/lib/utils/notifications"
import { formatPhoneNumber } from "@/lib/utils/csv"
import bcrypt from "bcryptjs"
import { z } from "zod"

const createStudentSchema = z.object({
  name: z.string().min(1),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().optional().or(z.literal("")),
  admissionNumber: z.string().min(1),
  classId: z.string().optional(),
  className: z.string().optional(),
  dateOfBirth: z.string().optional(),
  gender: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth()

    if (user.role !== UserRole.SCHOOL_ADMIN && user.role !== UserRole.TEACHER) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      )
    }

    const body = await request.json()
    const data = createStudentSchema.parse(body)

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

    // Check if student already exists
    const existingStudent = await db.student.findUnique({
      where: { admissionNumber: data.admissionNumber },
    })

    if (existingStudent) {
      return NextResponse.json(
        { error: "Student with this admission number already exists" },
        { status: 400 }
      )
    }

    // Find or create class
    let classRecord
    if (data.classId) {
      classRecord = await db.class.findUnique({
        where: { id: data.classId },
      })
    } else if (data.className) {
      classRecord = await db.class.findFirst({
        where: {
          name: data.className,
          schoolId: school.id,
        },
      })

      if (!classRecord) {
        classRecord = await db.class.create({
          data: {
            name: data.className,
            level: data.className,
            schoolId: school.id,
          },
        })
      }
    }

    // Create user
    const hashedPassword = await bcrypt.hash(data.admissionNumber, 10)

    const userRecord = await db.user.create({
      data: {
        email: data.email || null,
        phone: data.phone ? formatPhoneNumber(data.phone) : null,
        password: hashedPassword,
        name: data.name,
        role: UserRole.STUDENT,
        schoolId: school.id,
        isActive: true,
      },
    })

    // Create student
    const student = await db.student.create({
      data: {
        userId: userRecord.id,
        schoolId: school.id,
        admissionNumber: data.admissionNumber,
        classId: classRecord?.id || null,
        dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : null,
        gender: data.gender || null,
      },
    })

    // Generate access code
    const accessCode = await createAccessCode(student.id)

    // Send access code notification
    if (userRecord.email || userRecord.phone) {
      await sendAccessCodeNotification(
        userRecord.phone,
        userRecord.email,
        accessCode.code,
        userRecord.name || "Student"
      )
    }

    return NextResponse.json({
      success: true,
      student: {
        id: student.id,
        admissionNumber: student.admissionNumber,
        accessCode: accessCode.code,
      },
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.errors },
        { status: 400 }
      )
    }

    console.error("❌ [STUDENT CREATE] Error:", error instanceof Error ? error.message : error)
    return NextResponse.json(
      { error: "Failed to create student" },
      { status: 500 }
    )
  }
}

