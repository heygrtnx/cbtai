import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    // CSV template with headers only
    const headers = [
      "Student Surname",
      "Student First Name",
      "Student Middle Name",
      "Student Email",
      "Student Phone Number",
      "Student ID/Matric Number/Admission Number",
      "Class/Level",
      "Date of Birth",
      "Gender",
      "Parent/Guardian Name",
      "Parent/Guardian Phone",
      "Parent/Guardian Email",
    ]

    // Add sample row
    const sampleRow = [
      "Doe",
      "John",
      "Michael",
      "john.doe@example.com",
      "+2348012345678",
      "STU001",
      "JSS1A",
      "2010-05-15",
      "Male",
      "Jane Doe",
      "+2348012345679",
      "jane.doe@example.com",
    ]

    const csvContent = [
      headers.join(","),
      sampleRow.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","),
    ].join("\n")

    return new NextResponse(csvContent, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": 'attachment; filename="student_template.csv"',
      },
    })
  } catch (error) {
    console.error("❌ [STUDENTS TEMPLATE] Error:", error instanceof Error ? error.message : error)
    return NextResponse.json(
      { error: "Failed to download template" },
      { status: 500 }
    )
  }
}

