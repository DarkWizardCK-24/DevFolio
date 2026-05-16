import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Server-to-server: child apps exchange a handoff ticket for Supabase session tokens.
// Authentication: the caller must supply the shared SUPABASE_SERVICE_ROLE_KEY as a Bearer token.
export async function POST(request: NextRequest) {
  const authHeader = request.headers.get('Authorization');
  const secret = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!authHeader || authHeader !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  if (!body?.ticket || typeof body.ticket !== 'string') {
    return NextResponse.json({ error: 'Missing ticket' }, { status: 400 });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } },
  );

  const { data, error } = await supabase
    .from('cross_app_handoffs')
    .select('id, access_token, refresh_token, user_id, expires_at, used')
    .eq('id', body.ticket)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: 'Invalid ticket' }, { status: 401 });
  }

  if (data.used) {
    return NextResponse.json({ error: 'Ticket already used' }, { status: 401 });
  }

  if (new Date(data.expires_at) < new Date()) {
    return NextResponse.json({ error: 'Ticket expired' }, { status: 401 });
  }

  // One-time-use: mark as consumed immediately
  await supabase.from('cross_app_handoffs').update({ used: true }).eq('id', body.ticket);

  return NextResponse.json({
    access_token: data.access_token,
    refresh_token: data.refresh_token,
    user_id: data.user_id,
  });
}
