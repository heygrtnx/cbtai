import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import bcrypt from "bcryptjs"
import { z } from "zod"
import { SchoolType, CurriculumType, UserRole } from "@prisma/client"
import { calculateLicenseFee } from "@/lib/utils/payment"
import crypto from "crypto"

const registerSchema = z.object({
  name: z.string().min(1),
  registrationNumber: z.string().optional(),
  type: z.nativeEnum(SchoolType),
  address: z.string().min(1),
  state: z.string().min(1),
  lga: z.string().min(1),
  city: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(1),
  adminName: z.string().min(1),
  adminEmail: z.string().email(),
  adminPassword: z.string().min(6),
  numberOfStudents: z.number().int().min(1),
  numberOfCampuses: z.number().int().min(1).default(1),
  curriculum: z.nativeEnum(CurriculumType),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const data = registerSchema.parse(body)

    // Check if school email already exists
    const existingSchool = await db.school.findUnique({
      where: { email: data.email },
    })

    if (existingSchool) {
      return NextResponse.json(
        { error: "School with this email already exists" },
        { status: 400 }
      )
    }

    // Check if admin email already exists
    const existingUser = await db.user.findUnique({
      where: { email: data.adminEmail },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: "Admin email already registered" },
        { status: 400 }
      )
    }

    // Generate school code
    const schoolCode = `SCH-${data.state.substring(0, 3).toUpperCase()}-${crypto.randomBytes(3).toString("hex").toUpperCase()}`

    // Calculate fees
    const fees = calculateLicenseFee(data.numberOfStudents)

    // Create school and admin user in a transaction
    const result = await db.$transaction(async (tx) => {
      // Create school
      const school = await tx.school.create({
        data: {
          schoolCode,
          name: data.name,
          registrationNumber: data.registrationNumber,
          type: data.type,
          address: data.address,
          state: data.state,
          lga: data.lga,
          city: data.city,
          email: data.email,
          phone: data.phone,
          curriculum: data.curriculum,
          numberOfStudents: data.numberOfStudents,
          numberOfCampuses: data.numberOfCampuses,
          isActive: false, // Will be activated after payment
        },
      })

      // Hash password
      const hashedPassword = await bcrypt.hash(data.adminPassword, 10)

      // Create admin user
      const user = await tx.user.create({
        data: {
          email: data.adminEmail,
          password: hashedPassword,
          name: data.adminName,
          role: UserRole.SCHOOL_ADMIN,
          schoolId: school.id,
          isActive: true,
        },
      })

      return { school, user, fees }
    })

    return NextResponse.json({
      success: true,
      schoolId: result.school.id,
      schoolCode: result.school.schoolCode,
      fees: result.fees,
      message: "School registered successfully. Please proceed to payment.",
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.errors },
        { status: 400 }
      )
    }

    console.error("❌ [REGISTER] Registration error:", error instanceof Error ? error.message : error)
    if (error instanceof Error) {
      console.error("❌ [REGISTER] Error stack:", error.stack)
    }
    return NextResponse.json(
      { error: "Registration failed" },
      { status: 500 }
    )
  }
}

