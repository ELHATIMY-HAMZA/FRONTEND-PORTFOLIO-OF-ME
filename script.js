// ===== Three.js 3D Background =====
const canvas = document.getElementById('particle-canvas');
const scene = new THREE.Scene();

// Camera setup
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
camera.position.z = 120;
camera.position.y = 30;

// Renderer setup
const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Create a 3D Particle Wave
const particleCount = 2500;
const geometry = new THREE.BufferGeometry();
const positions = new Float32Array(particleCount * 3);
const colors = new Float32Array(particleCount * 3);

const color1 = new THREE.Color('#8a2be2'); // accent-1 (purple)
const color2 = new THREE.Color('#00ffff'); // accent-2 (cyan)

for (let i = 0; i < particleCount; i++) {
  // Random positions in a wide area
  const x = (Math.random() - 0.5) * 500;
  const y = (Math.random() - 0.5) * 150 - 20; 
  const z = (Math.random() - 0.5) * 500;
  
  positions[i * 3] = x;
  positions[i * 3 + 1] = y;
  positions[i * 3 + 2] = z;
  
  // Mix colors based on position
  const mixedColor = color1.clone().lerp(color2, Math.random());
  colors[i * 3] = mixedColor.r;
  colors[i * 3 + 1] = mixedColor.g;
  colors[i * 3 + 2] = mixedColor.b;
}

geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

const material = new THREE.PointsMaterial({
  size: 2,
  vertexColors: true,
  transparent: true,
  opacity: 0.8,
  sizeAttenuation: true
});

const particles = new THREE.Points(geometry, material);
scene.add(particles);

// Mouse interaction
let mouseX = 0;
let mouseY = 0;
let targetX = 0;
let targetY = 0;

const windowHalfX = window.innerWidth / 2;
const windowHalfY = window.innerHeight / 2;

document.addEventListener('mousemove', (event) => {
  mouseX = (event.clientX - windowHalfX);
  mouseY = (event.clientY - windowHalfY);
});

// Animation loop
const clock = new THREE.Clock();

function animateParticles() {
  requestAnimationFrame(animateParticles);
  const elapsedTime = clock.getElapsedTime();
  
  // Smoothly move particles object
  particles.rotation.y = elapsedTime * 0.05;
  
  // Wave effect
  const positionsArray = particles.geometry.attributes.position.array;
  for(let i = 0; i < particleCount; i++) {
    const i3 = i * 3;
    const x = positionsArray[i3];
    const z = positionsArray[i3 + 2];
    positionsArray[i3 + 1] = Math.sin(elapsedTime * 0.5 + x * 0.02) * 15 + Math.cos(elapsedTime * 0.5 + z * 0.02) * 15 - 20;
  }
  particles.geometry.attributes.position.needsUpdate = true;
  
  // Camera parallax
  camera.position.x += (mouseX * 0.1 - camera.position.x) * 0.02;
  camera.position.y += (-mouseY * 0.1 - camera.position.y + 30) * 0.02;
  camera.lookAt(scene.position);
  
  renderer.render(scene, camera);
}

animateParticles();

// Handle resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// ===== Cursor Spotlight =====
const spotlight = document.getElementById('cursor-spotlight');
let spotlightActive = false;

document.addEventListener('mousemove', (e) => {
  if (!spotlightActive) {
    spotlight.classList.add('active');
    spotlightActive = true;
  }
  spotlight.style.left = e.clientX + 'px';
  spotlight.style.top = e.clientY + 'px';
});

document.addEventListener('mouseleave', () => {
  spotlight.classList.remove('active');
  spotlightActive = false;
});

// ===== Navbar scroll effect =====
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
});

// ===== Mobile menu toggle =====
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

menuToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  menuToggle.classList.toggle('active');
});

// Close menu on link click
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    menuToggle.classList.remove('active');
  });
});

// ===== Scroll reveal animations =====
const revealElements = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, index) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, index * 60);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

revealElements.forEach(el => revealObserver.observe(el));

// ===== Typing effect =====
const typingEl = document.getElementById('typing-text');
const words = ['Full Stack Developer', 'Web Enthusiast', 'Problem Solver', 'Code Learner'];
let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typeEffect() {
  const currentWord = words[wordIndex];

  if (isDeleting) {
    typingEl.textContent = currentWord.substring(0, charIndex - 1);
    charIndex--;
  } else {
    typingEl.textContent = currentWord.substring(0, charIndex + 1);
    charIndex++;
  }

  let speed = isDeleting ? 40 : 80;

  if (!isDeleting && charIndex === currentWord.length) {
    speed = 2000;
    isDeleting = true;
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    wordIndex = (wordIndex + 1) % words.length;
    speed = 400;
  }

  setTimeout(typeEffect, speed);
}

