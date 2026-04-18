import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/translate?text=hello&sl=en&tl=th
 * Proxy to Google Translate free endpoint to avoid CORS.
 * Returns { translation: "สวัสดี" }
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const text = searchParams.get('text');
  const sl = searchParams.get('sl') || 'en';
  const tl = searchParams.get('tl') || 'th';

  if (!text) {
    return NextResponse.json({ error: 'Missing text parameter' }, { status: 400 });
  }

  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${encodeURIComponent(sl)}&tl=${encodeURIComponent(tl)}&dt=t&q=${encodeURIComponent(text)}`;
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0' },
    });

    if (!res.ok) {
      return NextResponse.json({ error: 'Translation service error' }, { status: 502 });
    }

    const data = await res.json();
    // Google returns nested arrays: [[["translated","original",...],...],...]
    let translation = '';
    if (Array.isArray(data) && Array.isArray(data[0])) {
      translation = data[0].map((seg: string[]) => seg[0]).join('');
    }

    return NextResponse.json({ translation });
  } catch {
    return NextResponse.json({ error: 'Translation failed' }, { status: 500 });
  }
}
