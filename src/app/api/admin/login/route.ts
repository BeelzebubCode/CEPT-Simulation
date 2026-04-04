import { NextResponse } from 'next/server';
import { createToken, COOKIE_NAME, MAX_AGE } from '@/lib/auth';

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }

  if (
    typeof body !== 'object' ||
    body === null ||
    typeof (body as Record<string, unknown>).password !== 'string'
  ) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }

  const { password } = body as { password: string };
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword || password !== adminPassword) {
    // Generic message — don't reveal whether the user or password is wrong
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  const token = await createToken();
  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: MAX_AGE,
    path: '/',
  });
  return res;
}
