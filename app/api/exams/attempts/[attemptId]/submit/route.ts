import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { requireAuth } from "@/lib/utils/auth"
import { UserRole, QuestionType, ResultStatus, Grade } from "@prisma/client"
import { calculateGrade, gradeTheoryAnswer, calculateTheoryScore } from "@/lib/utils/grading"

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ attemptId: string }> }
) {
  try {
    const user = await requireAuth()

    if (user.role !== UserRole.STUDENT) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      )
    }

    const { attemptId } = await params
    const { answers } = await request.json()

    // Get attempt
    const attempt = await db.examAttempt.findUnique({
      where: { id: attemptId },
      include: {
        exam: {
          include: {
            questions: true,
          },
        },
        student: true,
      },
    })

    if (!attempt) {
      return NextResponse.json(
        { error: "Attempt not found" },
        { status: 404 }
      )
    }

    if (attempt.isCompleted) {
      return NextResponse.json(
        { error: "Exam already submitted" },
        { status: 400 }
      )
    }

    // Check if student owns this attempt
    if (attempt.student.userId !== user.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      )
    }

    // Calculate time spent
    const timeSpent = Math.floor(
      (new Date().getTime() - attempt.startedAt.getTime()) / 1000
    )

    // Process answers and calculate scores
    let totalScore = 0
    let maxScore = 0
    let questionsCorrect = 0
    let questionsAnswered = 0

    const answerRecords: Array<{
      attemptId: string
      questionId: string
      selectedOption: string | null
      answerText: string | null
      isCorrect: boolean
      score: number
      aiScore: number | null
    }> = []

    for (const answerData of answers) {
      const question = attempt.exam.questions.find(
        q => q.id === answerData.questionId
      )

      if (!question) continue

      maxScore += question.maxMarks
      questionsAnswered++

      let isCorrect = false
      let score = 0

      if (question.type === QuestionType.MULTIPLE_CHOICE) {
        // Check if answer is correct
        isCorrect = question.correctAnswer === answerData.selectedOption
        score = isCorrect ? question.maxMarks : 0
        if (isCorrect) questionsCorrect++
      } else if (question.type === QuestionType.THEORY) {
        // AI grading for theory questions
        if (answerData.answerText && question.expectedAnswer) {
          const accuracyTolerance = question.accuracyTolerance || 70
          const similarity = await gradeTheoryAnswer(
            answerData.answerText,
            question.expectedAnswer,
            accuracyTolerance / 100
          )

          score = calculateTheoryScore(
            similarity,
            accuracyTolerance / 100,
            question.maxMarks
          )

          isCorrect = similarity >= accuracyTolerance / 100
          if (isCorrect) questionsCorrect++
        }
      }

      totalScore += score

      answerRecords.push({
        attemptId,
        questionId: question.id,
        selectedOption: answerData.selectedOption || null,
        answerText: answerData.answerText || null,
        isCorrect,
        score,
        aiScore: question.type === QuestionType.THEORY ? score : null,
      })
    }

    // Calculate percentage and grade
    const percentage = maxScore > 0 ? (totalScore / maxScore) * 100 : 0
    const grade = calculateGrade(percentage)

    // Save answers and update attempt
    await db.$transaction(async (tx) => {
      // Create answer records
      await tx.answer.createMany({
        data: answerRecords,
      })

      // Update attempt
      await tx.examAttempt.update({
        where: { id: attemptId },
        data: {
          isCompleted: true,
          submittedAt: new Date(),
          timeSpent,
        },
      })

      // Create result
      const result = await tx.result.create({
        data: {
          attemptId,
          studentId: attempt.studentId,
          examId: attempt.examId,
          totalScore,
          maxScore,
          percentage,
          grade,
          status: attempt.exam.showResultsImmediately
            ? ResultStatus.RELEASED
            : ResultStatus.PENDING,
          releasedAt: attempt.exam.showResultsImmediately ? new Date() : null,
          timeSpent,
          questionsAnswered,
          questionsCorrect,
        },
      })

      return result
    })

    // Get position in class if results are released
    let position = null
    if (attempt.exam.showResultsImmediately) {
      const betterResults = await db.result.count({
        where: {
          examId: attempt.examId,
          percentage: { gt: percentage },
          status: ResultStatus.RELEASED,
        },
      })
      position = betterResults + 1
    }

    return NextResponse.json({
      success: true,
      result: {
        totalScore,
        maxScore,
        percentage: Math.round(percentage * 100) / 100,
        grade,
        position,
        showResults: attempt.exam.showResultsImmediately,
      },
    })
  } catch (error) {
    console.error("Exam submission error:", error)
    return NextResponse.json(
      { error: "Failed to submit exam" },
      { status: 500 }
    )
  }
}

