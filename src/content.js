/**
 * CONTENT — single source of truth.
 *
 * Shared portfolio copy and project details. The original profile content was
 * recovered from the compiled portfolio; project copy is maintained here so
 * the featured section and any future project lists stay consistent.
 */

export const profile = {
  name: 'Hamza Elhatimy',
  initials: 'HE',
  role: 'Full Stack & AI Engineer',
  location: 'Casablanca, Morocco',
  locationLong: 'Casablanca, Morocco (GMT+1)',
  flag: '🇲🇦',
  availability: 'Available for hire',
  email: 'hamzaelhatimy7@gmail.com',
  phone: '+212 609 510 158',
  phoneHref: 'tel:+212609510158',
  timezone: 'Africa/Casablanca',
  /* The "HE" monogram. Derived from the 1254x1254 source PNG (which already
     carried a clean alpha channel, so no white box behind the mark): trimmed
     to the glyph bounds, centred on a square canvas, then emitted as a 256px
     WebP for display and a 192px PNG fallback. The same base feeds
     favicon.ico (16/32/48) and apple-touch-icon.png, which bakes in the
     page background because iOS composites transparent icons on black. */
  logo: {
    webp: '/logo.webp',
    png: '/logo.png',
    size: 192,
  },
  /* The original 1107x1421 PNG was 1.65 MB but renders at ~390px wide.
     These derivatives are 26 KB / 40 KB — a 98% reduction. The PNG is kept
     as the final fallback. */
  avatar: {
    webp800: '/profile-pic-800.webp',
    webp1200: '/profile-pic-1200.webp',
    jpg800: '/profile-pic-800.jpg',
    png: '/profile-pic.png',
    width: 800,
    height: 1027,
  },
};

export const socials = {
  github: 'https://github.com/ELHATIMY-HAMZA',
  linkedin: 'https://linkedin.com/in/hamza-elhatimy',
  instagram: 'https://instagram.com/7amza_el__',
  email: 'mailto:hamzaelhatimy7@gmail.com',
};

export const nav = [
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Projects', href: '#projects' },
  { label: 'Contact', href: '#contact' },
];

export const navCta = { desktop: 'Hire Me', mobile: "Let's Talk" };

export const hero = {
  headline: ['Building scalable ', 'modern web apps', 'with precision & craft.'],
  subheadPrefix: "I'm ",
  subheadRest:
    '. I architect performant full-stack systems, fluid interactive user experiences, and intelligent AI automation pipelines.',
  primaryCta: 'Explore Selected Work',
  secondaryCta: 'Get in Touch',
  stats: [
    { value: '10+', label: 'Shipped Projects', numeric: 10, suffix: '+' },
    { value: '100%', label: 'Quality Commitment', numeric: 100, suffix: '%' },
    { value: '<1s', label: 'Performance Focus', numeric: null },
  ],
};

/** The `developer-profile.ts` card from the original build, verbatim. */
export const devProfile = {
  filename: 'developer-profile.ts',
  version: 'v2.5.0',
  status: 'Status: Online',
  statusValue: 'Ready for Impact',
  stack: ['React', 'Node', 'Python', 'AI'],
  copyIdle: 'Copy Email',
  copyDone: 'Copied!',
};

export const about = {
  kicker: 'Architect & Engineer',
  title: 'About & Philosophy',
  intro:
    'Merging clean software engineering principles with deliberate design craftsmanship to solve real-world problems.',
  architecture: {
    title: 'Full-Stack Architecture with UX-First Thinking',
    body: 'I specialize in bridging the gap between scalable backend systems and refined client interfaces. Every solution is engineered for performance, modularity, and smooth user adoption.',
    tags: ['React 19 & Next.js', 'Scalable REST & APIs', 'AI Automation'],
  },
  based: {
    title: 'Based in Casablanca',
    body: 'Morocco (GMT+1) • Working with clients and teams worldwide.',
    clockLabel: 'Casablanca:',
    clockLoading: 'Loading...',
  },
  ai: {
    title: 'AI & Automation',
    body: 'Leveraging LLM APIs, Claude Code, and n8n agentic workflows to eliminate manual friction.',
    badge: 'Intelligent Pipelines',
  },
  languages: {
    title: 'Multilingual Communication',
    body: 'Fluent in English, French, and Arabic for cross-functional collaboration.',
    chips: ['English (Professional)', 'French (Fluent)', 'Arabic (Native)'],
  },
};

/**
 * SKILLS — three groups, nothing else.
 *
 * The previous shape was a flat `items` array plus four filter pills
 * ("All Stack" + the three real groups). The "All Stack" tab was the default,
 * so the three category labels only ever acted as a way to *hide* two thirds
 * of the stack. Groups are now first-class and all three render at once, and
 * every entry carries an `icon` slug resolved to a real inlined brand mark in
 * `ui/tech-icons.jsx` (the old `iconText`/`hex` pair drew two-letter
 * placeholders and hit a CDN).
 *
 * `MongoDB & MySQL` and `Git & GitHub` were single entries sharing one logo;
 * they are split so each product shows its own mark.
 */
