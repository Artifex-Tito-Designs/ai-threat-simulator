'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Map, FlaskConical, ClipboardList } from '@/components/ui/Icons';
import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';

const navItems: { href: string; label: string; Icon: LucideIcon }[] = [
  { href: '/', label: 'Dashboard', Icon: LayoutDashboard },
  { href: '/scenarios', label: 'Scenarios', Icon: Map },
  { href: '/playground', label: 'Playground', Icon: FlaskConical },
  { href: '/assessments', label: 'Assessments', Icon: ClipboardList },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-56 bg-[#0B1120] border-r border-slate-800 flex flex-col h-full">
      {/* Logo */}
      <div className="px-4 py-5 border-b border-slate-800 bg-gradient-to-b from-slate-800/30 to-transparent">
        <h1 className="text-base font-bold text-slate-100 tracking-tight">
          AI Threat Simulator
        </h1>
        <p className="text-[10px] text-slate-500 mt-0.5 uppercase tracking-widest">
          Security Training Platform
        </p>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href ||
            (item.href !== '/' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'relative flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-all duration-200',
                isActive
                  ? 'bg-blue-500/10 text-blue-400'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              )}
            >
              {isActive && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-blue-400" />
              )}
              <item.Icon className="w-4 h-4 shrink-0" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-slate-800">
        <p className="text-[10px] text-slate-600">
          Training tool only. No production data.
        </p>
      </div>
    </aside>
  );
}
