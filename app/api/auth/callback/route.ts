import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse, type NextRequest } from 'next/server';
import { createHandoffTicket } from '@/lib/cross-app';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const forwardedHost = request.headers.get('x-forwarded-host')?.split(',')[0].trim();
  const detectedOrigin = forwardedHost ? `https://${forwardedHost}` : new URL(request.url).origin;
  const origin = (process.env.NEXT_PUBLIC_SITE_URL ?? '').replace(/\/$/, '') || detectedOrigin;
  const code = searchParams.get('code');
  const crossApp = searchParams.get('cross_app') === 'true';
  const childRedirect = searchParams.get('child_redirect');
  const childState = searchParams.get('child_state') ?? '/dashboard';
  const next = searchParams.get('next') ?? '/dashboard';

  if (code) {
    const cookieStore = await cookies();
    const pending: { name: string; value: string; options: CookieOptions }[] = [];

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() { return cookieStore.getAll(); },
          setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) { pending.push(...cookiesToSet); },
        },
      },
    );

    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      // Cross-app flow: mint a handoff ticket and redirect back to the child app
      if (crossApp && childRedirect) {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          const ticket = await createHandoffTicket(
            session.access_token,
            session.refresh_token,
            session.user.id,
          );
          if (ticket) {
            const url = new URL(childRedirect);
            url.searchParams.set('ticket', ticket);
            url.searchParams.set('state', childState);
            const response = NextResponse.redirect(url.toString());
            pending.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
            return response;
          }
        }
      }

      const response = NextResponse.redirect(`${origin}${next}`);
      pending.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      return response;
    }
  }

  return NextResponse.redirect(`${origin}/?error=auth_callback_failed`);
}
