import { cn } from '../../lib/utils';
import { profile } from '../../content';

/**
 * BrandMark — the "HE" monogram.
 *
 * Replaces the gradient square that rendered `profile.initials` as text in
 * both the navbar and the footer. That placeholder was an accent-tinted tile
 * with two letters in it; this is the actual logo, so it should not be caged
 * in a coloured chip — the mark carries its own gradient and silhouette.
 *
 * Decorative by design: every call site already labels its own link, so the
 * image is hidden from assistive tech instead of repeating the name.
 */
export default function BrandMark({ className, ...props }) {
  return (
    <picture>
      <source type="image/webp" srcSet={profile.logo.webp} />
      <img
        src={profile.logo.png}
        alt=""
        aria-hidden="true"
        width={profile.logo.size}
        height={profile.logo.size}
        decoding="async"
        draggable={false}
        className={cn('shrink-0 object-contain select-none', className)}
        {...props}
      />
    </picture>
  );
}
