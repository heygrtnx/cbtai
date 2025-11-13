import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { requireAuth } from "@/lib/utils/auth"
import { UserRole } from "@prisma/client"

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth()

    if (user.role !== UserRole.STUDENT) {
      return NextResponse.json(
        { error: "Only students can attempt exams" },
        { status: 403 }
      )
    }

    const { id: examId } = await params
    const { password } = await request.json()

    // Get exam
    const exam = await db.exam.findUnique({
      where: { id: examId },
      include: {
        questions: {
          orderBy: { order: "asc" },
        },
        attempts: {
          where: {
            studentId: user.id,
            isCompleted: false,
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

    // Check if exam is active
    const now = new Date()
    if (now < exam.startDate || now > exam.endDate) {
      return NextResponse.json(
        { error: "Exam is not currently available" },
        { status: 400 }
      )
    }

    // Check password if required
    if (exam.password && exam.password !== password) {
      return NextResponse.json(
        { error: "Invalid exam password" },
        { status: 401 }
      )
    }

    // Check attempts
    const completedAttempts = await db.examAttempt.count({
      where: {
        examId,
        studentId: user.id,
        isCompleted: true,
      },
    })

    if (completedAttempts >= exam.maxAttempts) {
      return NextResponse.json(
        { error: "Maximum attempts reached" },
        { status: 400 }
      )
    }

    // Check if there's an incomplete attempt
    const incompleteAttempt = exam.attempts[0]
    if (incompleteAttempt) {
      return NextResponse.json({
        success: true,
        attemptId: incompleteAttempt.id,
        exam: {
          id: exam.id,
          title: exam.title,
          duration: exam.duration,
          questions: exam.randomizeQuestions
            ? exam.questions.sort(() => Math.random() - 0.5)
            : exam.questions,
        },
      })
    }

    // Get student
    const student = await db.student.findUnique({
      where: { userId: user.id },
    })

    if (!student) {
      return NextResponse.json(
        { error: "Student profile not found" },
        { status: 404 }
      )
    }

    // Create new attempt
    const attempt = await db.examAttempt.create({
      data: {
        examId,
        studentId: student.id,
        startedAt: new Date(),
        isCompleted: false,
        ipAddress: request.headers.get("x-forwarded-for") || undefined,
      },
    })

    // Prepare questions (randomize if needed)
    let questions = exam.questions
    if (exam.randomizeQuestions) {
      questions = [...questions].sort(() => Math.random() - 0.5)
    }

    // Randomize options if needed
    if (exam.randomizeOptions) {
      questions = questions.map(q => {
        if (q.type === "MULTIPLE_CHOICE" && q.options) {
          const options = JSON.parse(q.options as string)
          const shuffled = [...options].sort(() => Math.random() - 0.5)
          return { ...q, options: JSON.stringify(shuffled) }
        }
        return q
      })
    }

    return NextResponse.json({
      success: true,
      attemptId: attempt.id,
      exam: {
        id: exam.id,
        title: exam.title,
        duration: exam.duration,
        questions: questions.map(q => ({
          id: q.id,
          type: q.type,
          questionText: q.questionText,
          questionImage: q.questionImage,
          options: q.options ? JSON.parse(q.options as string) : null,
          maxMarks: q.maxMarks,
          order: q.order,
        })),
      },
    })
  } catch (error) {
    console.error("❌ [EXAM ATTEMPT] Exam attempt error:", error instanceof Error ? error.message : error)
    if (error instanceof Error) {
      console.error("❌ [EXAM ATTEMPT] Error stack:", error.stack)
    }
    return NextResponse.json(
      { error: "Failed to start exam attempt" },
      { status: 500 }
    )
  }
}

