'use client';

import { memo, useState } from 'react';
import {
  BaseEdge,
  EdgeLabelRenderer,
  getSmoothStepPath,
  type EdgeProps,
} from '@xyflow/react';
import { Lock, Unlock, AlertTriangle, Check } from '@/components/ui/Icons';

function DataFlowEdgeInner({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
  markerEnd,
}: EdgeProps) {
  const d = data as {
    label?: string;
    encrypted?: boolean;
    validated?: boolean;
    isAttackPath?: boolean;
  } | undefined;

  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);

  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX, sourceY, targetX, targetY,
    sourcePosition, targetPosition,
    borderRadius: 16,
  });

  const isAttack = d?.isAttackPath ?? false;
  const showLabel = hovered || clicked || isAttack;

  return (
    <>
      {/* Glow layer for attack paths */}
      {isAttack && (
        <BaseEdge
          id={`${id}-glow`}
          path={edgePath}
          style={{
            stroke: '#EF4444',
            strokeWidth: 8,
            strokeOpacity: 0.12,
            filter: 'blur(4px)',
          }}
        />
      )}

      {/* Invisible wide hit area for hover/click */}
      <BaseEdge
        id={`${id}-hitarea`}
        path={edgePath}
        style={{
          stroke: 'transparent',
          strokeWidth: 20,
          cursor: 'pointer',
        }}
        interactionWidth={20}
      />

      {/* Main visible edge */}
      <BaseEdge
        id={id}
        path={edgePath}
        markerEnd={markerEnd}
        style={{
          stroke: isAttack ? '#EF4444' : hovered ? '#64748B' : '#334155',
          strokeWidth: isAttack ? 2.5 : hovered ? 2 : 1.5,
          strokeDasharray: isAttack ? '8 4' : undefined,
          transition: 'stroke 150ms, stroke-width 150ms',
        }}
        className={isAttack ? 'edge--attack-path' : ''}
      />

      {/* Hover/click zone overlay */}
      {d?.label && (
        <EdgeLabelRenderer>
          {/* Invisible hover target */}
          <div
            className="absolute"
            style={{
              transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
              width: 40,
              height: 40,
              cursor: 'pointer',
            }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => { setHovered(false); setClicked(false); }}
            onClick={(e) => { e.stopPropagation(); setClicked(!clicked); }}
          />

          {/* Label — only visible on hover or click */}
          {showLabel && (
            <div
              className="absolute text-[11px] px-3 py-1.5 rounded-lg
                flex items-center gap-1.5 pointer-events-none
                animate-in fade-in duration-150"
              style={{
                transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
                backgroundColor: 'rgba(15, 23, 42, 0.95)',
                backdropFilter: 'blur(8px)',
                border: isAttack
                  ? '1px solid rgba(239, 68, 68, 0.4)'
                  : '1px solid rgba(71, 85, 105, 0.6)',
                boxShadow: isAttack
                  ? '0 0 12px rgba(239, 68, 68, 0.2), 0 4px 8px rgba(0,0,0,0.3)'
                  : '0 4px 12px rgba(0,0,0,0.4)',
                color: isAttack ? '#FCA5A5' : '#CBD5E1',
                maxWidth: clicked ? 300 : 200,
                whiteSpace: clicked ? 'normal' : 'nowrap',
                zIndex: 50,
              }}
            >
              {d.encrypted === true && <Lock className="w-3 h-3 text-green-400 shrink-0" />}
              {d.encrypted === false && <Unlock className="w-3 h-3 text-slate-500 shrink-0" />}
              {d.validated === false && <AlertTriangle className="w-3 h-3 text-amber-400 shrink-0" />}
              {d.validated === true && <Check className="w-3 h-3 text-green-400 shrink-0" />}
              <span className="font-medium">{d.label}</span>
            </div>
          )}
        </EdgeLabelRenderer>
      )}
    </>
  );
}

export const DataFlowEdge = memo(DataFlowEdgeInner);
