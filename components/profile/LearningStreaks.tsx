import { RiCalendarCheckLine, RiFireLine, RiFlagLine } from 'react-icons/ri';
import TerminalCard from '@/components/ui/TerminalCard';
import type { ProfileData } from '@/lib/profile';

// Deterministic pseudo-random so heatmap is stable across renders
function heatValue(i: number): number {
  return ((i * 2654435761) >>> 0) % 5;
}

export default function LearningStreaks({ profile }: { profile: ProfileData }) {
  const { learning } = profile;
  const remaining = learning.targetDays - learning.elapsedDays;

  return (
    <TerminalCard title="$ cat ~/learning.log" subtitle="active goal" glow="green">
      <div className="flex items-center gap-3 mb-5">
        <RiFlagLine className="text-[var(--color-neon-green)]" size={20} />
        <div>
          <div className="text-base font-semibold text-[var(--color-text)]">
            {learning.goal}
          </div>
          <div className="text-xs text-[var(--color-text-muted)]">
            {learning.elapsedDays}/{learning.targetDays} days · {remaining} remaining
          </div>
        </div>
      </div>

      {/* progress bar */}
      <div className="relative h-2 rounded-full overflow-hidden bg-[var(--color-surface-2)] border border-[var(--color-border)]">
        <div
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-[var(--color-neon-green)] to-[var(--color-neon-cyan)]"
          style={{ width: `${learning.completionPct}%` }}
        />
      </div>
      <div className="mt-1.5 flex justify-between text-[10px] text-[var(--color-text-dim)]">
        <span>0d</span>
        <span className="text-[var(--color-neon-green)]">{learning.completionPct}%</span>
        <span>{learning.targetDays}d</span>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3">
        <div className="flex items-center gap-3 p-3 border border-[var(--color-border)] rounded">
          <RiFireLine className="text-[var(--color-neon-amber)]" size={20} />
          <div>
            <div className="text-xs text-[var(--color-text-muted)]">current streak</div>
            <div className="text-lg font-bold text-[var(--color-neon-amber)]">
              {learning.currentStreak} days
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3 p-3 border border-[var(--color-border)] rounded">
          <RiCalendarCheckLine className="text-[var(--color-neon-cyan)]" size={20} />
          <div>
            <div className="text-xs text-[var(--color-text-muted)]">elapsed</div>
            <div className="text-lg font-bold text-[var(--color-neon-cyan)]">
              {learning.elapsedDays} / {learning.targetDays}
            </div>
          </div>
        </div>
      </div>

      {/* mini contribution heatmap */}
      <div className="mt-6">
        <div className="text-[10px] uppercase tracking-widest text-[var(--color-text-muted)] mb-2">
          // last 60 days
        </div>
        <div className="grid grid-flow-col grid-rows-6 gap-[3px]">
          {Array.from({ length: 60 }).map((_, i) => {
            const intensity = heatValue(i);
            const opacity = [0.06, 0.2, 0.4, 0.65, 0.95][intensity];
            return (
              <div
                key={i}
                className="w-[10px] h-[10px] rounded-sm"
                style={{ background: `rgba(0, 255, 163, ${opacity})` }}
              />
            );
          })}
        </div>
      </div>
    </TerminalCard>
  );
}
