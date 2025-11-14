"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut } from "next-auth/react"
import { motion } from "framer-motion"
import { toast } from "sonner"

export default function Header() {
  const pathname = usePathname()

  // Don't show header on landing page, login page, register page, dashboard pages, or payment callback
  if (pathname === "/" || pathname?.startsWith("/auth/login") || pathname?.startsWith("/schools/register") || pathname?.startsWith("/dashboard") || pathname?.startsWith("/payment/callback")) {
    return null
  }

  const handleSignOut = async () => {
    toast.info("Signing out...", { duration: 1000 })
    await signOut({ callbackUrl: "/" })
  }

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 100, damping: 15 }}
      className="sticky top-0 z-50 glass-card-strong border-b border-white/10 backdrop-blur-xl"
    >
      <nav className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link href="/dashboard" className="flex items-center gap-2 group">
              <motion.div
                className="w-10 h-10 bg-gradient-to-br from-white to-gray-400 rounded-lg flex flex-col items-center justify-center shadow-lg"
                whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                transition={{ duration: 0.5 }}
              >
                <span className="text-black font-bold text-xs">AI</span>
                <span className="text-black font-normal text-[8px] leading-tight">enabled</span>
              </motion.div>
              <span className="text-xl font-bold text-white group-hover:text-gray-200 transition-colors">AI CBT</span>
            </Link>
          </motion.div>

          <div className="flex items-center gap-4">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="/dashboard"
                className="px-4 py-2 rounded-lg hover:bg-white/10 transition-all text-gray-300 hover:text-white relative overflow-hidden group"
              >
                <span className="relative z-10">Dashboard</span>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: "100%" }}
                  transition={{ duration: 0.5 }}
                />
              </Link>
            </motion.div>
            <motion.button
              onClick={handleSignOut}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all text-white border border-white/20 backdrop-blur-sm relative overflow-hidden group"
            >
              <span className="relative z-10">Sign Out</span>
              <motion.div
                className="absolute inset-0 bg-white/10"
                initial={{ scale: 0 }}
                whileHover={{ scale: 1 }}
                transition={{ duration: 0.3 }}
              />
            </motion.button>
          </div>
        </div>
      </nav>
    </motion.header>
  )
}
