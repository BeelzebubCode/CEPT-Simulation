'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Pencil, Trash2, Layers, CheckCircle, XCircle } from 'lucide-react';

interface Section {
  id: string; name: string; type: string;
  timeLimit: number; order: number; _count: { questions: number };
}

const TYPE_BADGE: Record<string, { label: string; cls: string }> = {
  LISTENING_TEXT:        { label: 'Listening Text',  cls: 'badge-listening-text' },
  LISTENING_IMAGE:       { label: 'Listening Image', cls: 'badge-listening-image' },
  READING_SIGNS:         { label: 'Reading Signs',   cls: 'badge-reading-signs' },
  READING_FILL_BLANK:    { label: 'Fill Blank',      cls: 'badge-reading-fill' },
  READING_COMPREHENSION: { label: 'Comprehension',   cls: 'badge-reading-comp' },
};

const TYPE_OPTIONS = [
  { value: 'LISTENING_TEXT',        label: 'Listening Text' },
  { value: 'LISTENING_IMAGE',       label: 'Listening Image' },
  { value: 'READING_SIGNS',         label: 'Reading Signs' },
  { value: 'READING_FILL_BLANK',    label: 'Reading Fill Blank' },
  { value: 'READING_COMPREHENSION', label: 'Reading Comprehension' },
];

interface Toast { id: number; msg: string; ok: boolean; }
interface ConfirmState { open: boolean; id: string; name: string; }

export default function SectionsPage() {
  const [sections, setSections]   = useState<Section[] | null>(null);
  const [creating, setCreating]   = useState(false);
  const [saving, setSaving]       = useState(false);
  const [form, setForm]           = useState({ name: '', type: 'LISTENING_TEXT', timeLimit: 20, order: 1 });
  const [toasts, setToasts]       = useState<Toast[]>([]);
  const [confirm, setConfirm]     = useState<ConfirmState>({ open: false, id: '', name: '' });

  const pushToast = (msg: string, ok = true) => {
    const id = Date.now();
    setToasts(t => [...t, { id, msg, ok }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3000);
  };

  const load = async () => {
    const data = await fetch('/api/sections').then(r => r.json());
    setSections(data);
  };
  useEffect(() => { load(); }, []);

  const create = async () => {
    if (!form.name.trim()) return;
    setSaving(true);
    try {
      await fetch('/api/sections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      setCreating(false);
      setForm({ name: '', type: 'LISTENING_TEXT', timeLimit: 20, order: 1 });
      await load();
      pushToast('Section created');
    } catch {
      pushToast('Failed to create section', false);
    } finally {
      setSaving(false);
    }
  };

  const doDelete = async () => {
    const { id } = confirm;
    setConfirm({ open: false, id: '', name: '' });
    try {
      await fetch(`/api/sections/${id}`, { method: 'DELETE' });
      await load();
      pushToast('Section deleted');
    } catch {
      pushToast('Delete failed', false);
    }
  };

  return (
    <>
      <div className="admin-header">
        <h1>Sections</h1>
        <p>Manage exam sections and their questions</p>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
        <button
          className={`admin-btn ${creating ? 'admin-btn-ghost' : 'admin-btn-primary'}`}
          onClick={() => setCreating(v => !v)}
        >
          {creating ? 'Cancel' : <><Plus size={14} /> New Section</>}
        </button>
      </div>

      {/* Create form */}
      {creating && (
        <div className="admin-card" style={{ marginBottom: 16 }}>
          <h2>New Section</h2>
          <div className="admin-grid">
            <div>
              <label className="admin-label">Name</label>
              <input
                className="admin-input"
                placeholder="e.g. Listening Part 1"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                autoFocus
              />
            </div>
            <div>
              <label className="admin-label">Type</label>
              <select
                className="admin-input admin-select"
                value={form.type}
                onChange={e => setForm({ ...form, type: e.target.value })}
              >
                {TYPE_OPTIONS.map(o => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="admin-label">Time Limit (min)</label>
              <input
                className="admin-input"
                type="number" min={1} max={180}
                value={form.timeLimit}
                onChange={e => setForm({ ...form, timeLimit: parseInt(e.target.value) })}
              />
            </div>
            <div>
              <label className="admin-label">Order</label>
              <input
                className="admin-input"
                type="number" min={1}
                value={form.order}
                onChange={e => setForm({ ...form, order: parseInt(e.target.value) })}
              />
            </div>
          </div>
          <div style={{ marginTop: 16, display: 'flex', gap: 8 }}>
            <button
              className="admin-btn admin-btn-primary"
              onClick={create}
              disabled={saving || !form.name.trim()}
            >
              {saving ? 'Creating…' : 'Create Section'}
            </button>
            <button className="admin-btn admin-btn-ghost" onClick={() => setCreating(false)}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Sections table */}
      <div className="admin-card">
        {sections === null ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="admin-skeleton" style={{ height: 48 }} />
            ))}
          </div>
        ) : sections.length === 0 ? (
          <div className="admin-empty">
            <Layers size={36} />
            <p>No sections yet. Click &ldquo;New Section&rdquo; to get started.</p>
          </div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th style={{ width: 40 }}>#</th>
                <th>Name</th>
                <th>Type</th>
                <th>Time</th>
                <th>Questions</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sections.map(s => {
                const badge = TYPE_BADGE[s.type] ?? { label: s.type, cls: '' };
                return (
                  <tr key={s.id}>
                    <td style={{ color: '#475569' }}>{s.order}</td>
                    <td style={{ fontWeight: 600, color: '#fff' }}>{s.name}</td>
                    <td><span className={`admin-badge ${badge.cls}`}>{badge.label}</span></td>
                    <td style={{ color: '#64748b' }}>{s.timeLimit} min</td>
                    <td style={{ color: '#64748b' }}>{s._count.questions}</td>
                    <td>
                      <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                        <Link
                          href={`/admin/sections/${s.id}`}
                          className="admin-btn admin-btn-primary"
                          style={{ fontSize: 12, padding: '6px 12px' }}
                        >
                          <Pencil size={12} /> Edit
                        </Link>
                        <button
                          className="admin-btn admin-btn-danger"
                          style={{ fontSize: 12, padding: '6px 12px' }}
                          onClick={() => setConfirm({ open: true, id: s.id, name: s.name })}
                        >
                          <Trash2 size={12} /> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Delete confirm dialog */}
      {confirm.open && (
        <div className="admin-dialog-overlay" onClick={() => setConfirm({ open: false, id: '', name: '' })}>
          <div className="admin-dialog" onClick={e => e.stopPropagation()}>
            <h3>Delete Section?</h3>
            <p>
              <strong style={{ color: '#e2e8f0' }}>{confirm.name}</strong> and all its questions
              will be permanently deleted. This cannot be undone.
            </p>
            <div className="admin-dialog-actions">
              <button
                className="admin-btn admin-btn-ghost"
                onClick={() => setConfirm({ open: false, id: '', name: '' })}
              >
                Cancel
              </button>
              <button
                className="admin-btn"
                style={{ background: '#ef4444', color: '#fff' }}
                onClick={doDelete}
              >
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
    </>
  );
}
