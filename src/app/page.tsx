import Link from 'next/link';
import { BookOpen, GraduationCap, ArrowRight, Activity, Clock, Sparkles } from 'lucide-react';

export default function Home() {
  return (
    <div className="landing">
      <div className="landing-content">
        <div className="landing-logo"><Sparkles size={48} /></div>
        <h1 className="landing-title">CEPT Exam Simulation</h1>
        <p className="landing-subtitle">CEPT Practice Simulation</p>
        
        <div className="landing-modes">
          <Link href="/practice" className="mode-card">
            <div className="mode-icon">
              <BookOpen size={32} color="#fff" />
            </div>
            <h2 className="mode-title">Practice Mode</h2>
            <div className="mode-desc">
              <p style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginBottom: 8 }}>
                <Clock size={16} /> No Time Limit
              </p>
              Relaxed mode. Choose any section, get instant answers after each question, and read the speech transcripts. Perfect for studying.
            </div>
            <div className="btn-start">
              Start Practice <ArrowRight size={18} />
            </div>
          </Link>

          <Link href="/exam" className="mode-card">
            <div className="mode-icon">
              <GraduationCap size={32} color="#fff" />
            </div>
            <h2 className="mode-title">Exam Mode</h2>
            <div className="mode-desc">
              <p style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginBottom: 8 }}>
                <Activity size={16} /> Adaptive CEPT Scoring
              </p>
              Simulate the real 30-minute exam. The difficulty adapts to your answers. Receive your final CEPT Score (0-50) and CEFR level.
            </div>
            <div className="btn-start" style={{ color: '#c62828' }}>
              Start Exam <ArrowRight size={18} />
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
