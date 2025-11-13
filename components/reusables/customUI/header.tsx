"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut } from "next-auth/react"

export default function Header() {
  const pathname = usePathname()

  // Don't show header on landing page or login page
  if (pathname === "/" || pathname?.startsWith("/auth/login")) {
    return null
  }

  return (
    <header className="sticky top-0 z-50 glass-card-strong border-b border-white/10">
      <nav className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-white to-gray-400 rounded-lg flex items-center justify-center">
              <span className="text-black font-bold text-xl">TN</span>
            </div>
            <span className="text-xl font-bold text-white">TestNexus</span>
          </Link>

          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="px-4 py-2 rounded-lg hover:bg-white/10 transition-colors text-gray-300 hover:text-white"
            >
              Dashboard
            </Link>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-white border border-white/20"
            >
              Sign Out
            </button>
          </div>
        </div>
      </nav>
    </header>
  )
}
