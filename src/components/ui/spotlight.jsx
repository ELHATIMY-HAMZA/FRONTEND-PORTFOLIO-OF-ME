'use client';

import { motion } from 'motion/react';
import { cn } from '../../lib/utils';

/**
 * Spotlight — Aceternity UI pattern ("Spotlight New").
 * Two large, very soft conic glows that drift slowly.
 *
 * This is the ambient light source of the page. It replaces the three
 * hard-edged neon orbs (`meshFloat`, purple/cyan/pink) from style.css with
 * a single-hue wash, which is the core of the "tighter palette" direction.
 */
export default function Spotlight({
  gradientFirst = 'radial-gradient(68.54% 68.72% at 55.02% 31.46%, hsla(246, 100%, 68%, .10) 0, hsla(246, 100%, 55%, .04) 50%, transparent 80%)',
  gradientSecond = 'radial-gradient(50% 50% at 50% 50%, hsla(246, 100%, 68%, .08) 0, hsla(246, 100%, 55%, .03) 80%, transparent 100%)',
  gradientThird = 'radial-gradient(50% 50% at 50% 50%, hsla(160, 84%, 45%, .05) 0, hsla(160, 84%, 40%, .02) 80%, transparent 100%)',
  translateY = -320,
  width = 620,
  height = 1300,
  smallWidth = 260,
  duration = 9,
  xOffset = 90,
  className,
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.4 }}
      className={cn(
        'pointer-events-none absolute inset-0 h-full w-full overflow-hidden',
        className
      )}
      aria-hidden="true"
    >
      <motion.div
        animate={{ x: [0, xOffset, 0] }}
        transition={{
          duration,
          repeat: Infinity,
          repeatType: 'reverse',
          ease: 'easeInOut',
        }}
        className="pointer-events-none absolute top-0 left-0 z-0 h-screen w-screen"
      >
        <div
          style={{
            transform: `translateY(${translateY}px) rotate(-45deg)`,
            background: gradientFirst,
            width: `${width}px`,
            height: `${height}px`,
          }}
          className="absolute top-0 left-0"
        />
        <div
          style={{
            transform: 'rotate(-45deg) translate(5%, -50%)',
            background: gradientSecond,
            width: `${smallWidth}px`,
            height: `${height}px`,
          }}
          className="absolute top-0 left-0 origin-top-left"
        />
        <div
          style={{
            transform: 'rotate(-45deg) translate(-180%, -70%)',
            background: gradientThird,
            width: `${smallWidth}px`,
            height: `${height}px`,
          }}
          className="absolute top-0 left-0 origin-top-left"
        />
      </motion.div>

      <motion.div
        animate={{ x: [0, -xOffset, 0] }}
        transition={{
          duration,
          repeat: Infinity,
          repeatType: 'reverse',
          ease: 'easeInOut',
        }}
        className="pointer-events-none absolute top-0 right-0 z-0 h-screen w-screen"
      >
        <div
          style={{
            transform: `translateY(${translateY}px) rotate(45deg)`,
            background: gradientFirst,
            width: `${width}px`,
            height: `${height}px`,
          }}
          className="absolute top-0 right-0"
        />
        <div
          style={{
            transform: 'rotate(45deg) translate(-5%, -50%)',
            background: gradientSecond,
            width: `${smallWidth}px`,
            height: `${height}px`,
          }}
          className="absolute top-0 right-0 origin-top-right"
        />
        <div
          style={{
            transform: 'rotate(45deg) translate(180%, -70%)',
            background: gradientThird,
            width: `${smallWidth}px`,
            height: `${height}px`,
          }}
          className="absolute top-0 right-0 origin-top-right"
        />
      </motion.div>
    </motion.div>
  );
}
