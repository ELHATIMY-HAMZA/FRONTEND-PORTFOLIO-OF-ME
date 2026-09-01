'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Check, Copy, MapPin } from 'lucide-react';
import BlurFade from '../ui/blur-fade';
import BorderBeam from '../ui/border-beam';
import NumberTicker from '../ui/number-ticker';
import AnimatedShinyText from '../ui/animated-shiny-text';
import { devProfile, hero, profile } from '../../content';

/**
 * Hero.
 *
 * Layout: asymmetric 7/5 split. Copy leads on the left, the portrait anchors
 * the right. The old build buried the photo behind a 3D-tilt gimmick and put a
 * static code block in the hero instead; here the portrait is the focal point
 * and the `developer-profile.ts` data becomes a quiet mono strip beneath it.
 */
export default function Hero() {
  const [copied, setCopied] = useState(false);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable — non-critical */
    }
  };

  return (
    <section
      id="home"
      className="relative mx-auto grid max-w-6xl grid-cols-1 items-center gap-14 px-6 pt-32 pb-20 sm:pt-40 lg:grid-cols-12 lg:gap-10 lg:pt-44 lg:pb-28"
    >
      {/* ---------------------------------------------------------------- Copy */}
      <div className="lg:col-span-7">
        <BlurFade delay={0.05} inView={false}>
          {/* The location half is hidden below `sm`: at 390px the role and the
              location each wrapped to two lines and the flag landed alone on a
              third. The location still appears in About and Contact. */}
          <div className="inline-flex items-center gap-2.5 rounded-full border border-white/8 bg-white/4 py-1.5 pr-3.5 pl-2 backdrop-blur-md">
            <span className="relative flex size-2 shrink-0">
              <span className="animate-pulse-ring absolute inline-flex size-full rounded-full bg-accent-400" />
              <span className="relative inline-flex size-2 rounded-full bg-accent-400" />
            </span>
            <AnimatedShinyText className="text-xs font-medium whitespace-nowrap text-ink-200">
              {profile.role}
            </AnimatedShinyText>
            <span className="hidden h-3 w-px bg-white/12 sm:block" />
            <span className="hidden items-center gap-1 text-xs whitespace-nowrap text-ink-300 sm:flex">
              <MapPin className="size-3 shrink-0 text-ink-400" />
              {profile.location} {profile.flag}
            </span>
          </div>
        </BlurFade>

        <BlurFade delay={0.14} inView={false}>
          {/* Capped at 3.5rem: at 4.15rem the third line ("with precision &
              craft.") overflowed the 7-column track and wrapped to a 4th line. */}
          <h1 className="mt-7 text-[2.35rem] leading-[1.06] font-extrabold tracking-[-0.03em] sm:text-[3rem] lg:text-[3.5rem]">
            {hero.headline[0].trim()}
            <br />
            <span className="text-gradient">{hero.headline[1]}</span>
            <br />
            <span className="text-ink-400">{hero.headline[2]}</span>
          </h1>
        </BlurFade>

        <BlurFade delay={0.22} inView={false}>
          <p className="mt-6 max-w-xl text-[15px] leading-relaxed text-ink-300 sm:text-base">
            {hero.subheadPrefix}
            <strong className="font-semibold text-ink-100">
              {profile.name}
            </strong>
            {hero.subheadRest}
          </p>
        </BlurFade>

        <BlurFade delay={0.3} inView={false}>
          <div className="mt-9 flex flex-wrap items-center gap-3">
            <a
              href="#projects"
              className="group inline-flex items-center gap-2 rounded-full bg-accent-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-accent-950/50 transition-all duration-300 hover:-translate-y-0.5 hover:bg-accent-500 hover:shadow-xl hover:shadow-accent-900/50"
            >
              {hero.primaryCta}
              <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
            </a>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/4 px-6 py-3 text-sm font-medium text-ink-100 backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:border-white/16 hover:bg-white/8"
            >
              {hero.secondaryCta}
            </a>
          </div>
        </BlurFade>

        {/* Stats — now animated on scroll-in rather than static text */}
        <BlurFade delay={0.38} inView={false}>
          <dl className="mt-12 grid max-w-lg grid-cols-3 gap-6 border-t border-white/7 pt-7">
            {hero.stats.map((stat) => (
              <div key={stat.label}>
                <dt className="sr-only">{stat.label}</dt>
                <dd className="font-mono text-2xl font-bold tracking-tight text-ink-50 sm:text-3xl">
                  {stat.numeric !== null ? (
                    <NumberTicker
                      value={stat.numeric}
                      suffix={stat.suffix}
                      delay={0.5}
                    />
                  ) : (
                    stat.value
                  )}
                </dd>
                <p className="mt-1 text-xs text-ink-400">{stat.label}</p>
              </div>
            ))}
          </dl>
        </BlurFade>
      </div>

      {/* ------------------------------------------------------------- Portrait */}
      <div className="lg:col-span-5">
        <BlurFade delay={0.2} yOffset={24} inView={false}>
          <motion.div
            whileHover={{ y: -6 }}
            transition={{ type: 'spring', stiffness: 260, damping: 24 }}
            className="group relative mx-auto w-full max-w-[400px] overflow-hidden rounded-[1.75rem] border border-white/9 bg-ink-800/60 p-2 shadow-2xl shadow-black/60 backdrop-blur-xl"
          >
            <BorderBeam
              size={200}
              duration={11}
              colorFrom="#635BFF"
              colorTo="#34D399"
            />

            {/* Photo */}
            <div className="relative aspect-4/5 overflow-hidden rounded-[1.35rem] bg-ink-900">
              <picture>
                <source
                  type="image/webp"
                  srcSet={`${profile.avatar.webp800} 800w, ${profile.avatar.webp1200} 1200w`}
                  sizes="(max-width: 1024px) 90vw, 400px"
                />
                <source type="image/jpeg" srcSet={profile.avatar.jpg800} />
                <img
                  src={profile.avatar.png}
                  alt={`${profile.name} — ${profile.role}`}
                  width={profile.avatar.width}
                  height={profile.avatar.height}
                  fetchPriority="high"
                  decoding="async"
                  className="size-full scale-[1.02] object-cover object-top transition-transform duration-700 ease-out-expo group-hover:scale-105"
                />
              </picture>
              {/* Bottom scrim so the overlay text stays legible */}
              <div className="absolute inset-x-0 bottom-0 h-2/5 bg-linear-to-t from-ink-950 via-ink-950/70 to-transparent" />

              {/* Availability chip */}
              <div className="absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-ink-950/70 px-2.5 py-1 text-[10px] font-medium text-signal-400 backdrop-blur-md">
                <span className="relative flex size-1.5">
                  <span className="animate-pulse-ring absolute inline-flex size-full rounded-full bg-signal-400" />
                  <span className="relative inline-flex size-1.5 rounded-full bg-signal-400" />
                </span>
                {devProfile.statusValue}
              </div>

              {/* Name plate */}
              <div className="absolute inset-x-0 bottom-0 p-4">
                <p className="text-base font-bold tracking-tight text-white">
                  {profile.name}
                </p>
                <p className="mt-0.5 font-mono text-[11px] text-ink-300">
                  {profile.role}
                </p>
              </div>
            </div>

            {/* developer-profile.ts data, as a mono strip */}
            <div className="flex items-center justify-between gap-2 px-3 pt-3 pb-1.5">
              <div className="flex min-w-0 flex-wrap items-center gap-1">
                {devProfile.stack.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-md border border-white/8 bg-white/4 px-1.5 py-0.5 font-mono text-[10px] text-ink-200"
                  >
                    {tech}
                  </span>
                ))}
              </div>
              <button
                type="button"
                onClick={copyEmail}
                aria-label={`Copy email address ${profile.email}`}
                className={`inline-flex shrink-0 items-center gap-1.5 rounded-lg border px-2.5 py-1.5 font-mono text-[10px] transition-all duration-200 ${
                  copied
                    ? 'border-signal-500/40 bg-signal-950/60 text-signal-400'
                    : 'border-white/8 bg-white/4 text-ink-300 hover:border-white/16 hover:text-white'
                }`}
              >
                {copied ? (
                  <>
                    <Check className="size-3" />
                    {devProfile.copyDone}
                  </>
                ) : (
                  <>
                    <Copy className="size-3" />
                    {devProfile.copyIdle}
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </BlurFade>
      </div>
    </section>
  );
}
