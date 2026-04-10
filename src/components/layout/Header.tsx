'use client';

import Link from 'next/link';

interface HeaderProps {
  title: string;
  breadcrumbs?: { label: string; href?: string }[];
}

export function Header({ title, breadcrumbs }: HeaderProps) {
  return (
    <header className="h-12 border-b border-slate-700/60 bg-[#0B1120]/80 backdrop-blur-sm px-6 flex items-center shrink-0">
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav className="flex items-center gap-1.5 text-xs text-slate-500 mr-3" aria-label="Breadcrumb">
          {breadcrumbs.map((crumb, i) => (
            <span key={i} className="flex items-center gap-1.5">
              {i > 0 && <span className="text-slate-600">/</span>}
              {crumb.href ? (
                <Link
                  href={crumb.href}
                  className="hover:text-slate-300 transition-colors focus-visible:ring-2 focus-visible:ring-blue-500 rounded px-0.5"
                >
                  {crumb.label}
                </Link>
              ) : (
                <span className="text-slate-400 font-medium">{crumb.label}</span>
              )}
            </span>
          ))}
        </nav>
      )}
      <h1 className="text-sm font-bold text-slate-100 tracking-tight">{title}</h1>
    </header>
  );
}
