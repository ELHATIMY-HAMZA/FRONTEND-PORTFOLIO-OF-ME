import { cn } from '../../lib/utils';

/**
 * BorderBeam — Magic UI pattern.
 * A light that travels around the element's border via CSS `offset-path`.
 *
 * NOTE: the mask is applied via inline styles, not Tailwind arbitrary
 * properties. Tailwind sorts arbitrary declarations, which let the `mask`
 * shorthand land *after* `mask-clip`/`mask-composite` and reset them — the
 * beam then escaped its border and rendered as a visible block in the corner.
 * Inline styles guarantee shorthand-before-longhand order.
 */
export default function BorderBeam({
  className,
  size = 220,
  duration = 12,
  delay = 0,
  colorFrom = '#635BFF',
  colorTo = '#8880FF',
  borderWidth = 1.5,
}) {
  return (
    <div
      className="pointer-events-none absolute inset-0 rounded-[inherit]"
      style={{
        border: `${borderWidth}px solid transparent`,
        // Shorthand first, longhands after — order is significant.
        mask: 'linear-gradient(transparent, transparent), linear-gradient(#000, #000)',
        WebkitMask:
          'linear-gradient(transparent, transparent), linear-gradient(#000, #000)',
        maskClip: 'padding-box, border-box',
        WebkitMaskClip: 'padding-box, border-box',
        maskComposite: 'intersect',
        WebkitMaskComposite: 'source-in',
      }}
      aria-hidden="true"
    >
      <div
        className={cn(
          'absolute aspect-square animate-border-beam bg-linear-to-l from-(--beam-from) via-(--beam-to) to-transparent',
          className
        )}
        style={{
          '--beam-from': colorFrom,
          '--beam-to': colorTo,
          '--duration': duration,
          width: size,
          offsetAnchor: '90% 50%',
          offsetPath: `rect(0 auto auto 0 round ${size}px)`,
          animationDelay: `${-delay}s`,
        }}
      />
    </div>
  );
}
