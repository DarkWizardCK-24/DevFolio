'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  RiMenu3Line,
  RiCloseLine,
  RiArrowRightLine,
  RiApps2Line,
} from 'react-icons/ri';
import { DEFAULT_GITHUB_USERNAME, DEFAULT_HANDLE } from '@/lib/config';
import { ECOSYSTEM } from '@/lib/ecosystem';
import AuthButton from '@/components/auth/AuthButton';

const links = [
  { href: '/', label: '~/home' },
  { href: `/${DEFAULT_HANDLE}`, label: '~/profile' },
  { href: '/dashboard', label: '~/dashboard' },
];

export default function Navbar() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [appsOpen, setAppsOpen] = useState(false);
  const appsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (appsRef.current && !appsRef.current.contains(e.target as Node)) {
        setAppsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const username = query.trim().replace(/^@/, '');
    if (!username) return;
    setQuery('');
    setOpen(false);
    router.push(`/${username}`);
  }

  return (
    <header className="fixed top-0 inset-x-0 z-50 backdrop-blur-md border-b border-[var(--color-border)] bg-[rgba(5,7,15,0.7)]">
      <div className="container-app flex items-center justify-between h-16 gap-4">
        <Link href="/" className="flex items-center gap-2 group shrink-0">
          <Image src="/logo.png" alt="DevFolio" width={28} height={28} className="rounded-sm opacity-90 group-hover:opacity-100 transition-opacity" />
          <span className="font-bold tracking-wide">
            <span className="text-[var(--color-neon-green)]">dev</span>
            <span className="text-[var(--color-neon-cyan)]">folio</span>
            <span className="text-[var(--color-text-dim)]">.sh</span>
          </span>
        </Link>

        {/* Desktop search */}
        <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-xs">
          <div className="flex items-center w-full rounded border border-[var(--color-border)] bg-[var(--color-surface)] hover:border-[var(--color-neon-cyan)] focus-within:border-[var(--color-neon-cyan)] transition-colors overflow-hidden">
            <span className="pl-3 pr-1 text-xs font-mono text-[var(--color-neon-green)] shrink-0 select-none">~/</span>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="github-username"
              autoComplete="off"
              spellCheck={false}
              className="flex-1 bg-transparent py-1.5 text-xs font-mono text-[var(--color-text)] placeholder:text-[var(--color-text-dim)] outline-none min-w-0"
            />
            <button type="submit" className="shrink-0 px-2.5 py-1.5 text-[var(--color-text-dim)] hover:text-[var(--color-neon-cyan)] transition-colors" aria-label="Look up profile">
              <RiArrowRightLine size={14} />
            </button>
          </div>
        </form>

        <nav className="hidden md:flex items-center gap-1 shrink-0">
          {links.map((l) => (
            <Link key={l.href} href={l.href}
              className="px-3 py-1.5 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-neon-cyan)] hover:bg-[rgba(0,229,255,0.05)] rounded transition-colors">
              {l.label}
            </Link>
          ))}

          {/* Ecosystem dropdown */}
          <div ref={appsRef} className="relative">
            <button
              onClick={() => setAppsOpen(v => !v)}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-sm rounded transition-colors ${appsOpen ? 'text-[var(--color-neon-cyan)] bg-[rgba(0,229,255,0.08)]' : 'text-[var(--color-text-muted)] hover:text-[var(--color-neon-cyan)] hover:bg-[rgba(0,229,255,0.05)]'}`}>
              <RiApps2Line size={14} /> ~/apps
            </button>

            {appsOpen && (
              <div className="absolute right-0 top-full mt-2 w-72 rounded border border-[var(--color-border)] bg-[var(--color-surface)] shadow-2xl z-50 overflow-hidden">
                <div className="px-3 py-2 border-b border-[var(--color-border)] text-[10px] text-[var(--color-text-dim)] uppercase tracking-widest">
                  // deveco ecosystem
                </div>
                <div className="p-2 grid grid-cols-2 gap-1 max-h-72 overflow-y-auto">
                  {ECOSYSTEM.filter(a => a.slug !== 'folio').map(app => (
                    <a key={app.slug} href={app.url} target="_blank" rel="noreferrer"
                      onClick={() => setAppsOpen(false)}
                      className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-[var(--color-surface-2)] transition-colors group">
                      <span className="text-sm shrink-0">{app.icon}</span>
                      <div className="min-w-0">
                        <div className="text-xs font-semibold truncate" style={{ color: app.color }}>{app.name}</div>
                        <div className="text-[10px] text-[var(--color-text-dim)] truncate">{app.desc}</div>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          <AuthButton />
        </nav>

        <button aria-label="toggle menu" className="md:hidden text-[var(--color-text)]" onClick={() => setOpen((v) => !v)}>
          {open ? <RiCloseLine size={24} /> : <RiMenu3Line size={24} />}
        </button>
      </div>

      {open && (
        <nav className="md:hidden border-t border-[var(--color-border)] bg-[var(--color-surface)]">
          <form onSubmit={handleSearch} className="px-4 py-3 border-b border-[var(--color-border)]">
            <div className="flex items-center rounded border border-[var(--color-border)] bg-[var(--color-bg)] focus-within:border-[var(--color-neon-cyan)] overflow-hidden transition-colors">
              <span className="pl-3 pr-1 text-xs font-mono text-[var(--color-neon-green)] shrink-0 select-none">~/</span>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="github-username"
                autoComplete="off"
                spellCheck={false}
                className="flex-1 bg-transparent py-2 text-xs font-mono text-[var(--color-text)] placeholder:text-[var(--color-text-dim)] outline-none min-w-0"
              />
              <button type="submit" className="shrink-0 px-3 py-2 text-[var(--color-text-dim)] hover:text-[var(--color-neon-cyan)] transition-colors" aria-label="Look up profile">
                <RiArrowRightLine size={14} />
              </button>
            </div>
          </form>

          {links.map((l) => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)}
              className="block px-6 py-3 text-sm border-b border-[var(--color-border)] text-[var(--color-text-muted)] hover:text-[var(--color-neon-cyan)]">
              {l.label}
            </Link>
          ))}

          {/* Mobile ecosystem links */}
          <div className="px-4 py-3 border-b border-[var(--color-border)]">
            <div className="text-[10px] text-[var(--color-text-dim)] uppercase tracking-widest mb-2">// ecosystem apps</div>
            <div className="grid grid-cols-2 gap-1">
              {ECOSYSTEM.filter(a => a.slug !== 'folio').map(app => (
                <a key={app.slug} href={app.url} target="_blank" rel="noreferrer" onClick={() => setOpen(false)}
                  className="flex items-center gap-1.5 px-2 py-1.5 rounded hover:bg-[var(--color-surface-2)] transition-colors">
                  <span className="text-xs">{app.icon}</span>
                  <span className="text-xs font-medium" style={{ color: app.color }}>{app.name}</span>
                </a>
              ))}
            </div>
          </div>
        </nav>
      )}
    </header>
  );
}
