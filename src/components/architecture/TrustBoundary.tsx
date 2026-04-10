'use client';

import { memo } from 'react';

const boundaryColors: Record<string, string> = {
  network: '#EF4444',
  auth: '#F59E0B',
  privilege: '#A855F7',
  'data-classification': '#3B82F6',
};

/* eslint-disable @typescript-eslint/no-explicit-any */
function TrustBoundaryInner({ data }: any) {
  const d = data as { label?: string; boundaryType?: string; width?: number; height?: number };
  const color = boundaryColors[d.boundaryType ?? 'network'] ?? '#64748B';

  return (
    <div
      className="rounded-lg"
      style={{
        width: d.width ?? 400,
        height: d.height ?? 300,
        border: `2px dashed ${color}`,
        backgroundColor: 'transparent',
        padding: '40px 20px 20px',
        position: 'relative',
      }}
    >
      <span
        className="absolute top-2 left-3 text-[10px] font-medium uppercase tracking-wider px-2 py-0.5 rounded"
        style={{ color, backgroundColor: `${color}15` }}
      >
        {d.label}
      </span>
    </div>
  );
}

export const TrustBoundaryNode = memo(TrustBoundaryInner);
