'use client';

import { useRef } from 'react';
import { AnimatePresence, motion, useInView } from 'motion/react';

/**
 * BlurFade — Magic UI pattern.
 * Reveals children with a blur + rise as they scroll into view.
 * Replaces the old IntersectionObserver `.reveal` class in script.js.
 */
export default function BlurFade({
  children,
  className,
  variant,
  duration = 0.5,
  delay = 0,
  yOffset = 16,
  inView = true,
  inViewMargin = '-60px',
  blur = '6px',
  as: Tag = 'div',
}) {
  const ref = useRef(null);
  const inViewResult = useInView(ref, { once: true, margin: inViewMargin });
  const isInView = !inView || inViewResult;

  const defaultVariants = {
    hidden: { y: yOffset, opacity: 0, filter: `blur(${blur})` },
    visible: { y: 0, opacity: 1, filter: 'blur(0px)' },
  };
  const combinedVariants = variant || defaultVariants;

  const MotionTag = motion[Tag] ?? motion.div;

  return (
    <AnimatePresence>
      <MotionTag
        ref={ref}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
        exit="hidden"
        variants={combinedVariants}
        transition={{
          delay: 0.04 + delay,
          duration,
          ease: [0.16, 1, 0.3, 1],
        }}
        className={className}
      >
        {children}
      </MotionTag>
    </AnimatePresence>
  );
}
