// Single source of truth for color tokens.
// Mirrors the CSS @theme variables in app/globals.css and the
// AppColors palette in the Flutter project.

export const colors = {
  bg: '#05070F',
  surface: '#0B1020',
  surface2: '#0F1428',
  border: 'rgba(0, 229, 255, 0.15)',
  borderStrong: 'rgba(0, 229, 255, 0.35)',

  neonCyan: '#00E5FF',
  neonBlue: '#4D8CFF',
  neonGreen: '#00FFA3',
  neonRed: '#FF3D71',
  neonPurple: '#8A5BFF',
  neonAmber: '#FFB547',

  text: '#E6F1FF',
  textMuted: '#8B9BB4',
  textDim: '#4D5B72',
} as const;

export const fonts = {
  mono: "'JetBrains Mono', 'Fira Code', ui-monospace, monospace",
} as const;
