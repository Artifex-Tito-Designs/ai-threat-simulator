'use client';

import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import type { ArchitectureNode, NodeState } from '@/lib/types';
import { trustColors, nodeStateStyles } from '@/lib/utils';
import { NodeTypeIcon, Shield } from '@/components/ui/Icons';

type ComponentNodeData = ArchitectureNode & {
  state?: NodeState;
  isHighlighted?: boolean;
  vulnerabilityCount?: number;
  onClick?: () => void;
};

/* eslint-disable @typescript-eslint/no-explicit-any */
function ComponentNodeInner({ data }: any) {
  const d = data as ComponentNodeData;
  const colors = trustColors[d.trustLevel ?? 'trusted'];
  const state = d.state ?? 'normal';
  const isHighlighted = d.isHighlighted ?? false;
  const vulnCount = d.vulnerabilityCount ?? d.vulnerabilities?.length ?? 0;
  const stateClass = nodeStateStyles[state];

  const dimmed = !isHighlighted && d.isHighlighted !== undefined;
  const opacity = dimmed ? 'opacity-25' : 'opacity-100';

  const borderColor = state === 'compromised' ? '#EF4444'
    : state === 'targeted' ? '#F59E0B'
    : state === 'defended' ? '#22C55E'
    : colors.border;

  const bgColor = state === 'compromised' ? 'rgba(69, 10, 10, 0.8)'
    : state === 'targeted' ? 'rgba(66, 32, 6, 0.8)'
    : state === 'defended' ? 'rgba(5, 46, 22, 0.8)'
    : `${colors.bg}CC`;

  return (
    <div
      className={`relative rounded-lg border-2 px-4 py-3 min-w-[180px] max-w-[220px] cursor-pointer
        backdrop-blur-sm shadow-lg shadow-black/30
        transition-all duration-200 hover:scale-[1.03] hover:shadow-xl hover:shadow-black/40
        focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1 focus-visible:ring-offset-[#0F172A]
        ${stateClass} ${opacity}`}
      style={{ borderColor, backgroundColor: bgColor }}
      onClick={() => d.onClick?.()}
      role="button"
      tabIndex={0}
      aria-label={`${d.label} - ${d.trustLevel} - ${vulnCount} vulnerabilities`}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') d.onClick?.(); }}
    >
      <Handle
        type="target"
        position={Position.Left}
        className="!w-2.5 !h-2.5 !rounded-full !border-2"
        style={{ backgroundColor: '#0F172A', borderColor: colors.border }}
      />
      <Handle
        type="source"
        position={Position.Right}
        className="!w-2.5 !h-2.5 !rounded-full !border-2"
        style={{ backgroundColor: '#0F172A', borderColor: colors.border }}
      />

      <div className="flex items-center gap-2 mb-1.5">
        <div
          className="w-7 h-7 rounded flex items-center justify-center shrink-0"
          style={{ backgroundColor: `${colors.border}20` }}
        >
          <NodeTypeIcon type={d.type ?? 'component'} className="w-4 h-4" style={{ color: colors.border }} />
        </div>
        <span className="text-sm font-semibold text-slate-100 leading-tight">{d.label}</span>
      </div>

      <p className="text-[11px] text-slate-400 leading-snug line-clamp-2">{d.description}</p>

      {vulnCount > 0 && (
        <span
          className="absolute -top-2 -right-2 bg-red-600/90 text-white text-[10px] font-bold
            rounded-full w-5 h-5 flex items-center justify-center shadow-md shadow-red-900/50
            border border-red-500/50"
          aria-label={`${vulnCount} vulnerabilities`}
        >
          {vulnCount}
        </span>
      )}

      {state === 'defended' && (
        <span className="absolute -top-2 -left-2 w-5 h-5 bg-green-600/90 rounded-full flex items-center justify-center
          shadow-md shadow-green-900/50 border border-green-500/50" aria-label="Defended">
          <Shield className="w-3 h-3 text-white" />
        </span>
      )}
    </div>
  );
}

export const ComponentNode = memo(ComponentNodeInner);
