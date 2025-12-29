'use client';

import { ReactNode } from 'react';
import { cn } from '@/shared/lib/utils';

interface AnimatedGradientTextProps {
  children: ReactNode;
  className?: string;
  colorFrom?: string;
  colorTo?: string;
}

/**
 * Animated gradient text with smooth color transition
 * Reusable for headlines, CTAs, and emphasis text
 */
export function AnimatedGradientText({
  children,
  className,
  colorFrom = '#eab308',
  colorTo = '#fbbf24',
}: AnimatedGradientTextProps) {
  return (
    <span
      className={cn(
        'inline-flex animate-gradient bg-gradient-to-r bg-[length:var(--bg-size)_100%] bg-clip-text text-transparent pr-[0.05em]',
        className
      )}
      style={
        {
          '--bg-size': '300%',
          backgroundImage: `linear-gradient(to right, ${colorFrom}, ${colorTo}, ${colorFrom})`,
        } as React.CSSProperties
      }
    >
      {children}
    </span>
  );
}

export default AnimatedGradientText;
