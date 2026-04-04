'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { BarChart3, Award, RotateCcw } from 'lucide-react';

interface AdaptiveResult {
  score: number;
  cefr: string;
  totalItems: number;
  correctCount: number;
}

export default function ResultsPage() {
  const [result, setResult] = useState<AdaptiveResult | null>(null);

  useEffect(() => {
    const data = localStorage.getItem('cept_adaptive_result');
    if (data) {
      setResult(JSON.parse(data));
    }
  }, []);

  if (!result) return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', gap: 16 }}>
      <p>No results found.</p>
      <Link href="/" className="btn btn-primary">Go Home</Link>
    </div>
  );

  const restart = () => {
    localStorage.removeItem('cept_adaptive_result');
    window.location.href = '/';
  };

  const getCefrColor = (level: string) => {
     if (level === 'C2' || level === 'C1') return '#1b5e20'; // Dark green
     if (level === 'B2') return '#2e7d32'; // Green
     if (level === 'B1') return '#f57f17'; // Yellow/Orange
     if (level === 'A2') return '#e65100'; // Orange
     return '#c62828'; // Red
  };

  return (
    <>
      <div className="results-hero">
        <h1><BarChart3 size={32} style={{ verticalAlign: 'middle', marginRight: 10 }} />CEPT Results</h1>
        <p>Your Computer Adaptive Test Simulation Score</p>
      </div>
      <div className="results-body">
        <div className="score-card" style={{ padding: '48px 36px' }}>
          
          <h2 style={{ fontSize: 18, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: 2 }}>
             Final CEPT Score
          </h2>
          <div className="total-score" style={{ fontSize: 90, margin: '20px 0' }}>
             {result.score}<small style={{ fontSize: 24, fontWeight: 500, color: '#aaa' }}> / 50</small>
          </div>

          <div style={{ 
               display: 'inline-flex', alignItems: 'center', gap: 10, 
               background: getCefrColor(result.cefr), color: '#fff', 
               padding: '12px 32px', borderRadius: 50, 
               fontSize: 24, fontWeight: 800, marginTop: 10 
          }}>
             <Award size={28} /> CEFR Level: {result.cefr}
          </div>

          <div style={{ marginTop: 40, borderTop: '1px solid var(--border)', paddingTop: 24, display: 'flex', justifyContent: 'space-around', color: 'var(--text-secondary)' }}>
             <div>
                <div style={{ fontSize: 13, textTransform: 'uppercase' }}>Questions Answered</div>
                <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--primary)' }}>{result.totalItems}</div>
             </div>
             <div>
                <div style={{ fontSize: 13, textTransform: 'uppercase' }}>Estimated Accuracy</div>
                <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--primary)' }}>
                   {Math.round((result.correctCount / result.totalItems) * 100)}%
                </div>
             </div>
          </div>
        </div>

        <button className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center', padding: 16, fontSize: 16 }}
          onClick={restart}>
          <RotateCcw size={18} /> Return Home
        </button>
      </div>
    </>
  );
}
