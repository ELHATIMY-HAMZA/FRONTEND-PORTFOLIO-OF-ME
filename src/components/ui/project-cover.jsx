import { ArrowUpRight } from 'lucide-react';

/**
 * Original implementation inspired by Maud Benaddi's Notched Project Card:
 * https://21st.dev/@maudbenaddi/components/notched-project-card
 * Adapted to the portfolio's colors and existing Dayweave screenshot.
 */
export default function ProjectCover({ project }) {
  const hostname = new URL(project.deployUrl).hostname;

  return (
    <a
      href={project.deployUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Visit ${project.name} live app (opens in a new tab)`}
      className="group/cover relative block min-w-0 rounded-[1.75rem]"
    >
      <div className="relative flex min-h-[320px] flex-col justify-between overflow-hidden rounded-[1.75rem] border border-white/10 bg-ink-800 px-5 py-6 sm:min-h-[430px] sm:px-8 sm:py-8">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_40%_65%,rgba(136,128,255,0.09),transparent_65%)]" aria-hidden="true" />
        <p className="relative pr-16 font-mono text-[10px] tracking-[0.12em] text-ink-300 uppercase">
          01 / {project.category}
        </p>

        <div className="relative my-8 w-full -rotate-2 overflow-hidden rounded-xl border border-white/12 bg-[#141310] shadow-[0_20px_50px_-20px_rgba(0,0,0,0.8)] transition-transform duration-500 ease-out-expo group-hover/cover:rotate-0 group-hover/cover:scale-[1.02] group-focus-visible/cover:rotate-0 motion-reduce:transform-none motion-reduce:transition-none sm:my-10">
          <div className="flex h-7 items-center gap-1.5 border-b border-white/8 bg-white/3 px-3" aria-hidden="true">
            <span className="size-1.5 rounded-full bg-white/25" />
            <span className="size-1.5 rounded-full bg-white/25" />
            <span className="size-1.5 rounded-full bg-white/25" />
            <span className="ml-3 font-mono text-[8px] tracking-wide text-ink-300">dayweave</span>
          </div>
          <img
            src={project.image}
            alt="Dayweave's live landing page with a daily planner for planning, focusing, and reflecting."
            width="1884"
            height="791"
            loading="lazy"
            decoding="async"
            className="block h-auto w-full"
          />
        </div>

        <div className="relative flex items-center justify-between gap-3 border-t border-white/8 pt-4">
          <span className="min-w-0 truncate font-mono text-[9px] text-ink-300 sm:text-[10px]">
            {hostname}
          </span>
          <span className="shrink-0 text-[10px] text-ink-200">Full-stack app</span>
        </div>
      </div>

      {/* The cutout uses the page surface so the arrow sits outside the cover. */}
      <div className="absolute -right-px -top-px grid size-[74px] place-items-center rounded-bl-[1.75rem] bg-ink-950 pl-2 pb-2" aria-hidden="true">
        <span className="absolute -left-5 top-0 size-5 bg-[radial-gradient(circle_at_bottom_left,transparent_20px,var(--color-ink-950)_20.5px)]" />
        <span className="absolute -bottom-5 right-0 size-5 bg-[radial-gradient(circle_at_bottom_left,transparent_20px,var(--color-ink-950)_20.5px)]" />
        <span className="grid size-12 place-items-center rounded-full border border-white/15 bg-ink-900 text-ink-100 transition-colors duration-300 group-hover/cover:border-accent-300 group-hover/cover:bg-accent-300 group-hover/cover:text-ink-950 group-focus-visible/cover:bg-accent-300 group-focus-visible/cover:text-ink-950">
          <ArrowUpRight className="size-5" />
        </span>
      </div>
    </a>
  );
}
