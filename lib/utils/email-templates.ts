export interface PaymentReceiptData {
  schoolName: string
  adminName: string
  adminEmail: string
  transactionId: string
  reference: string
  amount: number
  paidAt: Date
  schoolCode: string
  oneTimeFee: number
  perStudentFee: number
  numberOfStudents: number
}

export interface WelcomeEmailData {
  schoolName: string
  adminName: string
  adminEmail: string
  schoolCode: string
  loginUrl: string
  supportEmail: string
  supportPhone: string
}

export interface UpgradeEmailData {
  schoolName: string
  adminName: string
  adminEmail: string
  transactionId: string
  reference: string
  amount: number
  paidAt: Date
  additionalStudents: number
  newTotalStudents: number
  schoolCode: string
}

export function generateUpgradeEmailHTML(data: UpgradeEmailData): string {
  const formattedDate = new Date(data.paidAt).toLocaleDateString("en-NG", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })

  const formattedAmount = new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
  }).format(data.amount)

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Upgrade Successful - AI CBT</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
  <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f5f5f5;">
    <tr>
      <td style="padding: 40px 20px;">
        <table role="presentation" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <tr>
            <td style="padding: 40px 40px 30px; text-align: center; background: linear-gradient(135deg, #000000 0%, #1a1a1a 100%); border-radius: 12px 12px 0 0;">
              <div style="display: inline-block; width: 60px; height: 60px; background: #ffffff; border-radius: 12px; margin-bottom: 20px; display: flex; align-items: center; justify-content: center;">
                <span style="color: #000000; font-size: 24px; font-weight: bold;">AI</span>
              </div>
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 800; letter-spacing: -0.5px;">Upgrade Successful! 🎉</h1>
              <p style="margin: 10px 0 0; color: #cccccc; font-size: 16px;">Your student capacity has been increased</p>
            </td>
          </tr>
          <tr>
            <td style="padding: 40px;">
              <p style="margin: 0 0 20px; color: #333333; font-size: 16px; line-height: 1.6;">Dear <strong>${data.adminName}</strong>,</p>
              <p style="margin: 0 0 30px; color: #555555; font-size: 15px; line-height: 1.6;">Great news! Your upgrade payment has been successfully processed. Your school's student capacity has been increased and you can now add more students to your platform.</p>
              <div style="background-color: #f8f9fa; border-left: 4px solid #000000; padding: 25px; border-radius: 8px; margin: 30px 0;">
                <h2 style="margin: 0 0 20px; color: #000000; font-size: 20px; font-weight: 700;">Upgrade Details</h2>
                <table role="presentation" style="width: 100%; border-collapse: collapse;">
                  <tr><td style="padding: 10px 0; color: #666666; font-size: 14px; border-bottom: 1px solid #e0e0e0;">School Name:</td><td style="padding: 10px 0; color: #000000; font-size: 14px; font-weight: 600; text-align: right; border-bottom: 1px solid #e0e0e0;">${data.schoolName}</td></tr>
                  <tr><td style="padding: 10px 0; color: #666666; font-size: 14px; border-bottom: 1px solid #e0e0e0;">School Code:</td><td style="padding: 10px 0; color: #000000; font-size: 14px; font-weight: 600; text-align: right; border-bottom: 1px solid #e0e0e0;">${data.schoolCode}</td></tr>
                  <tr><td style="padding: 10px 0; color: #666666; font-size: 14px; border-bottom: 1px solid #e0e0e0;">Transaction ID:</td><td style="padding: 10px 0; color: #000000; font-size: 14px; font-weight: 600; text-align: right; border-bottom: 1px solid #e0e0e0;">${data.transactionId}</td></tr>
                  <tr><td style="padding: 10px 0; color: #666666; font-size: 14px; border-bottom: 1px solid #e0e0e0;">Reference:</td><td style="padding: 10px 0; color: #000000; font-size: 14px; font-weight: 600; text-align: right; border-bottom: 1px solid #e0e0e0;">${data.reference}</td></tr>
                  <tr><td style="padding: 10px 0; color: #666666; font-size: 14px; border-bottom: 1px solid #e0e0e0;">Payment Date:</td><td style="padding: 10px 0; color: #000000; font-size: 14px; font-weight: 600; text-align: right; border-bottom: 1px solid #e0e0e0;">${formattedDate}</td></tr>
                  <tr><td style="padding: 10px 0; color: #666666; font-size: 14px; border-bottom: 1px solid #e0e0e0;">Additional Students:</td><td style="padding: 10px 0; color: #000000; font-size: 14px; font-weight: 600; text-align: right; border-bottom: 1px solid #e0e0e0;">+${data.additionalStudents.toLocaleString()}</td></tr>
                  <tr><td style="padding: 10px 0; color: #666666; font-size: 14px; border-bottom: 1px solid #e0e0e0;">New Total Capacity:</td><td style="padding: 10px 0; color: #000000; font-size: 14px; font-weight: 600; text-align: right; border-bottom: 1px solid #e0e0e0;">${data.newTotalStudents.toLocaleString()} students</td></tr>
                  <tr><td style="padding: 15px 0 10px; color: #000000; font-size: 18px; font-weight: 700;">Amount Paid:</td><td style="padding: 15px 0 10px; color: #000000; font-size: 20px; font-weight: 800; text-align: right;">${formattedAmount}</td></tr>
                </table>
              </div>
              <div style="background-color: #f0f7ff; border-left: 4px solid #0066cc; padding: 25px; border-radius: 8px; margin: 30px 0;">
                <h3 style="margin: 0 0 15px; color: #0066cc; font-size: 18px; font-weight: 700;">What's Next?</h3>
                <ul style="margin: 0; padding-left: 20px; color: #333333; font-size: 15px; line-height: 1.8;">
                  <li>You can now add up to ${data.newTotalStudents.toLocaleString()} students to your platform</li>
                  <li>Upload new students via CSV or add them manually</li>
                  <li>All existing students remain unaffected</li>
                  <li>Your upgrade is effective immediately</li>
                </ul>
              </div>
              <p style="margin: 30px 0 0; color: #555555; font-size: 15px; line-height: 1.6;">Please keep this receipt for your records. If you have any questions or need assistance, don't hesitate to reach out to our support team.</p>
              <p style="margin: 30px 0 0; color: #333333; font-size: 15px; line-height: 1.6;">Best regards,<br><strong>The AI CBT Team</strong></p>
            </td>
          </tr>
          <tr>
            <td style="padding: 30px 40px; background-color: #f8f9fa; border-radius: 0 0 12px 12px; text-align: center; border-top: 1px solid #e0e0e0;">
              <p style="margin: 0 0 10px; color: #666666; font-size: 13px;">This is an automated receipt. Please do not reply to this email.</p>
              <p style="margin: 0; color: #999999; font-size: 12px;">© ${new Date().getFullYear()} AI CBT Platform. All rights reserved.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `
}

export function generatePaymentReceiptHTML(data: PaymentReceiptData): string {
  const formattedDate = new Date(data.paidAt).toLocaleDateString("en-NG", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })

  const formattedAmount = new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
  }).format(data.amount)

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Payment Receipt - AI CBT</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
  <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f5f5f5;">
    <tr>
      <td style="padding: 40px 20px;">
        <table role="presentation" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <!-- Header -->
          <tr>
            <td style="padding: 40px 40px 30px; text-align: center; background: linear-gradient(135deg, #000000 0%, #1a1a1a 100%); border-radius: 12px 12px 0 0;">
              <div style="display: inline-block; width: 60px; height: 60px; background: #ffffff; border-radius: 12px; margin-bottom: 20px; display: flex; align-items: center; justify-content: center;">
                <span style="color: #000000; font-size: 24px; font-weight: bold;">AI</span>
              </div>
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 800; letter-spacing: -0.5px;">Payment Receipt</h1>
              <p style="margin: 10px 0 0; color: #cccccc; font-size: 16px;">Thank you for your payment</p>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              <p style="margin: 0 0 20px; color: #333333; font-size: 16px; line-height: 1.6;">
                Dear <strong>${data.adminName}</strong>,
              </p>
              
              <p style="margin: 0 0 30px; color: #555555; font-size: 15px; line-height: 1.6;">
                We're delighted to confirm that your payment has been successfully processed. Your school account has been activated and you're all set to transform your examination process!
              </p>

              <!-- Payment Details Box -->
              <div style="background-color: #f8f9fa; border-left: 4px solid #000000; padding: 25px; border-radius: 8px; margin: 30px 0;">
                <h2 style="margin: 0 0 20px; color: #000000; font-size: 20px; font-weight: 700;">Payment Details</h2>
                
                <table role="presentation" style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 10px 0; color: #666666; font-size: 14px; border-bottom: 1px solid #e0e0e0;">School Name:</td>
                    <td style="padding: 10px 0; color: #000000; font-size: 14px; font-weight: 600; text-align: right; border-bottom: 1px solid #e0e0e0;">${data.schoolName}</td>
                  </tr>
                  <tr>
                    <td style="padding: 10px 0; color: #666666; font-size: 14px; border-bottom: 1px solid #e0e0e0;">School Code:</td>
                    <td style="padding: 10px 0; color: #000000; font-size: 14px; font-weight: 600; text-align: right; border-bottom: 1px solid #e0e0e0;">${data.schoolCode}</td>
                  </tr>
                  <tr>
                    <td style="padding: 10px 0; color: #666666; font-size: 14px; border-bottom: 1px solid #e0e0e0;">Transaction ID:</td>
                    <td style="padding: 10px 0; color: #000000; font-size: 14px; font-weight: 600; text-align: right; border-bottom: 1px solid #e0e0e0;">${data.transactionId}</td>
                  </tr>
                  <tr>
                    <td style="padding: 10px 0; color: #666666; font-size: 14px; border-bottom: 1px solid #e0e0e0;">Reference:</td>
                    <td style="padding: 10px 0; color: #000000; font-size: 14px; font-weight: 600; text-align: right; border-bottom: 1px solid #e0e0e0;">${data.reference}</td>
                  </tr>
                  <tr>
                    <td style="padding: 10px 0; color: #666666; font-size: 14px; border-bottom: 1px solid #e0e0e0;">Payment Date:</td>
                    <td style="padding: 10px 0; color: #000000; font-size: 14px; font-weight: 600; text-align: right; border-bottom: 1px solid #e0e0e0;">${formattedDate}</td>
                  </tr>
                  <tr>
                    <td style="padding: 10px 0; color: #666666; font-size: 14px; border-bottom: 1px solid #e0e0e0;">One-time License Fee:</td>
                    <td style="padding: 10px 0; color: #000000; font-size: 14px; font-weight: 600; text-align: right; border-bottom: 1px solid #e0e0e0;">₦${data.oneTimeFee.toLocaleString()}</td>
                  </tr>
                  <tr>
                    <td style="padding: 10px 0; color: #666666; font-size: 14px; border-bottom: 1px solid #e0e0e0;">Per Student Fee (${data.numberOfStudents} students):</td>
                    <td style="padding: 10px 0; color: #000000; font-size: 14px; font-weight: 600; text-align: right; border-bottom: 1px solid #e0e0e0;">₦${(data.perStudentFee * data.numberOfStudents).toLocaleString()}</td>
                  </tr>
                  <tr>
                    <td style="padding: 15px 0 10px; color: #000000; font-size: 18px; font-weight: 700;">Total Amount Paid:</td>
                    <td style="padding: 15px 0 10px; color: #000000; font-size: 20px; font-weight: 800; text-align: right;">${formattedAmount}</td>
                  </tr>
                </table>
              </div>

              <!-- Next Steps -->
              <div style="background-color: #f0f7ff; border-left: 4px solid #0066cc; padding: 25px; border-radius: 8px; margin: 30px 0;">
                <h3 style="margin: 0 0 15px; color: #0066cc; font-size: 18px; font-weight: 700;">What's Next?</h3>
                <ul style="margin: 0; padding-left: 20px; color: #333333; font-size: 15px; line-height: 1.8;">
                  <li>Your school account is now active and ready to use</li>
                  <li>You can log in using your administrator credentials</li>
                  <li>Start by uploading student data and creating your first exam</li>
                  <li>Our support team is available 24/7 to assist you</li>
                </ul>
              </div>

              <p style="margin: 30px 0 0; color: #555555; font-size: 15px; line-height: 1.6;">
                Please keep this receipt for your records. If you have any questions or need assistance, don't hesitate to reach out to our support team.
              </p>

              <p style="margin: 30px 0 0; color: #333333; font-size: 15px; line-height: 1.6;">
                Best regards,<br>
                <strong>The AI CBT Team</strong>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 30px 40px; background-color: #f8f9fa; border-radius: 0 0 12px 12px; text-align: center; border-top: 1px solid #e0e0e0;">
              <p style="margin: 0 0 10px; color: #666666; font-size: 13px;">
                This is an automated receipt. Please do not reply to this email.
              </p>
              <p style="margin: 0; color: #999999; font-size: 12px;">
                © ${new Date().getFullYear()} AI CBT Platform. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `
}

