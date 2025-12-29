'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'motion/react';

interface ParallaxMascotProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
}

export function ParallaxMascot({
  src,
  alt,
  width = 380,
  height = 380,
  className,
}: ParallaxMascotProps) {
  const [isMounted, setIsMounted] = useState(false);
  const { scrollY } = useScroll();

  // Parallax: la mascota se mueve más lento que el scroll
  const y = useTransform(scrollY, [0, 500], [0, 150]);
  const scale = useTransform(scrollY, [0, 300], [1, 0.85]);
  const opacity = useTransform(scrollY, [0, 400], [1, 0.3]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // SSR: renderizar sin animación
  if (!isMounted) {
    return (
      <div className="relative inline-block">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-primary/20 rounded-full blur-3xl" />
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          className={`relative z-10 ${className}`}
          priority
        />
      </div>
    );
  }

  return (
    <motion.div
      className="relative inline-block"
      style={{ y, scale, opacity }}
    >
      {/* Glow sutil detrás */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-primary/20 rounded-full blur-3xl" />

      {/* Mascota */}
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={`relative z-10 ${className}`}
        priority
      />
    </motion.div>
  );
}
