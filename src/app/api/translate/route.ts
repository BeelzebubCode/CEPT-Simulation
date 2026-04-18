import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/translate?text=hello&sl=en&tl=th
 * Returns { word, translations, posGroups: [{pos, words}] }
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
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${encodeURIComponent(sl)}&tl=${encodeURIComponent(tl)}&dt=t&dt=at&dt=bd&q=${encodeURIComponent(text)}`;
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0' },
      signal: AbortSignal.timeout(5000),
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

    // 2) Part-of-speech groups from dt=bd (index 1)
    // data[1][i] = [posLabel, [thaiWord, thaiWord, ...], detailArray, posLabel, count]
    // posGroup[1] is a plain string array, NOT array-of-arrays
    const posGroups: { pos: string; words: string[] }[] = [];
    if (Array.isArray(data[1])) {
      for (const posGroup of data[1]) {
        const pos = typeof posGroup[0] === 'string' ? posGroup[0] : '';
        const words: string[] = [];
        if (Array.isArray(posGroup[1])) {
          for (const meaning of posGroup[1]) {
            const t = typeof meaning === 'string' ? meaning.trim() : '';
            if (t && t.length >= 2) {
              words.push(t);
              if (!seen.has(t.toLowerCase())) {
                seen.add(t.toLowerCase());
                translations.push(t);
              }
            }
          }
        }
        if (pos && words.length > 0) {
          posGroups.push({ pos, words: words.slice(0, 5) });
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

    if (translations.length === 0) translations.push(text);

    const filtered = translations.filter(t => t.length >= 2);

    return NextResponse.json({
      word: text,
      translations: (filtered.length > 0 ? filtered : translations).slice(0, 8),
      posGroups,
    });
  } catch {
    return NextResponse.json({ error: 'Translation failed' }, { status: 500 });
  }
}
