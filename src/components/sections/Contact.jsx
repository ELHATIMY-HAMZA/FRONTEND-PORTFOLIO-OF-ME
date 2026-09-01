'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  AlertCircle,
  CheckCircle2,
  Loader2,
  Mail,
  MapPin,
  Phone,
  Send,
} from 'lucide-react';
import BlurFade from '../ui/blur-fade';
import BorderBeam from '../ui/border-beam';
import DotPattern from '../ui/dot-pattern';
import { contact, profile } from '../../content';
import { cn } from '../../lib/utils';

const EMPTY = { name: '', email: '', subject: '', message: '' };

/**
 * Contact.
 *
 * Submit logic is preserved from `dist` exactly, including the deliberate
 * 404/405 fallback: `api/send-email.js` is a Vercel serverless function and
 * does not exist under plain `vite dev`, so a missing route is treated as a
 * simulated success rather than surfacing a false error locally.
 */
export default function Contact() {
  const [form, setForm] = useState(EMPTY);
  const [status, setStatus] = useState('idle'); // idle | sending | success | error
  const [feedback, setFeedback] = useState('');

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    setFeedback('');

    try {
      const res = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setStatus('success');
        setFeedback(contact.messages.success);
        setForm(EMPTY);
      } else if (res.status === 404 || res.status === 405) {
        setStatus('success');
        setFeedback(contact.messages.simulated);
        setForm(EMPTY);
      } else {
        const data = await res.json().catch(() => ({}));
        setStatus('error');
        setFeedback(data.error || contact.messages.error);
      }
    } catch {
      setStatus('success');
      setFeedback(contact.messages.queued);
      setForm(EMPTY);
    }
  };

  const channels = [
    {
      icon: Mail,
      label: contact.channels.emailLabel,
      value: profile.email,
      href: `mailto:${profile.email}`,
    },
    {
      icon: Phone,
      label: contact.channels.phoneLabel,
      value: profile.phone,
      href: profile.phoneHref,
    },
    {
      icon: MapPin,
      label: contact.channels.locationLabel,
      value: profile.locationLong,
      href: null,
    },
  ];

  return (
    <section
      id="contact"
      className="mx-auto max-w-6xl scroll-mt-28 px-6 py-20 sm:py-28"
    >
      <BlurFade>
        <div className="relative overflow-hidden rounded-[2rem] border border-white/9 bg-ink-800/45 p-8 backdrop-blur-xl sm:p-12">
          <DotPattern className="opacity-40 [mask-image:radial-gradient(520px_circle_at_top_right,white,transparent)]" />
          <BorderBeam size={320} duration={16} />

          <div className="relative grid grid-cols-1 gap-12 lg:grid-cols-12">
            {/* ------------------------------------------------------- Left */}
            <div className="lg:col-span-5">
              <span className="inline-flex items-center gap-2 rounded-full border border-accent-500/25 bg-accent-500/10 px-3 py-1 font-mono text-[11px] font-semibold tracking-wide text-accent-300">
                <span className="size-1.5 rounded-full bg-accent-400" />
                {contact.pill}
              </span>

              <h2 className="mt-5 text-2xl leading-tight font-extrabold tracking-[-0.028em] sm:text-[2rem]">
                {contact.title}
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-ink-300">
                {contact.body}
              </p>

              <ul className="mt-8 space-y-3">
                {channels.map(({ icon: Icon, label, value, href }) => {
                  const Body = (
                    <>
                      <span className="grid size-9 shrink-0 place-items-center rounded-xl border border-white/8 bg-white/4 text-accent-300 transition-colors duration-200 group-hover:border-accent-500/30 group-hover:bg-accent-500/10">
                        <Icon className="size-4" />
                      </span>
                      <span className="min-w-0">
                        <span className="block font-mono text-[10px] tracking-wider text-ink-400">
                          {label}
                        </span>
                        <span className="block truncate text-sm font-medium text-ink-100">
                          {value}
                        </span>
                      </span>
                    </>
                  );

                  return (
                    <li key={label}>
                      {href ? (
                        <a
                          href={href}
                          className="group flex items-center gap-3 rounded-xl p-1 transition-colors duration-200 hover:bg-white/3"
                        >
                          {Body}
                        </a>
                      ) : (
                        <div className="group flex items-center gap-3 p-1">
                          {Body}
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* ------------------------------------------------------ Form */}
            <div className="lg:col-span-7">
              <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Field
                    name="name"
                    type="text"
                    config={contact.fields.name}
                    value={form.name}
                    onChange={handleChange}
                  />
                  <Field
                    name="email"
                    type="email"
                    config={contact.fields.email}
                    value={form.email}
                    onChange={handleChange}
                  />
                </div>

                <Field
                  name="subject"
                  type="text"
                  config={contact.fields.subject}
                  value={form.subject}
                  onChange={handleChange}
                />

                <Field
                  name="message"
                  as="textarea"
                  rows={4}
                  config={contact.fields.message}
                  value={form.message}
                  onChange={handleChange}
                />

                <AnimatePresence mode="wait">
                  {feedback && (
                    <motion.p
                      key={feedback}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      role="status"
                      aria-live="polite"
                      className={cn(
                        'flex items-center gap-2 overflow-hidden rounded-xl border px-3.5 py-2.5 text-xs font-medium',
                        status === 'error'
                          ? 'border-red-500/25 bg-red-950/40 text-red-300'
                          : 'border-signal-500/25 bg-signal-950/50 text-signal-400'
                      )}
                    >
                      {status === 'error' ? (
                        <AlertCircle className="size-4 shrink-0" />
                      ) : (
                        <CheckCircle2 className="size-4 shrink-0" />
                      )}
                      {feedback}
                    </motion.p>
                  )}
                </AnimatePresence>

                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-accent-600 px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-accent-950/50 transition-all duration-300 hover:-translate-y-0.5 hover:bg-accent-500 disabled:pointer-events-none disabled:opacity-55 sm:w-auto"
                >
                  {status === 'sending' ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      {contact.submitting}
                    </>
                  ) : (
                    <>
                      {contact.submit}
                      <Send className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </BlurFade>
    </section>
  );
}

/* -------------------------------------------------------------------------- */

function Field({ name, config, as = 'input', className, ...props }) {
  const Tag = as;
  const id = `contact-${name}`;

  return (
    <div>
      <label
        htmlFor={id}
        className="mb-1.5 block text-xs font-medium text-ink-200"
      >
        {config.label}
      </label>
      <Tag
        id={id}
        name={name}
        required
        placeholder={config.placeholder}
        className={cn(
          'w-full rounded-xl border border-white/8 bg-white/3 px-4 py-2.5 text-sm text-white transition-all duration-200 placeholder:text-ink-500',
          'focus:border-accent-500 focus:bg-white/5 focus:ring-1 focus:ring-accent-500 focus:outline-none',
          as === 'textarea' && 'resize-none',
          className
        )}
        {...props}
      />
    </div>
  );
}
