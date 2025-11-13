"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button, Card, CardBody, CardHeader } from "@heroui/react"
import { motion } from "framer-motion"

export default function Home() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [particles, setParticles] = useState<Array<{ left: string; top: string; delay: string; duration: string }>>([])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener("mousemove", handleMouseMove)
    
    // Generate particles only on client side
    setParticles(
      Array.from({ length: 20 }, () => ({
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        delay: `${Math.random() * 5}s`,
        duration: `${3 + Math.random() * 4}s`,
      }))
    )
    
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  const testimonials = [
    {
      initials: "AO",
      name: "Dr. Adebayo Ogunleye",
      role: "Principal, Lagos State Model College",
      text: "AI CBT has completely transformed how we conduct examinations. The AI question generation saves us countless hours, and students love the instant results. Our exam efficiency has increased by 300%.",
    },
    {
      initials: "CM",
      name: "Mrs. Chioma Mbanefo",
      role: "Vice Principal, Federal Government College",
      text: "The offline capability is a game-changer for our school. Students can take exams even when the internet is unstable. The grading system is incredibly accurate—it understands context, not just keywords.",
    },
    {
      initials: "IK",
      name: "Mr. Ibrahim Kolawole",
      role: "Head of Academics, King's College",
      text: "The analytics dashboard gives us insights we never had before. We can identify learning gaps instantly and adjust our teaching strategies. Student performance has improved significantly since we started using AI CBT.",
    },
    {
      initials: "FA",
      name: "Mrs. Funke Adeyemi",
      role: "Principal, Queen's College Lagos",
      text: "Security features are outstanding. The randomization and browser locking prevent cheating effectively. Parents trust our examination process more than ever. It's been a complete game-changer.",
    },
    {
      initials: "EO",
      name: "Dr. Emeka Okonkwo",
      role: "Director, St. Gregory's College",
      text: "The bulk student upload feature saved us weeks of manual data entry. The platform is intuitive, and our teachers adapted quickly. ROI was evident within the first month of use.",
    },
    {
      initials: "BA",
      name: "Mrs. Bola Adegoke",
      role: "Principal, Methodist Boys High School",
      text: "Support team is exceptional. They respond quickly and actually understand our needs. The platform works flawlessly even with our limited bandwidth. Highly recommend to any school in Nigeria.",
    },
  ]

  const features = [
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
      title: "Question Generation That Never Sleeps",
      description: "Upload your materials once. Get infinite, unique questions forever. Our AI ensures no duplicates, just fresh challenges.",
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: "Grading That Understands Context",
      description: "Theory questions aren't multiple choice. Neither is our grading. AI-powered evaluation with customizable accuracy tolerance.",
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      ),
      title: "Built for Real-World Nigeria",
      description: "Slow internet? No problem. Power cuts? We've got you. Optimized for low-bandwidth and offline exam taking.",
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.275a1.125 1.125 0 011.291 1.975l-2.291 2.291c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
        </svg>
      ),
      title: "Fort Knox Exam Security",
      description: "Randomized questions, tab-switching prevention, webcam proctoring. Say goodbye to cheating, hello to integrity.",
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
        </svg>
      ),
      title: "Insights That Drive Success",
      description: "Powerful analytics dashboard. Identify learning gaps, track progress, and make data-driven decisions to boost performance.",
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
      ),
      title: "Seamless Student Onboarding",
      description: "Bulk upload students via CSV, generate unique access codes, and distribute them effortlessly via SMS, WhatsApp, or Email.",
    },
  ]

  const steps = [
    {
      number: "1",
      title: "Register Your School",
      description: "Quickly set up your institution, define your academic structure, and onboard administrators.",
    },
    {
      number: "2",
      title: "Create & Assign Exams",
      description: "Leverage AI to generate questions from your materials or create them manually. Assign to students effortlessly.",
    },
    {
      number: "3",
      title: "Monitor & Analyze",
      description: "Students take exams securely. Get instant, intelligent grading and powerful analytics to track performance.",
    },
  ]

  return (
    <div className="bg-black text-white relative overflow-x-hidden min-h-screen">
      {/* Enhanced animated background gradient */}
      <div 
        className="fixed inset-0 opacity-30 pointer-events-none transition-opacity duration-1000"
        style={{
          background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(255,255,255,0.15) 0%, transparent 60%)`,
        }}
      />

      {/* Enhanced grid pattern overlay */}
      <div className="fixed inset-0 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

      {/* Enhanced floating glass orbs */}
      <motion.div 
        className="fixed top-20 left-10 w-64 h-64 md:w-80 md:h-80 bg-white/8 rounded-full blur-3xl pointer-events-none"
        animate={{ 
          scale: [1, 1.1, 1],
          opacity: [0.3, 0.5, 0.3]
        }}
        transition={{ 
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div 
        className="fixed bottom-20 right-10 w-80 h-80 md:w-96 md:h-96 bg-white/8 rounded-full blur-3xl pointer-events-none"
        animate={{ 
          scale: [1, 1.15, 1],
          opacity: [0.3, 0.5, 0.3]
        }}
        transition={{ 
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
      />
      <motion.div 
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white/8 rounded-full blur-3xl pointer-events-none"
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.4, 0.2]
        }}
        transition={{ 
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2
        }}
      />

      <div className="relative z-10">
        {/* Navigation - Mobile First */}
        <nav className="w-full px-4 py-4 md:px-6 md:py-6">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-white to-gray-400 rounded-lg flex items-center justify-center">
                <span className="text-black font-bold text-xs md:text-sm">AI</span>
              </div>
              <span className="text-lg md:text-xl font-bold">AI CBT</span>
            </div>
            <div className="flex items-center gap-2 md:gap-4">
              <Button
                as={Link}
                href="/auth/login"
                variant="light"
                className="text-white bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 text-white text-xs md:text-sm px-3 md:px-4"
              >
                Login
              </Button>
              <Button
                as={Link}
                href="/schools/register"
                color="default"
                className="bg-white text-black hover:bg-gray-200 text-xs md:text-sm px-3 md:px-4 font-semibold"
              >
                Get Started
              </Button>
            </div>
          </div>
        </nav>

        {/* Hero Section - Mobile First, Centered */}
        <section className="w-full px-4 py-8 md:py-12 lg:py-20">
          <div className="max-w-4xl mx-auto text-center space-y-6 md:space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-4 md:space-y-6"
            >
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight leading-tight px-2">
                <span className="bg-gradient-to-r from-white via-gray-300 to-white bg-clip-text text-transparent">
                  Leave Paper Exam Forever
                </span>
              </h1>
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-400 max-w-2xl mx-auto leading-relaxed px-4">
                Stop wrestling with paper exams. Start revolutionizing how your students learn, test, and excel.
              </p>
            </motion.div>

            {/* CTA Buttons - Mobile First */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center items-center pt-4"
            >
              <Button
                as={Link}
                href="/schools/register"
                size="lg"
                className="w-full sm:w-auto bg-white text-black font-semibold hover:bg-gray-200 text-base md:text-lg px-6 md:px-8"
              >
                Transform Your School Today
              </Button>
              <Button
                as={Link}
                href="/auth/login"
                variant="bordered"
                className="w-full sm:w-auto border-white/20 bg-white/5 backdrop-blur-md hover:bg-white/10 text-white text-base md:text-lg px-6 md:px-8 font-semibold"
              >
                Sign In
              </Button>
            </motion.div>

            {/* Stats - Mobile First */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="grid grid-cols-3 gap-3 md:gap-6 lg:gap-8 pt-8 md:pt-12 lg:pt-16 border-t border-white/10 mt-8 md:mt-12 lg:mt-16"
            >
              <div className="text-center">
                <div className="text-2xl sm:text-3xl md:text-4xl font-black text-white mb-1 md:mb-2">
                  ₦{(parseInt(process.env.NEXT_PUBLIC_LICENSE_FEE || "300000") / 1000).toFixed(0)}K+
                </div>
                <div className="text-xs md:text-sm text-gray-400">One-time License</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl md:text-4xl font-black text-white mb-1 md:mb-2">
                  ₦{(parseInt(process.env.NEXT_PUBLIC_COST_PER_STUDENT || "3000") / 1000).toFixed(0)}K
                </div>
                <div className="text-xs md:text-sm text-gray-400">Per Student</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl md:text-4xl font-black text-white mb-1 md:mb-2">24/7</div>
                <div className="text-xs md:text-sm text-gray-400">AI Support</div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Testimonials - Mobile First */}
        <section className="w-full px-4 py-8 md:py-12 lg:py-20">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-8 md:mb-12 lg:mb-16"
            >
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black mb-3 md:mb-4 text-white">
                What Schools Are Saying
              </h2>
              <p className="text-gray-400 text-base md:text-lg lg:text-xl max-w-2xl mx-auto px-4">
                Real stories from real educators who've transformed their examination process
              </p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card className="bg-white/5 backdrop-blur-xl border border-white/10 hover:border-white/20 transition-all text-white">
                    <CardHeader className="flex items-center gap-3 pb-2 text-white">
                      <div className="w-10 h-10 md:w-12 md:h-12 bg-white/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-bold text-sm md:text-base">{testimonial.initials}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-white text-sm md:text-base truncate">{testimonial.name}</h4>
                        <p className="text-xs md:text-sm text-gray-400 truncate">{testimonial.role}</p>
                      </div>
                    </CardHeader>
                    <CardBody className="pt-0 text-white">
                      <p className="text-gray-300 text-xs md:text-sm leading-relaxed mb-3">
                        "{testimonial.text}"
                      </p>
                      <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => (
                          <svg key={i} className="w-3 h-3 md:w-4 md:h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                    </CardBody>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section - Mobile First */}
        <section className="w-full px-4 py-8 md:py-12 lg:py-20">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-8 md:mb-12 lg:mb-16"
            >
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black mb-3 md:mb-4 text-white">
                Everything You Need. Nothing You Don't.
              </h2>
              <p className="text-gray-400 text-base md:text-lg lg:text-xl max-w-2xl mx-auto px-4">
                Built for Nigerian schools. Designed for excellence. Powered by intelligence.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card className="bg-white/5 backdrop-blur-xl border border-white/10 hover:border-white/20 transition-all h-full group text-white">
                    <CardBody className="p-4 md:p-6 text-white">
                      <div className="w-12 h-12 md:w-14 md:h-14 bg-white/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-white/20 transition-all text-white">
                        {feature.icon}
                      </div>
                      <h3 className="text-lg md:text-xl font-bold mb-2 text-white">{feature.title}</h3>
                      <p className="text-gray-400 text-xs md:text-sm leading-relaxed">
                        {feature.description}
                      </p>
                    </CardBody>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works - Mobile First */}
        <section className="w-full px-4 py-8 md:py-12 lg:py-20">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-8 md:mb-12 lg:mb-16"
            >
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black mb-3 md:mb-4 text-white">
                From Zero to Hero in Three Steps
              </h2>
              <p className="text-gray-400 text-base md:text-lg lg:text-xl max-w-2xl mx-auto px-4">
                No complexity. No confusion. Just results.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 lg:gap-12">
              {steps.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  className="text-center"
                >
                  <Card className="bg-white/5 backdrop-blur-xl border border-white/10 text-white">
                    <CardBody className="p-6 md:p-8 text-white">
                      <div className="w-14 h-14 md:w-16 md:h-16 bg-white text-black rounded-full flex items-center justify-center text-xl md:text-2xl font-black mx-auto mb-4 md:mb-6">
                        {step.number}
                      </div>
                      <h3 className="text-lg md:text-xl font-bold mb-2 md:mb-3 text-white">{step.title}</h3>
                      <p className="text-gray-400 text-xs md:text-sm leading-relaxed">
                        {step.description}
                      </p>
                    </CardBody>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA - Mobile First */}
        <section className="w-full px-4 py-8 md:py-12 lg:py-20">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Card className="bg-white/10 backdrop-blur-2xl border border-white/20 text-white">
                <CardBody className="p-6 md:p-8 lg:p-12 text-center text-white">
                  <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black mb-3 md:mb-4 text-white">
                    Ready to Leave Paper Exams Behind?
                  </h2>
                  <p className="text-gray-400 text-base md:text-lg lg:text-xl mb-6 md:mb-8 max-w-2xl mx-auto">
                    Join hundreds of forward-thinking schools across Nigeria. Stop managing exams. Start mastering them.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center">
                    <Button
                      as={Link}
                      href="/schools/register"
                      size="lg"
                      className="w-full sm:w-auto bg-white text-black font-semibold hover:bg-gray-200 text-base md:text-lg px-6 md:px-8"
                    >
                      Start Your Transformation
                    </Button>
                    <Button
                      as={Link}
                      href="/auth/login"
                      variant="bordered"
                      size="lg"
                      className="w-full sm:w-auto border-white/20 bg-white/5 backdrop-blur-md hover:bg-white/10 text-white text-base md:text-lg px-6 md:px-8 font-semibold"
                    >
                      Sign In
                    </Button>
                  </div>
                </CardBody>
              </Card>
            </motion.div>
          </div>
        </section>

        {/* Footer - Mobile First */}
        <footer className="w-full px-4 py-6 md:py-8 lg:py-12 border-t border-white/10">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 mb-6 md:mb-8">
              <div className="col-span-2 md:col-span-1">
                <div className="flex items-center gap-2 mb-3 md:mb-4">
                  <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-white to-gray-400 rounded-lg flex items-center justify-center">
                    <span className="text-black font-bold text-xs">AI</span>
                  </div>
                  <span className="text-lg md:text-xl font-bold">AI CBT</span>
                </div>
                <p className="text-gray-400 text-xs md:text-sm">
                  Where intelligence meets examination. Transforming Nigerian education, one test at a time.
                </p>
              </div>

              <div>
                <h4 className="font-bold mb-3 md:mb-4 text-sm md:text-base">Product</h4>
                <ul className="space-y-2 text-xs md:text-sm text-gray-400">
                  <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                </ul>
              </div>

              <div>
                <h4 className="font-bold mb-3 md:mb-4 text-sm md:text-base">Support</h4>
                <ul className="space-y-2 text-xs md:text-sm text-gray-400">
                  <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Video Tutorials</a></li>
                </ul>
              </div>

              <div>
                <h4 className="font-bold mb-3 md:mb-4 text-sm md:text-base">Company</h4>
                <ul className="space-y-2 text-xs md:text-sm text-gray-400">
                  <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Terms</a></li>
                </ul>
              </div>
            </div>

            <div className="text-center text-xs md:text-sm text-gray-400 pt-6 md:pt-8 border-t border-white/10">
              <p>© 2024 AI CBT. All rights reserved.</p>
            </div>
          </div>
        </footer>

        {/* Floating particles effect */}
        {particles.length > 0 && (
          <div className="fixed inset-0 pointer-events-none">
            {particles.map((particle, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-white/30 rounded-full animate-float"
                style={{
                  left: particle.left,
                  top: particle.top,
                  animationDelay: particle.delay,
                  animationDuration: particle.duration,
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
