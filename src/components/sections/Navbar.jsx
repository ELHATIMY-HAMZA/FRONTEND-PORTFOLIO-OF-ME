'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowUpRight, Menu, X } from 'lucide-react';
import BrandMark from '../ui/brand-mark';
import { cn } from '../../lib/utils';
import { nav, navCta, profile } from '../../content';

/**
 * Navbar.
 *
 * Design change: the old build used a `sticky` header with a hard border, and
 * variant A used a floating 800px pill. This uses a floating capsule that
 * *contracts* on scroll — the current convention (Aceternity "Resizable
 * Navbar") — plus a scroll-spy pill that slides between links via a
 * shared `layoutId` instead of toggling classes.
 */
export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  // Empty, not '#about': the observer band never matches at scroll-top, so a
  // non-empty initial value made "About" look active on first paint.
  const [active, setActive] = useState('');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Scroll-spy via IntersectionObserver rather than scroll-offset arithmetic.
  useEffect(() => {
    const sections = nav
      .map(({ href }) => document.querySelector(href))
      .filter(Boolean);
    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(`#${visible.target.id}`);
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: [0, 0.2, 0.5, 1] }
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  // Lock body scroll while the mobile sheet is open.
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4 sm:pt-5">
      <motion.nav
        initial={{ y: -24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className={cn(
          'flex w-full items-center justify-between gap-3 rounded-full px-3 py-2 transition-all duration-500 ease-out-expo',
          scrolled
            ? 'glass-strong max-w-3xl shadow-2xl shadow-black/50'
            : 'max-w-5xl border border-transparent bg-transparent'
        )}
      >
        {/* Brand */}
        <a
          href="#home"
          className="group flex shrink-0 items-center gap-2.5 pl-1"
          aria-label={`${profile.name} — home`}
        >
          <BrandMark className="size-10 transition-transform duration-300 ease-out-expo group-hover:scale-108" />
          <span className="hidden text-sm font-semibold text-ink-50 sm:block">
            {profile.name}
          </span>
        </a>

        {/* Links + sliding active pill */}
        <ul className="hidden items-center gap-0.5 md:flex">
          {nav.map(({ label, href }) => {
            const isActive = active === href;
            return (
              <li key={href} className="relative">
                <a
                  href={href}
                  className={cn(
                    'relative block rounded-full px-3.5 py-1.5 text-[13px] font-medium transition-colors duration-200',
                    isActive
                      ? 'text-ink-50'
                      : 'text-ink-300 hover:text-ink-100'
                  )}
                >
                  {isActive && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 -z-10 rounded-full bg-white/7 ring-1 ring-white/8 ring-inset"
                      transition={{
                        type: 'spring',
                        stiffness: 380,
                        damping: 32,
                      }}
                    />
                  )}
                  {label}
                </a>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-2">
          {/* Availability pill */}
          <span className="hidden items-center gap-1.5 rounded-full border border-signal-500/25 bg-signal-950/50 px-2.5 py-1 text-[11px] font-medium text-signal-400 lg:inline-flex">
            <span className="relative flex size-1.5">
              <span className="animate-pulse-ring absolute inline-flex size-full rounded-full bg-signal-400" />
              <span className="relative inline-flex size-1.5 rounded-full bg-signal-400" />
            </span>
            {profile.availability}
          </span>

          {/* Visible at every width: at 390px the bar was just a logo and a
              hamburger, with no direct path to contact. */}
          <a
            href="#contact"
            className="group inline-flex items-center gap-1 rounded-full bg-ink-50 px-3.5 py-1.5 text-[13px] font-semibold text-ink-950 transition-all duration-200 hover:bg-white hover:shadow-lg hover:shadow-white/10 sm:px-4"
          >
            {navCta.desktop}
            <ArrowUpRight className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle Navigation Menu"
            aria-expanded={open}
            className="grid size-9 place-items-center rounded-full border border-white/8 bg-white/5 text-ink-200 transition-colors hover:text-white md:hidden"
          >
            {open ? <X className="size-4" /> : <Menu className="size-4" />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile sheet */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
            className="glass-strong absolute inset-x-4 top-20 rounded-panel p-3 shadow-2xl shadow-black/60 md:hidden"
          >
            <ul className="flex flex-col">
              {nav.map(({ label, href }) => (
                <li key={href}>
                  <a
                    href={href}
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium text-ink-200 transition-colors hover:bg-white/5 hover:text-white"
                  >
                    {label}
                    <ArrowUpRight className="size-3.5 text-ink-400" />
                  </a>
                </li>
              ))}
            </ul>
            <a
              href="#contact"
              onClick={() => setOpen(false)}
              className="mt-2 flex items-center justify-center gap-1.5 rounded-xl bg-accent-600 px-4 py-2.5 text-[13px] font-semibold text-white transition-colors hover:bg-accent-500"
            >
              {navCta.mobile}
              <ArrowUpRight className="size-3.5" />
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
