"use client"

import { useEffect, useState } from "react"
import Link from "next/link"

export default function Home() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  return (
    <div className="bg-black text-white relative overflow-x-hidden">
      {/* Animated background gradient */}
      <div 
        className="fixed inset-0 opacity-20 pointer-events-none"
        style={{
          background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(255,255,255,0.1) 0%, transparent 50%)`,
        }}
      />

      {/* Grid pattern overlay */}
      <div className="fixed inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none" />

      {/* Floating glass orbs */}
      <div className="fixed top-20 left-10 w-72 h-72 bg-white/5 rounded-full blur-3xl animate-pulse pointer-events-none" />
      <div className="fixed bottom-20 right-10 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse delay-1000 pointer-events-none" />
      <div className="fixed top-1/2 left-1/2 w-64 h-64 bg-white/5 rounded-full blur-3xl animate-pulse delay-2000 pointer-events-none" />

      <div className="relative z-10">
        {/* Navigation */}
        <nav className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-white to-gray-400 rounded-lg flex items-center justify-center">
                <span className="text-black font-bold text-xl">TN</span>
              </div>
              <span className="text-xl font-bold">TestNexus</span>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/auth/login"
                className="px-4 sm:px-6 py-2 rounded-lg bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all text-sm sm:text-base"
              >
                Login
              </Link>
              <Link
                href="/schools/register"
                className="px-4 sm:px-6 py-2 rounded-lg bg-white text-black hover:bg-gray-200 transition-all font-medium text-sm sm:text-base"
              >
                Get Started
              </Link>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
          <div className="max-w-5xl mx-auto text-center space-y-6 sm:space-y-8">
            {/* Main heading */}
            <div className="space-y-4">
              <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight leading-tight">
                <span className="text-white">TestNexus</span>
                <br />
                <span className="bg-gradient-to-r from-white via-gray-300 to-white bg-clip-text text-transparent animate-gradient">
                  Smart Testing Platform
                </span>
              </h1>
              <p className="text-lg sm:text-xl md:text-2xl text-gray-400 max-w-2xl mx-auto leading-relaxed px-4">
                Revolutionizing education in Nigeria with intelligent computer-based testing.
                Transform your school's examination system with seamless, secure, and smart solutions.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
              <Link
                href="/schools/register"
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white text-black font-semibold text-lg hover:bg-gray-200 transition-all shadow-lg shadow-white/20 hover:shadow-white/30"
              >
                Start Free Trial
              </Link>
              <Link
                href="/auth/login"
                className="w-full sm:w-auto px-8 py-4 rounded-xl glass-card border border-white/20 font-semibold text-lg hover:bg-white/10 transition-all"
              >
                Sign In
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 sm:gap-8 pt-12 sm:pt-16 border-t border-white/10 mt-12 sm:mt-16">
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-black text-white mb-2">300K+</div>
                <div className="text-xs sm:text-sm text-gray-400">One-time License</div>
              </div>
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-black text-white mb-2">₦3K</div>
                <div className="text-xs sm:text-sm text-gray-400">Per Student</div>
              </div>
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-black text-white mb-2">24/7</div>
                <div className="text-xs sm:text-sm text-gray-400">AI Support</div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-4">
                Powerful Features for Modern Education
              </h2>
              <p className="text-gray-400 text-lg sm:text-xl max-w-2xl mx-auto">
                Everything you need to conduct seamless computer-based examinations
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="glass-card p-6 rounded-2xl border border-white/10 hover:border-white/20 transition-all group">
                <div className="w-14 h-14 bg-white/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-white/20 transition-all">
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">AI Question Generation</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Automatically generate unlimited questions from lesson materials using advanced AI. No duplicates, infinite variations.
                </p>
              </div>

              <div className="glass-card p-6 rounded-2xl border border-white/10 hover:border-white/20 transition-all group">
                <div className="w-14 h-14 bg-white/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-white/20 transition-all">
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Smart Grading System</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Intelligent theory question grading with customizable accuracy tolerance. Get instant, accurate results.
                </p>
              </div>

              <div className="glass-card p-6 rounded-2xl border border-white/10 hover:border-white/20 transition-all group">
                <div className="w-14 h-14 bg-white/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-white/20 transition-all">
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Mobile First Design</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Optimized for low-bandwidth connections, perfect for Nigerian schools. Works seamlessly on all devices.
                </p>
              </div>

              <div className="glass-card p-6 rounded-2xl border border-white/10 hover:border-white/20 transition-all group">
                <div className="w-14 h-14 bg-white/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-white/20 transition-all">
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Exam Security</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Password protection, question randomization, tab switching prevention, and webcam monitoring.
                </p>
              </div>

              <div className="glass-card p-6 rounded-2xl border border-white/10 hover:border-white/20 transition-all group">
                <div className="w-14 h-14 bg-white/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-white/20 transition-all">
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Real-time Analytics</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Comprehensive dashboards with detailed reports, performance metrics, and insights for administrators.
                </p>
              </div>

              <div className="glass-card p-6 rounded-2xl border border-white/10 hover:border-white/20 transition-all group">
                <div className="w-14 h-14 bg-white/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-white/20 transition-all">
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Offline Support</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Take exams offline and sync when connection is restored. Perfect for areas with unstable internet.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-4">
                How It Works
              </h2>
              <p className="text-gray-400 text-lg sm:text-xl max-w-2xl mx-auto">
                Get started in three simple steps
              </p>
            </div>

            <div className="grid sm:grid-cols-3 gap-8 sm:gap-12">
              <div className="text-center">
                <div className="w-16 h-16 bg-white text-black rounded-full flex items-center justify-center text-2xl font-black mx-auto mb-6">
                  1
                </div>
                <h3 className="text-xl font-bold mb-3">Register Your School</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Complete the registration form and make payment. Get your school account activated instantly.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-white text-black rounded-full flex items-center justify-center text-2xl font-black mx-auto mb-6">
                  2
                </div>
                <h3 className="text-xl font-bold mb-3">Upload Students & Materials</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Upload student data via CSV and add your lesson materials. AI will generate questions automatically.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-white text-black rounded-full flex items-center justify-center text-2xl font-black mx-auto mb-6">
                  3
                </div>
                <h3 className="text-xl font-bold mb-3">Create & Conduct Exams</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Set up exams, assign to classes, and students can take them. Get instant results and analytics.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Video Tutorials Section */}
        <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-4">
                Video Tutorials & Help
              </h2>
              <p className="text-gray-400 text-lg sm:text-xl max-w-2xl mx-auto">
                Learn how to use the platform with our comprehensive video guides
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="glass-card rounded-2xl border border-white/10 overflow-hidden hover:border-white/20 transition-all group">
                <div className="aspect-video bg-white/5 relative">
                  <iframe
                    className="w-full h-full"
                    src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                    title="Getting Started"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-bold mb-2">Getting Started</h3>
                  <p className="text-gray-400 text-sm mb-4">Learn the basics of setting up your school account</p>
                  <a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ" target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-300 text-sm font-medium">
                    Watch Video →
                  </a>
                </div>
              </div>

              <div className="glass-card rounded-2xl border border-white/10 overflow-hidden hover:border-white/20 transition-all group">
                <div className="aspect-video bg-white/5 relative">
                  <iframe
                    className="w-full h-full"
                    src="https://www.youtube.com/embed/jNQXAC9IVRw"
                    title="Creating Exams"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-bold mb-2">Creating Exams</h3>
                  <p className="text-gray-400 text-sm mb-4">Step-by-step guide to creating and publishing exams</p>
                  <a href="https://www.youtube.com/watch?v=jNQXAC9IVRw" target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-300 text-sm font-medium">
                    Watch Video →
                  </a>
                </div>
              </div>

              <div className="glass-card rounded-2xl border border-white/10 overflow-hidden hover:border-white/20 transition-all group">
                <div className="aspect-video bg-white/5 relative">
                  <iframe
                    className="w-full h-full"
                    src="https://www.youtube.com/embed/9bZkp7q19f0"
                    title="Question Generation"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-bold mb-2">Question Generation</h3>
                  <p className="text-gray-400 text-sm mb-4">How to generate questions from materials</p>
                  <a href="https://www.youtube.com/watch?v=9bZkp7q19f0" target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-300 text-sm font-medium">
                    Watch Video →
                  </a>
                </div>
              </div>

              <div className="glass-card rounded-2xl border border-white/10 overflow-hidden hover:border-white/20 transition-all group">
                <div className="aspect-video bg-white/5 relative">
                  <iframe
                    className="w-full h-full"
                    src="https://www.youtube.com/embed/kJQP7kiw5Fk"
                    title="Student Management"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-bold mb-2">Student Management</h3>
                  <p className="text-gray-400 text-sm mb-4">Upload and manage students using CSV files</p>
                  <a href="https://www.youtube.com/watch?v=kJQP7kiw5Fk" target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-300 text-sm font-medium">
                    Watch Video →
                  </a>
                </div>
              </div>

              <div className="glass-card rounded-2xl border border-white/10 overflow-hidden hover:border-white/20 transition-all group">
                <div className="aspect-video bg-white/5 relative">
                  <iframe
                    className="w-full h-full"
                    src="https://www.youtube.com/embed/fJ9rUzIMcZQ"
                    title="Results & Analytics"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-bold mb-2">Results & Analytics</h3>
                  <p className="text-gray-400 text-sm mb-4">Understanding results, grades, and analytics</p>
                  <a href="https://www.youtube.com/watch?v=fJ9rUzIMcZQ" target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-300 text-sm font-medium">
                    Watch Video →
                  </a>
                </div>
              </div>

              <div className="glass-card rounded-2xl border border-white/10 overflow-hidden hover:border-white/20 transition-all group">
                <div className="aspect-video bg-white/5 relative">
                  <iframe
                    className="w-full h-full"
                    src="https://www.youtube.com/embed/OPf0YbXqDm0"
                    title="Troubleshooting"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-bold mb-2">Troubleshooting</h3>
                  <p className="text-gray-400 text-sm mb-4">Common issues and how to resolve them</p>
                  <a href="https://www.youtube.com/watch?v=OPf0YbXqDm0" target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-300 text-sm font-medium">
                    Watch Video →
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Support Section */}
        <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
          <div className="max-w-4xl mx-auto">
            <div className="glass-card-strong rounded-2xl border border-white/10 p-8 sm:p-12">
              <div className="text-center mb-8">
                <h2 className="text-3xl sm:text-4xl font-black mb-4">
                  Need Help? We're Here for You
                </h2>
                <p className="text-gray-400 text-lg">
                  Our support team is available 24/7 to assist you
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-6 mb-8">
                <div className="glass-card p-6 rounded-xl border border-white/10">
                  <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center mb-4">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold mb-2">Email Support</h3>
                  <p className="text-gray-400 text-sm mb-4">Get help via email</p>
                  <a href="mailto:support@cbtplatform.com" className="text-white hover:text-gray-300 text-sm font-medium">
                    support@cbtplatform.com →
                  </a>
                </div>

                <div className="glass-card p-6 rounded-xl border border-white/10">
                  <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center mb-4">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold mb-2">Live Chat</h3>
                  <p className="text-gray-400 text-sm mb-4">Chat with our support team</p>
                  <a href="#" className="text-white hover:text-gray-300 text-sm font-medium">
                    Start Chat →
                  </a>
                </div>

                <div className="glass-card p-6 rounded-xl border border-white/10">
                  <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center mb-4">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold mb-2">Documentation</h3>
                  <p className="text-gray-400 text-sm mb-4">Comprehensive guides and docs</p>
                  <a href="#" className="text-white hover:text-gray-300 text-sm font-medium">
                    View Docs →
                  </a>
                </div>

                <div className="glass-card p-6 rounded-xl border border-white/10">
                  <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center mb-4">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold mb-2">Phone Support</h3>
                  <p className="text-gray-400 text-sm mb-4">Call us for immediate assistance</p>
                  <a href="tel:+2348000000000" className="text-white hover:text-gray-300 text-sm font-medium">
                    +234 800 000 0000 →
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
          <div className="max-w-4xl mx-auto text-center">
            <div className="glass-card-strong rounded-2xl border border-white/10 p-8 sm:p-12">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-4">
                Ready to Transform Your School?
              </h2>
              <p className="text-gray-400 text-lg sm:text-xl mb-8 max-w-2xl mx-auto">
                Join hundreds of schools already using TestNexus. Start your journey today.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/schools/register"
                  className="px-8 py-4 rounded-xl bg-white text-black font-semibold text-lg hover:bg-gray-200 transition-all shadow-lg shadow-white/20"
                >
                  Get Started Now
                </Link>
                <Link
                  href="/auth/login"
                  className="px-8 py-4 rounded-xl glass-card border border-white/20 font-semibold text-lg hover:bg-white/10 transition-all"
                >
                  Sign In
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 border-t border-white/10">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-white to-gray-400 rounded-lg flex items-center justify-center">
                  <span className="text-black font-bold text-xl">TN</span>
                </div>
                <span className="text-xl font-bold">TestNexus</span>
              </div>
              <p className="text-gray-400 text-sm">
                Revolutionizing education in Nigeria with smart computer-based testing solutions.
              </p>
            </div>

            <div>
              <h4 className="font-bold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Video Tutorials</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms</a></li>
              </ul>
            </div>
          </div>

          <div className="text-center text-sm text-gray-400 pt-8 border-t border-white/10">
            <p>© 2024 TestNexus. All rights reserved.</p>
          </div>
        </footer>

        {/* Floating particles effect */}
        <div className="fixed inset-0 pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white/30 rounded-full animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${3 + Math.random() * 4}s`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
