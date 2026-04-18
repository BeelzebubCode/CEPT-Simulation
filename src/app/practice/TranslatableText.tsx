'use client';
import { useState, useRef, useCallback } from 'react';

/**
 * In-memory translation cache — shared across all TranslatableText instances.
 * Lives outside component to persist across re-renders without useEffect.
 */
const translationCache = new Map<string, string>();

/** Pending fetch promises so we don't fire duplicate requests for same word */
const pendingFetches = new Map<string, Promise<string>>();

async function fetchTranslation(word: string): Promise<string> {
  const key = word.toLowerCase().trim();
  if (!key) return '';

  // Return cached immediately
  if (translationCache.has(key)) return translationCache.get(key)!;

  // If already fetching, await the same promise (no duplicate)
  if (pendingFetches.has(key)) return pendingFetches.get(key)!;

  const promise = (async () => {
    try {
      const res = await fetch(`/api/translate?text=${encodeURIComponent(key)}&sl=en&tl=th`);
      if (!res.ok) return key;
      const data = await res.json();
      const translation = data.translation || key;
      translationCache.set(key, translation);
      return translation;
    } catch {
      return key;
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
 * on hover (desktop) or tap (mobile).
 *
 * ⚠️ NO useEffect used for API calls — translation is triggered ONLY
 * by onMouseEnter / onClick event handlers to prevent loops.
 */
export default function TranslatableText({ text, enabled, className, style }: TranslatableTextProps) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [translation, setTranslation] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const tooltipRef = useRef<HTMLSpanElement>(null);

  // Split text into words (preserving punctuation attached to words)
  const words = text.split(/(\s+)/);

  const handleMouseEnter = useCallback(async (word: string, idx: number) => {
    if (!enabled) return;
    const clean = word.replace(/[^a-zA-Z'-]/g, '');
    if (!clean || clean.length < 2) return; // Skip single chars / punctuation

    setHoveredIdx(idx);
    setLoading(true);

    const result = await fetchTranslation(clean);

    // Only set if still hovering the same word
    setTranslation(result);
    setLoading(false);
  }, [enabled]);

  const handleMouseLeave = useCallback(() => {
    setHoveredIdx(null);
    setTranslation('');
    setLoading(false);
  }, []);

  const handleClick = useCallback(async (word: string, idx: number) => {
    if (!enabled) return;
    const clean = word.replace(/[^a-zA-Z'-]/g, '');
    if (!clean || clean.length < 2) return;

    // Always speak on every click (even re-clicking same word)
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      // Small delay after cancel so browser resets audio pipeline
      await new Promise(r => setTimeout(r, 50));
      const u = new SpeechSynthesisUtterance(clean);
      u.lang = 'en-US';
      u.rate = 0.85;
      u.volume = 1.0; // Max volume
      u.pitch = 1.0;
      window.speechSynthesis.speak(u);
    }

    // Copy to clipboard on every click
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(clean).catch(() => {});
    }

    // If clicking a different word, fetch translation
    if (hoveredIdx !== idx) {
      setHoveredIdx(idx);
      setLoading(true);
      const result = await fetchTranslation(clean);
      setTranslation(result);
      setLoading(false);
    }
    // If clicking same word again — just re-speak (tooltip stays visible)
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
            className={isWord ? 'translatable-word' : undefined}
            onMouseEnter={isWord ? () => handleMouseEnter(word, idx) : undefined}
            onMouseLeave={isWord ? handleMouseLeave : undefined}
            onClick={isWord ? (e) => { e.stopPropagation(); e.preventDefault(); handleClick(word, idx); } : undefined}
            style={{ position: 'relative', display: 'inline' }}
          >
            {word}
            {isActive && (
              <span className="translate-tooltip" ref={tooltipRef}>
                {loading ? (
                  <span className="translate-loading">•••</span>
                ) : (
                  <><span className="translate-tooltip-icon">🔊</span> {translation}</>
                )}
              </span>
            )}
          </span>
        );
      })}
    </span>
  );
}
