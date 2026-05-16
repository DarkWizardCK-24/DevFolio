import { createClient } from '@supabase/supabase-js';

// Allowed origins that can request cross-app auth handoffs
const ALLOWED_ORIGINS = [
  // localhost dev (each app's port)
  'http://localhost:3001', // DevBlog
  'http://localhost:3003', // DevRoadmap
  'http://localhost:3004', // DevCalendar
  'http://localhost:3005', // DevTimer
  'http://localhost:3006', // DevNotes
  'http://localhost:3007', // DevStatus
  'http://localhost:3010', // DevBuildHub / APK Hub
  // Vercel production
  'https://apk-hub-mu.vercel.app',
  'https://code-share-lovat.vercel.app',
  'https://dev-pulse-black.vercel.app',
];

export function isAllowedRedirect(redirectTo: string): boolean {
  try {
    const url = new URL(redirectTo);
    return ALLOWED_ORIGINS.some(origin => url.origin === origin);
  } catch {
    return false;
  }
}

export async function createHandoffTicket(
  accessToken: string,
  refreshToken: string,
  userId: string,
): Promise<string | null> {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } },
  );

  const { data, error } = await supabase
    .from('cross_app_handoffs')
    .insert({ user_id: userId, access_token: accessToken, refresh_token: refreshToken })
    .select('id')
    .single();

  return error ? null : (data as { id: string }).id;
}
