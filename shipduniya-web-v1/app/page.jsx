"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import {  Card, CardContent, CardHeader, CardTitle } from "./../components/ui/card"
import { Badge } from "./../components/ui/badge"
import { LampContainer } from "./../components/ui/lamp"
import {
  Globe,
  Truck,
  Package,
  MapPin,
  Clock,
  Shield,
  BarChart3,
  Users,
  ArrowRight,
  Zap,
  Target,
  TrendingUp,
  Star,
  CheckCircle,
  Plane,
  Ship,
  Building,
  Smartphone,
  Headphones,
  FileText,
  Settings,
  Database,
  Lock,
  Award,
  Crown,
  Gem,
  Trophy,
  Medal,
  Sparkles,
  Network,
  Cpu,
  Cloud,
  Code,
  Briefcase,
  Calendar,
  MessageSquare,
  Phone,
  ChevronRight,
  Play,
  ExternalLink,
  Download,
  Rocket,
  Lightbulb,
  PieChart,
  LineChart,
  BarChart,
  Bell,
  Bookmark,
  HelpCircle,
  Menu,
  X,
  Search,
  Mail,
  Calculator,
  CreditCard,
  LogOut,
  Activity,
  Layers,
  RefreshCw,
  Eye,
  Plus,
  ChevronDown,
  ChevronUp,
  Anchor,
} from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import { useState } from "react"
import { Button } from "./../components/ui/button"
import { useRouter } from "next/navigation"
import Logo  from "./../public/shipDuniya.png"
import Image from "next/image"
import SparklesBackground from "@/components/ui/sparkle"

gsap.registerPlugin(ScrollTrigger)

export default function LogisticsPlatform() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const heroRef = useRef(null)
  const globeRef = useRef(null)
  const featuresRef = useRef(null)
  const statsRef = useRef(null)
  const servicesRef = useRef(null)
  const processRef = useRef(null)
  const testimonialsRef = useRef(null)
  const userTiersRef = useRef(null)
  const dashboardRef = useRef(null)
  const technologyRef = useRef(null)
  const advantagesRef = useRef(null)
  const integrationRef = useRef(null)
  const securityRef = useRef(null)
  const analyticsRef = useRef(null)
  const supportRef = useRef(null)
  const resourcesRef = useRef(null)
  const partnersRef = useRef(null)
  const newsRef = useRef(null)
  const ctaRef = useRef(null)
  const router = useRouter()
  

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Enhanced hero section animations with proper sequencing
      const heroTimeline = gsap.timeline()

      heroTimeline
        .fromTo(
          ".hero-badge",
          { opacity: 0, scale: 0.8, y: 30 },
          { opacity: 1, scale: 1, y: 0, duration: 0.8, ease: "back.out(1.7)" },
        )
        .fromTo(
          ".hero-title",
          { opacity: 0, y: 80, scale: 0.95 },
          { opacity: 1, y: 0, scale: 1, duration: 1.2, ease: "power3.out" },
          "-=0.4",
        )
        .fromTo(".hero-subtitle", { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 1, ease: "power3.out" }, "-=0.8")
        .fromTo(
          ".hero-buttons",
          { opacity: 0, y: 40, scale: 0.95 },
          { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: "power3.out" },
          "-=0.5",
        )
        .fromTo(".hero-stats", { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }, "-=0.3")

      // Enhanced globe animations
      gsap.to(".globe-rotate", {
        rotation: 360,
        duration: 25,
        repeat: -1,
        ease: "none",
      })

      gsap.fromTo(
        ".globe-pulse",
        { scale: 1, opacity: 0.6 },
        { scale: 1.3, opacity: 0, duration: 2.5, repeat: -1, ease: "power2.out" },
      )

      // Enhanced floating elements with staggered timing
      gsap.to(".float-1", {
        y: -25,
        rotation: 5,
        duration: 3.5,
        repeat: -1,
        yoyo: true,
        ease: "power2.inOut",
      })

      gsap.to(".float-2", {
        y: -20,
        rotation: -3,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: "power2.inOut",
        delay: 0.5,
      })

      gsap.to(".float-3", {
        y: -30,
        rotation: 8,
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease: "power2.inOut",
        delay: 1,
      })

      gsap.to(".float-4", {
        y: -22,
        rotation: -5,
        duration: 3.2,
        repeat: -1,
        yoyo: true,
        ease: "power2.inOut",
        delay: 1.5,
      })

      // Enhanced stats section animation
      gsap.fromTo(
        ".stat-item",
        { opacity: 0, scale: 0.8, y: 60 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: statsRef.current,
            start: "top 85%",
            end: "bottom 20%",
          },
        },
      )

      // Enhanced features animation with 3D effects
      gsap.fromTo(
        ".feature-card",
        { opacity: 0, y: 100, rotationX: 15, scale: 0.9 },
        {
          opacity: 1,
          y: 0,
          rotationX: 0,
          scale: 1,
          duration: 1,
          stagger: 0.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: featuresRef.current,
            start: "top 80%",
            end: "bottom 20%",
          },
        },
      )

      // Enhanced services animation
      gsap.fromTo(
        ".service-card",
        { opacity: 0, x: -80, rotationY: -10 },
        {
          opacity: 1,
          x: 0,
          rotationY: 0,
          duration: 1,
          stagger: 0.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: servicesRef.current,
            start: "top 80%",
          },
        },
      )

      // Enhanced process animation
      gsap.fromTo(
        ".process-step",
        { opacity: 0, scale: 0.7, y: 60 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.3,
          ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: processRef.current,
            start: "top 80%",
          },
        },
      )

      // Enhanced testimonials animation
      gsap.fromTo(
        ".testimonial-card",
        { opacity: 0, y: 80, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1,
          stagger: 0.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: testimonialsRef.current,
            start: "top 80%",
          },
        },
      )

      // Enhanced user tiers animation
      gsap.fromTo(
        ".tier-card",
        { opacity: 0, y: 100, scale: 0.9 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: userTiersRef.current,
            start: "top 80%",
          },
        },
      )

      // Enhanced dashboard animation
      gsap.fromTo(
        ".dashboard-element",
        { opacity: 0, y: 50, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: dashboardRef.current,
            start: "top 80%",
          },
        },
      )

      // Enhanced technology animation
      gsap.fromTo(
        ".tech-item",
        { opacity: 0, scale: 0.8, rotation: -15 },
        {
          opacity: 1,
          scale: 1,
          rotation: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: technologyRef.current,
            start: "top 80%",
          },
        },
      )

      // Enhanced advantages animation
      gsap.fromTo(
        ".advantage-item",
        { opacity: 0, x: -60, y: 30 },
        {
          opacity: 1,
          x: 0,
          y: 0,
          duration: 1,
          stagger: 0.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: advantagesRef.current,
            start: "top 80%",
          },
        },
      )

      // Enhanced integration animation
      gsap.fromTo(
        ".integration-card",
        { opacity: 0, y: 80, scale: 0.9 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: integrationRef.current,
            start: "top 80%",
          },
        },
      )

      // Enhanced security animation
      gsap.fromTo(
        ".security-feature",
        { opacity: 0, scale: 0.8, y: 50 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: securityRef.current,
            start: "top 80%",
          },
        },
      )

      // Enhanced analytics animation
      gsap.fromTo(
        ".analytics-card",
        { opacity: 0, x: 100, rotationY: 15 },
        {
          opacity: 1,
          x: 0,
          rotationY: 0,
          duration: 1,
          stagger: 0.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: analyticsRef.current,
            start: "top 80%",
          },
        },
      )

      // Enhanced support animation
      gsap.fromTo(
        ".support-item",
        { opacity: 0, y: 60, scale: 0.9 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: supportRef.current,
            start: "top 80%",
          },
        },
      )

      // Enhanced resources animation
      gsap.fromTo(
        ".resource-card",
        { opacity: 0, y: 80, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1,
          stagger: 0.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: resourcesRef.current,
            start: "top 80%",
          },
        },
      )

      // Enhanced partners animation
      gsap.fromTo(
        ".partner-logo",
        { opacity: 0, scale: 0.8, y: 40 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: partnersRef.current,
            start: "top 80%",
          },
        },
      )

      // Enhanced news animation
      gsap.fromTo(
        ".news-card",
        { opacity: 0, y: 80, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1,
          stagger: 0.25,
          ease: "power3.out",
          scrollTrigger: {
            trigger: newsRef.current,
            start: "top 80%",
          },
        },
      )

      // Enhanced CTA animation
      gsap.fromTo(
        ".cta-content",
        { opacity: 0, y: 100, scale: 0.9 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ctaRef.current,
            start: "top 80%",
          },
        },
      )

      // Enhanced parallax effects
      gsap.to(".parallax-1", {
        yPercent: -60,
        ease: "none",
        scrollTrigger: {
          trigger: ".parallax-1",
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        },
      })

      gsap.to(".parallax-2", {
        yPercent: -40,
        ease: "none",
        scrollTrigger: {
          trigger: ".parallax-2",
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        },
      })

      // Enhanced continuous animations
      gsap.to(".continuous-float", {
        y: -15,
        duration: 2.5,
        repeat: -1,
        yoyo: true,
        ease: "power2.inOut",
        stagger: 0.5,
      })

      gsap.to(".continuous-rotate", {
        rotation: 360,
        duration: 12,
        repeat: -1,
        ease: "none",
        stagger: 3,
      })

      gsap.to(".continuous-pulse", {
        scale: 1.08,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "power2.inOut",
        stagger: 0.4,
      })

      // Enhanced hover animations for cards
      const cards = document.querySelectorAll(".hover-card")
      cards.forEach((card) => {
        card.addEventListener("mouseenter", () => {
          gsap.to(card, { scale: 1.02, duration: 0.3, ease: "power2.out" })
        })
        card.addEventListener("mouseleave", () => {
          gsap.to(card, { scale: 1, duration: 0.3, ease: "power2.out" })
        })
      })
    }, heroRef)

    return () => ctx.revert()
  }, [])

  return (
    <div className="min-h-screen bg-white relative overflow-hidden" ref={heroRef}>
      {/* Enhanced Background Grid Pattern */}
      <div className="fixed inset-0 bg-grid-pattern bg-grid opacity-20 pointer-events-none" />
      <div className="fixed inset-0 bg-gradient-to-br from-slate-50/50 to-blue-50/30 pointer-events-none" />

      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-xl border-b border-slate-200/50 z-50 shadow-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
              <Image src={Logo} alt="Logo" className="w-full mx-auto  h-14" />
              </div>


          <div className="hidden md:flex items-center space-x-8">
            <Link href="#services" className="text-slate-600 hover:text-primary transition-colors text-sm font-medium">
              Services
            </Link>
            <Link href="#features" className="text-slate-600 hover:text-primary transition-colors text-sm font-medium">
              Features
            </Link>
            <Link href="#dashboard" className="text-slate-600 hover:text-primary transition-colors text-sm font-medium">
              Dashboard
            </Link>
            <Link href="#tiers" className="text-slate-600 hover:text-primary transition-colors text-sm font-medium">
              User Tiers
            </Link>
            <Link href="#about" className="text-slate-600 hover:text-primary transition-colors text-sm font-medium">
              About
            </Link>
          </div>

          <div className="flex items-center space-x-3">
            <Link href={`/tracking`} target="_blank">
            <Button
              variant="outline"
              size="sm"
              className="hidden sm:flex bg-transparent border-slate-300 text-slate-900 hover:bg-slate-50 hover:border-primary hover:text-primary"
            >
              <Package className="w-4 h-4 mr-2" />
              Track Package
            </Button></Link>
            <Button variant="ghost" onClick={() => router.push("/login")} size="sm" className="text-slate-800 hover:text-primary hover:bg-slate-50">
              Sign In
            </Button>
            <Button onClick={() => router.push("/signup")} size="sm" className="bg-primary hover:bg-primary/90 text-white hover:text-slate-800 border-0 shadow-sm">
              Get Started
            </Button>
            <button
              className="md:hidden text-slate-600 hover:text-primary p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden bg-white/98 backdrop-blur-xl border-t border-slate-200/50"
          >
            <div className="container mx-auto px-4 py-4 space-y-4">
              <Link href="#services" className="block text-slate-600 hover:text-primary transition-colors py-2">
                Services
              </Link>
              <Link href="#features" className="block text-slate-600 hover:text-primary transition-colors py-2">
                Features
              </Link>
              <Link href="#dashboard" className="block text-slate-600 hover:text-primary transition-colors py-2">
                Dashboard
              </Link>
              <Link href="#tiers" className="block text-slate-600 hover:text-primary transition-colors py-2">
                User Tiers
              </Link>
              <Link href="#about" className="block text-slate-600 hover:text-primary transition-colors py-2">
                About
              </Link>
            </div>
          </motion.div>
        )}
      </nav>

      {/* Enhanced Hero Section with Lamp */}
      <div className="relative"
      style={{
        backgroundImage: "url('/WorldMap.svg')",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    backgroundPosition: "center",
      }}
      >
