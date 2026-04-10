'use client';

interface HeaderProps {
  title: string;
  breadcrumbs?: { label: string; href?: string }[];
}

export function Header({ title, breadcrumbs }: HeaderProps) {
  return (
    <header className="h-12 border-b border-slate-700 bg-[#0F172A] px-6 flex items-center shrink-0">
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav className="flex items-center gap-1.5 text-xs text-slate-500 mr-4">
          {breadcrumbs.map((crumb, i) => (
            <span key={i} className="flex items-center gap-1.5">
              {i > 0 && <span>/</span>}
              {crumb.href ? (
                <a href={crumb.href} className="hover:text-slate-300 transition-colors">
                  {crumb.label}
                </a>
              ) : (
                <span className="text-slate-400">{crumb.label}</span>
              )}
            </span>
          ))}
        </nav>
      )}
      <h1 className="text-sm font-semibold text-slate-200">{title}</h1>
    </header>
  );
}
