'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Section { id: string; name: string; type: string; timeLimit: number; order: number; _count: { questions: number }; }

export default function AdminDashboard() {
  const [sections, setSections] = useState<Section[]>([]);
  useEffect(() => { fetch('/api/sections').then(r => r.json()).then(setSections); }, []);

  const totalQ = sections.reduce((sum, s) => sum + s._count.questions, 0);

  return (
    <>
      <div className="admin-header">
        <h1>Dashboard</h1>
        <p>Manage your CEPT exam content</p>
      </div>
      <div className="admin-grid" style={{ marginBottom: 24 }}>
        <div className="admin-card admin-stat">
          <div className="stat-value">{sections.length}</div>
          <div className="stat-label">Sections</div>
        </div>
        <div className="admin-card admin-stat">
          <div className="stat-value">{totalQ}</div>
          <div className="stat-label">Total Questions</div>
        </div>
      </div>
      <div className="admin-card">
        <h2>Sections</h2>
        <table className="admin-table">
          <thead>
            <tr><th>Order</th><th>Name</th><th>Type</th><th>Time</th><th>Questions</th><th></th></tr>
          </thead>
          <tbody>
            {sections.map(s => (
              <tr key={s.id}>
                <td>{s.order}</td>
                <td style={{ fontWeight: 600, color: '#fff' }}>{s.name}</td>
                <td><span className="admin-badge" style={{ background: '#334155' }}>{s.type}</span></td>
                <td>{s.timeLimit} min</td>
                <td>{s._count.questions}</td>
                <td><Link href={`/admin/sections/${s.id}`} className="admin-btn admin-btn-primary">Edit</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