<LampContainer className="relative bg-white/90 min-w-[800px] bg-center bg-no-repeat">
  {/* Soft white overlay */}

  <motion.div
    initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay: 0.3, duration: 1, ease: "easeInOut" }}
    className="relative z-10 mt-40 md:mt-60"
  >
    <div className="text-center max-w-6xl mx-auto px-4">
      {/* Badge */}
     <Badge className="mb-8 bg-primary/10 text-slate-900 border-slate-900/20 backdrop-blur-sm text-base px-6 py-2 font-medium inline-flex items-center">
        <Truck className="w-4 h-4 mr-2" />
        One Platform. Every Route.
      </Badge>

      {/* Heading */}
      <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-slate-900 mb-8 leading-tight">
        Move Your Parcel
        <br />
        <span className="bg-gradient-to-r from-slate-600 to-gray-400 bg-clip-text text-transparent">
          Supply Chain
        </span>
      </h1>

      {/* Subtitle */}
      <p className="text-xl md:text-2xl text-slate-600 mb-10 max-w-4xl mx-auto font-light leading-relaxed">
        ShipDuniya connects you to trusted ground and ocean carriers—track, manage, and deliver your packages worldwide with full transparency and reliability.
      </p>

      {/* CTA Buttons */}
      <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-16">
        <Button
          size="lg"
          className="bg-primary hover:bg-primary/90 hover:text-slate-900 text-lg px-8 py-6 text-white font-medium shadow-lg"
          onClick={() => router.push("/signup")} 
        >
          Get Started Free 
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
       

      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20 text-center">
        {[
          { value: "10k+", label: "Shipments Tracked", color: "text-slate-800" },
          { value: "22k+", label: "Pincode Served", color: "text-slate-600" },
          { value: "99.9%", label: "Delivery Ratio", color: "text-slate-900" },
          { value: "24/7", label: "Global Support", color: "text-slate-500" },
        ].map((stat, i) => (
          <div key={i}>
            <div className={`text-3xl md:text-4xl font-bold ${stat.color} mb-2`}>
              {stat.value}
            </div>
            <div className="text-slate-500 text-sm font-medium">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Globe Visualization */}
      <div className="relative mx-auto w-80 h-80 md:w-[500px] md:h-[500px]" ref={globeRef}>
        {/* Outer Glow Pulse */}
        <div className="absolute globe-pulse   inset-0 rounded-full bg-gradient-to-r from-primary/15 to-secondary/15 animate-pulse" />

        {/* Rotating Globe */}
        <div className="relative globe-rotate w-full h-full rounded-full bg-gradient-to-br from-white via-secondary to-slate-900 shadow-2xl overflow-hidden">

          {/* Grid Lines */}
          <div className="absolute inset-0 opacity-30">
            {[...Array(16)].map((_, i) => (
              <div
                key={`horizontal-${i}`}
                className="absolute w-full border-t border-white/40"
                style={{ top: `${(i + 1) * 6.25}%` }}
              />
            ))}
            {[...Array(16)].map((_, i) => {
              const size = `${100 - i * 6.25}%`;
              return (
                <div
                  key={`vertical-${i}`}
                  className="absolute border-white/40 rounded-full"
                  style={{
                    width: size,
                    height: size,
                    top: `${i * 3.125}%`,
                    left: `${i * 3.125}%`,
                    border: "1px solid currentColor",
                  }}
                />
              );
            })}
          </div>

          {/* Continents */}
          <div className="absolute inset-0">
            {[
              "w-14 h-10 top-1/4 left-1/3 -rotate-12",
              "w-10 h-14 top-1/3 right-1/4 rotate-45",
              "w-18 h-8 bottom-1/3 left-1/4 -rotate-6",
              "w-8 h-12 bottom-1/4 right-1/3 rotate-12",
              "w-12 h-8 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-6",
            ].map((cls, i) => (
              <div key={i} className={`absolute bg-white/60 rounded-lg shadow-sm ${cls}`} />
            ))}
          </div>

          {/* Routes */}
          <div className="absolute inset-0">
            {[
              { className: "w-1/2 top-1/3 left-1/4 rotate-12", color: "via-warning" },
              { className: "w-1/3 bottom-1/3 right-1/4 -rotate-45", color: "via-success" },
              { className: "w-2/5 top-1/2 left-1/6 rotate-6", color: "via-tertiary" },
              { className: "w-1/4 bottom-1/4 left-1/2 -rotate-12", color: "via-danger" },
            ].map((route, i) => (
              <div
                key={i}
                className={`absolute h-0.5 bg-gradient-to-r from-transparent ${route.color} to-transparent animate-pulse ${route.className}`}
              />
            ))}
          </div>

          {/* Hotspots */}
          <div className="absolute inset-0">
            {[
              { top: "top-1/4", left: "left-1/3", size: "w-3 h-3", color: "warning" },
              { top: "top-1/3", right: "right-1/4", size: "w-2.5 h-2.5", color: "success" },
              { bottom: "bottom-1/3", left: "left-1/4", size: "w-4 h-4", color: "danger" },
              { bottom: "bottom-1/4", right: "right-1/3", size: "w-3 h-3", color: "tertiary" },
              { top: "top-2/3", left: "left-2/3", size: "w-2 h-2", color: "primary" },
              { top: "top-1/6", right: "right-1/3", size: "w-2.5 h-2.5", color: "secondary" },
            ].map((point, i) => (
              <div
                key={i}
                className={`absolute ${point.top || ""} ${point.bottom || ""} ${point.left || ""} ${point.right || ""} ${point.size} bg-${point.color} rounded-full animate-pulse shadow-lg shadow-${point.color}/50`}
              />
            ))}
          </div>
        </div>

        {/* Floating Icons */}
        {[
          { icon: Truck, className: "float-1 -top-8 -left-8", color: "text-primary" },
          { icon: Package, className: "float-2 -top-6 -right-10", color: "text-tertiary" },
          { icon: MapPin, className: "float-3 -bottom-8 -right-6", color: "text-success" },
          { icon: Globe, className: "float-4 -bottom-6 -left-10", color: "text-tertiary" },
        ].map((item, i) => (
          <div
            key={i}
            className={`absolute ${item.className} w-16 h-16 md:w-20 md:h-20 bg-white rounded-full shadow-xl flex items-center justify-center border border-slate-200 backdrop-blur-sm`}
          >
            <item.icon className={`w-7 h-7 md:w-8 md:h-8 ${item.color}`} />
          </div>
        ))}
      </div>
    </div>
  </motion.div>
</LampContainer></div>



      {/* Enhanced Stats Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-slate-50 to-white relative" ref={statsRef}>
        <div className="absolute inset-0 bg-dot-pattern bg-dot opacity-10"></div>
        <div className="container mx-auto relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="stat-item text-center group hover-card">
              <div className="w-20 h-20 bg-gradient-to-r from-primary to-secondary rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-primary/20">
                <Package className="w-10 h-10 text-white" />
              </div>
              <div className="text-4xl md:text-5xl font-bold text-primary mb-3">2.5M+</div>
              <div className="text-slate-600 font-medium">Packages Delivered</div>
            </div>
            <div className="stat-item text-center group hover-card">
              <div className="w-20 h-20 bg-gradient-to-r from-secondary to-tertiary rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-secondary/20">
                <Globe className="w-10 h-10 text-white" />
              </div>
              <div className="text-4xl md:text-5xl font-bold  text-tertiary mb-3">22000+</div>
              <div className="text-slate-600 font-medium">Pincodes Connected</div>
            </div>
            <div className="stat-item text-center group hover-card">
              <div className="w-20 h-20 bg-gradient-to-r from-tertiary to-success rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-tertiary/20">
                <Clock className="w-10 h-10 text-white" />
              </div>
              <div className="text-4xl md:text-5xl font-bold text-tertiary mb-3">99.9%</div>
              <div className="text-slate-600 font-medium">On-Time Delivery</div>
            </div>
            <div className="stat-item text-center group hover-card">
              <div className="w-20 h-20 bg-gradient-to-r from-success to-warning rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-success/20">
                <Headphones className="w-10 h-10 text-white" />
              </div>
              <div className="text-4xl md:text-5xl font-bold text-success mb-3">24/7</div>
              <div className="text-slate-600 font-medium">Customer Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Services Section */}
      <section className="py-20 px-4 bg-white relative" id="services" ref={servicesRef}>
        <div className="absolute inset-0 bg-gradient-to-br from-primary/3 to-secondary/3"></div>
        <div className="container mx-auto relative z-10">
          <div className="text-center mb-16">
            <Badge className="mb-6 bg-primary/10 text-primary border-primary/20 text-base px-6 py-2 font-medium">
              <Truck className="w-4 h-4 mr-2" />
              Comprehensive Services
            </Badge>
            <h2 className="text-4xl md:text-6xl font-bold mb-6 text-slate-900">
              End-to-End Logistics
              <br />
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Solutions
              </span>
            </h2>
            <p className="text-xl text-slate-600 max-w-4xl mx-auto leading-relaxed font-light">
              From first-mile pickup to last-mile delivery, we provide comprehensive logistics services that scale with
              your business needs across all industries and geographies.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="service-card group hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 border border-slate-200 bg-white hover:border-primary/30 relative overflow-hidden hover-card">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-primary/5 to-transparent rounded-bl-3xl"></div>
              <CardHeader className="pb-4">
                <div className="w-16 h-16 bg-gradient-to-r from-primary to-secondary rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-primary/20">
                  <Plane className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl font-bold text-slate-900">Air Freight Express</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 mb-6 leading-relaxed">
                  Ultra-fast air cargo services with guaranteed delivery times, real-time tracking, and
                  temperature-controlled environments for sensitive goods.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-success mr-3" />
                    <span className="text-slate-600 text-sm">Same-day & next-day delivery</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-success mr-3" />
                    <span className="text-slate-600 text-sm">Specialized cargo handling</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-success mr-3" />
                    <span className="text-slate-600 text-sm">Global network coverage</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="service-card group hover:shadow-2xl hover:shadow-secondary/10 transition-all duration-500 border border-slate-200 bg-white hover:border-secondary/30 relative overflow-hidden hover-card">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-secondary/5 to-transparent rounded-bl-3xl"></div>
              <CardHeader className="pb-4">
                <div className="w-16 h-16 bg-gradient-to-r from-secondary to-tertiary rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-secondary/20">
                  <Ship className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl font-bold text-slate-900">Ocean Freight</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 mb-6 leading-relaxed">
                  Cost-effective sea freight solutions with full container loads (FCL) and less container loads (LCL)
                  options for global trade.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-success mr-3" />
                    <span className="text-slate-600 text-sm">FCL & LCL shipping options</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-success mr-3" />
                    <span className="text-slate-600 text-sm">Port-to-port & door-to-door</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-success mr-3" />
                    <span className="text-slate-600 text-sm">Cargo insurance available</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="service-card group hover:shadow-2xl hover:shadow-tertiary/10 transition-all duration-500 border border-slate-200 bg-white hover:border-tertiary/30 relative overflow-hidden hover-card">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-tertiary/5 to-transparent rounded-bl-3xl"></div>
              <CardHeader className="pb-4">
                <div className="w-16 h-16 bg-gradient-to-r from-tertiary to-success rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-tertiary/20">
                  <Truck className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl font-bold text-slate-900">Ground Transportation</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 mb-6 leading-relaxed">
                  Flexible ground transportation with specialized vehicles, cross-border capabilities, and last-mile
                  delivery solutions.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-success mr-3" />
                    <span className="text-slate-600 text-sm">Last-mile delivery network</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-success mr-3" />
                    <span className="text-slate-600 text-sm">Cross-border transportation</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-success mr-3" />
                    <span className="text-slate-600 text-sm">Specialized vehicle fleet</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="service-card group hover:shadow-2xl hover:shadow-success/10 transition-all duration-500 border border-slate-200 bg-white hover:border-success/30 relative overflow-hidden hover-card">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-success/5 to-transparent rounded-bl-3xl"></div>
              <CardHeader className="pb-4">
                <div className="w-16 h-16 bg-gradient-to-r from-success to-warning rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-success/20">
                  <Building className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl font-bold text-slate-900">Smart Warehousing</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 mb-6 leading-relaxed">
                  Advanced warehouse management with automated systems, inventory optimization, and fulfillment services
                  powered by AI.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-success mr-3" />
                    <span className="text-slate-600 text-sm">Automated storage systems</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-success mr-3" />
                    <span className="text-slate-600 text-sm">AI-powered inventory management</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-success mr-3" />
                    <span className="text-slate-600 text-sm">Pick, pack & ship services</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="service-card group hover:shadow-2xl hover:shadow-warning/10 transition-all duration-500 border border-slate-200 bg-white hover:border-warning/30 relative overflow-hidden hover-card">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-warning/5 to-transparent rounded-bl-3xl"></div>
              <CardHeader className="pb-4">
                <div className="w-16 h-16 bg-gradient-to-r from-warning to-danger rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-warning/20">
                  <FileText className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl font-bold text-slate-900">Customs & Compliance</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 mb-6 leading-relaxed">
                  Expert customs brokerage services with automated compliance checking, duty optimization, and
                  regulatory expertise.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-success mr-3" />
                    <span className="text-slate-600 text-sm">Automated customs clearance</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-success mr-3" />
                    <span className="text-slate-600 text-sm">Duty & tax optimization</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-success mr-3" />
                    <span className="text-slate-600 text-sm">Regulatory compliance</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="service-card group hover:shadow-2xl hover:shadow-danger/10 transition-all duration-500 border border-slate-200 bg-white hover:border-danger/30 relative overflow-hidden hover-card">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-danger/5 to-transparent rounded-bl-3xl"></div>
              <CardHeader className="pb-4">
                <div className="w-16 h-16 bg-gradient-to-r from-danger to-primary rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-danger/20">
                  <Briefcase className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl font-bold text-slate-900">Supply Chain Consulting</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 mb-6 leading-relaxed">
                  Strategic consulting services to optimize your supply chain operations, reduce costs, and improve
                  efficiency through data-driven insights.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-success mr-3" />
                    <span className="text-slate-600 text-sm">Supply chain optimization</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-success mr-3" />
                    <span className="text-slate-600 text-sm">Cost reduction strategies</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-success mr-3" />
                    <span className="text-slate-600 text-sm">Risk management planning</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Enhanced Process Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-slate-50 to-white relative" ref={processRef}>
        <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-10"></div>
        <div className="container mx-auto relative z-10">
          <div className="text-center mb-16">
            <Badge className="mb-6 bg-secondary/10 text-slate-800 border-slate-800/20 text-base px-6 py-2 font-medium">
              <Settings className="w-4 h-4 mr-2" />
              Streamlined Process
            </Badge>
            <h2 className="text-4xl md:text-6xl font-bold mb-6 text-slate-900">
              How We Make Logistics
              <br />
              <span className="bg-gradient-to-r from-secondary to-tertiary bg-clip-text text-transparent">
                Simple & Efficient
              </span>
            </h2>
            <p className="text-xl text-slate-600 max-w-4xl mx-auto leading-relaxed font-light">
              Our proven 6-step process ensures seamless handling of your shipments from booking to delivery, with full
              transparency and real-time updates at every stage.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="process-step text-center group hover-card">
              <div className="relative mb-8">
                <div className="w-20 h-20 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center mx-auto text-white text-2xl font-bold shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform duration-300">
                  1
                </div>
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-warning rounded-full animate-pulse"></div>
              </div>
              <h3 className="text-xl font-bold mb-4 text-slate-900">Smart Booking</h3>
              <p className="text-slate-600 leading-relaxed">
                AI-powered booking system that automatically selects the best shipping options based on your
                requirements, budget, and delivery timeframe.
              </p>
            </div>

            <div className="process-step text-center group hover-card">
              <div className="relative mb-8">
                <div className="w-20 h-20 bg-gradient-to-r from-secondary to-tertiary rounded-full flex items-center justify-center mx-auto text-white text-2xl font-bold shadow-lg shadow-secondary/20 group-hover:scale-110 transition-transform duration-300">
                  2
                </div>
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-success rounded-full animate-pulse"></div>
              </div>
              <h3 className="text-xl font-bold mb-4 text-slate-900">Smart Pickup</h3>
              <p className="text-slate-600 leading-relaxed">
                Automated pickup scheduling with real-time driver tracking, QR code scanning, and digital proof of
                collection for complete transparency.
              </p>
            </div>

            <div className="process-step text-center group hover-card">
              <div className="relative mb-8">
                <div className="w-20 h-20 bg-gradient-to-r from-tertiary to-success rounded-full flex items-center justify-center mx-auto text-white text-2xl font-bold shadow-lg shadow-tertiary/20 group-hover:scale-110 transition-transform duration-300">
                  3
                </div>
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-tertiary rounded-full animate-pulse"></div>
              </div>
              <h3 className="text-xl font-bold mb-4 text-slate-900">Processing Hub</h3>
              <p className="text-slate-600 leading-relaxed">
                Advanced sorting facilities with automated systems, customs processing, and quality control checks to
                ensure safe and efficient handling.
              </p>
            </div>

            <div className="process-step text-center group hover-card">
              <div className="relative mb-8">
                <div className="w-20 h-20 bg-gradient-to-r from-success to-warning rounded-full flex items-center justify-center mx-auto text-white text-2xl font-bold shadow-lg shadow-success/20 group-hover:scale-110 transition-transform duration-300">
                  4
                </div>
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-danger rounded-full animate-pulse"></div>
              </div>
              <h3 className="text-xl font-bold mb-4 text-slate-900">Transit Tracking</h3>
              <p className="text-slate-600 leading-relaxed">
                Real-time GPS tracking with predictive analytics, route optimization, and proactive notifications for
                any delays or changes.
              </p>
            </div>

            <div className="process-step text-center group hover-card">
              <div className="relative mb-8">
                <div className="w-20 h-20 bg-gradient-to-r from-warning to-danger rounded-full flex items-center justify-center mx-auto text-white text-2xl font-bold shadow-lg shadow-warning/20 group-hover:scale-110 transition-transform duration-300">
                  5
                </div>
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-primary rounded-full animate-pulse"></div>
              </div>
              <h3 className="text-xl font-bold mb-4 text-slate-900">Local Delivery</h3>
              <p className="text-slate-600 leading-relaxed">
                Last-mile delivery network with flexible scheduling, secure delivery options, and real-time delivery
                windows for maximum convenience.
              </p>
            </div>

            <div className="process-step text-center group hover-card">
              <div className="relative mb-8">
                <div className="w-20 h-20 bg-gradient-to-r from-danger to-primary rounded-full flex items-center justify-center mx-auto text-white text-2xl font-bold shadow-lg shadow-danger/20 group-hover:scale-110 transition-transform duration-300">
                  6
                </div>
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-secondary rounded-full animate-pulse"></div>
              </div>
              <h3 className="text-xl font-bold mb-4 text-slate-900">Confirmation</h3>
              <p className="text-slate-600 leading-relaxed">
                Digital proof of delivery with recipient signature, photo confirmation, and automated billing with
                detailed analytics reporting.
              </p>
            </div>
          </div>
        </div>
      </section>

     <section
        className="py-20 px-4 bg-gradient-to-br from-slate-50 to-white relative"
        id="dashboard"
        ref={dashboardRef}
      >
        <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-10"></div>
        <div className="container mx-auto relative z-10">
          <div className="text-center mb-16">
            <Badge className="mb-6 bg-tertiary/10 text-tertiary border-tertiary/20 text-base px-6 py-2 font-medium">
              <BarChart3 className="w-4 h-4 mr-2" />
              Logistics Dashboard
            </Badge>
            <h2 className="text-4xl md:text-6xl font-bold mb-6 text-slate-900">
              Comprehensive
              <br />
              <span className="bg-gradient-to-r from-tertiary to-success bg-clip-text text-transparent">
                Control Center
              </span>
            </h2>
            <p className="text-xl text-slate-600 max-w-4xl mx-auto leading-relaxed font-light">
              Experience the power of our intuitive dashboard that provides complete visibility and control over your
              logistics operations with real-time insights and actionable data.
            </p>
          </div>

          <div className="grid lg:grid-cols-12 gap-8">
            {/* Sidebar Navigation */}
            <div className="dashboard-element lg:col-span-3">
              <Card className="border border-slate-200 bg-white shadow-lg hover-card">
                <CardContent className="p-0">
                  <div className="bg-white border-slate-200 border shadow  p-6 rounded-t-lg">
                    <div className="flex items-center space-x-3 mb-6">
                       <Image
                          src={Logo}
                          className="w-fit h-14 rounded-full"
                       />
                    </div>
                    <div className="text-sm text-slate-300">
                      <div className="font-medium text-black">Good afternoon! Nick</div>
                      <div className="text-xs text-slate-900">Welcome to Ship Duniya</div>
                    </div>
                  </div>

                  <nav className="p-4 space-y-2">
                    <div className="flex items-center space-x-3 p-3 bg-primary/10 text-primary rounded-lg font-medium">
                      <BarChart3 className="w-4 h-4" />
                      <span className="text-sm">Dashboard</span>
                    </div>
                    <div className="flex items-center space-x-3 p-3 text-slate-600 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer">
                      <Package className="w-4 h-4" />
                      <span className="text-sm">Orders</span>
                    </div>
                    <div className="flex items-center space-x-3 p-3 text-slate-600 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer">
                      <Truck className="w-4 h-4" />
                      <span className="text-sm">Shipments</span>
                    </div>
                    <div className="flex items-center space-x-3 p-3 text-slate-600 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer">
                      <RefreshCw className="w-4 h-4" />
                      <span className="text-sm">NDR</span>
                    </div>
                    <div className="flex items-center space-x-3 p-3 text-slate-600 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer">
                      <FileText className="w-4 h-4" />
                      <span className="text-sm">Tickets</span>
                    </div>
                    <div className="flex items-center space-x-3 p-3 text-slate-600 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer">
                      <CreditCard className="w-4 h-4" />
                      <span className="text-sm">Transactions</span>
                    </div>
                    <div className="flex items-center space-x-3 p-3 text-slate-600 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer">
                      <ArrowRight className="w-4 h-4" />
                      <span className="text-sm">Remittance</span>
                    </div>
                    <div className="flex items-center space-x-3 p-3 text-slate-600 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer">
                      <Calculator className="w-4 h-4" />
                      <span className="text-sm">Calculate</span>
                    </div>
                    <div className="flex items-center space-x-3 p-3 text-slate-600 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer">
                      <Settings className="w-4 h-4" />
                      <span className="text-sm">Settings</span>
                    </div>
                  </nav>

                  <div className="p-4 border-t border-slate-200">
                    <div className="flex items-center space-x-3 p-3 text-slate-600 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer">
                      <LogOut className="w-4 h-4" />
                      <span className="text-sm">Logout</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Dashboard Content */}
            <div className="dashboard-element lg:col-span-9">
              <div className="space-y-6">
                {/* Header with Actions */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">Dashboard Overview</h3>
                    <div className="flex items-center space-x-2 text-sm text-slate-600">
                      <Calendar className="w-4 h-4" />
                      <span>Jan 01, 2023 - Jul 03, 2025</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Button size="sm" className="bg-primary hover:bg-primary/90 hover:text-slate-700 text-white">
                      <Search className="w-4 h-4 mr-2" />
                      Track
                    </Button>
                    <Button size="sm" className="bg-primary hover:bg-secondary/90 hover:text-slate-700 text-white">
                      Balance: ₹ 244881.80
                    </Button>
                    <Button variant="outline" size="sm" className="border-slate-300 bg-transparent hover:bg-slate-50 text-slate-700">
                      All
                    </Button>
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="dashboard-element grid grid-cols-2 md:grid-cols-4 gap-6">
                  <Card className="border border-slate-200 bg-white hover:shadow-lg transition-shadow hover-card">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                          <Package className="w-5 h-5 text-primary" />
                        </div>
                        <ChevronUp className="w-4 h-4 text-success" />
                      </div>
                      <div className="text-2xl font-bold text-slate-900 mb-1">20</div>
                      <div className="text-sm text-slate-600">Total Parcels</div>
                    </CardContent>
                  </Card>

                  <Card className="border border-slate-200 bg-white hover:shadow-lg transition-shadow hover-card">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
                          <CheckCircle className="w-5 h-5 text-success" />
                        </div>
                        <ChevronUp className="w-4 h-4 text-success" />
                      </div>
                      <div className="text-2xl font-bold text-slate-900 mb-1">2</div>
                      <div className="text-sm text-slate-600">Total Delivered</div>
                    </CardContent>
                  </Card>

                  <Card className="border border-slate-200 bg-white hover:shadow-lg transition-shadow hover-card">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-10 h-10 bg-danger/10 rounded-lg flex items-center justify-center">
                          <RefreshCw className="w-5 h-5 text-danger" />
                        </div>
                        <ChevronDown className="w-4 h-4 text-danger" />
                      </div>
                      <div className="text-2xl font-bold text-slate-900 mb-1">0</div>
                      <div className="text-sm text-slate-600">Total RTO</div>
                    </CardContent>
                  </Card>

                  <Card className="border border-slate-200 bg-white hover:shadow-lg transition-shadow hover-card">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-10 h-10 bg-warning/10 rounded-lg flex items-center justify-center">
                          <Clock className="w-5 h-5 text-warning" />
                        </div>
                        <ChevronUp className="w-4 h-4 text-warning" />
                      </div>
                      <div className="text-2xl font-bold text-slate-900 mb-1">1</div>
                      <div className="text-sm text-slate-600">Total Pending Pickup</div>
                    </CardContent>
                  </Card>
                </div>

                {/* Secondary Stats */}
                <div className="dashboard-element grid grid-cols-2 gap-6">
                  <Card className="border border-slate-200 bg-white hover:shadow-lg transition-shadow hover-card">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-10 h-10 bg-tertiary/10 rounded-lg flex items-center justify-center">
                          <Activity className="w-5 h-5 text-tertiary" />
                        </div>
                        <ChevronDown className="w-4 h-4 text-slate-400" />
                      </div>
                      <div className="text-2xl font-bold text-slate-900 mb-1">0</div>
                      <div className="text-sm text-slate-600">Total In-Transit</div>
                    </CardContent>
                  </Card>

                  <Card className="border border-slate-200 bg-white hover:shadow-lg transition-shadow hover-card">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                          <X className="w-5 h-5 text-slate-500" />
                        </div>
                        <ChevronDown className="w-4 h-4 text-slate-400" />
                      </div>
                      <div className="text-2xl font-bold text-slate-900 mb-1">0</div>
                      <div className="text-sm text-slate-600">Total Lost</div>
                    </CardContent>
                  </Card>
                </div>

                {/* Analytics Chart */}
                <div className="dashboard-element">
                  <Card className="border border-slate-200 bg-white hover:shadow-lg transition-shadow hover-card">
                    <CardHeader>
                      <CardTitle className="text-lg font-semibold text-slate-900">Delivery Analytics</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="relative h-80 flex items-center justify-center">
                        {/* Pie Chart Representation */}
                        <div className="relative w-64 h-64">
                          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                            {/* Delivered - 10% (Green) */}
                            <circle
                              cx="50"
                              cy="50"
                              r="40"
                              fill="none"
                              stroke="#10b981"
                              strokeWidth="20"
                              strokeDasharray="25.13 251.3"
                              strokeDashoffset="0"
                              className="opacity-90"
                            />
                            {/* Pending Pickup - 5% (Yellow) */}
                            <circle
                              cx="50"
                              cy="50"
                              r="40"
                              fill="none"
                              stroke="#f59e0b"
                              strokeWidth="20"
                              strokeDasharray="12.57 251.3"
                              strokeDashoffset="-25.13"
                              className="opacity-90"
                            />
                            {/* Remaining - 85% (Light Gray) */}
                            <circle
                              cx="50"
                              cy="50"
                              r="40"
                              fill="none"
                              stroke="#e5e7eb"
                              strokeWidth="20"
                              strokeDasharray="213.6 251.3"
                              strokeDashoffset="-37.7"
                              className="opacity-90"
                            />
                          </svg>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-center">
                              <div className="text-2xl font-bold text-slate-900">90%</div>
                              <div className="text-sm text-slate-600">Efficiency</div>
                            </div>
                          </div>
                        </div>

                        {/* Legend */}
                        <div className="absolute bottom-4 left-4 space-y-2">
                          <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 bg-success rounded-full"></div>
                            <span className="text-sm text-slate-600">Delivered: 10%</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 bg-danger rounded-full"></div>
                            <span className="text-sm text-slate-600">RTO: 0%</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 bg-warning rounded-full"></div>
                            <span className="text-sm text-slate-600">Pending Pickup: 5%</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 bg-tertiary rounded-full"></div>
                            <span className="text-sm text-slate-600">In-Transit: 0%</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 bg-slate-400 rounded-full"></div>
                            <span className="text-sm text-slate-600">Lost: 0%</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Quick Actions */}
                <div className="dashboard-element">
                  <Card className="border border-slate-200 bg-white hover:shadow-lg transition-shadow hover-card">
                    <CardHeader>
                      <CardTitle className="text-lg font-semibold text-slate-900">Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <Button
                          variant="outline"
                          className="h-20 flex-col space-y-2 border-slate-300 hover:border-primary  bg-transparent"
                        >
                          <Plus className="w-5 h-5" />
                          <span className="text-sm">Create Shipment</span>
                        </Button>
                        <Button
                          variant="outline"
                          className="h-20 flex-col space-y-2 border-slate-300 hover:border-secondary  bg-transparent"
                        >
                          <Search className="w-5 h-5" />
                          <span className="text-sm">Track Package</span>
                        </Button>
                        <Button
                          variant="outline"
                          className="h-20 flex-col space-y-2 border-slate-300 hover:border-tertiary  bg-transparent"
                        >
                          <FileText className="w-5 h-5" />
                          <span className="text-sm">Generate Report</span>
                        </Button>
                        <Button
                          variant="outline"
                          className="h-20 flex-col space-y-2 border-slate-300 hover:border-success  bg-transparent"
                        >
                          <Headphones className="w-5 h-5" />
                          <span className="text-sm">Contact Support</span>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section> 
      {/* Enhanced Features Section */}
      <section className="py-20 px-4 bg-white relative" id="features" ref={featuresRef}>
        <div className="absolute inset-0 bg-gradient-to-br from-primary/3 to-secondary/3"></div>
        <div className="container mx-auto relative z-10">
          <div className="text-center mb-16">
            <Badge className="mb-6 bg-primary/10 text-primary border-primary/20 text-base px-6 py-2 font-medium">
              <Target className="w-4 h-4 mr-2" />
              Platform Features
            </Badge>
            <h2 className="text-4xl md:text-6xl font-bold mb-6 text-slate-900">
              Advanced Technology
              <br />
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Stack</span>
            </h2>
            <p className="text-xl text-slate-600 max-w-4xl mx-auto leading-relaxed font-light">
              Powered by cutting-edge AI and machine learning technologies to provide unparalleled visibility, control,
              and optimization of your logistics operations.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="feature-card group hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 border border-slate-200 bg-white hover:border-primary/30 relative overflow-hidden hover-card">
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-primary/5 to-transparent rounded-bl-3xl"></div>
              <CardContent className="p-8">
                <div className="w-14 h-14 bg-gradient-to-r from-primary to-secondary rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-primary/20">
                  <Package className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-slate-900">Real-time Tracking</h3>
                <p className="text-slate-600 mb-6 leading-relaxed">
                  Advanced GPS tracking with IoT sensors, predictive analytics, and automated notifications. Monitor
                  your shipments across the globe with precision accuracy.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-success mr-3" />
                    <span className="text-slate-600 text-sm">GPS + IoT sensor tracking</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-success mr-3" />
                    <span className="text-slate-600 text-sm">Predictive delivery windows</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-success mr-3" />
                    <span className="text-slate-600 text-sm">Automated alerts & notifications</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="feature-card group hover:shadow-2xl hover:shadow-secondary/10 transition-all duration-500 border border-slate-200 bg-white hover:border-secondary/30 relative overflow-hidden hover-card">
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-secondary/5 to-transparent rounded-bl-3xl"></div>
              <CardContent className="p-8">
                <div className="w-14 h-14 bg-gradient-to-r from-secondary to-tertiary rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-secondary/20">
                  <BarChart3 className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-slate-900">Advanced Analytics</h3>
                <p className="text-slate-600 mb-6 leading-relaxed">
                  Comprehensive analytics dashboard with KPI tracking, performance metrics, and actionable insights to
                  optimize your supply chain operations.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-success mr-3" />
                    <span className="text-slate-600 text-sm">Real-time performance metrics</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-success mr-3" />
                    <span className="text-slate-600 text-sm">Customizable dashboards</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-success mr-3" />
                    <span className="text-slate-600 text-sm">Automated reporting</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="feature-card group hover:shadow-2xl hover:shadow-tertiary/10 transition-all duration-500 border border-slate-200 bg-white hover:border-tertiary/30 relative overflow-hidden hover-card">
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-tertiary/5 to-transparent rounded-bl-3xl"></div>
              <CardContent className="p-8">
                <div className="w-14 h-14 bg-gradient-to-r from-tertiary to-success rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-tertiary/20">
                  <Shield className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-slate-900">Enterprise Security</h3>
                <p className="text-slate-600 mb-6 leading-relaxed">
                  Bank-level security with end-to-end encryption, multi-factor authentication, and compliance with
                  global security standards and regulations.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-success mr-3" />
                    <span className="text-slate-600 text-sm">End-to-end encryption</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-success mr-3" />
                    <span className="text-slate-600 text-sm">Multi-factor authentication</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-success mr-3" />
                    <span className="text-slate-600 text-sm">Global compliance standards</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="feature-card group hover:shadow-2xl hover:shadow-success/10 transition-all duration-500 border border-slate-200 bg-white hover:border-success/30 relative overflow-hidden hover-card">
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-success/5 to-transparent rounded-bl-3xl"></div>
              <CardContent className="p-8">
                <div className="w-14 h-14 bg-gradient-to-r from-success to-warning rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-success/20">
                  <Zap className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-slate-900">AI-Powered Optimization</h3>
                <p className="text-slate-600 mb-6 leading-relaxed">
                  Machine learning algorithms that optimize routes, predict delays, and suggest alternatives to minimize
                  costs and transit times automatically.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-success mr-3" />
                    <span className="text-slate-600 text-sm">Smart route optimization</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-success mr-3" />
                    <span className="text-slate-600 text-sm">Predictive delay detection</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-success mr-3" />
                    <span className="text-slate-600 text-sm">Cost optimization engine</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="feature-card group hover:shadow-2xl hover:shadow-warning/10 transition-all duration-500 border border-slate-200 bg-white hover:border-warning/30 relative overflow-hidden hover-card">
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-warning/5 to-transparent rounded-bl-3xl"></div>
              <CardContent className="p-8">
                <div className="w-14 h-14 bg-gradient-to-r from-warning to-danger rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-warning/20">
                  <Users className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-slate-900">Team Collaboration</h3>
                <p className="text-slate-600 mb-6 leading-relaxed">
                  Seamless collaboration tools with role-based access control, real-time notifications, and integrated
                  communication channels for your team.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-success mr-3" />
                    <span className="text-slate-600 text-sm">Role-based access control</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-success mr-3" />
                    <span className="text-slate-600 text-sm">Real-time notifications</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-success mr-3" />
                    <span className="text-slate-600 text-sm">Integrated communication</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="feature-card group hover:shadow-2xl hover:shadow-danger/10 transition-all duration-500 border border-slate-200 bg-white hover:border-danger/30 relative overflow-hidden hover-card">
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-danger/5 to-transparent rounded-bl-3xl"></div>
              <CardContent className="p-8">
                <div className="w-14 h-14 bg-gradient-to-r from-danger to-primary rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-danger/20">
                  <TrendingUp className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-slate-900">Predictive Analytics</h3>
                <p className="text-slate-600 mb-6 leading-relaxed">
                  Advanced forecasting capabilities to predict demand patterns, optimize inventory levels, and prevent
                  supply chain disruptions before they occur.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-success mr-3" />
                    <span className="text-slate-600 text-sm">Demand forecasting</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-success mr-3" />
                    <span className="text-slate-600 text-sm">Inventory optimization</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-success mr-3" />
                    <span className="text-slate-600 text-sm">Risk assessment</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

     {/* User Tiers Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-slate-50 to-white relative" id="tiers" ref={userTiersRef}>
        <div className="absolute inset-0 bg-dot-pattern bg-dot opacity-10"></div>
        <div className="container mx-auto relative z-10">
          <div className="text-center mb-16">
            <Badge className="mb-6 bg-primary/10 text-primary border-primary/20 text-base px-6 py-2 font-medium">
              <Crown className="w-4 h-4 mr-2" />
              User Tiers
            </Badge>
            <h2 className="text-4xl md:text-6xl font-bold mb-6 text-slate-900">
              Choose Your Tier
              <br />
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Scale as You Grow
              </span>
            </h2>
            <p className="text-xl text-slate-600 max-w-4xl mx-auto leading-relaxed font-light">
              Flexible tier system designed to grow with your business needs, from small enterprises to global
              corporations with custom requirements.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            <Card className="tier-card border-2 border-amber-200 hover:border-amber-300 transition-all duration-300 bg-white relative overflow-hidden hover-card">
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-amber-50 to-transparent rounded-bl-3xl"></div>
              <CardHeader className="text-center pb-8">
                <div className="w-16 h-16 bg-gradient-to-r from-amber-400 to-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-amber-400/20">
                  <Medal className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl font-bold text-slate-900">Bronze</CardTitle>
                <div className="text-3xl font-bold text-slate-900 mt-4">
                </div>
                <p className="text-slate-600 mt-2 text-sm">Perfect for small businesses</p>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-success mr-3" />
                  <span className="text-slate-600 text-sm">Up to 500 shipments/month</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-success mr-3" />
                  <span className="text-slate-600 text-sm">Real-time tracking</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-success mr-3" />
                  <span className="text-slate-600 text-sm">Basic analytics dashboard</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-success mr-3" />
                  <span className="text-slate-600 text-sm">Email support</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-success mr-3" />
                  <span className="text-slate-600 text-sm">Mobile app access</span>
                </div>
                <Button className="w-full mt-6 bg-gradient-to-r from-amber-400 to-amber-600 hover:from-amber-500 hover:to-amber-700 border-0 text-white">
                  Start Bronze Tier
                </Button>
              </CardContent>
            </Card>

            <Card className="tier-card border-2 border-gray-300 hover:border-gray-400 transition-all duration-300 bg-white relative overflow-hidden hover-card">
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-gray-50 to-transparent rounded-bl-3xl"></div>
              <CardHeader className="text-center pb-8">
                <div className="w-16 h-16 bg-gradient-to-r from-gray-400 to-gray-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-gray-400/20">
                  <Award className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl font-bold text-slate-900">Silver</CardTitle>
                <div className="text-3xl font-bold text-slate-900 mt-4">
                </div>
                <p className="text-slate-600 mt-2 text-sm">Great for growing companies</p>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-success mr-3" />
                  <span className="text-slate-600 text-sm">Up to 2,000 shipments/month</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-success mr-3" />
                  <span className="text-slate-600 text-sm">Advanced tracking & analytics</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-success mr-3" />
                  <span className="text-slate-600 text-sm">AI-powered route optimization</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-success mr-3" />
                  <span className="text-slate-600 text-sm">Priority support</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-success mr-3" />
                  <span className="text-slate-600 text-sm">Team collaboration tools</span>
                </div>
                <Button className="w-full mt-6 bg-gradient-to-r from-gray-400 to-gray-600 hover:from-gray-500 hover:to-gray-700 border-0 text-white">
                  Start Silver Tier
                </Button>
              </CardContent>
            </Card>

            <Card className="tier-card border-2 border-yellow-300 hover:border-yellow-400 transition-all duration-300 bg-white relative overflow-hidden transform scale-105 hover-card">
              <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white text-center py-2 text-xs font-semibold">
                Most Popular
              </div>
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-yellow-50 to-transparent rounded-bl-3xl"></div>
              <CardHeader className="text-center pb-8 pt-12">
                <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-yellow-400/20">
                  <Trophy className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl font-bold text-slate-900">Platinum</CardTitle>
                <div className="text-3xl font-bold text-slate-900 mt-4">
                </div>
                <p className="text-slate-600 mt-2 text-sm">Ideal for established businesses</p>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-success mr-3" />
                  <span className="text-slate-600 text-sm">Up to 10,000 shipments/month</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-success mr-3" />
                  <span className="text-slate-600 text-sm">Full platform access</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-success mr-3" />
                  <span className="text-slate-600 text-sm">Predictive analytics</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-success mr-3" />
                  <span className="text-slate-600 text-sm">24/7 phone support</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-success mr-3" />
                  <span className="text-slate-600 text-sm">Custom integrations</span>
                </div>
                <Button className="w-full mt-6 bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 border-0 text-white">
                  Start Platinum Tier
                </Button>
              </CardContent>
            </Card>

            <Card className="tier-card border-2 border-yellow-400 hover:border-yellow-500 transition-all duration-300 bg-white relative overflow-hidden hover-card">
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-yellow-100 to-transparent rounded-bl-3xl"></div>
              <CardHeader className="text-center pb-8">
                <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-yellow-700 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-yellow-500/20">
                  <Crown className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl font-bold text-slate-900">Gold</CardTitle>
                <div className="text-3xl font-bold text-slate-900 mt-4">
                </div>
                <p className="text-slate-600 mt-2 text-sm">For large enterprises</p>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-success mr-3" />
                  <span className="text-slate-600 text-sm">Up to 50,000 shipments/month</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-success mr-3" />
                  <span className="text-slate-600 text-sm">Enterprise-grade features</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-success mr-3" />
                  <span className="text-slate-600 text-sm">Advanced AI & ML capabilities</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-success mr-3" />
                  <span className="text-slate-600 text-sm">Dedicated account manager</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-success mr-3" />
                  <span className="text-slate-600 text-sm">Priority development queue</span>
                </div>
                <Button className="w-full mt-6 bg-gradient-to-r from-yellow-500 to-yellow-700 hover:from-yellow-600 hover:to-yellow-800 border-0 text-white">
                  Start Gold Tier
                </Button>
              </CardContent>
            </Card>

            <Card className="tier-card border-2 border-blue-300 hover:border-blue-400 transition-all duration-300 bg-white relative overflow-hidden hover-card">
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-50 to-transparent rounded-bl-3xl"></div>
              <CardHeader className="text-center pb-8">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-700 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/20">
                  <Gem className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl font-bold text-slate-900">Diamond</CardTitle>
                <div className="text-3xl font-bold text-slate-900 mt-4">
                </div>
                <p className="text-slate-600 mt-2 text-sm">For global corporations</p>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-success mr-3" />
                  <span className="text-slate-600 text-sm">Unlimited shipments</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-success mr-3" />
                  <span className="text-slate-600 text-sm">Full white-label solution</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-success mr-3" />
                  <span className="text-slate-600 text-sm">Custom AI model training</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-success mr-3" />
                  <span className="text-slate-600 text-sm">Dedicated infrastructure</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-success mr-3" />
                  <span className="text-slate-600 text-sm">Global support team</span>
                </div>
                <Button className="w-full mt-6 bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 border-0 text-white">
                  Start Diamond Tier
                </Button>
              </CardContent>
            </Card>

            <Card className="tier-card border-2 border-purple-300 hover:border-purple-400 transition-all duration-300 bg-white relative overflow-hidden hover-card">
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-purple-50 to-transparent rounded-bl-3xl"></div>
              <CardHeader className="text-center pb-8">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-700 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-purple-500/20">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl font-bold text-slate-900">Custom</CardTitle>
                <div className="text-3xl font-bold text-slate-900 mt-4">
                  Let's Talk<span className="text-base text-slate-600 font-normal"> pricing</span>
                </div>
                <p className="text-slate-600 mt-2 text-sm">Tailored to your needs</p>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-success mr-3" />
                  <span className="text-slate-600 text-sm">Fully customized solution</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-success mr-3" />
                  <span className="text-slate-600 text-sm">Bespoke integrations</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-success mr-3" />
                  <span className="text-slate-600 text-sm">On-premise deployment</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-success mr-3" />
                  <span className="text-slate-600 text-sm">Dedicated development team</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-success mr-3" />
                  <span className="text-slate-600 text-sm">24/7 dedicated support</span>
                </div>
                <Button className="w-full mt-6 bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800 border-0 text-white">
                  Contact Sales
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      

      {/* Enhanced Testimonials Section */}
      <section className="py-20 px-4 bg-white relative" ref={testimonialsRef}>
        <div className="absolute inset-0 bg-gradient-to-br from-primary/3 to-secondary/3"></div>
        <div className="container mx-auto relative z-10">
          <div className="text-center mb-16">
            <Badge className="mb-6 bg-success/10 text-success border-success/20 text-base px-6 py-2 font-medium">
              <Star className="w-4 h-4 mr-2" />
              Customer Success Stories
            </Badge>
            <h2 className="text-4xl md:text-6xl font-bold mb-6 text-slate-900">
              Trusted by Industry
              <br />
              <span className="bg-gradient-to-r from-success to-tertiary bg-clip-text text-transparent">
                Leaders Worldwide
              </span>
            </h2>
            <p className="text-xl text-slate-600 max-w-4xl mx-auto leading-relaxed font-light">
              See how companies across different industries are transforming their logistics operations and achieving
              remarkable results with our platform.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="testimonial-card border border-slate-200 bg-white shadow-lg hover:shadow-xl hover:shadow-primary/10 transition-all duration-500 hover-card">
              <CardContent className="p-8">
                <div className="flex items-center mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-warning fill-current" />
                  ))}
                </div>
                <p className="text-slate-600 mb-6 leading-relaxed italic">
                  "Shipduniya has completely revolutionized our supply chain operations. The AI-powered optimization
                  reduced our shipping costs by 35% while improving delivery times by 40%. The real-time tracking gives
                  us unprecedented visibility."
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center text-white font-bold mr-4">
                    JS
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">John Smith</div>
                    <div className="text-slate-600 text-sm">Supply Chain Director</div>
                    <div className="text-primary font-medium text-sm">TechCorp Industries</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="testimonial-card border border-slate-200 bg-white shadow-lg hover:shadow-xl hover:shadow-secondary/10 transition-all duration-500 hover-card">
              <CardContent className="p-8">
                <div className="flex items-center mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-warning fill-current" />
                  ))}
                </div>
                <p className="text-slate-600 mb-6 leading-relaxed italic">
                  "The platform's predictive analytics helped us avoid major disruptions during peak season. We've seen
                  a 50% reduction in delayed shipments and the customer support team is absolutely outstanding.
                  Game-changer for our business."
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-secondary to-tertiary rounded-full flex items-center justify-center text-white font-bold mr-4">
                    MJ
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">Maria Johnson</div>
                    <div className="text-slate-600 text-sm">Logistics Manager</div>
                    <div className="text-secondary font-medium text-sm">GlobalTrade Solutions</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="testimonial-card border border-slate-200 bg-white shadow-lg hover:shadow-xl hover:shadow-tertiary/10 transition-all duration-500 hover-card">
              <CardContent className="p-8">
                <div className="flex items-center mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-warning fill-current" />
                  ))}
                </div>
                <p className="text-slate-600 mb-6 leading-relaxed italic">
                  "Seamless integration with our existing ERP system and excellent ROI within the first quarter. The
                  team collaboration features have streamlined our operations across 15 global locations. Highly
                  recommend!"
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-tertiary to-success rounded-full flex items-center justify-center text-white font-bold mr-4">
                    DL
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">David Lee</div>
                    <div className="text-slate-600 text-sm">Operations VP</div>
                    <div className="text-tertiary font-medium text-sm">MegaShip Logistics</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Technology Stack Section */}
      <section className="py-20 px-4 bg-white relative" ref={technologyRef}>
        <div className="absolute inset-0 bg-gradient-to-br from-primary/3 to-secondary/3"></div>
        <div className="container mx-auto relative z-10">
          <div className="text-center mb-16">
            <Badge className="mb-6 bg-secondary/10 text-slate-600 border-slate-700/20 text-base px-6 py-2 font-medium">
              <Database className="w-4 h-4 mr-2" />
              Technology Stack
            </Badge>
            <h2 className="text-4xl md:text-6xl font-bold mb-6 text-slate-900">
              Built on Modern
              <br />
              <span className="bg-gradient-to-r from-secondary to-tertiary bg-clip-text text-transparent">
                Infrastructure
              </span>
            </h2>
            <p className="text-xl text-slate-600 max-w-4xl mx-auto leading-relaxed font-light">
              Our platform leverages cutting-edge technologies to ensure reliability, scalability, and security for your
              mission-critical logistics operations.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="tech-item text-center group hover-card">
              <div className="w-20 h-20 bg-gradient-to-r from-primary to-secondary rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-primary/20">
                <Cloud className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-lg font-bold mb-3 text-slate-900">Cloud-Native</h3>
              <p className="text-slate-600 leading-relaxed text-sm">
                Scalable microservices architecture with auto-scaling capabilities and global CDN distribution.
              </p>
            </div>

            <div className="tech-item text-center group hover-card">
              <div className="w-20 h-20 bg-gradient-to-r from-secondary to-tertiary rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-secondary/20">
                <Cpu className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-lg font-bold mb-3 text-slate-900">AI & Machine Learning</h3>
              <p className="text-slate-600 leading-relaxed text-sm">
                Advanced ML models for predictive analytics, route optimization, and intelligent decision making.
              </p>
            </div>

            <div className="tech-item text-center group hover-card">
              <div className="w-20 h-20 bg-gradient-to-r from-tertiary to-success rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-tertiary/20">
                <Network className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-lg font-bold mb-3 text-slate-900">IoT Integration</h3>
              <p className="text-slate-600 leading-relaxed text-sm">
                Real-time sensor data collection with edge computing for instant insights and monitoring.
              </p>
            </div>

            <div className="tech-item text-center group hover-card">
              <div className="w-20 h-20 bg-gradient-to-r from-success to-warning rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-success/20">
                <Code className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-lg font-bold mb-3 text-slate-900">API-First Design</h3>
              <p className="text-slate-600 leading-relaxed text-sm">
                RESTful APIs with GraphQL support for seamless integration with existing systems and workflows.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Competitive Advantages Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-slate-50 to-white relative" ref={advantagesRef}>
        <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-10"></div>
        <div className="container mx-auto relative z-10">
          <div className="text-center mb-16">
            <Badge className="mb-6 bg-tertiary/10 text-tertiary border-tertiary/20 text-base px-6 py-2 font-medium">
              <Target className="w-4 h-4 mr-2" />
              Competitive Advantages
            </Badge>
            <h2 className="text-4xl md:text-6xl font-bold mb-6 text-slate-900">
              Why Choose
              <br />
              <span className="bg-gradient-to-r from-tertiary to-success bg-clip-text text-transparent">Shipduniya</span>
            </h2>
            <p className="text-xl text-slate-600 max-w-4xl mx-auto leading-relaxed font-light">
              Discover the key differentiators that make Shipduniya the preferred choice for logistics professionals
              worldwide.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-8">
              <div className="advantage-item flex items-start space-x-4 group hover-card p-6 rounded-xl hover:bg-white hover:shadow-lg transition-all duration-300">
                <div className="w-12 h-12 bg-gradient-to-r from-primary to-secondary rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-primary/20">
                  <Lightbulb className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-2 text-slate-900">Innovation Leadership</h3>
                  <p className="text-slate-600 leading-relaxed">
                    First-to-market with AI-powered logistics optimization, setting industry standards for intelligent
                    supply chain management.
                  </p>
                </div>
              </div>

              <div className="advantage-item flex items-start space-x-4 group hover-card p-6 rounded-xl hover:bg-white hover:shadow-lg transition-all duration-300">
                <div className="w-12 h-12 bg-gradient-to-r from-secondary to-tertiary rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-secondary/20">
                  <Rocket className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-2 text-slate-900">Rapid Implementation</h3>
                  <p className="text-slate-600 leading-relaxed">
                    Get up and running in under 24 hours with our streamlined onboarding process and expert support
                    team.
                  </p>
                </div>
              </div>

              <div className="advantage-item flex items-start space-x-4 group hover-card p-6 rounded-xl hover:bg-white hover:shadow-lg transition-all duration-300">
                <div className="w-12 h-12 bg-gradient-to-r from-tertiary to-success rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-tertiary/20">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-2 text-slate-900">Enterprise Security</h3>
                  <p className="text-slate-600 leading-relaxed">
                    Bank-level security with SOC 2 Type II compliance, ensuring your data is protected at all times.
                  </p>
                </div>
              </div>

              <div className="advantage-item flex items-start space-x-4 group hover-card p-6 rounded-xl hover:bg-white hover:shadow-lg transition-all duration-300">
                <div className="w-12 h-12 bg-gradient-to-r from-success to-warning rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-success/20">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-2 text-slate-900">Proven ROI</h3>
                  <p className="text-slate-600 leading-relaxed">
                    Average 35% cost reduction and 40% efficiency improvement within the first quarter of
                    implementation.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div className="advantage-item flex items-start space-x-4 group hover-card p-6 rounded-xl hover:bg-white hover:shadow-lg transition-all duration-300">
                <div className="w-12 h-12 bg-gradient-to-r from-warning to-danger rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-warning/20">
                  <Globe className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-2 text-slate-900">Global Network</h3>
                  <p className="text-slate-600 leading-relaxed">
                    Extensive partner network spanning 180+ countries with local expertise and global reach.
                  </p>
                </div>
              </div>

              <div className="advantage-item flex items-start space-x-4 group hover-card p-6 rounded-xl hover:bg-white hover:shadow-lg transition-all duration-300">
                <div className="w-12 h-12 bg-gradient-to-r from-danger to-primary rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-danger/20">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-2 text-slate-900">Expert Support</h3>
                  <p className="text-slate-600 leading-relaxed">
                    Dedicated logistics experts available 24/7 to help optimize your operations and solve challenges.
                  </p>
                </div>
              </div>

              <div className="advantage-item flex items-start space-x-4 group hover-card p-6 rounded-xl hover:bg-white hover:shadow-lg transition-all duration-300">
                <div className="w-12 h-12 bg-gradient-to-r from-primary to-secondary rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-primary/20">
                  <Layers className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-2 text-slate-900">Seamless Integration</h3>
                  <p className="text-slate-600 leading-relaxed">
                    Connect with 500+ existing systems including ERP, WMS, and e-commerce platforms out of the box.
                  </p>
                </div>
              </div>

              <div className="advantage-item flex items-start space-x-4 group hover-card p-6 rounded-xl hover:bg-white hover:shadow-lg transition-all duration-300">
                <div className="w-12 h-12 bg-gradient-to-r from-secondary to-tertiary rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-secondary/20">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-2 text-slate-900">Continuous Innovation</h3>
                  <p className="text-slate-600 leading-relaxed">
                    Regular feature updates and improvements based on customer feedback and industry trends.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Integration Section */}
      <section className="py-20 px-4 bg-white relative" ref={integrationRef}>
        <div className="absolute inset-0 bg-gradient-to-br from-primary/3 to-secondary/3"></div>
        <div className="container mx-auto relative z-10">
          <div className="text-center mb-16">
            <Badge className="mb-6 bg-success/10 text-success border-success/20 text-base px-6 py-2 font-medium">
              <Network className="w-4 h-4 mr-2" />
              Integrations
            </Badge>
            <h2 className="text-4xl md:text-6xl font-bold mb-6 text-slate-900">
              Connect Everything
              <br />
              <span className="bg-gradient-to-r from-success to-tertiary bg-clip-text text-transparent">
                Seamlessly
              </span>
            </h2>
            <p className="text-xl text-slate-600 max-w-4xl mx-auto leading-relaxed font-light">
              Integrate with your existing tools and systems to create a unified logistics ecosystem that works the way
              you do.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="integration-card border border-slate-200 bg-white hover:shadow-xl hover:shadow-primary/10 transition-all duration-500 hover:border-primary/30 hover-card">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-primary to-secondary rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-primary/20">
                  <Database className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-bold mb-4 text-slate-900">ERP Systems</h3>
                <p className="text-slate-600 mb-6 leading-relaxed text-sm">
                  SAP, Oracle, Microsoft Dynamics, NetSuite, and other enterprise resource planning systems.
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                  <Badge variant="outline" className="text-xs">
                    SAP
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    Oracle
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    Dynamics
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="integration-card border border-slate-200 bg-white hover:shadow-xl hover:shadow-secondary/10 transition-all duration-500 hover:border-secondary/30 hover-card">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-secondary to-tertiary rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-secondary/20">
                  <Smartphone className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-bold mb-4 text-slate-900">E-commerce Platforms</h3>
                <p className="text-slate-600 mb-6 leading-relaxed text-sm">
                  Shopify, WooCommerce, Magento, Amazon, eBay, and other online marketplace integrations.
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                  <Badge variant="outline" className="text-xs">
                    Shopify
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    Amazon
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    Magento
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="integration-card border border-slate-200 bg-white hover:shadow-xl hover:shadow-tertiary/10 transition-all duration-500 hover:border-tertiary/30 hover-card">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-tertiary to-success rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-tertiary/20">
                  <Building className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-bold mb-4 text-slate-900">Warehouse Management</h3>
                <p className="text-slate-600 mb-6 leading-relaxed text-sm">
                  Manhattan WMS, HighJump, Blue Yonder, and other warehouse management system integrations.
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                  <Badge variant="outline" className="text-xs">
                    Manhattan
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    HighJump
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    Blue Yonder
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="integration-card border border-slate-200 bg-white hover:shadow-xl hover:shadow-success/10 transition-all duration-500 hover:border-success/30 hover-card">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-success to-warning rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-success/20">
                  <BarChart3 className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-bold mb-4 text-slate-900">Analytics Platforms</h3>
                <p className="text-slate-600 mb-6 leading-relaxed text-sm">
                  Tableau, Power BI, Google Analytics, and other business intelligence and analytics tools.
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                  <Badge variant="outline" className="text-xs">
                    Tableau
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    Power BI
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    Analytics
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="integration-card border border-slate-200 bg-white hover:shadow-xl hover:shadow-warning/10 transition-all duration-500 hover:border-warning/30 hover-card">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-warning to-danger rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-warning/20">
                  <MessageSquare className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-bold mb-4 text-slate-900">Communication Tools</h3>
                <p className="text-slate-600 mb-6 leading-relaxed text-sm">
                  Slack, Microsoft Teams, Discord, and other team communication and collaboration platforms.
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                  <Badge variant="outline" className="text-xs">
                    Slack
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    Teams
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    Discord
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="integration-card border border-slate-200 bg-white hover:shadow-xl hover:shadow-danger/10 transition-all duration-500 hover:border-danger/30 hover-card">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-danger to-primary rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-danger/20">
                  <CreditCard className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-bold mb-4 text-slate-900">Payment Gateways</h3>
                <p className="text-slate-600 mb-6 leading-relaxed text-sm">
                  Stripe, PayPal, Square, and other payment processing and financial management integrations.
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                  <Badge variant="outline" className="text-xs">
                    Stripe
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    PayPal
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    Square
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-slate-50 to-white relative" ref={securityRef}>
        <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-10"></div>
        <div className="container mx-auto relative z-10">
          <div className="text-center mb-16">
            <Badge className="mb-6 bg-danger/10 text-danger border-danger/20 text-base px-6 py-2 font-medium">
              <Lock className="w-4 h-4 mr-2" />
              Security & Compliance
            </Badge>
            <h2 className="text-4xl md:text-6xl font-bold mb-6 text-slate-900">
              Enterprise-Grade
              <br />
              <span className="bg-gradient-to-r from-danger to-primary bg-clip-text text-transparent">Security</span>
            </h2>
            <p className="text-xl text-slate-600 max-w-4xl mx-auto leading-relaxed font-light">
              Your data security is our top priority. We implement industry-leading security measures and maintain
              compliance with global standards.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="security-feature text-center group hover-card">
              <div className="w-20 h-20 bg-gradient-to-r from-danger to-primary rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-danger/20">
                <Lock className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-lg font-bold mb-4 text-slate-900">End-to-End Encryption</h3>
              <p className="text-slate-600 leading-relaxed text-sm">
                AES-256 encryption for data at rest and TLS 1.3 for data in transit, ensuring complete data protection.
              </p>
            </div>

            <div className="security-feature text-center group hover-card">
              <div className="w-20 h-20 bg-gradient-to-r from-primary to-secondary rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-primary/20">
                <Shield className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-lg font-bold mb-4 text-slate-900">SOC 2 Type II</h3>
              <p className="text-slate-600 leading-relaxed text-sm">
                Certified compliance with SOC 2 Type II standards for security, availability, and confidentiality.
              </p>
            </div>

            <div className="security-feature text-center group hover-card">
              <div className="w-20 h-20 bg-gradient-to-r from-secondary to-tertiary rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-secondary/20">
                <Eye className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-lg font-bold mb-4 text-slate-900">24/7 Monitoring</h3>
              <p className="text-slate-600 leading-relaxed text-sm">
                Continuous security monitoring with real-time threat detection and automated incident response.
              </p>
            </div>

            <div className="security-feature text-center group hover-card">
              <div className="w-20 h-20 bg-gradient-to-r from-tertiary to-success rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-tertiary/20">
                <Users className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-lg font-bold mb-4 text-slate-900">Access Control</h3>
              <p className="text-slate-600 leading-relaxed text-sm">
                Role-based access control with multi-factor authentication and single sign-on (SSO) support.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Analytics Section */}
      <section className="py-20 px-4 bg-white relative" ref={analyticsRef}>
        <div className="absolute inset-0 bg-gradient-to-br from-primary/3 to-secondary/3"></div>
        <div className="container mx-auto relative z-10">
          <div className="text-center mb-16">
            <Badge className="mb-6 bg-primary/10 text-primary border-primary/20 text-base px-6 py-2 font-medium">
              <BarChart3 className="w-4 h-4 mr-2" />
              Advanced Analytics
            </Badge>
            <h2 className="text-4xl md:text-6xl font-bold mb-6 text-slate-900">
              Data-Driven
              <br />
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Insights</span>
            </h2>
            <p className="text-xl text-slate-600 max-w-4xl mx-auto leading-relaxed font-light">
              Transform your logistics data into actionable insights with our comprehensive analytics suite and
              AI-powered recommendations.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="analytics-card border border-slate-200 bg-white hover:shadow-xl hover:shadow-primary/10 transition-all duration-500 hover:border-primary/30 hover-card">
              <CardContent className="p-8">
                <div className="w-14 h-14 bg-gradient-to-r from-primary to-secondary rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-primary/20">
                  <PieChart className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-slate-900">Performance Dashboards</h3>
                <p className="text-slate-600 mb-6 leading-relaxed">
                  Real-time KPI tracking with customizable dashboards, automated alerts, and executive reporting for
                  complete visibility.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-success mr-3" />
                    <span className="text-slate-600 text-sm">Real-time KPI monitoring</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-success mr-3" />
                    <span className="text-slate-600 text-sm">Custom dashboard builder</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="analytics-card border border-slate-200 bg-white hover:shadow-xl hover:shadow-secondary/10 transition-all duration-500 hover:border-secondary/30 hover-card">
              <CardContent className="p-8">
                <div className="w-14 h-14 bg-gradient-to-r from-secondary to-tertiary rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-secondary/20">
                  <LineChart className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-slate-900">Predictive Analytics</h3>
                <p className="text-slate-600 mb-6 leading-relaxed">
                  Machine learning models that predict demand patterns, identify potential delays, and optimize resource
                  allocation automatically.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-success mr-3" />
                    <span className="text-slate-600 text-sm">Demand forecasting</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-success mr-3" />
                    <span className="text-slate-600 text-sm">Risk prediction models</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="analytics-card border border-slate-200 bg-white hover:shadow-xl hover:shadow-tertiary/10 transition-all duration-500 hover:border-tertiary/30 hover-card">
              <CardContent className="p-8">
                <div className="w-14 h-14 bg-gradient-to-r from-tertiary to-success rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-tertiary/20">
                  <BarChart className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-slate-900">Cost Optimization</h3>
                <p className="text-slate-600 mb-6 leading-relaxed">
                  Advanced cost analysis tools that identify savings opportunities, optimize carrier selection, and
                  reduce operational expenses.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-success mr-3" />
                    <span className="text-slate-600 text-sm">Cost breakdown analysis</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-success mr-3" />
                    <span className="text-slate-600 text-sm">Carrier rate optimization</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Support Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-slate-50 to-white relative" ref={supportRef}>
        <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-10"></div>
        <div className="container mx-auto relative z-10">
          <div className="text-center mb-16">
            <Badge className="mb-6 bg-success/10 text-success border-success/20 text-base px-6 py-2 font-medium">
              <Headphones className="w-4 h-4 mr-2" />
              Customer Support
            </Badge>
            <h2 className="text-4xl md:text-6xl font-bold mb-6 text-slate-900">
              World-Class
              <br />
              <span className="bg-gradient-to-r from-success to-tertiary bg-clip-text text-transparent">Support</span>
            </h2>
            <p className="text-xl text-slate-600 max-w-4xl mx-auto leading-relaxed font-light">
              Our dedicated support team is available 24/7 to ensure your logistics operations run smoothly without any
              interruptions.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="support-item text-center group hover-card">
              <div className="w-20 h-20 bg-gradient-to-r from-success to-tertiary rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-success/20">
                <Phone className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-lg font-bold mb-4 text-slate-900">24/7 Phone Support</h3>
              <p className="text-slate-600 leading-relaxed text-sm">
                Direct phone access to logistics experts available around the clock for urgent issues and consultations.
              </p>
            </div>

            <div className="support-item text-center group hover-card">
              <div className="w-20 h-20 bg-gradient-to-r from-tertiary to-primary rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-tertiary/20">
                <MessageSquare className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-lg font-bold mb-4 text-slate-900">Live Chat</h3>
              <p className="text-slate-600 leading-relaxed text-sm">
                Instant chat support with real-time assistance for quick questions and technical troubleshooting.
              </p>
            </div>

            <div className="support-item text-center group hover-card">
              <div className="w-20 h-20 bg-gradient-to-r from-primary to-secondary rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-primary/20">
                <Users className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-lg font-bold mb-4 text-slate-900">Dedicated Account Manager</h3>
              <p className="text-slate-600 leading-relaxed text-sm">
                Personal account manager for enterprise clients to ensure optimal platform utilization and success.
              </p>
            </div>

            <div className="support-item text-center group hover-card">
              <div className="w-20 h-20 bg-gradient-to-r from-secondary to-success rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-secondary/20">
                <FileText className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-lg font-bold mb-4 text-slate-900">Knowledge Base</h3>
              <p className="text-slate-600 leading-relaxed text-sm">
                Comprehensive documentation, tutorials, and best practices to help you maximize platform capabilities.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Resources Section */}
      <section className="py-20 px-4 bg-white relative" ref={resourcesRef}>
        <div className="absolute inset-0 bg-gradient-to-br from-primary/3 to-secondary/3"></div>
        <div className="container mx-auto relative z-10">
          <div className="text-center mb-16">
            <Badge className="mb-6 bg-warning/10 text-warning border-warning/20 text-base px-6 py-2 font-medium">
              <Bookmark className="w-4 h-4 mr-2" />
              Resources & Learning
            </Badge>
            <h2 className="text-4xl md:text-6xl font-bold mb-6 text-slate-900">
              Expand Your
              <br />
              <span className="bg-gradient-to-r from-warning to-danger bg-clip-text text-transparent">Knowledge</span>
            </h2>
            <p className="text-xl text-slate-600 max-w-4xl mx-auto leading-relaxed font-light">
              Access our comprehensive library of resources, guides, and educational content to stay ahead in the
              logistics industry.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="resource-card border border-slate-200 bg-white hover:shadow-xl hover:shadow-primary/10 transition-all duration-500 hover:border-primary/30 hover-card">
              <CardContent className="p-8">
                <div className="w-14 h-14 bg-gradient-to-r from-primary to-secondary rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-primary/20">
                  <FileText className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-slate-900">Industry Reports</h3>
                <p className="text-slate-600 mb-6 leading-relaxed">
                  In-depth analysis of logistics trends, market insights, and future predictions from industry experts.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-primary text-primary hover:bg-primary hover:text-white bg-transparent"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download Reports
                </Button>
              </CardContent>
            </Card>

            <Card className="resource-card border border-slate-200 bg-white hover:shadow-xl hover:shadow-secondary/10 transition-all duration-500 hover:border-secondary/30 hover-card">
              <CardContent className="p-8">
                <div className="w-14 h-14 bg-gradient-to-r from-secondary to-tertiary rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-secondary/20">
                  <Play className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-slate-900">Video Tutorials</h3>
                <p className="text-slate-600 mb-6 leading-relaxed">
                  Step-by-step video guides covering platform features, best practices, and optimization techniques.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-secondary text-secondary hover:bg-secondary hover:text-white bg-transparent"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Watch Videos
                </Button>
              </CardContent>
            </Card>

            <Card className="resource-card border border-slate-200 bg-white hover:shadow-xl hover:shadow-tertiary/10 transition-all duration-500 hover:border-tertiary/30 hover-card">
              <CardContent className="p-8">
                <div className="w-14 h-14 bg-gradient-to-r from-tertiary to-success rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-tertiary/20">
                  <HelpCircle className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-slate-900">FAQ & Guides</h3>
                <p className="text-slate-600 mb-6 leading-relaxed">
                  Comprehensive FAQ section and detailed guides to help you get the most out of our platform.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-tertiary text-tertiary hover:bg-tertiary hover:text-white bg-transparent"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Browse Guides
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-slate-50 to-white relative" ref={partnersRef}>
        <div className="absolute inset-0 bg-dot-pattern bg-dot opacity-10"></div>
        <div className="container mx-auto relative z-10">
          <div className="text-center mb-16">
            <Badge className="mb-6 bg-tertiary/10 text-tertiary border-tertiary/20 text-base px-6 py-2 font-medium">
              <Network className="w-4 h-4 mr-2" />
              Global Partners
            </Badge>
            <h2 className="text-4xl md:text-6xl font-bold mb-6 text-slate-900">
              Trusted by Industry
              <br />
              <span className="bg-gradient-to-r from-tertiary to-success bg-clip-text text-transparent">Leaders</span>
            </h2>
            <p className="text-xl text-slate-600 max-w-4xl mx-auto leading-relaxed font-light">
              We partner with the world's leading logistics companies, technology providers, and industry organizations
              to deliver exceptional value.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 items-center">
            <div className="partner-logo flex items-center justify-center p-6 bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-300 hover-card">
              <div className="w-16 h-16 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center">
                <Truck className="w-8 h-8 text-white" />
              </div>
            </div>
            <div className="partner-logo flex items-center justify-center p-6 bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-300 hover-card">
              <div className="w-16 h-16 bg-gradient-to-r from-secondary to-tertiary rounded-lg flex items-center justify-center">
                <Ship className="w-8 h-8 text-white" />
              </div>
            </div>
            <div className="partner-logo flex items-center justify-center p-6 bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-300 hover-card">
              <div className="w-16 h-16 bg-gradient-to-r from-tertiary to-success rounded-lg flex items-center justify-center">
                <Plane className="w-8 h-8 text-white" />
              </div>
            </div>
            <div className="partner-logo flex items-center justify-center p-6 bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-300 hover-card">
              <div className="w-16 h-16 bg-gradient-to-r from-success to-warning rounded-lg flex items-center justify-center">
                <Building className="w-8 h-8 text-white" />
              </div>
            </div>
            <div className="partner-logo flex items-center justify-center p-6 bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-300 hover-card">
              <div className="w-16 h-16 bg-gradient-to-r from-warning to-danger rounded-lg flex items-center justify-center">
                <Globe className="w-8 h-8 text-white" />
              </div>
            </div>
            <div className="partner-logo flex items-center justify-center p-6 bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-300 hover-card">
              <div className="w-16 h-16 bg-gradient-to-r from-danger to-primary rounded-lg flex items-center justify-center">
                <Package className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* News Section */}
      <section className="py-20 px-4 bg-white relative" ref={newsRef}>
        <div className="absolute inset-0 bg-gradient-to-br from-primary/3 to-secondary/3"></div>
        <div className="container mx-auto relative z-10">
          <div className="text-center mb-16">
            <Badge className="mb-6 bg-gray-500 text-secondary border-secondary/20 hover:bg-gray-400 text-base px-6 py-2 font-medium">
              <Bell className="w-4 h-4 mr-2" />
              Latest News
            </Badge>
            <h2 className="text-4xl md:text-6xl font-bold mb-6 text-slate-900">
              Stay Updated
              <br />
              <span className="bg-gradient-to-r from-secondary to-tertiary bg-clip-text text-transparent">
                with ShipDuniya
              </span>
            </h2>
            <p className="text-xl text-slate-600 max-w-4xl mx-auto leading-relaxed font-light">
              Get the latest updates on platform features, industry insights, and company announcements to stay ahead of
              the curve.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="news-card border border-slate-200 bg-white hover:shadow-xl hover:shadow-primary/10 transition-all duration-500 hover:border-primary/30 hover-card">
              <CardContent className="p-0">
                <div className="h-48 bg-gradient-to-br from-primary to-secondary rounded-t-lg flex items-center justify-center">
                  <Rocket className="w-16 h-16 text-white" />
                </div>
                <div className="p-6">
                  <Badge className="mb-3 bg-primary/10 text-primary border-primary/20 text-xs">Product Update</Badge>
                  <h3 className="text-lg font-bold mb-3 text-slate-900">AI-Powered Route Optimization 2.0 Released</h3>
                  <p className="text-slate-600 mb-4 leading-relaxed text-sm">
                    Our latest AI engine delivers 50% better route optimization with real-time traffic integration and
                    weather-aware routing.
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-500">Dec 15, 2024</span>
                    <Button variant="ghost" size="sm" className="text-primary hover:text-primary hover:bg-primary/10">
                      Read More <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="news-card border border-slate-200 bg-white hover:shadow-xl hover:shadow-secondary/10 transition-all duration-500 hover:border-secondary/30 hover-card">
              <CardContent className="p-0">
                <div className="h-48 bg-gradient-to-br from-secondary to-tertiary rounded-t-lg flex items-center justify-center">
                  <Award className="w-16 h-16 text-white" />
                </div>
                <div className="p-6">
                  <Badge className="mb-3 bg-secondary/10 text-secondary border-secondary/20 text-xs">
                    Company News
                  </Badge>
                  <h3 className="text-lg font-bold mb-3 text-slate-900">
                    Shipduniya Wins "Innovation of the Year" Award
                  </h3>
                  <p className="text-slate-600 mb-4 leading-relaxed text-sm">
                    Recognized by the Global Logistics Association for our groundbreaking AI-driven supply chain
                    optimization platform.
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-500">Dec 10, 2024</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-secondary hover:text-secondary hover:bg-secondary/10"
                    >
                      Read More <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="news-card border border-slate-200 bg-white hover:shadow-xl hover:shadow-tertiary/10 transition-all duration-500 hover:border-tertiary/30 hover-card">
              <CardContent className="p-0">
                <div className="h-48 bg-gradient-to-br from-tertiary to-success rounded-t-lg flex items-center justify-center">
                  <Globe className="w-16 h-16 text-white" />
                </div>
                <div className="p-6">
                  <Badge className="mb-3 bg-tertiary/10 text-tertiary border-tertiary/20 text-xs">Expansion</Badge>
                  <h3 className="text-lg font-bold mb-3 text-slate-900">Expanding to 25 New Countries in 2025</h3>
                  <p className="text-slate-600 mb-4 leading-relaxed text-sm">
                    Our global expansion continues with new partnerships and local operations in emerging markets across
                    Asia and Africa.
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-500">Dec 5, 2024</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-tertiary hover:text-tertiary hover:bg-tertiary/10"
                    >
                      Read More <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-primary to-secondary relative overflow-hidden" ref={ctaRef}>
        <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-10"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-secondary/90"></div>
        <div className="container mx-auto relative z-10">
          <div className="cta-content text-center max-w-4xl mx-auto">
            <Badge className="mb-8 bg-white/20 text-white border-white/30 backdrop-blur-sm text-base px-6 py-2 font-medium">
              <Rocket className="w-4 h-4 mr-2" />
              Ready to Transform Your Logistics?
            </Badge>
            <h2 className="text-4xl md:text-6xl font-bold mb-8 text-white leading-tight">
              Start Your Journey to
              <br />
              Smarter Logistics Today
            </h2>
            <p className="text-xl text-white/90 mb-12 leading-relaxed font-light">
              Join thousands of companies worldwide who trust Shipduniya to optimize their supply chain operations and
              drive business growth.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Button
                size="lg"
                className="bg-white text-primary hover:bg-white/90 text-lg px-10 py-6 font-semibold shadow-xl"
                onClick ={()=> router.push('/signup')}
              >
                Start Free Trial
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-10 py-6 border-white/30 text-white hover:bg-white/10 hover:border-white/50 backdrop-blur-sm font-semibold bg-transparent"
              >
                <Calendar className="w-5 h-5 mr-2" />
                Schedule Demo
              </Button>
            </div>
            <div className="mt-12 flex items-center justify-center space-x-8 text-white/80">
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 mr-2" />
                <span className="text-sm">No credit card required</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 mr-2" />
                <span className="text-sm">14-day free trial</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 mr-2" />
                <span className="text-sm">Cancel anytime</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Footer */}
      <footer className="bg-white text-slate-900 py-16 px-4 relative">
  <div className="absolute inset-0 bg-dot-pattern bg-dot opacity-5"></div>
  <div className="container mx-auto relative z-10">
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
      {/* Logo + Description */}
      <div>
        <div className="flex items-center space-x-3 mb-6">
          <Image src={Logo} alt="Ship Duniya Logo" />
          <span className="text-xs font-semibold text-slate-600">(TM)</span>
        </div>
        <p className="text-slate-400 mb-6 leading-relaxed">
          Transforming global logistics with AI-powered solutions that optimize supply chains and drive business growth.
        </p>
        <ul className="text-slate-500 text-sm space-y-1 mb-6">
          <li>Company Number: 9220551211</li>
          <li>Email: official@shipduniya.in</li>
          <li>Location: Noida, Uttar Pradesh - 201301</li>
        </ul>
        <ul className="text-slate-500 text-sm space-y-1 mb-6">
          <li>Delivery Partners: XpressBees, Delhivery</li>
          <li>API Integration Partners: Shopify</li>
         
        </ul>
        <div className="flex space-x-4">
          <div className="w-10 h-10 bg-white-800 rounded-lg flex items-center justify-center hover:bg-primary transition-colors cursor-pointer">
            <Network className="w-5 h-5" />
          </div>
          <div className="w-10 h-10 bg-white-800 rounded-lg flex items-center justify-center hover:bg-primary transition-colors cursor-pointer">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center hover:bg-primary transition-colors cursor-pointer">
            <Mail className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Platform Links */}
      <div className="ml-4">
        <h3 className="text-lg font-bold mb-6">Platform</h3>
        <ul className="space-y-3">
          <li><Link href="#features" className="text-slate-400 hover:text-slate-800">Features</Link></li>
          <li><Link href="#dashboard" className="text-slate-400 hover:text-slate-800">Dashboard</Link></li>
          <li><Link href="#integrations" className="text-slate-400 hover:text-slate-800">Integrations</Link></li>
          <li><Link href="#analytics" className="text-slate-400 hover:text-slate-800">Analytics</Link></li>
          <li><Link href="#security" className="text-slate-400 hover:text-slate-800">Security</Link></li>
        </ul>
      </div>

      {/* Services Links */}
      <div>
        <h3 className="text-lg font-bold mb-6">Services</h3>
        <ul className="space-y-3">
          <li><Link href="#services" className="text-slate-400 hover:text-slate-800">Air Freight</Link></li>
          <li><Link href="#services" className="text-slate-400 hover:text-slate-800">Ocean Freight</Link></li>
          <li><Link href="#services" className="text-slate-400 hover:text-slate-800">Ground Transport</Link></li>
          <li><Link href="#services" className="text-slate-400 hover:text-slate-800">Warehousing</Link></li>
          <li><Link href="#services" className="text-slate-400 hover:text-slate-800">Consulting</Link></li>
        </ul>
      </div>

      {/* Support Links */}
      <div>
        <h3 className="text-lg font-bold mb-6">Support</h3>
        <ul className="space-y-3">
          <li><Link href="#support" className="text-slate-400 hover:text-slate-800">Help Center</Link></li>
          <li><Link href="#support" className="text-slate-400 hover:text-slate-800">Documentation</Link></li>
          <li><Link href="#support" className="text-slate-400 hover:text-slate-800">API Reference</Link></li>
          <li><Link href="#support" className="text-slate-400 hover:text-slate-800">Contact Us</Link></li>
          <li><Link href="#support" className="text-slate-400 hover:text-slate-800">Status Page</Link></li>
        </ul>
      </div>
    </div>

    {/* Bottom Section */}
    <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center">
      <div className="text-slate-400 text-sm mb-4 md:mb-0">
        © 2024 ShipDuniya™. All rights reserved. Built with precision and care.
      </div>
      <div className="flex space-x-6 text-sm">
        <Link href="/privacy.pdf" target="_blank" className="text-slate-400 hover:text-slate-800">Privacy Policy</Link>
        <Link href="/terms.pdf" target="_blank" className="text-slate-400 hover:text-slate-800">Terms of Service</Link>
        <Link href="/cookies.pdf" target="_blank" className="text-slate-400 hover:text-slate-800">Cookie Policy</Link>
      </div>
    </div>
  </div>
</footer>

    </div>
  )
}
