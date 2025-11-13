// SMS notification via Termii
export async function sendSMS(
  phone: string,
  message: string
): Promise<{ success: boolean; messageId?: string }> {
  try {
    const response = await fetch("https://api.termii.com/api/sms/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        to: phone,
        from: process.env.TERMII_SENDER_ID || "CBT Platform",
        sms: message,
        type: "plain",
        channel: "generic",
        api_key: process.env.TERMII_API_KEY,
      }),
    })

    const data = await response.json()

    if (data.code === "ok") {
      return {
        success: true,
        messageId: data.message_id,
      }
    }

    return { success: false }
  } catch (error) {
    console.error("❌ [SMS] SMS sending error:", error instanceof Error ? error.message : error)
    return { success: false }
  }
}

// WhatsApp notification (placeholder - implement with WhatsApp Business API)
export async function sendWhatsApp(
  phone: string,
  message: string
): Promise<{ success: boolean }> {
  // Implement WhatsApp Business API integration
  // For now, return success
  return { success: true }
}

// Email notification using Google SMTP (Gmail)
export async function sendEmail(
  to: string,
  subject: string,
  html: string
): Promise<{ success: boolean; messageId?: string }> {
  try {
    // Use Google SMTP (Gmail)
    if (process.env.SMTP_USER && process.env.SMTP_PASS) {
      const nodemailer = await import("nodemailer")

      // Create transporter for Gmail
      const transporter = nodemailer.createTransport({
        service: "gmail",
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS, // Use App Password for Gmail
        },
      })

      // Send email
      const info = await transporter.sendMail({
        from: process.env.EMAIL_FROM || `"AI CBT" <${process.env.SMTP_USER}>`,
        to: to,
        subject: subject,
        html: html,
      })

      return { success: true, messageId: info.messageId }
    }

    // If no email service configured, return error
    console.error("❌ [EMAIL] Email service not configured. Please set SMTP_USER and SMTP_PASS in .env")
    return { success: false }
  } catch (error) {
    console.error("❌ [EMAIL] Email sending error:", error instanceof Error ? error.message : error)
    return { success: false }
  }
}

export async function sendAccessCodeNotification(
  phone: string | null,
  email: string | null,
  accessCode: string,
  studentName: string
) {
  const message = `Hello ${studentName}, your CBT platform access code is: ${accessCode}. Use this code to login at ${process.env.NEXT_PUBLIC_APP_URL}`

  const promises: Promise<any>[] = []

  if (phone) {
    promises.push(sendSMS(phone, message))
    promises.push(sendWhatsApp(phone, message))
  }

  if (email) {
    promises.push(
      sendEmail(
        email,
        "Your CBT Platform Access Code",
        `<p>Hello ${studentName},</p><p>Your access code is: <strong>${accessCode}</strong></p><p>Use this code to login at <a href="${process.env.NEXT_PUBLIC_APP_URL}">${process.env.NEXT_PUBLIC_APP_URL}</a></p>`
      )
    )
  }

  await Promise.allSettled(promises)
}

