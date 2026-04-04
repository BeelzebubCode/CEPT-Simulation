'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, FileText, ArrowLeft } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const links = [
    { href: '/admin', label: 'Dashboard', icon: <LayoutDashboard size={16} />, exact: true },
    { href: '/admin/sections', label: 'Sections', icon: <FileText size={16} />, exact: false },
  ];
  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-logo">
          <div className="logo-mini" style={{ background: 'var(--admin-accent)' }}>CU</div>
          CEPT Admin
        </div>
        <nav className="admin-nav">
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
      </aside>
      <main className="admin-main">{children}</main>
    </div>
  );
}
