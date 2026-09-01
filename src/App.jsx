'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';
import { motion, useScroll, useSpring } from 'motion/react';

import Navbar from './components/sections/Navbar';
import Hero from './components/sections/Hero';
import About from './components/sections/About';
import Skills from './components/sections/Skills';
import Projects from './components/sections/Projects';
import Contact from './components/sections/Contact';
import Footer from './components/sections/Footer';

import DotPattern from './components/ui/dot-pattern';
import Spotlight from './components/ui/spotlight';

/**
 * App.
 *
 * Replaces the previous shell, which fetched `/public/portfolio.html`, stripped
 * its <script> tags, re-parsed the body into React elements with
 * html-react-parser, then sequentially injected four legacy scripts. That made
 * React a loader rather than a component tree, and any error in the injected
 * chain silently killed everything after it.
 */
export default function App() {
  /* Smooth scroll (Lenis) — replaces `scroll-behavior: smooth` + GSAP
     ScrollTrigger. Disabled automatically for reduced-motion users. */
  useEffect(() => {
    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    if (prefersReduced) return;

    const lenis = new Lenis({
      duration: 1.05,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.6,
    });

    let frame;
    const raf = (time) => {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    };
    frame = requestAnimationFrame(raf);

    // Keep anchor links working with Lenis in control of scroll.
    const onAnchorClick = (e) => {
      const anchor = e.target.closest('a[href^="#"]');
      if (!anchor) return;
      const id = anchor.getAttribute('href');
      if (!id || id === '#') return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      lenis.scrollTo(target, { offset: -96 });
    };
    document.addEventListener('click', onAnchorClick);

    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener('click', onAnchorClick);
      lenis.destroy();
    };
  }, []);

  /* Scroll progress bar */
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, {
    stiffness: 260,
    damping: 40,
    restDelta: 0.001,
  });

  return (
    <>
      <motion.div
        style={{ scaleX: progress }}
        className="fixed inset-x-0 top-0 z-[60] h-[2px] origin-left bg-linear-to-r from-accent-500 via-accent-300 to-signal-400"
        aria-hidden="true"
      />

      <a
        href="#home"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[70] focus:rounded-full focus:bg-ink-50 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-ink-950"
      >
        Skip to content
      </a>

      <Navbar />

      {/* Ambient background layer — fixed so it never causes reflow */}
      <div
        className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
        aria-hidden="true"
      >
        <Spotlight />
        <DotPattern className="opacity-55 [mask-image:radial-gradient(720px_circle_at_50%_8%,white,transparent)]" />
        <div className="grid-lines absolute inset-0 opacity-30 [mask-image:linear-gradient(to_bottom,white,transparent_65%)]" />
        <div className="absolute inset-x-0 bottom-0 h-64 bg-linear-to-t from-ink-950 to-transparent" />
      </div>

      <main>
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Contact />
      </main>

      <Footer />
    </>
  );
}
