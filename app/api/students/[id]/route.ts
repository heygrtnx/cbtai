import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { requireAuth } from "@/lib/utils/auth"
import { UserRole } from "@prisma/client"
import { formatPhoneNumber } from "@/lib/utils/csv"
import { z } from "zod"

const updateStudentSchema = z.object({
  name: z.string().min(1).optional(),
  email: z.union([z.string().email(), z.literal(""), z.undefined()]).optional(),
  phone: z.string().optional().or(z.literal("")).or(z.undefined()),
  admissionNumber: z.string().optional().or(z.literal("")).or(z.undefined()),
  className: z.string().optional(),
  dateOfBirth: z.string().optional(),
  gender: z.string().optional(),
})

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth()

    if (user.role !== UserRole.SCHOOL_ADMIN && user.role !== UserRole.TEACHER) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      )
    }

    const { id } = await params
    const body = await request.json()
    
    // Clean up email - if empty string, set to undefined
    if (body.email === "" || !body.email) {
      body.email = undefined
    }
    
    const data = updateStudentSchema.parse(body)

    // Get student
    const student = await db.student.findUnique({
      where: { id },
      include: {
        user: true,
        school: true,
      },
    })

    if (!student) {
      return NextResponse.json(
        { error: "Student not found" },
        { status: 404 }
      )
    }

    // Check if user has access to this student's school
    if (student.schoolId !== user.schoolId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      )
    }

    // Update user if name, email, or phone changed
    if (data.name || data.email !== undefined || data.phone !== undefined) {
      await db.user.update({
        where: { id: student.userId },
        data: {
          ...(data.name && { name: data.name }),
          ...(data.email !== undefined && { email: data.email || null }),
          ...(data.phone !== undefined && { phone: data.phone ? formatPhoneNumber(data.phone) : null }),
        },
      })
    }

    // Update class if className provided
    let classId = student.classId
    if (data.className) {
      const school = await db.school.findUnique({
        where: { id: user.schoolId! },
      })

      if (school) {
        let classRecord = await db.class.findFirst({
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
        classId = classRecord.id
      }
    }

    // Update student
    const updatedStudent = await db.student.update({
      where: { id },
      data: {
        ...(data.admissionNumber && { admissionNumber: data.admissionNumber }),
        ...(classId !== undefined && { classId }),
        ...(data.dateOfBirth && { dateOfBirth: new Date(data.dateOfBirth) }),
        ...(data.gender && { gender: data.gender }),
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
        class: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    })

    return NextResponse.json({
      success: true,
      student: updatedStudent,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.errors },
        { status: 400 }
      )
    }

    console.error("❌ [STUDENT UPDATE] Error:", error instanceof Error ? error.message : error)
    return NextResponse.json(
      { error: "Failed to update student" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth()

    if (user.role !== UserRole.SCHOOL_ADMIN && user.role !== UserRole.TEACHER) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      )
    }

    const { id } = await params

    // Get student
    const student = await db.student.findUnique({
      where: { id },
      include: {
        user: true,
      },
    })

    if (!student) {
      return NextResponse.json(
        { error: "Student not found" },
        { status: 404 }
      )
    }

    // Check if user has access to this student's school
    if (student.schoolId !== user.schoolId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      )
    }

    // Delete student (cascade will delete user)
    await db.student.delete({
      where: { id },
    })

    return NextResponse.json({
      success: true,
      message: "Student deleted successfully",
    })
  } catch (error) {
    console.error("❌ [STUDENT DELETE] Error:", error instanceof Error ? error.message : error)
    return NextResponse.json(
      { error: "Failed to delete student" },
      { status: 500 }
    )
  }
}

