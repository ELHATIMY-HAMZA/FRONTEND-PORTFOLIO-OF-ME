'use client';

import { useCallback, useEffect, useRef } from 'react';
import { useMotionTemplate, useMotionValue, motion } from 'motion/react';
import { cn } from '../../lib/utils';

/**
 * MagicCard — Magic UI pattern.
 * A cursor-following radial spotlight plus a gradient border that only
 * illuminates near the pointer.
 *
 * This replaces the old 3D tilt cards (perspective 900px, ±15deg). Tilt
 * reads as gimmicky at senior level and broke on touch; a spotlight is
 * subtler and degrades gracefully.
 */
export default function MagicCard({
  children,
  className,
  gradientSize = 260,
  gradientColor = '#12151C',
  gradientOpacity = 0.85,
  gradientFrom = '#635BFF',
  gradientTo = '#8880FF',
}) {
  const cardRef = useRef(null);
  const mouseX = useMotionValue(-gradientSize * 10);
  const mouseY = useMotionValue(-gradientSize * 10);

  const handleMouseMove = useCallback(
    (e) => {
      if (!cardRef.current) return;
      const { left, top } = cardRef.current.getBoundingClientRect();
      mouseX.set(e.clientX - left);
      mouseY.set(e.clientY - top);
    },
    [mouseX, mouseY]
  );

  const handleMouseLeave = useCallback(() => {
    mouseX.set(-gradientSize * 10);
    mouseY.set(-gradientSize * 10);
  }, [mouseX, mouseY, gradientSize]);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    el.addEventListener('pointermove', handleMouseMove);
    el.addEventListener('pointerleave', handleMouseLeave);
    return () => {
      el.removeEventListener('pointermove', handleMouseMove);
      el.removeEventListener('pointerleave', handleMouseLeave);
    };
  }, [handleMouseMove, handleMouseLeave]);

  return (
    <div
      ref={cardRef}
      className={cn(
        'group relative overflow-hidden rounded-panel border border-white/7 bg-ink-800/50 backdrop-blur-xl transition-colors duration-300 hover:border-white/12',
        className
      )}
    >
      {/* Illuminated border, revealed only around the pointer */}
      <motion.div
        className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-400 group-hover:opacity-100"
        style={{
          background: useMotionTemplate`
            radial-gradient(${gradientSize}px circle at ${mouseX}px ${mouseY}px,
            ${gradientFrom}, ${gradientTo}, transparent 100%)
          `,
          maskImage:
            'linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)',
          maskComposite: 'exclude',
          WebkitMaskComposite: 'xor',
          padding: '1px',
        }}
      />
      {/* Inner surface fill */}
      <div className="absolute inset-px rounded-[inherit] bg-ink-800/70" />
      {/* Cursor spotlight */}
      <motion.div
        className="pointer-events-none absolute inset-px rounded-[inherit] opacity-0 transition-opacity duration-400 group-hover:opacity-100"
        style={{
          background: useMotionTemplate`radial-gradient(${gradientSize}px circle at ${mouseX}px ${mouseY}px, ${gradientColor}, transparent 100%)`,
          opacity: gradientOpacity,
        }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
