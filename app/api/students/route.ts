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
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json({ students })
  } catch (error) {
    console.error("❌ [STUDENTS GET] Error:", error instanceof Error ? error.message : error)
    return NextResponse.json(
      { error: "Failed to fetch students" },
      { status: 500 }
    )
  }
}

