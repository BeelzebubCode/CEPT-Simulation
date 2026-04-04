'use client';
import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { Volume2, Save, Plus, Pencil, Trash2, Image } from 'lucide-react';

interface Choice { id: string; label: string; text: string; imageUrl?: string; isCorrect: boolean; order: number; blankNumber?: number; }
interface Question { id: string; text: string; passage?: string; speechText?: string; imageUrl?: string; order: number; choices: Choice[]; }
interface Section { id: string; name: string; description?: string; type: string; timeLimit: number; order: number; questions: Question[]; }

export default function SectionEditor() {
  const { id } = useParams();
  const [section, setSection] = useState<Section | null>(null);
  const [editQ, setEditQ] = useState<string | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [editForm, setEditForm] = useState<{ text?: string; passage?: string; speechText?: string; imageUrl?: string; choices?: any[] }>({});
  const [saving, setSaving] = useState(false);

  const load = useCallback(() => {
    fetch(`/api/sections/${id}`).then(r => r.json()).then(setSection);
  }, [id]);
  useEffect(() => { load(); }, [load]);

  const updateSection = async (data: Partial<Section>) => {
    await fetch(`/api/sections/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
    load();
  };

  const startEdit = (q: Question) => {
    setEditQ(q.id);
    setEditForm({ text: q.text, passage: q.passage || '', speechText: q.speechText || '', imageUrl: q.imageUrl || '', choices: q.choices.map(c => ({ ...c })) });
  };

  const saveQuestion = async () => {
    if (!editQ) return;
    setSaving(true);
    await fetch(`/api/questions/${editQ}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editForm),
    });
    setSaving(false);
    setEditQ(null);
    load();
  };

  const addQuestion = async () => {
    if (!section) return;
    const order = section.questions.length + 1;
    await fetch('/api/questions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sectionId: id,
        text: 'New question',
        order,
        choices: [
          { label: 'A', text: 'Option A', isCorrect: true, order: 1 },
          { label: 'B', text: 'Option B', isCorrect: false, order: 2 },
          { label: 'C', text: 'Option C', isCorrect: false, order: 3 },
          { label: 'D', text: 'Option D', isCorrect: false, order: 4 },
        ],
      }),
    });
    load();
  };

  const deleteQuestion = async (qId: string) => {
    if (!confirm('Delete this question?')) return;
    await fetch(`/api/questions/${qId}`, { method: 'DELETE' });
    load();
  };

  const uploadImage = async (file: File) => {
    const fd = new FormData();
    fd.append('file', file);
    const res = await fetch('/api/upload', { method: 'POST', body: fd });
    const data = await res.json();
    return data.url as string;
  };

  if (!section) return <div style={{ color: '#fff', padding: 40 }}>Loading...</div>;

  const isListening = section.type === 'LISTENING_TEXT' || section.type === 'LISTENING_IMAGE';
  const isFillBlank = section.type === 'READING_FILL_BLANK';

  return (
    <>
      <div className="admin-header">
        <h1>{section.name}</h1>
        <p>{section.description} · {section.questions.length} questions · {section.timeLimit} min</p>
      </div>

      {/* Section settings */}
      <div className="admin-card" style={{ marginBottom: 24 }}>
        <h2>Section Settings</h2>
        <div className="admin-grid">
          <div>
            <label className="admin-label">Name</label>
            <input className="admin-input" defaultValue={section.name} onBlur={e => updateSection({ name: e.target.value })} />
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

      {/* Questions */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h2 style={{ color: '#fff', fontSize: 20 }}>Questions ({section.questions.length})</h2>
        <button className="admin-btn admin-btn-primary" onClick={addQuestion}><Plus size={14} /> Add Question</button>
      </div>

      {section.questions.map((q, qi) => (
        <div key={q.id} className="admin-card">
          {editQ === q.id ? (
            /* Edit mode */
            <>
              <div style={{ marginBottom: 16 }}>
                <label className="admin-label">Question Text</label>
                <textarea className="admin-input admin-textarea" value={editForm.text || ''}
                  onChange={e => setEditForm({ ...editForm, text: e.target.value })} />
              </div>
              <div style={{ marginBottom: 16 }}>
                <label className="admin-label">Passage / Context</label>
                <textarea className="admin-input admin-textarea" value={editForm.passage || ''}
                  onChange={e => setEditForm({ ...editForm, passage: e.target.value })} />
              </div>
              {isListening && (
                <div style={{ marginBottom: 16 }}>
                  <label className="admin-label"><Volume2 size={14} style={{ verticalAlign: 'middle', marginRight: 4 }} /> Speech Text (TTS)</label>
                  <textarea className="admin-input admin-textarea" rows={4} value={editForm.speechText || ''}
                    onChange={e => setEditForm({ ...editForm, speechText: e.target.value })}
                    placeholder="Text that will be read aloud by Web Speech API..." />
                </div>
              )}
              <div style={{ marginBottom: 16 }}>
                <label className="admin-label">Image Upload</label>
                <input type="file" accept="image/*" onChange={async e => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const url = await uploadImage(file);
                    setEditForm({ ...editForm, imageUrl: url });
                  }
                }} style={{ color: 'var(--admin-text)' }} />
                {editForm.imageUrl && <img src={editForm.imageUrl} alt="" style={{ maxWidth: 200, marginTop: 8, borderRadius: 8 }} />}
              </div>
              <div style={{ marginBottom: 16 }}>
                <label className="admin-label">Choices {isFillBlank && '(grouped by blank number)'}</label>
                {isFillBlank ? (
                  /* ─── FILL-BLANK: choices grouped by blank ─── */
                  <>
                    {[1,2,3,4,5].map(bn => {
                      const blankChoices = (editForm.choices || []).filter(c => (c.blankNumber || 1) === bn);
                      if (blankChoices.length === 0) return null;
                      return (
                        <div key={bn} style={{ marginBottom: 16, padding: 12, backgroundColor: 'var(--admin-bg)', borderRadius: 8, border: '1px solid var(--admin-border)' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                            <span style={{ color: '#6366f1', fontSize: 13, fontWeight: 700 }}>Blank [{bn}]</span>
                            <button className="admin-btn admin-btn-primary" style={{ padding: '4px 10px', fontSize: 11 }} onClick={() => {
                              const labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
                              const nextLabel = labels[blankChoices.length] || labels[0];
                              const newChoice = { label: nextLabel, text: '', isCorrect: false, order: (editForm.choices || []).length + 1, blankNumber: bn };
                              setEditForm({ ...editForm, choices: [...(editForm.choices || []), newChoice] });
                            }}><Plus size={10} /> Add</button>
                          </div>
                          {blankChoices.map(c => {
                            const ci = (editForm.choices || []).indexOf(c);
                            return (
                              <div key={ci} style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 6 }}>
                                <span style={{ color: '#fff', fontWeight: 700, width: 24 }}>{c.label}</span>
                                <input className="admin-input" style={{ flex: 1 }} value={c.text || ''}
                                  onChange={e => {
                                    const newChoices = [...(editForm.choices || [])];
                                    newChoices[ci] = { ...newChoices[ci], text: e.target.value };
                                    setEditForm({ ...editForm, choices: newChoices });
                                  }} />
                                <label style={{ color: '#94a3b8', fontSize: 12, display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer', whiteSpace: 'nowrap' }}>
                                  <input type="radio" name={`correct-blank-${bn}`} checked={c.isCorrect || false}
                                    onChange={() => {
                                      const newChoices = (editForm.choices || []).map(ch => {
                                        if ((ch.blankNumber || 1) === bn) return { ...ch, isCorrect: ch === c };
                                        return ch;
                                      });
                                      setEditForm({ ...editForm, choices: newChoices });
                                    }} />
                                  ✓
                                </label>
                                <button style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: 4, fontSize: 14, fontWeight: 700 }}
                                  onClick={() => {
                                    const newChoices = (editForm.choices || []).filter((_, i) => i !== ci);
                                    setEditForm({ ...editForm, choices: newChoices });
                                  }}>✕</button>
                              </div>
                            );
                          })}
                        </div>
                      );
                    })}
                  </>
                ) : (
                  /* ─── STANDARD: flat choices ─── */
                  <>
                    {editForm.choices?.map((c, ci) => (
                      <div key={ci} style={{ marginBottom: 12, padding: 12, backgroundColor: 'var(--admin-bg)', borderRadius: 8, border: '1px solid var(--admin-border)' }}>
                        <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: isListening ? 8 : 0 }}>
                          <span style={{ color: '#fff', fontWeight: 700, width: 24 }}>{c.label}</span>
                          <input className="admin-input" style={{ flex: 1 }} value={c.text || ''}
                            onChange={e => {
                              const newChoices = [...(editForm.choices || [])];
                              newChoices[ci] = { ...newChoices[ci], text: e.target.value };
                              setEditForm({ ...editForm, choices: newChoices });
                            }} />
                          <label style={{ color: '#94a3b8', fontSize: 12, display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer', whiteSpace: 'nowrap' }}>
                            <input type="radio" name="correct" checked={c.isCorrect || false}
                              onChange={() => {
                                const newChoices = (editForm.choices || []).map((ch, i) => ({ ...ch, isCorrect: i === ci }));
                                setEditForm({ ...editForm, choices: newChoices });
                              }} />
                            Correct
                          </label>
                          <button style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: 4, fontSize: 14, fontWeight: 700 }}
                            onClick={() => {
                              const newChoices = (editForm.choices || []).filter((_, i) => i !== ci);
                              setEditForm({ ...editForm, choices: newChoices });
                            }}>✕</button>
                        </div>
                        {section?.type === 'LISTENING_IMAGE' && (
                          <div style={{ marginTop: 8 }}>
                            <label className="admin-label" style={{ fontSize: 11 }}><Image size={11} style={{ verticalAlign: 'middle', marginRight: 3 }} /> Choice Image</label>
                            <input type="file" accept="image/*" onChange={async e => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const url = await uploadImage(file);
                                const newChoices = [...(editForm.choices || [])];
                                newChoices[ci] = { ...newChoices[ci], imageUrl: url };
                                setEditForm({ ...editForm, choices: newChoices });
                              }
                            }} style={{ color: 'var(--admin-text)', fontSize: 12 }} />
                            {c.imageUrl && <img src={c.imageUrl} alt="" style={{ maxWidth: 140, marginTop: 6, borderRadius: 6 }} />}
                          </div>
                        )}
                      </div>
                    ))}
                    <button className="admin-btn admin-btn-primary" style={{ marginTop: 4 }} onClick={() => {
                      const labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
                      const nextLabel = labels[(editForm.choices || []).length] || labels[0];
                      const newChoice = { label: nextLabel, text: '', isCorrect: false, order: (editForm.choices || []).length + 1 };
                      setEditForm({ ...editForm, choices: [...(editForm.choices || []), newChoice] });
                    }}><Plus size={12} /> Add Choice</button>
                  </>
                )}
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="admin-btn admin-btn-primary" onClick={saveQuestion} disabled={saving}>
                  {saving ? 'Saving...' : <><Save size={14} /> Save</>}
                </button>
                <button className="admin-btn admin-btn-ghost" onClick={() => setEditQ(null)}>Cancel</button>
              </div>
            </>
          ) : (
            /* View mode */
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                <div>
                  <span style={{ color: '#94a3b8', fontSize: 12, fontWeight: 600 }}>Q{qi + 1}</span>
                  <div style={{ color: '#fff', fontWeight: 600, marginTop: 4 }}>{q.text}</div>
                  {q.passage && <div style={{ color: '#94a3b8', fontSize: 13, marginTop: 4, fontStyle: 'italic' }}>{q.passage.substring(0, 100)}...</div>}
                  {isListening && q.speechText && <div style={{ color: '#64748b', fontSize: 12, marginTop: 4, display: 'flex', alignItems: 'center', gap: 4 }}><Volume2 size={12} /> Has speech text</div>}
                  {(section.type === 'READING_SIGNS') && (
                    <div style={{ fontSize: 12, marginTop: 4, display: 'flex', alignItems: 'center', gap: 4, color: q.imageUrl ? '#22c55e' : '#ef4444' }}>
                      <Image size={12} /> {q.imageUrl ? 'Has image' : 'No image yet'}
                    </div>
                  )}
                  {section.type === 'LISTENING_IMAGE' && (
                    <div style={{ fontSize: 12, marginTop: 4, display: 'flex', alignItems: 'center', gap: 4, color: '#94a3b8' }}>
                      <Image size={12} />
                      {q.choices.filter(c => c.imageUrl).length} / {q.choices.length} choices have images
                      {q.choices.filter(c => c.imageUrl).length < q.choices.length && <span style={{ color: '#ef4444' }}>⚠</span>}
                    </div>
                  )}
                </div>
                <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                  <button className="admin-btn admin-btn-primary" onClick={() => startEdit(q)}><Pencil size={12} /> Edit</button>
                  <button className="admin-btn admin-btn-danger" onClick={() => deleteQuestion(q.id)}><Trash2 size={12} /> Del</button>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
                {isFillBlank ? (
                  /* Fill-blank view: group by blank number */
                  [1,2,3,4,5].map(bn => {
                    const blankChoices = q.choices.filter(c => (c.blankNumber || 1) === bn);
                    if (blankChoices.length === 0) return null;
                    const correct = blankChoices.find(c => c.isCorrect);
                    return (
                      <span key={bn} className="admin-badge" style={{ backgroundColor: '#1e293b', color: '#94a3b8', border: '1px solid var(--admin-border)', display: 'flex', gap: 4, alignItems: 'center' }}>
                        <span style={{ color: '#6366f1', fontWeight: 700 }}>[{bn}]</span>
                        <span style={{ color: correct ? '#22c55e' : '#ef4444', fontWeight: 600 }}>{correct?.text || '?'}</span>
                      </span>
                    );
                  })
                ) : (
                  q.choices.map(c => (
                    <span key={c.id} className="admin-badge" style={{
                      backgroundColor: c.isCorrect ? 'var(--correct)' : '#334155',
                      color: c.isCorrect ? '#fff' : 'var(--admin-text)',
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
    </>
  );
}
