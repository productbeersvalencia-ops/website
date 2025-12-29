'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { cn } from '@/shared/lib/utils';

interface Bubble {
  id: number;
  x: number;
  size: number;
  duration: number;
  delay: number;
  opacity: number;
}

interface BeerBubblesProps {
  className?: string;
  quantity?: number;
  minSize?: number;
  maxSize?: number;
  color?: string;
}

export function BeerBubbles({
  className,
  quantity = 30,
  minSize = 4,
  maxSize = 20,
  color = '#eab308',
}: BeerBubblesProps) {
  const [bubbles, setBubbles] = useState<Bubble[]>([]);

  useEffect(() => {
    const generateBubbles = () => {
      const newBubbles: Bubble[] = [];
      for (let i = 0; i < quantity; i++) {
        newBubbles.push({
          id: i,
          x: Math.random() * 100,
          size: Math.random() * (maxSize - minSize) + minSize,
          duration: Math.random() * 8 + 12, // 12-20 seconds (velocidad moderada)
          delay: Math.random() * 5,
          opacity: Math.random() * 0.5 + 0.2, // 0.2-0.7
        });
      }
      setBubbles(newBubbles);
    };

    generateBubbles();
  }, [quantity, minSize, maxSize]);

  return (
    <div className={cn('pointer-events-none absolute inset-0 overflow-hidden', className)}>
      {bubbles.map((bubble) => (
        <motion.div
          key={bubble.id}
          className="absolute rounded-full"
          style={{
            left: `${bubble.x}%`,
            width: bubble.size,
            height: bubble.size,
            background: `radial-gradient(circle at 30% 30%, rgba(255,255,255,0.8), ${color} 60%, transparent)`,
            boxShadow: `inset -2px -2px 4px rgba(0,0,0,0.2), inset 2px 2px 4px rgba(255,255,255,0.3)`,
            opacity: bubble.opacity,
          }}
          initial={{
            bottom: '-5%',
            scale: 0.8,
          }}
          animate={{
            bottom: '105%',
            scale: [0.8, 1.1, 0.9, 1],
            x: [0, 10, -10, 5, 0],
          }}
          transition={{
            duration: bubble.duration,
            delay: bubble.delay,
            repeat: Infinity,
            ease: 'easeInOut',
            x: {
              duration: bubble.duration * 0.5,
              repeat: Infinity,
              repeatType: 'reverse',
              ease: 'easeInOut',
            },
          }}
        />
      ))}
    </div>
  );
}
