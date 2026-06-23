/**
 * TargetCursor — vanilla JS port of the React Bits TargetCursor component.
 * Depends on GSAP (already loaded globally as `gsap`).
 *
 * Usage:
 *   initTargetCursor({
 *     targetSelector: '.cursor-target',
 *     scopeSelector: '#contact',   // cursor is only visible inside this element
 *     spinDuration: 2,
 *     hideDefaultCursor: true,
 *     hoverDuration: 0.2,
 *     parallaxOn: true
 *   });
 */

(function () {
  'use strict';

  // ── helpers ────────────────────────────────────────────────────────────────

  function getContainingBlock(element) {
    let node = element && element.parentElement;
    while (node && node !== document.documentElement) {
      const style = getComputedStyle(node);
      if (
        style.transform !== 'none' ||
        style.perspective !== 'none' ||
        style.filter !== 'none' ||
        style.willChange.includes('transform') ||
        style.willChange.includes('perspective') ||
        style.willChange.includes('filter') ||
        /paint|layout|strict|content/.test(style.contain)
      ) {
        return node;
      }
      node = node.parentElement;
    }
    return null;
  }

  function getContainingBlockOffset(block) {
    if (!block) return { x: 0, y: 0 };
    const rect = block.getBoundingClientRect();
    return { x: rect.left + block.clientLeft, y: rect.top + block.clientTop };
  }

  function isMobileDevice() {
    const hasTouchScreen = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const isSmallScreen = window.innerWidth <= 768;
    const ua = (navigator.userAgent || navigator.vendor || window.opera).toLowerCase();
    const mobileRegex = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i;
    return (hasTouchScreen && isSmallScreen) || mobileRegex.test(ua);
  }

  // ── main init ──────────────────────────────────────────────────────────────

  function initTargetCursor(options) {
    options = Object.assign(
      {
        targetSelector: '.cursor-target',
        scopeSelector: null,
        spinDuration: 2,
        hideDefaultCursor: true,
        hoverDuration: 0.2,
        parallaxOn: true,
      },
      options || {}
    );

    if (isMobileDevice()) return;

    const BORDER_WIDTH = 3;
    const CORNER_SIZE = 12;

    // ── build DOM ────────────────────────────────────────────────────────────
    const wrapper = document.createElement('div');
    wrapper.className = 'target-cursor-wrapper';
    wrapper.innerHTML = `
      <div class="target-cursor-dot"></div>
      <div class="target-cursor-corner corner-tl"></div>
      <div class="target-cursor-corner corner-tr"></div>
      <div class="target-cursor-corner corner-br"></div>
      <div class="target-cursor-corner corner-bl"></div>
    `;
    document.body.appendChild(wrapper);

    const dot = wrapper.querySelector('.target-cursor-dot');
    const corners = Array.from(wrapper.querySelectorAll('.target-cursor-corner'));

    // ── state ────────────────────────────────────────────────────────────────
    let containingBlock = getContainingBlock(wrapper);
    const getOffset = () => getContainingBlockOffset(containingBlock);

    let spinTl = null;
    let activeTarget = null;
    let currentLeaveHandler = null;
    let resumeTimeout = null;
    let isActive = false;
    let targetCornerPositions = null;
    let activeStrength = { current: 0 };

    // ── initial position ─────────────────────────────────────────────────────
    const initialOffset = getOffset();
    gsap.set(wrapper, {
      xPercent: -50,
      yPercent: -50,
      x: window.innerWidth / 2 - initialOffset.x,
      y: window.innerHeight / 2 - initialOffset.y,
    });

    // ── cursor hide ──────────────────────────────────────────────────────────
    const originalCursor = document.body.style.cursor;
    // Only hide the native cursor if we are NOT using scope-based visibility
    // (when scoped, we hide/show it dynamically on section enter/leave instead)
    if (options.hideDefaultCursor && !options.scopeSelector) {
      document.body.style.cursor = 'none';
    }

    // ── scope section visibility ─────────────────────────────────────────────
    // Start fully hidden; only reveal when inside the scoped section.
    gsap.set(wrapper, { autoAlpha: 0 });

    let insideScope = false;
    const scopeEl = options.scopeSelector ? document.querySelector(options.scopeSelector) : null;

    function onScopeEnter() {
      if (insideScope) return;
      insideScope = true;
      if (options.hideDefaultCursor) document.body.style.cursor = 'none';
      gsap.to(wrapper, { autoAlpha: 1, duration: 0.3, ease: 'power2.out' });
      if (spinTl) spinTl.play();
    }

    function onScopeLeave() {
      if (!insideScope) return;
      insideScope = false;
      document.body.style.cursor = originalCursor;
      gsap.to(wrapper, { autoAlpha: 0, duration: 0.3, ease: 'power2.in' });
      if (spinTl) spinTl.pause();
      // Also release any locked target so corners snap back
      if (activeTarget && currentLeaveHandler) currentLeaveHandler();
    }

    if (scopeEl) {
      scopeEl.addEventListener('mouseenter', onScopeEnter);
      scopeEl.addEventListener('mouseleave', onScopeLeave);
    } else {
      // No scope — show immediately and behave as before
      gsap.set(wrapper, { autoAlpha: 1 });
      if (options.hideDefaultCursor) document.body.style.cursor = 'none';
    }

    // ── spin timeline ────────────────────────────────────────────────────────
    function createSpinTimeline() {
      if (spinTl) spinTl.kill();
      spinTl = gsap
        .timeline({ repeat: -1, paused: !!scopeEl })
        .to(wrapper, { rotation: '+=360', duration: options.spinDuration, ease: 'none' });
    }
    createSpinTimeline();

    // ── move cursor ──────────────────────────────────────────────────────────
    function moveCursor(x, y) {
      const { x: ox, y: oy } = getOffset();
      gsap.to(wrapper, { x: x - ox, y: y - oy, duration: 0.1, ease: 'power3.out' });
    }

    // ── ticker for parallax corner tracking ──────────────────────────────────
    function tickerFn() {
      if (!targetCornerPositions || activeStrength.current === 0) return;

      const cursorX = gsap.getProperty(wrapper, 'x');
      const cursorY = gsap.getProperty(wrapper, 'y');
      const strength = activeStrength.current;

      corners.forEach(function (corner, i) {
        const currentX = gsap.getProperty(corner, 'x');
        const currentY = gsap.getProperty(corner, 'y');

        const targetX = targetCornerPositions[i].x - cursorX;
        const targetY = targetCornerPositions[i].y - cursorY;

        const finalX = currentX + (targetX - currentX) * strength;
        const finalY = currentY + (targetY - currentY) * strength;

        const duration = strength >= 0.99 ? (options.parallaxOn ? 0.2 : 0) : 0.05;

        gsap.to(corner, {
          x: finalX,
          y: finalY,
          duration: duration,
          ease: duration === 0 ? 'none' : 'power1.out',
          overwrite: 'auto',
        });
      });
    }

    // ── cleanup active target ────────────────────────────────────────────────
    function cleanupTarget(target) {
      if (currentLeaveHandler) {
        target.removeEventListener('mouseleave', currentLeaveHandler);
      }
      currentLeaveHandler = null;
    }

    // ── enter handler ────────────────────────────────────────────────────────
    function enterHandler(e) {
      const directTarget = e.target;
      let current = directTarget;
      let target = null;

      while (current && current !== document.body) {
        if (current.matches && current.matches(options.targetSelector)) {
          target = current;
          break;
        }
        current = current.parentElement;
      }

      if (!target) return;
      if (activeTarget === target) return;

      if (activeTarget) cleanupTarget(activeTarget);
      if (resumeTimeout) {
        clearTimeout(resumeTimeout);
        resumeTimeout = null;
      }

      activeTarget = target;
      corners.forEach(function (c) { gsap.killTweensOf(c); });

      gsap.killTweensOf(wrapper, 'rotation');
      if (spinTl) spinTl.pause();
      gsap.set(wrapper, { rotation: 0 });

      const rect = target.getBoundingClientRect();
      const { x: ox, y: oy } = getOffset();
      const cursorX = gsap.getProperty(wrapper, 'x');
      const cursorY = gsap.getProperty(wrapper, 'y');

      targetCornerPositions = [
        { x: rect.left  - BORDER_WIDTH - ox,                    y: rect.top    - BORDER_WIDTH - oy },
        { x: rect.right + BORDER_WIDTH - CORNER_SIZE - ox,      y: rect.top    - BORDER_WIDTH - oy },
        { x: rect.right + BORDER_WIDTH - CORNER_SIZE - ox,      y: rect.bottom + BORDER_WIDTH - CORNER_SIZE - oy },
        { x: rect.left  - BORDER_WIDTH - ox,                    y: rect.bottom + BORDER_WIDTH - CORNER_SIZE - oy },
      ];

      isActive = true;
      activeStrength.current = 0;
      gsap.ticker.add(tickerFn);

      gsap.to(activeStrength, {
        current: 1,
        duration: options.hoverDuration,
        ease: 'power2.out',
      });

      corners.forEach(function (corner, i) {
        gsap.to(corner, {
          x: targetCornerPositions[i].x - cursorX,
          y: targetCornerPositions[i].y - cursorY,
          duration: 0.2,
          ease: 'power2.out',
        });
      });

      // ── leave handler ──────────────────────────────────────────────────────
      var leaveHandler = function () {
        gsap.ticker.remove(tickerFn);
        isActive = false;
        targetCornerPositions = null;
        gsap.set(activeStrength, { current: 0, overwrite: true });
        activeTarget = null;

        gsap.killTweensOf(corners);
        var positions = [
          { x: -CORNER_SIZE * 1.5, y: -CORNER_SIZE * 1.5 },
          { x:  CORNER_SIZE * 0.5, y: -CORNER_SIZE * 1.5 },
          { x:  CORNER_SIZE * 0.5, y:  CORNER_SIZE * 0.5 },
          { x: -CORNER_SIZE * 1.5, y:  CORNER_SIZE * 0.5 },
        ];
        var tl = gsap.timeline();
        corners.forEach(function (corner, idx) {
          tl.to(corner, { x: positions[idx].x, y: positions[idx].y, duration: 0.3, ease: 'power3.out' }, 0);
        });

        resumeTimeout = setTimeout(function () {
          if (!activeTarget && spinTl) {
            var currentRotation = gsap.getProperty(wrapper, 'rotation');
            var norm = currentRotation % 360;
            spinTl.kill();
            spinTl = gsap
              .timeline({ repeat: -1 })
              .to(wrapper, { rotation: '+=360', duration: options.spinDuration, ease: 'none' });
            gsap.to(wrapper, {
              rotation: norm + 360,
              duration: options.spinDuration * (1 - norm / 360),
              ease: 'none',
              onComplete: function () { if (spinTl) spinTl.restart(); },
            });
          }
          resumeTimeout = null;
        }, 50);

        cleanupTarget(target);
      };

      currentLeaveHandler = leaveHandler;
      target.addEventListener('mouseleave', leaveHandler);
    }

    // ── scroll correction ────────────────────────────────────────────────────
    function scrollHandler() {
      if (!activeTarget) return;
      const { x: ox, y: oy } = getOffset();
      const mouseX = gsap.getProperty(wrapper, 'x') + ox;
      const mouseY = gsap.getProperty(wrapper, 'y') + oy;
      const el = document.elementFromPoint(mouseX, mouseY);
      const stillOver =
        el && (el === activeTarget || (el.closest && el.closest(options.targetSelector) === activeTarget));
      if (!stillOver && currentLeaveHandler) currentLeaveHandler();
    }

    // ── mouse press feedback ─────────────────────────────────────────────────
    function mouseDownHandler() {
      gsap.to(dot,     { scale: 0.7, duration: 0.3 });
      gsap.to(wrapper, { scale: 0.9, duration: 0.2 });
    }
    function mouseUpHandler() {
      gsap.to(dot,     { scale: 1,   duration: 0.3 });
      gsap.to(wrapper, { scale: 1,   duration: 0.2 });
    }

    // ── resize ───────────────────────────────────────────────────────────────
    function resizeHandler() {
      containingBlock = getContainingBlock(wrapper);
    }

    // ── event listeners ──────────────────────────────────────────────────────
    window.addEventListener('mousemove',  function (e) { moveCursor(e.clientX, e.clientY); });
    window.addEventListener('mouseover',  enterHandler, { passive: true });
    window.addEventListener('scroll',     scrollHandler, { passive: true });
    window.addEventListener('resize',     resizeHandler);
    window.addEventListener('mousedown',  mouseDownHandler);
    window.addEventListener('mouseup',    mouseUpHandler);

    // ── teardown (optional) ──────────────────────────────────────────────────
    return function destroy() {
      gsap.ticker.remove(tickerFn);
      window.removeEventListener('mousemove',  moveCursor);
      window.removeEventListener('mouseover',  enterHandler);
      window.removeEventListener('scroll',     scrollHandler);
      window.removeEventListener('resize',     resizeHandler);
      window.removeEventListener('mousedown',  mouseDownHandler);
      window.removeEventListener('mouseup',    mouseUpHandler);
      if (scopeEl) {
        scopeEl.removeEventListener('mouseenter', onScopeEnter);
        scopeEl.removeEventListener('mouseleave', onScopeLeave);
      }
      if (activeTarget) cleanupTarget(activeTarget);
      if (spinTl) spinTl.kill();
      document.body.style.cursor = originalCursor;
      if (wrapper.parentNode) wrapper.parentNode.removeChild(wrapper);
    };
  }

  window.initTargetCursor = initTargetCursor;
})();
