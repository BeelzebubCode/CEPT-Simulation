'use client';
import { useState, useRef, useCallback, useEffect } from 'react';

/**
 * In-memory translation cache — shared across all TranslatableText instances.
 * Lives outside component to persist across re-renders without useEffect.
 */
const translationCache = new Map<string, string[]>();

/** Pending fetch promises so we don't fire duplicate requests for same word */
const pendingFetches = new Map<string, Promise<string[]>>();

async function fetchTranslations(word: string): Promise<string[]> {
  const key = word.toLowerCase().trim();
  if (!key) return [];

  // Return cached immediately
  if (translationCache.has(key)) return translationCache.get(key)!;

  // If already fetching, await the same promise (no duplicate)
  if (pendingFetches.has(key)) return pendingFetches.get(key)!;

  const promise = (async () => {
    try {
      const res = await fetch(`/api/translate?text=${encodeURIComponent(key)}&sl=en&tl=th`);
      if (!res.ok) return [key];
      const data = await res.json();
      const translations: string[] = data.translations || [key];
      translationCache.set(key, translations);
      return translations;
    } catch {
      return [key];
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

/**
 * TranslatableText — wraps text so individual words show Thai translation
 * as a dropdown list on hover (desktop) or tap (mobile).
 *
 * ⚠️ NO useEffect used for API calls — translation is triggered ONLY
 * by onMouseEnter / onClick event handlers to prevent loops.
 */
export default function TranslatableText({ text, enabled, className, style }: TranslatableTextProps) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [translations, setTranslations] = useState<string[]>([]);
  const [activeWord, setActiveWord] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    if (hoveredIdx === null) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setHoveredIdx(null);
        setTranslations([]);
        setActiveWord('');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [hoveredIdx]);

  // Split text into words (preserving punctuation attached to words)
  const words = text.split(/(\s+)/);

  const handleMouseEnter = useCallback(async (word: string, idx: number) => {
    if (!enabled) return;
    const clean = word.replace(/[^a-zA-Z'-]/g, '');
    if (!clean || clean.length < 2) return;

    setHoveredIdx(idx);
    setActiveWord(clean);
    setLoading(true);

    const result = await fetchTranslations(clean);
    setTranslations(result);
    setLoading(false);
  }, [enabled]);

  const handleMouseLeave = useCallback(() => {
    // Only close on mouse leave if not clicked (mobile keeps it open)
  }, []);

  const handleClick = useCallback(async (word: string, idx: number) => {
    if (!enabled) return;
    const clean = word.replace(/[^a-zA-Z'-]/g, '');
    if (!clean || clean.length < 2) return;

    // Always speak on every click
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      await new Promise(r => setTimeout(r, 50));
      const u = new SpeechSynthesisUtterance(clean);
      u.lang = 'en-US';
      u.rate = 0.85;
      u.volume = 1.0;
      u.pitch = 1.0;
      window.speechSynthesis.speak(u);
    }

    // Copy to clipboard
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(clean).catch(() => {});
    }

    // If clicking different word, fetch new translations
    if (hoveredIdx !== idx) {
      setHoveredIdx(idx);
      setActiveWord(clean);
      setLoading(true);
      const result = await fetchTranslations(clean);
      setTranslations(result);
      setLoading(false);
    }
    // Re-clicking same word = re-speak, dropdown stays
  }, [enabled, hoveredIdx]);

  if (!enabled) {
    return <span className={className} style={style}>{text}</span>;
  }

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
            onMouseEnter={isWord ? () => handleMouseEnter(word, idx) : undefined}
            onMouseLeave={handleMouseLeave}
            onClick={isWord ? (e) => { e.stopPropagation(); e.preventDefault(); handleClick(word, idx); } : undefined}
            style={{ position: 'relative', display: 'inline' }}
          >
            {word}
            {isActive && (
              <div className="translate-dropdown" ref={dropdownRef}>
                <div className="translate-dropdown-header">
                  <span className="translate-dropdown-word">{activeWord}</span>
                  <button
                    className="translate-dropdown-speak"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (window.speechSynthesis) {
                        window.speechSynthesis.cancel();
                        const u = new SpeechSynthesisUtterance(activeWord);
                        u.lang = 'en-US'; u.rate = 0.85; u.volume = 1.0;
                        window.speechSynthesis.speak(u);
                      }
                    }}
                  >🔊</button>
                </div>
                {loading ? (
                  <div className="translate-dropdown-loading">
                    <span>•••</span>
                  </div>
                ) : (
                  <div className="translate-dropdown-list">
                    {translations.map((t, i) => (
                      <div key={i} className="translate-dropdown-item">{t}</div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </span>
        );
      })}
    </span>
  );
}
