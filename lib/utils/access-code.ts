import { db } from "@/lib/db"
import crypto from "crypto"

export function generateAccessCode(schoolCode: string, studentId: string): string {
  const randomString = crypto.randomBytes(4).toString("hex").toUpperCase()
  return `${schoolCode}-${studentId}-${randomString}`
}

export async function createAccessCode(studentId: string, schoolCode: string) {
  const code = generateAccessCode(schoolCode, studentId)
  
  return await db.accessCode.create({
    data: {
      code,
      studentId,
      isActive: true,
    },
  })
}

export async function validateAccessCode(code: string) {
  const accessCode = await db.accessCode.findUnique({
    where: { code: code.toUpperCase() },
    include: {
      student: {
        include: {
          user: true,
          school: true,
        },
      },
    },
  })

  if (!accessCode || !accessCode.isActive) {
    return null
  }

  if (accessCode.expiresAt && accessCode.expiresAt < new Date()) {
    return null
  }

  return accessCode
}

