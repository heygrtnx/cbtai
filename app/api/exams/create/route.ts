import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { requireAuth } from "@/lib/utils/auth"
import { UserRole, ExamType, ExamStatus, QuestionType } from "@prisma/client"
import { z } from "zod"

const examSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  type: z.nativeEnum(ExamType),
  subject: z.string().min(1),
  termId: z.string().optional(),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  duration: z.number().int().min(1),
  lateSubmissionAllowed: z.boolean().default(false),
  latePenaltyPercent: z.number().optional(),
  password: z.string().optional(),
  randomizeQuestions: z.boolean().default(false),
  randomizeOptions: z.boolean().default(false),
  preventTabSwitch: z.boolean().default(false),
  requireWebcam: z.boolean().default(false),
  maxAttempts: z.number().int().min(1).default(1),
  showResultsImmediately: z.boolean().default(false),
  allowRescheduling: z.boolean().default(false),
  questions: z.array(z.object({
    type: z.nativeEnum(QuestionType),
    questionText: z.string().min(1),
    questionImage: z.string().optional(),
    options: z.array(z.object({
      text: z.string(),
      isCorrect: z.boolean(),
    })).optional(),
    correctAnswer: z.string().optional(),
    expectedAnswer: z.string().optional(),
    expectedLength: z.number().optional(),
    markingScheme: z.string().optional(),
    accuracyTolerance: z.number().min(70).max(100).optional(),
    maxMarks: z.number().min(0),
    explanation: z.string().optional(),
    difficulty: z.string().optional(),
  })).min(1),
  classIds: z.array(z.string()).optional(),
  studentIds: z.array(z.string()).optional(),
})

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth()

    if (user.role !== UserRole.TEACHER && user.role !== UserRole.SCHOOL_ADMIN) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      )
    }

    const body = await request.json()
    const data = examSchema.parse(body)

    // Get teacher
    const teacher = await db.teacher.findUnique({
      where: { userId: user.id },
    })

    if (!teacher && user.role === UserRole.TEACHER) {
      return NextResponse.json(
        { error: "Teacher profile not found" },
        { status: 404 }
      )
    }

    // Create exam
    const exam = await db.exam.create({
      data: {
        title: data.title,
        description: data.description,
        type: data.type,
        subject: data.subject,
        teacherId: teacher?.id || user.id, // Fallback for admin
        schoolId: user.schoolId!,
        termId: data.termId,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
        duration: data.duration,
        lateSubmissionAllowed: data.lateSubmissionAllowed,
        latePenaltyPercent: data.latePenaltyPercent,
        password: data.password,
        randomizeQuestions: data.randomizeQuestions,
        randomizeOptions: data.randomizeOptions,
        preventTabSwitch: data.preventTabSwitch,
        requireWebcam: data.requireWebcam,
        maxAttempts: data.maxAttempts,
        showResultsImmediately: data.showResultsImmediately,
        allowRescheduling: data.allowRescheduling,
        status: ExamStatus.DRAFT,
        questions: {
          create: data.questions.map((q, index) => ({
            type: q.type,
            questionText: q.questionText,
            questionImage: q.questionImage || undefined,
            options: q.options ? JSON.stringify(q.options) : undefined,
            correctAnswer: q.correctAnswer || undefined,
            expectedAnswer: q.expectedAnswer || undefined,
            expectedLength: q.expectedLength || undefined,
            markingScheme: q.markingScheme || undefined,
            accuracyTolerance: q.accuracyTolerance || undefined,
            maxMarks: q.maxMarks,
            explanation: q.explanation || undefined,
            difficulty: q.difficulty || undefined,
            order: index + 1,
          })),
        },
      },
      include: {
        questions: true,
      },
    })

    // Assign to classes or students
    if (data.classIds && data.classIds.length > 0) {
      await db.examAssignment.createMany({
        data: data.classIds.map(classId => ({
          examId: exam.id,
          classId,
        })),
      })
    }

    if (data.studentIds && data.studentIds.length > 0) {
      await db.examAssignment.createMany({
        data: data.studentIds.map(studentId => ({
          examId: exam.id,
          studentId,
        })),
      })
    }

    return NextResponse.json({
      success: true,
      exam: {
        id: exam.id,
        title: exam.title,
        status: exam.status,
        questionsCount: exam.questions.length,
      },
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.errors },
        { status: 400 }
      )
    }

    console.error("❌ [EXAM CREATE] Exam creation error:", error instanceof Error ? error.message : error)
    if (error instanceof Error) {
      console.error("❌ [EXAM CREATE] Error stack:", error.stack)
    }
    return NextResponse.json(
      { error: "Failed to create exam" },
      { status: 500 }
    )
  }
}

