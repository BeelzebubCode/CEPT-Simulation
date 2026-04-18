'use client';
import { useEffect, useState, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Volume2, VolumeX, Image, ChevronLeft, ChevronRight, CheckCircle, XCircle, Sparkles, Loader2, Shuffle, Languages } from 'lucide-react';
import TranslatableText from './TranslatableText';

interface Choice { id: string; label: string; text: string; imageUrl?: string; isCorrect: boolean; order: number; blankNumber?: number; }
interface Question { id: string; text: string; passage?: string; speechText?: string; imageUrl?: string; order: number; choices: Choice[]; }
interface Section { id: string; name: string; description?: string; type: string; timeLimit: number; order: number; questions: Question[]; }
interface SectionSummary { id: string; name: string; description?: string; type: string; timeLimit: number; order: number; _count: { questions: number }; }

const LABELS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

/** Fisher-Yates shuffle (returns new array) */
function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Get shuffled choices for a question, relabeling A/B/C/D */
function getShuffledChoices(choices: Choice[], shuffleMap: Record<string, string[]>, questionId: string, blankNum?: number): Choice[] {
  const key = blankNum != null ? `${questionId}_b${blankNum}` : questionId;
  const order = shuffleMap[key];
  if (!order) return choices;
  const idToChoice = new Map(choices.map(c => [c.id, c]));
  return order.map((id, i) => {
    const orig = idToChoice.get(id);
    if (!orig) return orig!;
    return { ...orig, label: LABELS[i] || orig.label };
  }).filter(Boolean);
}

