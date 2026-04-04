export const COOKIE_NAME = '__admin_session';
export const MAX_AGE = 60 * 60 * 8; // 8 hours

async function hmacSHA256(secret: string, data: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(data));
  return Array.from(new Uint8Array(sig))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

// Constant-time comparison to prevent timing attacks
function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export async function createToken(): Promise<string> {
  const secret = process.env.SESSION_SECRET;
  if (!secret) throw new Error('SESSION_SECRET not configured');
  const payload = `admin:${Date.now()}`;
  const sig = await hmacSHA256(secret, payload);
  return `${payload}.${sig}`;
}

export async function verifyToken(token: string): Promise<boolean> {
  const secret = process.env.SESSION_SECRET;
  if (!secret || !token) return false;
  const lastDot = token.lastIndexOf('.');
  if (lastDot === -1) return false;
  const payload = token.substring(0, lastDot);
  const sig = token.substring(lastDot + 1);
  let expected: string;
  try {
    expected = await hmacSHA256(secret, payload);
  } catch {
    return false;
  }
  if (!timingSafeEqual(sig, expected)) return false;
  // Check expiry
  const parts = payload.split(':');
  const ts = parseInt(parts[1], 10);
  if (isNaN(ts) || Date.now() - ts > MAX_AGE * 1000) return false;
  return true;
}

// Use in API route handlers to guard admin-only endpoints
export async function isAdminRequest(request: Request): Promise<boolean> {
  const cookieHeader = request.headers.get('cookie') ?? '';
  const match = cookieHeader.match(
    new RegExp(`(?:^|;\\s*)${COOKIE_NAME}=([^;]*)`),
  );
  if (!match) return false;
  try {
    return await verifyToken(decodeURIComponent(match[1]));
  } catch {
    return false;
  }
}
