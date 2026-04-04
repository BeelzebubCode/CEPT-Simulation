'use client';
import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Lock } from 'lucide-react';

export default function AdminLogin() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        router.push('/admin');
      } else {
        const data = await res.json();
        setError(data.error ?? 'Login failed');
      }
    } catch {
      setError('Network error — please try again');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--admin-bg)',
    }}>
      <div style={{
        background: 'var(--admin-sidebar)',
        border: '1px solid var(--admin-border)',
        borderRadius: 16,
        padding: '40px 36px',
        width: '100%',
        maxWidth: 380,
        boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
      }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            width: 48, height: 48, borderRadius: 12,
            background: 'var(--admin-accent)',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: 16,
          }}>
            <Lock size={22} color="#fff" />
          </div>
          <h1 style={{ color: '#fff', fontSize: 22, fontWeight: 700 }}>CEPT Admin</h1>
          <p style={{ color: '#94a3b8', fontSize: 14, marginTop: 4 }}>Enter your password to continue</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 16 }}>
            <label className="admin-label">Password</label>
            <input
              className="admin-input"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              autoFocus
              autoComplete="current-password"
              required
            />
          </div>

          {error && (
            <div style={{
              background: 'rgba(239,68,68,0.15)',
              border: '1px solid rgba(239,68,68,0.4)',
              borderRadius: 8,
              padding: '10px 14px',
              color: '#fca5a5',
              fontSize: 13,
              marginBottom: 16,
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            className="admin-btn admin-btn-primary"
            style={{ width: '100%', justifyContent: 'center', padding: '12px 0' }}
            disabled={loading}
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  );
}
