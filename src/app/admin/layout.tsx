'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, FileText, ArrowLeft, LogOut } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  // Login page renders without the sidebar shell
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  const links = [
    { href: '/admin', label: 'Dashboard', icon: <LayoutDashboard size={16} />, exact: true },
    { href: '/admin/sections', label: 'Sections', icon: <FileText size={16} />, exact: false },
  ];

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin/login');
  };

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-logo">
          <div className="logo-mini" style={{ background: 'var(--admin-accent)' }}>CU</div>
          CEPT Admin
        </div>
        <nav className="admin-nav" style={{ flex: 1 }}>
          {links.map(l => (
            <Link key={l.href} href={l.href}
              className={l.exact ? (pathname === l.href ? 'active' : '') : (pathname.startsWith(l.href) ? 'active' : '')}>
              {l.icon} {l.label}
            </Link>
          ))}
          <Link href="/" style={{ marginTop: 24, opacity: 0.6 }}>
            <ArrowLeft size={14} /> Back to Exam
          </Link>
        </nav>
        <button
          onClick={handleLogout}
          style={{
            width: '100%', background: 'none', border: '1px solid var(--admin-border)',
            borderRadius: 8, color: '#94a3b8', padding: '10px 12px', cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, fontFamily: 'inherit',
            marginTop: 16,
          }}
        >
          <LogOut size={14} /> Sign out
        </button>
      </aside>
      <main className="admin-main">{children}</main>
    </div>
  );
}