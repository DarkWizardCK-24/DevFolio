export type EcoApp = {
  name: string;
  slug: string;
  url: string;
  desc: string;
  color: string;
  icon: string;
};

export const ECOSYSTEM: EcoApp[] = [
  { name: 'DevFolio', slug: 'folio', url: 'https://dev-folio-ten-rho.vercel.app', desc: 'your dev profile hub', color: '#00e5ff', icon: '⚡' },
  { name: 'DevBlog', slug: 'blog', url: 'https://dev-blog-zeta-ten.vercel.app', desc: 'write & publish posts', color: '#4d8cff', icon: '✍️' },
  { name: 'DevResume', slug: 'resume', url: 'http://localhost:3002', desc: 'generate PDF resume', color: '#00ff88', icon: '📄' },
  { name: 'DevRoadmap', slug: 'roadmap', url: 'http://localhost:3003', desc: 'skill learning tracks', color: '#00ff88', icon: '🗺️' },
  { name: 'DevCalendar', slug: 'calendar', url: 'https://dev-calendar-phi.vercel.app', desc: 'schedule & goals', color: '#ff6eb4', icon: '📅' },
  { name: 'DevTimer', slug: 'timer', url: 'http://localhost:3005', desc: 'pomodoro focus timer', color: '#ffb547', icon: '⏱️' },
  { name: 'DevNotes', slug: 'notes', url: 'https://dev-notes-inky.vercel.app', desc: 'markdown notes', color: '#8a5bff', icon: '📝' },
  { name: 'DevStatus', slug: 'status', url: 'https://dev-status-nine.vercel.app', desc: 'project status pages', color: '#ff8c42', icon: '📡' },
  { name: 'DevEnv', slug: 'env', url: 'https://dev-env-iota.vercel.app', desc: 'environment vault', color: '#aaff00', icon: '🔐' },
  { name: 'DevWidgets', slug: 'widgets', url: 'http://localhost:3009', desc: 'embeddable widgets', color: '#7c8fff', icon: '🧩' },
  { name: 'DevShare', slug: 'share', url: 'https://code-share-blond.vercel.app', desc: 'share & showcase code snippets', color: '#ff4566', icon: '🔗' },
  { name: 'DevPulse', slug: 'pulse', url: 'https://dev-pulse-liart-omega.vercel.app', desc: 'dev activity & pulse tracker', color: '#00d4aa', icon: '📊' },
  { name: 'DevBuildHub', slug: 'apk', url: 'https://apk-hub-green.vercel.app', desc: 'android APK builds & distribution', color: '#FF6B2B', icon: '📦' },
];
