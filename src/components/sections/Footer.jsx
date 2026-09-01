import { ArrowUp, Mail } from 'lucide-react';
import BrandMark from '../ui/brand-mark';
import {
  GithubIcon,
  InstagramIcon,
  LinkedinIcon,
} from '../ui/brand-icons';
import { footer, socials } from '../../content';

const links = [
  { href: socials.github, label: 'GitHub', icon: GithubIcon },
  { href: socials.linkedin, label: 'LinkedIn', icon: LinkedinIcon },
  { href: socials.instagram, label: 'Instagram', icon: InstagramIcon },
  { href: socials.email, label: 'Email', icon: Mail },
];

export default function Footer() {
  return (
    <footer className="relative border-t border-white/7 bg-ink-950">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-5 px-6 py-9 sm:flex-row">
        <div className="flex items-center gap-2.5">
          <BrandMark className="size-7" />
          <p className="text-xs text-ink-400">
            © {new Date().getFullYear()} {footer.text}
          </p>
        </div>

        <div className="flex items-center gap-1">
          {links.map(({ href, label, icon: Icon }) => (
            <a
              key={label}
              href={href}
              target={href.startsWith('mailto:') ? undefined : '_blank'}
              rel="noopener noreferrer"
              aria-label={label}
              className="grid size-9 place-items-center rounded-xl border border-transparent text-ink-400 transition-all duration-200 hover:border-white/8 hover:bg-white/4 hover:text-ink-50"
            >
              <Icon className="size-4" />
            </a>
          ))}

          <span className="mx-1.5 h-5 w-px bg-white/8" />

          <a
            href="#home"
            aria-label="Back to top"
            className="grid size-9 place-items-center rounded-xl border border-white/8 bg-white/4 text-ink-300 transition-all duration-200 hover:-translate-y-0.5 hover:text-ink-50"
          >
            <ArrowUp className="size-4" />
          </a>
        </div>
      </div>
    </footer>
  );
}
