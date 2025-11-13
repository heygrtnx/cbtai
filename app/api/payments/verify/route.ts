import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { PaymentStatus } from "@prisma/client"
import { verifyPaystackPayment } from "@/lib/utils/payment"
import { sendEmail } from "@/lib/utils/notifications"
import { generatePaymentReceiptHTML, generateWelcomeEmailHTML } from "@/lib/utils/email-templates"

export async function POST(request: NextRequest) {
  try {
    const { reference } = await request.json()

    if (!reference) {
      return NextResponse.json(
        { error: "Payment reference is required" },
        { status: 400 }
      )
    }

    const payment = await db.payment.findUnique({
      where: { reference },
      include: {
        school: {
          include: {
            admins: {
              take: 1,
            },
          },
        },
      },
    })

    if (!payment) {
      return NextResponse.json(
        { error: "Payment not found" },
        { status: 404 }
      )
    }

    if (payment.status === PaymentStatus.COMPLETED) {
      return NextResponse.json({
        success: true,
        status: "completed",
        message: "Payment already verified",
      })
    }

    // Verify payment with gateway
    const verification = await verifyPaystackPayment(reference)

    if (verification.success && verification.transactionId) {
      // Update payment status
      const updatedPayment = await db.payment.update({
        where: { id: payment.id },
        data: {
          status: PaymentStatus.COMPLETED,
          transactionId: verification.transactionId,
          paidAt: new Date(),
        },
      })

      // Activate school
      await db.school.update({
        where: { id: payment.schoolId },
        data: {
          isActive: true,
          licenseExpiry: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
        },
      })

      // Get admin user for email
      const adminUser = payment.school.admins?.[0]
      if (adminUser && adminUser.email) {
        // Calculate fees (we need to get this from the payment or school)
        const oneTimeFee = parseInt(process.env.LICENSE_FEE || "300000")
        const perStudentFee = parseInt(process.env.COST_PER_STUDENT || "3000")
        const numberOfStudents = payment.school.numberOfStudents || 0

        // Send Payment Receipt
        const receiptHTML = generatePaymentReceiptHTML({
          schoolName: payment.school.name,
          adminName: adminUser.name || "Administrator",
          adminEmail: adminUser.email,
          transactionId: verification.transactionId || updatedPayment.reference,
          reference: updatedPayment.reference,
          amount: verification.amount || updatedPayment.amount,
          paidAt: updatedPayment.paidAt || new Date(),
          schoolCode: payment.school.schoolCode,
          oneTimeFee,
          perStudentFee,
          numberOfStudents,
        })

        await sendEmail(
          adminUser.email,
          `Payment Receipt - ${payment.school.name} | AI CBT`,
          receiptHTML
        )

        // Send Welcome Email
        const welcomeHTML = generateWelcomeEmailHTML({
          schoolName: payment.school.name,
          adminName: adminUser.name || "Administrator",
          adminEmail: adminUser.email,
          schoolCode: payment.school.schoolCode,
          loginUrl: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/auth/login`,
          supportEmail: process.env.SUPPORT_EMAIL || "support@aicbt.com",
          supportPhone: process.env.SUPPORT_PHONE || "+234 800 000 0000",
        })

        await sendEmail(
          adminUser.email,
          `Welcome to AI CBT, ${payment.school.name}! 🎉`,
          welcomeHTML
        )
      }

      return NextResponse.json({
        success: true,
        status: "completed",
        message: "Payment verified and school activated",
      })
    }

    return NextResponse.json({
      success: false,
      status: "pending",
      message: "Payment verification failed or pending",
    })
  } catch (error) {
    console.error("❌ [PAYMENT VERIFY] Payment verification error:", error instanceof Error ? error.message : error)
    if (error instanceof Error) {
      console.error("❌ [PAYMENT VERIFY] Error stack:", error.stack)
    }
    return NextResponse.json(
      { error: "Payment verification failed" },
      { status: 500 }
    )
  }
}

