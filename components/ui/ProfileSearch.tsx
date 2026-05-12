'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { RiArrowRightLine } from 'react-icons/ri';

export default function ProfileSearch({ placeholder = 'github-username', autoFocus = false }: {
  placeholder?: string;
  autoFocus?: boolean;
}) {
  const router = useRouter();
  const [query, setQuery] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const username = query.trim().replace(/^@/, '');
    if (username) router.push(`/${username}`);
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex items-center rounded border border-[var(--color-border)] bg-[var(--color-surface)] hover:border-[var(--color-neon-cyan)] focus-within:border-[var(--color-neon-cyan)] transition-colors overflow-hidden">
        <span className="pl-4 pr-2 text-sm font-mono text-[var(--color-neon-green)] shrink-0 select-none">
          $ /
        </span>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          autoComplete="off"
          spellCheck={false}
          // eslint-disable-next-line jsx-a11y/no-autofocus
          autoFocus={autoFocus}
          className="flex-1 bg-transparent py-3 text-sm font-mono text-[var(--color-text)] placeholder:text-[var(--color-text-dim)] outline-none min-w-0"
        />
        <button
          type="submit"
          className="shrink-0 px-4 py-3 text-[var(--color-neon-cyan)] hover:bg-[rgba(0,229,255,0.08)] transition-colors"
          aria-label="View profile"
        >
          <RiArrowRightLine size={18} />
        </button>
      </div>
    </form>
  );
}
