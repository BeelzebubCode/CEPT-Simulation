'use client';
import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { Volume2, Save, Plus, Pencil, Trash2, Image, CheckCircle, XCircle, ChevronUp, ChevronDown } from 'lucide-react';

interface Choice { id: string; label: string; text: string; imageUrl?: string; isCorrect: boolean; order: number; blankNumber?: number; }
interface Question { id: string; text: string; passage?: string; speechText?: string; imageUrl?: string; order: number; choices: Choice[]; }
interface Section { id: string; name: string; description?: string; type: string; timeLimit: number; order: number; questions: Question[]; }
interface Toast { id: number; msg: string; ok: boolean; }

import { TYPE_BADGE } from '@/lib/constants';

export default function SectionEditor() {
  const { id } = useParams();
  const [section, setSection]     = useState<Section | null>(null);
  const [editQ, setEditQ]         = useState<string | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [editForm, setEditForm]   = useState<{ text?: string; passage?: string; speechText?: string; imageUrl?: string; choices?: any[] }>({});
  const [saving, setSaving]       = useState(false);
  const [toasts, setToasts]       = useState<Toast[]>([]);
  const [quickPaste, setQuickPaste] = useState<Record<number, string>>({});
  const [confirmDelQ, setConfirmDelQ] = useState<{ open: boolean; qId: string; qText: string }>({ open: false, qId: '', qText: '' });

  const pushToast = (msg: string, ok = true) => {
    const tid = Date.now();
    setToasts(t => [...t, { id: tid, msg, ok }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== tid)), 3000);
  };

  const load = useCallback(() => {
    fetch(`/api/sections/${id}`).then(r => r.json()).then(setSection);
  }, [id]);
  useEffect(() => { load(); }, [load]);

  const updateSection = async (data: Partial<Section>) => {
    await fetch(`/api/sections/${id}`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data),
    });
    load();
  };

  const startEdit = (q: Question) => {
    setEditQ(q.id);
    setEditForm({ text: q.text, passage: q.passage || '', speechText: q.speechText || '', imageUrl: q.imageUrl || '', choices: q.choices.map(c => ({ ...c })) });
  };

  const saveQuestion = async () => {
    if (!editQ) return;
    setSaving(true);
    try {
      await fetch(`/api/questions/${editQ}`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(editForm),
      });
      setEditQ(null);
      load();
      pushToast('Question saved');
    } catch {
      pushToast('Failed to save', false);
    } finally {
      setSaving(false);
    }
  };

  const addQuestion = async () => {
    if (!section) return;
    await fetch('/api/questions', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sectionId: id, text: 'New question', order: section.questions.length + 1,
        choices: [
          { label: 'A', text: 'Option A', isCorrect: true,  order: 1 },
          { label: 'B', text: 'Option B', isCorrect: false, order: 2 },
          { label: 'C', text: 'Option C', isCorrect: false, order: 3 },
          { label: 'D', text: 'Option D', isCorrect: false, order: 4 },
        ],
      }),
    });
    load();
  };

  const deleteQuestion = async (qId: string) => {
    setConfirmDelQ({ open: false, qId: '', qText: '' });
    await fetch(`/api/questions/${qId}`, { method: 'DELETE' });
    load();
    pushToast('Question deleted');
  };

  /** Parse "A. from / B. since ✅ / C. for / D. after" → choices array */
  const parseChoiceShorthand = (raw: string, blankNumber: number, orderOffset: number) => {
    return raw.split('/').map((part, i) => {
      const trimmed = part.trim();
      const isCorrect = trimmed.includes('✅') || trimmed.includes('*');
      const cleaned = trimmed.replace(/✅|\*/g, '').trim();
      // Match "A. text" or just "text"
      const match = cleaned.match(/^([A-Za-z])\.\s*(.+)$/);
      const label = match ? match[1].toUpperCase() : String.fromCharCode(65 + i);
      const text  = match ? match[2].trim() : cleaned;
      return { label, text, isCorrect, order: orderOffset + i + 1, blankNumber };
    }).filter(c => c.text.length > 0);
  };

  const moveQuestion = async (qi: number, dir: -1 | 1) => {
    if (!section) return;
    const qs = section.questions;
    const target = qi + dir;
    if (target < 0 || target >= qs.length) return;
    const a = qs[qi];
    const b = qs[target];
    // Swap order values via two parallel PUTs
    await Promise.all([
      fetch(`/api/questions/${a.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ order: b.order }) }),
      fetch(`/api/questions/${b.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ order: a.order }) }),
    ]);
    load();
  };

  const uploadImage = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch('/api/upload', { method: 'POST', body: formData });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Upload failed');
    }
    const data = await res.json();
    return data.url;
  };

  if (!section) {
    return (
      <div>
        <div className="admin-header">
          <div className="admin-skeleton" style={{ height: 28, width: 200, marginBottom: 8 }} />
          <div className="admin-skeleton" style={{ height: 16, width: 300 }} />
        </div>
        {[1, 2, 3].map(i => <div key={i} className="admin-skeleton" style={{ height: 72, marginBottom: 12 }} />)}
      </div>
    );
  }

  const isListening = section.type === 'LISTENING_TEXT' || section.type === 'LISTENING_IMAGE';
  const isFillBlank = section.type === 'READING_FILL_BLANK';
  const badge       = TYPE_BADGE[section.type] ?? { label: section.type, cls: '' };

  return (
    <>
      {/* Header */}
      <div className="admin-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
          <h1 style={{ margin: 0 }}>{section.name}</h1>
          <span className={`admin-badge ${badge.cls}`}>{badge.label}</span>
        </div>
        <p>{section.description || 'No description'} · {section.questions.length} questions · {section.timeLimit} min</p>
      </div>

      {/* Section settings */}
      <div className="admin-card" style={{ marginBottom: 24 }}>
        <h2>Section Settings</h2>
        <div className="admin-grid">
          <div>
            <label className="admin-label">Name</label>
            <input className="admin-input" defaultValue={section.name}
              onBlur={e => updateSection({ name: e.target.value })} />
          </div>
          <div>
            <label className="admin-label">Time Limit (min)</label>
            <input className="admin-input" type="number" defaultValue={section.timeLimit}
              onBlur={e => updateSection({ timeLimit: parseInt(e.target.value) })} />
          </div>
          <div style={{ gridColumn: '1 / -1' }}>
            <label className="admin-label">Description</label>
            <input className="admin-input" defaultValue={section.description || ''}
              onBlur={e => updateSection({ description: e.target.value })} />
          </div>
        </div>
      </div>

      {/* Questions header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <h2 style={{ color: '#e2e8f0', fontSize: 15, fontWeight: 700 }}>
          Questions <span style={{ color: '#475569', fontWeight: 400 }}>({section.questions.length})</span>
        </h2>
        <button className="admin-btn admin-btn-primary" style={{ fontSize: 12 }} onClick={addQuestion}>
          <Plus size={13} /> Add Question
        </button>
      </div>

      {section.questions.map((q, qi) => (
        <div key={q.id} className="admin-card" style={{
          borderLeft: editQ === q.id ? '3px solid #3b82f6' : '3px solid transparent',
          transition: 'border-color 0.15s',
        }}>
          {editQ === q.id ? (
            /* ── Edit mode ── */
            <>
              <div style={{ marginBottom: 14 }}>
                <label className="admin-label">Question Text</label>
                <textarea className="admin-input admin-textarea" value={editForm.text || ''}
                  onChange={e => setEditForm({ ...editForm, text: e.target.value })} />
              </div>

              <div style={{ marginBottom: 14 }}>
                <label className="admin-label">Passage / Context</label>
                <textarea className="admin-input admin-textarea" value={editForm.passage || ''}
                  onChange={e => setEditForm({ ...editForm, passage: e.target.value })} />
              </div>

              {isListening && (
                <div style={{ marginBottom: 14 }}>
                  <label className="admin-label">
                    <Volume2 size={11} style={{ verticalAlign: 'middle', marginRight: 4 }} />
                    Speech Text (TTS)
                  </label>
                  <textarea className="admin-input admin-textarea" rows={4} value={editForm.speechText || ''}
                    onChange={e => setEditForm({ ...editForm, speechText: e.target.value })}
                    placeholder="Text that will be read aloud by Web Speech API…" />
                </div>
              )}

              {/* Image upload */}
              <div style={{ marginBottom: 14 }}>
                <label className="admin-label">Question Image</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                  <label style={{
                    display: 'inline-flex', alignItems: 'center', gap: 6,
                    padding: '8px 14px', borderRadius: 6, fontSize: 13, fontWeight: 600, cursor: 'pointer',
                    background: 'rgba(59,130,246,0.1)', color: '#60a5fa',
                    border: '1px solid rgba(59,130,246,0.2)', transition: 'all 0.15s',
                  }}>
                    <Image size={13} />
                    {editForm.imageUrl ? 'Replace Image' : 'Upload Image'}
                    <input type="file" accept="image/*" style={{ display: 'none' }} onChange={async e => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const url = await uploadImage(file);
                        setEditForm({ ...editForm, imageUrl: url });
                      }
                    }} />
                  </label>
                  {editForm.imageUrl && (
                    <button className="admin-btn admin-btn-ghost" style={{ fontSize: 12 }}
                      onClick={() => setEditForm({ ...editForm, imageUrl: '' })}>
                      Remove
                    </button>
                  )}
                </div>
                {editForm.imageUrl && (
                  <img src={editForm.imageUrl} alt="" style={{ maxWidth: 220, marginTop: 10, borderRadius: 8, border: '1px solid #334155' }} />
                )}
              </div>

              {/* Choices */}
              <div style={{ marginBottom: 16 }}>
                <label className="admin-label">
                  Choices {isFillBlank && '— grouped by blank'}
                </label>

                {isFillBlank ? (
                  /* Fill-blank: grouped */
                  <>
                    {[1,2,3,4,5].map(bn => {
                      const blankChoices = (editForm.choices || []).filter(c => (c.blankNumber || 1) === bn);
                      if (blankChoices.length === 0) return null;
                      return (
                        <div key={bn} style={{ marginBottom: 12, padding: 12, backgroundColor: 'var(--admin-bg)', borderRadius: 8, border: '1px solid var(--admin-border)' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                              <span className="admin-badge badge-reading-fill">Blank [{bn}]</span>
                              {/* Delete whole blank group */}
                              <button style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '2px 6px', fontSize: 12, borderRadius: 4 }}
                                title={`Delete Blank [${bn}]`}
                                onClick={() => setEditForm({ ...editForm, choices: (editForm.choices || []).filter(c => (c.blankNumber || 1) !== bn) })}>
                                Delete blank
                              </button>
                            </div>
                            <button className="admin-btn admin-btn-primary" style={{ padding: '4px 10px', fontSize: 11 }} onClick={() => {
                              const labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
                              const newChoice = { label: labels[blankChoices.length] || labels[0], text: '', isCorrect: false, order: (editForm.choices || []).length + 1, blankNumber: bn };
                              setEditForm({ ...editForm, choices: [...(editForm.choices || []), newChoice] });
                            }}><Plus size={10} /> Add option</button>
                          </div>
                          {blankChoices.map(c => {
                            const ci = (editForm.choices || []).indexOf(c);
                            return (
                              <div key={ci} style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 6 }}>
                                <span style={{ color: '#fff', fontWeight: 700, width: 22, fontSize: 13 }}>{c.label}</span>
                                <input className="admin-input" style={{ flex: 1 }} value={c.text || ''}
                                  onChange={e => {
                                    const nc = [...(editForm.choices || [])];
                                    nc[ci] = { ...nc[ci], text: e.target.value };
                                    setEditForm({ ...editForm, choices: nc });
                                  }} />
                                <label style={{ color: '#94a3b8', fontSize: 12, display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer', whiteSpace: 'nowrap' }}>
                                  <input type="radio" name={`correct-blank-${bn}`} checked={c.isCorrect || false}
                                    onChange={() => {
                                      const nc = (editForm.choices || []).map(ch => ({
                                        ...ch, isCorrect: (ch.blankNumber || 1) === bn ? ch === c : ch.isCorrect,
                                      }));
                                      setEditForm({ ...editForm, choices: nc });
                                    }} />
                                  ✓
                                </label>
                                <button style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: 4, fontSize: 14, fontWeight: 700 }}
                                  onClick={() => setEditForm({ ...editForm, choices: (editForm.choices || []).filter((_, i) => i !== ci) })}>
                                  ✕
                                </button>
                              </div>
                            );
                          })}

                          {/* Quick paste row */}
                          <div style={{ marginTop: 10, borderTop: '1px solid var(--admin-border)', paddingTop: 10 }}>
                            <div style={{ fontSize: 11, color: '#64748b', marginBottom: 5 }}>
                              Quick import — วาง <code style={{ background: '#0f172a', padding: '1px 5px', borderRadius: 3 }}>A. from / B. since ✅ / C. for / D. after</code>
                            </div>
                            <div style={{ display: 'flex', gap: 6 }}>
                              <input
                                className="admin-input"
                                style={{ flex: 1, fontSize: 12 }}
                                placeholder="A. word / B. word ✅ / C. word / D. word"
                                value={quickPaste[bn] || ''}
                                onChange={e => setQuickPaste(p => ({ ...p, [bn]: e.target.value }))}
                                onKeyDown={e => {
                                  if (e.key === 'Enter') e.currentTarget.nextElementSibling?.dispatchEvent(new MouseEvent('click'));
                                }}
                              />
                              <button
                                className="admin-btn admin-btn-primary"
                                style={{ fontSize: 11, padding: '4px 12px', whiteSpace: 'nowrap' }}
                                disabled={!quickPaste[bn]?.trim()}
                                onClick={() => {
                                  const parsed = parseChoiceShorthand(quickPaste[bn] || '', bn, (editForm.choices || []).filter(c => (c.blankNumber || 1) !== bn).length);
                                  if (parsed.length === 0) return;
                                  const others = (editForm.choices || []).filter(c => (c.blankNumber || 1) !== bn);
                                  setEditForm({ ...editForm, choices: [...others, ...parsed] });
                                  setQuickPaste(p => ({ ...p, [bn]: '' }));
                                }}
                              >
                                Import
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    {/* Add new blank group */}
                    {(() => {
                      const existingBlanks = [...new Set((editForm.choices || []).map(c => c.blankNumber || 1))];
                      const nextBn = existingBlanks.length > 0 ? Math.max(...existingBlanks) + 1 : 1;
                      if (nextBn > 5) return null;
                      return (
                        <button className="admin-btn admin-btn-ghost" style={{ width: '100%', marginTop: 4, fontSize: 13, justifyContent: 'center' }}
                          onClick={() => {
                            const newChoices = ['A','B','C','D'].map((label, i) => ({
                              label, text: '', isCorrect: i === 0, order: (editForm.choices || []).length + i + 1, blankNumber: nextBn,
                            }));
                            setEditForm({ ...editForm, choices: [...(editForm.choices || []), ...newChoices] });
                          }}>
                          <Plus size={13} /> Add Blank [{nextBn}]
                        </button>
                      );
                    })()}
                  </>
                ) : (
                  /* Standard flat choices */
                  <>
                    {editForm.choices?.map((c, ci) => (
                      <div key={ci} style={{ marginBottom: 10, padding: 12, backgroundColor: 'var(--admin-bg)', borderRadius: 8, border: '1px solid var(--admin-border)' }}>
                        <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: section?.type === 'LISTENING_IMAGE' ? 8 : 0 }}>
                          <span style={{ color: '#fff', fontWeight: 700, width: 22, fontSize: 13, flexShrink: 0 }}>{c.label}</span>
                          <input className="admin-input" style={{ flex: 1 }} value={c.text || ''}
                            onChange={e => {
                              const nc = [...(editForm.choices || [])];
                              nc[ci] = { ...nc[ci], text: e.target.value };
                              setEditForm({ ...editForm, choices: nc });
                            }} />
                          <label style={{ color: '#94a3b8', fontSize: 12, display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer', whiteSpace: 'nowrap' }}>
                            <input type="radio" name="correct" checked={c.isCorrect || false}
                              onChange={() => {
                                const nc = (editForm.choices || []).map((ch, i) => ({ ...ch, isCorrect: i === ci }));
                                setEditForm({ ...editForm, choices: nc });
                              }} />
                            Correct
                          </label>
                          <button style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: 4, fontSize: 14, fontWeight: 700 }}
                            onClick={() => setEditForm({ ...editForm, choices: (editForm.choices || []).filter((_, i) => i !== ci) })}>
                            ✕
                          </button>
                        </div>

                        {section?.type === 'LISTENING_IMAGE' && (
                          <div style={{ marginTop: 8 }}>
                            <label className="admin-label" style={{ fontSize: 10 }}>
                              <Image size={10} style={{ verticalAlign: 'middle', marginRight: 3 }} /> Choice Image
                            </label>
                            <label style={{
                              display: 'inline-flex', alignItems: 'center', gap: 5, padding: '6px 12px',
                              borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: 'pointer',
                              background: 'rgba(59,130,246,0.08)', color: '#60a5fa',
                              border: '1px solid rgba(59,130,246,0.15)',
                            }}>
                              <Image size={11} /> {c.imageUrl ? 'Replace' : 'Upload'}
                              <input type="file" accept="image/*" style={{ display: 'none' }} onChange={async e => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  const url = await uploadImage(file);
                                  const nc = [...(editForm.choices || [])];
                                  nc[ci] = { ...nc[ci], imageUrl: url };
                                  setEditForm({ ...editForm, choices: nc });
                                }
                              }} />
                            </label>
                            {c.imageUrl && <img src={c.imageUrl} alt="" style={{ maxWidth: 140, marginTop: 6, borderRadius: 6, display: 'block', border: '1px solid #334155' }} />}
                          </div>
                        )}
                      </div>
                    ))}
                    <button className="admin-btn admin-btn-ghost" style={{ marginTop: 4, fontSize: 12 }} onClick={() => {
                      const labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
                      const nextLabel = labels[(editForm.choices || []).length] || labels[0];
                      setEditForm({ ...editForm, choices: [...(editForm.choices || []), { label: nextLabel, text: '', isCorrect: false, order: (editForm.choices || []).length + 1 }] });
                    }}><Plus size={12} /> Add Choice</button>
                  </>
                )}
              </div>

              <div style={{ display: 'flex', gap: 8 }}>
                <button className="admin-btn admin-btn-primary" onClick={saveQuestion} disabled={saving}>
                  {saving
                    ? <><span style={{ width: 12, height: 12, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.6s linear infinite', display: 'inline-block' }} /> Saving…</>
                    : <><Save size={13} /> Save</>
                  }
                </button>
                <button className="admin-btn admin-btn-ghost" onClick={() => setEditQ(null)}>Cancel</button>
              </div>
            </>
          ) : (
            /* ── View mode ── */
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                    <span style={{
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                      width: 24, height: 24, borderRadius: 6, background: '#1d3a5f',
                      color: '#60a5fa', fontSize: 11, fontWeight: 700, flexShrink: 0,
                    }}>
                      {qi + 1}
                    </span>
                    <span style={{ color: '#e2e8f0', fontWeight: 600, fontSize: 14, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {q.text}
                    </span>
                  </div>

                  {q.passage && (
                    <div style={{ color: '#64748b', fontSize: 12, marginBottom: 4, paddingLeft: 32, fontStyle: 'italic' }}>
                      {q.passage.substring(0, 100)}{q.passage.length > 100 ? '…' : ''}
                    </div>
                  )}

                  <div style={{ display: 'flex', gap: 8, paddingLeft: 32, flexWrap: 'wrap', marginTop: 4 }}>
                    {isListening && q.speechText && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: 3, color: '#64748b', fontSize: 11 }}>
                        <Volume2 size={11} /> Speech text
                      </span>
                    )}
                    {section.type === 'READING_SIGNS' && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 11, color: q.imageUrl ? '#34d399' : '#f87171' }}>
                        <Image size={11} /> {q.imageUrl ? 'Has image' : 'No image'}
                      </span>
                    )}
                    {section.type === 'LISTENING_IMAGE' && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 11, color: '#64748b' }}>
                        <Image size={11} /> {q.choices.filter(c => c.imageUrl).length}/{q.choices.length} images
                        {q.choices.filter(c => c.imageUrl).length < q.choices.length && <span style={{ color: '#f87171' }}>⚠</span>}
                      </span>
                    )}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                  {/* Move up/down */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <button className="admin-btn admin-btn-ghost" disabled={qi === 0}
                      style={{ fontSize: 11, padding: '3px 7px', opacity: qi === 0 ? 0.3 : 1 }}
                      onClick={() => moveQuestion(qi, -1)}>
                      <ChevronUp size={13} />
                    </button>
                    <button className="admin-btn admin-btn-ghost" disabled={qi === section.questions.length - 1}
                      style={{ fontSize: 11, padding: '3px 7px', opacity: qi === section.questions.length - 1 ? 0.3 : 1 }}
                      onClick={() => moveQuestion(qi, 1)}>
                      <ChevronDown size={13} />
                    </button>
                  </div>
                  <button className="admin-btn admin-btn-ghost" style={{ fontSize: 12, padding: '6px 12px' }} onClick={() => startEdit(q)}>
                    <Pencil size={12} /> Edit
                  </button>
                  <button className="admin-btn admin-btn-danger" style={{ fontSize: 12, padding: '6px 12px' }}
                    onClick={() => setConfirmDelQ({ open: true, qId: q.id, qText: q.text })}>
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>

              {/* Choice badges */}
              <div style={{ display: 'flex', gap: 6, marginTop: 10, paddingLeft: 32, flexWrap: 'wrap' }}>
                {isFillBlank ? (
                  [1,2,3,4,5].map(bn => {
                    const correct = q.choices.find(c => (c.blankNumber || 1) === bn && c.isCorrect);
                    const hasChoices = q.choices.some(c => (c.blankNumber || 1) === bn);
                    if (!hasChoices) return null;
                    return (
                      <span key={bn} className="admin-badge" style={{ background: '#1e293b', color: '#94a3b8', border: '1px solid #334155', gap: 4 }}>
                        <span style={{ color: '#34d399', fontWeight: 700 }}>[{bn}]</span>
                        <span style={{ color: correct ? '#34d399' : '#f87171' }}>{correct?.text || '?'}</span>
                      </span>
                    );
                  })
                ) : (
                  q.choices.map(c => (
                    <span key={c.id} className="admin-badge" style={{
                      background: c.isCorrect ? 'rgba(34,197,94,0.12)' : '#1e293b',
                      color: c.isCorrect ? '#4ade80' : '#64748b',
                      border: `1px solid ${c.isCorrect ? 'rgba(34,197,94,0.2)' : '#334155'}`,
                    }}>
                      {c.label}: {c.text}
                    </span>
                  ))
                )}
              </div>
            </>
          )}
        </div>
      ))}

      {/* Delete question dialog */}
      {confirmDelQ.open && (
        <div className="admin-dialog-overlay" onClick={() => setConfirmDelQ({ open: false, qId: '', qText: '' })}>
          <div className="admin-dialog" onClick={e => e.stopPropagation()}>
            <h3>Delete Question?</h3>
            <p>
              <strong style={{ color: '#e2e8f0' }}>{confirmDelQ.qText.substring(0, 80)}{confirmDelQ.qText.length > 80 ? '…' : ''}</strong>
              {' '}will be permanently deleted along with all its choices.
            </p>
            <div className="admin-dialog-actions">
              <button className="admin-btn admin-btn-ghost" onClick={() => setConfirmDelQ({ open: false, qId: '', qText: '' })}>
                Cancel
              </button>
              <button className="admin-btn" style={{ background: '#ef4444', color: '#fff' }} onClick={() => deleteQuestion(confirmDelQ.qId)}>
                <Trash2 size={13} /> Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toasts */}
      <div className="admin-toast-wrap">
        {toasts.map(t => (
          <div key={t.id} className={`admin-toast ${t.ok ? 'toast-success' : 'toast-error'}`}>
            {t.ok ? <CheckCircle size={15} /> : <XCircle size={15} />}
            {t.msg}
          </div>
        ))}
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </>
  );
}
