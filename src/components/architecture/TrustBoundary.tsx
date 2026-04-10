'use client';

import { memo } from 'react';

const boundaryColors: Record<string, string> = {
  network: '#EF4444',
  auth: '#F59E0B',
  privilege: '#A855F7',
  'data-classification': '#3B82F6',
};

const boundaryIcons: Record<string, string> = {
  network: '🔒',
  auth: '🔑',
  privilege: '⚡',
  'data-classification': '📊',
};

/* eslint-disable @typescript-eslint/no-explicit-any */
function TrustBoundaryInner({ data }: any) {
  const d = data as { label?: string; boundaryType?: string; width?: number; height?: number };
  const color = boundaryColors[d.boundaryType ?? 'network'] ?? '#64748B';
  const icon = boundaryIcons[d.boundaryType ?? 'network'] ?? '🔒';

  return (
    <div
      className="rounded-xl"
      style={{
        width: d.width ?? 400,
        height: d.height ?? 300,
        border: `1.5px dashed ${color}40`,
        backgroundColor: `${color}04`,
        padding: '40px 20px 20px',
        position: 'relative',
        boxShadow: `inset 0 0 30px ${color}06`,
      }}
    >
      {/* Label badge */}
      <span
        className="absolute top-2.5 left-3 text-[9px] font-semibold uppercase tracking-widest
          px-2.5 py-1 rounded-md flex items-center gap-1.5"
        style={{
          color,
          backgroundColor: `${color}10`,
          border: `1px solid ${color}15`,
          letterSpacing: '0.1em',
        }}
      >
        <span className="text-[8px]">{icon}</span>
        {d.label}
      </span>

      {/* Corner accents */}
      <div
        className="absolute top-0 left-0 w-4 h-4 rounded-tl-xl"
        style={{ borderTop: `2px solid ${color}50`, borderLeft: `2px solid ${color}50` }}
      />
      <div
        className="absolute top-0 right-0 w-4 h-4 rounded-tr-xl"
        style={{ borderTop: `2px solid ${color}50`, borderRight: `2px solid ${color}50` }}
      />
      <div
        className="absolute bottom-0 left-0 w-4 h-4 rounded-bl-xl"
        style={{ borderBottom: `2px solid ${color}50`, borderLeft: `2px solid ${color}50` }}
      />
      <div
        className="absolute bottom-0 right-0 w-4 h-4 rounded-br-xl"
        style={{ borderBottom: `2px solid ${color}50`, borderRight: `2px solid ${color}50` }}
      />
    </div>
  );
}

export const TrustBoundaryNode = memo(TrustBoundaryInner);
