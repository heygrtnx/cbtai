import { Grade } from "@prisma/client"

export function calculateGrade(percentage: number): Grade {
  if (percentage >= 70) return Grade.A
  if (percentage >= 60) return Grade.B
  if (percentage >= 50) return Grade.C
  if (percentage >= 45) return Grade.D
  if (percentage >= 40) return Grade.E
  return Grade.F
}

export function getGradeLabel(grade: Grade): string {
  const labels: Record<Grade, string> = {
    [Grade.A]: "Excellent (70-100%)",
    [Grade.B]: "Very Good (60-69%)",
    [Grade.C]: "Good (50-59%)",
    [Grade.D]: "Credit (45-49%)",
    [Grade.E]: "Pass (40-44%)",
    [Grade.F]: "Fail (0-39%)",
  }
  return labels[grade]
}

export function calculateTheoryScore(
  similarityScore: number,
  accuracyTolerance: number,
  maxMarks: number
): number {
  if (similarityScore >= accuracyTolerance) {
    return maxMarks
  }

  // Partial credit calculation
  return (similarityScore / accuracyTolerance) * maxMarks
}

// AI grading simulation (replace with actual AI service)
export async function gradeTheoryAnswer(
  studentAnswer: string,
  expectedAnswer: string,
  accuracyTolerance: number
): Promise<number> {
  // This is a placeholder - replace with actual AI grading service
  // For now, using a simple similarity calculation
  
  const similarity = calculateTextSimilarity(studentAnswer, expectedAnswer)
  return similarity * 100 // Return as percentage
}

function calculateTextSimilarity(text1: string, text2: string): number {
  // Simple word-based similarity (replace with actual NLP model)
  const words1 = text1.toLowerCase().split(/\s+/)
  const words2 = text2.toLowerCase().split(/\s+/)
  
  const set1 = new Set(words1)
  const set2 = new Set(words2)
  
  const intersection = new Set([...set1].filter(x => set2.has(x)))
  const union = new Set([...set1, ...set2])
  
  return intersection.size / union.size
}

