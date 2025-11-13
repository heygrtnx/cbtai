import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { PaymentStatus } from "@prisma/client"
import { verifyPaystackPayment } from "@/lib/utils/payment"

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
      include: { school: true },
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
      await db.payment.update({
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
    console.error("Payment verification error:", error)
    return NextResponse.json(
      { error: "Payment verification failed" },
      { status: 500 }
    )
  }
}

