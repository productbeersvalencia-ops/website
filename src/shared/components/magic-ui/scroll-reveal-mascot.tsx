'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'motion/react';

interface ScrollRevealMascotProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
}

export function ScrollRevealMascot({
  src,
  alt,
  width = 200,
  height = 200,
  className,
}: ScrollRevealMascotProps) {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'center center'],
  });

  // Aparece de abajo hacia arriba mientras hace scroll
  // Sincronizado con ParallaxMascot: empieza donde el hero termina (0.85) y termina donde empieza (1)
  const y = useTransform(scrollYProgress, [0, 1], [60, 0]);
  const opacity = useTransform(scrollYProgress, [0, 0.4, 1], [0, 0.5, 1]);
  const scale = useTransform(scrollYProgress, [0, 1], [0.85, 1]);

  return (
    <div ref={ref} className="flex justify-center">
      <motion.div
        style={{ y, opacity, scale }}
        className="relative inline-block"
      >
        {/* Glow ámbar detrás */}
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-primary/25 rounded-full blur-3xl"
          style={{ opacity }}
        />

        {/* Mascota */}
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          className={`relative z-10 ${className || ''}`}
        />
      </motion.div>
    </div>
  );
}
