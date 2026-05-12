'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { RiArrowRightLine, RiTerminalLine, RiSearchLine } from 'react-icons/ri';
import { DEFAULT_HANDLE } from '@/lib/config';

export default function Hero() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [error, setError] = useState('');

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const username = query.trim().replace(/^@/, '');
    if (!username) {
      setError('enter a github username');
      return;
    }
    setError('');
    router.push(`/${username}`);
  }

  return (
    <section className="container-app pt-12 pb-20">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[var(--color-border)] bg-[rgba(0,229,255,0.04)] mb-6"
      >
        <RiTerminalLine className="text-[var(--color-neon-cyan)]" size={13} />
        <span className="text-[10px] uppercase tracking-[0.2em] text-[var(--color-neon-cyan)]">
          v0.1.0 — public alpha
        </span>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.05 }}
        className="text-4xl sm:text-6xl font-bold leading-[1.05] tracking-tight"
      >
        <span className="text-[var(--color-neon-green)]">$ </span>
        <span>whoami</span>
        <br />
        <span className="text-[var(--color-text-muted)]">&gt;</span>{' '}
        <span className="text-[var(--color-neon-cyan)]">your dev life</span>
        <span className="caret"></span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.15 }}
        className="mt-6 text-base sm:text-lg text-[var(--color-text-muted)] max-w-2xl leading-relaxed"
      >
        DevFolio aggregates your{' '}
        <span className="text-[var(--color-neon-cyan)]">GitHub activity</span>,{' '}
        <span className="text-[var(--color-neon-green)]">learning streaks</span>, and{' '}
        <span className="text-[var(--color-neon-purple)]">pinned snippets</span> into one
        public, terminal-styled portfolio. Built as the hub of a growing developer-tools
        ecosystem.
      </motion.p>

      {/* Username search */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="mt-10 max-w-lg"
      >
        <form onSubmit={handleSearch}>
          <div className="flex items-center gap-0 rounded border border-[var(--color-border)] bg-[var(--color-surface)] hover:border-[var(--color-neon-cyan)] focus-within:border-[var(--color-neon-cyan)] transition-colors overflow-hidden">
            <span className="pl-4 pr-2 text-sm font-mono text-[var(--color-neon-green)] shrink-0 select-none">
              $ devfolio.sh/
            </span>
            <input
              type="text"
              value={query}
              onChange={(e) => { setQuery(e.target.value); setError(''); }}
              placeholder="github-username"
              autoComplete="off"
              spellCheck={false}
              className="flex-1 bg-transparent py-3 text-sm font-mono text-[var(--color-text)] placeholder:text-[var(--color-text-dim)] outline-none min-w-0"
            />
            <button
              type="submit"
              className="shrink-0 px-4 py-3 text-[var(--color-neon-cyan)] hover:bg-[rgba(0,229,255,0.08)] transition-colors"
              aria-label="Search profile"
            >
              <RiArrowRightLine size={18} />
            </button>
          </div>
          {error && (
            <p className="mt-1.5 text-xs text-[var(--color-neon-amber)] pl-1">{error}</p>
          )}
        </form>
        <p className="mt-2 text-[11px] text-[var(--color-text-dim)] pl-1">
          Look up any GitHub profile — try{' '}
          <button
            onClick={() => router.push('/torvalds')}
            className="text-[var(--color-neon-cyan)] hover:underline"
          >
            torvalds
          </button>{' '}
          or{' '}
          <button
            onClick={() => router.push('/gaearon')}
            className="text-[var(--color-neon-cyan)] hover:underline"
          >
            gaearon
          </button>
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.28 }}
        className="mt-6 flex flex-wrap gap-3"
      >
        <Link
          href={`/${DEFAULT_HANDLE}`}
          className="group inline-flex items-center gap-2 px-5 py-2.5 rounded border border-[var(--color-neon-cyan)] bg-[rgba(0,229,255,0.08)] text-[var(--color-neon-cyan)] hover:bg-[rgba(0,229,255,0.16)] transition-colors text-sm"
        >
          <span className="text-[var(--color-neon-green)]">$</span> view demo profile
          <RiArrowRightLine className="group-hover:translate-x-1 transition-transform" />
        </Link>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded border border-[var(--color-border)] hover:border-[var(--color-neon-cyan)] text-[var(--color-text-muted)] hover:text-[var(--color-neon-cyan)] transition-colors text-sm"
        >
          <span className="text-[var(--color-neon-green)]">$</span> setup yours
        </Link>
      </motion.div>

      {/* Terminal preview */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.38 }}
        className="mt-16 term-card glow-cyan max-w-3xl"
      >
        <div className="term-card-header">
          <span className="text-[var(--color-neon-cyan)]">~/devfolio</span>
          <span className="text-[var(--color-text-dim)]">bash</span>
        </div>
        <div className="term-card-body font-mono text-sm space-y-2">
          <div>
            <span className="text-[var(--color-neon-green)]">user@dev</span>
            <span className="text-[var(--color-text-dim)]">:</span>
            <span className="text-[var(--color-neon-cyan)]">~</span>
            <span className="text-[var(--color-text-dim)]">$</span>{' '}
            curl devfolio.sh/{DEFAULT_HANDLE}
          </div>
          <div className="text-[var(--color-text-muted)]">→ fetching profile...</div>
          <div className="text-[var(--color-neon-green)]">[OK]</div>
          <div className="text-[var(--color-text-muted)]">→ aggregating github data...</div>
          <div className="text-[var(--color-neon-green)]">[OK] 42 repos · 1247 contribs · 12-day streak</div>
          <div className="text-[var(--color-text-muted)]">→ loading learning streaks...</div>
          <div className="text-[var(--color-neon-green)]">[OK] 47/120 days · Linux + DevOps Mastery</div>
          <div className="text-[var(--color-text-muted)]">→ pinned snippets: 3</div>
          <div>
            <span className="text-[var(--color-neon-cyan)]">▸ </span>
            <span className="text-[var(--color-text)]">profile rendered in 142ms</span>
          </div>
          <div>
            <span className="text-[var(--color-neon-green)]">user@dev</span>
            <span className="text-[var(--color-text-dim)]">:</span>
            <span className="text-[var(--color-neon-cyan)]">~</span>
            <span className="text-[var(--color-text-dim)]">$</span>{' '}
            <span className="caret"></span>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