typeEffect();

// ===== Magnetic effect =====
const magneticElements = document.querySelectorAll('.magnetic');
magneticElements.forEach((el) => {
  el.addEventListener('mousemove', (e) => {
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    el.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px) scale(1.05)`;
  });
  el.addEventListener('mouseleave', () => {
    // Reset to initial transform or blank
    el.style.transform = '';
  });
});

// ===== Active nav link on scroll (pill style) =====
const sections = document.querySelectorAll('section[id]');
const allNavLinks = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
  const scrollY = window.scrollY + 150;
  let currentSection = '';

  sections.forEach(section => {
    const top = section.offsetTop;
    const height = section.offsetHeight;
    const id = section.getAttribute('id');
    if (scrollY >= top && scrollY < top + height) {
      currentSection = id;
    }
  });

  allNavLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${currentSection}`) {
      link.classList.add('active');
    }
  });
});

// ===== Count-up Animation =====
const statNumbers = document.querySelectorAll('.stat .number[data-target]');

const countUpObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const target = parseInt(el.getAttribute('data-target'));
      const suffix = el.getAttribute('data-suffix') || '';
      let current = 0;
      const increment = Math.max(1, Math.floor(target / 40));
      const duration = 1500;
      const stepTime = duration / (target / increment);

      const counter = setInterval(() => {
        current += increment;
        if (current >= target) {
          current = target;
          clearInterval(counter);
        }
        el.textContent = current + suffix;
      }, stepTime);

      countUpObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });

statNumbers.forEach(el => countUpObserver.observe(el));

// ===== 3D Tilt on Skill/Project Cards =====
const tiltCards = document.querySelectorAll('.skill-card, .project-card');

tiltCards.forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -4;
    const rotateY = ((x - centerX) / centerX) * 4;

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
    card.style.setProperty('--mouse-x', `${(x / rect.width) * 100}%`);
    card.style.setProperty('--mouse-y', `${(y / rect.height) * 100}%`);
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.transition = 'transform 0.5s ease';
    setTimeout(() => {
      card.style.transition = '';
    }, 500);
  });
});

// ===== Form handling =====
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = contactForm.querySelector('.btn-gradient');
    const originalText = btn.textContent;
    btn.textContent = 'Sending...';
    btn.style.opacity = '0.7';
    btn.disabled = true;

    setTimeout(() => {
      btn.textContent = 'Message Sent! ✓';
      btn.style.opacity = '1';
      btn.style.background = 'linear-gradient(135deg, #00e676, #22d3c5)';
      btn.style.boxShadow = '0 4px 24px rgba(0, 230, 118, 0.3)';

      setTimeout(() => {
        btn.textContent = originalText;
        btn.style.background = '';
        btn.style.boxShadow = '';
        btn.disabled = false;
        contactForm.reset();
      }, 2500);
    }, 800);
  });
}

// ===== Smooth parallax on mouse move (hero only) =====
const hero = document.querySelector('.hero');
const avatarWrapper = document.querySelector('.avatar-wrapper');

if (hero && avatarWrapper) {
  hero.addEventListener('mousemove', (e) => {
    const rect = hero.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    avatarWrapper.style.transform = `translate(${x * 20}px, ${y * 20}px)`;
  });

  hero.addEventListener('mouseleave', () => {
    avatarWrapper.style.transform = 'translate(0, 0)';
    avatarWrapper.style.transition = 'transform 0.6s ease';
    setTimeout(() => { avatarWrapper.style.transition = ''; }, 600);
  });
}

// ===== Back to Top Button =====
const backToTop = document.getElementById('back-to-top');

window.addEventListener('scroll', () => {
  backToTop.classList.toggle('visible', window.scrollY > 500);
});

backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ===== Three.js Tech Arsenal Background =====
const techArsenalCanvas = document.getElementById('tech-arsenal-canvas');
if (techArsenalCanvas) {
  const taScene = new THREE.Scene();
  const taCamera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
  taCamera.position.z = 200;

  const taRenderer = new THREE.WebGLRenderer({ canvas: techArsenalCanvas, alpha: true, antialias: true });
  taRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  
  // Particles for Tech Arsenal
  const taParticles = new THREE.BufferGeometry();
  const taParticleCount = 400;
  
  const taPositions = new Float32Array(taParticleCount * 3);
  for(let i=0; i<taParticleCount; i++) {
    taPositions[i*3] = (Math.random() - 0.5) * 800;
    taPositions[i*3+1] = (Math.random() - 0.5) * 800;
    taPositions[i*3+2] = (Math.random() - 0.5) * 800;
  }
  
  taParticles.setAttribute('position', new THREE.BufferAttribute(taPositions, 3));
  
  const taMaterial = new THREE.PointsMaterial({
    color: 0x00ffff,
    size: 2.5,
    transparent: true,
    opacity: 0.6
  });
  
  const taPoints = new THREE.Points(taParticles, taMaterial);
  taScene.add(taPoints);
  
  // Add a wireframe icosahedron
  const tkGeo = new THREE.IcosahedronGeometry(100, 1);
  const tkMat = new THREE.MeshBasicMaterial({ color: 0x8a2be2, wireframe: true, transparent: true, opacity: 0.1 });
  const tkMesh = new THREE.Mesh(tkGeo, tkMat);
  taScene.add(tkMesh);

  const taClock = new THREE.Clock();
  
  function animateTA() {
    requestAnimationFrame(animateTA);
    const elapsedTime = taClock.getElapsedTime();
    
    taPoints.rotation.x = elapsedTime * 0.03;
    taPoints.rotation.y = elapsedTime * 0.05;
    
    tkMesh.rotation.x = elapsedTime * 0.1;
    tkMesh.rotation.y = elapsedTime * 0.15;
    
    taRenderer.render(taScene, taCamera);
  }
  
  animateTA();

  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
    gsap.to(tkMesh.rotation, {
      scrollTrigger: { trigger: "#tech-arsenal", start: "top bottom", end: "bottom top", scrub: 1 },
      y: Math.PI * 2, z: Math.PI
    });
    gsap.to(taPoints.position, {
      scrollTrigger: { trigger: "#tech-arsenal", start: "top bottom", end: "bottom top", scrub: 1 },
      y: 100
    });
  }
  
  window.addEventListener('resize', () => {
    if(techArsenalCanvas) {
      const parent = techArsenalCanvas.parentElement;
      if (parent) {
        const width = parent.clientWidth || window.innerWidth;
        const height = parent.clientHeight || window.innerHeight;
        taCamera.aspect = width / height;
        taCamera.updateProjectionMatrix();
        taRenderer.setSize(width, height);
      }
    }
  });
  
  // Trigger initial resize after a small delay to ensure DOM is ready
  setTimeout(() => window.dispatchEvent(new Event('resize')), 100);
}

// ===== Three.js Web Globe Artifact =====
const globeCanvas = document.getElementById('web-globe-canvas');
if (globeCanvas) {
  const globeScene = new THREE.Scene();
  const globeCamera = new THREE.PerspectiveCamera(50, 1, 0.1, 1000);
  globeCamera.position.z = 400;

  const globeRenderer = new THREE.WebGLRenderer({ canvas: globeCanvas, alpha: true, antialias: true });
  globeRenderer.setSize(450, 450);
  globeRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Create a Geodesic Sphere for the "Web" look
  const sphereGeo = new THREE.IcosahedronGeometry(160, 2);
  
  // Wireframe Globe
  const wireframeMat = new THREE.MeshBasicMaterial({
    color: 0x8a2be2,
    wireframe: true,
    transparent: true,
    opacity: 0.15
  });
  const wireframeGlobe = new THREE.Mesh(sphereGeo, wireframeMat);
  globeScene.add(wireframeGlobe);

  // Points on the Globe
  const particleMat = new THREE.PointsMaterial({
    color: 0x00ffff,
    size: 4,
    transparent: true,
    opacity: 0.8
  });
  const pointsGlobe = new THREE.Points(sphereGeo, particleMat);
  globeScene.add(pointsGlobe);

  const globeClock = new THREE.Clock();

  function animateGlobe() {
    requestAnimationFrame(animateGlobe);
    const elapsedTime = globeClock.getElapsedTime();

    // Slow, elegant rotation
    wireframeGlobe.rotation.y = elapsedTime * 0.08;
    wireframeGlobe.rotation.x = elapsedTime * 0.04;

    pointsGlobe.rotation.y = elapsedTime * 0.08;
    pointsGlobe.rotation.x = elapsedTime * 0.04;

    globeRenderer.render(globeScene, globeCamera);
  }

  animateGlobe();

  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
    gsap.to([wireframeGlobe.rotation, pointsGlobe.rotation], {
      scrollTrigger: { trigger: "#about", start: "top bottom", end: "bottom top", scrub: 1 },
      y: "+=" + Math.PI * 2, x: "+=" + Math.PI
    });
  }
}

// ===== GSAP Scroll-Driven 3D Effects for Hero =====
document.addEventListener("DOMContentLoaded", () => {
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
    gsap.to(camera.position, {
      scrollTrigger: { trigger: "body", start: "top top", end: "bottom bottom", scrub: 1 },
      z: 20, y: -20
    });
    gsap.to(particles.rotation, {
      scrollTrigger: { trigger: "body", start: "top top", end: "bottom bottom", scrub: 2 },
      x: Math.PI / 4, z: Math.PI / 8
    });
  }
});

