'use client'

import { useState, useRef, useEffect } from 'react'
import { gsap } from 'gsap'
import { Search, Package, Truck, CheckCircle2 } from 'lucide-react'
import clsx from 'clsx'

const deliveryPartners = [
  {
    value: 'xpressbees',
    label: 'Xpressbees',
    icon: Truck,
    sampleAwb: 'XB341918713810',
  },
  {
    value: 'delhivery',
    label: 'Delhivery', 
    icon: Package,
    sampleAwb: 'DL789456123',
  },
]


export function TrackingForm({ onTrack, isLoading }) {
  const [selectedPartner, setSelectedPartner] = useState('')
  const [awbNumber, setAwbNumber] = useState('')
  const [errors, setErrors] = useState({})
  const [isFocused, setIsFocused] = useState(false)

  const formRef = useRef(null)
  const logoRef = useRef(null)
  const partnersRef = useRef(null)
  const inputRef = useRef(null)
  const submitRef = useRef(null)
  const loadingRef = useRef(null)

  useEffect(() => {
    const tl = gsap.timeline()
    
    // Initial animation
    tl.set([logoRef.current, partnersRef.current, inputRef.current, submitRef.current], { 
      opacity: 0, 
      y: 30 
    })
    .to(logoRef.current, { 
      opacity: 1, 
      y: 0, 
      duration: 0.8, 
      ease: "power3.out" 
    })
    .to(partnersRef.current, { 
      opacity: 1, 
      y: 0, 
      duration: 0.6, 
      ease: "power3.out" 
    }, "-=0.4")
    .to([inputRef.current, submitRef.current], { 
      opacity: 1, 
      y: 0, 
      duration: 0.5, 
      ease: "power3.out",
      stagger: 0.1 
    }, "-=0.3")

    // Hover animations setup
    const partnerButtons = partnersRef.current?.querySelectorAll('[data-partner]')
    partnerButtons?.forEach(button => {
      button.addEventListener('mouseenter', () => {
        gsap.to(button, { 
          scale: 1.02, 
          duration: 0.2, 
          ease: "power2.out" 
        })
      })
      button.addEventListener('mouseleave', () => {
        gsap.to(button, { 
          scale: 1, 
          duration: 0.2, 
          ease: "power2.out" 
        })
      })
    })

    return () => {
      tl.kill()
    }
  }, [])

  useEffect(() => {
    if (isLoading && loadingRef.current) {
      gsap.to(loadingRef.current, {
        rotation: 360,
        duration: 1,
        ease: "none",
        repeat: -1
      })
    }
  }, [isLoading])

  const handlePartnerSelect = (partner) => {
    setSelectedPartner(partner)
    
    // Smooth selection animation
    const buttons = partnersRef.current?.querySelectorAll('[data-partner]')
    buttons?.forEach((button, index) => {
      const isSelected = button.getAttribute('data-partner') === partner
      gsap.to(button, {
        backgroundColor: isSelected ? '#000000' : '#ffffff',
        color: isSelected ? '#ffffff' : '#000000',
        borderColor: isSelected ? '#000000' : '#e5e7eb',
        duration: 0.3,
        ease: "power2.out"
      })
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    const newErrors= {}
    if (!selectedPartner) newErrors.partner = 'Select a delivery partner'
    if (!awbNumber.trim()) {
      newErrors.awb = 'Enter AWB number'
    } else if (awbNumber.trim().length < 6) {
      newErrors.awb = 'AWB must be 6+ characters'
    }

    setErrors(newErrors)

    // Error shake animation
    if (Object.keys(newErrors).length > 0) {
      gsap.to(formRef.current, {
        x: [-10, 10, -10, 10, 0],
        duration: 0.4,
        ease: "power2.inOut"
      })
      return
    }

    // Success animation
    gsap.to(submitRef.current, {
      scale: 0.98,
      duration: 0.1,
      yoyo: true,
      repeat: 1,
      ease: "power2.inOut"
    })

    onTrack(selectedPartner, awbNumber.trim())
  }

  const handleInputFocus = () => {
    setIsFocused(true)
    gsap.to(inputRef.current, {
      scale: 1.02,
      duration: 0.2,
      ease: "power2.out"
    })
  }

  const handleInputBlur = () => {
    setIsFocused(false)
    gsap.to(inputRef.current, {
      scale: 1,
      duration: 0.2,
      ease: "power2.out"
    })
  }

  return (
    <div ref={formRef} className="w-full max-w-md mx-auto">
      <div className="bg-white border border-gray-200 rounded-2xl shadow-xl p-6 space-y-6">
        {/* Logo Section */}
        <div ref={logoRef} className="text-center space-y-2">
          <div className="w-12 h-12 bg-black rounded-xl mx-auto flex items-center justify-center">
            <Package className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Package Tracker</h1>
            <p className="text-xs text-gray-500">Real-time shipment monitoring</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Partner Selection */}
          <div ref={partnersRef} className="space-y-2">
            <label className="block text-xs font-medium text-gray-700 uppercase tracking-wide">
              Carrier
            </label>
            <div className="grid grid-cols-2 gap-2">
              {deliveryPartners.map((partner) => {
                const Icon = partner.icon
                return (
                  <button
                    key={partner.value}
                    type="button"
                    data-partner={partner.value}
                    onClick={() => handlePartnerSelect(partner.value)}
                    className={clsx(
                      'flex items-center justify-center gap-2 p-3 rounded-lg border transition-all duration-200 text-sm font-medium',
                      selectedPartner === partner.value
                        ? 'bg-black text-white border-black'
                        : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300'
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    {partner.label}
                  </button>
                )
              })}
            </div>
            {errors.partner && (
              <p className="text-xs text-red-600 flex items-center gap-1">
                <span className="w-1 h-1 bg-red-600 rounded-full"></span>
                {errors.partner}
              </p>
            )}
          </div>

          {/* AWB Input */}
          <div className="space-y-2">
            <label htmlFor="awb" className="block text-xs font-medium text-gray-700 uppercase tracking-wide">
              Tracking Number
            </label>
            <input
              ref={inputRef}
              id="awb"
              type="text"
              placeholder="Enter AWB number"
              value={awbNumber}
              onChange={(e) => setAwbNumber(e.target.value)}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
              className={clsx(
                'w-full px-4 py-3 rounded-lg border text-sm font-mono transition-all duration-200',
                'focus:outline-none focus:ring-2 focus:ring-black/20',
                errors.awb
                  ? 'border-red-300 bg-red-50'
                  : isFocused
                  ? 'border-black bg-gray-50'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              )}
            />
            {errors.awb && (
              <p className="text-xs text-red-600 flex items-center gap-1">
                <span className="w-1 h-1 bg-red-600 rounded-full"></span>
                {errors.awb}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            ref={submitRef}
            type="submit"
            disabled={isLoading}
            className={clsx(
              'w-full py-3 px-4 rounded-lg font-medium text-sm transition-all duration-200',
              'flex items-center justify-center gap-2',
              isLoading
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-black text-white hover:bg-gray-800 active:bg-gray-900'
            )}
          >
            {isLoading ? (
              <>
                <div 
                  ref={loadingRef}
                  className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full"
                />
                Processing...
              </>
            ) : (
              <>
                <Search className="w-4 h-4" />
                Track Package
              </>
            )}
          </button>
        </form>

        {/* Status Indicator */}
        <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          System operational
        </div>
      </div>
    </div>
  )
}