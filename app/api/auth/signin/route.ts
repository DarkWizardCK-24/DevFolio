import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const origin = process.env.NEXT_PUBLIC_SITE_URL ??
    (request.headers.get('x-forwarded-host')
      ? `${request.headers.get('x-forwarded-proto') ?? 'https'}://${request.headers.get('x-forwarded-host')}`
      : requestUrl.origin)
  const next = requestUrl.searchParams.get('next') ?? '/dashboard'

  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
        },
      },
    }
  )

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'github',
    options: {
      redirectTo: `${origin}/api/auth/callback?next=${encodeURIComponent(next)}`,
      skipBrowserRedirect: true,
    },
  })

  if (error || !data.url) {
    return NextResponse.redirect(`${origin}/?error=signin_failed`)
  }

  return NextResponse.redirect(data.url)
}
