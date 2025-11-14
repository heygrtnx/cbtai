import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { requireAuth } from "@/lib/utils/auth"
import { parseStudentCSV, formatPhoneNumber, StudentCSVRow } from "@/lib/utils/csv"
import { createAccessCode } from "@/lib/utils/access-code"
import { sendAccessCodeNotification } from "@/lib/utils/notifications"
import bcrypt from "bcryptjs"
import { UserRole } from "@prisma/client"

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth()

    if (user.role !== UserRole.SCHOOL_ADMIN && user.role !== UserRole.TEACHER) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      )
    }

    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json(
        { error: "No file uploaded" },
        { status: 400 }
      )
    }

    // Parse CSV
    let parseResult
    try {
      parseResult = await parseStudentCSV(file)
    } catch (parseError) {
      console.error("❌ [STUDENT UPLOAD] CSV parsing error:", parseError)
      return NextResponse.json(
        {
          error: "Failed to parse CSV file",
          message: parseError instanceof Error ? parseError.message : "Invalid CSV format",
        },
        { status: 400 }
      )
    }

    if (parseResult.errors.length > 0) {
      console.error("❌ [STUDENT UPLOAD] CSV validation errors:", parseResult.errors)
      return NextResponse.json(
        {
          error: "CSV validation errors",
          errors: parseResult.errors,
          message: `Found ${parseResult.errors.length} validation error(s) in the CSV file`,
        },
        { status: 400 }
      )
    }

    if (!parseResult.data || parseResult.data.length === 0) {
      return NextResponse.json(
        {
          error: "No valid student data found",
          message: "The CSV file appears to be empty or contains no valid student records",
        },
        { status: 400 }
      )
    }

    // Get school with current student count
    const school = await db.school.findUnique({
      where: { id: user.schoolId! },
      include: {
        _count: {
          select: {
            students: true,
          },
        },
      },
    })

    if (!school) {
      return NextResponse.json(
        { error: "School not found" },
        { status: 404 }
      )
    }

    // Check license limit
    const currentStudentCount = school._count.students
    const licenseLimit = school.numberOfStudents
    const availableSlots = licenseLimit - currentStudentCount

    if (availableSlots <= 0) {
      return NextResponse.json(
        {
          error: "License limit reached",
          message: `You have reached your license limit of ${licenseLimit} students. Please upgrade your plan to add more students.`,
          currentCount: currentStudentCount,
          limit: licenseLimit,
        },
        { status: 403 }
      )
    }

    // Filter out duplicates within the CSV file itself
    const seenInCSV = new Map<string, number>() // Map of identifier -> first occurrence row number
    const duplicateRows: Array<{ row: number; message: string }> = []
    const uniqueStudents: Array<{ row: StudentCSVRow; originalIndex: number }> = []

    parseResult.data.forEach((row, index) => {
      const rowNumber = index + 2 // +2 because index is 0-based and we skip header
      let isDuplicate = false
      let duplicateReason = ""

      // Check for duplicate admission number
      if (row["Student ID/Matric Number/Admission Number"] && row["Student ID/Matric Number/Admission Number"].trim()) {
        const admissionNumber = row["Student ID/Matric Number/Admission Number"].trim()
        const key = `admission:${admissionNumber}`
        if (seenInCSV.has(key)) {
          isDuplicate = true
          duplicateReason = `Duplicate admission number "${admissionNumber}" (first seen at row ${seenInCSV.get(key)})`
        } else {
          seenInCSV.set(key, rowNumber)
        }
      }

      // Check for duplicate email
      if (!isDuplicate && row["Student Email"]) {
        const email = row["Student Email"].toLowerCase().trim()
        const key = `email:${email}`
        if (seenInCSV.has(key)) {
          isDuplicate = true
          duplicateReason = `Duplicate email "${email}" (first seen at row ${seenInCSV.get(key)})`
        } else {
          seenInCSV.set(key, rowNumber)
        }
      }

      // Check for duplicate phone
      if (!isDuplicate && row["Student Phone Number"]) {
        const phone = formatPhoneNumber(row["Student Phone Number"])
        const key = `phone:${phone}`
        if (seenInCSV.has(key)) {
          isDuplicate = true
          duplicateReason = `Duplicate phone number "${phone}" (first seen at row ${seenInCSV.get(key)})`
        } else {
          seenInCSV.set(key, rowNumber)
        }
      }

      if (isDuplicate) {
        duplicateRows.push({
          row: rowNumber,
          message: duplicateReason,
        })
      } else {
        uniqueStudents.push({ row, originalIndex: index })
      }
    })

    // Limit the number of students to process based on available slots
    const studentsToProcess = uniqueStudents.slice(0, availableSlots)
    const studentsSkipped = uniqueStudents.length - studentsToProcess.length

    // Fetch existing students from database to check for duplicates
    const existingAdmissionNumbers = new Set<string>()
    const existingEmails = new Set<string>()
    const existingPhones = new Set<string>()

    // Collect all identifiers from CSV that we need to check
    const admissionNumbersToCheck = studentsToProcess
      .map(s => s.row["Student ID/Matric Number/Admission Number"]?.trim())
      .filter(Boolean) as string[]
    
    const emailsToCheck = studentsToProcess
      .map(s => s.row["Student Email"]?.toLowerCase().trim())
      .filter(Boolean) as string[]
    
    const phonesToCheck = studentsToProcess
      .map(s => s.row["Student Phone Number"] ? formatPhoneNumber(s.row["Student Phone Number"]) : null)
      .filter(Boolean) as string[]

    // Batch check existing students
    if (admissionNumbersToCheck.length > 0) {
      const existingStudents = await db.student.findMany({
        where: {
          admissionNumber: { in: admissionNumbersToCheck },
          schoolId: school.id,
        },
        select: { admissionNumber: true },
      })
      existingStudents.forEach(s => existingAdmissionNumbers.add(s.admissionNumber))
    }

    if (emailsToCheck.length > 0) {
      const existingUsers = await db.user.findMany({
        where: {
          email: { in: emailsToCheck },
          schoolId: school.id,
        },
        select: { email: true },
      })
      existingUsers.forEach(u => u.email && existingEmails.add(u.email.toLowerCase()))
    }

    if (phonesToCheck.length > 0) {
      const existingUsers = await db.user.findMany({
        where: {
          phone: { in: phonesToCheck },
          schoolId: school.id,
        },
        select: { phone: true },
      })
      existingUsers.forEach(u => u.phone && existingPhones.add(u.phone))
    }

    // Process students
    const results = {
      created: 0,
      skipped: studentsSkipped + duplicateRows.length,
      duplicates: duplicateRows.length,
      errors: [] as Array<{ row: number; message: string }>,
      limitReached: studentsSkipped > 0,
    }

    for (let i = 0; i < studentsToProcess.length; i++) {
      const { row, originalIndex } = studentsToProcess[i]
      const rowNumber = originalIndex + 2

      try {
        // Generate admission number if not provided
        const admissionNumber = row["Student ID/Matric Number/Admission Number"] && row["Student ID/Matric Number/Admission Number"].trim()
          ? row["Student ID/Matric Number/Admission Number"].trim()
          : `STU${Date.now()}${i}`

        // Check if student already exists in database
        let skipReason = ""
        
        if (row["Student ID/Matric Number/Admission Number"] && row["Student ID/Matric Number/Admission Number"].trim()) {
          if (existingAdmissionNumbers.has(admissionNumber)) {
            skipReason = "Student with this admission number already exists in database"
          }
        }

        if (!skipReason && row["Student Email"]) {
          const email = row["Student Email"].toLowerCase().trim()
          if (existingEmails.has(email)) {
            skipReason = "Student with this email already exists in database"
          }
        }

        if (!skipReason && row["Student Phone Number"]) {
          const phone = formatPhoneNumber(row["Student Phone Number"])
          if (existingPhones.has(phone)) {
            skipReason = "Student with this phone number already exists in database"
          }
        }

        if (skipReason) {
          results.errors.push({
            row: rowNumber,
            message: skipReason,
          })
          continue
        }

        // Find or create class
        let classRecord = await db.class.findFirst({
          where: {
            name: row["Class/Level"],
            schoolId: school.id,
          },
        })

        if (!classRecord) {
          classRecord = await db.class.create({
            data: {
              name: row["Class/Level"],
              level: row["Class/Level"], // You might want to parse this better
              schoolId: school.id,
            },
          })
        }

        // Create user
        // Use admission number as password if provided, otherwise use a default
        const password = admissionNumber || `${row["Student First Name"].toLowerCase()}${row["Student Surname"].toLowerCase()}${Math.random().toString(36).slice(-4)}`
        const hashedPassword = await bcrypt.hash(password, 10)

        const userRecord = await db.user.create({
          data: {
            email: row["Student Email"] || null,
            phone: row["Student Phone Number"] ? formatPhoneNumber(row["Student Phone Number"]) : null,
            password: hashedPassword,
            name: `${row["Student First Name"]} ${row["Student Surname"]}`,
            role: UserRole.STUDENT,
            schoolId: school.id,
            isActive: true,
          },
        })

        // Create student
        const student = await db.student.create({
          data: {
            userId: userRecord.id,
            admissionNumber: admissionNumber,
            schoolId: school.id,
            classId: classRecord.id,
            dateOfBirth: row["Date of Birth"] ? new Date(row["Date of Birth"]) : null,
            gender: row["Gender"] || null,
          },
        })

        // Create access code
        const accessCode = await createAccessCode(student.id, school.schoolCode)

        // Send notification
        await sendAccessCodeNotification(
          userRecord.phone,
          userRecord.email,
          accessCode.code,
          userRecord.name
        )

        results.created++
      } catch (error: any) {
        results.errors.push({
          row: rowNumber,
          message: error.message || "Failed to create student",
        })
      }
    }

    // Combine duplicate rows with other errors for reporting
    const allErrors = [...duplicateRows, ...results.errors]

    let message = `Successfully created ${results.created} student(s)`
    if (results.duplicates > 0) {
      message += `. ${results.duplicates} duplicate record(s) were skipped.`
    }
    if (results.limitReached) {
      const limitSkipped = results.skipped - results.duplicates
      if (limitSkipped > 0) {
        message += ` ${limitSkipped} student(s) were skipped due to license limit. Please upgrade your plan to add more students.`
      }
    }

    return NextResponse.json({
      success: true,
      created: results.created,
      skipped: results.skipped,
      duplicates: results.duplicates,
      errors: allErrors,
      message,
      limitReached: results.limitReached,
      currentCount: currentStudentCount + results.created,
      limit: licenseLimit,
    })
  } catch (error) {
    console.error("❌ [STUDENT UPLOAD] Student upload error:", error instanceof Error ? error.message : error)
    if (error instanceof Error) {
      console.error("❌ [STUDENT UPLOAD] Error stack:", error.stack)
    }
    return NextResponse.json(
      { error: "Failed to upload students" },
      { status: 500 }
    )
  }
}

