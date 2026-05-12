import { ReactNode } from 'react';

type Glow = 'cyan' | 'green' | 'purple' | 'none';

export default function TerminalCard({
  title,
  subtitle,
  glow = 'cyan',
  children,
  className = '',
}: {
  title: string;
  subtitle?: string;
  glow?: Glow;
  children: ReactNode;
  className?: string;
}) {
  const glowClass =
    glow === 'cyan' ? 'glow-cyan'
      : glow === 'green' ? 'glow-green'
      : glow === 'purple' ? 'glow-purple'
      : '';

  return (
    <section className={`term-card ${glowClass} ${className}`}>
      <div className="term-card-header">
        <span className="text-[var(--color-neon-cyan)]">{title}</span>
        {subtitle && <span className="text-[var(--color-text-dim)]">{subtitle}</span>}
      </div>
      <div className="term-card-body">{children}</div>
    </section>
  );
}
