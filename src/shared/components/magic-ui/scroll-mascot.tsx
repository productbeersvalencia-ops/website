'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'motion/react';

interface ScrollMascotProps {
  src: string;
  alt: string;
}

/**
 * Mascota que aparece asomándose desde diferentes lados
 * durante el scroll, de forma sutil y divertida
 */
export function ScrollMascot({ src, alt }: ScrollMascotProps) {
  const [isMounted, setIsMounted] = useState(false);
  const { scrollY } = useScroll();

  // === APARICIÓN 1: Derecha, después del hero ===
  const opacity1 = useTransform(
    scrollY,
    [600, 900, 1800, 2100],
    [0, 1, 1, 0]
  );
  const x1 = useTransform(
    scrollY,
    [600, 900, 1800, 2100],
    [80, 0, 0, 80]
  );
  const rotate1 = useTransform(
    scrollY,
    [600, 900],
    [20, -8]
  );

  // === APARICIÓN 2: Izquierda, sección media ===
  const opacity2 = useTransform(
    scrollY,
    [2400, 2700, 3600, 3900],
    [0, 1, 1, 0]
  );
  const x2 = useTransform(
    scrollY,
    [2400, 2700, 3600, 3900],
    [-80, 0, 0, -80]
  );
  const rotate2 = useTransform(
    scrollY,
    [2400, 2700],
    [-20, 8]
  );

  // === APARICIÓN 3: Derecha abajo, antes del CTA ===
  const opacity3 = useTransform(
    scrollY,
    [4200, 4500, 5400, 5700],
    [0, 1, 1, 0]
  );
  const x3 = useTransform(
    scrollY,
    [4200, 4500, 5400, 5700],
    [80, 0, 0, 80]
  );
  const y3 = useTransform(
    scrollY,
    [4200, 4500],
    [30, 0]
  );

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <>
      {/* Aparición 1: Derecha */}
      <motion.div
        className="fixed bottom-16 right-0 z-40 pointer-events-none hidden lg:block"
        style={{ opacity: opacity1, x: x1, rotate: rotate1 }}
      >
        <Image
          src={src}
          alt={alt}
          width={100}
          height={100}
          className="drop-shadow-[0_0_20px_rgba(234,179,8,0.3)]"
        />
      </motion.div>

      {/* Aparición 2: Izquierda (volteado) */}
      <motion.div
        className="fixed bottom-24 left-0 z-40 pointer-events-none hidden lg:block"
        style={{ opacity: opacity2, x: x2, rotate: rotate2 }}
      >
        <Image
          src={src}
          alt={alt}
          width={90}
          height={90}
          className="drop-shadow-[0_0_20px_rgba(234,179,8,0.3)] -scale-x-100"
        />
      </motion.div>

      {/* Aparición 3: Derecha abajo, asomándose desde abajo */}
      <motion.div
        className="fixed bottom-0 right-8 z-40 pointer-events-none hidden lg:block"
        style={{ opacity: opacity3, x: x3, y: y3 }}
      >
        <Image
          src={src}
          alt={alt}
          width={80}
          height={80}
          className="drop-shadow-[0_0_20px_rgba(234,179,8,0.3)]"
        />
      </motion.div>
    </>
  );
}
