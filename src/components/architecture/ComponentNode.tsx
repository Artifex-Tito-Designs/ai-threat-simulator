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

  const bgColor = isCompromised ? 'rgba(69, 10, 10, 0.85)'
    : isTargeted ? 'rgba(66, 32, 6, 0.85)'
    : isDefended ? 'rgba(5, 46, 22, 0.85)'
    : `${colors.bg}CC`;

  return (
    <div
      className={`component-node relative rounded-xl border-2 px-6 py-5 min-w-[280px] max-w-[320px] cursor-pointer
        shadow-lg shadow-black/40
        transition-all duration-200 hover:scale-[1.04] hover:shadow-xl hover:shadow-black/50
        focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1 focus-visible:ring-offset-[#0F172A]
        ${stateClass} ${opacity}`}
      style={{
        borderColor,
        backgroundColor: bgColor,
        backdropFilter: 'blur(12px) saturate(150%)',
        WebkitBackdropFilter: 'blur(12px) saturate(150%)',
      }}
      onClick={() => d.onClick?.()}
      role="button"
      tabIndex={0}
      aria-label={`${d.label} - ${d.trustLevel} - ${vulnCount} vulnerabilities`}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') d.onClick?.(); }}
    >
      {/* Inner glow overlay for active states */}
      {(isCompromised || isTargeted || isDefended) && (
        <div
          className="absolute inset-0 rounded-xl pointer-events-none"
          style={{
            background: `radial-gradient(ellipse at center, ${borderColor}10 0%, transparent 70%)`,
          }}
        />
      )}

      {/* Handles */}
      <Handle
        type="target"
        position={Position.Left}
        className="!w-2.5 !h-2.5 !rounded-full !border-2 !shadow-sm"
        style={{
          backgroundColor: '#0F172A',
          borderColor: colors.border,
          boxShadow: `0 0 4px ${colors.border}40`,
        }}
      />
      <Handle
        type="source"
        position={Position.Right}
        className="!w-2.5 !h-2.5 !rounded-full !border-2 !shadow-sm"
        style={{
          backgroundColor: '#0F172A',
          borderColor: colors.border,
          boxShadow: `0 0 4px ${colors.border}40`,
        }}
      />

      {/* Node type icon + label */}
      <div className="relative flex items-center gap-3 mb-3">
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
          style={{
            backgroundColor: `${colors.border}15`,
            boxShadow: `inset 0 0 0 1px ${colors.border}20`,
          }}
        >
          <NodeTypeIcon
            type={d.type ?? 'component'}
            className="w-5 h-5"
            style={{ color: colors.border }}
          />
        </div>
        <span className="text-[15px] font-semibold text-slate-50 leading-snug">
          {d.label}
        </span>
      </div>

      {/* Description */}
      <p className="relative text-[13px] text-slate-400 leading-relaxed line-clamp-2 mb-2">
        {d.description}
      </p>

      {/* Trust level indicator bar */}
      <div className="relative flex items-center gap-2 mt-3 pt-2.5 border-t border-white/5">
        <div
          className="w-2 h-2 rounded-full"
          style={{ backgroundColor: colors.border }}
        />
        <span className="text-[11px] text-slate-500 uppercase tracking-wider font-medium">
          {d.trustLevel}
        </span>
      </div>

      {/* Vulnerability badge */}
      {vulnCount > 0 && (
        <span
          className="absolute -top-2.5 -right-2.5 text-white text-[10px] font-bold
            rounded-full w-5.5 h-5.5 flex items-center justify-center
            border border-red-500/60"
          style={{
            backgroundColor: 'rgba(220, 38, 38, 0.9)',
            boxShadow: '0 0 10px rgba(239, 68, 68, 0.4), 0 2px 4px rgba(0,0,0,0.3)',
            width: 22,
            height: 22,
          }}
          aria-label={`${vulnCount} vulnerabilities`}
        >
          {vulnCount}
        </span>
      )}

      {/* Defended shield */}
      {isDefended && (
        <span
          className="absolute -top-2.5 -left-2.5 rounded-full flex items-center justify-center
            border border-green-500/60"
          style={{
            backgroundColor: 'rgba(22, 163, 74, 0.9)',
            boxShadow: '0 0 10px rgba(34, 197, 94, 0.4), 0 2px 4px rgba(0,0,0,0.3)',
            width: 22,
            height: 22,
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
