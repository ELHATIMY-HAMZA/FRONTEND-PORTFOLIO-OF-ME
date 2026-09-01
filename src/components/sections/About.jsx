'use client';

import { forwardRef, useEffect, useRef, useState } from 'react';
import {
  Bot,
  Clock,
  Cpu,
  Database,
  FileJson,
  Globe,
  Languages,
  Layers,
  Sparkles,
  Workflow,
} from 'lucide-react';
import AnimatedBeam from '../ui/animated-beam';
import BlurFade from '../ui/blur-fade';
import MagicCard from '../ui/magic-card';
import SectionHeading from '../ui/section-heading';
import Terminal, { AnimatedSpan, TypingAnimation } from '../ui/terminal';
import { about, devProfile, profile } from '../../content';
import { cn } from '../../lib/utils';

/* -------------------------------------------------------------------------- */
/*  Pipeline node                                                             */
/* -------------------------------------------------------------------------- */

const Node = forwardRef(function Node({ className, children, label, title }, ref) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div
        ref={ref}
        title={title}
        aria-label={title}
        className={cn(
          'z-10 grid size-10 place-items-center rounded-xl border border-white/10 bg-ink-850 shadow-lg shadow-black/50',
          className
        )}
      >
        {children}
      </div>
      {label && (
        <span className="font-mono text-[9px] tracking-wide text-ink-400">
          {label}
        </span>
      )}
    </div>
  );
});

/**
 * AI pipeline diagram — Magic UI "Animated Beam".
 * Chosen because for an AI Engineer, showing the *shape* of an agentic
 * pipeline is stronger evidence than naming the tools in prose.
 *
 * The source nodes are icon-only with a mono legend beneath. With per-node
 * labels the left stack needed ~218px of height inside a 168px box, so it
 * overflowed and collided with the "Intelligent Pipelines" badge.
 */
