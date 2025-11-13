import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { PaymentMethod, PaymentStatus } from "@prisma/client"
import { initializePaystackPayment, initializeFlutterwavePayment } from "@/lib/utils/payment"
import crypto from "crypto"

export async function POST(request: NextRequest) {
  try {
    const { schoolId, amount, method, type, additionalStudents } = await request.json()

    if (!schoolId || !amount || !method) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    const school = await db.school.findUnique({
      where: { id: schoolId },
    })

    if (!school) {
      return NextResponse.json(
        { error: "School not found" },
        { status: 404 }
      )
    }

    // Generate payment reference
    const referencePrefix = type === "UPGRADE" ? "UPG" : "PAY"
    const reference = `${referencePrefix}-${school.schoolCode}-${crypto.randomBytes(8).toString("hex").toUpperCase()}`

    // Prepare metadata
    const metadata: Record<string, any> = {
      schoolId,
      schoolCode: school.schoolCode,
    }
    
    if (type === "UPGRADE" && additionalStudents) {
      metadata.type = "UPGRADE"
      metadata.additionalStudents = parseInt(additionalStudents)
    }

    // Create payment record
    const payment = await db.payment.create({
      data: {
        schoolId,
        amount: parseFloat(amount),
        method: method as PaymentMethod,
        reference,
        status: PaymentStatus.PENDING,
        description: type === "UPGRADE" 
          ? `Student capacity upgrade for ${school.name} (+${additionalStudents} students)`
          : `License fee payment for ${school.name}`,
        metadata: metadata,
      },
    })

    // Initialize payment gateway
    let paymentResponse

    if (method === PaymentMethod.PAYSTACK) {
      paymentResponse = await initializePaystackPayment(
        amount,
        school.email,
        reference,
        metadata
      )
    } else if (method === PaymentMethod.FLUTTERWAVE) {
      paymentResponse = await initializeFlutterwavePayment(
        amount,
        school.email,
        reference,
        { schoolId, schoolCode: school.schoolCode }
      )
    } else {
      // Bank transfer - manual verification
      return NextResponse.json({
        success: true,
        paymentId: payment.id,
        reference,
        method: "BANK_TRANSFER",
        message: "Please upload payment proof for verification",
      })
    }

    if (!paymentResponse.success) {
      return NextResponse.json(
        { error: paymentResponse.message || "Payment initialization failed" },
        { status: 500 }
      )
    }

    // Update payment with transaction ID if available
    if (paymentResponse.transactionId) {
      await db.payment.update({
        where: { id: payment.id },
        data: { transactionId: paymentResponse.transactionId },
      })
    }

    return NextResponse.json({
      success: true,
      paymentId: payment.id,
      reference: paymentResponse.reference,
      authorizationUrl: paymentResponse.authorizationUrl || paymentResponse.transactionId,
      method,
    })
  } catch (error) {
    console.error("❌ [PAYMENT INIT] Payment initialization error:", error instanceof Error ? error.message : error)
    if (error instanceof Error) {
      console.error("❌ [PAYMENT INIT] Error stack:", error.stack)
    }
    return NextResponse.json(
      { error: "Payment initialization failed" },
      { status: 500 }
    )
  }
}

