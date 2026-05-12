import { IconType } from 'react-icons';

export default function StatTile({
  icon: Icon,
  label,
  value,
  accent = 'cyan',
}: {
  icon: IconType;
  label: string;
  value: string | number;
  accent?: 'cyan' | 'green' | 'purple' | 'amber' | 'red';
}) {
  const color = {
    cyan: 'var(--color-neon-cyan)',
    green: 'var(--color-neon-green)',
    purple: 'var(--color-neon-purple)',
    amber: 'var(--color-neon-amber)',
    red: 'var(--color-neon-red)',
  }[accent];

  return (
    <div className="border border-[var(--color-border)] rounded-md p-4 bg-[rgba(15,20,40,0.4)] hover:border-[var(--color-border-strong)] transition-colors">
      <div className="flex items-center gap-2 text-[var(--color-text-muted)] text-[10px] uppercase tracking-widest">
        <Icon size={12} style={{ color }} />
        {label}
      </div>
      <div className="mt-2 text-2xl font-bold" style={{ color }}>
        {value}
      </div>
    </div>
  );
}