export const skills = {
  kicker: 'Stack & Capabilities',
  title: 'Tech Arsenal',
  groups: [
    {
      id: 'frontend',
      label: 'Frontend',
      blurb: 'Interfaces, motion & real-time 3D',
      items: [
        {
          name: 'JavaScript',
          tag: 'ES6+ / Modern Runtimes',
          icon: 'javascript',
        },
        {
          name: 'React.js',
          tag: 'Hooks / State / Components',
          icon: 'react',
        },
        {
          name: 'Tailwind CSS',
          tag: 'Modern Design Systems',
          icon: 'tailwindcss',
        },
        {
          name: 'Three.js',
          tag: 'WebGL / Interactive 3D',
          icon: 'threedotjs',
        },
      ],
    },
    {
      id: 'backend',
      label: 'Backend & DB',
      blurb: 'APIs, services & data modelling',
      items: [
        {
          name: 'Node.js',
          tag: 'High Concurrency Runtimes',
          icon: 'nodedotjs',
        },
        {
          name: 'Express.js',
          tag: 'REST APIs & Middleware',
          icon: 'express',
        },
        {
          name: 'Python',
          tag: 'Backend & Automation Scripts',
          icon: 'python',
        },
        {
          name: 'MongoDB',
          tag: 'NoSQL Document Stores',
          icon: 'mongodb',
        },
        {
          name: 'MySQL',
          tag: 'Relational Schema Design',
          icon: 'mysql',
        },
      ],
    },
    {
      id: 'tools',
      label: 'AI & Tools',
      blurb: 'Agentic pipelines & delivery',
      items: [
        {
          name: 'Claude & LLM APIs',
          tag: 'Agentic Workflows & Tool Use',
          icon: 'claude',
        },
        {
          name: 'n8n',
          tag: 'Autonomous AI Orchestration',
          icon: 'n8n',
        },
        {
          name: 'Git',
          tag: 'Version Control & Branching',
          icon: 'git',
        },
        {
          name: 'GitHub',
          tag: 'Collaboration & CI/CD',
          icon: 'github',
        },
        {
          name: 'Vite',
          tag: 'Blazing Fast Dev Servers',
          icon: 'vite',
        },
      ],
    },
  ],
};

/** Flat list for the logo marquee — group order preserved. */
export const skillsFlat = skills.groups.flatMap((group) =>
  group.items.map((item) => ({ ...item, group: group.id }))
);

const dayweaveProject = {
  id: 'dayweave',
  name: 'Dayweave',
  title: 'Dayweave — Daily Task Planner',
  category: 'Productivity',
  tagline: 'A calmer way to plan your day.',
  description:
    'Overloaded to-do lists make it hard to know where to start. Dayweave brings time budgeting, task priorities, and focused work into one place, so you can plan a day that fits your actual capacity.',
  image: '/dayweave-preview.webp',
  deployUrl: 'https://dayweave-todo-list-app.vercel.app/',
  link: 'https://dayweave-todo-list-app.vercel.app/',
  badge: 'Live app',
  status: 'Live on Vercel',
  isPrivateSource: true,
  tags: ['MongoDB', 'Express', 'React', 'Node.js', 'Clerk'],
  stack: [
    { name: 'MongoDB', icon: 'mongodb' },
    { name: 'Express', icon: 'express' },
    { name: 'React', icon: 'react' },
    { name: 'Node.js', icon: 'nodedotjs' },
  ],
  auth: 'Clerk authentication',
};

export const projects = {
  kicker: 'Selected Work',
  title: 'Featured Project',
  item: dayweaveProject,
  items: [dayweaveProject],
};

export const contact = {
  pill: 'Start a Conversation',
  title: "Let's create something remarkable together.",
  body: 'Whether you have a full-time role, freelance project, or want to discuss modern tech architecture, my inbox is always open.',
  channels: {
    emailLabel: 'DIRECT EMAIL',
    phoneLabel: 'PHONE / WHATSAPP',
    locationLabel: 'LOCATION',
  },
  fields: {
    name: { label: 'Your Name', placeholder: 'Alex Rivera' },
    email: { label: 'Your Email', placeholder: 'alex@company.com' },
    subject: {
      label: 'Subject / Project Scope',
      placeholder: 'Full-stack Web Application Development',
    },
    message: {
      label: 'Message',
      placeholder: 'Tell me about your goals, timeline, and requirements...',
    },
  },
  submit: 'Send Message',
  submitting: 'Sending...',
  messages: {
    success: 'Thank you! Your message has been sent successfully.',
    simulated: 'Message received! (Local dev simulated response)',
    queued: 'Thank you! Your message has been queued successfully.',
    error: 'Failed to send message. Please reach out directly via email.',
  },
};

export const footer = {
  text: 'Hamza Elhatimy. Designed & built with React & Tailwind.',
};