function FillBlankPassage({ question, blankAnswers, submitted, onBlankChange, shuffleChoices }: {
  question: Question;
  blankAnswers: Record<number, string>;
  submitted: boolean;
  onBlankChange: (blankNum: number, choiceId: string) => void;
  shuffleChoices?: (choices: Choice[], questionId: string, blankNum?: number) => Choice[];
}) {
  if (!question.passage) return null;
  const blankNums = [...new Set(question.choices.map(c => c.blankNumber || 1))].sort((a, b) => a - b);

  // Split passage by blank markers — support various formats:
  // [1]_____  [1] ____  [1]___  [1] etc.
  const parts = question.passage.split(/\[(\d+)\]\s*_*/);


  return (
    <div className="fill-blank-passage">
      {parts.map((part, i) => {
        if (i % 2 === 0) {
          // Text part
          return <span key={i}>{part}</span>;
        }
        // Blank number
        const blankNum = parseInt(part);
        const choices = question.choices.filter(c => (c.blankNumber || 1) === blankNum);
        const selectedId = blankAnswers[blankNum];
        const selectedChoice = choices.find(c => c.id === selectedId);
        const correctChoice = choices.find(c => c.isCorrect);

        let borderColor = '#6366f1';
        let bgColor = '#f0f0ff';
        if (submitted && selectedChoice) {
          if (selectedChoice.isCorrect) {
            borderColor = '#16a34a'; bgColor = '#dcfce7';
          } else {
            borderColor = '#dc2626'; bgColor = '#fee2e2';
          }
        }

        return (
          <span key={i} style={{ display: 'inline-block', position: 'relative', margin: '4px 4px', verticalAlign: 'middle' }}>
            <select
              value={selectedId || ''}
              onChange={e => onBlankChange(blankNum, e.target.value)}
              disabled={submitted}
              style={{
                padding: '6px 28px 6px 10px',
                border: `2px solid ${borderColor}`,
                borderRadius: 8,
                backgroundColor: bgColor,
                fontSize: 15,
                fontWeight: 600,
                color: '#1e293b',
                cursor: submitted ? 'default' : 'pointer',
                minWidth: 120,
                appearance: 'none',
                WebkitAppearance: 'none',
                backgroundImage: submitted ? 'none' : `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23666' d='M2 4l4 4 4-4'/%3E%3C/svg%3E")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 8px center',
              }}
            >
              <option value="">({blankNum})</option>
              {(shuffleChoices ? shuffleChoices(choices, question.id, blankNum) : choices).map(c => (
                <option key={c.id} value={c.id}>{c.label}. {c.text}</option>
              ))}
            </select>
            {submitted && selectedChoice && !selectedChoice.isCorrect && correctChoice && (
              <div style={{ fontSize: 11, color: '#16a34a', fontWeight: 600, marginTop: 2, textAlign: 'center' }}>
                ✓ {correctChoice.label}. {correctChoice.text}
              </div>
            )}
          </span>
        );
      })}
    </div>
  );
}

export default function PracticePage() {
  const router = useRouter();
  const [sectionList, setSectionList] = useState<SectionSummary[]>([]);
  const [loadedSections, setLoadedSections] = useState<Record<string, Section>>({});
  const [secIdx, setSecIdx] = useState(0);
  const [qIdx, setQIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({}); // Selected choices
  const [blankAnswers, setBlankAnswers] = useState<Record<string, Record<number, string>>>({}); // questionId -> blankNumber -> choiceId
  const [blankSubmitted, setBlankSubmitted] = useState<Record<string, boolean>>({}); // questionId -> submitted
  const [loading, setLoading] = useState(true);
  const [sectionLoading, setSectionLoading] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [showSectionSelector, setShowSectionSelector] = useState(false);
  const [shuffled, setShuffled] = useState(false);
  const [shuffleMap, setShuffleMap] = useState<Record<string, string[]>>({});
  const [translateMode, setTranslateMode] = useState(false);

  // Fetch section list on mount
  useEffect(() => {
    fetch('/api/exam').then(r => r.json()).then((data: SectionSummary[]) => {
      setSectionList(data);
      setLoading(false);
      // Restore saved state
      const saved = localStorage.getItem('cept_practice_answers');
      if (saved) setAnswers(JSON.parse(saved));
      const savedBlank = localStorage.getItem('cept_practice_blankAnswers');
      if (savedBlank) setBlankAnswers(JSON.parse(savedBlank));
      const savedBlankSub = localStorage.getItem('cept_practice_blankSubmitted');
      if (savedBlankSub) setBlankSubmitted(JSON.parse(savedBlankSub));
      const savedSec = localStorage.getItem('cept_practice_secIdx');
      const savedQ = localStorage.getItem('cept_practice_qIdx');
      if (savedSec) setSecIdx(parseInt(savedSec));
      if (savedQ) setQIdx(parseInt(savedQ));
    });
  }, []);

  // Fetch section questions when secIdx changes
  useEffect(() => {
    if (sectionList.length === 0) return;
    const sectionId = sectionList[secIdx]?.id;
    if (!sectionId || loadedSections[sectionId]) return;
    setSectionLoading(true);
    fetch(`/api/exam?sectionId=${sectionId}`).then(r => r.json()).then((data: Section) => {
      setLoadedSections(prev => ({ ...prev, [sectionId]: data }));
      setSectionLoading(false);
    }).catch(() => setSectionLoading(false));
  }, [secIdx, sectionList, loadedSections]);

  // Persist state
  useEffect(() => {
    if (Object.keys(answers).length > 0) localStorage.setItem('cept_practice_answers', JSON.stringify(answers));
  }, [answers]);
  useEffect(() => {
    if (Object.keys(blankAnswers).length > 0) localStorage.setItem('cept_practice_blankAnswers', JSON.stringify(blankAnswers));
  }, [blankAnswers]);
  useEffect(() => {
    if (Object.keys(blankSubmitted).length > 0) localStorage.setItem('cept_practice_blankSubmitted', JSON.stringify(blankSubmitted));
  }, [blankSubmitted]);
  useEffect(() => { localStorage.setItem('cept_practice_secIdx', String(secIdx)); }, [secIdx]);
  useEffect(() => { localStorage.setItem('cept_practice_qIdx', String(qIdx)); }, [qIdx]);

  const secSummary = sectionList[secIdx];
  const sec = secSummary ? loadedSections[secSummary.id] : undefined;
  const isComprehension = sec?.type === 'READING_COMPREHENSION';
  const isListeningLong = sec?.type === 'LISTENING_LONG';
  const isGrouped = isComprehension || isListeningLong;

  // Build shuffle map when toggled on or when section changes
  const buildShuffleMap = useCallback(() => {
    if (!sec) return;
    const newMap: Record<string, string[]> = {};
    for (const q of sec.questions) {
      // Group choices by blankNumber for fill-blank
      const blankNums = [...new Set(q.choices.map(c => c.blankNumber || 1))];
      if (blankNums.length > 1 || (blankNums.length === 1 && blankNums[0] !== 1)) {
        // Fill-blank: shuffle per blank
        for (const bn of blankNums) {
          const blankChoices = q.choices.filter(c => (c.blankNumber || 1) === bn);
          newMap[`${q.id}_b${bn}`] = shuffleArray(blankChoices.map(c => c.id));
        }
      }
      // Standard: shuffle all choices
      newMap[q.id] = shuffleArray(q.choices.map(c => c.id));
    }
    setShuffleMap(newMap);
  }, [sec]);

  const toggleShuffle = useCallback(() => {
    if (!shuffled) {
      buildShuffleMap();
      setShuffled(true);
    } else {
      setShuffled(false);
      setShuffleMap({});
    }
  }, [shuffled, buildShuffleMap]);

  /** Helper: get display choices (shuffled or original) */
  const displayChoices = useCallback((choices: Choice[], questionId: string, blankNum?: number): Choice[] => {
    if (!shuffled) return choices;
    return getShuffledChoices(choices, shuffleMap, questionId, blankNum);
  }, [shuffled, shuffleMap]);

  // Group questions by passage (comprehension) or speechText (listening long)
  const passageGroups = (() => {
    if (!sec || !isGrouped) return null;
    const groups: { passage: string; speechText: string; questions: Question[] }[] = [];
    const seen = new Map<string, number>();
    for (const q of sec.questions) {
      const key = isListeningLong ? (q.speechText || '') : (q.passage || '');
      if (seen.has(key)) {
        groups[seen.get(key)!].questions.push(q);
      } else {
        seen.set(key, groups.length);
        groups.push({ passage: q.passage || '', speechText: q.speechText || '', questions: [q] });
      }
    }
    return groups;
  })();

  // For grouped sections: qIdx indexes groups; for others: indexes questions
  const totalQ = isGrouped && passageGroups ? passageGroups.length : (sec?.questions.length || 0);
  const question = isGrouped ? null : sec?.questions[qIdx];
  const currentGroup = isGrouped && passageGroups ? passageGroups[qIdx] : null;

  const selectAnswer = useCallback((choiceId: string, questionId?: string) => {
    if (translateMode) return; // Lock answers while translating
    const qId = questionId || question?.id;
    if (!qId) return;
    if (answers[qId]) return;
    setAnswers(prev => ({ ...prev, [qId]: choiceId }));
  }, [question, answers, translateMode]);

  const nextQ = () => { if (qIdx < totalQ - 1) setQIdx(qIdx + 1); };
  const prevQ = () => { if (qIdx > 0) setQIdx(qIdx - 1); };

  const speak = (text: string) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'en-US';
    u.rate = 0.9;
    u.onstart = () => setSpeaking(true);
    u.onend = () => setSpeaking(false);
    u.onerror = () => setSpeaking(false);
    window.speechSynthesis.speak(u);
  };

  const stopSpeaking = () => {
    window.speechSynthesis.cancel();
    setSpeaking(false);
  };

  const handleSectionSwitch = (idx: number) => {
    setSecIdx(idx);
    setQIdx(0);
    setShowSectionSelector(false);
  };

  if (loading || !secSummary) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)', color: '#4f46e5' }}>
        <Loader2 className="spinning-loader" size={48} style={{ animation: 'spin 1s linear infinite', marginBottom: 16 }} />
        <h2 style={{ fontSize: 24, fontWeight: 600, margin: 0 }}>Preparing Practice Mode</h2>
        <p style={{ color: '#6b7280', marginTop: 8 }}>Fetching syllabus and exam assets...</p>
        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }
  if (sectionLoading || !sec) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)', color: '#4f46e5' }}>
        <Loader2 className="spinning-loader" size={48} style={{ animation: 'spin 1s linear infinite', marginBottom: 16 }} />
        <h2 style={{ fontSize: 24, fontWeight: 600, margin: 0 }}>Loading {secSummary.name}</h2>
        <p style={{ color: '#6b7280', marginTop: 8 }}>Fetching questions...</p>
        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }
  if (!question && !currentGroup) return <div style={{ padding: 40, textAlign: 'center' }}>No practice data found.</div>;

  const isListening = sec.type === 'LISTENING_TEXT' || sec.type === 'LISTENING_IMAGE';
  const isFillBlank = sec.type === 'READING_FILL_BLANK';
  const answeredCount = isGrouped && passageGroups
    ? passageGroups.filter(g => g.questions.every(q => answers[q.id])).length
    : sec.questions.filter(q => answers[q.id]).length;
  const isQuestionAnswered = isGrouped && currentGroup
    ? currentGroup.questions.every(q => answers[q.id])
    : question ? !!answers[question.id] : false;

  return (
    <>
      <header className="top-bar">
        <div className="top-bar-inner">
          <div className="top-bar-title">
            <div className="logo-mini"><Sparkles size={16} /></div>
            <span>Practice</span>
          </div>
          {/* Section selector button — always visible, clearly labelled */}
          <button
            onClick={() => setShowSectionSelector(!showSectionSelector)}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)',
              borderRadius: 8, color: '#fff', padding: '6px 12px',
              cursor: 'pointer', fontFamily: 'inherit', fontSize: 13, fontWeight: 600,
              maxWidth: 200, overflow: 'hidden',
            }}
          >
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {secSummary.name}
            </span>
            <span style={{ flexShrink: 0 }}>{showSectionSelector ? '▲' : '▼'}</span>
          </button>
          <div style={{ display: 'flex', gap: 8 }}>
             <button
               className="btn btn-secondary"
               style={{
                 padding: '6px 12px', fontSize: 13,
                 display: 'flex', alignItems: 'center', gap: 5,
                 background: translateMode ? 'rgba(255,255,255,0.25)' : undefined,
                 borderColor: translateMode ? '#38bdf8' : undefined,
                 color: translateMode ? '#bae6fd' : undefined,
               }}
               onClick={() => setTranslateMode(prev => !prev)}
               title={translateMode ? 'ปิดโหมดแปล' : 'เปิดโหมดแปลคำศัพท์'}
             >
               <Languages size={14} />
               {translateMode ? 'แปล ON' : 'แปล'}
             </button>
             <button
               className="btn btn-secondary"
               style={{
                 padding: '6px 12px', fontSize: 13,
                 display: 'flex', alignItems: 'center', gap: 5,
                 background: shuffled ? 'rgba(255,255,255,0.25)' : undefined,
                 borderColor: shuffled ? '#fbbf24' : undefined,
                 color: shuffled ? '#fef3c7' : undefined,
               }}
               onClick={toggleShuffle}
               title={shuffled ? 'กลับลำดับเดิม' : 'สลับตัวเลือก A B C D'}
             >
               <Shuffle size={14} />
               {shuffled ? 'Default' : 'Shuffle'}
             </button>
             <button className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: 13 }} onClick={() => {
                localStorage.removeItem('cept_practice_answers');
                localStorage.removeItem('cept_practice_qIdx');
                localStorage.removeItem('cept_practice_blankAnswers');
                localStorage.removeItem('cept_practice_blankSubmitted');
                setAnswers({});
                setBlankAnswers({});
                setBlankSubmitted({});
                setQIdx(0);
             }}>Reset</button>
             <button className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: 13 }} onClick={() => router.push('/')}>Exit</button>
          </div>
        </div>
        <div className="progress-container">
          <div className="progress-bar" style={{ width: `${((qIdx + 1) / totalQ) * 100}%` }} />
        </div>
      </header>

      {showSectionSelector && (
        <div style={{
          background: '#fff', borderBottom: '1px solid #e0e0e0',
          padding: '12px 20px 16px', position: 'absolute', top: 60,
          left: 0, right: 0, zIndex: 90, boxShadow: '0 8px 24px rgba(0,0,0,0.10)',
        }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: '#9e9e9e', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 10, maxWidth: 900, margin: '0 auto 10px' }}>
            เลือกหมวดข้อสอบ
          </p>
          <div style={{ maxWidth: 900, margin: '0 auto', display: 'grid', gap: 8 }}>
            {sectionList.map((s, idx) => {
              const loaded = loadedSections[s.id];
              const done = loaded ? loaded.questions.filter(q => answers[q.id]).length : 0;
              const total = s._count.questions;
              const pct = total > 0 ? (done / total) * 100 : 0;
              const active = idx === secIdx;
              return (
                <button key={s.id} onClick={() => handleSectionSwitch(idx)} style={{
                  textAlign: 'left', padding: '14px 16px',
                  background: active ? '#e3f2fd' : '#fafafa',
                  border: `2px solid ${active ? '#1976d2' : '#e0e0e0'}`,
                  borderRadius: 10, cursor: 'pointer',
                  transition: 'all 0.18s ease',
                  fontFamily: 'inherit',
                }}
                  onMouseEnter={e => { if (!active) (e.currentTarget as HTMLButtonElement).style.borderColor = '#90caf9'; }}
                  onMouseLeave={e => { if (!active) (e.currentTarget as HTMLButtonElement).style.borderColor = '#e0e0e0'; }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ fontWeight: 700, fontSize: 15, color: active ? '#1565c0' : '#212121' }}>
                      {active && <span style={{ color: '#1976d2', marginRight: 6 }}>▶</span>}
                      {s.name}
                    </span>
                    <span style={{
                      fontSize: 12, fontWeight: 600,
                      color: done === total && total > 0 ? '#2e7d32' : '#616161',
                      background: done === total && total > 0 ? '#e8f5e9' : '#f0f0f0',
                      padding: '3px 10px', borderRadius: 20,
                    }}>
                      {done === total && total > 0 ? '✓ ' : ''}{done} / {total} done
                    </span>
                  </div>
                  {/* Progress bar */}
                  <div style={{ height: 4, background: '#e0e0e0', borderRadius: 2, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${pct}%`, borderRadius: 2, background: done === total && total > 0 ? '#2e7d32' : '#1976d2', transition: 'width 0.4s ease' }} />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div className="section-header">
        <div className="section-badge" style={{ background: '#388e3c' }}>Practice Mode</div>
        <h1 className="section-title">{sec.name}</h1>
        <p className="section-desc">{sec.description}</p>
        <div className="question-dots">
          {isGrouped && passageGroups ? (
            /* Group dots for Reading Comprehension / Listening Long */
            passageGroups.map((g, i) => {
              const allAnswered = g.questions.every(q => answers[q.id]);
              const anyAnswered = g.questions.some(q => answers[q.id]);
              const isCur = i === qIdx;
              let bgColor = 'var(--card)';
              let borderColor = 'var(--border)';
              let color = 'var(--text-secondary)';

              if (isCur) {
                bgColor = 'var(--accent)'; borderColor = 'var(--accent)'; color = '#fff';
              } else if (allAnswered) {
                const allCorrect = g.questions.every(q => {
                  const correct = q.choices.find(c => c.isCorrect);
                  return correct && answers[q.id] === correct.id;
                });
                if (allCorrect) {
                  bgColor = 'var(--correct-bg)'; borderColor = 'var(--correct)'; color = 'var(--correct)';
                } else {
                  bgColor = 'var(--wrong-bg)'; borderColor = 'var(--wrong)'; color = 'var(--wrong)';
                }
              } else if (anyAnswered) {
                bgColor = '#fff3e0'; borderColor = '#ff9800'; color = '#e65100';
              }

              return (
                <div key={i} style={{ background: bgColor, borderColor, color }} className="q-dot"
                     onClick={() => { setQIdx(i); setShowSectionSelector(false); }}>{i + 1}</div>
              );
            })
          ) : (
            /* Standard per-question dots */
            sec.questions.map((q, i) => {
              const isAns = !!answers[q.id];
              const isCur = i === qIdx;
              let bgColor = 'var(--card)';
              let borderColor = 'var(--border)';
              let color = 'var(--text-secondary)';

              if (isCur) {
                bgColor = 'var(--accent)'; borderColor = 'var(--accent)'; color = '#fff';
              } else if (isAns) {
                // For fill-in-the-blank: check correctness from blankAnswers
                if (isFillBlank && blankSubmitted[q.id]) {
                  const blankNums = [...new Set(q.choices.map(c => c.blankNumber || 1))];
                  const qBlankAnswers = blankAnswers[q.id] || {};
                  const allBlanksCorrect = blankNums.every(bn => {
                    const selectedId = qBlankAnswers[bn];
                    const choice = q.choices.find(c => c.id === selectedId);
                    return choice?.isCorrect;
                  });
                  if (allBlanksCorrect) {
                    bgColor = 'var(--correct-bg)'; borderColor = 'var(--correct)'; color = 'var(--correct)';
                  } else {
                    bgColor = 'var(--wrong-bg)'; borderColor = 'var(--wrong)'; color = 'var(--wrong)';
                  }
                } else {
                  const correctChoiceId = q.choices.find(c => c.isCorrect)?.id;
                  const isCorrect = answers[q.id] === correctChoiceId;
                  if (isCorrect) {
                      bgColor = 'var(--correct-bg)'; borderColor = 'var(--correct)'; color = 'var(--correct)';
                  } else {
                      bgColor = 'var(--wrong-bg)'; borderColor = 'var(--wrong)'; color = 'var(--wrong)';
                  }
                }
              }

              return (
                <div key={q.id} style={{ background: bgColor, borderColor, color }} className={`q-dot`}
                     onClick={() => { setQIdx(i); setShowSectionSelector(false); }}>{i + 1}</div>
              );
            })
          )}
        </div>
      </div>

      <main className={`main-content${isGrouped ? ' main-content-wide' : ''}`} onClick={() => setShowSectionSelector(false)}>
        {isGrouped && currentGroup ? (
          /* ─── GROUPED VIEW: READING COMPREHENSION / LISTENING LONG ─── */
          <div key={`group-${qIdx}`} className="reading-comprehension-grid">

            {/* LEFT — passage or audio */}
            <div className="rc-panel rc-passage">
              {isListeningLong ? (
                <>
                  <div className="rc-passage-badge">🎧 Audio {qIdx + 1}</div>
                  {currentGroup.passage && (
                    <div style={{ fontSize: 14, color: '#475569', marginBottom: 16, lineHeight: 1.65, fontStyle: 'italic' }}>
                      <TranslatableText text={currentGroup.passage} enabled={translateMode} />
                    </div>
                  )}
                  {currentGroup.speechText ? (
                    <button className={`tts-btn${speaking ? ' speaking' : ''}`}
                      onClick={() => speaking ? stopSpeaking() : speak(currentGroup.speechText)}>
                      {speaking ? <><VolumeX size={16} /> Stop Audio</> : <><Volume2 size={16} /> Play Audio</>}
                    </button>
                  ) : (
                    <div style={{ color: '#94a3b8', fontSize: 13 }}>No audio configured yet.</div>
                  )}
                  {isQuestionAnswered && currentGroup.speechText && (
                    <div style={{ marginTop: 16, borderTop: '1px solid #e2e8f0', paddingTop: 14 }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: '#94a3b8', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 1 }}>Transcript</div>
                      <div style={{ fontSize: 13, color: '#475569', lineHeight: 1.7, fontStyle: 'italic' }}>&quot;<TranslatableText text={currentGroup.speechText} enabled={translateMode} />&quot;</div>
                    </div>
                  )}
                </>
              ) : (
                <>
                  <div className="rc-passage-badge">📖 Passage {qIdx + 1}</div>
                  <div className="rc-passage-text"><TranslatableText text={currentGroup.passage} enabled={translateMode} /></div>
                </>
              )}
            </div>

            {/* RIGHT — questions */}
            <div className="rc-panel rc-questions">
              {currentGroup.questions.map((q, qi) => {
                const selected = answers[q.id];
                const selectedChoice = q.choices.find(c => c.id === selected);
                const correctChoice = q.choices.find(c => c.isCorrect);
                const isAns = !!selected;
                const isCorrect = isAns && selectedChoice?.isCorrect;

                return (
                  <div key={q.id} className={`rc-q-card${isAns ? (isCorrect ? ' rc-correct' : ' rc-wrong') : ''}`}>
                    <div className="rc-q-header">
                      <span className={`rc-q-num${isAns ? (isCorrect ? ' correct' : ' wrong') : ''}`}>{qi + 1}</span>
                      <span className="rc-q-text"><TranslatableText text={q.text} enabled={translateMode} /></span>
                    </div>
                    {!isAns ? (
                      <select className="rc-select" value=""
                        disabled={translateMode}
                        onChange={e => { if (e.target.value) selectAnswer(e.target.value, q.id); }}>
                        <option value="">— เลือกคำตอบ —</option>
                        {displayChoices(q.choices, q.id).map(c => (
                          <option key={c.id} value={c.id}>{c.label}. {c.text}</option>
                        ))}
                      </select>
                    ) : (
                      <div className={`rc-answer ${isCorrect ? 'correct' : 'wrong'}`}>
                        <span className="rc-icon">{isCorrect ? '✓' : '✗'}</span>
                        <span>{selectedChoice?.label}. {selectedChoice?.text}</span>
                        {!isCorrect && correctChoice && (
                          <span className="rc-correct-ans">✓ {correctChoice.label}. {correctChoice.text}</span>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}

              {isQuestionAnswered && (() => {
                const correctCount = currentGroup.questions.filter(q => answers[q.id] === q.choices.find(c => c.isCorrect)?.id).length;
                const totalCount = currentGroup.questions.length;
                const pct = Math.round((correctCount / totalCount) * 100);
                const isAllCorrect = correctCount === totalCount;
                const level = isAllCorrect ? 'perfect' : pct >= 60 ? 'good' : 'low';
                return (
                  <div className={`rc-score ${level}`}>
                    <div className="rc-score-ring">
                      <svg viewBox="0 0 36 36">
                        <circle className="ring-bg" cx="18" cy="18" r="15" />
                        <circle className="ring-fill" cx="18" cy="18" r="15"
                          strokeDasharray={`${pct * 0.94} 100`} />
                      </svg>
                      <span className="rc-score-pct">{pct}%</span>
                    </div>
                    <div className="rc-score-info">
                      <div className="rc-score-title">
                        {isAllCorrect ? '🎉 Perfect Score!' : `${correctCount} / ${totalCount} Correct`}
                      </div>
                      <div className="rc-score-msg">
                        {isAllCorrect ? 'You answered every question correctly!' : pct >= 60 ? 'Good job! Review incorrect answers above.' : 'Review the passage to understand the correct answers.'}
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        ) : question ? (
          /* ─── STANDARD SINGLE QUESTION VIEW ─── */
          <div className="question-card" key={question.id}>
            {!isFillBlank && <div className="question-number">{qIdx + 1}</div>}

            {isFillBlank ? (
              /* ─── FILL-IN-THE-BLANK DROPDOWN PASSAGE ─── */
              <>
                <FillBlankPassage
                  question={question}
                  blankAnswers={blankAnswers[question.id] || {}}
                  submitted={!!blankSubmitted[question.id]}
                  shuffleChoices={shuffled ? displayChoices : undefined}
                  onBlankChange={(blankNum, choiceId) => {
                    if (translateMode) return; // Lock while translating
                    if (blankSubmitted[question.id]) return;
                    setBlankAnswers(prev => ({
                      ...prev,
                      [question.id]: { ...(prev[question.id] || {}), [blankNum]: choiceId }
                    }));
                  }}
                />
                {!blankSubmitted[question.id] ? (
                  <button
                    className="btn btn-primary"
                    style={{ marginTop: 20, width: '100%', padding: '14px 0', fontSize: 16 }}
                    disabled={(() => {
                      const blankNums = [...new Set(question.choices.map(c => c.blankNumber || 1))];
                      const answered = blankAnswers[question.id] || {};
                      return blankNums.some(bn => !answered[bn]);
                    })()}
                    onClick={() => {
                      setBlankSubmitted(prev => ({ ...prev, [question.id]: true }));
                      setAnswers(prev => ({ ...prev, [question.id]: 'submitted' }));
                    }}
                  >Check Answers</button>
                ) : (
                  <div style={{ marginTop: 20, padding: 16, borderRadius: 8, background: '#e3f2fd', color: '#0277bd' }}>
                    {(() => {
                      const blankNums = [...new Set(question.choices.map(c => c.blankNumber || 1))];
                      const answered = blankAnswers[question.id] || {};
                      let correct = 0;
                      for (const bn of blankNums) {
                        const selectedId = answered[bn];
                        const choice = question.choices.find(c => c.id === selectedId);
                        if (choice?.isCorrect) correct++;
                      }
                      return (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          {correct === blankNums.length ? <CheckCircle size={20} color="#2e7d32" /> : <XCircle size={20} color="#c62828" />}
                          <span>Score: {correct}/{blankNums.length} blanks correct</span>
                        </div>
                      );
                    })()}
                  </div>
                )}
              </>
            ) : (
              /* ─── STANDARD QUESTION ─── */
              <>
                {question.passage && (
                  <div className="question-passage"><TranslatableText text={question.passage} enabled={translateMode} /></div>
                )}

                {question.imageUrl ? (
                  <img src={question.imageUrl} alt="Question" className="question-image" />
                ) : (sec.type === 'LISTENING_IMAGE' || sec.type === 'READING_SIGNS') ? (
                  <div className="image-placeholder"><Image size={20} /> ยังไม่มีรูป — Admin สามารถอัปโหลดได้</div>
                ) : null}

                {isListening && question.speechText && (
                  <div style={{ background: '#f5f5f5', padding: '16px 20px', borderRadius: 8, marginBottom: 20 }}>
                    <button className={`tts-btn${speaking ? ' speaking' : ''}`} style={{ marginBottom: isQuestionAnswered ? 16 : 0 }}
                      onClick={() => speaking ? stopSpeaking() : speak(question.speechText!)}>
                      {speaking ? <><VolumeX size={16} /> Stop</> : <><Volume2 size={16} /> Listen to Audio</>}
                    </button>
                    {isQuestionAnswered && (
                      <div style={{ borderTop: '1px solid #ddd', paddingTop: 16, marginTop: 16, color: '#444' }}>
                        <strong>Transcript:</strong>
                        <p style={{ marginTop: 8, fontStyle: 'italic', lineHeight: 1.6 }}>&quot;<TranslatableText text={question.speechText!} enabled={translateMode} />&quot;</p>
                      </div>
                    )}
                  </div>
                )}

                <div className="question-text"><TranslatableText text={question.text} enabled={translateMode} /></div>

                <div className={`choices${sec.type === 'LISTENING_IMAGE' ? ' choices-image' : ''}`}>
                  {displayChoices(question.choices, question.id).map(c => {
                    const isSelected = answers[question.id] === c.id;
                    let choiceClass = 'choice-btn';
                    let badge = null;

                    if (isQuestionAnswered) {
                      if (c.isCorrect) {
                        choiceClass += ' review-correct';
                        badge = <span className="review-badge correct-badge">CORRECT</span>;
                      } else if (isSelected && !c.isCorrect) {
                        choiceClass += ' review-wrong';
                        badge = <span className="review-badge wrong-badge">YOUR ANSWER</span>;
                      } else {
                        choiceClass += ' review-disabled';
                      }
                    } else if (isSelected) {
                      choiceClass += ' selected';
                    }

                    return (
                      <button key={c.id} className={choiceClass}
                        onClick={() => selectAnswer(c.id)}
                        style={isQuestionAnswered ? { cursor: 'default', opacity: (!c.isCorrect && !isSelected) ? 0.6 : 1 } : {}}>
                        <span className="choice-letter">{c.label}</span>
                        {sec.type === 'LISTENING_IMAGE' ? (
                          c.imageUrl
                            ? <img src={c.imageUrl} alt={`Option ${c.label}`} className="choice-image" />
                            : <div className="choice-image-placeholder"><Image size={16} /><span>ยังไม่มีรูป</span></div>
                        ) : (
                          <span><TranslatableText text={c.text} enabled={translateMode} /></span>
                        )}
                        {badge}
                      </button>
                    );
                  })}
                </div>

                {isQuestionAnswered && (
                  <div style={{ marginTop: 24, padding: 16, background: '#e3f2fd', borderRadius: 8, color: '#0277bd', display: 'flex', alignItems: 'center', gap: 10 }}>
                    {answers[question.id] === question.choices.find(c => c.isCorrect)?.id ? (
                      <CheckCircle size={20} color="#2e7d32" />
                    ) : (
                      <XCircle size={20} color="#c62828" />
                    )}
                    <span>
                      {answers[question.id] === question.choices.find(c => c.isCorrect)?.id
                        ? 'Great job! That is correct.'
                        : 'Incorrect. Carefully review the correct answer.'}
                    </span>
                  </div>
                )}
              </>
            )}
          </div>
        ) : null}
      </main>

      <nav className="nav-bar">
        <div className="nav-inner">
          <button className="btn btn-secondary" disabled={qIdx === 0} onClick={prevQ}><ChevronLeft size={16} /> Back</button>
          <span className="nav-center">
            {isGrouped ? `${isListeningLong ? 'Audio' : 'Passage'} ${qIdx + 1} / ${totalQ}` : `Q ${qIdx + 1} / ${totalQ}`} ({answeredCount} answered)
          </span>
          <button className="btn btn-primary" disabled={qIdx === totalQ - 1} onClick={nextQ}>Next <ChevronRight size={16} /></button>
        </div>
      </nav>
    </>
  );
}
