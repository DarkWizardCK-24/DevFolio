import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse, type NextRequest } from 'next/server';
import { createHandoffTicket, isAllowedRedirect } from '@/lib/cross-app';

// Entry point for child ecosystem apps (e.g. APK Hub) to initiate auth via DevFolio.
// GET /api/auth/cross-app?redirect_to=CHILD_CALLBACK_URL&state=DESTINATION_PATH
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const redirectTo = searchParams.get('redirect_to');
  const state = searchParams.get('state') ?? '/dashboard';

  if (!redirectTo || !isAllowedRedirect(redirectTo)) {
    return NextResponse.redirect(`${origin}/?error=invalid_redirect`);
  }

  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll(); },
        setAll() {},
      },
    },
  );

  const { data: { session } } = await supabase.auth.getSession();

  if (session) {
    // Already authenticated — mint a handoff ticket and send to child app
    const ticket = await createHandoffTicket(session.access_token, session.refresh_token, session.user.id);
    if (!ticket) {
      return NextResponse.redirect(`${origin}/?error=handoff_failed`);
    }
    const url = new URL(redirectTo);
    url.searchParams.set('ticket', ticket);
    url.searchParams.set('state', state);
    return NextResponse.redirect(url.toString());
  }

  // Not authenticated — go through GitHub OAuth, preserving cross-app params
  const signinUrl = new URL(`${origin}/api/auth/signin`);
  signinUrl.searchParams.set('cross_app', 'true');
  signinUrl.searchParams.set('redirect_to', redirectTo);
  signinUrl.searchParams.set('state', state);
  return NextResponse.redirect(signinUrl.toString());
}
