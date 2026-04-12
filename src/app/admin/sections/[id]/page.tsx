'use client';
import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { Volume2, Save, Plus, Pencil, Trash2, Image, CheckCircle, XCircle } from 'lucide-react';
import { upload } from '@vercel/blob/client';

interface Choice { id: string; label: string; text: string; imageUrl?: string; isCorrect: boolean; order: number; blankNumber?: number; }
interface Question { id: string; text: string; passage?: string; speechText?: string; imageUrl?: string; order: number; choices: Choice[]; }
interface Section { id: string; name: string; description?: string; type: string; timeLimit: number; order: number; questions: Question[]; }
interface Toast { id: number; msg: string; ok: boolean; }

const TYPE_BADGE: Record<string, { label: string; cls: string }> = {
  LISTENING_TEXT:        { label: 'Listening Text',  cls: 'badge-listening-text' },
  LISTENING_IMAGE:       { label: 'Listening Image', cls: 'badge-listening-image' },
  READING_SIGNS:         { label: 'Reading Signs',   cls: 'badge-reading-signs' },
  READING_FILL_BLANK:    { label: 'Fill Blank',      cls: 'badge-reading-fill' },
  READING_COMPREHENSION: { label: 'Comprehension',   cls: 'badge-reading-comp' },
};

export default function SectionEditor() {
  const { id } = useParams();
  const [section, setSection]     = useState<Section | null>(null);
  const [editQ, setEditQ]         = useState<string | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [editForm, setEditForm]   = useState<{ text?: string; passage?: string; speechText?: string; imageUrl?: string; choices?: any[] }>({});
  const [saving, setSaving]       = useState(false);
  const [toasts, setToasts]       = useState<Toast[]>([]);
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

  const uploadImage = async (file: File) => {
    const blob = await upload(file.name, file, { access: 'public', handleUploadUrl: '/api/upload' });
    return blob.url;
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
                  [1,2,3,4,5].map(bn => {
                    const blankChoices = (editForm.choices || []).filter(c => (c.blankNumber || 1) === bn);
                    if (blankChoices.length === 0) return null;
                    return (
                      <div key={bn} style={{ marginBottom: 12, padding: 12, backgroundColor: 'var(--admin-bg)', borderRadius: 8, border: '1px solid var(--admin-border)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                          <span className="admin-badge badge-reading-fill">Blank [{bn}]</span>
                          <button className="admin-btn admin-btn-primary" style={{ padding: '4px 10px', fontSize: 11 }} onClick={() => {
                            const labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
                            const newChoice = { label: labels[blankChoices.length] || labels[0], text: '', isCorrect: false, order: (editForm.choices || []).length + 1, blankNumber: bn };
                            setEditForm({ ...editForm, choices: [...(editForm.choices || []), newChoice] });
                          }}><Plus size={10} /> Add</button>
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
                      </div>
                    );
                  })
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
