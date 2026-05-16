import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse, type NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const crossApp = searchParams.get('cross_app') === 'true';
  const childRedirectTo = searchParams.get('redirect_to');
  const childState = searchParams.get('state') ?? '/dashboard';

  // Always use the configured site URL so OAuth callbacks never land on localhost.
  // NEXT_PUBLIC_SITE_URL must be set on Vercel (e.g. https://dev-folio-two-rho.vercel.app).
  const forwardedHost = request.headers.get('x-forwarded-host')?.split(',')[0].trim();
  const detectedOrigin = forwardedHost
    ? `https://${forwardedHost}`
    : new URL(request.url).origin;
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? '').replace(/\/$/, '') || detectedOrigin;

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

  // Embed cross-app params into the callback URL so they survive the OAuth round-trip
  let callbackUrl = `${siteUrl}/api/auth/callback`;
  if (crossApp && childRedirectTo) {
    callbackUrl +=
      `?cross_app=true` +
      `&child_redirect=${encodeURIComponent(childRedirectTo)}` +
      `&child_state=${encodeURIComponent(childState)}`;
  }

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'github',
    options: {
      redirectTo: callbackUrl,
      skipBrowserRedirect: true,
    },
  });

  if (error || !data.url) {
    return NextResponse.redirect(`${siteUrl}/?error=oauth_init_failed`);
  }

  const response = NextResponse.redirect(data.url);
  pending.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
  return response;
}
