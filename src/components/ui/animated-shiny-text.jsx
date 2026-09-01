import { cn } from '../../lib/utils';

/**
 * AnimatedShinyText — Magic UI pattern.
 * A slow specular sweep across text. Used on the availability badge
 * (replaces the old hard-blinking `pulse-dot`).
 */
export default function AnimatedShinyText({
  children,
  className,
  shimmerWidth = 100,
}) {
  return (
    <span
      style={{ '--shiny-width': `${shimmerWidth}px` }}
      className={cn(
        'mx-auto max-w-md text-ink-300',
        'animate-shiny-text bg-clip-text bg-no-repeat [background-position:0_0] [background-size:var(--shiny-width)_100%] [transition:background-position_1s_cubic-bezier(.6,.6,0,1)_infinite]',
        'bg-linear-to-r from-transparent via-white/85 via-50% to-transparent',
        className
      )}
    >
      {children}
    </span>
  );
}
