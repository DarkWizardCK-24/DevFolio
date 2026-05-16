import { createClient } from '@supabase/supabase-js';

// Allowed origins that can request cross-app auth handoffs
const ALLOWED_ORIGINS = [
  'http://localhost:3010',
  'https://apk-hub-mu.vercel.app',
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
