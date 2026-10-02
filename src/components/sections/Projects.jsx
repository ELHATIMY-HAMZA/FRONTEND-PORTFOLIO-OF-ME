import { ArrowUpRight, FolderGit2, LockKeyhole, ShieldCheck } from 'lucide-react';
import BlurFade from '../ui/blur-fade';
import ProjectCover from '../ui/project-cover';
import SectionHeading from '../ui/section-heading';
import { TechIcon } from '../ui/tech-icons';
import { projects } from '../../content';

export default function Projects() {
  const project = projects.item;

  return (
    <section
      id="projects"
      className="mx-auto max-w-6xl scroll-mt-28 px-6 py-20 sm:py-28"
      aria-label={projects.title}
    >
      <SectionHeading kicker={projects.kicker} icon={FolderGit2} title={projects.title} />

      <BlurFade delay={0.08} yOffset={20} className="mt-10 sm:mt-12">
        <article className="grid items-center gap-8 lg:grid-cols-[1.5fr_1fr] lg:gap-12">
          <ProjectCover project={project} />

          <div className="min-w-0 lg:py-4">
            <p className="flex items-center gap-2 text-xs text-ink-200">
              <span className="size-1.5 rounded-full bg-signal-400" aria-hidden="true" />
              {project.status}
            </p>
            <h3 className="mt-4 text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">
              {project.name}
            </h3>
            <p className="mt-3 text-lg leading-snug text-ink-100">{project.tagline}</p>
            <p className="mt-4 max-w-lg text-sm leading-7 text-ink-200">{project.description}</p>

            <div className="mt-7 border-t border-white/10 pt-5">
              <p className="font-mono text-[10px] tracking-[0.14em] text-ink-300 uppercase">
                Built with MERN
              </p>
              <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-3" aria-label="Project technology stack">
                {project.stack.map((technology) => (
                  <li key={technology.name} className="flex items-center gap-1.5 text-xs text-ink-100">
                    <TechIcon slug={technology.icon} className="size-3.5" mono />
                    {technology.name}
                  </li>
                ))}
              </ul>
              <p className="mt-4 flex items-center gap-1.5 text-xs text-ink-200">
                <ShieldCheck className="size-3.5 text-accent-300" aria-hidden="true" />
                {project.auth}
              </p>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-4">
              <a
                href={project.deployUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex min-h-11 items-center gap-5 rounded-full bg-ink-50 px-5 py-3 text-xs font-semibold text-ink-950 transition-colors hover:bg-accent-100"
              >
                Visit live app
                <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:transform-none" aria-hidden="true" />
              </a>
              {project.isPrivateSource && (
                <span className="inline-flex items-center gap-1.5 text-[11px] text-ink-300">
                  <LockKeyhole className="size-3" aria-hidden="true" />
                  Private source
                </span>
              )}
            </div>
          </div>
        </article>
      </BlurFade>
    </section>
  );
}
