'use client';

import { memo } from 'react';
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

  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX, sourceY, targetX, targetY,
    sourcePosition, targetPosition,
    borderRadius: 12,
  });

  const isAttack = d?.isAttackPath ?? false;

  return (
    <>
      {/* Glow layer for attack paths */}
      {isAttack && (
        <BaseEdge
          id={`${id}-glow`}
          path={edgePath}
          style={{
            stroke: '#EF4444',
            strokeWidth: 6,
            strokeOpacity: 0.15,
            filter: 'blur(3px)',
          }}
        />
      )}

      {/* Main edge */}
      <BaseEdge
        id={id}
        path={edgePath}
        markerEnd={markerEnd}
        style={{
          stroke: isAttack ? '#EF4444' : '#475569',
          strokeWidth: isAttack ? 2.5 : 1.5,
          strokeDasharray: isAttack ? '8 4' : undefined,
        }}
        className={isAttack ? 'edge--attack-path' : ''}
      />

      {/* Label */}
      {d?.label && (
        <EdgeLabelRenderer>
          <div
            className="absolute text-[10px] text-slate-400 px-2 py-0.5 rounded-md
              pointer-events-none flex items-center gap-1"
            style={{
              transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
              backgroundColor: 'rgba(15, 23, 42, 0.92)',
              backdropFilter: 'blur(8px)',
              border: isAttack ? '1px solid rgba(239, 68, 68, 0.3)' : '1px solid rgba(51, 65, 85, 0.5)',
              boxShadow: isAttack
                ? '0 0 8px rgba(239, 68, 68, 0.15), 0 2px 4px rgba(0,0,0,0.2)'
                : '0 2px 4px rgba(0,0,0,0.2)',
              color: isAttack ? '#FCA5A5' : undefined,
            }}
          >
            {d.encrypted === true && <Lock className="w-2.5 h-2.5 text-green-400" />}
            {d.encrypted === false && <Unlock className="w-2.5 h-2.5 text-slate-500" />}
            {d.validated === false && <AlertTriangle className="w-2.5 h-2.5 text-amber-400" />}
            {d.validated === true && <Check className="w-2.5 h-2.5 text-green-400" />}
            <span className="font-medium">{d.label}</span>
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
}

export const DataFlowEdge = memo(DataFlowEdgeInner);
