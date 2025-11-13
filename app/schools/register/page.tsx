"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { SchoolType, CurriculumType } from "@prisma/client"

export default function RegisterSchoolPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    name: "",
    registrationNumber: "",
    type: "SECONDARY" as SchoolType,
    address: "",
    state: "",
    lga: "",
    city: "",
    email: "",
    phone: "",
    adminName: "",
    adminEmail: "",
    adminPassword: "",
    numberOfStudents: 0,
    numberOfCampuses: 1,
    curriculum: "NIGERIAN" as CurriculumType,
  })

  const [fees, setFees] = useState<{
    oneTimeFee: number
    perStudentFee: number
    total: number
  } | null>(null)
  const [schoolId, setSchoolId] = useState<string>("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const response = await fetch("/api/schools/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Registration failed")
      }

      setSchoolId(data.schoolId)

      const oneTimeFee = 300000
      const perStudentFee = 3000
      const total = oneTimeFee + perStudentFee * formData.numberOfStudents

      setFees({
        oneTimeFee,
        perStudentFee,
        total,
      })
      setStep(2)
    } catch (err: any) {
      setError(err.message || "Registration failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handlePayment = async (method: "PAYSTACK" | "FLUTTERWAVE" | "BANK_TRANSFER") => {
    if (!fees) return

    setLoading(true)
    setError("")

    try {
      const response = await fetch("/api/payments/initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          schoolId: schoolId,
          amount: fees.total,
          method,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Payment initialization failed")
      }

      if (method === "BANK_TRANSFER") {
        alert("Please upload payment proof. You will receive instructions via email.")
        router.push("/")
      } else if (data.authorizationUrl) {
        window.location.href = data.authorizationUrl
      }
    } catch (err: any) {
      setError(err.message || "Payment initialization failed")
    } finally {
      setLoading(false)
    }
  }

  if (step === 2 && fees) {
    return (
      <div className="min-h-screen bg-black text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />
        <div className="absolute top-20 right-10 w-96 h-96 bg-white/5 rounded-full blur-3xl" />

        <div className="relative z-10 min-h-screen flex items-center justify-center py-12 px-4">
          <div className="max-w-2xl w-full space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-4xl font-bold mb-2">Payment Required</h2>
              <p className="text-gray-400">Complete your registration by making payment</p>
            </div>

            <div className="glass-card-strong rounded-2xl border border-white/10 p-8">
              <h3 className="text-2xl font-bold mb-6">Payment Summary</h3>
              <div className="space-y-4 mb-6">
                <div className="flex justify-between py-3 border-b border-white/10">
                  <span className="text-gray-400">One-time Registration Fee:</span>
                  <span className="font-bold text-white">₦{fees.oneTimeFee.toLocaleString()}</span>
                </div>
                <div className="flex justify-between py-3 border-b border-white/10">
                  <span className="text-gray-400">Per Student Fee ({formData.numberOfStudents} students):</span>
                  <span className="font-bold text-white">₦{(fees.perStudentFee * formData.numberOfStudents).toLocaleString()}</span>
                </div>
                <div className="flex justify-between pt-4 text-xl">
                  <span className="font-bold">Total:</span>
                  <span className="font-black text-white">₦{fees.total.toLocaleString()}</span>
                </div>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 text-red-400 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <div className="space-y-3">
                <button
                  onClick={() => handlePayment("PAYSTACK")}
                  disabled={loading}
                  className="w-full bg-white text-black py-4 px-6 rounded-xl hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed font-semibold transition-all shadow-lg shadow-white/20"
                >
                  {loading ? "Processing..." : "Pay with Paystack"}
                </button>
                <button
                  onClick={() => handlePayment("FLUTTERWAVE")}
                  disabled={loading}
                  className="w-full glass-card border border-white/20 py-4 px-6 rounded-xl hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed font-semibold transition-all"
                >
                  {loading ? "Processing..." : "Pay with Flutterwave"}
                </button>
                <button
                  onClick={() => handlePayment("BANK_TRANSFER")}
                  disabled={loading}
                  className="w-full glass-card border border-white/20 py-4 px-6 rounded-xl hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed font-semibold transition-all"
                >
                  {loading ? "Processing..." : "Bank Transfer (Upload Proof)"}
                </button>
              </div>

              <button
                onClick={() => setStep(1)}
                className="w-full mt-4 text-gray-400 hover:text-white transition-colors"
              >
                ← Back to registration
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />
      <div className="absolute top-20 left-10 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-72 h-72 bg-white/5 rounded-full blur-3xl" />

      <div className="relative z-10 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-white to-gray-400 rounded-lg flex items-center justify-center">
                <span className="text-black font-bold text-xl">TN</span>
              </div>
              <span className="text-xl font-bold">TestNexus</span>
            </Link>
            <h1 className="text-4xl font-bold mb-2">School Registration</h1>
            <p className="text-gray-400">Register your school to get started</p>
          </div>

          <div className="glass-card-strong rounded-2xl border border-white/10 p-8 shadow-2xl">
            {error && (
              <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 text-red-400 rounded-lg text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold mb-6">School Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      School Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-white/50 focus:border-white/30 outline-none transition-all text-white placeholder-gray-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Registration Number
                    </label>
                    <input
                      type="text"
                      value={formData.registrationNumber}
                      onChange={(e) => setFormData({ ...formData, registrationNumber: e.target.value })}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-white/50 focus:border-white/30 outline-none transition-all text-white placeholder-gray-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      School Type *
                    </label>
                    <select
                      required
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value as SchoolType })}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-white/50 focus:border-white/30 outline-none transition-all text-white"
                    >
                      <option value="PRIMARY">Primary</option>
                      <option value="SECONDARY">Secondary</option>
                      <option value="TERTIARY">Tertiary</option>
                      <option value="MIXED">Mixed</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Curriculum *
                    </label>
                    <select
                      required
                      value={formData.curriculum}
                      onChange={(e) => setFormData({ ...formData, curriculum: e.target.value as CurriculumType })}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-white/50 focus:border-white/30 outline-none transition-all text-white"
                    >
                      <option value="NIGERIAN">Nigerian</option>
                      <option value="BRITISH">British</option>
                      <option value="AMERICAN">American</option>
                      <option value="MIXED">Mixed</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      State *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-white/50 focus:border-white/30 outline-none transition-all text-white placeholder-gray-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      LGA *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.lga}
                      onChange={(e) => setFormData({ ...formData, lga: e.target.value })}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-white/50 focus:border-white/30 outline-none transition-all text-white placeholder-gray-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      City *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-white/50 focus:border-white/30 outline-none transition-all text-white placeholder-gray-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Address *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-white/50 focus:border-white/30 outline-none transition-all text-white placeholder-gray-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      School Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-white/50 focus:border-white/30 outline-none transition-all text-white placeholder-gray-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      School Phone *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+234..."
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-white/50 focus:border-white/30 outline-none transition-all text-white placeholder-gray-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Number of Students *
                    </label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={formData.numberOfStudents}
                      onChange={(e) => setFormData({ ...formData, numberOfStudents: parseInt(e.target.value) || 0 })}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-white/50 focus:border-white/30 outline-none transition-all text-white placeholder-gray-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Number of Campuses
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={formData.numberOfCampuses}
                      onChange={(e) => setFormData({ ...formData, numberOfCampuses: parseInt(e.target.value) || 1 })}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-white/50 focus:border-white/30 outline-none transition-all text-white placeholder-gray-500"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-6">Administrator Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Administrator Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.adminName}
                      onChange={(e) => setFormData({ ...formData, adminName: e.target.value })}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-white/50 focus:border-white/30 outline-none transition-all text-white placeholder-gray-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Administrator Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.adminEmail}
                      onChange={(e) => setFormData({ ...formData, adminEmail: e.target.value })}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-white/50 focus:border-white/30 outline-none transition-all text-white placeholder-gray-500"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Administrator Password *
                    </label>
                    <input
                      type="password"
                      required
                      minLength={6}
                      value={formData.adminPassword}
                      onChange={(e) => setFormData({ ...formData, adminPassword: e.target.value })}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-white/50 focus:border-white/30 outline-none transition-all text-white placeholder-gray-500"
                      placeholder="Minimum 6 characters"
                    />
                  </div>
                </div>
              </div>

              <div className="glass-card p-4 rounded-xl border border-white/10">
                <p className="text-sm text-gray-300">
                  <strong className="text-white">License Fee:</strong> ₦300,000 (one-time) + ₦3,000 per student
                </p>
                {formData.numberOfStudents > 0 && (
                  <p className="text-sm text-gray-300 mt-2">
                    <strong className="text-white">Estimated Total:</strong> ₦{(300000 + 3000 * formData.numberOfStudents).toLocaleString()}
                  </p>
                )}
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-white text-black py-4 px-6 rounded-xl hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed font-semibold transition-all shadow-lg shadow-white/20"
                >
                  {loading ? "Registering..." : "Register School"}
                </button>
                <Link
                  href="/"
                  className="px-6 py-4 border border-white/20 rounded-xl hover:bg-white/10 text-white transition-all flex items-center"
                >
                  Cancel
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
