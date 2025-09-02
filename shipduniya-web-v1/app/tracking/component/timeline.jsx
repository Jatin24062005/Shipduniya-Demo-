'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { MapPin, Clock } from 'lucide-react'

export function Timeline({ events }) {
  const itemRefs = useRef([])
  const dotRefs = useRef([])

  useEffect(() => {
    // Animate each timeline item
    itemRefs.current.forEach((el, i) => {
      if (el) {
        gsap.fromTo(
          el,
          { opacity: 0, x: -20 },
          {
            opacity: 1,
            x: 0,
            duration: 0.5,
            delay: i * 0.15,
            ease: 'power2.out'
          }
        )
      }
    })

    // Animate active dots
    dotRefs.current.forEach((dot, i) => {
      const event = events[i]
      if (event?.isActive && dot) {
        gsap.to(dot, {
          scale: 1.4,
          repeat: -1,
          yoyo: true,
          duration: 1.5,
          ease: 'power1.inOut'
        })
      }
    })
  }, [events])

  return (
    <div className="space-y-6 bg-white p-6 rounded-xl shadow-md">
      <h3 className="text-lg font-semibold text-black">Tracking History</h3>

      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-300" />

        <div className="space-y-6">
          {events?.map((event, index) => (
            <div
              key={event.id}
              ref={(el) => (itemRefs.current[index] = el)}
              className="relative flex items-start gap-4 group hover:bg-gray-100 -mx-4 px-4 py-3 rounded-lg transition-colors duration-200 cursor-pointer"
            >
              {/* Timeline dot */}
              <div className="relative z-10 flex-shrink-0">
                <div
                  ref={(el) => (dotRefs.current[index] = el)}
                  className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                    event.isActive
                      ? 'bg-black border-black text-white shadow-md'
                      : 'bg-white border-gray-400'
                  }`}
                >
                  {event.isActive ? (
                    <div className="w-2 h-2 bg-white rounded-full" />
                  ) : (
                    <div className="w-2 h-2 bg-gray-500 rounded-full" />
                  )}
                </div>

                {/* Pulsing ring for active event */}
                {event.isActive && (
                  <div className="absolute inset-0 rounded-full border-2 border-black animate-ping opacity-40" />
                )}
              </div>

              {/* Event content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <h4
                      className={`font-semibold ${
                        event.isActive ? 'text-black' : 'text-gray-700'
                      }`}
                    >
                      {event.status}
                    </h4>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{event.date} {event.time}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <MapPin className="w-3 h-3" />
                      <span>{event.location}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
