import BlurFade from './blur-fade';
import { cn } from '../../lib/utils';

/**
 * SectionHeading — consistent kicker / title / lead for every section.
 * The original build repeated this markup four times with slightly different
 * spacing each time; centralising it fixes the vertical rhythm.
 */
export default function SectionHeading({
  kicker,
  title,
  lead,
  icon: Icon,
  aside,
  className,
}) {
  return (
    <BlurFade>
      <div
        className={cn(
          'flex flex-col gap-5 md:flex-row md:items-end md:justify-between',
          className
        )}
      >
        <div className="max-w-2xl">
          {kicker && (
            <p className="flex items-center gap-1.5 font-mono text-[11px] font-semibold tracking-[0.14em] text-accent-400 uppercase">
              {Icon && <Icon className="size-3.5" />}
              {kicker}
            </p>
          )}
          <h2 className="mt-3 text-3xl font-extrabold tracking-[-0.028em] sm:text-[2.6rem] sm:leading-[1.1]">
            {title}
          </h2>
        </div>

        {(lead || aside) && (
          <div className="flex shrink-0 flex-col items-start gap-3 md:items-end">
            {lead && (
              <p className="max-w-md text-sm leading-relaxed text-ink-300 md:text-right">
                {lead}
              </p>
            )}
            {aside}
          </div>
        )}
      </div>
    </BlurFade>
  );
}
