// components/SparklesBackground.tsx
"use client";
import { useEffect, useState } from "react";

export default function SparklesBackground() {
  const [sparkles, setSparkles] = useState([]);

  useEffect(() => {
    const sparkleCount = 40;
    const newSparkles = Array.from({ length: sparkleCount }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      delay: Math.random() * 5,
      size: Math.random() * 1.5 + 0.8, // text size in rem
    }));
    setSparkles(newSparkles);
  }, []);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
      {sparkles.map((sparkle) => (
        <div
          key={sparkle.id}
          className="absolute text-black animate-sparkle"
          style={{
            left: `${sparkle.left}%`,
            top: `${sparkle.top}%`,
            fontSize: `${sparkle.size}rem`,
            animationDelay: `${sparkle.delay}s`,
          }}
        >
          ✦
        </div>
      ))}
    </div>
  );
}
