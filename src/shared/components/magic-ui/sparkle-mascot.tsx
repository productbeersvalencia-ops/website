'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion } from 'motion/react';
import { cn } from '@/shared/lib/utils';

interface Sparkle {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
}

interface SparkleMascotProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  sparkleCount?: number;
  sparkleColor?: string;
}

/**
 * Mascot image with sparkle/bubble effect around it
 * Perfect for beer-themed illustrations
 */
export function SparkleMascot({
  src,
  alt,
  width = 280,
  height = 280,
  className,
  sparkleCount = 12,
  sparkleColor = '#eab308',
}: SparkleMascotProps) {
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);

  useEffect(() => {
    const generateSparkles = () => {
      const newSparkles: Sparkle[] = [];
      for (let i = 0; i < sparkleCount; i++) {
        // Distribute sparkles around the image in a circular pattern
        const angle = (i / sparkleCount) * Math.PI * 2;
        const radius = 45 + Math.random() * 15; // 45-60% from center

        newSparkles.push({
          id: i,
          x: 50 + Math.cos(angle) * radius,
          y: 50 + Math.sin(angle) * radius,
          size: Math.random() * 8 + 4, // 4-12px
          duration: Math.random() * 2 + 1.5, // 1.5-3.5s
          delay: Math.random() * 2,
        });
      }
      setSparkles(newSparkles);
    };

    generateSparkles();
  }, [sparkleCount]);

  return (
    <div className={cn('relative inline-block', className)}>
      {/* Sparkles container */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          width: width * 1.4,
          height: height * 1.4,
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      >
        {sparkles.map((sparkle) => (
          <motion.div
            key={sparkle.id}
            className="absolute rounded-full"
            style={{
              left: `${sparkle.x}%`,
              top: `${sparkle.y}%`,
              width: sparkle.size,
              height: sparkle.size,
              background: `radial-gradient(circle at 30% 30%, rgba(255,255,255,0.9), ${sparkleColor} 50%, transparent)`,
              boxShadow: `0 0 ${sparkle.size}px ${sparkleColor}40`,
            }}
            animate={{
              scale: [0, 1.2, 0],
              opacity: [0, 1, 0],
              y: [0, -10, -20],
            }}
            transition={{
              duration: sparkle.duration,
              delay: sparkle.delay,
              repeat: Infinity,
              ease: 'easeOut',
            }}
          />
        ))}
      </div>

      {/* Glow effect behind mascot */}
      <div
        className="absolute inset-0 rounded-full blur-2xl opacity-30"
        style={{
          background: `radial-gradient(circle, ${sparkleColor} 0%, transparent 70%)`,
          transform: 'scale(1.2)',
        }}
      />

      {/* Main mascot image with hover effect */}
      <motion.div
        whileHover={{ scale: 1.05, rotate: [0, -3, 3, 0] }}
        transition={{ duration: 0.4 }}
      >
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          className="relative z-10 drop-shadow-2xl"
          priority
        />
      </motion.div>
    </div>
  );
}
