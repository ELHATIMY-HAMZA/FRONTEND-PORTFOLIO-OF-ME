'use client';

import { useEffect, useRef, useState } from 'react';
import { cn } from '../../lib/utils';

/**
 * DotPattern — Magic UI pattern, with an optional cursor-tracking glow.
 * Provides quiet texture behind the hero. Replaces the 2500-particle
 * three.js field, which cost ~600KB of CDN JS for a similar effect.
 */
export default function DotPattern({
  width = 22,
  height = 22,
  cx = 1,
  cy = 1,
  cr = 1,
  glow = false,
  className,
  ...props
}) {
  const id = useRef(`dot-pattern-${Math.random().toString(36).slice(2, 9)}`);
  const containerRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => {
      const { width: w, height: h } = entry.contentRect;
      setDimensions({ width: w, height: h });
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const cols = Math.ceil(dimensions.width / width);
  const rows = Math.ceil(dimensions.height / height);

  return (
    <div
      ref={containerRef}
      className={cn(
        'pointer-events-none absolute inset-0 h-full w-full',
        className
      )}
      {...props}
    >
      <svg className="h-full w-full" aria-hidden="true">
        <defs>
          <pattern
            id={id.current}
            width={width}
            height={height}
            patternUnits="userSpaceOnUse"
            x={0}
            y={0}
          >
            <circle cx={cx} cy={cy} r={cr} className="fill-white/12" />
          </pattern>
          {glow && (
            <radialGradient id={`${id.current}-fade`}>
              <stop offset="0%" stopColor="white" stopOpacity="1" />
              <stop offset="70%" stopColor="white" stopOpacity="0.25" />
              <stop offset="100%" stopColor="white" stopOpacity="0" />
            </radialGradient>
          )}
        </defs>
        <rect
          width="100%"
          height="100%"
          fill={`url(#${id.current})`}
          mask={glow ? `url(#${id.current}-mask)` : undefined}
        />
        {glow && (
          <mask id={`${id.current}-mask`}>
            <rect
              width="100%"
              height="100%"
              fill={`url(#${id.current}-fade)`}
            />
          </mask>
        )}
      </svg>
      <span className="sr-only">{`${cols * rows} decorative dots`}</span>
    </div>
  );
}
