import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { requireAuth } from "@/lib/utils/auth"
import { UserRole } from "@prisma/client"
import { z } from "zod"

const bulkDeleteSchema = z.object({
  studentIds: z.array(z.string()).min(1),
})

export async function DELETE(request: NextRequest) {
  try {
    const user = await requireAuth()

    if (user.role !== UserRole.SCHOOL_ADMIN) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { studentIds } = bulkDeleteSchema.parse(body)

    // Verify all students belong to the user's school
    const students = await db.student.findMany({
      where: {
        id: { in: studentIds },
        schoolId: user.schoolId!,
      },
    })

    if (students.length !== studentIds.length) {
      return NextResponse.json(
        { error: "Some students not found or unauthorized" },
        { status: 403 }
      )
    }

    // Delete all students (cascade will delete users)
    await db.student.deleteMany({
      where: {
        id: { in: studentIds },
      },
    })

    return NextResponse.json({
      success: true,
      message: `Successfully deleted ${studentIds.length} student(s)`,
      deletedCount: studentIds.length,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.errors },
        { status: 400 }
      )
    }

    console.error("❌ [STUDENTS BULK DELETE] Error:", error instanceof Error ? error.message : error)
    return NextResponse.json(
      { error: "Failed to delete students" },
      { status: 500 }
    )
  }
}

