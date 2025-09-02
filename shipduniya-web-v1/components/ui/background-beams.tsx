"use client"
import { motion } from "framer-motion"

export const BackgroundBeams = ({ className }: { className?: string }) => {
  const beams = new Array(6).fill("")

  return (
    <div
      className={`absolute inset-0 overflow-hidden bg-gradient-to-b from-slate-900 via-slate-900/50 to-transparent ${className}`}
    >
      {beams.map((_, i) => (
        <motion.div
          key={i}
          className="absolute left-1/2 top-0 h-full w-px bg-gradient-to-b from-primary/0 via-primary/40 to-primary/0"
          style={{
            left: `${20 + i * 12}%`,
          }}
          initial={{ opacity: 0, scaleY: 0 }}
          animate={{
            opacity: [0, 1, 0],
            scaleY: [0, 1, 0],
          }}
          transition={{
            duration: 3,
            repeat: Number.POSITIVE_INFINITY,
            delay: i * 0.5,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  )
}
