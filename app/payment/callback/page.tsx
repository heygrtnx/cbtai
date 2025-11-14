"use client"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"

function PaymentCallbackContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [status, setStatus] = useState<"verifying" | "success" | "failed">("verifying")
  const [message, setMessage] = useState("")
  const [isUpgrade, setIsUpgrade] = useState(false)

  useEffect(() => {
    const reference = searchParams.get("reference")
    const trxref = searchParams.get("trxref")

    if (!reference && !trxref) {
      setStatus("failed")
      setMessage("No payment reference found")
      return
    }

    const verifyPayment = async () => {
      try {
        const response = await fetch("/api/payments/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ reference: reference || trxref }),
        })

        const data = await response.json()

        if (data.success) {
          setStatus("success")
          const upgradePending = sessionStorage.getItem("upgrade_pending") === "true" || data.isUpgrade
          setIsUpgrade(upgradePending)
          setMessage(
            upgradePending
              ? "Upgrade successful! Your student capacity has been increased."
              : "Payment verified successfully! Your school account has been activated."
          )
          setTimeout(() => {
            sessionStorage.removeItem("upgrade_pending")
            router.push("/dashboard/admin")
          }, 3000)
        } else {
          setStatus("failed")
          setMessage(data.message || "Payment verification failed")
        }
      } catch (error) {
        setStatus("failed")
        setMessage("An error occurred while verifying payment")
      }
    }

    verifyPayment()
  }, [searchParams, router])

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden flex items-center justify-center">
      {/* Background effects */}
      <div className="fixed inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
      <div className="fixed top-20 right-10 w-80 h-80 bg-white/5 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="fixed bottom-20 left-10 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none animate-pulse" style={{ animationDelay: "1s" }} />

      <div className="relative z-10 max-w-md w-full mx-4">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 md:p-10 text-center shadow-2xl">
          {status === "verifying" && (
            <>
              <div className="relative mb-6">
                <div className="w-20 h-20 mx-auto">
                  <div className="absolute inset-0 border-4 border-white/20 rounded-full"></div>
                  <div className="absolute inset-0 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                </div>
                <div className="mt-4">
                  <div className="w-2 h-2 bg-white rounded-full inline-block mx-1 animate-bounce" style={{ animationDelay: "0s" }}></div>
                  <div className="w-2 h-2 bg-white rounded-full inline-block mx-1 animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                  <div className="w-2 h-2 bg-white rounded-full inline-block mx-1 animate-bounce" style={{ animationDelay: "0.4s" }}></div>
                </div>
              </div>
              <h2 className="text-2xl md:text-3xl font-black text-white mb-3">Verifying Payment</h2>
              <p className="text-gray-400 text-sm md:text-base">Please wait while we verify your payment...</p>
            </>
          )}

          {status === "success" && (
            <>
              <div className="mb-6">
                <div className="w-24 h-24 mx-auto relative">
                  <div className="absolute inset-0 bg-green-500/20 rounded-full animate-ping"></div>
                  <div className="absolute inset-0 bg-green-500/30 rounded-full"></div>
                  <div className="relative w-full h-full bg-green-500/20 rounded-full flex items-center justify-center border-4 border-green-500/50">
                    <svg className="w-12 h-12 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
              </div>
              <h2 className="text-2xl md:text-3xl font-black text-green-400 mb-3">Payment Successful!</h2>
              <p className="text-gray-300 mb-6 text-sm md:text-base">{message}</p>
              <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <p>Redirecting to dashboard...</p>
              </div>
            </>
          )}

          {status === "failed" && (
            <>
              <div className="mb-6">
                <div className="w-24 h-24 mx-auto relative">
                  <div className="absolute inset-0 bg-red-500/20 rounded-full animate-pulse"></div>
                  <div className="relative w-full h-full bg-red-500/20 rounded-full flex items-center justify-center border-4 border-red-500/50">
                    <svg className="w-12 h-12 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                </div>
              </div>
              <h2 className="text-2xl md:text-3xl font-black text-red-400 mb-3">Payment Failed</h2>
              <p className="text-gray-300 mb-6 text-sm md:text-base">{message}</p>
              <button
                onClick={() => {
                  const upgradePending = sessionStorage.getItem("upgrade_pending") === "true"
                  if (upgradePending) {
                    router.push("/dashboard/admin/upgrade")
                  } else {
                    router.push("/schools/register")
                  }
                }}
                className="px-6 py-3 bg-white text-black rounded-lg hover:bg-gray-200 font-semibold transition-all transform hover:scale-105"
              >
                Try Again
              </button>
            </>
          )}
        </div>

        {/* Footer note */}
        <p className="text-center text-gray-500 text-xs mt-6">
          If you have any issues, please contact support
        </p>
      </div>
    </div>
  )
}

export default function PaymentCallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black text-white relative overflow-hidden flex items-center justify-center">
        <div className="fixed inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
        <div className="relative z-10 max-w-md w-full mx-4">
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 md:p-10 text-center shadow-2xl">
            <div className="relative mb-6">
              <div className="w-20 h-20 mx-auto">
                <div className="absolute inset-0 border-4 border-white/20 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
              </div>
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-white mb-3">Loading...</h2>
          </div>
        </div>
      </div>
    }>
      <PaymentCallbackContent />
    </Suspense>
  )
}