export function generateWelcomeEmailHTML(data: WelcomeEmailData): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to AI CBT - ${data.schoolName}</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
  <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f5f5f5;">
    <tr>
      <td style="padding: 40px 20px;">
        <table role="presentation" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <!-- Header -->
          <tr>
            <td style="padding: 50px 40px 40px; text-align: center; background: linear-gradient(135deg, #000000 0%, #1a1a1a 100%); border-radius: 12px 12px 0 0;">
              <div style="display: inline-block; width: 80px; height: 80px; background: #ffffff; border-radius: 16px; margin-bottom: 25px; display: flex; align-items: center; justify-content: center;">
                <span style="color: #000000; font-size: 32px; font-weight: bold;">AI</span>
              </div>
              <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: 800; letter-spacing: -0.5px;">Welcome to AI CBT!</h1>
              <p style="margin: 15px 0 0; color: #cccccc; font-size: 18px;">Your journey to paperless examinations starts now</p>
            </td>
          </tr>

          <!-- Hero Section -->
          <tr>
            <td style="padding: 50px 40px 30px; text-align: center;">
              <p style="margin: 0 0 25px; color: #333333; font-size: 18px; line-height: 1.6; font-weight: 600;">
                Hello <strong style="color: #000000;">${data.adminName}</strong>! 👋
              </p>
              
              <p style="margin: 0 0 30px; color: #555555; font-size: 16px; line-height: 1.7;">
                On behalf of the entire AI CBT team, we're absolutely thrilled to welcome <strong>${data.schoolName}</strong> to our platform! You've just taken a significant step toward revolutionizing how your students learn, test, and excel.
              </p>

              <!-- School Info Box -->
              <div style="background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%); border: 2px solid #000000; padding: 25px; border-radius: 12px; margin: 30px 0;">
                <p style="margin: 0 0 10px; color: #666666; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">Your School Code</p>
                <p style="margin: 0; color: #000000; font-size: 32px; font-weight: 800; letter-spacing: 2px;">${data.schoolCode}</p>
                <p style="margin: 10px 0 0; color: #666666; font-size: 13px;">Keep this code safe - you'll need it for account management</p>
              </div>
            </td>
          </tr>

          <!-- Getting Started -->
          <tr>
            <td style="padding: 0 40px 30px;">
              <div style="background-color: #f8f9fa; padding: 30px; border-radius: 12px; border-left: 4px solid #000000;">
                <h2 style="margin: 0 0 20px; color: #000000; font-size: 24px; font-weight: 700;">🚀 Getting Started</h2>
                
                <div style="margin-bottom: 25px;">
                  <h3 style="margin: 0 0 10px; color: #333333; font-size: 18px; font-weight: 600;">Step 1: Log In</h3>
                  <p style="margin: 0 0 15px; color: #555555; font-size: 15px; line-height: 1.6;">
                    Use your administrator credentials to access your dashboard. Your account is fully activated and ready to go!
                  </p>
                  <a href="${data.loginUrl}" style="display: inline-block; background-color: #000000; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 15px;">Go to Dashboard →</a>
                </div>

                <div style="margin-bottom: 25px; padding-top: 25px; border-top: 1px solid #e0e0e0;">
                  <h3 style="margin: 0 0 10px; color: #333333; font-size: 18px; font-weight: 600;">Step 2: Upload Your Students</h3>
                  <p style="margin: 0 0 15px; color: #555555; font-size: 15px; line-height: 1.6;">
                    Bulk upload your student data using our CSV template. It's quick, easy, and our system will generate unique access codes for each student automatically.
                  </p>
                </div>

                <div style="margin-bottom: 25px; padding-top: 25px; border-top: 1px solid #e0e0e0;">
                  <h3 style="margin: 0 0 10px; color: #333333; font-size: 18px; font-weight: 600;">Step 3: Create Your First Exam</h3>
                  <p style="margin: 0 0 15px; color: #555555; font-size: 15px; line-height: 1.6;">
                    Upload your lesson materials and let our AI generate unlimited, unique questions. Or create questions manually - the choice is yours!
                  </p>
                </div>

                <div style="padding-top: 25px; border-top: 1px solid #e0e0e0;">
                  <h3 style="margin: 0 0 10px; color: #333333; font-size: 18px; font-weight: 600;">Step 4: Monitor & Analyze</h3>
                  <p style="margin: 0; color: #555555; font-size: 15px; line-height: 1.6;">
                    Watch as students take exams, get instant results, and use our powerful analytics to identify learning gaps and improve outcomes.
                  </p>
                </div>
              </div>
            </td>
          </tr>

          <!-- Features Highlight -->
          <tr>
            <td style="padding: 0 40px 30px;">
              <h2 style="margin: 0 0 20px; color: #000000; font-size: 24px; font-weight: 700; text-align: center;">✨ What Makes AI CBT Special</h2>
              
              <table role="presentation" style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 15px; background-color: #f8f9fa; border-radius: 8px; margin-bottom: 10px; display: block;">
                    <strong style="color: #000000; font-size: 15px;">🤖 AI-Powered Question Generation</strong>
                    <p style="margin: 5px 0 0; color: #666666; font-size: 14px; line-height: 1.5;">Upload materials once, get infinite unique questions forever.</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 15px; background-color: #f8f9fa; border-radius: 8px; margin-top: 10px; display: block;">
                    <strong style="color: #000000; font-size: 15px;">📊 Intelligent Analytics</strong>
                    <p style="margin: 5px 0 0; color: #666666; font-size: 14px; line-height: 1.5;">Identify learning gaps, track progress, and make data-driven decisions.</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 15px; background-color: #f8f9fa; border-radius: 8px; margin-top: 10px; display: block;">
                    <strong style="color: #000000; font-size: 15px;">🔒 Fort Knox Security</strong>
                    <p style="margin: 5px 0 0; color: #666666; font-size: 14px; line-height: 1.5;">Randomized questions, browser locking, and proctoring to ensure exam integrity.</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 15px; background-color: #f8f9fa; border-radius: 8px; margin-top: 10px; display: block;">
                    <strong style="color: #000000; font-size: 15px;">📱 Offline-First Design</strong>
                    <p style="margin: 5px 0 0; color: #666666; font-size: 14px; line-height: 1.5;">Works seamlessly even with unstable internet - perfect for Nigerian schools.</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Support Section -->
          <tr>
            <td style="padding: 0 40px 40px;">
              <div style="background: linear-gradient(135deg, #f0f7ff 0%, #e6f3ff 100%); border: 2px solid #0066cc; padding: 30px; border-radius: 12px; text-align: center;">
                <h3 style="margin: 0 0 15px; color: #0066cc; font-size: 20px; font-weight: 700;">💬 We're Here to Help</h3>
                <p style="margin: 0 0 20px; color: #333333; font-size: 15px; line-height: 1.6;">
                  Our support team is available 24/7 to assist you. Whether you need help setting up your first exam, understanding a feature, or have any questions at all - we've got your back!
                </p>
                <table role="presentation" style="width: 100%; border-collapse: collapse; margin-top: 20px;">
                  <tr>
                    <td style="padding: 10px; text-align: center;">
                      <a href="mailto:${data.supportEmail}" style="color: #0066cc; text-decoration: none; font-weight: 600; font-size: 15px;">📧 ${data.supportEmail}</a>
                    </td>
                    <td style="padding: 10px; text-align: center;">
                      <a href="tel:${data.supportPhone}" style="color: #0066cc; text-decoration: none; font-weight: 600; font-size: 15px;">📞 ${data.supportPhone}</a>
                    </td>
                  </tr>
                </table>
              </div>
            </td>
          </tr>

          <!-- Closing -->
          <tr>
            <td style="padding: 0 40px 40px;">
              <p style="margin: 0 0 20px; color: #555555; font-size: 16px; line-height: 1.7; text-align: center;">
                You're not just getting a platform - you're joining a community of forward-thinking educators who are transforming Nigerian education, one exam at a time.
              </p>
              
              <p style="margin: 0; color: #333333; font-size: 16px; line-height: 1.7; text-align: center;">
                Welcome aboard! We can't wait to see what you'll achieve. 🎉
              </p>
            </td>
          </tr>

          <!-- Signature -->
          <tr>
            <td style="padding: 0 40px 50px; text-align: center;">
              <p style="margin: 0 0 5px; color: #000000; font-size: 16px; font-weight: 700;">The AI CBT Team</p>
              <p style="margin: 0; color: #666666; font-size: 14px;">Transforming Education Through Technology</p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 30px 40px; background-color: #f8f9fa; border-radius: 0 0 12px 12px; text-align: center; border-top: 1px solid #e0e0e0;">
              <p style="margin: 0 0 15px; color: #666666; font-size: 14px;">
                <a href="${data.loginUrl}" style="color: #000000; text-decoration: none; font-weight: 600;">Login to Dashboard</a> | 
                <a href="mailto:${data.supportEmail}" style="color: #000000; text-decoration: none; font-weight: 600;">Contact Support</a>
              </p>
              <p style="margin: 0; color: #999999; font-size: 12px;">
                © ${new Date().getFullYear()} AI CBT Platform. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `
}

