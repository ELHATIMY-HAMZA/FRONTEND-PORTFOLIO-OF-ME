'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'motion/react';
import { cn } from '../../lib/utils';

/**
 * Terminal — Magic UI pattern.
 * A macOS-style terminal with sequenced reveal + typewriter lines.
 *
 * Chosen deliberately: for a "Full Stack & AI Engineer" this communicates
 * agentic/CLI workflow competence far better than a static code block does.
 * It replaces the old `developer-profile.ts` static card from the dist build.
 */

export function AnimatedSpan({ children, delay = 0, className, ...props }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -4 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.28, delay: delay / 1000 }}
      className={cn('grid text-sm font-normal tracking-tight', className)}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function TypingAnimation({
  children,
  className,
  duration = 55,
  delay = 0,
  as: Component = 'span',
  ...props
}) {
  if (typeof children !== 'string') {
    throw new Error('TypingAnimation: children must be a string.');
  }

  const MotionComponent = motion.create(Component, {
    forwardMotionProps: true,
  });

  const [displayedText, setDisplayedText] = useState('');
  const [started, setStarted] = useState(false);
  const elementRef = useRef(null);
  const isInView = useInView(elementRef, { once: true, margin: '-40px' });

  useEffect(() => {
    if (!isInView) return;
    const startTimeout = setTimeout(() => setStarted(true), delay);
    return () => clearTimeout(startTimeout);
  }, [delay, isInView]);

  useEffect(() => {
    if (!started) return;
    let i = 0;
    const interval = setInterval(() => {
      if (i < children.length) {
        setDisplayedText(children.substring(0, i + 1));
        i += 1;
      } else {
        clearInterval(interval);
      }
    }, duration);
    return () => clearInterval(interval);
  }, [children, duration, started]);

  return (
    <MotionComponent
      ref={elementRef}
      className={cn('text-sm font-normal tracking-tight', className)}
      {...props}
    >
      {displayedText}
    </MotionComponent>
  );
}

export function Terminal({ children, className, title = 'zsh' }) {
  return (
    <div
      className={cn(
        'z-0 h-full max-h-[420px] w-full overflow-hidden rounded-panel border border-white/8 bg-ink-900/90 shadow-2xl shadow-black/60 backdrop-blur-xl',
        className
      )}
    >
      <div className="flex flex-col gap-y-2 border-b border-white/8 bg-ink-850/80 px-4 py-3">
        <div className="flex flex-row items-center gap-x-2">
          <div className="h-2.5 w-2.5 rounded-full bg-[#FF5F57]" />
          <div className="h-2.5 w-2.5 rounded-full bg-[#FEBC2E]" />
          <div className="h-2.5 w-2.5 rounded-full bg-[#28C840]" />
          <span className="ml-2 font-mono text-[11px] text-ink-400">
            {title}
          </span>
        </div>
      </div>
      <pre className="h-full overflow-y-auto p-4">
        <code className="grid gap-y-1 font-mono text-[12.5px] leading-relaxed">
          {children}
        </code>
      </pre>
    </div>
  );
}

export default Terminal;
