/**
 * Interactive 3D Profile Card
 * ─ Default : portrait image fills the card, subtle border.
 * ─ Hover   : image scales up+shrinks via CSS, info panel slides in.
 * ─ Tilt    : spring-based rAF loop tracks mouse → rotateX/rotateY.
 *
 * No external dependencies.
 * Call: initProfileCard({ containerId, avatarUrl, name, title, onFollowClick })
 */

(function () {
  'use strict';

  /* ── Spring config ──────────────────────────────────────────────── */
  const SPRING = {
    stiffness: 180,   // higher = snappier
    damping:   22,    // higher = less bounce
    mass:      1
  };
  const MAX_TILT = 14;   // degrees

  /* ── Spring solver ─────────────────────────────────────────────── */
  function createSpring(initial = 0) {
    let value    = initial;
    let velocity = 0;
    let target   = initial;

    return {
      setTarget(t) { target = t; },
      step(dt) {
        // Critically-damped spring formula
        const force = -SPRING.stiffness * (value - target);
        const damp  = -SPRING.damping * velocity;
        const accel = (force + damp) / SPRING.mass;
        velocity += accel * dt;
        value    += velocity * dt;
        return value;
      },
      get()  { return value; },
      reset(v = 0) { value = v; velocity = 0; target = v; }
    };
  }

  /* ── Build DOM ─────────────────────────────────────────────────── */
  function buildCard(opts) {
    const wrap = document.createElement('div');
    wrap.className = 'lw-tilt-wrapper';
    wrap.id = 'lw-tilt-wrap';

    wrap.innerHTML = `
      <div class="lw-card" id="lw-card">
        <!-- Image layer -->
        <div class="lw-img-container">
          <img
            class="lw-portrait"
            src="${opts.avatarUrl}"
            alt="${opts.name}"
            loading="lazy"
            draggable="false"
          />
          <div class="lw-img-fade"></div>
        </div>

        <!-- Glare (mouse-position spotlight) -->
        <div class="lw-glare"></div>

        <!-- Info panel (revealed on hover) -->
        <div class="lw-info">
          <h3 class="lw-info-name">${opts.name}</h3>
          <p class="lw-info-title">${opts.title}</p>
          <div class="lw-info-actions">
            <div class="lw-status-dot"></div>
            <button class="lw-btn-follow" id="lw-btn-follow" type="button">
              ${opts.followText}
            </button>
          </div>
        </div>
      </div>
    `;

    return wrap;
  }

  /* ── Main init ─────────────────────────────────────────────────── */
  function initProfileCard(options) {
    const opts = Object.assign({
      containerId:   'profile-card-mount',
      avatarUrl:     'profile-pic.png',
      name:          'Hamza Elhatimy',
      title:         'Full Stack Developer · Casablanca',
      followText:    'Contact Me',
      onFollowClick: null
    }, options || {});

    const mount = document.getElementById(opts.containerId);
    if (!mount) { console.warn('[ProfileCard] mount not found:', opts.containerId); return; }

    /* inject */
    mount.innerHTML = '';
    const wrapper = buildCard(opts);
    mount.appendChild(wrapper);

    const cardEl  = wrapper.querySelector('#lw-card');
    const glareEl = wrapper.querySelector('.lw-glare');
    const followBtn = wrapper.querySelector('#lw-btn-follow');

    /* follow / contact button */
    if (followBtn && opts.onFollowClick) {
      followBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        opts.onFollowClick();
      });
    }

    /* ── 3D Tilt engine ─────────────────────────────────────────── */
    const springX = createSpring(0);   // rotateX
    const springY = createSpring(0);   // rotateY

    let rafId      = null;
    let isHovering = false;
    let prevTs     = null;

    function tick(ts) {
      if (prevTs === null) prevTs = ts;
      const dt = Math.min((ts - prevTs) / 1000, 0.05);   // cap at 50ms
      prevTs = ts;

      const rx = springX.step(dt);
      const ry = springY.step(dt);

      wrapper.style.setProperty('--rx', `${rx.toFixed(3)}deg`);
      wrapper.style.setProperty('--ry', `${ry.toFixed(3)}deg`);

      /* keep running while hovering or springs haven't settled */
      const settled =
        Math.abs(rx) < 0.01 && Math.abs(ry) < 0.01 &&
        Math.abs(springX.get() - 0) < 0.01 &&
        Math.abs(springY.get() - 0) < 0.01;

      if (!isHovering && settled) {
        cancelAnimationFrame(rafId);
        rafId = null;
        prevTs = null;
      } else {
        rafId = requestAnimationFrame(tick);
      }
    }

    function startLoop() {
      if (!rafId) {
        prevTs = null;
        rafId = requestAnimationFrame(tick);
      }
    }

    /* ── Pointer events ─────────────────────────────────────────── */
    wrapper.addEventListener('pointermove', (e) => {
      const rect   = cardEl.getBoundingClientRect();
      const px     = e.clientX - rect.left;
      const py     = e.clientY - rect.top;
      const normX  = (px / rect.width)  - 0.5;   // -0.5 → 0.5
      const normY  = (py / rect.height) - 0.5;

      /* rotateX: tilt up/down (invert Y so top = positive) */
      springX.setTarget(-normY * MAX_TILT);
      /* rotateY: tilt left/right */
      springY.setTarget(normX * MAX_TILT);

      /* glare position */
      const gx = ((px / rect.width)  * 100).toFixed(1);
      const gy = ((py / rect.height) * 100).toFixed(1);
      wrapper.style.setProperty('--gx', `${gx}%`);
      wrapper.style.setProperty('--gy', `${gy}%`);

      startLoop();
    });

    wrapper.addEventListener('pointerenter', () => {
      isHovering = true;
      wrapper.classList.remove('is-leaving');
      startLoop();
    });

    wrapper.addEventListener('pointerleave', () => {
      isHovering = false;
      wrapper.classList.add('is-leaving');

      /* spring back to 0 */
      springX.setTarget(0);
      springY.setTarget(0);
      startLoop();

      /* remove leaving class after transition */
      setTimeout(() => wrapper.classList.remove('is-leaving'), 700);
    });

    /* ── Mobile: disable tilt so it doesn't feel broken on touch ── */
    if (window.matchMedia('(hover: none)').matches) {
      /* touch devices — don't tilt */
      wrapper.style.setProperty('--rx', '0deg');
      wrapper.style.setProperty('--ry', '0deg');
    }
  }

  window.initProfileCard = initProfileCard;
})();
