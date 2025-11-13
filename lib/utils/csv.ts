import Papa from "papaparse"
import { z } from "zod"

export const StudentCSVSchema = z.object({
  "Student Surname": z.string().min(1),
  "Student First Name": z.string().min(1),
  "Student Middle Name": z.string().optional(),
  "Student Email": z.string().email().optional().or(z.literal("")),
  "Student Phone Number": z.string().optional().or(z.literal("")),
  "Student ID/Matric Number/Admission Number": z.string().min(1),
  "Class/Level": z.string().min(1),
  "Date of Birth": z.string().optional().or(z.literal("")),
  "Gender": z.string().optional().or(z.literal("")),
  "Parent/Guardian Name": z.string().optional().or(z.literal("")),
  "Parent/Guardian Phone": z.string().optional().or(z.literal("")),
  "Parent/Guardian Email": z.string().email().optional().or(z.literal("")),
})

export type StudentCSVRow = z.infer<typeof StudentCSVSchema>

export interface CSVParseResult {
  data: StudentCSVRow[]
  errors: Array<{ row: number; message: string }>
}

export function parseStudentCSV(file: File): Promise<CSVParseResult> {
  return new Promise((resolve) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const errors: Array<{ row: number; message: string }> = []
        const validData: StudentCSVRow[] = []

        results.data.forEach((row: any, index: number) => {
          const validation = StudentCSVSchema.safeParse(row)
          
          if (!validation.success) {
            errors.push({
              row: index + 2, // +2 because index is 0-based and we skip header
              message: validation.error.errors.map(e => e.message).join(", "),
            })
          } else {
            validData.push(validation.data)
          }
        })

        resolve({
          data: validData,
          errors,
        })
      },
      error: (error) => {
        resolve({
          data: [],
          errors: [{ row: 0, message: error.message }],
        })
      },
    })
  })
}

export function formatPhoneNumber(phone: string): string {
  // Remove all non-digit characters
  const digits = phone.replace(/\D/g, "")
  
  // If starts with 0, replace with +234
  if (digits.startsWith("0")) {
    return `+234${digits.slice(1)}`
  }
  
  // If starts with 234, add +
  if (digits.startsWith("234")) {
    return `+${digits}`
  }
  
  // If doesn't start with +, assume it's missing country code
  if (!phone.startsWith("+")) {
    return `+234${digits}`
  }
  
  return phone
}

