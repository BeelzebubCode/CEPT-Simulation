'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Layers, ArrowLeft, LogOut, Menu, X } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (pathname === '/admin/login') return <>{children}</>;

  const navLinks = [
    { href: '/admin',          label: 'Dashboard', icon: <LayoutDashboard size={16} />, exact: true },
    { href: '/admin/sections', label: 'Sections',  icon: <Layers size={16} />,          exact: false },
  ];

  const isActive = (href: string, exact: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin/login');
  };

  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="admin-layout">
      {/* Mobile top bar */}
      <header className="admin-mobile-bar">
        <button className="admin-hamburger" onClick={() => setSidebarOpen(true)} aria-label="Open menu">
          <Menu size={20} />
        </button>
        <span style={{ fontWeight: 700, color: '#fff', fontSize: 15 }}>CEPT Admin</span>
        <div style={{ width: 40 }} />
      </header>

      {sidebarOpen && <div className="admin-overlay" onClick={closeSidebar} />}

      {/* Sidebar */}
      <aside className={`admin-sidebar${sidebarOpen ? ' open' : ''}`}>
        <button className="admin-sidebar-close" onClick={closeSidebar} aria-label="Close menu">
          <X size={18} />
        </button>

        {/* Logo */}
        <div className="admin-sidebar-logo">
          <div style={{
            width: 34, height: 34, borderRadius: 9, flexShrink: 0,
            background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 12, fontWeight: 900, color: '#fff',
            boxShadow: '0 4px 12px rgba(59,130,246,0.3)',
          }}>
            CU
          </div>
          <div className="admin-sidebar-logo-text">
            <strong>CEPT Admin</strong>
            <span>Exam Management</span>
          </div>
        </div>

        {/* Nav */}
        <nav className="admin-nav">
          {navLinks.map(l => (
            <Link
              key={l.href}
              href={l.href}
              onClick={closeSidebar}
              className={isActive(l.href, l.exact) ? 'active' : ''}
            >
              {l.icon} {l.label}
            </Link>
          ))}
        </nav>

        {/* Footer */}
        <div className="admin-sidebar-footer">
          <Link href="/" onClick={closeSidebar}>
            <ArrowLeft size={15} /> Back to Exam
          </Link>
          <button onClick={handleLogout}>
            <LogOut size={15} /> Sign out
          </button>
        </div>
      </aside>

      <main className="admin-main">{children}</main>
    </div>
  );
}
