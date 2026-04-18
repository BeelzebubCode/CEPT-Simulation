import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/translate?text=hello&sl=en&tl=th
 * Proxy to Google Translate free endpoint to avoid CORS.
 * Returns { word: "hello", translations: ["สวัสดี", "หวัดดี", ...] }
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
    // dt=t  → main translation
    // dt=at → alternative translations
    // dt=bd → dictionary (parts of speech + meanings)
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${encodeURIComponent(sl)}&tl=${encodeURIComponent(tl)}&dt=t&dt=at&dt=bd&q=${encodeURIComponent(text)}`;
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0' },
    });

    if (!res.ok) {
      return NextResponse.json({ error: 'Translation service error' }, { status: 502 });
    }

    const data = await res.json();

    const translations: string[] = [];
    const seen = new Set<string>();

    // 1) Main translation from dt=t (index 0)
    if (Array.isArray(data[0])) {
      for (const seg of data[0]) {
        if (seg[0] && typeof seg[0] === 'string') {
          const t = seg[0].trim();
          if (t && !seen.has(t.toLowerCase())) {
            seen.add(t.toLowerCase());
            translations.push(t);
          }
        }
      }
    }

    // 2) Dictionary entries from dt=bd (index 1)
    if (Array.isArray(data[1])) {
      for (const posGroup of data[1]) {
        // posGroup[1] = array of meanings
        if (Array.isArray(posGroup[1])) {
          for (const meaning of posGroup[1]) {
            if (meaning[0] && typeof meaning[0] === 'string') {
              const t = meaning[0].trim();
              if (t && !seen.has(t.toLowerCase())) {
                seen.add(t.toLowerCase());
                translations.push(t);
              }
            }
          }
        }
      }
    }

    // 3) Alternative translations from dt=at (index 5)
    if (Array.isArray(data[5])) {
      for (const altGroup of data[5]) {
        if (Array.isArray(altGroup[2])) {
          for (const alt of altGroup[2]) {
            if (alt[0] && typeof alt[0] === 'string') {
              const t = alt[0].trim();
              if (t && !seen.has(t.toLowerCase())) {
                seen.add(t.toLowerCase());
                translations.push(t);
              }
            }
          }
        }
      }
    }

    // Fallback: if nothing found, use original text
    if (translations.length === 0) {
      translations.push(text);
    }

    // Limit to 8 meanings max
    return NextResponse.json({
      word: text,
      translations: translations.slice(0, 8),
    });
  } catch {
    return NextResponse.json({ error: 'Translation failed' }, { status: 500 });
  }
}