function PipelineDiagram() {
  const container = useRef(null);
  const src1 = useRef(null);
  const src2 = useRef(null);
  const src3 = useRef(null);
  const core = useRef(null);
  const out = useRef(null);

  return (
    <div>
      <div
        ref={container}
        className="relative flex h-[148px] w-full items-center justify-between px-1"
      >
        <div className="flex flex-col justify-between gap-3">
          <Node ref={src1} title="External APIs">
            <Globe className="size-4 text-accent-300" />
          </Node>
          <Node ref={src2} title="Databases">
            <Database className="size-4 text-accent-300" />
          </Node>
          <Node ref={src3} title="Unstructured documents">
            <FileJson className="size-4 text-accent-300" />
          </Node>
        </div>

        <Node
          ref={core}
          title="LLM agent / tool use"
          className="size-13 border-accent-500/40 bg-accent-950/70 shadow-accent-950"
        >
          <Bot className="size-5.5 text-accent-300" />
        </Node>

        <Node
          ref={out}
          title="n8n workflow automation"
          className="border-signal-500/30 bg-signal-950/60"
        >
          <Workflow className="size-4 text-signal-400" />
        </Node>

        {[src1, src2, src3].map((from, i) => (
          <AnimatedBeam
            key={i}
            containerRef={container}
            fromRef={from}
            toRef={core}
            curvature={[20, 0, -20][i]}
            duration={4.5}
            delay={i * 0.55}
          />
        ))}
        <AnimatedBeam
          containerRef={container}
          fromRef={core}
          toRef={out}
          duration={4.5}
          delay={1.6}
        />
      </div>

      <p className="mt-1 font-mono text-[9.5px] tracking-wide text-ink-400">
        api · db · docs → agent → n8n
      </p>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Live Casablanca clock                                                     */
/* -------------------------------------------------------------------------- */

function CasablancaClock() {
  const [time, setTime] = useState('');

  useEffect(() => {
    const tick = () =>
      setTime(
        new Intl.DateTimeFormat('en-GB', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
          timeZone: profile.timezone,
        }).format(new Date())
      );
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="mt-4 flex items-center justify-between border-t border-white/7 pt-4">
      <span className="flex items-center gap-1.5 font-mono text-[11px] text-ink-400">
        <Clock className="size-3.5 text-accent-400" />
        {about.based.clockLabel}
      </span>
      <span
        className="font-mono text-[11px] font-semibold text-accent-200 tabular-nums"
        aria-live="off"
      >
        {time ? `${time} GMT+1` : about.based.clockLoading}
      </span>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Section                                                                   */
/* -------------------------------------------------------------------------- */

export default function About() {
  return (
    <section
      id="about"
      className="mx-auto max-w-6xl scroll-mt-28 px-6 py-20 sm:py-28"
    >
      <SectionHeading
        kicker={about.kicker}
        icon={Layers}
        title={about.title}
        lead={about.intro}
      />

      {/* Bento: 6-col grid so cards can span 4/2/2/2/3/3 without fighting */}
      <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-6">
        {/* Architecture — wide */}
        <BlurFade delay={0.05} className="md:col-span-4">
          <MagicCard className="h-full">
            <div className="flex h-full flex-col justify-between gap-6 p-7">
              <div>
                <div className="grid size-10 place-items-center rounded-xl border border-accent-500/20 bg-accent-500/10 text-accent-300">
                  <Layers className="size-5" />
                </div>
                <h3 className="mt-5 text-lg font-bold tracking-tight text-ink-50">
                  {about.architecture.title}
                </h3>
                <p className="mt-2.5 max-w-xl text-sm leading-relaxed text-ink-300">
                  {about.architecture.body}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {about.architecture.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-lg border border-white/8 bg-white/4 px-2.5 py-1 font-mono text-[11px] text-ink-200"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </MagicCard>
        </BlurFade>

        {/* Location + clock */}
        <BlurFade delay={0.12} className="md:col-span-2">
          <MagicCard className="h-full">
            <div className="flex h-full flex-col justify-between p-7">
              <div>
                <div className="grid size-10 place-items-center rounded-xl border border-accent-500/20 bg-accent-500/10 text-accent-300">
                  <Globe className="size-5" />
                </div>
                <h3 className="mt-5 text-base font-bold tracking-tight text-ink-50">
                  {about.based.title}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-ink-300">
                  {about.based.body}
                </p>
              </div>
              <CasablancaClock />
            </div>
          </MagicCard>
        </BlurFade>

        {/* AI & Automation + pipeline diagram */}
        <BlurFade delay={0.19} className="md:col-span-3">
          <MagicCard className="h-full">
            <div className="flex h-full flex-col p-7">
              <div className="grid size-10 place-items-center rounded-xl border border-accent-500/20 bg-accent-500/10 text-accent-300">
                <Sparkles className="size-5" />
              </div>
              <h3 className="mt-5 text-base font-bold tracking-tight text-ink-50">
                {about.ai.title}
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-ink-300">
                {about.ai.body}
              </p>

              <div className="mt-5 flex-1">
                <PipelineDiagram />
              </div>

              <div className="mt-2 inline-flex w-fit items-center gap-1.5 rounded-lg border border-signal-500/25 bg-signal-950/50 px-2.5 py-1 font-mono text-[11px] text-signal-400">
                <Cpu className="size-3" />
                {about.ai.badge}
              </div>
            </div>
          </MagicCard>
        </BlurFade>

        {/* Terminal */}
        <BlurFade delay={0.26} className="md:col-span-3">
          <Terminal
            title={devProfile.filename}
            className="h-full max-h-none min-h-[300px]"
          >
            <TypingAnimation className="text-ink-400" delay={200}>
              &gt; cat developer-profile.ts
            </TypingAnimation>
            <AnimatedSpan delay={1600} className="text-ink-200">
              <span>
                <span className="text-accent-400">const</span> developer = {'{'}
              </span>
            </AnimatedSpan>
            <AnimatedSpan delay={1750} className="pl-4 text-ink-200">
              <span>
                <span className="text-ink-400">name:</span>{' '}
                <span className="text-amber-300">'{profile.name}'</span>,
              </span>
            </AnimatedSpan>
            <AnimatedSpan delay={1900} className="pl-4 text-ink-200">
              <span>
                <span className="text-ink-400">role:</span>{' '}
                <span className="text-amber-300">'{profile.role}'</span>,
              </span>
            </AnimatedSpan>
            <AnimatedSpan delay={2050} className="pl-4 text-ink-200">
              <span>
                <span className="text-ink-400">location:</span>{' '}
                <span className="text-amber-300">'{profile.location}'</span>,
              </span>
            </AnimatedSpan>
            <AnimatedSpan delay={2200} className="pl-4 text-ink-200">
              <span>
                <span className="text-ink-400">stack:</span> [
                {devProfile.stack.map((t, i) => (
                  <span key={t}>
                    <span className="text-amber-300">'{t}'</span>
                    {i < devProfile.stack.length - 1 && ', '}
                  </span>
                ))}
                ],
              </span>
            </AnimatedSpan>
            <AnimatedSpan delay={2350} className="pl-4 text-ink-200">
              <span>
                <span className="text-ink-400">status:</span>{' '}
                <span className="text-signal-400">
                  '{devProfile.statusValue}'
                </span>
              </span>
            </AnimatedSpan>
            <AnimatedSpan delay={2500} className="text-ink-200">
              <span>{'};'}</span>
            </AnimatedSpan>
            <AnimatedSpan delay={2750} className="text-signal-400">
              <span>✔ {devProfile.status}</span>
            </AnimatedSpan>
            {/* Live caret so the trailing space reads as an open prompt
                rather than an unfinished layout. */}
            <AnimatedSpan delay={3000} className="text-ink-400">
              <span>
                &gt;{' '}
                <span className="animate-caret inline-block h-3.5 w-1.5 translate-y-px bg-accent-400" />
              </span>
            </AnimatedSpan>
          </Terminal>
        </BlurFade>

        {/* Languages — full-width strip; chips read better on one line */}
        <BlurFade delay={0.33} className="md:col-span-6">
          <MagicCard>
            <div className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <div className="grid size-9 shrink-0 place-items-center rounded-xl border border-accent-500/20 bg-accent-500/10 text-accent-300">
                  <Languages className="size-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold tracking-tight text-ink-50">
                    {about.languages.title}
                  </h3>
                  <p className="mt-0.5 text-xs leading-relaxed text-ink-300">
                    {about.languages.body}
                  </p>
                </div>
              </div>
              <div className="flex shrink-0 flex-wrap gap-2">
                {about.languages.chips.map((chip) => (
                  <span
                    key={chip}
                    className="rounded-md border border-white/8 bg-white/4 px-2.5 py-1 font-mono text-[10px] text-ink-200"
                  >
                    {chip}
                  </span>
                ))}
              </div>
            </div>
          </MagicCard>
        </BlurFade>
      </div>
    </section>
  );
}
