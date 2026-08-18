import { useEffect, useState } from 'react';
import parse from 'html-react-parser';

const legacyScripts = [
  '/smokey-cursor.js',
  '/script.js',
  '/target-cursor.js',
  '/profile-card.js',
];

function loadScript(src) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = resolve;
    script.onerror = reject;
    document.body.appendChild(script);
  });
}

export default function App() {
  const [markup, setMarkup] = useState('');

  useEffect(() => {
    fetch('/portfolio.html')
      .then((response) => {
        if (!response.ok) throw new Error('Unable to load the portfolio content.');
        return response.text();
      })
      .then((html) => {
        const documentCopy = new DOMParser().parseFromString(html, 'text/html');
        documentCopy.querySelectorAll('script').forEach((script) => script.remove());
        setMarkup(documentCopy.body.innerHTML);
      })
      .catch((error) => console.error(error));
  }, []);

  useEffect(() => {
    if (!markup) return;

    let cancelled = false;

    async function startPortfolio() {
      for (const src of legacyScripts) {
        if (cancelled) return;
        await loadScript(src);
      }

      window.lucide?.createIcons();
      window.initProfileCard?.({
        containerId: 'profile-card-mount',
        avatarUrl: '/profile-pic.png',
        name: 'Hamza Elhatimy',
        title: 'Full Stack Developer · Casablanca',
        followText: 'Contact Me',
        onFollowClick: () => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' }),
      });
      window.initTargetCursor?.({
        targetSelector: '.cursor-target',
        scopeSelector: '#contact',
        spinDuration: 2,
        hideDefaultCursor: true,
        hoverDuration: 0.2,
        parallaxOn: true,
      });
    }

    startPortfolio().catch((error) => console.error(error));
    return () => { cancelled = true; };
  }, [markup]);

  return markup ? parse(markup) : <div className="portfolio-loading">Loading portfolio…</div>;
}
