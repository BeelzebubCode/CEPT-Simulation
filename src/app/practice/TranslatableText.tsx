'use client';
import { useState, useRef, useCallback, useEffect, useMemo } from 'react';

interface PosGroup { pos: string; words: string[]; }
interface TranslateResult { translations: string[]; posGroups: PosGroup[]; }

const POS_ABBR: Record<string, string> = {
  noun: 'n.', verb: 'v.', adjective: 'adj.', adverb: 'adv.',
  pronoun: 'pron.', preposition: 'prep.', conjunction: 'conj.',
  exclamation: 'excl.', determiner: 'det.', abbreviation: 'abbr.',
};

const translationCache = new Map<string, TranslateResult>();
const pendingFetches = new Map<string, Promise<TranslateResult>>();

async function fetchTranslations(word: string): Promise<TranslateResult> {
  const key = word.toLowerCase().trim();
  if (!key) return { translations: [], posGroups: [] };
  if (translationCache.has(key)) return translationCache.get(key)!;
  if (pendingFetches.has(key)) return pendingFetches.get(key)!;

  const promise = (async () => {
    try {
      const res = await fetch(`/api/translate?text=${encodeURIComponent(key)}&sl=en&tl=th&v=2`);
      if (!res.ok) return { translations: [key], posGroups: [] };
      const data = await res.json();
      const result: TranslateResult = {
        translations: data.translations || [key],
        posGroups: data.posGroups || [],
      };
      translationCache.set(key, result);
      return result;
    } catch {
      return { translations: [key], posGroups: [] };
    } finally {
      pendingFetches.delete(key);
    }
  })();

  pendingFetches.set(key, promise);
  return promise;
}

interface TranslatableTextProps {
  text: string;
  enabled: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export default function TranslatableText({ text, enabled, className, style }: TranslatableTextProps) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [result, setResult] = useState<TranslateResult>({ translations: [], posGroups: [] });
  const [activeWord, setActiveWord] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [dropdownPos, setDropdownPos] = useState<{ top: number; left: number }>({ top: 0, left: 0 });
  const dropdownRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (hoveredIdx === null) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setHoveredIdx(null);
        setResult({ translations: [], posGroups: [] });
        setActiveWord('');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [hoveredIdx]);

  const words = useMemo(() => text.split(/(\s+)/), [text]);

  const openDropdown = useCallback((word: string, idx: number, el: HTMLElement) => {
    const rect = el.getBoundingClientRect();
    const dropW = Math.min(220, window.innerWidth * 0.9);
    let left = rect.left + rect.width / 2 - dropW / 2;
    left = Math.max(8, Math.min(left, window.innerWidth - dropW - 8));
    setDropdownPos({ top: rect.bottom + 6, left });
    setHoveredIdx(idx);
    setActiveWord(word.replace(/[^a-zA-Z'-]/g, ''));
  }, []);

  const handleMouseEnter = useCallback(async (word: string, idx: number, e: React.MouseEvent<HTMLSpanElement>) => {
    if (!enabled) return;
    const clean = word.replace(/[^a-zA-Z'-]/g, '');
    if (!clean || clean.length < 2) return;
    openDropdown(word, idx, e.currentTarget);
    setLoading(true);
    const r = await fetchTranslations(clean);
    setResult(r);
    setLoading(false);
  }, [enabled, openDropdown]);

  const handleMouseLeave = useCallback(() => {}, []);

  const handleClick = useCallback(async (word: string, idx: number, e: React.MouseEvent<HTMLSpanElement>) => {
    if (!enabled) return;
    const clean = word.replace(/[^a-zA-Z'-]/g, '');
    if (!clean || clean.length < 2) return;

    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      await new Promise(r => setTimeout(r, 50));
      const u = new SpeechSynthesisUtterance(clean);
      u.lang = 'en-US'; u.rate = 0.85; u.volume = 1.0; u.pitch = 1.0;
      window.speechSynthesis.speak(u);
    }
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(clean).catch(() => {});
    }
    if (hoveredIdx !== idx) {
      openDropdown(word, idx, e.currentTarget);
      setLoading(true);
      const r = await fetchTranslations(clean);
      setResult(r);
      setLoading(false);
    }
  }, [enabled, hoveredIdx, openDropdown]);

  if (!enabled) return <span className={className} style={style}>{text}</span>;

  return (
    <span className={`translatable-container ${className || ''}`} style={style}>
      {words.map((word, idx) => {
        const isWhitespace = /^\s+$/.test(word);
        if (isWhitespace) return <span key={idx}>{word}</span>;

        const clean = word.replace(/[^a-zA-Z'-]/g, '');
        const isWord = clean.length >= 2;
        const isActive = hoveredIdx === idx;

        return (
          <span
            key={idx}
            className={isWord ? `translatable-word${isActive ? ' translatable-active' : ''}` : undefined}
            onMouseEnter={isWord ? (e) => handleMouseEnter(word, idx, e) : undefined}
            onMouseLeave={handleMouseLeave}
            onClick={isWord ? (e) => { e.stopPropagation(); e.preventDefault(); handleClick(word, idx, e); } : undefined}
            style={{ display: 'inline' }}
          >
            {word}
            {isActive && (
              <span className="translate-dropdown" ref={dropdownRef}
                style={{ top: dropdownPos.top, left: dropdownPos.left }}>
                <span className="translate-dropdown-header">
                  <span className="translate-dropdown-word">{activeWord}</span>
                  <span role="button" tabIndex={0} className="translate-dropdown-speak"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (window.speechSynthesis) {
                        window.speechSynthesis.cancel();
                        const u = new SpeechSynthesisUtterance(activeWord);
                        u.lang = 'en-US'; u.rate = 0.85; u.volume = 1.0;
                        window.speechSynthesis.speak(u);
                      }
                    }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>
                  </span>
                </span>
                {loading ? (
                  <span className="translate-dropdown-loading"><span>•••</span></span>
                ) : result.posGroups.length > 0 ? (
                  <span className="translate-dropdown-list">
                    {result.posGroups.map((g, gi) => (
                      <span key={gi} className="translate-pos-group">
                        <span className="translate-pos-label">
                          {POS_ABBR[g.pos] || g.pos}
                        </span>
                        {g.words.map((w, wi) => (
                          <span key={wi} className="translate-dropdown-item">{w}</span>
                        ))}
                      </span>
                    ))}
                  </span>
                ) : (
                  <span className="translate-dropdown-list">
                    {result.translations.map((t, i) => (
                      <span key={i} className="translate-dropdown-item">{t}</span>
                    ))}
                  </span>
                )}
              </span>
            )}
          </span>
        );
      })}
    </span>
  );
}
