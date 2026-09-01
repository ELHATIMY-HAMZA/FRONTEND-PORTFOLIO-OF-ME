'use client';

import { ArrowUpRight, FolderGit2 } from 'lucide-react';
import { GithubIcon } from '../ui/brand-icons';
import BlurFade from '../ui/blur-fade';
import MagicCard from '../ui/magic-card';
import SectionHeading from '../ui/section-heading';
import { projects, socials } from '../../content';

/**
 * Projects.
 *
 * The old cards used a ±15deg 3D tilt with a soft-light glare and a
 * conic-gradient border — heavy, and broken on touch devices. These use the
 * Magic UI card-spotlight pattern instead: a cursor-tracked radial highlight
 * that costs one pointermove listener and degrades to a plain card.
 */
export default function Projects() {
  return (
    <section
      id="projects"
      className="mx-auto max-w-6xl scroll-mt-28 px-6 py-20 sm:py-28"
    >
      <SectionHeading
        kicker={projects.kicker}
        icon={FolderGit2}
        title={projects.title}
        aside={
          <a
            href={socials.github}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-1.5 rounded-full border border-white/8 bg-white/4 px-4 py-2 text-xs font-medium text-ink-200 backdrop-blur-md transition-all duration-300 hover:border-white/16 hover:text-white"
          >
            <GithubIcon className="size-3.5" />
            {projects.allLink}
            <ArrowUpRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        }
      />

      <div className="mt-12 grid grid-cols-1 gap-5 lg:grid-cols-2">
        {projects.items.map((project, i) => (
          <BlurFade key={project.id} delay={0.06 * i} yOffset={20}>
            <MagicCard className="h-full">
              <article className="flex h-full flex-col">
                {/* Thumbnail */}
                <div className="relative aspect-16/9 overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.title}
                    loading="lazy"
                    decoding="async"
                    className="size-full scale-105 object-cover opacity-55 grayscale transition-all duration-700 ease-out-expo group-hover:scale-100 group-hover:opacity-90 group-hover:grayscale-0"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-ink-800 via-ink-800/45 to-transparent" />

                  <span className="absolute top-3.5 left-3.5 rounded-full border border-white/12 bg-ink-950/70 px-2.5 py-1 font-mono text-[10px] font-medium text-ink-100 backdrop-blur-md">
                    {project.badge}
                  </span>
                  <span className="absolute top-3.5 right-3.5 rounded-full border border-white/12 bg-ink-950/70 px-2.5 py-1 font-mono text-[10px] text-ink-200 backdrop-blur-md">
                    {project.metric}
                  </span>
                </div>

                {/* Body */}
                <div className="flex flex-1 flex-col p-6">
                  <h3 className="text-base leading-snug font-bold tracking-tight text-ink-50 sm:text-lg">
                    {project.title}
                  </h3>
                  <p className="mt-2.5 flex-1 text-sm leading-relaxed text-ink-300">
                    {project.description}
                  </p>

                  <div className="mt-5 flex flex-wrap gap-1.5">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-md border border-white/8 bg-white/4 px-2 py-0.5 font-mono text-[10px] text-ink-300"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="mt-5 flex items-center gap-2 border-t border-white/7 pt-4">
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-lg border border-white/8 bg-white/4 px-3 py-1.5 text-xs font-medium text-ink-200 transition-colors duration-200 hover:border-white/16 hover:text-white"
                    >
                      <GithubIcon className="size-3.5" />
                      Source
                    </a>
                    <a
                      href={project.link}
                      className="group/cta -my-1 ml-auto inline-flex items-center gap-1 py-2 text-xs font-semibold text-accent-300 transition-colors duration-200 hover:text-accent-200"
                    >
                      View Project
                      <ArrowUpRight className="size-3.5 transition-transform duration-200 group-hover/cta:translate-x-0.5 group-hover/cta:-translate-y-0.5" />
                    </a>
                  </div>
                </div>
              </article>
            </MagicCard>
          </BlurFade>
        ))}
      </div>
    </section>
  );
}
