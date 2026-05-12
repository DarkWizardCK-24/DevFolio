'use client';

import { useState } from 'react';
import { RiShareLine, RiCheckLine } from 'react-icons/ri';

export default function ShareButton({ handle }: { handle: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    const url = `${window.location.origin}/${handle}`;
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      const el = document.createElement('input');
      el.value = url;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button
      onClick={copy}
      className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded border border-[var(--color-border)] text-[var(--color-text-muted)] hover:border-[var(--color-neon-cyan)] hover:text-[var(--color-neon-cyan)] transition-colors"
    >
      {copied ? (
        <>
          <RiCheckLine size={13} className="text-[var(--color-neon-green)]" />
          <span className="text-[var(--color-neon-green)]">copied!</span>
        </>
      ) : (
        <>
          <RiShareLine size={13} />
          share
        </>
      )}
    </button>
  );
}
