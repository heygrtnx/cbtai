import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { requireAuth } from "@/lib/utils/auth"
import { ExamStatus } from "@prisma/client"

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth()
    const { id: examId } = await params

    const exam = await db.exam.findUnique({
      where: { id: examId },
      include: {
        questions: true,
        teacher: {
          include: {
            user: true,
          },
        },
      },
    })

    if (!exam) {
      return NextResponse.json(
        { error: "Exam not found" },
        { status: 404 }
      )
    }

    // Check authorization
    if (exam.teacher.userId !== user.id && user.role !== "SCHOOL_ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      )
    }

    // Validate exam
    if (exam.questions.length === 0) {
      return NextResponse.json(
        { error: "Exam must have at least one question" },
        { status: 400 }
      )
    }

    // Publish exam
    const updatedExam = await db.exam.update({
      where: { id: examId },
      data: {
        status: ExamStatus.PUBLISHED,
      },
    })

    return NextResponse.json({
      success: true,
      exam: updatedExam,
    })
  } catch (error) {
    console.error("Exam publish error:", error)
    return NextResponse.json(
      { error: "Failed to publish exam" },
      { status: 500 }
    )
  }
}

