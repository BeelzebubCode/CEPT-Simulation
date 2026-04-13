import { NextResponse } from 'next/server';
import { createToken, COOKIE_NAME, MAX_AGE } from '@/lib/auth';
import prisma from '@/lib/prisma';

const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes

function getClientIp(req: Request): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0].trim() ??
    req.headers.get('x-real-ip') ??
    'unknown'
  );
}

async function checkRateLimit(ip: string): Promise<boolean> {
  const windowStart = new Date(Date.now() - WINDOW_MS);
  // Cleanup old entries (fire-and-forget, don't block the response)
  prisma.loginAttempt.deleteMany({ where: { createdAt: { lt: windowStart } } }).catch(() => {});
  const count = await prisma.loginAttempt.count({
    where: { ip, createdAt: { gte: windowStart } },
  });
  return count < MAX_ATTEMPTS;
}

async function recordAttempt(ip: string): Promise<void> {
  await prisma.loginAttempt.create({ data: { ip } });
}

async function clearAttempts(ip: string): Promise<void> {
  await prisma.loginAttempt.deleteMany({ where: { ip } });
}

export async function POST(req: Request) {
  const ip = getClientIp(req);

  const allowed = await checkRateLimit(ip);
  if (!allowed) {
    return NextResponse.json(
      { error: 'Too many attempts. Try again in 15 minutes.' },
      { status: 429 },
    );
  }

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
    await recordAttempt(ip);
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  // Success — clear all attempts for this IP
  await clearAttempts(ip);

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
