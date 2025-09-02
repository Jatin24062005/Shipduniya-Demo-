"use client"

import React from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

export const LampContainer = ({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) => {
  return (
    <div
      className={cn(
        "relative flex min-h-screen flex-col  items-center justify-center overflow-hidden bg-background text-foreground w-full z-0",
        className
      )}
    >
      {/* Gradient Glows */}
      <div className="relative flex w-full flex-1 scale-y-125 items-center justify-center isolate z-0">
        {/* Left Gradient Glow */}
        <motion.div
          initial={{ opacity: 0.3, width: "15rem" }}
          whileInView={{ opacity: 0.8, width: "30rem" }}
          transition={{ delay: 0.3, duration: 0.8, ease: "easeInOut" }}
          style={{
            backgroundImage: `conic-gradient(var(--conic-position), var(--tw-gradient-stops))`,
          }}
          className=" inset-auto right-1/2 h-56 w-[30rem] bg-gradient-conic from-primary/40 via-transparent to-transparent [--conic-position:from_70deg_at_center_top]"
        >
          {/* Masking fade (Left) */}
          <div className="absolute w-full h-40 bottom-0 left-0 z-20 bg-white [mask-image:linear-gradient(to_top,white,transparent)]" />
          <div className="absolute w-40 h-full bottom-0 left-0 z-20 bg-white [mask-image:linear-gradient(to_right,white,transparent)]" />
        </motion.div>

        {/* Right Gradient Glow */}
        <motion.div
          initial={{ opacity: 0.3, width: "15rem" }}
          whileInView={{ opacity: 0.8, width: "30rem" }}
          transition={{ delay: 0.3, duration: 0.8, ease: "easeInOut" }}
          style={{
            backgroundImage: `conic-gradient(var(--conic-position), var(--tw-gradient-stops))`,
          }}
          className="absolute inset-auto left-1/2 h-56 w-[30rem] bg-gradient-conic from-transparent via-transparent to-primary/40 [--conic-position:from_290deg_at_center_top]"
        >
          {/* Masking fade (Right) */}
          <div className="absolute w-40 h-full bottom-0 right-0 z-20 bg-white [mask-image:linear-gradient(to_left,white,transparent)]" />
          <div className="absolute w-full h-40 bottom-0 right-0 z-20 bg-white [mask-image:linear-gradient(to_top,white,transparent)]" />
        </motion.div>

        {/* White blur glow behind */}
        <div className="absolute top-1/2 h-48 w-full translate-y-12 scale-x-150 bg-background blur-2xl" />
        <div className="absolute top-1/2 z-50 h-48 w-full bg-transparent opacity-10 backdrop-blur-md" />

        {/* Blurred oval lamp base glow */}
        <div className="absolute inset-auto z-50 h-36 w-[28rem] -translate-y-1/2 rounded-full bg-primary/20 blur-3xl" />

        {/* Glowing core */}
        <motion.div
          initial={{ width: "8rem" }}
          whileInView={{ width: "16rem" }}
          transition={{ delay: 0.3, duration: 0.8, ease: "easeInOut" }}
          className="absolute inset-auto z-30 h-36 w-64 -translate-y-[6rem] rounded-full bg-primary/30 blur-2xl"
        />

        {/* Thin glowing beam line */}
        <motion.div
          initial={{ width: "15rem" }}
          whileInView={{ width: "30rem" }}
          transition={{ delay: 0.3, duration: 0.8, ease: "easeInOut" }}
          className="absolute inset-auto z-50 h-0.5 w-[30rem] -translate-y-[7rem] bg-primary/60"
        />

        {/* Top white patch to soften beam start */}
        <div className="absolute inset-auto z-40 h-44 w-full -translate-y-[12.5rem] bg-background" />
      </div>

      {/* Child Content */}
      <div className="relative z-50 flex -translate-y-80 flex-col items-center px-5">
        {children}
      </div>
    </div>
  )
}