// ===== Projects Image Reveal =====
const irItems = document.querySelectorAll('.ir-item');
const irCursorImg = document.getElementById('ir-cursor-img');
const irCursorImgEl = document.getElementById('ir-cursor-img-el');

if (irItems.length > 0 && irCursorImg && irCursorImgEl) {
  let isLargeScreen = window.innerWidth >= 768;
  
  window.addEventListener('resize', () => {
    isLargeScreen = window.innerWidth >= 768;
  });

  // Smooth spring-like cursor tracking (vanilla JS equivalent of Framer Motion's useSpring)
  let mx = 0, my = 0;
  let cx = 0, cy = 0;
  
  document.addEventListener('mousemove', (e) => {
    mx = e.clientX;
    my = e.clientY;
  });
  
  function updateIrCursor() {
    if (isLargeScreen && irCursorImg.classList.contains('active')) {
      // Spring physics approximation
      const stiffness = 0.15;
      
      const dx = mx - cx;
      const dy = my - cy;
      
      cx += dx * stiffness;
      cy += dy * stiffness;
      
      irCursorImg.style.left = cx + 'px';
      irCursorImg.style.top = cy + 'px';
    }
    requestAnimationFrame(updateIrCursor);
  }
  updateIrCursor();

  irItems.forEach(item => {
    item.addEventListener('mouseenter', () => {
      if (!isLargeScreen) return;
      const imgSrc = item.getAttribute('data-img');
      if (imgSrc) {
        irCursorImgEl.src = imgSrc;
        irCursorImgEl.alt = item.querySelector('.ir-title').textContent;
        // Snap the cursor image to the exact mouse position immediately on entry
        if (!irCursorImg.classList.contains('active')) {
           cx = mx;
           cy = my;
           irCursorImg.style.left = cx + 'px';
           irCursorImg.style.top = cy + 'px';
        }
        irCursorImg.classList.add('active');
      }
    });
  });
  
  const irList = document.getElementById('ir-projects');
  if (irList) {
    irList.addEventListener('mouseleave', () => {
      irCursorImg.classList.remove('active');
    });
  }
}

// ===== WebGL Fluid Simulation =====
const fluidCanvas = document.getElementById('fluid-canvas');
if (fluidCanvas && typeof WebGLFluid === 'function') {
  WebGLFluid(fluidCanvas, {
    IMMEDIATE: true,
    TRIGGER: 'hover',
    SIM_RESOLUTION: 128,
    DYE_RESOLUTION: 512,
    CAPTURE_RESOLUTION: 512,
    DENSITY_DISSIPATION: 1.5, // Lasts much longer
    VELOCITY_DISSIPATION: 0.8, // Spreads further
    PRESSURE: 0.4,
    PRESSURE_ITERATIONS: 20,
    CURL: 15, // More pronounced smoky swirls
    SPLAT_RADIUS: 0.35, // Much thicker, highly visible trail
    SPLAT_FORCE: 6000,
    SHADING: true,
    COLORFUL: true, // Uses vibrant, contrasting neon colors
    COLOR_UPDATE_SPEED: 10,
    PAUSED: false,
    BACK_COLOR: { r: 0, g: 0, b: 0 },
    TRANSPARENT: true, // Blends cleanly over the background
    BLOOM: true,
    BLOOM_ITERATIONS: 8,
    BLOOM_RESOLUTION: 256,
    BLOOM_INTENSITY: 0.85, // Much brighter glowing effect
    BLOOM_THRESHOLD: 0.4,
    BLOOM_SOFT_KNEE: 0.7,
    SUNRAYS: true,
    SUNRAYS_RESOLUTION: 196,
    SUNRAYS_WEIGHT: 1.2, // Pronounced light rays
  });

  // Forward mouse events to fluid canvas since it has pointer-events: none
  const forwardEvent = (e) => {
    const clone = new MouseEvent(e.type, {
      clientX: e.clientX,
      clientY: e.clientY,
      bubbles: false,
      cancelable: false
    });
    fluidCanvas.dispatchEvent(clone);
  };
  
  window.addEventListener('mousemove', forwardEvent);
  window.addEventListener('mousedown', forwardEvent);
  window.addEventListener('mouseup', forwardEvent);
  window.addEventListener('touchstart', (e) => {
    if(e.touches.length > 0) {
      fluidCanvas.dispatchEvent(new TouchEvent(e.type, { touches: e.touches }));
    }
  });
  window.addEventListener('touchmove', (e) => {
    if(e.touches.length > 0) {
      fluidCanvas.dispatchEvent(new TouchEvent(e.type, { touches: e.touches }));
    }
  });
  window.addEventListener('touchend', (e) => {
    fluidCanvas.dispatchEvent(new TouchEvent(e.type, { changedTouches: e.changedTouches }));
  });
}
