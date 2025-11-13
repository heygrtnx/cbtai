import { PaymentMethod, PaymentStatus } from "@prisma/client"

export interface PaymentGatewayResponse {
  success: boolean
  reference: string
  transactionId?: string
  authorizationUrl?: string
  message?: string
}

// Paystack integration
export async function initializePaystackPayment(
  amount: number,
  email: string,
  reference: string,
  metadata?: Record<string, any>
): Promise<PaymentGatewayResponse> {
  try {
    const response = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: amount * 100, // Convert to kobo
        email,
        reference,
        metadata,
        callback_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment/callback`,
      }),
    })

    const data = await response.json()

    if (data.status) {
      return {
        success: true,
        reference: data.data.reference,
        transactionId: data.data.access_code,
        authorizationUrl: data.data.authorization_url,
      }
    }

    return {
      success: false,
      reference,
      message: data.message,
    }
  } catch (error) {
    return {
      success: false,
      reference,
      message: "Payment initialization failed",
    }
  }
}

export async function verifyPaystackPayment(
  reference: string
): Promise<{ success: boolean; transactionId?: string; amount?: number }> {
  try {
    const response = await fetch(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      }
    )

    const data = await response.json()

    if (data.status && data.data.status === "success") {
      return {
        success: true,
        transactionId: data.data.id.toString(),
        amount: data.data.amount / 100, // Convert from kobo
      }
    }

    return { success: false }
  } catch (error) {
    return { success: false }
  }
}

// Flutterwave integration
export async function initializeFlutterwavePayment(
  amount: number,
  email: string,
  reference: string,
  metadata?: Record<string, any>
): Promise<PaymentGatewayResponse> {
  try {
    const response = await fetch("https://api.flutterwave.com/v3/payments", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.FLUTTERWAVE_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        tx_ref: reference,
        amount,
        currency: "NGN",
        redirect_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment/callback`,
        customer: {
          email,
        },
        meta: metadata,
      }),
    })

    const data = await response.json()

    if (data.status === "success") {
      return {
        success: true,
        reference: data.data.tx_ref,
        transactionId: data.data.id.toString(),
      }
    }

    return {
      success: false,
      reference,
      message: data.message,
    }
  } catch (error) {
    return {
      success: false,
      reference,
      message: "Payment initialization failed",
    }
  }
}

export function calculateLicenseFee(studentCount: number): {
  oneTimeFee: number
  perStudentFee: number
  total: number
} {
  const oneTimeFee = parseInt(process.env.LICENSE_FEE || "300000")
  const perStudentFee = parseInt(process.env.COST_PER_STUDENT || "3000")
  const total = oneTimeFee + perStudentFee * studentCount

  return {
    oneTimeFee,
    perStudentFee,
    total,
  }
}

export const RENEWAL_FEE = parseInt(process.env.RENEWAL_FEE || "15000")

