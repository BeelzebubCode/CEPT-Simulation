'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Layers, HelpCircle, Headphones, BookOpen } from 'lucide-react';

interface Section {
  id: string; name: string; type: string;
  timeLimit: number; order: number; _count: { questions: number };
}

import { TYPE_BADGE } from '@/lib/constants';

export default function AdminDashboard() {
  const [sections, setSections] = useState<Section[] | null>(null);

  useEffect(() => {
    fetch('/api/sections').then(r => r.json()).then(setSections);
  }, []);

  const totalQ       = (sections ?? []).reduce((s, sec) => s + sec._count.questions, 0);
  const listeningCnt = (sections ?? []).filter(s => s.type.startsWith('LISTENING')).length;
  const readingCnt   = (sections ?? []).filter(s => s.type.startsWith('READING')).length;

  return (
    <>
      <div className="admin-header">
        <h1>Dashboard</h1>
        <p>Overview of your CEPT exam content</p>
      </div>

      {/* Stat cards — 2×2 grid */}
      <div className="admin-grid" style={{ marginBottom: 24 }}>
        <div className="admin-card stat-card">
          <div className="stat-icon stat-icon-blue"><Layers size={20} /></div>
          <div className="stat-body">
            <div className="stat-value">{sections === null ? '—' : sections.length}</div>
            <div className="stat-label">Sections</div>
          </div>
        </div>
        <div className="admin-card stat-card">
          <div className="stat-icon stat-icon-purple"><HelpCircle size={20} /></div>
          <div className="stat-body">
            <div className="stat-value">{sections === null ? '—' : totalQ}</div>
            <div className="stat-label">Questions</div>
          </div>
        </div>
        <div className="admin-card stat-card">
          <div className="stat-icon" style={{ background: 'rgba(236,72,153,0.1)', color: '#f472b6', width: 44, height: 44, borderRadius: 11, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Headphones size={20} />
          </div>
          <div className="stat-body">
            <div className="stat-value">{sections === null ? '—' : listeningCnt}</div>
            <div className="stat-label">Listening</div>
          </div>
        </div>
        <div className="admin-card stat-card">
          <div className="stat-icon stat-icon-green"><BookOpen size={20} /></div>
          <div className="stat-body">
            <div className="stat-value">{sections === null ? '—' : readingCnt}</div>
            <div className="stat-label">Reading</div>
          </div>
        </div>
      </div>

      {/* Sections table */}
      <div className="admin-card">
        <div className="admin-card-header">
          <h2>All Sections</h2>
          <Link href="/admin/sections" className="admin-btn admin-btn-ghost" style={{ fontSize: 12, padding: '6px 12px' }}>
            Manage →
          </Link>
        </div>

        {sections === null ? (
          /* Skeleton loader */
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="admin-skeleton" style={{ height: 44 }} />
            ))}
          </div>
        ) : sections.length === 0 ? (
          <div className="admin-empty">
            <Layers size={36} />
            <p>No sections yet. <Link href="/admin/sections" style={{ color: '#60a5fa' }}>Create one →</Link></p>
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
                <th></th>
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
                    <td style={{ textAlign: 'right' }}>
                      <Link href={`/admin/sections/${s.id}`} className="admin-btn admin-btn-primary" style={{ fontSize: 12, padding: '6px 12px' }}>
                        Edit
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
