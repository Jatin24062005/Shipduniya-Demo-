'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

const ratings = [
  { label: 'Bad', emoji: '😞', value: 1 },
  { label: 'OK', emoji: '😐', value: 2 },
  { label: 'Avg', emoji: '🙂', value: 3 },
  { label: 'Good', emoji: '😊', value: 4 },
  { label: 'Best', emoji: '😍', value: 5 }
]

export function RatingWidget() {
  const [selectedRating, setSelectedRating] = useState(null)
  const [hoveredRating, setHoveredRating] = useState(null)

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-slate-900 text-center">
        How was your delivery experience?
      </h3>
      
      <div className="flex items-center justify-center gap-4">
        {ratings.map((rating) => (
          <motion.button
            key={rating.value}
            className={`flex flex-col items-center gap-2 p-3 rounded-lg transition-all duration-200 ${
              selectedRating === rating.value
                ? 'bg-teal-50 border-2 border-teal-500'
                : hoveredRating === rating.value
                ? 'bg-slate-50 border-2 border-slate-300'
                : 'border-2 border-transparent hover:bg-slate-50'
            }`}
            onClick={() => setSelectedRating(rating.value)}
            onMouseEnter={() => setHoveredRating(rating.value)}
            onMouseLeave={() => setHoveredRating(null)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="text-2xl">{rating.emoji}</span>
            <span className="text-xs font-medium text-slate-600">{rating.label}</span>
          </motion.button>
        ))}
      </div>
      
      {selectedRating && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center text-sm text-teal-600 font-medium"
        >
          Thank you for your feedback!
        </motion.p>
      )}
    </div>
  )
}
