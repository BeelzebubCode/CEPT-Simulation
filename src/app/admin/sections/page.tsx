'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Section { id: string; name: string; type: string; timeLimit: number; order: number; _count: { questions: number }; }

export default function SectionsPage() {
  const [sections, setSections] = useState<Section[]>([]);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({ name: '', description: '', type: 'LISTENING_TEXT', timeLimit: 20, order: 1 });

  const load = () => fetch('/api/sections').then(r => r.json()).then(setSections);
  useEffect(() => { load(); }, []);

  const create = async () => {
    await fetch('/api/sections', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    setCreating(false);
    load();
  };

  const del = async (id: string) => {
    if (!confirm('Delete this section and all its questions?')) return;
    await fetch(`/api/sections/${id}`, { method: 'DELETE' });
    load();
  };

  return (
    <>
      <div className="admin-header">
        <h1>Sections</h1>
        <p>Manage exam sections and their questions</p>
      </div>
      <button className="admin-btn admin-btn-primary" style={{ marginBottom: 16 }} onClick={() => setCreating(!creating)}>
        + New Section
      </button>
      {creating && (
        <div className="admin-card">
          <h2>Create Section</h2>
          <div className="admin-grid">
            <div>
              <label className="admin-label">Name</label>
              <input className="admin-input" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
            </div>
            <div>
              <label className="admin-label">Type</label>
              <select className="admin-input admin-select" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
                <option value="LISTENING_TEXT">Listening Text</option>
                <option value="LISTENING_IMAGE">Listening Image</option>
                <option value="READING_SIGNS">Reading Signs</option>
                <option value="READING_FILL_BLANK">Reading Fill Blank</option>
                <option value="READING_COMPREHENSION">Reading Comprehension</option>
              </select>
            </div>
            <div>
              <label className="admin-label">Time Limit (min)</label>
              <input className="admin-input" type="number" value={form.timeLimit} onChange={e => setForm({ ...form, timeLimit: parseInt(e.target.value) })} />
            </div>
            <div>
              <label className="admin-label">Order</label>
              <input className="admin-input" type="number" value={form.order} onChange={e => setForm({ ...form, order: parseInt(e.target.value) })} />
            </div>
          </div>
          <div style={{ marginTop: 16, display: 'flex', gap: 8 }}>
            <button className="admin-btn admin-btn-primary" onClick={create}>Create</button>
            <button className="admin-btn admin-btn-ghost" onClick={() => setCreating(false)}>Cancel</button>
          </div>
        </div>
      )}
      <div className="admin-card">
        <table className="admin-table">
          <thead>
            <tr><th>#</th><th>Name</th><th>Type</th><th>Time</th><th>Qs</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {sections.map(s => (
              <tr key={s.id}>
                <td>{s.order}</td>
                <td style={{ fontWeight: 600, color: '#fff' }}>{s.name}</td>
                <td><span className="admin-badge" style={{ background: '#334155' }}>{s.type}</span></td>
                <td>{s.timeLimit}m</td>
                <td>{s._count.questions}</td>
                <td style={{ display: 'flex', gap: 6 }}>
                  <Link href={`/admin/sections/${s.id}`} className="admin-btn admin-btn-primary">Edit</Link>
                  <button className="admin-btn admin-btn-danger" onClick={() => del(s.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
