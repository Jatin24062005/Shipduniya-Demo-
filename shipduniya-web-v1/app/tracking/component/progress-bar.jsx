'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { Package, Truck, MapPin, Home } from 'lucide-react'

const milestones = [
  { label: 'Received', icon: Package, percent: 0 },
  { label: 'Pending Pickup', icon: Truck, percent: 25 },
  { label: 'In transit', icon: MapPin, percent: 50 },
  { label: 'Out for delivery', icon: Truck, percent: 75 },
  { label: 'Delivered', icon: Home, percent: 100 }
]

export function ProgressBar({ status }) {
  const progressRef = useRef(null)
  const markerRef = useRef(null)

  // Find the matching milestone percentage from the status
  const currentMilestone = milestones.find(
    m => m.label.toLowerCase() === status?.toLowerCase()
  )
  const progress = currentMilestone ? currentMilestone.percent : 0

  useEffect(() => {
    gsap.to(progressRef.current, {
      width: `${progress}%`,
      duration: 1.5,
      ease: 'power2.out'
    })

    gsap.fromTo(
      markerRef.current,
      { scale: 0 },
      {
        scale: 1,
        duration: 0.4,
        delay: 1,
        ease: 'back.out(1.7)'
      }
    )

    gsap.to(markerRef.current, {
      scale: 1.2,
      repeat: -1,
      yoyo: true,
      duration: 1.8,
      ease: 'power1.inOut'
    })
  }, [progress])

  return (
    <div className="space-y-4 bg-white p-6 rounded-xl shadow-md">
      <h3 className="text-lg font-semibold text-black">Shipment Progress</h3>

      <div className="relative">
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            ref={progressRef}
            className="h-full bg-black rounded-full relative transition-all duration-1000"
            style={{ width: '0%' }}
          >
            <div
              ref={markerRef}
              className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-2 border-black rounded-full shadow-md"
            />
          </div>
        </div>

        <div className="flex justify-between mt-6">
          {milestones.map((milestone, index) => {
            const Icon = milestone.icon
            const isActive = progress >= milestone.percent
            const isCurrent =
              progress >= milestone.percent &&
              (index === milestones.length - 1 ||
                progress < milestones[index + 1].percent)

            return (
              <div
                key={milestone.label}
                className="flex flex-col items-center space-y-2 transition-all duration-300"
              >
                <div
                  className={`p-2 rounded-full border-2 ${
                    isActive
                      ? 'bg-black border-black text-white'
                      : 'bg-white border-gray-400 text-gray-400'
                  } ${isCurrent ? 'shadow-md scale-110' : ''}`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <span
                  className={`text-xs font-medium ${
                    isActive ? 'text-black' : 'text-gray-500'
                  }`}
                >
                  {milestone.label}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      <div className="text-center pt-2">
        <span className="text-sm text-gray-600">
        </span>
      </div>
    </div>
  )
}
