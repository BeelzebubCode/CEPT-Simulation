'use client';
import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Clock, Volume2, VolumeX, Image, Upload, ChevronRight, AlarmClock } from 'lucide-react';

interface Choice { id: string; label: string; text: string; imageUrl?: string; blankNumber?: number; }
interface Question { id: string; text: string; passage?: string; speechText?: string; imageUrl?: string; choices: Choice[]; sectionId?: string; type?: string; }

// CEPT Exam is 30 mins
const EXAM_TIME_LIMIT = 30 * 60;

export default function AdaptiveExamPage() {
  const router = useRouter();

  const [attemptId, setAttemptId] = useState<string | null>(null);
  const [theta, setTheta] = useState(0);
  const [question, setQuestion] = useState<Question | null>(null);
  const [answeredIds, setAnsweredIds] = useState<string[]>([]);
  const [selectedChoiceId, setSelectedChoiceId] = useState<string | null>(null);

  const [currentSectionId, setCurrentSectionId] = useState<string | null>(null);
  const [currentSectionName, setCurrentSectionName] = useState<string>('');
  const [currentSectionType, setCurrentSectionType] = useState<string>('');
  const [sectionChanged, setSectionChanged] = useState(false);
  const [sectionQCount, setSectionQCount] = useState(1); // questions answered in current section

  const [qNum, setQNum] = useState(1);
  const [timeLeft, setTimeLeft] = useState(EXAM_TIME_LIMIT);
  const [loading, setLoading] = useState(true);
  const [speaking, setSpeaking] = useState(false);
  const [blankAnswers, setBlankAnswers] = useState<Record<number, string>>({}); // blankNumber -> choiceId

  const [showModal, setShowModal] = useState<'submit' | 'timeup' | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Start exam
  useEffect(() => {
    let mounted = true;
    fetch('/api/adaptive', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'start' })
    })
      .then(r => r.json())
      .then(data => {
        if (!mounted) return;
        if (data.error || !data.nextQuestion) {
          console.error('API Error:', data.error);
          setLoading(false);
          return;
        }
        setAttemptId(data.attemptId);
        setTheta(data.theta);
        setQuestion(data.nextQuestion);
        setAnsweredIds([data.nextQuestion.id]);
        setCurrentSectionId(data.currentSectionId);
        setCurrentSectionName(data.currentSectionName ?? '');
        setCurrentSectionType(data.currentSectionType ?? '');
        setLoading(false);
      })
      .catch(err => {
        if (!mounted) return;
        console.error('Failed to start exam:', err);
        setLoading(false);
      });

    return () => { mounted = false; };
  }, []);

  // Timer
  useEffect(() => {
    if (loading || !attemptId) return;
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          setShowModal('timeup');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [loading, attemptId]);

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

  const submitAnswerAndGetNext = async () => {
    if (!selectedChoiceId || !question || !attemptId) return;
    setLoading(true);
    stopSpeaking();
    setSectionChanged(false);

    try {
      const res = await fetch('/api/adaptive', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'answer',
          attemptId,
          questionId: question.id,
          choiceId: selectedChoiceId,
          theta,
          answeredIds,
          currentSectionId,
          sectionQCount,
        })
      });

      const data = await res.json();

      if (data.error) {
        console.error(data.error);
        setLoading(false);
        return;
      }

      setTheta(data.theta);

      if (data.nextQuestion) {
        setQuestion(data.nextQuestion);
        setAnsweredIds(prev => [...prev, data.nextQuestion.id]);
        setSelectedChoiceId(null);
        setQNum(prev => prev + 1);
        setCurrentSectionId(data.currentSectionId);
        setCurrentSectionName(data.currentSectionName ?? '');
        setCurrentSectionType(data.currentSectionType ?? '');
        setSectionChanged(data.sectionChanged === true);
        setSectionQCount(data.sectionChanged ? 1 : sectionQCount + 1);
        setLoading(false);
      } else {
        // All sections done
        finishExam();
      }
    } catch (err) {
      console.error('Submit failed', err);
      setLoading(false);
    }
  };

  const finishExam = async () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setLoading(true);
    const res = await fetch('/api/adaptive', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'finish', attemptId, theta })
    });
    const result = await res.json();
    localStorage.setItem('cept_adaptive_result', JSON.stringify(result));
    router.push('/results');
  };

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  };

  if (loading && !question) return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', fontSize: 18, color: '#666' }}>Initializing Exam...</div>;
  if (!question) return <div style={{ padding: 40, textAlign: 'center' }}>No exam data found.</div>;

  const isListening = currentSectionType === 'LISTENING_TEXT' || currentSectionType === 'LISTENING_IMAGE';
  const isFillBlank = currentSectionType === 'READING_FILL_BLANK';
  const hasMultipleBlanks = isFillBlank && new Set(question.choices.map(c => c.blankNumber || 1)).size > 1;

  // For fill-in-the-blank: check if all blanks answered
  const allBlanksAnswered = (() => {
    if (!hasMultipleBlanks) return false;
    const blankNums = [...new Set(question.choices.map(c => c.blankNumber || 1))];
    return blankNums.every(bn => blankAnswers[bn]);
  })();

  return (
    <>
      <header className="top-bar">
        <div className="top-bar-inner">
          <div className="top-bar-title">
            <div className="logo-mini">CU</div>
            <span>CEPT Exam</span>
          </div>
          <div className={`timer-display${timeLeft < 300 ? ' warning' : ''}`}>
            <Clock size={18} />
            <span>{formatTime(timeLeft)}</span>
          </div>
        </div>
        <div className="progress-container">
          <div className="progress-bar" style={{ width: `${(timeLeft / EXAM_TIME_LIMIT) * 100}%` }} />
        </div>
      </header>

      {/* Section transition banner */}
      {sectionChanged && (
        <div style={{ background: '#1565c0', color: '#fff', textAlign: 'center', padding: '10px 24px', fontSize: 14, fontWeight: 600 }}>
          ✦ เริ่มหมวดใหม่: {currentSectionName}
        </div>
      )}

      <div className="section-header">
        <div className="section-badge" style={{ background: '#c62828' }}>Q {qNum}</div>
        <h1 className="section-title">{currentSectionName || 'CEPT Exam'}</h1>
        <p className="section-desc">Select the best answer.</p>
      </div>

      <main className="main-content">
        <div className="question-card" style={{ opacity: loading ? 0.5 : 1, pointerEvents: loading ? 'none' : 'auto' }}>

          {hasMultipleBlanks ? (
            /* ─── FILL-IN-THE-BLANK DROPDOWN ─── */
            <>
              <div className="fill-blank-passage">
                {(() => {
                  if (!question.passage) return null;
                  const parts = question.passage.split(/\[(\d+)\]_____/);
                  return parts.map((part, i) => {
                    if (i % 2 === 0) return <span key={i}>{part}</span>;
                    const blankNum = parseInt(part);
                    const choices = question.choices.filter(c => (c.blankNumber || 1) === blankNum);
                    return (
                      <select key={i}
                        value={blankAnswers[blankNum] || ''}
                        onChange={e => setBlankAnswers(prev => ({ ...prev, [blankNum]: e.target.value }))}
                        style={{
                          padding: '6px 28px 6px 10px', border: '2px solid #6366f1', borderRadius: 8,
                          backgroundColor: blankAnswers[blankNum] ? '#e0e7ff' : '#f0f0ff',
                          fontSize: 15, fontWeight: 600, color: '#1e293b', cursor: 'pointer',
                          minWidth: 120, margin: '4px 4px', verticalAlign: 'middle',
                          appearance: 'none' as const, WebkitAppearance: 'none' as const,
                          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23666' d='M2 4l4 4 4-4'/%3E%3C/svg%3E")`,
                          backgroundRepeat: 'no-repeat', backgroundPosition: 'right 8px center',
                        }}
                      >
                        <option value="">({blankNum})</option>
                        {choices.map(c => <option key={c.id} value={c.id}>{c.label}. {c.text}</option>)}
                      </select>
                    );
                  });
                })()}
              </div>
            </>
          ) : (
            /* ─── STANDARD QUESTION ─── */
            <>
              {question.passage && (
                <div className="question-passage">{question.passage}</div>
              )}

              {question.imageUrl ? (
                <img src={question.imageUrl} alt="Question" className="question-image" />
              ) : (currentSectionType === 'LISTENING_IMAGE' || currentSectionType === 'READING_SIGNS') ? (
                <div className="image-placeholder"><Image size={20} /> ยังไม่มีรูป — Admin สามารถอัปโหลดได้</div>
              ) : null}

              {isListening && question.speechText && (
                <div style={{ background: '#f5f5f5', padding: '16px 20px', borderRadius: 8, marginBottom: 20 }}>
                  <button className={`tts-btn${speaking ? ' speaking' : ''}`}
                    onClick={() => speaking ? stopSpeaking() : speak(question.speechText!)}>
                    {speaking ? <><VolumeX size={16} /> Stop Playback</> : <><Volume2 size={16} /> Play Audio</>}
                  </button>
                </div>
              )}

              <div className="question-text" style={{ fontSize: 18, fontWeight: 600 }}>{question.text}</div>

              <div className={`choices${currentSectionType === 'LISTENING_IMAGE' ? ' choices-image' : ''}`}>
                {question.choices.map(c => (
                  <button key={c.id}
                    className={`choice-btn${selectedChoiceId === c.id ? ' selected' : ''}`}
                    onClick={() => setSelectedChoiceId(c.id)}>
                    <span className="choice-letter">{c.label}</span>
                    {currentSectionType === 'LISTENING_IMAGE' ? (
                      c.imageUrl
                        ? <img src={c.imageUrl} alt={`Option ${c.label}`} className="choice-image" />
                        : <div className="choice-image-placeholder"><Image size={16} /><span>ยังไม่มีรูป</span></div>
                    ) : (
                      <span>{c.text}</span>
                    )}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </main>

      <nav className="nav-bar">
        <div className="nav-inner" style={{ justifyContent: 'space-between' }}>
          <div>
            <button className="btn btn-secondary" onClick={() => setShowModal('submit')}>Submit Early</button>
          </div>
          <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Q {qNum}</span>
          <button className="btn btn-primary" disabled={hasMultipleBlanks ? (!allBlanksAnswered || loading) : (!selectedChoiceId || loading)} onClick={() => {
            if (hasMultipleBlanks) {
              // For fill-blank: pick the first choice as a token submission, scoring will be handled differently
              const firstBlankChoiceId = Object.values(blankAnswers)[0];
              setSelectedChoiceId(firstBlankChoiceId);
              setTimeout(() => {
                submitAnswerAndGetNext();
                setBlankAnswers({});
              }, 50);
            } else {
              submitAnswerAndGetNext();
            }
          }}>
            Next <ChevronRight size={16} />
          </button>
        </div>
      </nav>

      {showModal === 'submit' && (
        <div className="modal-overlay" onClick={() => setShowModal(null)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <div className="modal-icon"><Upload size={48} strokeWidth={1.5} /></div>
            <div className="modal-title">Submit Exam Early?</div>
            <div className="modal-text">
              You are on question {qNum}. Your score will be calculated based on current progress.
            </div>
            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => setShowModal(null)}>Cancel</button>
              <button className="btn btn-submit" onClick={finishExam}>Submit Now</button>
            </div>
          </div>
        </div>
      )}

      {showModal === 'timeup' && (
        <div className="modal-overlay">
          <div className="modal-box">
            <div className="modal-icon"><AlarmClock size={48} strokeWidth={1.5} /></div>
            <div className="modal-title">Time is up!</div>
            <div className="modal-text">30 minutes have elapsed. Your responses will now be scored.</div>
            <div className="modal-actions">
              <button className="btn btn-primary" onClick={finishExam}>View Results</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
