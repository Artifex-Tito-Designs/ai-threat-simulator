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
  const opacity = dimmed ? 'opacity-20' : 'opacity-100';

  const isCompromised = state === 'compromised';
  const isTargeted = state === 'targeted';
  const isDefended = state === 'defended';

  const borderColor = isCompromised ? '#EF4444'
    : isTargeted ? '#F59E0B'
    : isDefended ? '#22C55E'
    : colors.border;

  const bgColor = isCompromised ? 'rgba(69, 10, 10, 0.9)'
    : isTargeted ? 'rgba(66, 32, 6, 0.9)'
    : isDefended ? 'rgba(5, 46, 22, 0.9)'
    : `${colors.bg}E6`;

  return (
    <div
      className={`component-node relative rounded-xl border-2 px-4 py-3 cursor-pointer
        shadow-lg shadow-black/40
        transition-all duration-200 hover:scale-[1.03] hover:shadow-xl hover:shadow-black/50
        focus-visible:ring-2 focus-visible:ring-blue-500
        ${stateClass} ${opacity}`}
      style={{
        borderColor,
        backgroundColor: bgColor,
        backdropFilter: 'blur(12px) saturate(150%)',
        WebkitBackdropFilter: 'blur(12px) saturate(150%)',
        width: 220,
      }}
      onClick={() => d.onClick?.()}
      role="button"
      tabIndex={0}
      aria-label={`${d.label} - ${d.trustLevel} - ${vulnCount} vulnerabilities`}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') d.onClick?.(); }}
    >
      {/* Inner glow for active states */}
      {(isCompromised || isTargeted || isDefended) && (
        <div
          className="absolute inset-0 rounded-xl pointer-events-none"
          style={{ background: `radial-gradient(ellipse at center, ${borderColor}10 0%, transparent 70%)` }}
        />
      )}

      {/* Handles */}
      <Handle
        type="target"
        position={Position.Top}
        className="!w-3 !h-3 !rounded-full !border-2 !-top-1.5"
        style={{ backgroundColor: '#0F172A', borderColor: colors.border, boxShadow: `0 0 4px ${colors.border}40` }}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="!w-3 !h-3 !rounded-full !border-2 !-bottom-1.5"
        style={{ backgroundColor: '#0F172A', borderColor: colors.border, boxShadow: `0 0 4px ${colors.border}40` }}
      />

      {/* Icon + Name */}
      <div className="relative flex items-center gap-3">
        <div
          className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
          style={{ backgroundColor: `${colors.border}15`, boxShadow: `inset 0 0 0 1px ${colors.border}20` }}
        >
          <NodeTypeIcon type={d.type ?? 'component'} className="w-4.5 h-4.5" style={{ color: colors.border }} />
        </div>
        <div className="flex-1 min-w-0">
          <span className="text-[13px] font-semibold text-slate-50 leading-tight block">
            {d.label}
          </span>
          <div className="flex items-center gap-1.5 mt-1">
            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: colors.border }} />
            <span className="text-[10px] text-slate-500 uppercase tracking-wider font-medium">
              {d.trustLevel}
            </span>
          </div>
        </div>
      </div>

      {/* Vulnerability badge */}
      {vulnCount > 0 && (
        <span
          className="absolute -top-2 -right-2 text-white text-[10px] font-bold
            rounded-full flex items-center justify-center border border-red-500/60"
          style={{
            backgroundColor: 'rgba(220, 38, 38, 0.9)',
            boxShadow: '0 0 10px rgba(239, 68, 68, 0.4), 0 2px 4px rgba(0,0,0,0.3)',
            width: 20, height: 20,
          }}
          aria-label={`${vulnCount} vulnerabilities`}
        >
          {vulnCount}
        </span>
      )}

      {/* Defended shield */}
      {isDefended && (
        <span
          className="absolute -top-2 -left-2 rounded-full flex items-center justify-center border border-green-500/60"
          style={{
            backgroundColor: 'rgba(22, 163, 74, 0.9)',
            boxShadow: '0 0 10px rgba(34, 197, 94, 0.4), 0 2px 4px rgba(0,0,0,0.3)',
            width: 20, height: 20,
          }}
          aria-label="Defended"
        >
          <Shield className="w-3 h-3 text-white" />
        </span>
      )}
    </div>
  );
}

export const ComponentNode = memo(ComponentNodeInner);
