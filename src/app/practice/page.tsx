'use client';
import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Volume2, VolumeX, Image, ChevronLeft, ChevronRight, CheckCircle, XCircle } from 'lucide-react';

interface Choice { id: string; label: string; text: string; imageUrl?: string; isCorrect: boolean; order: number; blankNumber?: number; }
interface Question { id: string; text: string; passage?: string; speechText?: string; imageUrl?: string; order: number; choices: Choice[]; }
interface Section { id: string; name: string; description?: string; type: string; timeLimit: number; order: number; questions: Question[]; }

function FillBlankPassage({ question, blankAnswers, submitted, onBlankChange }: {
  question: Question;
  blankAnswers: Record<number, string>;
  submitted: boolean;
  onBlankChange: (blankNum: number, choiceId: string) => void;
}) {
  if (!question.passage) return null;
  const blankNums = [...new Set(question.choices.map(c => c.blankNumber || 1))].sort((a, b) => a - b);

  // Split passage by [N]_____ markers
  const parts = question.passage.split(/\[(\d+)\]_____/);

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
              {choices.map(c => (
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
  const [sections, setSections] = useState<Section[]>([]);
  const [secIdx, setSecIdx] = useState(0);
  const [qIdx, setQIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({}); // Selected choices
  const [blankAnswers, setBlankAnswers] = useState<Record<string, Record<number, string>>>({}); // questionId -> blankNumber -> choiceId
  const [blankSubmitted, setBlankSubmitted] = useState<Record<string, boolean>>({}); // questionId -> submitted
  const [loading, setLoading] = useState(true);
  const [speaking, setSpeaking] = useState(false);
  const [showSectionSelector, setShowSectionSelector] = useState(false);

  useEffect(() => {
    fetch('/api/exam').then(r => r.json()).then(data => {
      setSections(data);
      setLoading(false);
      const saved = localStorage.getItem('cept_practice_answers');
      if (saved) setAnswers(JSON.parse(saved));
      const savedSec = localStorage.getItem('cept_practice_secIdx');
      const savedQ = localStorage.getItem('cept_practice_qIdx');
      if (savedSec) setSecIdx(parseInt(savedSec));
      if (savedQ) setQIdx(parseInt(savedQ));
    });
  }, []);

  useEffect(() => {
    if (Object.keys(answers).length > 0) localStorage.setItem('cept_practice_answers', JSON.stringify(answers));
  }, [answers]);
  useEffect(() => { localStorage.setItem('cept_practice_secIdx', String(secIdx)); }, [secIdx]);
  useEffect(() => { localStorage.setItem('cept_practice_qIdx', String(qIdx)); }, [qIdx]);

  const sec = sections[secIdx];
  const question = sec?.questions[qIdx];
  const totalQ = sec?.questions.length || 0;

  const selectAnswer = useCallback((choiceId: string) => {
    if (!question) return;
    // Prevent changing answer if already answered in practice mode
    if (answers[question.id]) return;
    setAnswers(prev => ({ ...prev, [question.id]: choiceId }));
  }, [question, answers]);

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

  if (loading) return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', fontSize: 18, color: '#666' }}>Loading practice mode...</div>;
  if (!sec || !question) return <div style={{ padding: 40, textAlign: 'center' }}>No practice data found.</div>;

  const isListening = sec.type === 'LISTENING_TEXT' || sec.type === 'LISTENING_IMAGE';
  const isFillBlank = sec.type === 'READING_FILL_BLANK';
  const answeredCount = sec.questions.filter(q => answers[q.id]).length;
  const isQuestionAnswered = !!answers[question.id];

  return (
    <>
      <header className="top-bar">
        <div className="top-bar-inner">
          <div className="top-bar-title" style={{ cursor: 'pointer' }} onClick={() => setShowSectionSelector(!showSectionSelector)}>
            <div className="logo-mini">CU</div>
            <span>{sec.name} {showSectionSelector ? '▲' : '▼'}</span>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
             <button className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: 13 }} onClick={() => {
                localStorage.removeItem('cept_practice_answers');
                localStorage.removeItem('cept_practice_secIdx');
                localStorage.removeItem('cept_practice_qIdx');
                setAnswers({});
                setQIdx(0);
                setSecIdx(0);
             }}>Reset History</button>
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
            {sections.map((s, idx) => {
              const done = s.questions.filter(q => answers[q.id]).length;
              const total = s.questions.length;
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
          {sec.questions.map((q, i) => {
            const isAns = !!answers[q.id];
            const isCur = i === qIdx;
            let bgColor = 'var(--card)';
            let borderColor = 'var(--border)';
            let color = 'var(--text-secondary)';
            
            if (isCur) {
              bgColor = 'var(--accent)'; borderColor = 'var(--accent)'; color = '#fff';
            } else if (isAns) {
              const correctChoiceId = q.choices.find(c => c.isCorrect)?.id;
              const isCorrect = answers[q.id] === correctChoiceId;
              if (isCorrect) {
                  bgColor = 'var(--correct-bg)'; borderColor = 'var(--correct)'; color = 'var(--correct)';
              } else {
                  bgColor = 'var(--wrong-bg)'; borderColor = 'var(--wrong)'; color = 'var(--wrong)';
              }
            }

            return (
              <div key={q.id} style={{ background: bgColor, borderColor, color }} className={`q-dot`}
                   onClick={() => { setQIdx(i); setShowSectionSelector(false); }}>{i + 1}</div>
            );
          })}
        </div>
      </div>

      <main className="main-content" onClick={() => setShowSectionSelector(false)}>
        <div className="question-card" key={question.id}>
          {!isFillBlank && <div className="question-number">{qIdx + 1}</div>}

          {isFillBlank ? (
            /* ─── FILL-IN-THE-BLANK DROPDOWN PASSAGE ─── */
            <>
              <FillBlankPassage
                question={question}
                blankAnswers={blankAnswers[question.id] || {}}
                submitted={!!blankSubmitted[question.id]}
                onBlankChange={(blankNum, choiceId) => {
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
                <div className="question-passage">{question.passage}</div>
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
                      <p style={{ marginTop: 8, fontStyle: 'italic', lineHeight: 1.6 }}>"{question.speechText}"</p>
                    </div>
                  )}
                </div>
              )}

              <div className="question-text">{question.text}</div>

              <div className={`choices${sec.type === 'LISTENING_IMAGE' ? ' choices-image' : ''}`}>
                {question.choices.map(c => {
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
                        <span>{c.text}</span>
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
      </main>

      <nav className="nav-bar">
        <div className="nav-inner">
          <button className="btn btn-secondary" disabled={qIdx === 0} onClick={prevQ}><ChevronLeft size={16} /> Back</button>
          <span className="nav-center">Q {qIdx + 1} / {totalQ} ({answeredCount} answered)</span>
          <button className="btn btn-primary" disabled={qIdx === totalQ - 1} onClick={nextQ}>Next <ChevronRight size={16} /></button>
        </div>
      </nav>
    </>
  );
}
