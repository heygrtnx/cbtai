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
    <div className="bg-black text-white relative overflow-x-hidden min-h-screen">
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
                <span className="text-black font-bold text-xs">AI</span>
              </div>
              <span className="text-xl font-bold">AI CBT</span>
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
                <span className="bg-gradient-to-r from-white via-gray-300 to-white bg-clip-text text-transparent animate-gradient">
                  Leave Paper Exam Forever
                </span>
              </h1>
              <p className="text-lg sm:text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto leading-relaxed px-4">
                Stop wrestling with paper exams. Start revolutionizing how your students learn, test, and excel.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
              <Link
                href="/schools/register"
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white text-black font-semibold text-lg hover:bg-gray-200 transition-all shadow-lg shadow-white/20 hover:shadow-white/30"
              >
                Transform Your School Today
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

        {/* Testimonials Carousel */}
        <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-4">
                What Schools Are Saying
              </h2>
              <p className="text-gray-400 text-lg sm:text-xl max-w-2xl mx-auto">
                Real stories from real educators who've transformed their examination process
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="glass-card p-6 rounded-2xl border border-white/10 hover:border-white/20 transition-all">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-lg">AO</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-white">Dr. Adebayo Ogunleye</h4>
                    <p className="text-sm text-gray-400">Principal, Lagos State Model College</p>
                  </div>
                </div>
                <p className="text-gray-300 text-sm leading-relaxed">
                  "AI CBT has completely transformed how we conduct examinations. The AI question generation saves us countless hours, and students love the instant results. Our exam efficiency has increased by 300%."
                </p>
                <div className="flex gap-1 mt-4">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>

              <div className="glass-card p-6 rounded-2xl border border-white/10 hover:border-white/20 transition-all">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-lg">CM</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-white">Mrs. Chioma Mbanefo</h4>
                    <p className="text-sm text-gray-400">Vice Principal, Federal Government College</p>
                  </div>
                </div>
                <p className="text-gray-300 text-sm leading-relaxed">
                  "The offline capability is a game-changer for our school. Students can take exams even when the internet is unstable. The grading system is incredibly accurate—it understands context, not just keywords."
                </p>
                <div className="flex gap-1 mt-4">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>

              <div className="glass-card p-6 rounded-2xl border border-white/10 hover:border-white/20 transition-all">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-lg">IK</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-white">Mr. Ibrahim Kolawole</h4>
                    <p className="text-sm text-gray-400">Head of Academics, King's College</p>
                  </div>
                </div>
                <p className="text-gray-300 text-sm leading-relaxed">
                  "The analytics dashboard gives us insights we never had before. We can identify learning gaps instantly and adjust our teaching strategies. Student performance has improved significantly since we started using AI CBT."
                </p>
                <div className="flex gap-1 mt-4">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>

              <div className="glass-card p-6 rounded-2xl border border-white/10 hover:border-white/20 transition-all">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-lg">FA</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-white">Mrs. Funke Adeyemi</h4>
                    <p className="text-sm text-gray-400">Principal, Queen's College Lagos</p>
                  </div>
                </div>
                <p className="text-gray-300 text-sm leading-relaxed">
                  "Security features are outstanding. The randomization and browser locking prevent cheating effectively. Parents trust our examination process more than ever. It's been a complete game-changer."
                </p>
                <div className="flex gap-1 mt-4">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>

              <div className="glass-card p-6 rounded-2xl border border-white/10 hover:border-white/20 transition-all">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-lg">EO</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-white">Dr. Emeka Okonkwo</h4>
                    <p className="text-sm text-gray-400">Director, St. Gregory's College</p>
                  </div>
                </div>
                <p className="text-gray-300 text-sm leading-relaxed">
                  "The bulk student upload feature saved us weeks of manual data entry. The platform is intuitive, and our teachers adapted quickly. ROI was evident within the first month of use."
                </p>
                <div className="flex gap-1 mt-4">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>

              <div className="glass-card p-6 rounded-2xl border border-white/10 hover:border-white/20 transition-all">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-lg">BA</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-white">Mrs. Bola Adegoke</h4>
                    <p className="text-sm text-gray-400">Principal, Methodist Boys High School</p>
                  </div>
                </div>
                <p className="text-gray-300 text-sm leading-relaxed">
                  "Support team is exceptional. They respond quickly and actually understand our needs. The platform works flawlessly even with our limited bandwidth. Highly recommend to any school in Nigeria."
                </p>
                <div className="flex gap-1 mt-4">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-4">
                Everything You Need. Nothing You Don't.
              </h2>
              <p className="text-gray-400 text-lg sm:text-xl max-w-2xl mx-auto">
                Built for Nigerian schools. Designed for excellence. Powered by intelligence.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="glass-card p-6 rounded-2xl border border-white/10 hover:border-white/20 transition-all group">
                <div className="w-14 h-14 bg-white/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-white/20 transition-all">
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Question Generation That Never Sleeps</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Upload your materials once. Get infinite, unique questions forever. Our AI doesn't just generate questions—it crafts them with precision, ensuring every exam feels fresh and challenging.
                </p>
              </div>

              <div className="glass-card p-6 rounded-2xl border border-white/10 hover:border-white/20 transition-all group">
                <div className="w-14 h-14 bg-white/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-white/20 transition-all">
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Grading That Understands Context</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Theory questions aren't multiple choice. Neither is our grading. Watch as AI analyzes meaning, context, and understanding—not just keywords. Your students deserve better than robotic scoring.
                </p>
              </div>

              <div className="glass-card p-6 rounded-2xl border border-white/10 hover:border-white/20 transition-all group">
                <div className="w-14 h-14 bg-white/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-white/20 transition-all">
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Built for Real-World Nigeria</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Slow internet? No problem. Power cuts? We've got you. Our platform works offline, syncs when connected, and loads fast even on 2G. Because education shouldn't wait for perfect conditions.
                </p>
              </div>

              <div className="glass-card p-6 rounded-2xl border border-white/10 hover:border-white/20 transition-all group">
                <div className="w-14 h-14 bg-white/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-white/20 transition-all">
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Security That Actually Works</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Randomize questions. Randomize answers. Lock browsers. Monitor screens. We make cheating harder than passing the exam. Your exam integrity is non-negotiable.
                </p>
              </div>

              <div className="glass-card p-6 rounded-2xl border border-white/10 hover:border-white/20 transition-all group">
                <div className="w-14 h-14 bg-white/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-white/20 transition-all">
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Insights That Drive Decisions</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  See which topics confuse students. Identify learning gaps instantly. Track performance trends. Make data-driven decisions that actually improve outcomes. Knowledge is power—we give you both.
                </p>
              </div>

              <div className="glass-card p-6 rounded-2xl border border-white/10 hover:border-white/20 transition-all group">
                <div className="w-14 h-14 bg-white/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-white/20 transition-all">
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Offline-First, Always-On</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Students start exams offline. Answers save locally. When connection returns, everything syncs automatically. No lost work. No frustration. Just seamless testing, anywhere, anytime.
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
                From Zero to Hero in Three Steps
              </h2>
              <p className="text-gray-400 text-lg sm:text-xl max-w-2xl mx-auto">
                No complexity. No confusion. Just results.
              </p>
            </div>

            <div className="grid sm:grid-cols-3 gap-8 sm:gap-12">
              <div className="text-center">
                <div className="w-16 h-16 bg-white text-black rounded-full flex items-center justify-center text-2xl font-black mx-auto mb-6">
                  1
                </div>
                <h3 className="text-xl font-bold mb-3">Register & Pay</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Complete your registration in minutes. Choose your payment plan. Get instant access. Your school's transformation starts here.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-white text-black rounded-full flex items-center justify-center text-2xl font-black mx-auto mb-6">
                  2
                </div>
                <h3 className="text-xl font-bold mb-3">Upload & Generate</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Upload student data via CSV. Add your lesson materials. Watch AI create unlimited questions in seconds. It's that simple.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-white text-black rounded-full flex items-center justify-center text-2xl font-black mx-auto mb-6">
                  3
                </div>
                <h3 className="text-xl font-bold mb-3">Test & Triumph</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Create exams. Assign to classes. Students take tests. Get instant results. Celebrate improved performance. Repeat.
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
                Learn by Watching, Master by Doing
              </h2>
              <p className="text-gray-400 text-lg sm:text-xl max-w-2xl mx-auto">
                Step-by-step video guides that turn complexity into clarity
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
                  <h3 className="text-lg font-bold mb-2">Your First 10 Minutes</h3>
                  <p className="text-gray-400 text-sm mb-4">Get your school account up and running in record time</p>
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
                  <h3 className="text-lg font-bold mb-2">Crafting Perfect Exams</h3>
                  <p className="text-gray-400 text-sm mb-4">From concept to published exam in minutes, not hours</p>
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
                  <h3 className="text-lg font-bold mb-2">AI Question Magic</h3>
                  <p className="text-gray-400 text-sm mb-4">Turn your materials into unlimited, unique questions instantly</p>
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
                  <h3 className="text-lg font-bold mb-2">Student Management Mastery</h3>
                  <p className="text-gray-400 text-sm mb-4">Bulk upload, organize, and manage thousands of students effortlessly</p>
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
                  <h3 className="text-lg font-bold mb-2">Decoding Your Data</h3>
                  <p className="text-gray-400 text-sm mb-4">Turn results into actionable insights that improve learning outcomes</p>
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
                  <h3 className="text-lg font-bold mb-2">When Things Go Wrong</h3>
                  <p className="text-gray-400 text-sm mb-4">Quick fixes for common issues—get back on track fast</p>
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
                  Stuck? We've Got Your Back
                </h2>
                <p className="text-gray-400 text-lg">
                  Real support from real people. Available when you need us.
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
                  <p className="text-gray-400 text-sm mb-4">Get detailed help via email</p>
                  <a href="mailto:support@aicbt.com" className="text-white hover:text-gray-300 text-sm font-medium">
                    support@aicbt.com →
                  </a>
                </div>

                <div className="glass-card p-6 rounded-xl border border-white/10">
                  <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center mb-4">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold mb-2">Live Chat</h3>
                  <p className="text-gray-400 text-sm mb-4">Instant answers from our team</p>
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
                  <p className="text-gray-400 text-sm mb-4">Comprehensive guides and tutorials</p>
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
                  <p className="text-gray-400 text-sm mb-4">Speak directly with our team</p>
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
                Ready to Leave Paper Exams Behind?
              </h2>
              <p className="text-gray-400 text-lg sm:text-xl mb-8 max-w-2xl mx-auto">
                Join hundreds of forward-thinking schools across Nigeria. Stop managing exams. Start mastering them.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/schools/register"
                  className="px-8 py-4 rounded-xl bg-white text-black font-semibold text-lg hover:bg-gray-200 transition-all shadow-lg shadow-white/20"
                >
                  Start Your Transformation
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
                  <span className="text-black font-bold text-xs">AI</span>
                </div>
                <span className="text-xl font-bold">AI CBT</span>
              </div>
              <p className="text-gray-400 text-sm">
                Where intelligence meets examination. Transforming Nigerian education, one test at a time.
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
            <p>© 2024 AI CBT. All rights reserved.</p>
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
